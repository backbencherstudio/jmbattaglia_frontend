"use client";


import { DataTableProps } from "@/types/table";
import { useDraggableScroll } from "@/hooks/useDraggableScroll";

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No items found.",
  className = "",
  bordered = true,
}: DataTableProps<T>) {
  const { ref, isDragging, events } = useDraggableScroll();

  return (
    <div
      className={`bg-white rounded-2xl border border-hairline overflow-hidden shadow-xs ${className}`}
    >
      <div
        ref={ref}
        {...events}
        className={`overflow-x-auto scrollbar-thin cursor-grab active:cursor-grabbing ${isDragging ? "select-none" : ""
          }`}
      >
        <table className="w-full text-left text-xs sm:text-sm text-main whitespace-nowrap border-collapse">
          <thead className="bg-canvas border-b border-hairline text-base font-bold text-muted uppercase">
            <tr>
              {columns.map((col, index) => {
                const isLast = index === columns.length - 1;
                const alignClass =
                  col.align === "center"
                    ? "text-center"
                    : col.align === "right"
                      ? "text-right"
                      : "text-left";

                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={`py-3 sm:py-3.5 px-4 tracking-tighter sm:px-6 ${alignClass} ${bordered && !isLast ? "border-r border-hairline" : ""
                      } ${col.headerClassName || ""}`}
                  >
                    {col.header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline font-medium">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 text-center text-sub text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => {
                const key = keyExtractor(item);
                return (
                  <tr
                    key={key}
                    className="hover:bg-canvas/50 transition-colors"
                  >
                    {columns.map((col, colIndex) => {
                      const isLast = colIndex === columns.length - 1;
                      const alignClass =
                        col.align === "center"
                          ? "text-center"
                          : col.align === "right"
                            ? "text-right"
                            : "text-left";

                      const content = col.render
                        ? col.render(item, rowIndex)
                        : (item as Record<string, unknown>)[col.key] !== undefined
                          ? String((item as Record<string, unknown>)[col.key])
                          : null;

                      return (
                        <td
                          key={`${key}-${col.key}`}
                          className={`py-3.5 sm:py-4 px-4 font-normal text-lg sm:px-6 ${alignClass} ${bordered && !isLast ? "border-r border-hairline" : ""
                            } ${col.className || ""}`}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
