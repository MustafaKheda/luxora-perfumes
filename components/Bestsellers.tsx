import ProductCard from "./ProductCard";
import { getHomeBestSellers } from "@/lib/api/catalog";

const fallbackProducts = [
  {
    image: "/images/Perfume/30.webp",
    name: "Premium Men Scent",
    price: 50,
  },
  {
    image: "/images/Perfume/34.webp",
    name: "Premium Men Scent",
    price: 50,
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default async function BestSellers() {
  let items = fallbackProducts;

  try {
    const result = await getHomeBestSellers();
    if (result.data.length > 0) {
      items = result.data.map((product) => ({
        image: product.image,
        name: product.name,
        price: product.price,
      }));
    }
  } catch {
    // Keep static fallback when the database is unavailable during local builds.
  }

  return (
    <section aria-labelledby="best-sellers">
      <h2
        id="best-sellers"
        className="font-body font-medium text-[1rem] text-textPrimary mb-4"
      >
        Best Selling Product
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 max-w-[550px]">
        {items.map((product) => (
          <ProductCard
            key={product.image + product.name}
            img={product.image}
            title={product.name}
            price={formatPrice(product.price)}
          />
        ))}
      </div>
    </section>
  );
}
