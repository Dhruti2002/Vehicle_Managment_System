import React, { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:5000';

const VehicleList = () => {
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/check-auth`, { credentials: 'include' });
                if (response.ok) {
                    setIsAuthenticated(true);
                    fetchVehicles();
                } else {
                    const errorText = await response.text(); // Get detailed error message
                    alert(`You must be logged in to view vehicles. Server responded: ${errorText}`);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                alert('An error occurred while checking authentication.');
                setIsLoading(false); // Ensure loading state is updated
            }
        };

        checkAuth();
    }, []);

    const fetchVehicles = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/vehicles`, { credentials: 'include' });
            if (!response.ok) throw new Error('Failed to fetch vehicles');
            const data = await response.json();
            setVehicles(data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            alert('Error fetching vehicles: ' + error.message);
        } finally {
            setIsLoading(false); // Ensure loading state is updated
        }
    };

    const deleteVehicle = async (id) => {
        if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                setVehicles((prevVehicles) => prevVehicles.filter((vehicle) => vehicle.id !== id));
                alert('Vehicle deleted successfully.');
            } else {
                throw new Error('Failed to delete vehicle');
            }
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            alert('Error deleting vehicle: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center dark:bg-black dark:text-white p-4">
            <h1 className="text-2xl font-bold mb-5 font-serif">Your Vehicles</h1>
            <div className="w-full max-w-3xl">
                {isLoading ? (
                    <p>Loading vehicles...</p>
                ) : vehicles.length === 0 ? (
                    <p className="text-lg">No vehicles added yet.</p>
                ) : (
                    <ul className="space-y-4">
                        {vehicles.map((vehicle) => (
                            <li key={vehicle.id} className="shadow-lg p-4 rounded-md bg-white dark:bg-gray-800">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-semibold">{vehicle.model}</h2>
                                        <p>Registration Number: {vehicle.registration_number}</p>
                                        <p>Type: {vehicle.vehicle_type}</p>
                                        <p>Purchase Date: {new Date(vehicle.purchase_date).toLocaleDateString()}</p>
                                        {vehicle.vehicle_image ? (
                                            <img src={`${API_BASE_URL}${vehicle.vehicle_image}`} alt="Vehicle" className="mt-2 h-20 w-auto" />
                                        ) : (
                                            <p>Image not available</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => deleteVehicle(vehicle.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default VehicleList;
