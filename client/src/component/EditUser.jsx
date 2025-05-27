import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data (use the correct backend route)
    fetch(`http://localhost:3333/api/user/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load user');
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load user');
        setLoading(false);
      });
  }, [userId]);

  const handleChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

 const handleSubmit = async e => {
  e.preventDefault();
  try {
    // Exclude id from the update payload
    const { id, ...updateData } = user;
    const res = await fetch(`http://localhost:3333/api/user/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    if (!res.ok) throw new Error('Update failed');
    alert('User updated!');
    navigate('/users');
  } catch {
    setError('Failed to update user');
  }
};

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto my-8 flex flex-col gap-4 p-6 bg-white shadow-lg rounded-lg">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">
      First Name
    </label>
    <input
      id="firstName"
      name="firstName"
      value={user.firstName || ''}
      onChange={handleChange}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">
      Last Name
    </label>
    <input
      id="lastName"
      name="lastName"
      value={user.lastName || ''}
      onChange={handleChange}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
      Email
    </label>
    <input
      id="email"
      name="email"
      type="email"
      value={user.email || ''}
      onChange={handleChange}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
    />
  </div>

  {/* Add other fields here similarly */}

  <button
    type="submit"
    className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
  >
    Save
  </button>
</form>

  );
};

export default EditUser;