import React from 'react';
import { NodeStatistics } from './NodeStatistics'
import './css/novatec-service-dependency-graph-panel.css';

interface StatisticsProps  {
    show: boolean,
    selectionId: any, 
    resolvedDrillDownLink: string, 
    selectionStatistics: any,
    node: any,
    currentType: any,
    showBaselines: any,
    receiving: any
}

export const Statistics: React.FC<StatisticsProps> = ({
    show,
    selectionId, 
    resolvedDrillDownLink, 
    selectionStatistics,
    node,
    currentType,
    showBaselines,
    receiving
    }) => {
        
        var statistics=(<div></div>)
        if(show) {
            console.log("show")
            var drilldownLink = (<div></div>)
            if(resolvedDrillDownLink && resolvedDrillDownLink.length > 0 && currentType === 'INTERNAL'){
                console.log("Drilldown")
                drilldownLink = (
                    <a target="_blank" ng-href={resolvedDrillDownLink}>
                        <i className="fa fa-paper-plane-o"></i>
                    </a>
                    )
            }

            var requests=(<div></div>)
            if(true){//selectionStatistics.requests >= 0) {
                console.log("requests")
                requests = ( 
                    <tr>
                        <td className="table--td--selection">Requests</td>
                        <td className="table--td--selection">{"selectionStatistics.requests"}</td>
                    </tr>
                )
            }

            var errors=(<div></div>)
            if(true){//selectionStatistics.errors >= 0) {
                console.log("errors")
                errors = (
                    <tr>
                        <td className="table--td--selection">Errors</td>
                        <td className="table--td--selection">{"selectionStatistics.errors"}</td>
                    </tr>
                    )
            }

            var errorRate=(<div></div>)
            if(true){//selectionStatistics.requests >= 0 && selectionStatistics.errors >= 0){
                console.log("errorRate")
                errorRate = (
                    <tr ng-show="">
                        <td className="table--td--selection">Error Rate</td>
                        <td className="table--td--selection">{ /*(100 / selectionStatistics.requests * selectionStatistics.errors)"*/50 | 1 }%</td>
                    </tr>
                )
            }

            var avgResponseTime=(<div></div>)
            if(true){//selectionStatistics.responseTime >= 0) {
                console.log("avgResponseTime")
                avgResponseTime = (
                    <tr>
                        <td className="table--td--selection">Avg. Response Time</td>
                        <td className="table--td--selection">{"selectionStatistics.responseTime"} ms</td>
                    </tr>
                )
            }

            var baseline=(<div></div>)
            if (false){ //showBaselines && selectionStatistics.threshold) {
                console.log("baseline")
                var threshold = (<td className="table--td--selection threshold--good">Good "(&lt;= {selectionStatistics.threshold}ms)"</td>)
                if(selectionStatistics.thresholdViolation) {
                    threshold = <td className="table--td--selection threshold--bad">Bad ({">"} {selectionStatistics.threshold}ms)</td>
                }
                baseline = (
                    <tr>
                        <td className="table--td--selection">Response Time Health (Upper Baseline)</td>
                        {threshold}
                    </tr>
                    )
            }
            statistics = (
                <div >
                    <div className="header--selection">{selectionId}
                        {drilldownLink}
                    </div>

                    <div className="secondHeader--selection">Statistics</div>
                    <table className="table--selection">
                        <tr className="table--selection--head">
                            <th>Name</th>
                            <th className="table--th--selectionMedium">Value</th>
                        </tr>
                        {requests}    
                        {errors}
                        {errorRate}
                        {avgResponseTime}
                        {baseline}
                    </table>

                    <NodeStatistics nodeList={[]} noDataText="No incoming statistics available." title="Incoming Statistics"/>
                    <NodeStatistics nodeList={[]} noDataText = "No outgoing statistics available." title="Outgoing Statistics"/>
                </div>
            )
        }
        console.log("return")
        var w = "0%"
        if(show) {
            w = "40%"
        }
        return (
            <div style={{width: w}}>
                {statistics}
            </div>
        );
    }


