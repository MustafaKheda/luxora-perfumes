import { constants, readFileSync } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";
import { eq, inArray } from "drizzle-orm";

type CliOptions = {
  force: boolean;
  limit: number | null;
  slugs: string[];
};

async function main() {
  loadEnv();

  const options = parseCliOptions(process.argv.slice(2));
  const { db, sqlClient } = await import("@/lib/db");
  const { products } = await import("@/lib/db/schema");
  const { cloudinary, assertCloudinaryConfig } = await import("@/lib/cloudinary");

  assertCloudinaryConfig();

  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "scentora/products";
  const selectedSlugs = new Set(options.slugs);

  const baseQuery = db
    .select({
      id: products.id,
      slug: products.slug,
      image: products.image,
      imagePublicId: products.imagePublicId,
    })
    .from(products);

  const rows =
    selectedSlugs.size > 0
      ? await baseQuery.where(inArray(products.slug, Array.from(selectedSlugs)))
      : await baseQuery;

  if (rows.length === 0) {
    console.log("No products found for upload.");
    await sqlClient.end();
    return;
  }

  let inspected = 0;
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  try {
    for (const row of rows) {
      inspected += 1;

      if (options.limit !== null && uploaded >= options.limit) {
        console.log(`Reached upload limit (${options.limit}).`);
        break;
      }

      if (!options.force && isRemoteUrl(row.image)) {
        skipped += 1;
        console.log(`- Skip ${row.slug}: image already points to remote URL`);
        continue;
      }

      if (!options.force && row.imagePublicId) {
        skipped += 1;
        console.log(`- Skip ${row.slug}: image_public_id already exists`);
        continue;
      }

      const localPath = resolveLocalImagePath(row.image);

      if (!localPath) {
        skipped += 1;
        console.log(`- Skip ${row.slug}: unsupported image path "${row.image}"`);
        continue;
      }

      const absolutePath = path.join(process.cwd(), "public", localPath);
      const fileExists = await exists(absolutePath);

      if (!fileExists) {
        failed += 1;
        console.log(`- Fail ${row.slug}: local file missing at ${absolutePath}`);
        continue;
      }

      const uploadResult = await cloudinary.uploader.upload(absolutePath, {
        folder,
        public_id: row.slug,
        overwrite: true,
        resource_type: "image",
      });

      await db
        .update(products)
        .set({
          image: uploadResult.secure_url,
          imagePublicId: uploadResult.public_id,
          updatedAt: new Date(),
        })
        .where(eq(products.id, row.id));

      uploaded += 1;
      console.log(`+ Uploaded ${row.slug} -> ${uploadResult.secure_url}`);
    }
  } finally {
    await sqlClient.end();
  }

  console.log("");
  console.log("Upload summary");
  console.log(`- inspected: ${inspected}`);
  console.log(`- uploaded: ${uploaded}`);
  console.log(`- skipped: ${skipped}`);
  console.log(`- failed: ${failed}`);
}

function parseCliOptions(args: string[]): CliOptions {
  let force = false;
  let limit: number | null = null;
  const slugs: string[] = [];

  for (const arg of args) {
    if (arg === "--force") {
      force = true;
      continue;
    }

    if (arg.startsWith("--limit=")) {
      const value = Number(arg.slice("--limit=".length));

      if (!Number.isInteger(value) || value < 1) {
        throw new Error(`Invalid --limit value: ${arg}`);
      }

      limit = value;
      continue;
    }

    if (arg.startsWith("--slug=")) {
      const slug = arg.slice("--slug=".length).trim();

      if (!slug) {
        throw new Error(`Invalid --slug value: ${arg}`);
      }

      slugs.push(slug);
      continue;
    }

    throw new Error(
      `Unknown argument "${arg}". Supported: --force, --limit=<n>, --slug=<slug>`,
    );
  }

  return {
    force,
    limit,
    slugs,
  };
}

function resolveLocalImagePath(value: string) {
  if (!value.startsWith("/")) {
    return null;
  }

  const withoutQuery = value.split("?")[0];
  return withoutQuery.replace(/^\/+/, "");
}

function isRemoteUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

async function exists(filePath: string) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function loadEnv() {
  const content = readFileSync(".env", "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex);
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    process.env[key] ??= value;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
