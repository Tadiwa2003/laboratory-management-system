// Mock data service using localStorage
const STORAGE_KEYS = {
  USERS: 'lms_users',
  PATIENTS: 'lms_patients',
  SPECIMENS: 'lms_specimens',
  TESTS: 'lms_tests',
  RESULTS: 'lms_results',
  AUDIT_LOGS: 'lms_audit_logs',
};

// Helper to safely access localStorage
const safeLocalStorage = {
  getItem: (key) => {
    try {
      return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    } catch (e) {
      console.error('Error accessing localStorage:', e);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error('Error setting localStorage:', e);
    }
  },
};

// Initialize with default data if empty
const initializeData = () => {
  if (typeof window === 'undefined') return;
  
  if (!safeLocalStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@linoslms.com',
        role: 'Lab Administrator',
        password: 'admin123',
        active: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'John Technician',
        email: 'tech@linoslms.com',
        role: 'Lab Technician',
        password: 'tech123',
        active: true,
        createdAt: new Date().toISOString(),
      },
    ];
    safeLocalStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }

  if (!safeLocalStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    safeLocalStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify([]));
  }

  if (!safeLocalStorage.getItem(STORAGE_KEYS.SPECIMENS)) {
    safeLocalStorage.setItem(STORAGE_KEYS.SPECIMENS, JSON.stringify([]));
  }

  if (!safeLocalStorage.getItem(STORAGE_KEYS.TESTS)) {
    safeLocalStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify([]));
  }

  if (!safeLocalStorage.getItem(STORAGE_KEYS.RESULTS)) {
    safeLocalStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify([]));
  }

  if (!safeLocalStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    safeLocalStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([]));
  }
};

// Initialize on import
initializeData();

export const mockDataService = {
  // Users
  getUsers: () => {
    try {
      return JSON.parse(safeLocalStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    } catch (e) {
      console.error('Error getting users:', e);
      return [];
    }
  },
  createUser: (user) => {
    const users = mockDataService.getUsers();
    const newUser = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    safeLocalStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
  },
  updateUser: (id, updates) => {
    const users = mockDataService.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      safeLocalStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return users[index];
    }
    return null;
  },
  deleteUser: (id) => {
    const users = mockDataService.getUsers();
    const filtered = users.filter(u => u.id !== id);
    safeLocalStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));
  },

  // Patients
  getPatients: () => {
    try {
      return JSON.parse(safeLocalStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]');
    } catch (e) {
      console.error('Error getting patients:', e);
      return [];
    }
  },
  createPatient: (patient) => {
    const patients = mockDataService.getPatients();
    const newPatient = {
      ...patient,
      id: `PAT-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    patients.push(newPatient);
    safeLocalStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    return newPatient;
  },
  updatePatient: (id, updates) => {
    const patients = mockDataService.getPatients();
    const index = patients.findIndex(p => p.id === id);
    if (index !== -1) {
      patients[index] = { ...patients[index], ...updates };
      safeLocalStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
      return patients[index];
    }
    return null;
  },
  deletePatient: (id) => {
    const patients = mockDataService.getPatients();
    const filtered = patients.filter(p => p.id !== id);
    safeLocalStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(filtered));
  },

  // Specimens
  getSpecimens: () => {
    try {
      return JSON.parse(safeLocalStorage.getItem(STORAGE_KEYS.SPECIMENS) || '[]');
    } catch (e) {
      console.error('Error getting specimens:', e);
      return [];
    }
  },
  createSpecimen: (specimen) => {
    const specimens = mockDataService.getSpecimens();
    const newSpecimen = {
      ...specimen,
      id: `SPC-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    specimens.push(newSpecimen);
    safeLocalStorage.setItem(STORAGE_KEYS.SPECIMENS, JSON.stringify(specimens));
    return newSpecimen;
  },
  updateSpecimen: (id, updates) => {
    const specimens = mockDataService.getSpecimens();
    const index = specimens.findIndex(s => s.id === id);
    if (index !== -1) {
      specimens[index] = { ...specimens[index], ...updates };
      safeLocalStorage.setItem(STORAGE_KEYS.SPECIMENS, JSON.stringify(specimens));
      return specimens[index];
    }
    return null;
  },

  // Tests
  getTests: () => {
    try {
      return JSON.parse(safeLocalStorage.getItem(STORAGE_KEYS.TESTS) || '[]');
    } catch (e) {
      console.error('Error getting tests:', e);
      return [];
    }
  },
  createTest: (test) => {
    const tests = mockDataService.getTests();
    const newTest = {
      ...test,
      id: `TEST-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    tests.push(newTest);
    safeLocalStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));
    return newTest;
  },
  updateTest: (id, updates) => {
    const tests = mockDataService.getTests();
    const index = tests.findIndex(t => t.id === id);
    if (index !== -1) {
      tests[index] = { ...tests[index], ...updates };
      safeLocalStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));
      return tests[index];
    }
    return null;
  },

  // Results
  getResults: () => {
    try {
      return JSON.parse(safeLocalStorage.getItem(STORAGE_KEYS.RESULTS) || '[]');
    } catch (e) {
      console.error('Error getting results:', e);
      return [];
    }
  },
  createResult: (result) => {
    const results = mockDataService.getResults();
    const newResult = {
      ...result,
      id: `RES-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    results.push(newResult);
    safeLocalStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
    return newResult;
  },
  updateResult: (id, updates) => {
    const results = mockDataService.getResults();
    const index = results.findIndex(r => r.id === id);
    if (index !== -1) {
      results[index] = { ...results[index], ...updates };
      safeLocalStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
      return results[index];
    }
    return null;
  },

  // Audit Logs
  addAuditLog: (action, userId, details) => {
    try {
      const logs = JSON.parse(safeLocalStorage.getItem(STORAGE_KEYS.AUDIT_LOGS) || '[]');
      logs.push({
        id: Date.now().toString(),
        action,
        userId,
        details,
        timestamp: new Date().toISOString(),
      });
      safeLocalStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error('Error adding audit log:', e);
    }
  },
  getAuditLogs: () => {
    try {
      return JSON.parse(safeLocalStorage.getItem(STORAGE_KEYS.AUDIT_LOGS) || '[]');
    } catch (e) {
      console.error('Error getting audit logs:', e);
      return [];
    }
  },
};

export default mockDataService;

