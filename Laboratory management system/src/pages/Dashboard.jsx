import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  User, 
  FlaskConical, 
  FileText,
  TrendingUp,
  Clock,
  Activity
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  LabelList,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../components/ui/PieChart';
import { AnimatedChartCard, ChartCardBody, ChartCardTitle } from '../components/ui/AnimatedChartCard';
import MonthlyAnalytics from '../components/ui/MonthlyAnalytics';
import useAuthStore from '../store/authStore';
import mockDataService from '../services/mockData';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalPatients: 0,
    totalSpecimens: 0,
    pendingTests: 0,
    completedResults: 0,
  });

  useEffect(() => {
    const users = mockDataService.getUsers();
    const patients = mockDataService.getPatients();
    const specimens = mockDataService.getSpecimens();
    const tests = mockDataService.getTests();
    const results = mockDataService.getResults();

    setStats({
      totalUsers: users.length,
      activeUsers: users.filter(u => u.active).length,
      totalPatients: patients.length,
      totalSpecimens: specimens.length,
      pendingTests: tests.filter(t => t.status === 'pending').length,
      completedResults: results.filter(r => r.status === 'approved').length,
    });
  }, []);

  const cards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: User,
      color: 'bg-green-500',
      change: '+5%',
    },
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: User,
      color: 'bg-purple-500',
      change: '+8%',
    },
    {
      title: 'Specimens',
      value: stats.totalSpecimens,
      icon: FlaskConical,
      color: 'bg-orange-500',
      change: '+3%',
    },
    {
      title: 'Pending Tests',
      value: stats.pendingTests,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '-2%',
    },
    {
      title: 'Completed Results',
      value: stats.completedResults,
      icon: FileText,
      color: 'bg-green-500',
      change: '+15%',
    },
  ];

  // Mock chart data
  const testTrendData = [
    { name: 'Mon', tests: 12, results: 8 },
    { name: 'Tue', tests: 19, results: 15 },
    { name: 'Wed', tests: 15, results: 12 },
    { name: 'Thu', tests: 22, results: 18 },
    { name: 'Fri', tests: 18, results: 14 },
    { name: 'Sat', tests: 10, results: 8 },
    { name: 'Sun', tests: 8, results: 6 },
  ];

  const statusData = [
    { name: 'Completed', value: stats.completedResults, fill: '#10b981' },
    { name: 'Pending', value: stats.pendingTests, fill: '#f59e0b' },
    { name: 'In Progress', value: 5, fill: '#3b82f6' },
  ];

  const chartConfig = {
    value: {
      label: "Tests",
    },
    completed: {
      label: "Completed",
      color: "#10b981",
    },
    pending: {
      label: "Pending",
      color: "#f59e0b",
    },
    inProgress: {
      label: "In Progress",
      color: "#3b82f6",
    },
  };

  const monthlyData = [
    { name: 'Jan', patients: 45, tests: 120 },
    { name: 'Feb', patients: 52, tests: 135 },
    { name: 'Mar', patients: 48, tests: 130 },
    { name: 'Apr', patients: 61, tests: 145 },
    { name: 'May', patients: 55, tests: 150 },
    { name: 'Jun', patients: 67, tests: 170 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back, {user?.name}. Here's an overview of your laboratory.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const isNegative = card.change.startsWith('-');
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {card.value}
                  </p>
                  <p className={`text-sm mt-1 flex items-center gap-1 ${
                    isNegative 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {isNegative ? (
                      <TrendingUp className="w-4 h-4 rotate-180" />
                    ) : (
                      <TrendingUp className="w-4 h-4" />
                    )}
                    {card.change}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-lg flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white stroke-2" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Test Trends (Last 7 Days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={testTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="tests" stroke="#3b82f6" name="Tests Ordered" />
              <Line type="monotone" dataKey="results" stroke="#10b981" name="Results Completed" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle className="flex items-center gap-2 flex-wrap justify-center">
              Test Status Distribution
              <Badge
                variant="outline"
                className="text-green-500 bg-green-500/10 border-none"
              >
                <TrendingUp className="h-4 w-4" />
                <span>5.2%</span>
              </Badge>
            </CardTitle>
            <CardDescription className="text-center">Current test status overview</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="value" hideLabel />}
                />
                <Pie
                  data={statusData}
                  innerRadius={50}
                  dataKey="value"
                  outerRadius={90}
                  cornerRadius={8}
                  paddingAngle={4}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList
                    dataKey="value"
                    stroke="none"
                    fontSize={12}
                    fontWeight={500}
                    fill="currentColor"
                    formatter={(value) => value.toString()}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <MonthlyAnalytics monthlyData={monthlyData} />
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {mockDataService.getAuditLogs().slice(-5).reverse().map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {log.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full text-left p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">
              <p className="font-medium text-primary-900 dark:text-primary-100">
                Register New Patient
              </p>
              <p className="text-sm text-primary-600 dark:text-primary-400">
                Add a new patient to the system
              </p>
            </button>
            <button className="w-full text-left p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <p className="font-medium text-green-900 dark:text-green-100">
                Collect Specimen
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Record a new specimen collection
              </p>
            </button>
            <button className="w-full text-left p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
              <p className="font-medium text-orange-900 dark:text-orange-100">
                Process Test
              </p>
              <p className="text-sm text-orange-600 dark:text-orange-400">
                Start processing a new test
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

