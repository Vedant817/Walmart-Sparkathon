import React from 'react';
import './AlertsSection.css';

const AlertsSection = ({ alerts }) => {
  const getAlertClass = (type) => {
    switch (type) {
      case 'critical': return 'alert-item--critical';
      case 'warning': return 'alert-item--warning';
      case 'info': return 'alert-item--info';
      default: return 'alert-item--info';
    }
  };

  return (
    <div className="alerts-section">
      <div className="alerts-section__header">
        <h2 className="alerts-section__title">
          <span>🚨</span>
          System Alerts
        </h2>
      </div>
      
      <div className="alerts-section__content">
        {alerts.map((alert, index) => (
          <div 
            key={index} 
            className={`alert-item ${getAlertClass(alert.type)}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="alert-item__icon">{alert.icon}</span>
            <div className="alert-item__content">
              <h4 className="alert-item__title">{alert.title}</h4>
              <p className="alert-item__description">{alert.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsSection;
