import Image from "next/image";
import BuyButton from "./BuyButton";

interface ProductCardProps {
    image: string;
    name: string;
    notes: string;
    price: string;
    tag?: string;
    category?: string;
}

export default function ProductCardLarge({ image, name, notes, price, tag }: ProductCardProps) {
    return (
        <div
            className="rounded-soft  flex-1  flex flex-col hover:scale-[101%] transition-transform duration-300 "
            itemScope
            itemType="https://schema.org/Product"
        >
            <div className="relative ">
                <Image
                    src={image}
                    alt={`${name} perfume bottle`}
                    width={360}
                    height={360}
                    className="w-full h-[400px] object-cover rounded-2xl "
                    loading="lazy"
                    priority={false}
                />
                {tag && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {tag}
                    </span>
                )}
                <button
                    aria-label={`Add ${name} to cart`}
                    className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-sm hover:scale-105 transition-transform"
                >
                    🛍️
                </button>
                <div className="mt-3 absolute bottom-2 left-3   bg-white/10 backdrop-blur-md border border-white/20 
             rounded-lg p-2 shadow-md w-[90%] " itemProp="name">
                    <h3 className="text-[15px] font-semibold text-white">{name}</h3>
                    <p className="text-sm text-white" itemProp="description">
                        {notes}
                    </p>
                </div>
            </div>

            <BuyButton price={price} />
        </div>
    );
}
