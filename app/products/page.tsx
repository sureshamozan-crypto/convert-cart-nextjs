import ProductsPageClient  from "@/app/products/components/productList";

export default async function ProductsPage() {
  // ✅ Fetch data on the server (SSR)
  const res = await fetch("http://43.204.228.212/api/products?page=1&limit=100", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch products");

  const data = await res.json();
  const products = data?.data || [];

  // ✅ Pass data to the client component as props
  return <ProductsPageClient initialProducts={products} />;
}
