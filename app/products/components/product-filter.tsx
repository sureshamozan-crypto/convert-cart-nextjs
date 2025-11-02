"use client";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "@/app/store";
import {
  setFilterText,
  resetFilters,
  setFilters,
  toggleDialog,
} from "@/app/store/slices/filterSlice";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Filter, RotateCcw, FilterIcon } from "lucide-react";
import { FilterExample } from './filterExample'

// 🧠 Helper function to map operators to standard types
function mapOperator(op: string) {
  switch (op) {
    case ">":
      return "gt";
    case "<":
      return "lt";
    case ">=":
      return "gte";
    case "<=":
      return "lte";
    case "!=":
      return "notEquals";
    case "=":
    default:
      return "equals";
  }
}

export function ProductFilterDialog() {
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);
  const dialogIsClosed = useSelector(
    (state: RootState) => state.filters.dialogIsClosed
  );
  const dispatch = useDispatch();

  // ✅ Handle filter evaluation
  const handleEvaluate = async () => {
    console.log("✅ Evaluating Filters:\n", filterText);
    if (!filterText.trim()) return alert("Please enter at least one filter.");

    try {
      setLoading(true);

      // 1️⃣ Parse text into structured JSON filters
      const filters: Record<
        string,
        { type: string; value: string | number | string[] }
      > = {};

      const lines = filterText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      for (const line of lines) {
        // Match: field operator value  (supports =, ==, >=, <=, >, <)
        const match = line.match(/([^><=!]+)\s*([><=!]+)\s*(.*)/);
        if (!match) continue;

        const [, field, operator, rawValue] = match;
        let value: string | number | string[] = rawValue.trim();

        // Remove surrounding quotes from strings like "The Let Them Theory Book"
        if ((value as string).startsWith('"') && (value as string).endsWith('"')) {
          value = (value as string).slice(1, -1);
        }

        // Convert numeric strings to numbers
        if (!isNaN(Number(value)) && operator !== "==") {
          value = Number(value);
        }

        // ✅ Special handling for 'tags' (convert to array)
        if (field.trim() === "tags") {
          value = [(value as string).trim()];
        }

        filters[field.trim()] = { type: mapOperator(operator), value };
      }

      // 2️⃣ Dispatch to Redux and close dialog
      dispatch(setFilters(filters));
      toast.success("🎯 Filters applied successfully!", {
        description: "Your filter conditions have been evaluated.",
      });
      setTimeout(() => {
        setFilterText("");
        dispatch(toggleDialog(true)); // closes the dialog
      }, 500);
    } catch (err) {
      console.error("❌ Filter evaluation failed:", err);
      toast.error("❌ Something went wrong!", {
        description: "Unable to evaluate filters. Please check your syntax.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset filters
  const handleReset = () => {
    setFilterText("");
    dispatch(resetFilters());
    toast("🔄 Filters cleared", {
      description: "All applied filter conditions have been reset.",
    });
  };

  return (
    <TooltipProvider>
      <Dialog
        open={!dialogIsClosed} // dialog opens when false
        onOpenChange={(open) => dispatch(toggleDialog(!open))} // keeps Redux synced
      >
        {/* Filter Trigger Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                size="icon"
                aria-label="Filter"
                className="text-white bg-gradient-to-r from-primary to-purple-600
                           hover:from-fuchsia-600 hover:to-indigo-500
                           shadow-sm hover:shadow-[0_0_12px_rgba(147,51,234,0.4)]
                           hover:-translate-y-[1.5px]
                           transition-all duration-500 ease-out 
                           rounded-md border border-border"
              >
                <Filter className="h-5 w-5" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Open Filters</TooltipContent>
        </Tooltip>

        {/* Dialog Content */}
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-primary text-center">
              Define Filter Conditions
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* 📝 Filter Input Area */}
            <div className="space-y-2">
              <Label>Enter filter rules (one per line):</Label>

              <div className="p-[2px] rounded-md bg-gradient-to-r from-primary to-purple-600">
                <Textarea
                  placeholder={`price = 400\ncategory = Smartphones\nstock_status = instock\nbrand != Samsung\nrating >= 4.0`}
                  value={filterText}
                  onChange={(e) => {
                    let input = e.target.value;

                    // 🧠 Automatically insert newline between multiple conditions
                    // e.g. "price = 400 category = Drinks" → "price = 400\ncategory = Drinks"
                    input = input
                      .replace(
                        /([a-zA-Z_]+)\s*([><=!]+)\s*([\w.]+)\s+(?=[a-zA-Z_]+\s*[><=!]+)/g,
                        "$1 $2 $3\n"
                      )
                      .trimStart();

                    setFilterText(input);
                  }}
                  spellCheck={false}
                  className="resize-none font-mono text-sm h-32 
                             w-full rounded-md 
                             bg-background text-foreground
                             border-none outline-none
                             focus:ring-2 focus:ring-fuchsia-500 
                             transition-all duration-300 ease-out"
                />
              </div>

              <FilterExample />

            </div>

            {/* ⚙️ Action Buttons */}
            <div className="border-t border-border pt-4 mt-4 flex items-center justify-between">
              {/* Evaluate Filter */}
              <Button
                onClick={handleEvaluate}
                disabled={loading}
                className={`flex-1 flex items-center justify-center cursor-pointer 
                            text-white bg-gradient-to-r from-primary to-purple-600
                            hover:from-fuchsia-600 hover:to-indigo-500
                            shadow-sm hover:shadow-[0_0_12px_rgba(147,51,234,0.4)]
                            hover:-translate-y-[1px]
                            gap-2 px-3 py-2 rounded-md 
                            transition-all duration-500 ease-out
                            disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                <FilterIcon className="h-4 w-4" />
                {loading ? "Evaluating..." : "Evaluate Filter"}
              </Button>

              {/* Reset */}
              <Button
                onClick={handleReset}
                variant="secondary"
                size="sm"
                className="ml-3 flex items-center gap-1 px-3 py-1.5 cursor-pointer 
                           border border-border hover:bg-muted transition"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="text-sm">Reset</span>
              </Button>
            </div>

            {/* 🔣 Supported Operators */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <p className="text-sm font-semibold mb-2 text-foreground/90">
                Supported Operators
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                {[
                  { op: "=", label: "Equals" },
                  { op: "!=", label: "Not equals" },
                  { op: ">, <, >=, <=", label: "Comparisons" },
                  { op: "contains", label: "Text contains value" },
                ].map((o) => (
                  <div
                    key={o.op}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md 
                               bg-card border border-border shadow-sm"
                  >
                    <code
                      className="font-semibold bg-gradient-to-r from-primary to-purple-600 
                                 text-transparent bg-clip-text"
                    >
                      {o.op}
                    </code>
                    <span>{o.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
