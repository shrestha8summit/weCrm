import { useState } from 'react';
import { Link } from 'react-router-dom';

const UserProfile = ({ onLogout }) => {
  // Sample user data
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'Senior Developer',
    joinDate: 'January 15, 2021',
    lastLogin: '2 hours ago',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Full-stack developer with 5+ years of experience building web applications using React, Node.js, and MongoDB.',
    skills: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'TypeScript'],
    leadsActivity: [
      { id: 1, project: 'E-commerce Platform', status: 'In Progress', lastUpdate: '2 days ago' },
      { id: 2, project: 'CRM Dashboard', status: 'Completed', lastUpdate: '1 week ago' },
      { id: 3, project: 'Mobile App UI', status: 'Pending Review', lastUpdate: '3 days ago' },
    ]
  });

  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">User Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/leads" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                Leads Activity
              </Link>
              <Link to="/settings" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col items-center">
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                />
                <h2 className="mt-4 text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-[#ff8633]">{user.role}</p>
                <p className="text-gray-500 text-sm mt-2">Member since {user.joinDate}</p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'profile' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'leads' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Leads Activity
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'settings' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Account Settings
                </button>

              </div>
            </div>
          </div>

          {/* Main Profile Content */}
          <div className="w-full md:w-3/4">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Full Name</label>
                        <p className="mt-1 text-gray-800">{user.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Email Address</label>
                        <p className="mt-1 text-gray-800">{user.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Role</label>
                        <p className="mt-1 text-gray-800">{user.role}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">About</h3>
                    <p className="text-gray-600 mb-6">{user.bio}</p>
                    
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-row gap-10">
                  <button className="cursor-pointer px-4 py-2 bg-[#ff8633] text-white rounded-lg  transition-colors">
                    Edit Profile
                  </button>

                  <button onClick={onLogout} className="cursor-pointer px-4 py-2 bg-[#ff8633] text-white rounded-lg  transition-colors">
                    Logout
                </button>
                </div>
              </div>
            )}

            {activeTab === 'leads' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Leads Activity</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Update</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {user.leadsActivity.map((lead) => (
                        <tr key={lead.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.project}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              lead.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              lead.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.lastUpdate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-[#ff8633]  mr-3">View</button>
                            <button className="text-gray-600 hover:text-gray-900">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Account Settings</h2>
                <p className="text-gray-600 mb-4">Last login: {user.lastLogin}</p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <button className="px-4 py-2 bg-[#ff8633] text-white rounded-lg  transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Notification Preferences</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-[#ff8633] focus:ring-blue-500 border-gray-300 rounded" />
                        <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-[#ff8633] focus:ring-blue-500 border-gray-300 rounded" />
                        <span className="ml-2 text-sm text-gray-700">Push notifications</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;