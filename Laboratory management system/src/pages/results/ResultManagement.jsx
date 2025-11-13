import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { IoAdd, IoSearch, IoCheckmarkCircle, IoCloseCircle, IoDocumentText, IoDownload } from 'react-icons/io5';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Table from '../../components/common/Table';
import FormField from '../../components/forms/FormField';
import useNotificationStore from '../../store/notificationStore';
import useAuthStore from '../../store/authStore';
import mockDataService from '../../services/mockData';

const ResultManagement = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const { addNotification } = useNotificationStore();
  const { user: currentUser } = useAuthStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    loadResults();
  }, []);

  useEffect(() => {
    filterResults();
  }, [searchTerm, results]);

  const loadResults = () => {
    const allResults = mockDataService.getResults();
    setResults(allResults);
    setFilteredResults(allResults);
  };

  const filterResults = () => {
    if (!searchTerm) {
      setFilteredResults(results);
      return;
    }
    const filtered = results.filter(
      (r) =>
        r.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.testName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResults(filtered);
  };

  const handleCreateResult = (data) => {
    const newResult = mockDataService.createResult({
      ...data,
      status: 'pending',
      isAbnormal: false,
      enteredBy: currentUser?.name,
    });
    mockDataService.addAuditLog('CREATE_RESULT', currentUser?.id, { resultId: newResult.id });
    addNotification({ message: 'Result entered successfully', type: 'success' });
    loadResults();
    setIsModalOpen(false);
    reset();
  };

  const handleUpdateResult = (data) => {
    mockDataService.updateResult(editingResult.id, {
      ...data,
      updatedBy: currentUser?.name,
      updatedAt: new Date().toISOString(),
    });
    mockDataService.addAuditLog('UPDATE_RESULT', currentUser?.id, { resultId: editingResult.id });
    addNotification({ message: 'Result updated successfully', type: 'success' });
    loadResults();
    setIsModalOpen(false);
    setEditingResult(null);
    reset();
  };

  const handleApproveResult = (resultId) => {
    mockDataService.updateResult(resultId, {
      status: 'approved',
      approvedBy: currentUser?.name,
      approvedAt: new Date().toISOString(),
    });
    mockDataService.addAuditLog('APPROVE_RESULT', currentUser?.id, { resultId });
    addNotification({ message: 'Result approved successfully', type: 'success' });
    loadResults();
  };

  const handleRejectResult = (resultId) => {
    mockDataService.updateResult(resultId, {
      status: 'rejected',
      rejectedBy: currentUser?.name,
      rejectedAt: new Date().toISOString(),
    });
    mockDataService.addAuditLog('REJECT_RESULT', currentUser?.id, { resultId });
    addNotification({ message: 'Result rejected', type: 'warning' });
    loadResults();
  };

  const handleGeneratePDF = (result) => {
    // Mock PDF generation
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Test Result Report - ${result.testName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #0ea5e9; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Laboratory Test Result Report</h1>
          <p><strong>Patient ID:</strong> ${result.patientId}</p>
          <p><strong>Test Name:</strong> ${result.testName}</p>
          <p><strong>Date:</strong> ${new Date(result.createdAt).toLocaleDateString()}</p>
          <table>
            <tr><th>Parameter</th><th>Value</th><th>Unit</th><th>Reference Range</th></tr>
            <tr><td>Result</td><td>${result.value || 'N/A'}</td><td>${result.unit || 'N/A'}</td><td>${result.referenceRange || 'N/A'}</td></tr>
          </table>
          ${result.comments ? `<p><strong>Comments:</strong> ${result.comments}</p>` : ''}
          <p><strong>Status:</strong> ${result.status}</p>
          ${result.approvedBy ? `<p><strong>Approved By:</strong> ${result.approvedBy}</p>` : ''}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    };
    return colors[status] || colors.pending;
  };

  const getAbnormalColor = (isAbnormal) => {
    return isAbnormal
      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
  };

  // Calculate statistics
  const stats = {
    total: results.length,
    pending: results.filter(r => r.status === 'pending').length,
    approved: results.filter(r => r.status === 'approved').length,
    abnormal: results.filter(r => r.isAbnormal).length,
  };

  const columns = [
    {
      header: 'Result ID',
      accessor: 'id',
    },
    {
      header: 'Patient ID',
      accessor: 'patientId',
    },
    {
      header: 'Test Name',
      accessor: 'testName',
    },
    {
      header: 'Value',
      accessor: 'value',
      render: (value, row) => (
        <div>
          <span className={row.isAbnormal ? 'font-bold text-red-600 dark:text-red-400' : ''}>
            {value} {row.unit}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      header: 'Abnormal',
      accessor: 'isAbnormal',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAbnormalColor(value)}`}>
          {value ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingResult(row);
              reset(row);
              setIsModalOpen(true);
            }}
            className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            title="Edit"
          >
            <IoDocumentText className="w-4 h-4" />
          </button>
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => handleApproveResult(value)}
                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                title="Approve"
              >
                <IoCheckmarkCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleRejectResult(value)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Reject"
              >
                <IoCloseCircle className="w-4 h-4" />
              </button>
            </>
          )}
          {row.status === 'approved' && (
            <button
              onClick={() => handleGeneratePDF(row)}
              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Generate PDF"
            >
              <IoDownload className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Result Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Enter, validate, and approve test results
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingResult(null);
            reset();
            setIsModalOpen(true);
          }}
          variant="primary"
        >
          <IoAdd className="w-5 h-5 mr-2" />
          Enter Result
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Results</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {stats.total}
              </p>
            </div>
            <IoDocumentText className="w-12 h-12 text-primary-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Approval</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
                {stats.pending}
              </p>
            </div>
            <IoTime className="w-12 h-12 text-yellow-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                {stats.approved}
              </p>
            </div>
            <IoCheckmarkCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Abnormal Results</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
                {stats.abnormal}
              </p>
            </div>
            <IoCloseCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search results by ID, patient ID, or test name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="card p-0">
        <Table
          columns={columns}
          data={filteredResults}
          emptyMessage="No results found"
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingResult(null);
          reset();
        }}
        title={editingResult ? 'Edit Result' : 'Enter New Result'}
        size="md"
      >
        <form
          onSubmit={handleSubmit(editingResult ? handleUpdateResult : handleCreateResult)}
          className="space-y-4"
        >
          <FormField
            label="Patient ID"
            name="patientId"
            register={register}
            error={errors.patientId}
            placeholder="PAT-12345"
            required
          />
          <FormField
            label="Test Name"
            name="testName"
            register={register}
            error={errors.testName}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Value"
              name="value"
              type="number"
              register={register}
              error={errors.value}
              required
            />
            <FormField
              label="Unit"
              name="unit"
              register={register}
              error={errors.unit}
            />
          </div>
          <FormField
            label="Reference Range"
            name="referenceRange"
            register={register}
            error={errors.referenceRange}
            placeholder="e.g., 70-100"
          />
          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('isAbnormal')}
                defaultChecked={editingResult?.isAbnormal}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Flag as Abnormal</span>
            </label>
          </div>
          <FormField
            label="Comments"
            name="comments"
            register={register}
            error={errors.comments}
            type="textarea"
            placeholder="Enter any additional comments or notes..."
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingResult(null);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingResult ? 'Update' : 'Enter Result'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ResultManagement;

