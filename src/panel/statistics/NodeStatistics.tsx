import React from 'react';
import { TableContent } from 'types';
import roundPercentageToDecimal from './utils/Utils'

interface NodeStatisticsProps  {
    nodeList: TableContent[],
    noDataText: string,
    title: string  
}

export const NodeStatistics: React.FC<NodeStatisticsProps> = ({nodeList, noDataText, title}) => {
        var nodeStatistics = (<div className="no-data--selection">{noDataText}</div>)
        if(nodeList.length > 0) {
            var recievingNodes = nodeList.map((node: any) => {
                
                return ( 
                    <tr>
                        <td className="table--td--selection" title={node.name}>{node.name}</td>
                        <td className="table--td--selection">{node.responseTime}</td>
                        <td className="table--td--selection">{node.rate}</td>
                        <td className="table--td--selection">{roundPercentageToDecimal(2, node.error)}</td>
                    </tr>
                )
            }
            );
            

            nodeStatistics = (
                <table className="table--selection">
                    <tr className="table--selection--head">
                        <th>Name</th>
                        <th className="table--th--selectionSmall">Time</th>
                        <th className="table--th--selectionSmall">Requests</th>
                        <th className="table--th--selectionSmall">Error Rate</th>
                    </tr>
                    {recievingNodes}
                </table>
            );
        }
        
        return (
            <div>
                <div className="secondHeader--selection">{title}</div>
                {nodeStatistics}
            </div>
        )
    }