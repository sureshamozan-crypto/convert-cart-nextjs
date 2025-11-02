import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export function TableHeaderV1() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>ID</TableHead>
        <TableHead>Title</TableHead>
        <TableHead>Category</TableHead>
        <TableHead>Sale</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>Tags</TableHead>
        <TableHead>Status</TableHead>
        <TableHead></TableHead>
      </TableRow>
    </TableHeader>
  );
}