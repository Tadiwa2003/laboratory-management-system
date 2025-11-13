import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import TimePeriodDropdown from './TimePeriodDropdown';
import {
  StackedNormalizedAreaChart,
  LinearXAxis,
  LinearXAxisTickSeries,
  LinearXAxisTickLabel,
  LinearYAxis,
  LinearYAxisTickSeries,
  StackedNormalizedAreaSeries,
  Line,
  Area,
  Gradient,
  GradientStop,
  GridlineSeries,
  Gridline,
} from 'reaviz';

// Component definitions

// SVG Icon Components
const PatientsIcon = ({ className, fill = "#8b5cf6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill={fill} />
    <path d="M10 12C6.68629 12 0 13.6863 0 17V20H20V17C20 13.6863 13.3137 12 10 12Z" fill={fill} />
  </svg>
);

const TestsIcon = ({ className, fill = "#0ea5e9" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2L2 7V9C2 13.5 5.5 17.5 10 18.5C14.5 17.5 18 13.5 18 9V7L10 2Z" fill={fill} />
  </svg>
);

const ResultsIcon = ({ className, fill = "#10b981" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 0L12.2451 6.90983H19.5106L13.6327 11.1803L15.8779 18.0902L10 13.8197L4.12215 18.0902L6.36729 11.1803L0.489435 6.90983H7.75486L10 0Z" fill={fill} />
  </svg>
);

const TrendUpIcon = ({ baseColor, strokeColor, className }) => (
  <svg className={className} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="14" fill={baseColor} fillOpacity="0.4" />
    <path d="M9.50134 12.6111L14.0013 8.16663M14.0013 8.16663L18.5013 12.6111M14.0013 8.16663L14.0013 19.8333" stroke={strokeColor} strokeWidth="2" strokeLinecap="square" />
  </svg>
);

const TrendDownIcon = ({ baseColor, strokeColor, className }) => (
  <svg className={className} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="14" fill={baseColor} fillOpacity="0.4" />
    <path d="M18.4987 15.3889L13.9987 19.8334M13.9987 19.8334L9.49866 15.3889M13.9987 19.8334V8.16671" stroke={strokeColor} strokeWidth="2" strokeLinecap="square" />
  </svg>
);

const SummaryUpArrowIcon = ({ strokeColor }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
    <path d="M5.50134 9.11119L10.0013 4.66675M10.0013 4.66675L14.5013 9.11119M10.0013 4.66675L10.0013 16.3334" stroke={strokeColor} strokeWidth="2" strokeLinecap="square" />
  </svg>
);

const SummaryDownArrowIcon = ({ strokeColor }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
    <path d="M14.4987 11.8888L9.99866 16.3333M9.99866 16.3333L5.49866 11.8888M9.99866 16.3333V4.66658" stroke={strokeColor} strokeWidth="2" strokeLinecap="square" />
  </svg>
);

// Data and Constants
const LEGEND_ITEMS = [
  { name: 'New Patients', color: '#8b5cf6' },
  { name: 'Tests Performed', color: '#0ea5e9' },
  { name: 'Results Completed', color: '#10b981' },
];

const CHART_COLOR_SCHEME = ['#8b5cf6', '#0ea5e9', '#10b981'];

const TIME_PERIOD_OPTIONS = [
  { value: 'last-7-days', label: 'Last 7 Days' },
  { value: 'last-30-days', label: 'Last 30 Days' },
  { value: 'last-90-days', label: 'Last 90 Days' },
];

const now = new Date();
const generateDate = (offsetDays) => {
  const date = new Date(now);
  date.setDate(now.getDate() - offsetDays);
  return date;
};

const validateChartData = (data) => {
  return data.map(series => ({
    ...series,
    data: series.data.map(item => ({
      ...item,
      data: (typeof item.data !== 'number' || isNaN(item.data)) ? 0 : item.data,
    })),
  }));
};

const MonthlyAnalytics = ({ monthlyData = [] }) => {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(TIME_PERIOD_OPTIONS[0].value);

  // Filter data based on selected time period - recalculates when selectedTimePeriod changes
  const filteredData = useMemo(() => {
    if (!monthlyData || monthlyData.length === 0) return [];
    
    // For monthly data, we'll show data points based on the time period
    // Last 7 Days = 1 month (most recent)
    // Last 30 Days = 1 month (most recent)
    // Last 90 Days = 3 months (most recent 3)
    let dataPoints = 1;
    if (selectedTimePeriod === 'last-90-days') {
      dataPoints = 3;
    } else if (selectedTimePeriod === 'last-30-days') {
      dataPoints = 1;
    } else {
      dataPoints = 1; // last-7-days
    }
    
    // Return the last N months based on the time period
    return monthlyData.slice(-dataPoints);
  }, [selectedTimePeriod, monthlyData]);

  // Generate chart data from filtered monthly data
  const generateChartData = () => {
    if (filteredData.length === 0) {
      return [
        { key: 'New Patients', data: [] },
        { key: 'Tests Performed', data: [] },
        { key: 'Results Completed', data: [] },
      ];
    }

    const chartData = [
      {
        key: 'New Patients',
        data: filteredData.map((item, idx) => ({
          key: generateDate((filteredData.length - 1 - idx) * 30),
          data: item.patients || 0,
        })),
      },
      {
        key: 'Tests Performed',
        data: filteredData.map((item, idx) => ({
          key: generateDate((filteredData.length - 1 - idx) * 30),
          data: item.tests || 0,
        })),
      },
      {
        key: 'Results Completed',
        data: filteredData.map((item, idx) => ({
          key: generateDate((filteredData.length - 1 - idx) * 30),
          data: Math.floor((item.tests || 0) * 0.85), // Approximate completed results
        })),
      },
    ];
    return validateChartData(chartData);
  };

  // Generate chart data - recalculates when filteredData or selectedTimePeriod changes
  const chartData = useMemo(() => generateChartData(), [filteredData, selectedTimePeriod]);

  // Calculate stats from filtered data
  const totalPatients = filteredData.reduce((sum, item) => sum + (item.patients || 0), 0);
  const totalTests = filteredData.reduce((sum, item) => sum + (item.tests || 0), 0);
  const avgPatients = filteredData.length > 0 ? Math.round(totalPatients / filteredData.length) : 0;
  const avgTests = filteredData.length > 0 ? Math.round(totalTests / filteredData.length) : 0;

  // Get period label for comparison text
  const getPeriodLabel = () => {
    if (selectedTimePeriod === 'last-7-days') return 'last week';
    if (selectedTimePeriod === 'last-30-days') return 'last month';
    return 'last 3 months';
  };

  const MONTHLY_STATS_DATA = [
    {
      id: 'patients',
      title: 'Total Patients',
      count: totalPatients,
      countFrom: 0,
      comparisonText: filteredData.length > 0 ? `Average ${avgPatients} per period` : 'No data available',
      percentage: 12,
      TrendIconSvg: SummaryUpArrowIcon,
      trendColor: 'text-[#8b5cf6]',
      trendBgColor: 'bg-[#8b5cf6]/20',
    },
    {
      id: 'tests',
      title: 'Total Tests',
      count: totalTests,
      countFrom: 0,
      comparisonText: filteredData.length > 0 ? `Average ${avgTests} per period` : 'No data available',
      percentage: 8,
      TrendIconSvg: SummaryUpArrowIcon,
      trendColor: 'text-[#0ea5e9]',
      trendBgColor: 'bg-[#0ea5e9]/20',
    },
  ];

  const DETAILED_METRICS_DATA = [
    {
      id: 'patients',
      Icon: PatientsIcon,
      label: 'New Patients',
      tooltip: 'New Patients',
      value: filteredData.length > 0 ? `${avgPatients}` : '0',
      TrendIcon: TrendUpIcon,
      trendBaseColor: '#8b5cf6',
      trendStrokeColor: '#a78bfa',
      delay: 0,
      iconFillColor: '#8b5cf6',
    },
    {
      id: 'tests',
      Icon: TestsIcon,
      label: 'Tests Performed',
      tooltip: 'Tests Performed',
      value: filteredData.length > 0 ? `${avgTests}` : '0',
      TrendIcon: TrendUpIcon,
      trendBaseColor: '#0ea5e9',
      trendStrokeColor: '#38bdf8',
      delay: 0.05,
      iconFillColor: '#0ea5e9',
    },
    {
      id: 'results',
      Icon: ResultsIcon,
      label: 'Completion Rate',
      tooltip: 'Completion Rate',
      value: '85%',
      TrendIcon: TrendDownIcon,
      trendBaseColor: '#10b981',
      trendStrokeColor: '#34d399',
      delay: 0.1,
      iconFillColor: '#10b981',
    },
  ];

  return (
    <>
      <style jsx global>{`
        :root {
          --reaviz-tick-fill: #6b7280;
          --reaviz-gridline-stroke: rgba(0, 0, 0, 0.1);
        }
        .dark {
          --reaviz-tick-fill: #9ca3af;
          --reaviz-gridline-stroke: rgba(255, 255, 255, 0.1);
        }
      `}</style>
      <div className="flex flex-col justify-between pt-4 pb-4 bg-white dark:bg-gray-800 rounded-3xl shadow-xl w-full overflow-hidden transition-colors duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-7 pt-6 pb-8">
          <h3 className="text-3xl text-left font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Monthly Overview
          </h3>
          <TimePeriodDropdown
            options={TIME_PERIOD_OPTIONS}
            value={selectedTimePeriod}
            onChange={setSelectedTimePeriod}
          />
        </div>

        {/* Legend */}
        <div className="flex gap-8 w-full pl-8 pr-8 mb-4">
          {LEGEND_ITEMS.map((item) => (
            <div key={item.name} className="flex gap-2 items-center">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-gray-500 dark:text-gray-400 text-xs transition-colors duration-300">{item.name}</span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="reaviz-chart-container h-[280px] px-2">
          <StackedNormalizedAreaChart
            height={280}
            id="monthly-analytics-chart"
            data={chartData}
            xAxis={
              <LinearXAxis
                type="time"
                tickSeries={
                  <LinearXAxisTickSeries
                    label={
                      <LinearXAxisTickLabel
                        format={v => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        fill="var(--reaviz-tick-fill)"
                      />
                    }
                    tickSize={10}
                  />
                }
              />
            }
            yAxis={
              <LinearYAxis
                axisLine={null}
                tickSeries={<LinearYAxisTickSeries line={null} label={null} tickSize={10} />}
              />
            }
            series={
              <StackedNormalizedAreaSeries
                line={<Line strokeWidth={3} glow={{ blur: 10 }} />}
                area={
                  <Area
                    glow={{ blur: 20 }}
                    gradient={
                      <Gradient
                        stops={[
                          <GradientStop key={1} stopOpacity={0} />,
                          <GradientStop key={2} offset="80%" stopOpacity={0.2} />,
                        ]}
                      />
                    }
                  />
                }
                colorScheme={CHART_COLOR_SCHEME}
              />
            }
            gridlines={<GridlineSeries line={<Gridline strokeColor="var(--reaviz-gridline-stroke)" />} />}
          />
        </div>

        {/* Summary Stats */}
        <div className="flex flex-col sm:flex-row w-full pl-8 pr-8 justify-between pb-2 pt-8 gap-4 sm:gap-8">
          {MONTHLY_STATS_DATA.map(stat => (
            <div key={stat.id} className="flex flex-col gap-2 w-full sm:w-1/2">
              <span className="text-xl text-gray-800 dark:text-gray-200 transition-colors duration-300">{stat.title}</span>
              <div className="flex items-center gap-2">
                <CountUp
                  className="font-mono text-4xl font-semibold text-gray-900 dark:text-white transition-colors duration-300"
                  start={stat.countFrom || 0}
                  end={stat.count}
                  duration={2.5}
                />
                <div className={`flex ${stat.trendBgColor} p-1 pl-2 pr-2 items-center rounded-full ${stat.trendColor}`}>
                  <stat.TrendIconSvg strokeColor={stat.trendColor.includes('8b5cf6') ? '#8b5cf6' : '#0ea5e9'} />
                  {stat.percentage}%
                </div>
              </div>
              <span className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
                {stat.comparisonText}
              </span>
            </div>
          ))}
        </div>

        {/* Detailed Metrics List */}
        <div className="flex flex-col pl-8 pr-8 font-mono divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300 mt-4">
          {DETAILED_METRICS_DATA.map((metric) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: metric.delay }}
              className="flex w-full py-4 items-center gap-2"
            >
              <div className="flex flex-row gap-2 items-center text-base w-1/2 text-gray-500 dark:text-gray-400 transition-colors duration-300">
                <metric.Icon fill={metric.iconFillColor} />
                <span className="truncate" title={metric.tooltip}>
                  {metric.label}
                </span>
              </div>
              <div className="flex gap-2 w-1/2 justify-end items-center">
                <span className="font-semibold text-xl text-gray-900 dark:text-white transition-colors duration-300">{metric.value}</span>
                <metric.TrendIcon baseColor={metric.trendBaseColor} strokeColor={metric.trendStrokeColor} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MonthlyAnalytics;

