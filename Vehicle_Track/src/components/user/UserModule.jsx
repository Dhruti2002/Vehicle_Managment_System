import React, { useEffect, useState } from 'react';

const UserModule = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/users');

        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setUser(data);
        setNewName(data.name); // Set initial values for editing
        setNewEmail(data.email);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, email: newEmail }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status} ${response.statusText}`);
      }

      // Fetch updated user data
      const updatedResponse = await fetch('http://localhost:5000/users');
      const updatedData = await updatedResponse.json();
      setUser(updatedData);
      setEditing(false); // Exit editing mode
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen dark:bg-black dark:text-white duration-300">
      <div className="pt-8 flex justify-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3 font-serif">User Profile</h2>
      </div>
      
      <div className="flex justify-center">
        <div className="p-6 max-w-lg w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg">
          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading user profile...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <>
              {editing ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300" htmlFor="name">Name:</label>
                    <input
                      type="text"
                      id="name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300" htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  {/* Updated buttons without full width */}
                  <button
                    type="submit"
                    className="p-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition duration-300"
                  >
                    Update Profile
                  </button>
                  <button
                    type="button"
                    onClick={handleEditToggle}
                    className="ml-2 p-2 bg-gray-500 text-white rounded-md hover:bg-opacity-90 transition duration-300"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <div className="mb-4 p-4 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                  </div>
                  <button
                    onClick={handleEditToggle}
                    className="p-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition duration-300"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserModule;