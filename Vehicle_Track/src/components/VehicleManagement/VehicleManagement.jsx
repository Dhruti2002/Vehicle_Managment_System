import React, { useState } from 'react';

const VehicleManagement = () => {
  const [vehicleData, setVehicleData] = useState({
    model: '',
    registrationNumber: '',
    vehicleType: 'car',
    purchaseDate: '',
    vehicleImage: null,
  });

  // Get today's date in 'YYYY-MM-DD' format
  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setVehicleData((prevData) => ({
      ...prevData,
      vehicleImage: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('model', vehicleData.model);
    formData.append('registrationNumber', vehicleData.registrationNumber);
    formData.append('vehicleType', vehicleData.vehicleType);
    formData.append('purchaseDate', vehicleData.purchaseDate);
    formData.append('vehicleImage', vehicleData.vehicleImage);

    console.log('Submitting form with data:', vehicleData);

    try {
      const response = await fetch('http://localhost:5000/vehicles', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Vehicle added successfully!');
        setVehicleData({
          model: '',
          registrationNumber: '',
          vehicleType: 'car',
          purchaseDate: '',
          vehicleImage: null,
        });
      } else {
        const errorData = await response.json();
        alert(`Failed to add vehicle: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the vehicle.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-black dark:text-white">
      <div className="shadow-lg p-8 rounded-md bg-white dark:bg-gray-800 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-5 text-center font-serif">Add Your Vehicle</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vehicle Model */}
          <div>
            <label className="block text-sm font-medium">Vehicle Model</label>
            <input
              type="text"
              name="model"
              value={vehicleData.model}
              onChange={handleChange}
              className="w-full border-2 p-2 rounded-md dark:bg-gray-700"
              placeholder="Enter Vehicle Model"
              required
            />
          </div>

          {/* Vehicle Registration Number */}
          <div>
            <label className="block text-sm font-medium">Vehicle Registration Number</label>
            <input
              type="text"
              name="registrationNumber"
              value={vehicleData.registrationNumber}
              onChange={handleChange}
              className="w-full border-2 p-2 rounded-md dark:bg-gray-700"
              placeholder="Enter Registration Number"
              required
            />
          </div>

          {/* Vehicle Type Dropdown */}
          <div>
            <label className="block text-sm font-medium">Vehicle Type</label>
            <select
              name="vehicleType"
              value={vehicleData.vehicleType}
              onChange={handleChange}
              className="w-full border-2 p-2 rounded-md dark:bg-gray-700"
            >
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="truck">Truck</option>
              <option value="van">Van</option>
            </select>
          </div>

          {/* Purchase Date */}
          <div>
            <label className="block text-sm font-medium">Purchase Date</label>
            <input
              type="date"
              name="purchaseDate"
              value={vehicleData.purchaseDate}
              onChange={handleChange}
              max={today} // Set today's date as the maximum allowed date
              className="w-full border-2 p-2 rounded-md dark:bg-gray-700"
              required
            />
          </div>

          {/* Vehicle Image */}
          <div>
            <label className="block text-sm font-medium">Vehicle Image/Logo</label>
            <input
              type="file"
              name="vehicleImage"
              onChange={handleFileChange}
              className="w-full border-2 p-2 rounded-md dark:bg-gray-700"
              accept="image/*"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition duration-300"
          >
            Add Vehicle
          </button>
        </form>
      </div>
    </div>
  );
};

export default VehicleManagement;

