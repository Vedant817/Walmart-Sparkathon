# Store Insights Dashboard

## Overview
The Store Insights page provides comprehensive business analytics and performance metrics for store operations, combining inventory and order data to deliver actionable insights.

## Features

### 📊 Key Performance Indicators (KPIs)
- **Total Revenue**: Sum of all sales within the selected time period
- **Total Profit**: Gross profit with profit margin percentage
- **Inventory Value**: Total value of current stock with low stock alerts
- **Active Orders**: Current pending orders with average order value

### 📈 Interactive Charts
1. **Sales by Category** (Bar Chart)
   - Revenue and profit breakdown by product category
   - Helps identify top-performing categories

2. **Daily Sales Trend** (Area Chart)
   - Revenue and profit trends over time
   - Shows business performance patterns

3. **Inventory Distribution** (Pie Chart)
   - Visual representation of inventory value by category
   - Helps with inventory management decisions

4. **Payment Methods** (Horizontal Bar Chart)
   - Analysis of customer payment preferences
   - Useful for payment processing optimization

### 🔍 Time Filtering
- **Last 7 Days**: Recent performance analysis
- **Last 30 Days**: Monthly trends and patterns
- **Last 90 Days**: Quarterly business insights
- **Last Year**: Annual performance review
- **All Time**: Complete historical data

### 📋 Business Intelligence Panels

#### Top Performing Categories
- Lists categories by revenue performance
- Shows order count for each category
- Color-coded for easy identification

#### Low Stock Alert
- Real-time inventory monitoring
- Items below reorder point threshold
- Prevents stockouts and lost sales

#### Quick Stats
- Total products in inventory
- Number of categories
- Average order value
- Current profit margin
- Today's order count

## Data Sources
- **Inventory Data**: Real-time stock levels, values, and reorder points
- **Past Orders**: Historical sales data with profit calculations
- **Active Orders**: Current pending orders and processing status

## Business Benefits

### 📈 Revenue Optimization
- Identify best-selling categories
- Track profit margins by category
- Monitor daily sales trends
- Optimize pricing strategies

### 📦 Inventory Management
- Prevent stockouts with low stock alerts
- Balance inventory investment across categories
- Optimize reorder timing and quantities
- Reduce carrying costs

### 💰 Profitability Analysis
- Track profit margins across time periods
- Identify most profitable product categories
- Monitor cost efficiency
- Make data-driven pricing decisions

### 📊 Operational Insights
- Understand customer payment preferences
- Track order processing efficiency
- Monitor business growth trends
- Identify seasonal patterns

## Technical Features
- **Real-time Data**: Automatic refresh functionality
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Interactive Charts**: Hover tooltips and legends
- **Performance Optimized**: Efficient data processing and rendering
- **Error Handling**: Graceful handling of missing or invalid data

## Usage Instructions

1. **Navigate** to the Insights page from the store dashboard sidebar
2. **Select Time Range** using the dropdown filter in the top-right
3. **View KPIs** in the metric cards at the top
4. **Analyze Charts** for detailed breakdowns and trends
5. **Monitor Alerts** in the Low Stock Alert panel
6. **Refresh Data** using the refresh button when needed

## API Endpoints
- `/api/store/inventory` - Inventory data
- `/api/store/orders/past` - Historical sales data
- `/api/store/orders` - Active orders data
- `/api/store/insights` - Aggregated analytics data

## Future Enhancements
- Predictive analytics and forecasting
- Comparative period analysis (YoY, MoM)
- Export functionality for reports
- Custom dashboard widgets
- Advanced filtering options
- Integration with external analytics tools

---

This insights dashboard empowers store managers with data-driven decision-making capabilities, helping optimize operations, increase profitability, and improve customer satisfaction.