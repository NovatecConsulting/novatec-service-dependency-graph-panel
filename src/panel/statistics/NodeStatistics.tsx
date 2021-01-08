import React from 'react';
import { TableHeader } from '../../types'
import { TableContent } from 'types';
import SortableTable from './SortableTable'
import roundPercentageToDecimal from './utils/Utils'

interface NodeStatisticsProps  {
    nodeList: TableContent[],
    noDataText: string,
    title: string  
}

const tableHeaders: TableHeader[] = [
    {text: "Name", dataField: "name", sort: true, isKey: true},
    {text: "Time", dataField: "time", sort: true, ignoreLiteral: " ms"},
    {text: "Requests", dataField: "requests", sort: true,  ignoreLiteral: ""},
    {text: "Error Rate", dataField: "error_rate", sort: true, ignoreLiteral: "%"},
]

export const NodeStatistics: React.FC<NodeStatisticsProps> = ({nodeList, noDataText, title}) => {
        var nodeStatistics = (<div className="no-data--selection">{noDataText}</div>)
        if(nodeList.length > 0) {
            var data = nodeList.map((node: any) => {
                return {
                    name: node.name,
                    time: node.responseTime,
                    requests: node.rate,
                    error_rate: roundPercentageToDecimal(2, node.error)
                }
            }
            );
            
            nodeStatistics = (
                <SortableTable 
                    tableHeaders={tableHeaders}
                    data = {data}
                />
            )
        }

        return (
            <div>
                <div className="secondHeader--selection">{title}</div>
                {nodeStatistics}
            </div>
        )
    }