// app/shop/[slug]/page.tsx
import { notFound } from "next/navigation";
import { PRODUCTS, BUNDLES } from "@/lib/products";
import ProductDetailClient from "@/components/shop/ProductDetailClient";

export default function ProductDetailPage({ params }: { params: { slug:string } }) {
    const allProducts = [...PRODUCTS, ...BUNDLES];
    const product = allProducts.find((p) => p.id === params.slug);

    if (!product) {
        notFound();
    }

    return <ProductDetailClient product={product} />;
}

// Generate static paths for all products
export async function generateStaticParams() {
    const allProducts = [...PRODUCTS, ...BUNDLES];
    return allProducts.map((product) => ({
        slug: product.id,
    }));
}
