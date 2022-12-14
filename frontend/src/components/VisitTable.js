import React, { useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import filteredData from "../data/filteredData.json"
import { InstanteAppoinment } from "./InstantAppoinment"
import { COLUMNS } from "./columns";
import "./table.css";

export const VisitTable = () => {
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => filteredData, []);

  // A good practise to use memo to memorize table data
  const tableInstance = useTable(
    {
      columns: columns,
      data: data
    },
    useSortBy,
    usePagination
  );


  const {
    getTableProps, // necessary for react-table <table>
    getTableBodyProps, // necessary for react-table <tbody>
    headerGroups, // (return 4 arrays with header objects) Every column header belong to its own header crew
    page,
    nextPage,
    previousPage,
    canNextPage, // add validation
    canPreviousPage,
    pageOptions,
    state,
    setPageSize, // Page size
    prepareRow // function
  } = tableInstance; // destructuring table instance


  const { pageIndex, pageSize } = state;

  // tr - table row
  // th - table header
  // td - table data (cell)

  return (
    // apply the table props
    <>

      <table {...getTableProps()}>
        <thead>
          {/*  Loop over the header rows */}
          {headerGroups.map((headerGroup) => (
            //  Apply the header row props
            <tr {...headerGroup.getHeaderGroupProps()}>
              {/*  Loop over the headers in each row */}
              {headerGroup.headers.map((
                // Apply the header cell props
                column  // for each header access each column
              ) => (
                // Render the header
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}{" "}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                  </span>
                </th>
              ))}
            </tr>

          ))}
        </thead>
        {/* Apply the table body props */}
        <tbody {...getTableBodyProps()}>
          {/*  Loop over the table rows */}

          {page.map((row) => {  // page - 20 objects (rows - all page)
            // Prepare the row for display
            prepareRow(row);
            return (
              // Apply the row props
              <tr {...row.getRowProps()}>
                {/*  Loop over the rows cells */}
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>
                      {/*  Render the cell contents */}
                      {cell.render("Cell")}{" "}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>

      </table>

      <div>



        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>

        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        
        <button onClick={() => nextPage()} disabled={!canNextPage} style={{marginRight: ".7rem"}}>
          Next
        </button>


        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[10, 20, 50 ].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>

      </div>

      <InstanteAppoinment />

    </>

  );
};

