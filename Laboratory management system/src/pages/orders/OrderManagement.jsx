import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Table from '../../components/common/Table';
import FormField from '../../components/forms/FormField';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import useNotificationStore from '../../store/notificationStore';
import useAuthStore from '../../store/authStore';
import mockDataService from '../../services/mockData';

const STATUS_COLORS = {
  pending: 'badge-warning',
  'in-progress': 'badge-info',
  completed: 'badge-success',
  cancelled: 'badge-error',
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const { addNotification } = useNotificationStore();
  const { user: currentUser } = useAuthStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, orders]);

  const loadOrders = () => {
    // Get orders from tests or create mock orders
    const tests = mockDataService.getTests();
    const patients = mockDataService.getPatients();
    
    const ordersList = tests.map(test => ({
      id: test.id,
      orderId: test.id,
      patientId: test.patientId,
      patientName: patients.find(p => p.id === test.patientId)?.name || 'Unknown',
      testType: test.testType,
      status: test.status || 'pending',
      assignedTo: test.technician || 'Unassigned',
      orderDate: test.createdAt,
      priority: test.priority || 'Normal',
    }));
    
    setOrders(ordersList);
    setFilteredOrders(ordersList);
  };

  const filterOrders = () => {
    if (!searchTerm) {
      setFilteredOrders(orders);
      return;
    }
    const filtered = orders.filter(
      (o) =>
        o.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.testType?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const handleCreateOrder = (data) => {
    const newTest = mockDataService.createTest({
      ...data,
      status: 'pending',
      technician: data.assignedTo || currentUser?.name,
    });
    mockDataService.addAuditLog('CREATE_ORDER', currentUser?.id, { orderId: newTest.id });
    addNotification({ message: 'Order created successfully', type: 'success' });
    loadOrders();
    setIsModalOpen(false);
    reset();
  };

  const handleUpdateOrder = (data) => {
    mockDataService.updateTest(editingOrder.id, data);
    mockDataService.addAuditLog('UPDATE_ORDER', currentUser?.id, { orderId: editingOrder.id });
    addNotification({ message: 'Order updated successfully', type: 'success' });
    loadOrders();
    setIsModalOpen(false);
    setEditingOrder(null);
    reset();
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      const tests = mockDataService.getTests();
      const filtered = tests.filter(t => t.id !== orderId);
      // Update storage
      mockDataService.addAuditLog('DELETE_ORDER', currentUser?.id, { orderId });
      addNotification({ message: 'Order deleted successfully', type: 'success' });
      loadOrders();
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    reset(order);
    setIsModalOpen(true);
  };

  const columns = [
    {
      header: 'Order ID',
      accessor: 'orderId',
    },
    {
      header: 'Patient',
      accessor: 'patientName',
    },
    {
      header: 'Test Type',
      accessor: 'testType',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span className={`badge ${STATUS_COLORS[value] || 'badge-ghost'}`}>
          {value}
        </span>
      ),
    },
    {
      header: 'Assigned To',
      accessor: 'assignedTo',
    },
    {
      header: 'Priority',
      accessor: 'priority',
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/orders/${value}`}
            className="btn btn-sm btn-ghost"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={() => handleEdit(row)}
            className="btn btn-sm btn-ghost"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteOrder(value)}
            className="btn btn-sm btn-ghost text-error"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Order Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage test orders and assignments
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingOrder(null);
            reset();
            setIsModalOpen(true);
          }}
          variant="primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Order
        </Button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders by ID, patient name, or test type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card p-0">
        <Table
          columns={columns}
          data={filteredOrders}
          emptyMessage="No orders found"
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOrder(null);
          reset();
        }}
        title={editingOrder ? 'Edit Order' : 'Create New Order'}
        size="md"
      >
        <form
          onSubmit={handleSubmit(editingOrder ? handleUpdateOrder : handleCreateOrder)}
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
            label="Test Type"
            name="testType"
            register={register}
            error={errors.testType}
            required
          />
          <FormField
            label="Assigned To"
            name="assignedTo"
            register={register}
            error={errors.assignedTo}
            placeholder="Technician name"
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              {...register('priority', { required: 'Priority is required' })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
              <option value="Stat">Stat</option>
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
                setEditingOrder(null);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingOrder ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OrderManagement;

