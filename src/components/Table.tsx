"use client";
import * as React from "react";
import {
  forms,
  answers,
  formSubmissions,
  fieldOptions,
  questions,
} from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
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

const columnHelper = createColumnHelper<any>();

export function Table(props: TableProps) {
  const { data } = props;
  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
    }),
    ...props.columns.map((question: any, index: number) => {
      return columnHelper.accessor(
        (row) => {
          let answer = row.answers.find(
            (answer: any) => answer.questionId === question.id
          );

          return answer.fieldOptions ? answer.fieldOption.text : answer.value;
        },
        {
          header: () => question.text,
          id: question.id.toString(),
          cell: (info) => info.renderValue(),
        }
      );
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="h-4" />
    </div>
  );
}
