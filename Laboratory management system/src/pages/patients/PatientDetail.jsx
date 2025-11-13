import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, User, Calendar, Phone, Mail, FileText, FlaskConical } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Button from '../../components/common/Button';
import mockDataService from '../../services/mockData';

const PatientDetail = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [patientTests, setPatientTests] = useState([]);
  const [patientResults, setPatientResults] = useState([]);

  useEffect(() => {
    loadPatientDetails();
  }, [id]);

  const loadPatientDetails = () => {
    const patients = mockDataService.getPatients();
    const foundPatient = patients.find(p => p.id === id);
    
    if (foundPatient) {
      setPatient(foundPatient);
      const tests = mockDataService.getTests();
      const results = mockDataService.getResults();
      setPatientTests(tests.filter(t => t.patientId === id));
      setPatientResults(results.filter(r => r.patientId === id));
    }
  };

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Patient not found</p>
          <Link to="/patients" className="btn btn-primary mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Patients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <div className="flex items-center gap-4">
        <Link to="/patients">
          <Button variant="secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Patient Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {patient.name} - {patient.patientId || patient.id}
          </p>
        </div>
        <Link to={`/patients/${id}/edit`}>
          <Button variant="primary">
            <Edit className="w-4 h-4 mr-2" />
            Edit Patient
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                  <p className="font-medium">{patient.name}</p>
                </div>
              </div>
              {patient.dateOfBirth && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Date of Birth</p>
                    <p className="font-medium">
                      {new Date(patient.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              {patient.gender && (
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Gender</p>
                    <p className="font-medium">{patient.gender}</p>
                  </div>
                </div>
              )}
              {patient.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                    <p className="font-medium">{patient.phone}</p>
                  </div>
                </div>
              )}
              {patient.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-medium">{patient.email}</p>
                  </div>
                </div>
              )}
              {patient.address && (
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                    <p className="font-medium">{patient.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Test History */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FlaskConical className="w-5 h-5" />
              Test History
            </h2>
            <div className="space-y-2">
              {patientTests.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No tests found</p>
              ) : (
                patientTests.map((test) => (
                  <div
                    key={test.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {test.testType}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(test.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`badge ${test.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                        {test.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Results History */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Results History
            </h2>
            <div className="space-y-2">
              {patientResults.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No results found</p>
              ) : (
                patientResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {result.testName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(result.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`badge ${result.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                        {result.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card text-center">
            <div className="avatar placeholder mb-4 mx-auto">
              <div className="bg-primary text-primary-content rounded-full w-24">
                <span className="text-3xl">{patient.name.charAt(0)}</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold">{patient.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Patient ID: {patient.patientId || patient.id}
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Quick Stats
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Tests</span>
                <span className="font-medium">{patientTests.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Completed</span>
                <span className="font-medium">
                  {patientResults.filter(r => r.status === 'approved').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;

