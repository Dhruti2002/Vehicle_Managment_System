import React, { useEffect, useState } from 'react';

const MaintenanceModule = () => {
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [formData, setFormData] = useState({
    vehicleId: '',
    maintenanceType: '',
    maintenanceDate: '',
    cost: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  // Get today's date in 'YYYY-MM-DD' format
  const today = new Date().toISOString().split('T')[0];

  const fetchAllMaintenanceRecords = async () => {
    try {
      const response = await fetch('http://localhost:5000/maintenance', {
        credentials: 'include', // ensure session data is sent
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch maintenance records: ${errorText}`);
      }
      const data = await response.json();
      setMaintenanceRecords(data);
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
      alert('An error occurred while fetching maintenance records: ' + error.message);
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('http://localhost:5000/vehicles', { credentials: 'include' });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch vehicles: ${errorText}`);
        }
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        alert('Error fetching vehicles: ' + error.message);
      }
    };

    fetchVehicles();
    fetchAllMaintenanceRecords(); // Fetch all records on component mount
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Maintenance record added successfully');
        fetchAllMaintenanceRecords(); // Refresh records to include the new entry
        setFormData({ vehicleId: '', maintenanceType: '', maintenanceDate: '', cost: '' });
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to add maintenance record');
      }
    } catch (error) {
      console.error('Error adding maintenance record:', error);
      setErrorMessage('An error occurred while adding the maintenance record. Please try again.');
    }
  };

  return (
    <div className="dark:bg-black dark:text-white duration-300 min-h-screen flex items-center justify-center">
      <div className="p-6 max-w-lg w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-serif text-center mb-5">Maintenance Management</h1>

        {/* Error Message */}
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

        {/* Maintenance Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Vehicle</label>
            <select
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              className="block w-full p-2 border-2 rounded-md dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.model} ({vehicle.registration_number})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Maintenance Type</label>
            <select
              name="maintenanceType"
              value={formData.maintenanceType}
              onChange={handleChange}
              className="block w-full p-2 border-2 rounded-md dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select Maintenance Type</option>
              <option value="Oil Change">Oil Change</option>
              <option value="Tire Replacement">Tire Replacement</option>
              <option value="Battery Replacement">Battery Replacement</option>
              <option value="Brake Check">Brake Check</option>
              <option value="Engine Tuning">Engine Tuning</option>
              <option value="Transmission Service">Transmission Service</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Date of Maintenance</label>
            <input
              type="date"
              name="maintenanceDate"
              value={formData.maintenanceDate}
              onChange={handleChange}
              max={today} // Restrict to today or earlier
              className="block w-full p-2 border-2 rounded-md dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Cost (₹)</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              placeholder="Enter cost in ₹"
              className="block w-full p-2 border-2 rounded-md dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-primary text-white rounded-md hover:bg-opacity-90"
          >
            Add Maintenance Record
          </button>
        </form>

        {/* Maintenance Records */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-3 text-center">Maintenance Records</h2>
          {maintenanceRecords.length === 0 ? (
            <p className="text-center text-gray-600">No maintenance records found.</p>
          ) : (
            <ul className="space-y-3">
              {maintenanceRecords.map((record) => (
                <li
                  key={record.id}
                  className="p-4 border-2 border-gray-300 rounded-md bg-gray-100 dark:bg-gray-800"
                >
                  <p>
                    <strong>Vehicle:</strong> {record.vehicle_id}
                  </p>
                  <p>
                    <strong>Type:</strong> {record.maintenance_type}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(record.maintenance_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Cost:</strong> ₹{record.cost}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceModule;
