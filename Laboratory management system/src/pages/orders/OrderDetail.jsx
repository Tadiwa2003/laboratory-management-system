import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, User, FlaskConical, FileText } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Button from '../../components/common/Button';
import mockDataService from '../../services/mockData';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [patient, setPatient] = useState(null);
  const [relatedTests, setRelatedTests] = useState([]);

  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = () => {
    const tests = mockDataService.getTests();
    const patients = mockDataService.getPatients();
    const foundOrder = tests.find(t => t.id === id);
    
    if (foundOrder) {
      setOrder(foundOrder);
      setPatient(patients.find(p => p.id === foundOrder.patientId));
      setRelatedTests(tests.filter(t => t.patientId === foundOrder.patientId));
    }
  };

  if (!order) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Order not found</p>
          <Link to="/orders" className="btn btn-primary mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-error" />;
      default:
        return <Clock className="w-5 h-5 text-warning" />;
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <div className="flex items-center gap-4">
        <Link to="/orders">
          <Button variant="secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Order Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Order ID: {order.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info Card */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Order Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className="font-medium">{order.status}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Test Type:</span>
                <span className="font-medium">{order.testType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                <span className="font-medium">{order.priority || 'Normal'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Assigned To:</span>
                <span className="font-medium">{order.technician || 'Unassigned'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Order Date:</span>
                <span className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Order Timeline
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                  <div className="w-0.5 h-16 bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="flex-1 pb-8">
                  <p className="font-medium text-gray-900 dark:text-gray-100">Order Created</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {order.status === 'completed' && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">Completed</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Order has been completed
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Patient Info */}
          {patient && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Patient Information
              </h2>
              <div className="space-y-2">
                <p className="font-medium">{patient.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ID: {patient.patientId || patient.id}
                </p>
                <Link
                  to={`/patients/${patient.id}`}
                  className="btn btn-sm btn-outline btn-primary mt-4 w-full"
                >
                  View Patient Profile
                </Link>
              </div>
            </div>
          )}

          {/* Related Tests */}
          {relatedTests.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <FlaskConical className="w-5 h-5" />
                Related Tests
              </h2>
              <div className="space-y-2">
                {relatedTests.slice(0, 5).map((test) => (
                  <Link
                    key={test.id}
                    to={`/tests/${test.id}`}
                    className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <p className="text-sm font-medium">{test.testType}</p>
                    <p className="text-xs text-gray-500">{test.status}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

