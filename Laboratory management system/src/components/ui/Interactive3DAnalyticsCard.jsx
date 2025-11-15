import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Sun, Moon } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="relative w-24 h-24">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-t-transparent border-blue-300 dark:border-blue-700 rounded-full animate-spin"></div>
      <div className="absolute top-2 left-2 w-[calc(100%-16px)] h-[calc(100%-32px)] border-4 border-t-transparent border-blue-400 dark:border-blue-600 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
      <div className="absolute top-4 left-4 w-[calc(100%-32px)] h-[calc(100%-64px)] border-4 border-t-transparent border-blue-500 dark:border-blue-500 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
    </div>
  </div>
);

const ErrorState = ({ onRetry }) => (
  <div className="flex flex-col justify-center items-center h-full gap-4 text-red-600 dark:text-red-400">
    <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 17.01L12.01 16.9989" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <p className="font-medium">Failed to load data</p>
    <button 
      onClick={onRetry}
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:ring-offset-gray-900"
    >
      Retry
    </button>
  </div>
);

const AnimatedBar = ({ value, index, maxValue, isDarkMode, label }) => {
  const barHeight = `${(value / maxValue) * 100}%`;
  
  return (
    <motion.div
      className="relative h-full w-full flex items-end group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <motion.div 
        className={`w-full rounded-t-md ${isDarkMode ? 'bg-gradient-to-t from-indigo-600 to-violet-400' : 'bg-gradient-to-t from-blue-500 to-cyan-300'}`}
        initial={{ height: 0 }}
        animate={{ height: barHeight }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: index * 0.1 
        }}
      >
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
          {value.toLocaleString()}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Interactive3DAnalyticsCard = ({ 
  title = "Test Trends", 
  subtitle = "Last 7 Days",
  data = [],
  isLoading: externalLoading = false,
  onRetry
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(externalLoading || true);
  const [hasError, setHasError] = useState(false);
  const [chartData, setChartData] = useState(data);
  const [trend, setTrend] = useState(0);

  // Load data if not provided
  useEffect(() => {
    if (data.length > 0) {
      setChartData(data);
      setIsLoading(false);
      
      // Calculate trend if data has 'value' or 'tests' property
      const firstValue = data[0]?.value || data[0]?.tests || 0;
      const lastValue = data[data.length - 1]?.value || data[data.length - 1]?.tests || 0;
      if (firstValue > 0) {
        const trendPercent = ((lastValue - firstValue) / firstValue) * 100;
        setTrend(trendPercent);
      }
    } else {
      // Mock data loading
      const loadData = async () => {
        setIsLoading(true);
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const mockData = [
            { name: 'Mon', value: 12 },
            { name: 'Tue', value: 19 },
            { name: 'Wed', value: 15 },
            { name: 'Thu', value: 22 },
            { name: 'Fri', value: 18 },
            { name: 'Sat', value: 10 },
            { name: 'Sun', value: 8 },
          ];
          
          setChartData(mockData);
          const firstValue = mockData[0].value;
          const lastValue = mockData[mockData.length - 1].value;
          const trendPercent = ((lastValue - firstValue) / firstValue) * 100;
          setTrend(trendPercent);
          
          setHasError(false);
        } catch (err) {
          console.error("Error loading data:", err);
          setHasError(true);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadData();
    }
  }, [data]);

  const handleMouseMove = (e) => {
    if (!isHovered) return;
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    const mouseX = e.clientX - cardCenterX;
    const mouseY = e.clientY - cardCenterY;
    
    const rotationY = (mouseX / (rect.width / 2)) * 5;
    const rotationX = -(mouseY / (rect.height / 2)) * 5;
    
    setRotation({ x: rotationX, y: rotationY });
  };
  
  const resetRotation = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      setHasError(false);
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  // Get max value from data
  const maxValue = chartData.length > 0 
    ? Math.max(...chartData.map(item => item.value || item.tests || item.results || 0))
    : 100;

  // Calculate totals
  const totalValue = chartData.reduce((sum, item) => sum + (item.value || item.tests || item.results || 0), 0);
  const averageValue = chartData.length > 0 ? Math.round(totalValue / chartData.length) : 0;

  return (
    <div className={`font-sans ${isDarkMode ? 'dark' : ''}`}>
      <div 
        className={`
          relative w-full h-96 rounded-2xl 
          p-6 overflow-hidden group cursor-default
          bg-gradient-to-br from-white to-gray-100
          dark:from-gray-900 dark:to-gray-800
          shadow-[0_20px_50px_rgba(0,0,0,0.1)]
          dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]
          transition-all duration-300
          border border-gray-200 dark:border-gray-700
        `}
        style={{ 
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.02 : 1})`,
          transition: isHovered ? 'none' : 'transform 0.5s ease-out'
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={resetRotation}
      >
        {/* Animated background gradients */}
        <div className="absolute inset-0 opacity-30 dark:opacity-20 overflow-hidden rounded-2xl">
          <div className="absolute -inset-[100%] bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 dark:from-blue-600 dark:via-violet-600 dark:to-purple-700 animate-spin blur-3xl" style={{ animationDuration: '20s' }}></div>
        </div>
        
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl"></div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            </div>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Main content */}
          <div className="flex-1 overflow-hidden rounded-lg bg-gray-50/70 dark:bg-gray-800/50 p-4 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <LoadingSpinner />
                </motion.div>
              ) : hasError ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <ErrorState onRetry={handleRetry} />
                </motion.div>
              ) : (
                <motion.div
                  key="data"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col"
                >
                  {/* Chart */}
                  <div className="flex-1 flex items-end gap-2 group">
                    {chartData.map((item, index) => {
                      const value = item.value || item.tests || item.results || 0;
                      return (
                        <div key={item.name || index} className="flex-1 h-full flex flex-col justify-end">
                          <AnimatedBar 
                            value={value} 
                            index={index} 
                            maxValue={maxValue}
                            isDarkMode={isDarkMode}
                            label={item.name}
                          />
                          <div className="text-xs text-center mt-2 text-gray-600 dark:text-gray-400">
                            {item.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Footer stats */}
          {!isLoading && !hasError && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              <motion.div 
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-3 shadow-sm"
                whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {totalValue.toLocaleString()}
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-3 shadow-sm"
                whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">Average</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {averageValue.toLocaleString()}
                </p>
              </motion.div>
              
              <motion.div 
                className={`
                  backdrop-blur-sm rounded-lg p-3 shadow-sm
                  ${trend >= 0 
                    ? 'bg-green-50/70 dark:bg-green-900/20' 
                    : 'bg-red-50/70 dark:bg-red-900/20'}
                `}
                whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">Growth</p>
                <div className={`flex items-center gap-1 text-lg font-bold ${
                  trend >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {trend >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{Math.abs(trend).toFixed(1)}%</span>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interactive3DAnalyticsCard;

