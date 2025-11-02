"use client";

import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import type { RootState } from "@/app/store";
import { resetFilters, toggleDialog } from "@/app/store/slices/filterSlice";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutList, TableIcon, XCircle , Eye, Pencil, Trash2} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PageTitle } from "@/app/products/components/header";
import { LoaderV1 } from "@/app/products/components/loader";
import { NoProduct } from "@/app/products/components/noProductV1";
import { ProductFilterDialog } from "@/app/products/components/product-filter";
import { TableHeaderV1 } from "@/app/products/components/tableHeader";

export default function ProductsPage({ initialProducts }: { initialProducts: any[] }) {
  const [viewMode, setViewMode] = useState<"table" | "list">("table");
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filters = useSelector((state: RootState) => state.filters.filters);
  const dispatch = useDispatch();

  const PRODUCT_API_URL = process.env.NEXT_PUBLIC_PRODUCT_API;
  const SEGMENT_API_URL = process.env.NEXT_PUBLIC_SEGMENT_API;

  // Pagination logic
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const visibleProducts = products.slice(startIndex, endIndex);
  const totalPages = Math.ceil(products.length / pageSize);

  // ✅ Fetch all products
async function fetchProducts() {
  try {
    toast("Fetching products...", {
      description: "Please wait while we load all products.",
    });

    const res = await fetch(`${PRODUCT_API_URL}`);
    const data = await res.json();

    if (data.success && Array.isArray(data.data)) {
      setProducts(data.data);

      toast.success("✅ Products loaded successfully!", {
        description: `Showing ${data.data.length} products.`,
      });
    } else {
      console.warn("Unexpected API response:", data);
      toast.warning("⚠️ Unexpected API response.", {
        description: "The server returned an invalid response format.",
      });
    }
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    toast.error("❌ Failed to fetch products.", {
      description: "Please check your network connection or API server.",
    });
  } finally {
    setLoading(false);
  }
}

// ✅ Initial load
useEffect(() => {
  setLoading(false);
  dispatch(toggleDialog(true));
}, [dispatch]);

// ✅ Fetch filtered data
useEffect(() => {
  const fetchFilteredData = async () => {
    try {
      if (!filters || Object.keys(filters).length === 0) return;

      setProducts([]);
      setLoading(true);

      toast("🔍 Applying filters...", {
        description: "Please wait while we fetch filtered products.",
      });

      const encodedFilters = encodeURIComponent(JSON.stringify(filters));
      const response = await fetch(`${SEGMENT_API_URL}?filters=${encodedFilters}`);
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);

        toast.success("🎯 Filters applied successfully!", {
          description: `Found ${data.data.length} matching products.`,
        });
      } else {
        console.warn("Unexpected API response:", data);
        setProducts([]);
        toast.warning("⚠️ Unexpected response.", {
          description: "Filter results are empty or malformed.",
        });
      }
    } catch (error) {
      console.error("❌ Error fetching filtered data:", error);
      setProducts([]);
      toast.error("❌ Failed to apply filters.", {
        description: "Please check your connection or filter syntax.",
      });
    } finally {
      setLoading(false);
    }
  };

  fetchFilteredData();
}, [filters]);

// ✅ Clear filters
const handleShowAll = async () => {
  dispatch(resetFilters());
  dispatch(toggleDialog(true));
  await fetchProducts();

  toast("🔄 Filters cleared", {
    description: "All products are now visible.",
  });
};

function handleView(product: any) {
  toast("👁 Viewing product details", {
    description: `${product.title} (${product.category})`,
  });
}

function handleEdit(product: any) {
  toast.info("✏️ Editing product", {
    description: `Product: ${product.title}`,
  });
  // You can open an edit modal or redirect here
}

async function handleDelete(id: string) {
  const confirmDelete = confirm("Are you sure you want to delete this product?");
  if (!confirmDelete) return;

  try {
    toast.success("🗑 Product deleted successfully");
    // Refresh product list
  } catch (err) {
    toast.error("❌ Failed to delete product", {
      description: "Please try again later.",
    });
  }
}

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 flex flex-col h-screen">
      {/* 🧭 Header Section */}
      <div className="flex items-center justify-between w-full flex-wrap gap-2 sm:gap-4">
        <PageTitle title="Products" subtitle="Manage and view all available products" />

        <TooltipProvider>
          <div className="flex items-center gap-2 shrink-0">
            {/* Table View */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  onClick={() => setViewMode("table")}
                  aria-label="Table View"
                  className={`text-white bg-gradient-to-r from-primary to-purple-600 
                    hover:from-primary/90 hover:to-purple-700
                    shadow-sm hover:shadow-lg hover:-translate-y-[1px]
                    transition-all duration-300 ease-in-out rounded-md border border-border
                    ${viewMode === "table" ? "" : "opacity-70 hover:opacity-100"}`}
                >
                  <TableIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Table View</TooltipContent>
            </Tooltip>

            {/* List View */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  onClick={() => setViewMode("list")}
                  aria-label="List View"
                  className="text-white bg-gradient-to-r from-primary to-purple-600
                    hover:from-fuchsia-600 hover:to-indigo-500 shadow-sm
                    hover:shadow-[0_0_12px_rgba(147,51,234,0.4)]
                    hover:-translate-y-[1.5px] transition-all duration-500 ease-out 
                    rounded-md border border-border"
                >
                  <LayoutList className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Card View</TooltipContent>
            </Tooltip>

            <ProductFilterDialog />
          </div>
        </TooltipProvider>
      </div>

      {/* 🧾 Main Content */}
      {loading ? (
        <LoaderV1 />
      ) : products.length === 0 ? (
        <NoProduct />
      ) : (
        <>
          {/* ✅ Table Controls */}
          <div className="flex items-center justify-between -mt-4 mb-2 w-full">
            {/* Left Side — Clear Filters */}
            <div className="flex items-center gap-2">
              {Object.keys(filters).length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleShowAll}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium
                          text-white bg-gradient-to-r from-primary to-purple-600
                          hover:from-primary/90 hover:to-purple-700 rounded-md border border-border shadow-sm
                          hover:shadow-lg hover:-translate-y-[1px] transition-all duration-300 ease-in-out"
                      >
                        <XCircle className="h-3.5 w-3.5 opacity-90 transition-transform duration-300 group-hover:rotate-90" />
                        Clear
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Clear all filter conditions</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {/* ✅ Right Side — Page Size Selector + Info */}
            <div className="flex items-center justify-end flex-wrap gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5">
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-7 w-[70px] sm:w-[90px] text-[11px] sm:text-xs">
                    <SelectValue placeholder="Rows" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground whitespace-nowrap leading-tight tracking-wide">
                Page{" "}
                <span className="font-medium text-foreground">{page}</span> of{" "}
                <span className="font-medium text-foreground">{totalPages}</span>
                {" • "}
                <span className="font-medium text-foreground">{products.length}</span> total
              </div>
            </div>
          </div>

          {/* ✅ Scrollable Table/List Section */}
          <div className="h-[70vh] w-full overflow-x-auto overflow-y-auto rounded-md border bg-background shadow-sm">
            <AnimatePresence mode="wait">
              {viewMode === "table" ? (
                <motion.div
                  key="table"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl border bg-card shadow-md overflow-hidden min-w-[850px]"
                >
                  <Table>
                    <TableHeaderV1 />
                    <TableBody>
                      {visibleProducts.map((p) => (
                        <TableRow key={p._id} className="hover:bg-muted/40">
                          <TableCell>{p.id}</TableCell>
                          <TableCell className="font-medium text-foreground">{p.title}</TableCell>
                          <TableCell>{p.category || "—"}</TableCell>

                          {/* Sale Badge */}
                          <TableCell>
                            {p.on_sale ? (
                              <Badge className="w-20 flex justify-center px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded-full shadow-sm hover:bg-green-700">
                                On Sale
                              </Badge>
                            ) : (
                              <Badge className="w-20 flex justify-center px-3 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full border border-gray-300">
                                No
                              </Badge>
                            )}
                          </TableCell>

                          {/* Price */}
                          <TableCell className="text-primary font-semibold">
                            ${Number(p.price).toFixed(2)}
                          </TableCell>

                          {/* Tags */}
                          <TableCell>
                            {p.tags && p.tags.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {p.tags.map((tag: string, i: number) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="px-2.5 py-[2px] text-xs font-medium rounded-full border border-border bg-gradient-to-r from-primary/10 to-purple-600/10 text-foreground shadow-sm"
                                  >
                                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">No tags</span>
                            )}
                          </TableCell>

                          {/* Stock Status */}
                          <TableCell>
                            <Badge
                              variant={p.stock_status === "instock" ? "default" : "secondary"}
                              className={`px-3 py-1 text-sm font-medium rounded-full ${
                                p.stock_status === "instock"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {p.stock_status.charAt(0).toUpperCase() + p.stock_status.slice(1)}
                            </Badge>
                          </TableCell>
                         
<TooltipProvider>
  <div className="flex items-center gap-2">
    {/* 🟦 View Button */}
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          className="h-8 w-8 rounded-md bg-gray-900 text-white hover:bg-gray-600 cursor-pointer active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={() => handleView(p)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">View</TooltipContent>
    </Tooltip>

    {/* 🟣 Edit Button */}
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          className="h-8 w-8 rounded-md bg-gray-900 text-white hover:bg-gray-600 cursor-pointer active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={() => handleEdit(p)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">Edit</TooltipContent>
    </Tooltip>

    {/* 🔴 Delete Button */}
    <Tooltip>
      <TooltipTrigger asChild>
      <Button
  size="icon"
  variant="default"
  className="h-8 w-8 rounded-md bg-gray-900 text-white hover:bg-gray-600 cursor-pointer active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
  onClick={() => handleDelete(p._id)}
>
  <Trash2 className="h-4 w-4" />
</Button>

      </TooltipTrigger>
      <TooltipContent side="top">Delete</TooltipContent>
    </Tooltip>
  </div>
</TooltipProvider>


                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </motion.div>
              ) : (
                <motion.div
                  key="cards"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-4"
                >
                  {visibleProducts.map((p) => (
                    <motion.div
                      key={p._id}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                     <Card
  className="group relative overflow-hidden border border-border/50 
  bg-gradient-to-br from-background via-card to-muted/40 
  rounded-2xl shadow-sm hover:shadow-[0_4px_25px_rgba(147,51,234,0.2)] 
  hover:-translate-y-[4px] hover:border-primary/70 transition-all duration-500 ease-in-out"
>
  {/* 🌈 Soft glowing gradient overlay */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-primary/10 via-purple-500/10 to-indigo-500/10 blur-xl" />

  <CardHeader className="pb-2 relative z-10">
    <CardTitle
      className="flex justify-between items-center text-lg font-semibold tracking-tight 
      text-foreground group-hover:text-primary transition-colors duration-300"
    >
      <span className="truncate max-w-[75%]">{p.title}</span>
      <Badge
        variant={p.stock_status === "instock" ? "default" : "secondary"}
        className={`px-2 py-1 text-xs rounded-lg border-0 shadow-sm ${
          p.stock_status === "instock"
            ? "bg-gradient-to-r from-green-500/90 to-emerald-600/90 text-white"
            : "bg-gradient-to-r from-gray-400/80 to-gray-500/80 text-white"
        }`}
      >
        {p.stock_status.charAt(0).toUpperCase() + p.stock_status.slice(1)}
      </Badge>
    </CardTitle>
  </CardHeader>

  <CardContent className="relative z-10 text-sm text-muted-foreground space-y-3 font-sans leading-relaxed">
    <div className="flex flex-col gap-1">
      <p>
        <span className="font-medium text-foreground/80">Category:</span>{" "}
        <span className="text-foreground">{p.category || "—"}</span>
      </p>
      <p>
        <span className="font-medium text-foreground/80">Price:</span>{" "}
        <span className="text-primary font-semibold tracking-wide">
          ${Number(p.price).toFixed(2)}
        </span>
      </p>
      <p>
        <span className="font-medium text-foreground/80">Tags:</span>{" "}
        <span className="italic text-foreground/70">
          {p.tags?.join(", ") || "—"}
        </span>
      </p>
    </div>

    {/* 💎 Stylish separator line */}
    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-2" />

    {/* ✨ Subtle bottom accent */}
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">Product ID: {p.id}</span>
      {p.on_sale && (
        <Badge className="px-2 py-[2px] text-[10px] rounded-full font-medium bg-pink-600/90 text-white shadow-sm hover:bg-pink-700">
          On Sale
        </Badge>
      )}
    </div>
  </CardContent>
</Card>

                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
