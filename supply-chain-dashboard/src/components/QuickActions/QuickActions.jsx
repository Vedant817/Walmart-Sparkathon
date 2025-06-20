import React from 'react';
import './QuickActions.css';

const QuickActions = () => {
  const actions = [
    {
      icon: '📊',
      title: 'Generate Report',
      description: 'Create custom analytics report',
      color: 'blue'
    },
    {
      icon: '🚨',
      title: 'Emergency Protocol',
      description: 'Activate emergency response',
      color: 'red'
    },
    {
      icon: '📦',
      title: 'Inventory Check',
      description: 'Run inventory audit',
      color: 'green'
    },
    {
      icon: '🔄',
      title: 'Sync Systems',
      description: 'Synchronize all platforms',
      color: 'yellow'
    }
  ];

  return (
    <div className="quick-actions">
      <div className="quick-actions__header">
        <h3 className="quick-actions__title">⚡ Quick Actions</h3>
      </div>
      <div className="quick-actions__grid">
        {actions.map((action, index) => (
          <button 
            key={index} 
            className={`quick-action quick-action--${action.color}`}
            onClick={() => alert(`Executing: ${action.title}`)}
          >
            <span className="quick-action__icon">{action.icon}</span>
            <div className="quick-action__content">
              <span className="quick-action__title">{action.title}</span>
              <span className="quick-action__description">{action.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
