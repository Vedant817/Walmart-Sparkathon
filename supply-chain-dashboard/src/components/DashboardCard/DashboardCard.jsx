import React from 'react';
import './DashboardCard.css';

const DashboardCard = ({ 
  icon, 
  title, 
  description, 
  features, 
  onClick,
  animationDelay = 0 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      alert(`Navigating to ${title} Dashboard`);
    }
  };

  return (
    <div 
      className="dashboard-card animate-slide-up" 
      onClick={handleClick}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <span className="dashboard-card__icon">{icon}</span>
      <h3 className="dashboard-card__title">{title}</h3>
      <p className="dashboard-card__description">{description}</p>
      <ul className="dashboard-card__features">
        {features.map((feature, index) => (
          <li key={index} className="dashboard-card__feature">
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardCard;
