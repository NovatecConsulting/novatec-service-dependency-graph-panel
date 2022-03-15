import React from 'react';
import { NodeStatistics } from './NodeStatistics';
import '../../css/novatec-service-dependency-graph-panel.css';
import './Statistics.css';
import { IntSelectionStatistics, TableContent } from 'types';
import roundPercentageToDecimal from './utils/Utils';

interface StatisticsProps {
  show: boolean;
  selectionId: string | number;
  resolvedDrillDownLink: string;
  selectionStatistics: IntSelectionStatistics;
  currentType: string;
  showBaselines: boolean;
  receiving: TableContent[];
  sending: TableContent[];
}

export const Statistics: React.FC<StatisticsProps> = ({
  show,
  selectionId,
  resolvedDrillDownLink,
  selectionStatistics,
  currentType,
  showBaselines,
  receiving,
  sending,
}) => {
  var statisticsClass = 'statistics';
  var statistics = <div></div>;
  if (show) {
    statisticsClass = 'statistics show ';
    var drilldownLink = <div></div>;
    if (resolvedDrillDownLink && resolvedDrillDownLink.length > 0 && currentType === 'INTERNAL') {
      drilldownLink = (
        <a target="_blank" href={resolvedDrillDownLink}>
          <i className="fa fa-paper-plane-o margin"></i>
        </a>
      );
    }

    const requests =
      selectionStatistics.requests >= 0 ? (
        <tr>
          <td className="table--td--selection">Requests</td>
          <td className="table--td--selection">{selectionStatistics.requests}</td>
        </tr>
      ) : null;

    const errors =
      selectionStatistics.errors >= 0 ? (
        <tr>
          <td className="table--td--selection">Errors</td>
          <td className="table--td--selection">{selectionStatistics.errors}</td>
        </tr>
      ) : null;

    var errorRate =
      selectionStatistics.requests > 0 && selectionStatistics.errors >= 0 ? (
        <tr ng-show="">
          <td className="table--td--selection">Error Rate</td>
          <td className="table--td--selection">
            {roundPercentageToDecimal(
              2,
              ((100 / selectionStatistics.requests) * selectionStatistics.errors).toString()
            )}
          </td>
        </tr>
      ) : null;

    var avgResponseTime =
      selectionStatistics.responseTime >= 0 ? (
        <tr>
          <td className="table--td--selection">Avg. Response Time</td>
          <td className="table--td--selection">{selectionStatistics.responseTime} ms</td>
        </tr>
      ) : null;
    var threshold = selectionStatistics.thresholdViolation ? (
      <td className="table--td--selection threshold--bad">
        Bad ({'>'} {selectionStatistics.threshold}ms)
      </td>
    ) : (
      <td className="table--td--selection threshold--good"> Good (&lt;= {selectionStatistics.threshold}ms) </td>
    );
    var baseline =
      showBaselines && selectionStatistics.threshold ? (
        <tr>
          <td className="table--td--selection">Response Time Health (Upper Baseline)</td>
          {threshold}
        </tr>
      ) : null;

    statistics = (
      <div className="statistics">
        <div className="header--selection">
          {selectionId}
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

        <NodeStatistics
          nodeList={receiving}
          noDataText="No incoming statistics available."
          title="Incoming Statistics"
        />
        <NodeStatistics nodeList={sending} noDataText="No outgoing statistics available." title="Outgoing Statistics" />
      </div>
    );
  }
  return <div className={statisticsClass}>{statistics}</div>;
};
