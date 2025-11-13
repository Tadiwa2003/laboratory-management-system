import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { IoAdd, IoSearch, IoCheckmarkCircle, IoCloseCircle, IoTime, IoClipboard } from 'react-icons/io5';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Table from '../../components/common/Table';
import FormField from '../../components/forms/FormField';
import useNotificationStore from '../../store/notificationStore';
import useAuthStore from '../../store/authStore';
import mockDataService from '../../services/mockData';

const TEST_TYPES = ['Complete Blood Count', 'Lipid Panel', 'Liver Function', 'Kidney Function', 'Thyroid Function', 'Glucose Test', 'Urinalysis', 'Culture'];
const QC_STATUS = ['Pass', 'Fail', 'Pending'];

const TestingProcess = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [qcModalOpen, setQcModalOpen] = useState(false);
  const { addNotification } = useNotificationStore();
  const { user: currentUser } = useAuthStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    loadTests();
  }, []);

  useEffect(() => {
    filterTests();
  }, [searchTerm, tests]);

  const loadTests = () => {
    const allTests = mockDataService.getTests();
    setTests(allTests);
    setFilteredTests(allTests);
  };

  const filterTests = () => {
    if (!searchTerm) {
      setFilteredTests(tests);
      return;
    }
    const filtered = tests.filter(
      (t) =>
        t.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.testType?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTests(filtered);
  };

  const handleCreateTest = (data) => {
    const newTest = mockDataService.createTest({
      ...data,
      status: 'pending',
      qcStatus: 'Pending',
      technician: currentUser?.name,
    });
    mockDataService.addAuditLog('CREATE_TEST', currentUser?.id, { testId: newTest.id });
    addNotification({ message: 'Test order created successfully', type: 'success' });
    loadTests();
    setIsModalOpen(false);
    reset();
  };

  const handleUpdateTest = (testId, updates) => {
    mockDataService.updateTest(testId, updates);
    mockDataService.addAuditLog('UPDATE_TEST', currentUser?.id, { testId });
    addNotification({ message: 'Test updated successfully', type: 'success' });
    loadTests();
  };

  const handleQCUpdate = (data) => {
    handleUpdateTest(selectedTest.id, {
      qcStatus: data.qcStatus,
      qcNotes: data.qcNotes,
      qcDate: new Date().toISOString(),
      qcTechnician: currentUser?.name,
    });
    setQcModalOpen(false);
    setSelectedTest(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    };
    return colors[status] || colors.pending;
  };

  const getQCColor = (qcStatus) => {
    const colors = {
      Pass: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      Fail: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    };
    return colors[qcStatus] || colors.Pending;
  };

  const columns = [
    {
      header: 'Test ID',
      accessor: 'id',
    },
    {
      header: 'Patient ID',
      accessor: 'patientId',
    },
    {
      header: 'Test Type',
      accessor: 'testType',
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
      header: 'QC Status',
      accessor: 'qcStatus',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQCColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      header: 'Technician',
      accessor: 'technician',
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedTest(row);
              setQcModalOpen(true);
            }}
            className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            title="Update QC"
          >
            <IoClipboard className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleUpdateTest(value, { status: 'processing' })}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Start Processing"
          >
            <IoTime className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleUpdateTest(value, { status: 'completed' })}
            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="Mark Complete"
          >
            <IoCheckmarkCircle className="w-4 h-4" />
          </button>
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
            Testing Process
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage test orders and quality control
          </p>
        </div>
        <Button
          onClick={() => {
            reset();
            setIsModalOpen(true);
          }}
          variant="primary"
        >
          <IoAdd className="w-5 h-5 mr-2" />
          Create Test Order
        </Button>
      </div>

      {/* QC Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">QC Passed</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                {tests.filter(t => t.qcStatus === 'Pass').length}
              </p>
            </div>
            <IoCheckmarkCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">QC Failed</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
                {tests.filter(t => t.qcStatus === 'Fail').length}
              </p>
            </div>
            <IoCloseCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending QC</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
                {tests.filter(t => t.qcStatus === 'Pending').length}
              </p>
            </div>
            <IoTime className="w-12 h-12 text-yellow-500" />
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
              placeholder="Search tests by ID, patient ID, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Tests Table */}
      <div className="card p-0">
        <Table
          columns={columns}
          data={filteredTests}
          emptyMessage="No tests found"
        />
      </div>

      {/* Create Test Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Create Test Order"
        size="md"
      >
        <form onSubmit={handleSubmit(handleCreateTest)} className="space-y-4">
          <FormField
            label="Patient ID"
            name="patientId"
            register={register}
            error={errors.patientId}
            placeholder="PAT-12345"
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Test Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register('testType', { required: 'Test type is required' })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select test type</option>
              {TEST_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.testType && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.testType.message}
              </p>
            )}
          </div>
          <FormField
            label="Order Date"
            name="orderDate"
            type="datetime-local"
            register={register}
            error={errors.orderDate}
            required
          />
          <FormField
            label="Priority"
            name="priority"
            register={register}
            error={errors.priority}
            placeholder="Normal, Urgent, Stat"
          />
          <FormField
            label="Notes"
            name="notes"
            register={register}
            error={errors.notes}
            type="textarea"
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Order
            </Button>
          </div>
        </form>
      </Modal>

      {/* QC Modal */}
      <Modal
        isOpen={qcModalOpen}
        onClose={() => {
          setQcModalOpen(false);
          setSelectedTest(null);
        }}
        title="Quality Control Update"
        size="md"
      >
        {selectedTest && (
          <form onSubmit={handleSubmit(handleQCUpdate)} className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                QC Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register('qcStatus', { required: 'QC status is required' })}
                defaultValue={selectedTest.qcStatus}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {QC_STATUS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <FormField
              label="QC Notes"
              name="qcNotes"
              register={register}
              error={errors.qcNotes}
              type="textarea"
              placeholder="Enter QC observations and notes..."
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setQcModalOpen(false);
                  setSelectedTest(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Update QC
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default TestingProcess;

