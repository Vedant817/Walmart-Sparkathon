import React from 'react';
import './MetricCard.css';

const MetricCard = ({ 
  icon, 
  value, 
  label, 
  trend, 
  trendDirection, 
  status = 'online',
  animationDelay = 0 
}) => {
  const getTrendClass = () => {
    switch (trendDirection) {
      case 'up': return 'metric-card__trend--up';
      case 'down': return 'metric-card__trend--down';
      default: return 'metric-card__trend--neutral';
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'warning': return 'status-indicator--warning';
      case 'offline': return 'status-indicator--offline';
      default: return 'status-indicator--online';
    }
  };

  return (
    <div 
      className="metric-card animate-slide-up" 
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="metric-card__header">
        <span className="metric-card__icon">{icon}</span>
        <span className={`status-indicator ${getStatusClass()} pulse`}></span>
      </div>
      <div className="metric-card__value">{value}</div>
      <div className="metric-card__label">{label}</div>
      <div className={`metric-card__trend ${getTrendClass()}`}>
        {trend}
      </div>
    </div>
  );
};

export default MetricCard;
