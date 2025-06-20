import React from 'react';
import './PerformanceChart.css';

const PerformanceChart = ({ timeRange }) => {
  const chartData = {
    '1h': [65, 72, 68, 75, 82, 78, 85],
    '24h': [78, 82, 85, 79, 88, 92, 89],
    '7d': [85, 89, 92, 88, 94, 91, 96],
    '30d': [88, 91, 94, 92, 96, 94, 98]
  };

  const data = chartData[timeRange] || chartData['24h'];
  const maxValue = Math.max(...data);

  return (
    <div className="performance-chart">
      <div className="chart-container">
        <div className="chart-grid">
          {data.map((value, index) => (
            <div key={index} className="chart-bar">
              <div 
                className="bar-fill"
                style={{ 
                  height: `${(value / maxValue) * 100}%`,
                  animationDelay: `${index * 100}ms`
                }}
              ></div>
              <span className="bar-label">{value}%</span>
            </div>
          ))}
        </div>
        
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color legend-color--primary"></div>
            <span>Performance Score</span>
          </div>
        </div>
      </div>
      
      <div className="chart-summary">
        <div className="summary-item">
          <span className="summary-label">Average</span>
          <span className="summary-value">
            {Math.round(data.reduce((a, b) => a + b, 0) / data.length)}%
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Peak</span>
          <span className="summary-value">{Math.max(...data)}%</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Trend</span>
          <span className="summary-value trend-up">↗ +2.3%</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
