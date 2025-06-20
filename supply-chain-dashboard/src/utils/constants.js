export const METRICS_DATA = [
  {
    icon: '📦',
    value: '98.7%',
    label: 'Inventory Fill Rate',
    trend: '↗ +2.3% vs last month',
    trendDirection: 'up',
    status: 'online'
  },
  {
    icon: '🚚',
    value: '94.2%',
    label: 'On-Time Delivery',
    trend: '↗ +1.8% vs last week',
    trendDirection: 'up',
    status: 'online'
  },
  {
    icon: '⚠️',
    value: '5',
    label: 'Active Disruptions',
    trend: '↘ -3 vs yesterday',
    trendDirection: 'down',
    status: 'warning'
  },
  {
    icon: '💰',
    value: '$2.4M',
    label: 'Cost Savings (Month)',
    trend: '↗ +18% vs target',
    trendDirection: 'up',
    status: 'online'
  },
  {
    icon: '🤖',
    value: '1,247',
    label: 'Active Robots',
    trend: '↗ +89 vs last week',
    trendDirection: 'up',
    status: 'online'
  },
  {
    icon: '🌍',
    value: '847',
    label: 'Global Shipments',
    trend: '→ Stable vs yesterday',
    trendDirection: 'neutral',
    status: 'online'
  }
];

export const ALERTS_DATA = [
  {
    type: 'critical',
    icon: '⚠️',
    title: 'Weather Disruption - Southeast Region',
    description: 'Severe storm affecting 12 distribution centers. Auto-rerouting activated for 45 shipments.'
  },
  {
    type: 'warning',
    icon: '📉',
    title: 'Low Inventory Alert - Electronics',
    description: 'Warehouse B: Smartphone inventory below safety threshold. Restock order initiated.'
  },
  {
    type: 'info',
    icon: '📈',
    title: 'Demand Surge Detected',
    description: 'Northeast region showing 28% increase in seasonal product demand. Adjusting allocation.'
  }
];

export const DASHBOARD_MODULES = [
  {
    icon: '📦',
    title: 'Inventory Management',
    description: 'Real-time inventory tracking, automated reordering, and stock optimization across all locations.',
    features: [
      'Real-time stock levels',
      'Automated reorder points',
      'ABC analysis & categorization',
      'Demand forecasting'
    ]
  },
  {
    icon: '🚛',
    title: 'Logistics & Transportation',
    description: 'Route optimization, carrier management, and delivery tracking with real-time updates.',
    features: [
      'Route optimization',
      'Carrier performance tracking',
      'Real-time shipment tracking',
      'Cost analysis & reporting'
    ]
  },
  {
    icon: '📈',
    title: 'Predictive Analytics',
    description: 'AI-powered demand forecasting, trend analysis, and predictive maintenance scheduling.',
    features: [
      'Demand forecasting models',
      'Trend analysis & insights',
      'Anomaly detection',
      'Performance predictions'
    ]
  },
  {
    icon: '🏭',
    title: 'Supplier Management',
    description: 'Supplier performance monitoring, risk assessment, and relationship management tools.',
    features: [
      'Supplier scorecards',
      'Risk assessment matrix',
      'Performance benchmarking',
      'Contract management'
    ]
  },
  {
    icon: '🌪️',
    title: 'Disruption Management',
    description: 'Proactive disruption detection, impact assessment, and automated response coordination.',
    features: [
      'Risk monitoring & alerts',
      'Impact assessment tools',
      'Automated response plans',
      'Recovery time tracking'
    ]
  },
  {
    icon: '🤖',
    title: 'Warehouse Automation',
    description: 'Robotic systems monitoring, task allocation, and automated warehouse operations control.',
    features: [
      'Robot fleet management',
      'Task scheduling & allocation',
      'Performance monitoring',
      'Maintenance scheduling'
    ]
  }
];
