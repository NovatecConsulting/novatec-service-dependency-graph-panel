import React from 'react';
import { TableContent } from 'types';

export const NodeStatistics = (receiving: TableContent[]) => {
  return (
    <>
      <div className="secondHeader--selection">Incoming Statistics</div>
      {() => {
        if (receiving.length > 0) {
          return (
            <table className="table--selection">
              <tr className="table--selection--head">
                <th>Name</th>
                <th className="table--th--selectionSmall">Time</th>
                <th className="table--th--selectionSmall">Requests</th>
                <th className="table--th--selectionSmall">Error Rate</th>
              </tr>
              {receiving.map((node: TableContent, index: number) => (
                <tr key={'row-' + index}>
                  <td className="table--td--selection" title="{{node.name}}">
                    {node.name}
                  </td>
                  <td className="table--td--selection">{node.responseTime}</td>
                  <td className="table--td--selection">{node.rate}</td>
                  <td className="table--td--selection">{node.error}</td>
                </tr>
              ))}
            </table>
          );
        }
        return <div className="no-data--selection">No incoming statistics available.</div>;
      }}
    </>
  );
};
