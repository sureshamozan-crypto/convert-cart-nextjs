import {
   PackageSearch
} from "lucide-react";


export function NoProduct() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
          <PackageSearch className="w-12 h-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            No products found
          </h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting filters or adding new products.
          </p>
        </div>
  );
}