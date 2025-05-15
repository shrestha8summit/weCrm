import { useNavigate } from 'react-router-dom';

const AllUsers = () => {
  const navigate = useNavigate();
  //   -> use localhots:8888/api/allUsers to get data from backend and then create the frontend all users
  const users = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Administrator',
      email: 'john@example.com',
      photo: 'https://randomuser.me/api/portraits/men/1.jpg',
      joinDate: '2022-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Manager',
      email: 'jane@example.com',
      photo: 'https://randomuser.me/api/portraits/women/2.jpg',
      joinDate: '2022-03-22'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      role: 'Developer',
      email: 'robert@example.com',
      photo: 'https://randomuser.me/api/portraits/men/3.jpg',
      joinDate: '2022-05-10'
    },
    {
      id: 4,
      name: 'Emily Davis',
      role: 'Designer',
      email: 'emily@example.com',
      photo: 'https://randomuser.me/api/portraits/women/4.jpg',
      joinDate: '2022-07-18'
    },
        {
      id: 5,
      name: 'John Doe',
      role: 'Administrator',
      email: 'john@example.com',
      photo: 'https://randomuser.me/api/portraits/men/1.jpg',
      joinDate: '2022-01-15'
    },
    {
      id: 6,
      name: 'Jane Smith',
      role: 'Manager',
      email: 'jane@example.com',
      photo: 'https://randomuser.me/api/portraits/women/2.jpg',
      joinDate: '2022-03-22'
    },
    {
      id: 7,
      name: 'Robert Johnson',
      role: 'Developer',
      email: 'robert@example.com',
      photo: 'https://randomuser.me/api/portraits/men/3.jpg',
      joinDate: '2022-05-10'
    },
    {
      id: 8,
      name: 'Emily Davis',
      role: 'Designer',
      email: 'emily@example.com',
      photo: 'https://randomuser.me/api/portraits/women/4.jpg',
      joinDate: '2022-07-18'
    },
  ];

  const handleAddUser = () => {
    navigate('/sign');
  };

  const handleEditUser = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
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

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={user.photo} 
                alt={user.name}
                className="w-full h-48 object-cover"
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
              <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-gray-600 mb-2">{user.role}</p>
              
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
                <span>Joined {user.joinDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;