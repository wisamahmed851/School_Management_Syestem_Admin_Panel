import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export interface ColumnDef<TRow> {
  key: string;
  header: string;
  cell: (row: TRow) => React.ReactNode;
  className?: string;
}

interface DataTableProps<TRow> {
  columns: ColumnDef<TRow>[];
  rows: TRow[];
  getRowKey: (row: TRow) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<TRow>({
  columns,
  rows,
  getRowKey,
  isLoading = false,
  emptyMessage = "No records found.",
}: DataTableProps<TRow>) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={col.className}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            // Loading skeleton rows
            Array.from({ length: 5 }).map((_, rowIdx) => (
              <TableRow key={`skeleton-${rowIdx}`}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <Skeleton className="h-4 w-full max-w-[160px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length === 0 ? (
            // Empty state
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={getRowKey(row)}>
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.className}>
                    {col.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
