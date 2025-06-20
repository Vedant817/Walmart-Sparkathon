import React, { useState } from 'react';
import MetricCard from '../../components/MetricCard/MetricCard';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import AlertsSection from '../../components/AlertsSection/AlertsSection';
import QuickActions from '../../components/QuickActions/QuickActions';
import PerformanceChart from '../../components/PerformanceChart/PerformanceChart';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import { METRICS_DATA, ALERTS_DATA, DASHBOARD_MODULES } from '../../utils/constants';
import './Dashboard.css';

const Dashboard = () => {
  const { data: metricsData } = useRealTimeData(METRICS_DATA);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  return (
    <div className="dashboard">
      <div className="container">
        {/* Enhanced Hero Section */}
        <div className="dashboard__hero">
          <div className="hero__content">
            <div className="hero__welcome">
              <h1 className="hero__title">
                Welcome back, <span className="hero__name">Deepesh</span>
              </h1>
              <p className="hero__subtitle">
                Here's what's happening with your supply chain operations today
              </p>
            </div>
            
            <div className="hero__stats">
              <div className="hero__stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <span className="stat-value">99.7%</span>
                  <span className="stat-label">System Uptime</span>
                </div>
              </div>
              
              <div className="hero__stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-content">
                  <span className="stat-value">1.2s</span>
                  <span className="stat-label">Avg Response</span>
                </div>
              </div>
              
              <div className="hero__stat-card">
                <div className="stat-icon">🌍</div>
                <div className="stat-content">
                  <span className="stat-value">47</span>
                  <span className="stat-label">Active Regions</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hero__actions">
            <div className="time-selector">
              <button 
                className={`time-btn ${selectedTimeRange === '1h' ? 'active' : ''}`}
                onClick={() => setSelectedTimeRange('1h')}
              >
                1H
              </button>
              <button 
                className={`time-btn ${selectedTimeRange === '24h' ? 'active' : ''}`}
                onClick={() => setSelectedTimeRange('24h')}
              >
                24H
              </button>
              <button 
                className={`time-btn ${selectedTimeRange === '7d' ? 'active' : ''}`}
                onClick={() => setSelectedTimeRange('7d')}
              >
                7D
              </button>
              <button 
                className={`time-btn ${selectedTimeRange === '30d' ? 'active' : ''}`}
                onClick={() => setSelectedTimeRange('30d')}
              >
                30D
              </button>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <section className="dashboard__section">
          <div className="section-header">
            <h2 className="section-title">📊 Key Performance Indicators</h2>
            <div className="section-actions">
              <button className="btn btn--secondary">Export Data</button>
              <button className="btn btn--primary">View Details</button>
            </div>
          </div>
          
          <div className="dashboard__metrics">
            {metricsData.map((metric, index) => (
              <MetricCard
                key={index}
                {...metric}
                animationDelay={index * 100}
              />
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="dashboard__main-grid">
          {/* Left Column - Charts and Analytics */}
          <div className="dashboard__main-content">
            <div className="content-card">
              <div className="card-header">
                <h3 className="card-title">📈 Performance Overview</h3>
                <div className="card-actions">
                  <button className="icon-btn">⚙️</button>
                  <button className="icon-btn">📤</button>
                </div>
              </div>
              <PerformanceChart timeRange={selectedTimeRange} />
            </div>
            
            <AlertsSection alerts={ALERTS_DATA} />
          </div>
          
          {/* Right Sidebar */}
          <div className="dashboard__sidebar">
            <QuickActions />
            
            <div className="content-card">
              <div className="card-header">
                <h3 className="card-title">🎯 Today's Goals</h3>
              </div>
              <div className="goals-list">
                <div className="goal-item">
                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '85%'}}></div>
                    </div>
                  </div>
                  <div className="goal-content">
                    <span className="goal-title">Inventory Optimization</span>
                    <span className="goal-status">85% Complete</span>
                  </div>
                </div>
                
                <div className="goal-item">
                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '92%'}}></div>
                    </div>
                  </div>
                  <div className="goal-content">
                    <span className="goal-title">Delivery Targets</span>
                    <span className="goal-status">92% Complete</span>
                  </div>
                </div>
                
                <div className="goal-item">
                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '67%'}}></div>
                    </div>
                  </div>
                  <div className="goal-content">
                    <span className="goal-title">Cost Reduction</span>
                    <span className="goal-status">67% Complete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Modules Grid */}
        <section className="dashboard__section">
          <div className="section-header">
            <h2 className="section-title">🎛️ Management Modules</h2>
            <p className="section-description">
              Access specialized dashboards and operational tools
            </p>
          </div>
          
          <div className="dashboard__modules">
            {DASHBOARD_MODULES.map((module, index) => (
              <DashboardCard
                key={index}
                {...module}
                animationDelay={index * 150}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
