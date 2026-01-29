import React from "react";


export const Table: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <table className="table">{children}</table>
);

export const TableHeader: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <thead>{children}</thead>
);

export const TableBody: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <tbody>{children}</tbody>
);

export const TableRow: React.FC<{ children?: React.ReactNode }> = ({ children }) => <tr>{children}</tr>;

export const TableHead: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <th className={`text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${className}`}>{children}</th>
);

export const TableCell: React.FC<{ children?: React.ReactNode; className?: string; colSpan?: number }> = ({ children, className = "", colSpan }) => (
  <td className={`${className}`.trim() } colSpan={colSpan}>{children}</td>
);

export default Table;
