import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AnalyticsCharts = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [activeChart, setActiveChart] = useState("overview");

  const timeRangeOptions = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 3 months" },
    { value: "1y", label: "Last year" }
  ];

  const chartOptions = [
    { value: "overview", label: "Overview", icon: "BarChart3" },
    { value: "users", label: "User Growth", icon: "Users" },
    { value: "listings", label: "Listings", icon: "Car" },
    { value: "revenue", label: "Revenue", icon: "DollarSign" }
  ];

  // Mock data for different time ranges
  const getOverviewData = () => {
    const baseData = [
      { name: 'Jan', users: 120, listings: 45, messages: 234, revenue: 12500 },
      { name: 'Feb', users: 145, listings: 52, messages: 289, revenue: 15200 },
      { name: 'Mar', users: 178, listings: 68, messages: 356, revenue: 18900 },
      { name: 'Apr', users: 203, listings: 74, messages: 412, revenue: 22100 },
      { name: 'May', users: 234, listings: 89, messages: 478, revenue: 26800 },
      { name: 'Jun', users: 267, listings: 95, messages: 523, revenue: 31200 },
      { name: 'Jul', users: 298, listings: 108, messages: 589, revenue: 35600 },
      { name: 'Aug', users: 325, listings: 118, messages: 634, revenue: 39400 },
      { name: 'Sep', users: 356, listings: 132, messages: 698, revenue: 43800 },
      { name: 'Oct', users: 389, listings: 145, messages: 756, revenue: 48200 },
      { name: 'Nov', users: 412, listings: 158, messages: 812, revenue: 52600 }
    ];

    if (timeRange === "7d") {
      return baseData?.slice(-7)?.map((item, index) => ({
        ...item,
        name: `Day ${index + 1}`
      }));
    }
    if (timeRange === "30d") {
      return baseData?.slice(-4);
    }
    return baseData;
  };

  const getUserGrowthData = () => [
    { name: 'Week 1', newUsers: 28, activeUsers: 156, totalUsers: 184 },
    { name: 'Week 2', newUsers: 34, activeUsers: 178, totalUsers: 218 },
    { name: 'Week 3', newUsers: 42, activeUsers: 203, totalUsers: 260 },
    { name: 'Week 4', newUsers: 38, activeUsers: 234, totalUsers: 298 },
    { name: 'Week 5', newUsers: 45, activeUsers: 267, totalUsers: 343 },
    { name: 'Week 6', newUsers: 52, activeUsers: 298, totalUsers: 395 }
  ];

  const getListingsData = () => [
    { name: 'Model S', count: 45, percentage: 28.5 },
    { name: 'Model 3', count: 67, percentage: 42.4 },
    { name: 'Model X', count: 23, percentage: 14.6 },
    { name: 'Model Y', count: 23, percentage: 14.5 }
  ];

  const getRevenueData = () => [
    { name: 'Jan', revenue: 12500, fees: 1250, commissions: 2500 },
    { name: 'Feb', revenue: 15200, fees: 1520, commissions: 3040 },
    { name: 'Mar', revenue: 18900, fees: 1890, commissions: 3780 },
    { name: 'Apr', revenue: 22100, fees: 2210, commissions: 4420 },
    { name: 'May', revenue: 26800, fees: 2680, commissions: 5360 },
    { name: 'Jun', revenue: 31200, fees: 3120, commissions: 6240 }
  ];

  const COLORS = ['#DC2626', '#EF4444', '#F87171', '#FCA5A5'];

  const handleExport = () => {
    console.log('Exporting analytics data...');
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'overview':
        return (
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={getOverviewData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#A3A3A3" />
                <YAxis stroke="#A3A3A3" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#2D2D2D', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="users" stackId="1" stroke="#DC2626" fill="#DC2626" fillOpacity={0.6} />
                <Area type="monotone" dataKey="listings" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                <Area type="monotone" dataKey="messages" stackId="1" stroke="#F87171" fill="#F87171" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );

      case 'users':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={getUserGrowthData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#A3A3A3" />
              <YAxis stroke="#A3A3A3" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#2D2D2D', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="newUsers" stroke="#DC2626" strokeWidth={3} dot={{ fill: '#DC2626' }} />
              <Line type="monotone" dataKey="activeUsers" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444' }} />
              <Line type="monotone" dataKey="totalUsers" stroke="#F87171" strokeWidth={3} dot={{ fill: '#F87171' }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'listings':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getListingsData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {getListingsData()?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#2D2D2D', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-card-foreground">Model Distribution</h4>
              {getListingsData()?.map((item, index) => (
                <div key={item?.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
                    />
                    <span className="font-medium text-card-foreground">{item?.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-card-foreground">{item?.count}</p>
                    <p className="text-sm text-muted-foreground">{item?.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getRevenueData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#A3A3A3" />
              <YAxis stroke="#A3A3A3" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#2D2D2D', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="revenue" fill="#DC2626" />
              <Bar dataKey="fees" fill="#EF4444" />
              <Bar dataKey="commissions" fill="#F87171" />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {chartOptions?.map((option) => (
            <Button
              key={option?.value}
              variant={activeChart === option?.value ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveChart(option?.value)}
              iconName={option?.icon}
              iconPosition="left"
            >
              {option?.label}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={setTimeRange}
            className="w-40"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
        </div>
      </div>
      {/* Chart Container */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-card-foreground">
            {chartOptions?.find(opt => opt?.value === activeChart)?.label} Analytics
          </h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Calendar" size={16} />
            <span>{timeRangeOptions?.find(opt => opt?.value === timeRange)?.label}</span>
          </div>
        </div>
        
        {renderChart()}
      </div>
      {/* Chart Legend */}
      {activeChart === 'overview' && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full" />
              <span className="text-sm text-card-foreground">Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-sm text-card-foreground">Listings</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
              <span className="text-sm text-card-foreground">Messages</span>
            </div>
          </div>
        </div>
      )}
      {activeChart === 'users' && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full" />
              <span className="text-sm text-card-foreground">New Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-sm text-card-foreground">Active Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
              <span className="text-sm text-card-foreground">Total Users</span>
            </div>
          </div>
        </div>
      )}
      {activeChart === 'revenue' && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full" />
              <span className="text-sm text-card-foreground">Total Revenue</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-sm text-card-foreground">Platform Fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
              <span className="text-sm text-card-foreground">Commissions</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsCharts;