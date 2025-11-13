import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { IoAdd, IoSearch, IoFlask, IoLocation, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import FormField from '../../components/forms/FormField';
import useNotificationStore from '../../store/notificationStore';
import useAuthStore from '../../store/authStore';
import mockDataService from '../../services/mockData';

const SPECIMEN_TYPES = ['Blood', 'Urine', 'Stool', 'Tissue', 'Swab', 'Other'];
const STORAGE_CONDITIONS = ['Room Temperature', 'Refrigerated (2-8°C)', 'Frozen (-20°C)', 'Deep Freeze (-80°C)'];

const SpecimenManagement = () => {
  const [specimens, setSpecimens] = useState([]);
  const [filteredSpecimens, setFilteredSpecimens] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpecimen, setSelectedSpecimen] = useState(null);
  const { addNotification } = useNotificationStore();
  const { user: currentUser } = useAuthStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    loadSpecimens();
  }, []);

  useEffect(() => {
    filterSpecimens();
  }, [searchTerm, specimens]);

  const loadSpecimens = () => {
    const allSpecimens = mockDataService.getSpecimens();
    setSpecimens(allSpecimens);
    setFilteredSpecimens(allSpecimens);
  };

  const filterSpecimens = () => {
    if (!searchTerm) {
      setFilteredSpecimens(specimens);
      return;
    }
    const filtered = specimens.filter(
      (s) =>
        s.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSpecimens(filtered);
  };

  const handleCreateSpecimen = (data) => {
    const newSpecimen = mockDataService.createSpecimen({
      ...data,
      status: 'collected',
      condition: 'normal',
      location: 'Storage A1',
    });
    mockDataService.addAuditLog('CREATE_SPECIMEN', currentUser?.id, { specimenId: newSpecimen.id });
    addNotification({ message: 'Specimen collected successfully', type: 'success' });
    loadSpecimens();
    setIsModalOpen(false);
    reset();
  };

  const handleUpdateSpecimen = (specimenId, updates) => {
    mockDataService.updateSpecimen(specimenId, updates);
    mockDataService.addAuditLog('UPDATE_SPECIMEN', currentUser?.id, { specimenId });
    addNotification({ message: 'Specimen updated successfully', type: 'success' });
    loadSpecimens();
  };

  const getStatusColor = (status) => {
    const colors = {
      collected: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      processing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      stored: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      disposed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return colors[status] || colors.collected;
  };

  const getConditionColor = (condition) => {
    return condition === 'normal'
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Specimen Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Collect, track, and manage specimens
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
          Collect Specimen
        </Button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search specimens by ID, patient ID, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Specimens Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpecimens.map((specimen) => (
          <motion.div
            key={specimen.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedSpecimen(specimen)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <IoFlask className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {specimen.id}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {specimen.type}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(specimen.status)}`}>
                  {specimen.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Condition:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(specimen.condition)}`}>
                  {specimen.condition}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <IoLocation className="w-4 h-4" />
                <span>{specimen.location || 'Not stored'}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Collected: {new Date(specimen.createdAt).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}
        {filteredSpecimens.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            No specimens found
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Collect New Specimen"
        size="md"
      >
        <form onSubmit={handleSubmit(handleCreateSpecimen)} className="space-y-4">
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
              Specimen Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register('type', { required: 'Specimen type is required' })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select type</option>
              {SPECIMEN_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.type.message}
              </p>
            )}
          </div>
          <FormField
            label="Collection Date"
            name="collectionDate"
            type="datetime-local"
            register={register}
            error={errors.collectionDate}
            required
          />
          <FormField
            label="Collector Name"
            name="collectorName"
            register={register}
            error={errors.collectorName}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Storage Condition
            </label>
            <select
              {...register('storageCondition')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {STORAGE_CONDITIONS.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>
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
              Collect
            </Button>
          </div>
        </form>
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedSpecimen}
        onClose={() => setSelectedSpecimen(null)}
        title={`Specimen Details - ${selectedSpecimen?.id}`}
        size="md"
      >
        {selectedSpecimen && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Patient ID</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedSpecimen.patientId}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedSpecimen.type}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSpecimen.status)}`}>
                  {selectedSpecimen.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Condition</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(selectedSpecimen.condition)}`}>
                  {selectedSpecimen.condition}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedSpecimen.location || 'Not stored'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Collection Date</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {new Date(selectedSpecimen.collectionDate || selectedSpecimen.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  handleUpdateSpecimen(selectedSpecimen.id, { status: 'processing' });
                  setSelectedSpecimen(null);
                }}
              >
                Mark as Processing
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => {
                  handleUpdateSpecimen(selectedSpecimen.id, { status: 'stored', location: 'Storage A1' });
                  setSelectedSpecimen(null);
                }}
              >
                Mark as Stored
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SpecimenManagement;

