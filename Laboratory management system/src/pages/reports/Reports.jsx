import { useState, useEffect } from 'react';
import { Search, Download, FileText, Calendar, Filter } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import mockDataService from '../../services/mockData';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [searchTerm, reports]);

  const loadReports = () => {
    const results = mockDataService.getResults();
    const patients = mockDataService.getPatients();
    
    const reportsList = results
      .filter(r => r.status === 'approved')
      .map(result => ({
        id: result.id,
        reportId: result.id,
        patientId: result.patientId,
        patientName: patients.find(p => p.id === result.patientId)?.name || 'Unknown',
        testName: result.testName,
        date: result.createdAt,
        approvedBy: result.approvedBy || 'System',
        status: result.status,
      }));
    
    setReports(reportsList);
    setFilteredReports(reportsList);
  };

  const filterReports = () => {
    if (!searchTerm) {
      setFilteredReports(reports);
      return;
    }
    const filtered = reports.filter(
      (r) =>
        r.reportId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.testName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReports(filtered);
  };

  const handleExportPDF = (reportId) => {
    // Mock PDF export
    const report = reports.find(r => r.id === reportId);
    if (report) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Test Report - ${report.testName}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              h1 { color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px; }
              .info { margin: 20px 0; }
              .info p { margin: 5px 0; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
            </style>
          </head>
          <body>
            <h1>Laboratory Test Report</h1>
            <div class="info">
              <p><strong>Report ID:</strong> ${report.reportId}</p>
              <p><strong>Patient:</strong> ${report.patientName}</p>
              <p><strong>Test Name:</strong> ${report.testName}</p>
              <p><strong>Date:</strong> ${new Date(report.date).toLocaleDateString()}</p>
              <p><strong>Approved By:</strong> ${report.approvedBy}</p>
            </div>
            <p style="margin-top: 30px; color: #666;">
              This is a mock PDF export. In production, this would generate a proper PDF document.
            </p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const columns = [
    {
      header: 'Report ID',
      accessor: 'reportId',
    },
    {
      header: 'Patient',
      accessor: 'patientName',
    },
    {
      header: 'Test Name',
      accessor: 'testName',
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      header: 'Approved By',
      accessor: 'approvedBy',
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (value) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleExportPDF(value)}
        >
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and export finalized test reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="secondary">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search reports by ID, patient name, or test name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Reports</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {reports.length}
              </p>
            </div>
            <FileText className="w-12 h-12 text-primary-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {reports.filter(r => {
                  const reportDate = new Date(r.date);
                  const now = new Date();
                  return reportDate.getMonth() === now.getMonth() && 
                         reportDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <Calendar className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ready to Export</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {reports.length}
              </p>
            </div>
            <Download className="w-12 h-12 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="card p-0">
        <Table
          columns={columns}
          data={filteredReports}
          emptyMessage="No reports found"
        />
      </div>
    </div>
  );
};

export default Reports;

