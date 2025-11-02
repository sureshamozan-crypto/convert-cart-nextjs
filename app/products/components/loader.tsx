import {
  Loader2
} from "lucide-react";


export function LoaderV1() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
          <p className="text-muted-foreground text-sm">Loading products...</p>
        </div>
  );
}