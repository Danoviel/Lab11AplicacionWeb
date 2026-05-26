import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {getPages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            page === currentPage
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
