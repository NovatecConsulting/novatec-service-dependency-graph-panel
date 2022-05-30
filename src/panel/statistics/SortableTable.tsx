import React from 'react';
import { IntTableHeader, NodeData } from '../../types';
import BootstrapTable from 'react-bootstrap-table-next';

interface SortableTableProps {
  tableHeaders: IntTableHeader[];
  data: NodeData[];
}

function sort(a: string, b: string, order: string, ignoreLiteral: string) {
  var cleanA = a.replace(ignoreLiteral, '');
  var cleanB = b.replace(ignoreLiteral, '');
  if ((order === 'asc' && cleanA === '-') || (order !== 'asc' && cleanB === '-')) {
    return -1;
  }
  if ((order === 'asc' && cleanB === '-') || (order !== 'asc' && cleanA === '-')) {
    return 1;
  }
  if (order === 'asc') {
    return Number(cleanA) - Number(cleanB);
  }
  return Number(cleanB) - Number(cleanA);
}

export const SortableTable: React.FC<SortableTableProps> = ({ tableHeaders, data }) => {
  tableHeaders.forEach(function (value, i) {
    value.classes = 'table--td--selection';
    if (i !== 0) {
      value.sortFunc = (a: string, b: string, order: string, _dataField: any, _rowA: any) => {
        return sort(a, b, order, value.ignoreLiteral);
      };
    }
  });

  return (
    <BootstrapTable
      keyField="name"
      data={data}
      columns={tableHeaders}
      classes="table--selection"
      headerClasses="table--selection table--selection--head"
    />
  );
};

export default SortableTable;
