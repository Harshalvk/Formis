"use client";

import * as React from "react";
import { answers, formSubmissions, fieldOptions, questions } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";

type FieldOption = InferSelectModel<typeof fieldOptions>;

type Answer = InferSelectModel<typeof answers> & {
  fieldOption?: FieldOption | null;
};

type Question = InferSelectModel<typeof questions> & {
  fieldOptions: FieldOption[];
};

type FormSubmissions = InferSelectModel<typeof formSubmissions> & {
  answers: Answer[];
};

interface TableProps {
  data: FormSubmissions[];
  columns: Question[];
}

const columnHelper = createColumnHelper<FormSubmissions>();

export function Table(props: TableProps) {
  const { data } = props;

  const columns = [
    columnHelper.accessor("id", {
      header: () => <p>ID</p>,
      cell: (info) => info.getValue()
    }),
    ...props.columns.map((question: Question) => {
      return columnHelper.accessor(
        (row) => {
          const answer: Answer | undefined = row.answers.find(
            (answer: Answer) => answer.questionId === question.id
          );

          return answer?.fieldOption ? answer.fieldOption.text : answer?.value;
        },
        {
          header: () => question.text,
          id: question.id.toString(),
          cell: (info) => <p>{info.renderValue()}</p>
        }
      );
    })
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  if (process.env.NODE_ENV === "development") {
    console.log("TABLE_DATA::", data);
  }

  return (
    <div className="p-2 mt-4">
      <div className="shadow overflow-hidden border sm:rounded-lg">
        <ShadcnTable>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-left">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="py-2">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="p-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        </ShadcnTable>
      </div>
      <div className="h-4" />
    </div>
  );
}
