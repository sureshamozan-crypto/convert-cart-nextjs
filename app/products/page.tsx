import ProductsPageClient  from "@/app/products/components/productList";

export default async function ProductsPage() {
 // ✅ Get base API URL from .env
 const PRODUCT_API_URL = process.env.NEXT_PUBLIC_PRODUCT_API;

  // ✅ Fetch data on the server (SSR)
  const res = await fetch(`${PRODUCT_API_URL}?page=1&limit=100`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch products");

  const data = await res.json();
  const products = data?.data || [];

  // ✅ Pass data to the client component as props
  return <ProductsPageClient initialProducts={products} />;
}
