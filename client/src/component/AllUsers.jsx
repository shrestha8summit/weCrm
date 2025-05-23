import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

//  -> use localhost:8888/apallUser to get data from backend and then create the frontend all users
const AllUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3333/api/allUser');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
   fetchUsers();
  }, []);

  const handleAddUser = () => {
    navigate('/sign');
  };

  const handleEditUser = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff8633]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }
  return (
     <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={handleAddUser}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#ff8633] text-white rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
            <path d="M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Add New User
        </button>
      </div>

      {users.length === 0 ? (
        <div className="max-w-6xl mx-auto text-center py-12">
          <p className="text-gray-600 text-lg">No users found.</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={user.photo || 'https://randomuser.me/api/portraits/men/1.jpg'} 
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full lg:h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://randomuser.me/api/portraits/men/1.jpg';
                  }}
                />
                <div className="absolute top-2 right-2">
                  <button 
                    onClick={() => handleEditUser(user.id)}
                    className="cursor-pointer p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    aria-label="Edit user"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{user.firstName} {user.lastName} ({user.username})</h2>
                <p className="text-gray-600 mb-2 capitalize">{user.role}</p>
                
                <div className="flex items-center text-gray-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="truncate">{user.email}</span>
                </div>
                
                <div className="flex items-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllUsers;