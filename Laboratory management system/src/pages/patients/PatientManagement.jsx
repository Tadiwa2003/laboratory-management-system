import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, User } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Table from '../../components/common/Table';
import FormField from '../../components/forms/FormField';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import useNotificationStore from '../../store/notificationStore';
import useAuthStore from '../../store/authStore';
import mockDataService from '../../services/mockData';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const { addNotification } = useNotificationStore();
  const { user: currentUser } = useAuthStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchTerm, patients]);

  const loadPatients = () => {
    const allPatients = mockDataService.getPatients();
    setPatients(allPatients);
    setFilteredPatients(allPatients);
  };

  const filterPatients = () => {
    if (!searchTerm) {
      setFilteredPatients(patients);
      return;
    }
    const filtered = patients.filter(
      (p) =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone?.includes(searchTerm)
    );
    setFilteredPatients(filtered);
  };

  const handleCreatePatient = (data) => {
    const newPatient = mockDataService.createPatient({
      ...data,
      patientId: `PAT-${Date.now()}`,
    });
    mockDataService.addAuditLog('CREATE_PATIENT', currentUser?.id, { patientId: newPatient.id });
    addNotification({ message: 'Patient registered successfully', type: 'success' });
    loadPatients();
    setIsModalOpen(false);
    reset();
  };

  const handleUpdatePatient = (data) => {
    mockDataService.updatePatient(editingPatient.id, data);
    mockDataService.addAuditLog('UPDATE_PATIENT', currentUser?.id, { patientId: editingPatient.id });
    addNotification({ message: 'Patient updated successfully', type: 'success' });
    loadPatients();
    setIsModalOpen(false);
    setEditingPatient(null);
    reset();
  };

  const handleDeletePatient = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      mockDataService.deletePatient(patientId);
      mockDataService.addAuditLog('DELETE_PATIENT', currentUser?.id, { patientId });
      addNotification({ message: 'Patient deleted successfully', type: 'success' });
      loadPatients();
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    reset(patient);
    setIsModalOpen(true);
  };

  const handleViewHistory = (patient) => {
    setSelectedPatient(patient);
    setShowHistory(true);
  };

  const getPatientHistory = (patientId) => {
    const tests = mockDataService.getTests();
    const results = mockDataService.getResults();
    return {
      tests: tests.filter(t => t.patientId === patientId),
      results: results.filter(r => r.patientId === patientId),
    };
  };

  const columns = [
    {
      header: 'Patient ID',
      accessor: 'patientId',
    },
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Date of Birth',
      accessor: 'dateOfBirth',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
    },
    {
      header: 'Gender',
      accessor: 'gender',
    },
    {
      header: 'Contact',
      accessor: 'phone',
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewHistory(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeletePatient(value)}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const history = selectedPatient ? getPatientHistory(selectedPatient.id) : { tests: [], results: [] };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Patient Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Register and manage patient records
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingPatient(null);
            reset();
            setIsModalOpen(true);
          }}
          variant="primary"
        >
          <Plus className="w-5 h-5" />
          Register Patient
        </Button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search patients by name, ID, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="card p-0">
        <Table
          columns={columns}
          data={filteredPatients}
          emptyMessage="No patients found"
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPatient(null);
          reset();
        }}
        title={editingPatient ? 'Edit Patient' : 'Register New Patient'}
        size="lg"
      >
        <form
          onSubmit={handleSubmit(editingPatient ? handleUpdatePatient : handleCreatePatient)}
          className="space-y-4"
        >
          <FormField
            label="Full Name"
            name="name"
            register={register}
            error={errors.name}
            required
          />
          <FormField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            register={register}
            error={errors.dateOfBirth}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              {...register('gender', { required: 'Gender is required' })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.gender.message}
              </p>
            )}
          </div>
          <FormField
            label="Email"
            name="email"
            type="email"
            register={register}
            error={errors.email}
          />
          <FormField
            label="Phone"
            name="phone"
            register={register}
            error={errors.phone}
            required
          />
          <FormField
            label="Address"
            name="address"
            register={register}
            error={errors.address}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingPatient(null);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingPatient ? 'Update' : 'Register'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* History Modal */}
      <Modal
        isOpen={showHistory}
        onClose={() => {
          setShowHistory(false);
          setSelectedPatient(null);
        }}
        title={`Patient History - ${selectedPatient?.name || ''}`}
        size="xl"
      >
        {selectedPatient && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Test History
              </h3>
              <div className="space-y-3">
                {history.tests.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No tests found</p>
                ) : (
                  history.tests.map((test) => (
                    <div
                      key={test.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {test.testType}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Status: {test.status} | Date: {new Date(test.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Results History
              </h3>
              <div className="space-y-3">
                {history.results.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No results found</p>
                ) : (
                  history.results.map((result) => (
                    <div
                      key={result.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {result.testName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Status: {result.status} | Date: {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PatientManagement;

