  

export function FilterExample() {
  return (
  <p className="text-xs text-muted-foreground mt-2">
  <span className="font-semibold text-primary">Examples:</span>
  <div className="flex flex-wrap gap-1 mt-1">
    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium text-[11px]">
      category = Uncategorized
    </span>
    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium text-[11px]">
      on_sale = true
    </span>
    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium text-[11px]">
      price ≥ 100
    </span>
    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium text-[11px]">
      stock_quantity ≥ 10
    </span>
    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium text-[11px]">
      stock_status = instock
    </span>
    <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-medium text-[11px]">
      tags == Books
    </span>
    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium text-[11px]">
      title == "The Let Them Theory Book"
    </span>
  </div>
</p>
  );
}