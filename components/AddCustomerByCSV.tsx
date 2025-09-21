"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { CustomerType } from "@/types/orderType";

const CONCURRENCY = 3; // Adjust parallelism (1 = sequential, >1 = faster but less visible)

const AddCustomerByCSV = ({
  handleAddCustomer,
}: {
  handleAddCustomer: (customerData: CustomerType) => Promise<void>;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [rowCount, setRowCount] = useState<number | null>(null);
  const [rows, setRows] = useState<CustomerType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addedCount, setAddedCount] = useState<number | null>(null);
  const [recentAdds, setRecentAdds] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
    setRowCount(null);
    setRows([]);
    setAddedCount(null);
    setRecentAdds([]);
  };

  const handleRun = () => {
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text
        .split(/\r?\n/) // handle CRLF + LF
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.length > 1) {
        const dataLines = lines.slice(1); // skip header

        const parsedRows: CustomerType[] = dataLines.map((line) => {
  const values = line.split(",").map((v) => v.trim());
  return {
    name: values[1] || "",
    whatsappNumber: values[2] || "",
    rewardPoint: 0,
    email: values[3] || "",
    phoneNumber: "",
    alternatePhoneNumber: "",
    shippingAddress: "",
    billingAddress: "",
  };
});


        setRows(parsedRows);
        // console.log({parsedRows})
        setRowCount(parsedRows.length);
      } else {
        setRowCount(0);
        setRows([]);
      }

      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  const handleAddAll = async () => {
    if (!rows.length) return;

    setIsLoading(true);
    setAddedCount(0);
    setRecentAdds([]);

    let pointer = 0;
    const total = rows.length;

    // worker-pool concurrency
    const workers = Array.from(
      { length: Math.min(CONCURRENCY, rows.length) },
      () =>
        (async () => {
          while (true) {
            const index = pointer;
            pointer += 1;
            if (index >= total) break;

            const row = rows[index];

            try {
              await handleAddCustomer(row);
              console.log("Customer added:", row);
              setAddedCount((prev) => (prev ?? 0) + 1);
              setRecentAdds((prev) => [
                `${row.name} (${row.whatsappNumber})`,
                ...prev.slice(0, 4), // keep last 5
              ]);
            } catch {
              // ignore errors for now
            }
          }
        })()
    );

    await Promise.all(workers);

    setIsLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="border-2 border-light-primary rounded-2xl"
        >
          Add by CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Add by CSV</DialogTitle>
        <hr className="my-2" />
        <DialogDescription>
          Upload a CSV file with the format: <br />
          <code>Counter, Name, Number, Email(optional)</code>
        </DialogDescription>
        <div className="flex flex-col space-y-4">
          {/* File Input */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="csv-file">CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              className="rounded-lg mt-1"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </div>

          {/* Run button */}
          <Button
            onClick={handleRun}
            disabled={!file || isLoading}
            className="rounded-lg bg-light-primary"
          >
            {isLoading ? "Processing..." : "Run"}
          </Button>

          {/* Row count */}
          {rowCount !== null && (
            <p className="text-md text-gray-700 dark:text-gray-300">
              Found <strong>{rowCount}</strong> row(s) in file
            </p>
          )}

          {/* Add all button */}
          {rowCount && rowCount > 0 && (
            <Button
              onClick={handleAddAll}
              disabled={isLoading}
              className="rounded-lg bg-green-500 text-white"
            >
              {isLoading
                ? `Adding... (${addedCount ?? 0}/${rowCount})`
                : "Add to Phonebook"}
            </Button>
          )}

          {/* Recently added feed */}
          {isLoading && recentAdds.length > 0 && (
            <div className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
              {recentAdds.map((c, idx) => (
                <p key={idx}>Adding: {c}</p>
              ))}
            </div>
          )}

          {/* Final summary */}
          {addedCount !== null && !isLoading && (
            <p className="text-md text-green-600 dark:text-green-400">
               Successfully added {addedCount}/{rowCount} customers
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerByCSV;
