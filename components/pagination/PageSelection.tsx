import React, { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PaginationType } from "../Table/TableArea";

const PageSelection = ({
  pagination,
  setPagination,
}: {
  pagination: PaginationType;
  setPagination: Dispatch<SetStateAction<PaginationType>>;
}) => {
  return (
    <div className="flex items-center gap-2 max-sm:flex-col">
      <span className="text-sm text-gray-500">Rows per page</span>
      <Select
        value={pagination.pageSize.toString()}
        onValueChange={(value) =>
          setPagination((prev) => ({ ...prev, pageSize: Number(value) }))
        }
      >
        <SelectTrigger className="border rounded-md px-2 w-14">
          <SelectValue placeholder={pagination.pageSize.toString()} />
        </SelectTrigger>
        <SelectContent>
          {[4, 6, 8, 10, 15, 18, 25, 30].map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PageSelection;
