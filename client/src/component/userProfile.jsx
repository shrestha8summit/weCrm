
// import React, { useState, lazy, Suspense, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const UserProfile = ({ onLogout }) => {
//   const [userData, setUserData] = useState(null);
//   const [allUsers, setAllUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentUser, setCurrentUser] = useState(null);


//   // UserProfile.jsx
//   useEffect(() => {
//     const loadUserProfile = async () => {
//       try {
//         console.group('[UserProfile] Loading User Data');

//         // 1. Get stored credentials
//         const token = localStorage.getItem('token');
//         const storedUserId = localStorage.getItem('userId');
//         const storedUsername = localStorage.getItem('username');

//         console.log('Stored credentials:', {
//           token: token ? 'exists' : 'missing',
//           userId: storedUserId,
//           username: storedUsername
//         });

//         if (!token || !storedUserId) {
//           throw new Error('Missing authentication data');
//         }

//         console.log('Fetching user data...');
//         const usersResponse = await fetch("http://localhost:3333/api/allUser", {
//           headers: { 'Authorization': `Bearer ${token}` }
//         });

//         if (!usersResponse.ok) {
//           throw new Error('Failed to fetch user data');
//         }

//         const allUsers = await usersResponse.json();
//         console.log('Received users:', allUsers);

//         // 3. Find matching user
//         const matchedUser = allUsers.find(user =>
//           user.id === storedUserId &&
//           user.username === storedUsername
//         );

//         if (!matchedUser) {
//           console.error('No matching user found. Available users:',
//             allUsers.map(u => ({ id: u.id, username: u.username })));
//           throw new Error('User data mismatch');
//         }

//         console.log('Matched user:', matchedUser);
//         setCurrentUser(matchedUser);
//         setLoading(false);

//         console.groupEnd();
//       } catch (error) {
//         console.error('Profile loading error:', error);
//         toast.error("Failed to load profile data");
//         setLoading(false);
//         onLogout();
//       }
//     };

//     loadUserProfile();
//   }, [onLogout]);


//   // Additional debug log when rendering
//   // console.log('[UserProfile] Rendering with currentUser:', currentUser);

//   // Find the matching user from allUsers - prioritize ID match
//   const matchedUser = allUsers.find(user =>
//     user.id === (userData?.userId || '')
//   ) || allUsers.find(user =>
//     user.username === (userData?.username || '')
//   );

//   const user = currentUser ? {
//     name: `${currentUser.firstName} ${currentUser.lastName}`,
//     email: currentUser.email,
//     role: currentUser.role,
//     joinDate: new Date(currentUser.createdAt).toLocaleDateString(),
//     lastLogin: 'Recently',
//     avatar: currentUser.photo || 'https://randomuser.me/api/portraits/men/32.jpg',
//     bio: `User with username ${currentUser.username}`,
//     skills: ['User Management', 'Profile Editing'],
//     leadsActivity: [
//       { id: 1, project: 'User Profile', status: 'In Progress', lastUpdate: 'Recently' }
//     ],
//     assignedWork: currentUser.assignedWork || 'No assigned work',
//     statusOfWork: currentUser.statusOfWork || 'Unknown',
//     phoneNumber: currentUser.phoneNumber || 'Not provided'
//   } : {
//     name: 'User',
//     email: 'No email',
//     role: 'user',
//     joinDate: 'Unknown',
//     lastLogin: 'Unknown',
//     avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
//     bio: 'User information not available',
//     skills: [],
//     leadsActivity: [],
//     assignedWork: 'No data',
//     statusOfWork: 'Unknown',
//     phoneNumber: 'Not provided'
//   };

//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     leadtitle: '',
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     companyname: '',
//     jobtitle: '',
//     industry: '',
//     new: '',
//     serviceinterestedin: '',
//     topicofwork: '',
//     expectedtoclose: '',
//     notesforfuture: '',
//   });

//   const handleChange = React.useCallback((e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         toast.error("Please log in to create leads");
//         navigate('/login');
//         return;
//       }

//       const backendData = {
//         title: formData.leadtitle,
//         customerFirstName: formData.firstName,
//         customerLastName: formData.lastName,
//         emailAddress: formData.email,
//         phoneNumber: formData.phone,
//         companyName: formData.companyname,
//         jobTitle: formData.jobtitle,
//         industry: formData.industry,
//         status: formData.status,
//         serviceInterestedIn: formData.serviceinterestedin,
//         topicOfWork: formData.topicofwork,
//         closingDate: formData.expectedtoclose,
//         notes: formData.notesforfuture,
//       };
//       console.log(backendData)
//       const res = await fetch("http://localhost:3333/api/leads", {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(backendData),
//       });

//       if (!res.ok) {
//         const error = await res.json().catch(() => ({}));
//         throw new Error(error.message || "Lead creation failed");
//       }

//       toast.success("Lead created successfully!");
//       setTimeout(() => navigate("/userProfile"), 2000);
//     } catch (err) {
//       console.error("Lead creation error:", err);
//       toast.error(err.message || "Failed to create lead");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const [activeTab, setActiveTab] = useState('dashboard');

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff8633]"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navigation Bar */}
//       {/* <nav className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex items-center">
//               <h1 className="text-xl font-semibold text-gray-800">User Dashboard</h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <Link to="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
//                 Home
//               </Link>
//               <Link to="/leads" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
//                 Leads Activity
//               </Link>
//               <Link to="/settings" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
//                 Settings
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav> */}

//       {/* Main Content */}
//       <div className="mx-auto px-4 sm:px-6 lg:px-0 py-8">
//         <div className="flex flex-col md:flex-row gap-8">
//           {/* Sidebar */}
//           <div className="w-full md:w-1/4">
//             <div className="bg-white rounded-lg shadow p-6">
//               <div className="flex flex-col items-center">
//                 <img
//                   src={user.avatar}
//                   alt="Profile"
//                   className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
//                 />
//                 <h2 className="mt-4 text-xl font-bold text-gray-800">{user.name}</h2>
//                 <p className="text-[#ff8633] capitalize">{user.role}</p>
//                 <p className="text-gray-500 text-sm mt-2">Member since {user.joinDate}</p>
//               </div>

//               <div className="mt-6">
//                 <button
//                   onClick={() => setActiveTab('dashboard')}
//                   className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
//                 >
//                   Dashboard
//                 </button>

//                 <button
//                   onClick={() => setActiveTab('leads')}
//                   className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'leads' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
//                 >
//                   Leads Activity
//                 </button>


//                 <button
//                   onClick={() => setActiveTab('addleads')}
//                   className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'addleads' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
//                 >
//                   Add Leads
//                 </button>

//                 <button
//                   onClick={() => setActiveTab('realtimetracking')}
//                   className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'realtimetracking' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
//                 >
//                   Real Time Tracking
//                 </button>

//                 <button
//                   onClick={() => setActiveTab('alertsandreminder')}
//                   className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'alertsandreminder' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
//                 >
//                   Alerts And Reminder
//                 </button>

//                 <button
//                   onClick={() => setActiveTab('phonetrackingandanalysis')}
//                   className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'phonetrackingandanalysis' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
//                 >
//                   Phone Tracking And Analysis
//                 </button>

//                 <button
//                   onClick={() => setActiveTab('settings')}
//                   className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'settings' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
//                 >
//                   Account Settings
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Main Dashboard */}
//           <div className="w-full md:w-3/4">
//             {activeTab === 'dashboard' && (
//               <div className="bg-white rounded-lg justify-center text-center lg:text-left shadow p-6">
//                 <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center"> User Dashboard</h2>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Details</h3>
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-500">Full Name</label>
//                         <p className="mt-1 text-gray-800">{user.name}</p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-500">Email Address</label>
//                         <p className="mt-1 text-gray-800">{user.email}</p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-500">Role</label>
//                         <p className="mt-1 text-gray-800 capitalize">{user.role}</p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-500">Phone Number</label>
//                         <p className="mt-1 text-gray-800">{user.phoneNumber}</p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-500">Assigned Work</label>
//                         <p className="mt-1 text-gray-800">{user.assignedWork}</p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-500">Work Status</label>
//                         <p className="mt-1 text-gray-800 capitalize">{user.statusOfWork}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-700 mb-4">About</h3>
//                     <p className="text-gray-600 mb-6">{user.bio}</p>

//                     <h3 className="text-lg font-semibold text-gray-700 mb-4">Skills</h3>
//                     <div className="flex flex-wrap gap-2">
//                       {user.skills.map((skill, index) => (
//                         <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                           {skill}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-8 flex flex-row gap-10">
//                   <button className="cursor-pointer px-4 py-2 bg-[#ff8633] text-white rounded-lg transition-colors">
//                     Edit Profile
//                   </button>

//                   <button onClick={onLogout} className="cursor-pointer px-4 py-2 bg-[#ff8633] text-white rounded-lg transition-colors">
//                     Logout
//                   </button>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'leads' && (
//               <div className="bg-white rounded-lg shadow p-6">
//                 <h2 className="text-3xl font-bold text-gray-800 mb-6">Leads Activity</h2>

//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Update</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {user.leadsActivity.map((lead) => (
//                         <tr key={lead.id}>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.project}</td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lead.status === 'Completed' ? 'bg-green-100 text-green-800' :
//                               lead.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
//                                 'bg-yellow-100 text-yellow-800'
//                               }`}>
//                               {lead.status}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.lastUpdate}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             <button className="text-[#ff8633]  mr-3">View</button>
//                             <button className="text-gray-600 hover:text-gray-900">Edit</button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'settings' && (
//               <div className="bg-white rounded-lg shadow p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-6">Account Settings</h2>
//                 <p className="text-gray-600 mb-4">Last login: {user.lastLogin}</p>

//                 <div className="space-y-6">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-700 mb-2">Change Password</h3>
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
//                         <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
//                         <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
//                         <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
//                       </div>
//                       <button className="px-4 py-2 bg-[#ff8633] text-white rounded-lg  transition-colors">
//                         Update Password
//                       </button>
//                     </div>
//                   </div>

//                   <div className="pt-4 border-t border-gray-200">
//                     <h3 className="text-lg font-semibold text-gray-700 mb-2">Notification Preferences</h3>
//                     <div className="space-y-2">
//                       <label className="flex items-center">
//                         <input type="checkbox" className="h-4 w-4 text-[#ff8633] focus:ring-blue-500 border-gray-300 rounded" />
//                         <span className="ml-2 text-sm text-gray-700">Email notifications</span>
//                       </label>
//                       <label className="flex items-center">
//                         <input type="checkbox" className="h-4 w-4 text-[#ff8633] focus:ring-blue-500 border-gray-300 rounded" />
//                         <span className="ml-2 text-sm text-gray-700">Push notifications</span>
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}


//             {activeTab === 'addleads' && (
//               <div className="flex items-center justify-center min-h-screen p-0 bg-gradient-to-br from-gray-50 to-gray-100">
//                 <Suspense fallback={
//                   <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
//                     <div className="animate-pulse">
//                       <div className="h-8 bg-gray-200 rounded w-3/4 mb-6 mx-auto"></div>
//                       <div className="h-4 bg-gray-200 rounded w-1/2 mb-8 mx-auto"></div>
//                     </div>
//                   </div>
//                 }>
//                   <form
//                     onSubmit={handleSubmit}
//                     className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100 transition-all hover:shadow-2xl"
//                   >
//                     <div className="text-center mb-8">
//                       <h2 className="text-3xl font-bold text-gray-800 mb-2">Add the Leads</h2>
//                     </div>

//                     <div className="mb-4">
//                       <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                         Lead Title
//                       </label>
//                       <input
//                         type="text"
//                         id="leadtitle"
//                         name="leadtitle"
//                         value={formData.leadtitle}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                         placeholder="Eg. New Lead"
//                         autoComplete="leadtitle"
//                       />
//                     </div>



//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
//                           First Name
//                         </label>
//                         <input
//                           type="text"
//                           id="firstName"
//                           name="firstName"
//                           value={formData.firstName}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 text-center  py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                           placeholder="John"
//                           autoComplete="given-name"
//                         />
//                       </div>
//                       <div>
//                         <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
//                           Last Name
//                         </label>
//                         <input
//                           type="text"
//                           id="lastName"
//                           name="lastName"
//                           value={formData.lastName}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 text-center py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                           placeholder="Doe"
//                           autoComplete="family-name"
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                           Email
//                         </label>
//                         <input
//                           type="email"
//                           id="email"
//                           name="email"
//                           value={formData.email}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 text-center py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                           placeholder="your@email.com"
//                           autoComplete="email"
//                         />
//                       </div>
//                       <div>
//                         <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//                           Phone Number
//                         </label>
//                         <input
//                           type="tel"
//                           id="phone"
//                           name="phone"
//                           value={formData.phone}
//                           onChange={handleChange}
//                           className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                           placeholder="+1 (123) 456-7890"
//                           autoComplete="tel"
//                         />
//                       </div>
//                     </div>


//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <label htmlFor="companyname" className="block text-sm font-medium text-gray-700 mb-1">
//                           Company Name
//                         </label>
//                         <input
//                           type="text"
//                           id="companyname"
//                           name="companyname"
//                           value={formData.companyname}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                           placeholder="Eg. quore/tcs"
//                           autoComplete="organization"
//                         />
//                       </div>
//                       <div>
//                         <label htmlFor="jobtitle" className="block text-sm font-medium text-gray-700 mb-1">
//                           Job Title
//                         </label>
//                         <input
//                           type="text"
//                           id="jobtitle"
//                           name="jobtitle"
//                           value={formData.jobtitle}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                           placeholder="Eg. lead/manager"
//                           autoComplete="organization-title"
//                         />
//                       </div>
//                     </div>


//                     <div className="mb-4">
//                       <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
//                         Select Industry
//                       </label>
//                       <select
//                         id="industry"
//                         name="industry"
//                         value={formData.industry}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-3 cursor-pointer rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                       >
//                         <option value="">Select an industry</option>
//                         <option value="Technology">Technology</option>
//                         <option value="SaaS">SaaS</option>
//                         <option value="Finance">Finance</option>
//                         <option value="Manufacturing">Manufacturing</option>
//                         <option value="Other">Other</option>
//                       </select>
//                     </div>


//                     <div className="mb-4">
//                       <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
//                         New
//                       </label>
//                       <select
//                         id="status"
//                         name="status"
//                         value={formData.status}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-3 cursor-pointer rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                       >
//                         <option value="">New</option>
//                         <option value="Contacted">Contacted</option>
//                         <option value="Engaged">Engaged</option>
//                         <option value="Qualified">Qualified</option>
//                         <option value="Proposal Sent">Proposal Sent</option>
//                         <option value="Negotiation">Negotiation</option>
//                         <option value="Closed Won">Closed Won</option>
//                         <option value="Closed Lost">Closed Lost</option>
//                         <option value="On Hold">On Hold</option>
//                         <option value="Do Not Contact">Do Not Contact</option>
//                       </select>
//                     </div>


//                     <div className="mb-4">
//                       <label htmlFor="serviceinterestedin" className="block text-sm font-medium text-gray-700 mb-1">
//                         Service Interested In
//                       </label>
//                       <select
//                         id="serviceinterestedin"
//                         name="serviceinterestedin"
//                         value={formData.serviceinterestedin}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-3 cursor-pointer rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                       >
//                         <option value="">Service Interested In</option>
//                         <option value="Email Marketing">Email Marketing</option>
//                         <option value="Lead Generation">Lead Generation</option>
//                         <option value="Content Syndication">Content Syndication</option>
//                       </select>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <label htmlFor="topicofwork" className="block text-sm font-medium text-gray-700 mb-1">
//                           Topic Of Work
//                         </label>
//                         <input
//                           type="text"
//                           id="topicofwork"
//                           name="topicofwork"
//                           value={formData.topicofwork}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                           placeholder="Eg. Sales / Marketing"
//                           autoComplete="off"
//                         />
//                       </div>
//                       <div>
//                         <label htmlFor="expectedtoclose" className="block text-sm font-medium text-gray-700 mb-1">
//                           Expected To Close
//                         </label>
//                         <input
//                           type="date"
//                           id="expectedtoclose"
//                           name="expectedtoclose"
//                           value={formData.expectedtoclose}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                           autoComplete="off"
//                         />
//                       </div>
//                     </div>


//                     <div className="mb-4">
//                       <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                         Notes For Future
//                       </label>
//                       <input
//                         type="text"
//                         id="notesforfuture"
//                         name="notesforfuture"
//                         value={formData.notesforfuture}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                         placeholder='Eg. Need to maintain it in future'
//                         autoComplete="notesforfuture"
//                       />
//                     </div>



//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className={`w-full cursor-pointer bg-gradient-to-r from-[#ff8633] to-[#ff9a52] text-white py-3 rounded-lg font-medium hover:from-[#e6732b] hover:to-[#e6732b] transition-all shadow-md hover:shadow-lg active:scale-95 transform ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
//                         }`}
//                     >
//                       {isSubmitting ? 'Adding the lead...' : 'Add Lead'}
//                     </button>
//                   </form>
//                 </Suspense>
//               </div>
//             )}

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;










































import React, { useState, lazy, Suspense, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserProfile = ({ onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [leadsData, setLeadsData] = useState({
  allLeads: 0,
  allNewLeads:[],
  newLeadsCount:0,
  allContacted:[],
  contactedCount:0,
  allEngaged:[],
  engagedCount:0,
  allQualified:[],
  qualifiedCount:0,
  allProposalSent:[],
  proposalSentCount:0,
  allNegotiation: [],
  negotiationCount: 0,
  allClosedWon: [],
  closedWonCount: 0,
  allClosedLost: [],
  closedLostCount: 0,
  allOnHold: [],
  onHoldCount: 0,
  allDoNotContact: [],
  doNotContactCount: 0,
});

// Combine all leads from all status categories
const allCombinedLeads = [
  ...leadsData.allNewLeads,
  ...leadsData.allContacted,
  ...leadsData.allEngaged,
  ...leadsData.allQualified,
  ...leadsData.allProposalSent,
  ...leadsData.allNegotiation,
  ...leadsData.allClosedWon,
  ...leadsData.allClosedLost,
  ...leadsData.allOnHold,
  ...leadsData.allDoNotContact
];


const [leadsLoading, setLeadsLoading] = useState(false);

  // UserProfile.jsx
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        console.group('[UserProfile] Loading User Data');

        // 1. Get stored credentials
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const storedUsername = localStorage.getItem('username');

        console.log('Stored credentials:', {
          token: token ? 'exists' : 'missing',
          userId: storedUserId,
          username: storedUsername
        });

        if (!token || !storedUserId) {
          throw new Error('Missing authentication data');
        }

        console.log('Fetching user data...');
        const usersResponse = await fetch("http://localhost:3333/api/allUser", {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!usersResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const allUsers = await usersResponse.json();
        console.log('Received users:', allUsers);

        // 3. Find matching user
        const matchedUser = allUsers.find(user =>
          user.id === storedUserId &&
          user.username === storedUsername
        );

        if (!matchedUser) {
          console.error('No matching user found. Available users:',
            allUsers.map(u => ({ id: u.id, username: u.username })));
          throw new Error('User data mismatch');
        }

        console.log('Matched user:', matchedUser);
        setCurrentUser(matchedUser);
        setLoading(false);

        console.groupEnd();
      } catch (error) {
        console.error('Profile loading error:', error);
        toast.error("Failed to load profile data");
        setLoading(false);
        onLogout();
      }
    };

    loadUserProfile();
  }, [onLogout]);





  // Additional debug log when rendering
  // console.log('[UserProfile] Rendering with currentUser:', currentUser);

  // Find the matching user from allUsers - prioritize ID match
  const matchedUser = allUsers.find(user =>
    user.id === (userData?.userId || '')
  ) || allUsers.find(user =>
    user.username === (userData?.username || '')
  );

  const user = currentUser ? {
    name: `${currentUser.firstName} ${currentUser.lastName}`,
    email: currentUser.email,
    role: currentUser.role,
    joinDate: new Date(currentUser.createdAt).toLocaleDateString(),
    lastLogin: 'Recently',
    avatar: currentUser.photo || 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: `User with username ${currentUser.username}`,
    skills: ['User Management', 'Profile Editing'],
    leadsActivity: [
      { id: 1, project: 'User Profile', status: 'In Progress', lastUpdate: 'Recently' }
    ],
    assignedWork: currentUser.assignedWork || 'No assigned work',
    statusOfWork: currentUser.statusOfWork || 'Unknown',
    phoneNumber: currentUser.phoneNumber || 'Not provided'
  } : {
    name: 'User',
    email: 'No email',
    role: 'user',
    joinDate: 'Unknown',
    lastLogin: 'Unknown',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'User information not available',
    skills: [],
    leadsActivity: [],
    assignedWork: 'No data',
    statusOfWork: 'Unknown',
    phoneNumber: 'Not provided'
  };

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    leadtitle: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyname: '',
    jobtitle: '',
    industry: '',
    new: '',
    serviceinterestedin: '',
    topicofwork: '',
    expectedtoclose: '',
    notesforfuture: '',
    alerttopic:'',
    reminder:'',
    alertdate:'',
    remindertime:'',
    description:'',

  });

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please log in to create leads");
        navigate('/login');
        return;
      }

      const backendData = {
        title: formData.leadtitle,
        customerFirstName: formData.firstName,
        customerLastName: formData.lastName,
        emailAddress: formData.email,
        phoneNumber: formData.phone,
        companyName: formData.companyname,
        jobTitle: formData.jobtitle,
        industry: formData.industry,
        status: formData.status,
        serviceInterestedIn: formData.serviceinterestedin,
        topicOfWork: formData.topicofwork,
        closingDate: formData.expectedtoclose,
        notes: formData.notesforfuture,
      };
      console.log(backendData)
      const res = await fetch("http://localhost:3333/api/leads", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(backendData),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Lead creation failed");
      }

      toast.success("Lead created successfully!");
      setTimeout(() => navigate("/userProfile"), 2000);
    } catch (err) {
      console.error("Lead creation error:", err);
      toast.error(err.message || "Failed to create lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAlert = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please log in to add alerts and reminder");
        navigate('/login');
        return;
      }

      const backendData = {
        alerttopic: formData.alerttopic,
        reminder: formData.reminder,
        alertdate: formData.alertdate,
        remindertime: formData.remindertime,
        description: formData.description,
      };
      console.log(backendData)
      const res = await fetch("http://localhost:3333/api/alertsandreminder", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(backendData),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Alert Creation Failed!");
      }

      toast.success("Alert created successfully!");
      setTimeout(() => navigate("/userProfile"), 2000);
    } catch (err) {
      console.error("Alert creation error:", err);
      toast.error(err.message || "Failed to create Alert");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [activeTab, setActiveTab] = useState('dashboard');


    // the leads of the user
  useEffect(() => {
  const fetchLeadsData = async () => {
    if (activeTab === 'leads') {
      try {
        setLeadsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("Please log in to view leads");
          navigate('/login');
          return;
        }

        const response = await fetch("http://localhost:3333/api/loggedData", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch leads data');
        }

        const data = await response.json();
        console.log('Leads data:', data); // Debug log
        setLeadsData(data.data);
      } catch (error) {
        console.error('Error fetching leads:', error);
        toast.error(error.message || "Failed to load leads");
      } finally {
        setLeadsLoading(false);
      }
    }
  };

  fetchLeadsData();
}, [activeTab, navigate]);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff8633]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      {/* <nav className="bg-white shadow-sm">
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
      </nav> */}

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-0 py-8">
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
                <p className="text-[#ff8633] capitalize">{user.role}</p>
                <p className="text-gray-500 text-sm mt-2">Member since {user.joinDate}</p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Dashboard
                </button>

                <button
                  onClick={() => setActiveTab('leads')}
                  className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'leads' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Leads Activity
                </button>


                <button
                  onClick={() => setActiveTab('addleads')}
                  className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'addleads' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Add Leads
                </button>

                <button
                  onClick={() => setActiveTab('realtimetracking')}
                  className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'realtimetracking' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Real Time Tracking
                </button>

                <button
                  onClick={() => setActiveTab('alertsandreminder')}
                  className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'alertsandreminder' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Alerts And Reminder
                </button>

                <button
                  onClick={() => setActiveTab('phonetrackingandanalysis')}
                  className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'phonetrackingandanalysis' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Phone Tracking And Analysis
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

          {/* Main Dashboard */}
          <div className="w-full md:w-3/4">
            {activeTab === 'dashboard' && (
              <div className="bg-white rounded-lg justify-center text-center lg:text-left shadow p-6">
                <h2 className="text-xl lg:text-3xl font-bold text-gray-800 mb-6 text-center"> User Dashboard</h2>

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
                        <p className="mt-1 text-gray-800 capitalize">{user.role}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                        <p className="mt-1 text-gray-800">{user.phoneNumber}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Assigned Work</label>
                        <p className="mt-1 text-gray-800">{user.assignedWork}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Work Status</label>
                        <p className="mt-1 text-gray-800 capitalize">{user.statusOfWork}</p>
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
                  <button className="cursor-pointer px-4 py-2 bg-[#ff8633] text-white rounded-lg transition-colors">
                    Edit Profile
                  </button>

                  <button onClick={onLogout} className="cursor-pointer px-4 py-2 bg-[#ff8633] text-white rounded-lg transition-colors">
                    Logout
                  </button>
                </div>
              </div>
            )}

        {activeTab === 'leads' && (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl lg:text-3xl font-bold text-gray-800 mb-6">Leads Activity</h2>
    
    {leadsLoading ? (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff8633]"></div>
      </div>
    ) : (
      <div className="overflow-x-auto">
        {/* Combine all leads from all status categories */}
        {allCombinedLeads.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No leads found</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-left">
              {allCombinedLeads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {lead.customerFirstName} {lead.customerLastName}
                    </div>
                    <div className="text-sm text-gray-500">{lead.emailAddress}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lead.companyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                      lead.status === 'Engaged' ? 'bg-green-100 text-green-800' :
                      lead.status === 'Qualified' ? 'bg-purple-100 text-purple-800' :
                      lead.status === 'Proposal Sent' ? 'bg-indigo-100 text-indigo-800' :
                      lead.status === 'Negotiation' ? 'bg-pink-100 text-pink-800' :
                      lead.status === 'Closed Won' ? 'bg-teal-100 text-teal-800' :
                      lead.status === 'Closed Lost' ? 'bg-red-100 text-red-800' :
                      lead.status === 'On Hold' ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lead.serviceInterestedIn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                     <button  className="p-1 text-blue-500 hover:text-blue-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* Edit Button */}
        <button  className="p-1 text-green-500 hover:text-green-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        
        {/* Delete Button */}
        <button   className="p-1 text-red-500 hover:text-red-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    )}
  </div>
)}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl lg:text-3xl font-bold text-gray-800 mb-6">Account Settings</h2>
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


            {activeTab === 'addleads' && (
              <div className="flex items-center justify-center min-h-screen p-0 bg-gradient-to-br from-gray-50 to-gray-100">
                <Suspense fallback={
                  <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded w-3/4 mb-6 mx-auto"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-8 mx-auto"></div>
                    </div>
                  </div>
                }>
                  <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100 transition-all hover:shadow-2xl"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-xl lg:text-3xl font-bold text-gray-800 mb-2">Add the Leads</h2>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Lead Title
                      </label>
                      <input
                        type="text"
                        id="leadtitle"
                        name="leadtitle"
                        value={formData.leadtitle}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                        placeholder="Eg. New Lead"
                        autoComplete="leadtitle"
                      />
                    </div>



                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 text-center  py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                          placeholder="John"
                          autoComplete="given-name"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 text-center py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                          placeholder="Doe"
                          autoComplete="family-name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 text-center py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                          placeholder="your@email.com"
                          autoComplete="email"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                          placeholder="+1 (123) 456-7890"
                          autoComplete="tel"
                        />
                      </div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="companyname" className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          id="companyname"
                          name="companyname"
                          value={formData.companyname}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                          placeholder="Eg. quore/tcs"
                          autoComplete="organization"
                        />
                      </div>
                      <div>
                        <label htmlFor="jobtitle" className="block text-sm font-medium text-gray-700 mb-1">
                          Job Title
                        </label>
                        <input
                          type="text"
                          id="jobtitle"
                          name="jobtitle"
                          value={formData.jobtitle}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                          placeholder="Eg. lead/manager"
                          autoComplete="organization-title"
                        />
                      </div>
                    </div>


                    <div className="mb-4">
                      <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Industry
                      </label>
                      <select
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 cursor-pointer rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                      >
                        <option value="">Select an industry</option>
                        <option value="Technology">Technology</option>
                        <option value="SaaS">SaaS</option>
                        <option value="Finance">Finance</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>


                    <div className="mb-4">
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        New
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 cursor-pointer rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                      >
                        <option value="">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Engaged">Engaged</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Closed Won">Closed Won</option>
                        <option value="Closed Lost">Closed Lost</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Do Not Contact">Do Not Contact</option>
                      </select>
                    </div>


                    <div className="mb-4">
                      <label htmlFor="serviceinterestedin" className="block text-sm font-medium text-gray-700 mb-1">
                        Service Interested In
                      </label>
                      <select
                        id="serviceinterestedin"
                        name="serviceinterestedin"
                        value={formData.serviceinterestedin}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 cursor-pointer rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                      >
                        <option value="">Service Interested In</option>
                        <option value="Email Marketing">Email Marketing</option>
                        <option value="Lead Generation">Lead Generation</option>
                        <option value="Content Syndication">Content Syndication</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="topicofwork" className="block text-sm font-medium text-gray-700 mb-1">
                          Topic Of Work
                        </label>
                        <input
                          type="text"
                          id="topicofwork"
                          name="topicofwork"
                          value={formData.topicofwork}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                          placeholder="Eg. Sales / Marketing"
                          autoComplete="off"
                        />
                      </div>
                      <div>
                        <label htmlFor="expectedtoclose" className="block text-sm font-medium text-gray-700 mb-1">
                          Expected To Close
                        </label>
                        <input
                          type="date"
                          id="expectedtoclose"
                          name="expectedtoclose"
                          value={formData.expectedtoclose}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                          autoComplete="off"
                        />
                      </div>
                    </div>


                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Notes For Future
                      </label>
                      <input
                        type="text"
                        id="notesforfuture"
                        name="notesforfuture"
                        value={formData.notesforfuture}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                        placeholder='Eg. Need to maintain it in future'
                        autoComplete="notesforfuture"
                      />
                    </div>



                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full cursor-pointer bg-gradient-to-r from-[#ff8633] to-[#ff9a52] text-white py-3 rounded-lg font-medium hover:from-[#e6732b] hover:to-[#e6732b] transition-all shadow-md hover:shadow-lg active:scale-95 transform ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                    >
                      {isSubmitting ? 'Adding the lead...' : 'Add Lead'}
                    </button>
                  </form>
                </Suspense>
              </div>
            )}

            {activeTab === 'alertsandreminder' && (
              <div className="flex items-center justify-center min-h-screen p-0 bg-gradient-to-br from-gray-50 to-gray-100">
                <Suspense fallback={
                  <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded w-3/4 mb-6 mx-auto"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-8 mx-auto"></div>
                    </div>
                  </div>
                }>
                  <form
                    onSubmit={handleSubmitAlert}
                    className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100 transition-all hover:shadow-2xl"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-xl lg:text-3xl font-bold text-gray-800 mb-2">Alerts And Reminder</h2>
                    </div>

                     <div className="mb-4">
                      <label htmlFor="alerttopic" className="block text-sm font-medium text-gray-700 mb-1">
                       Alert Topic
                      </label>
                      <input
                        type="text"
                        id="alerttopic"
                        name="alerttopic"
                        value={formData.alerttopic}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                        placeholder="alerttopic"
                        autoComplete="alerttopic"
                      />
                    </div>



                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="mb-4">
                      <label htmlFor="reminder" className="block text-sm font-medium text-gray-700 mb-1">
                        Reminder
                      </label>
                      <input
                        type="text"
                        id="reminder"
                        name="reminder"
                        value={formData.reminder}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                        placeholder="reminder"
                        autoComplete="reminder"
                      />
                    </div>
                      <div>
                        <label htmlFor="alertdate" className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          id="alertdate"
                          name="alertdate"
                          value={formData.alertdate}
                          onChange={handleChange}
                          required
                          className="w-full px-4 text-center py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                          placeholder=""
                          autoComplete="alertdate"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="mb-4">
  <label htmlFor="remindertime" className="block text-sm font-medium text-gray-700 mb-1">
    Reminder Time:
  </label>
  <input
    type="time"
    id="remindertime"
    name="remindertime"
    value={formData.remindertime || ''}
    onChange={handleChange}
    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
    required
  />
</div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                          placeholder="description"
                          autoComplete="description"
                        />
                      </div>
                    </div>



                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full cursor-pointer bg-gradient-to-r from-[#ff8633] to-[#ff9a52] text-white py-3 rounded-lg font-medium hover:from-[#e6732b] hover:to-[#e6732b] transition-all shadow-md hover:shadow-lg active:scale-95 transform ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                    >
                      {isSubmitting ? 'Adding the lead...' : 'Add Lead'}
                    </button>
                  </form>
                </Suspense>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;