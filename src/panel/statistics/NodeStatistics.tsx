import React from 'react';
import { IntTableHeader } from '../../types';
import { TableContent } from 'types';
import SortableTable from './SortableTable';
import roundPercentageToDecimal from './utils/Utils';

interface NodeStatisticsProps {
  nodeList: TableContent[];
  noDataText: string;
  title: string;
}

const tableHeaders: IntTableHeader[] = [
  { text: 'Name', dataField: 'name', sort: true, isKey: true },
  { text: 'Time', dataField: 'time', sort: true, ignoreLiteral: ' ms' },
  { text: 'Requests', dataField: 'requests', sort: true, ignoreLiteral: '' },
  { text: 'Error Rate', dataField: 'error_rate', sort: true, ignoreLiteral: '%' },
];

function getStatisticsTable(noDataText: string, nodeList: TableContent[]) {
  if (nodeList.length > 0) {
    return (
      <SortableTable
        tableHeaders={tableHeaders}
        data={nodeList.map((node: TableContent) => {
          return {
            name: node.name,
            time: node.responseTime,
            requests: node.rate,
            error_rate: roundPercentageToDecimal(2, node.error),
          };
        })}
      />
    );
  }
  return <div className="no-data--selection">{noDataText}</div>;
}

export const NodeStatistics: React.FC<NodeStatisticsProps> = ({ nodeList, noDataText, title }) => {
  return (
    <div>
      <div className="secondHeader--selection">{title}</div>
      {getStatisticsTable(noDataText, nodeList)}
    </div>
  );
};
