import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const LeadsActivity = () => {
  const navigate = useNavigate();
  const [leadsData, setLeadsData] = useState([]);
  const [viewPopupOpen, setViewPopupOpen] = useState(false);
const [editPopupOpen, setEditPopupOpen] = useState(false);
const [deletePopupOpen, setDeletePopupOpen] = useState(false);
const [currentLead, setCurrentLead] = useState(null);


  const [stats, setStats] = useState({
    userNumber: 0,
    leadsNumber: 0,
    company: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [selectedLead, setSelectedLead] = useState(null);

  const handlegobacktodashboard = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  // editing lead
  const handleSaveLead = async (updatedLead) => {
   
     
      
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3333/api/udleads/update-lead/${updatedLead.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedLead),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update lead');
      }

      setEditPopupOpen(false);
      fetchData();
    
  };

  // deleting lead
    const handleDeleteLead = async (leadId) => {
   
      
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3333/api/udleads/delete-lead/${leadId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete lead');
      }

      setDeletePopupOpen(false);
      fetchData();
   
  };


 

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Login to get token
      const loginResponse = await fetch("http://localhost:3333/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "admin@gmail.com",
          username: "admin404",
          password: "admin404",
        }),
      });

      if (!loginResponse.ok) {
        throw new Error(`Login failed with status: ${loginResponse.status}`);
      }

      const loginData = await loginResponse.json();
      const token = loginData.token;
      if (!token) {
        throw new Error("No token received in login response");
      }

      // Step 2: Fetch recent data with token
      const recentResponse = await fetch("http://localhost:3333/api/recent", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!recentResponse.ok) {
        throw new Error(
          `Recent data fetch failed with status: ${recentResponse.status}`
        );
      }

      const recentData = await recentResponse.json();

      if (!recentData.leads) {
        throw new Error("Incomplete leads data received from API");
      }

      setLeadsData(recentData.leads);
      setStats({
        userNumber: recentData.userNumber || 0,
        leadsNumber: recentData.leadsNumber || 0,
        company: recentData.company || 0,
      });
    } catch (err) {
      console.error("Error in data fetching:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8">
        <div className="flex flex-row justify-between items-center mb-6 relative">
          <h1 className="text-3xl font-bold text-gray-800 absolute left-1/2 transform -translate-x-1/2">
            Leads Activity
          </h1>
          <BackButton onClick={handlegobacktodashboard} />
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <StatCard title="Total Users" value={stats.userNumber} icon="👥" />
          <StatCard title="Total Leads" value={stats.leadsNumber} icon="📊" />
          <StatCard title="Total Companies" value={stats.company} icon="🏢" />
        </div>
      </header>

      <LeadsTable leadsData={leadsData} setSelectedLead={setSelectedLead} setCurrentLead={setCurrentLead} setViewPopupOpen={setViewPopupOpen} setEditPopupOpen={setEditPopupOpen} setDeletePopupOpen={setDeletePopupOpen}/>
      {/* status popup */}
         {selectedLead && (
      <StatusHistoryPopup 
        lead={selectedLead} 
        onClose={() => setSelectedLead(null)} 
      />
    )}

{/* view popup */}
    {viewPopupOpen && (
  <ViewLeadPopup 
    lead={currentLead} 
    onClose={() => setViewPopupOpen(false)} 
  />
)}

{/* delete popup */}
  {deletePopupOpen && (
        <DeleteConfirmationPopup
          lead={currentLead}
          onClose={() => setDeletePopupOpen(false)}
          onConfirm={handleDeleteLead}
        />
  )}

{/* edit popup */}
      {editPopupOpen && (
        <EditLeadPopup
          lead={currentLead}
          onClose={() => setEditPopupOpen(false)}
          onSave={handleSaveLead}
        />
      )}
    </div>
  );
};

// Sub-components for better code organization and lazy loading
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-lg font-medium text-gray-700">Loading data...</p>
    </div>
  </div>
);

const ErrorDisplay = ({ error }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
      <h2 className="font-bold text-xl mb-2">Error</h2>
      <p>{error}</p>
      <p className="mt-2 text-sm">Please check the console for more details.</p>
    </div>
  </div>
);

const BackButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center space-x-2 text-gray-600 hover:text-[#ff8633] transition-colors group ml-auto"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 group-hover:transform group-hover:-translate-x-1 transition-transform"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
    <span>Back to Dashboard</span>
  </button>
);

const StatCard = React.memo(({ title, value, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow flex-1 min-w-[200px]">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
        <span className="text-xl">{icon}</span>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
));

const LeadsTable = React.memo(({ leadsData,setSelectedLead,setCurrentLead,setViewPopupOpen,setEditPopupOpen,setDeletePopupOpen }) => {
  const formatDate = useCallback((dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "N/A";
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
        Leads ({leadsData.length})
      </h2>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader className="w-1/4">Title</TableHeader>
              <TableHeader className="w-1/4">Contact</TableHeader>
              <TableHeader className="w-1/4">Status</TableHeader>
             <TableHeader className="w-1/4">Actions</TableHeader> 
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leadsData.map((lead) => (
              <LeadRow key={lead.id} lead={lead} formatDate={formatDate} setSelectedLead={setSelectedLead} setCurrentLead={setCurrentLead} setViewPopupOpen={setViewPopupOpen} setEditPopupOpen={setEditPopupOpen} setDeletePopupOpen={setDeletePopupOpen} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

const TableHeader = ({ children, className }) => (
  <th className={`px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);


const StatusHistoryPopup = ({ lead, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 relative">
          <h2 className="text-xl font-bold text-center  mx-auto text-[#ff8633]">
            Status History
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold">{lead.customerFirstName} {lead.customerLastName}</h3>
          <p className="text-gray-600">{lead.company || "TechCorp Solutions"}</p>
          <p className="text-sm mt-1">
            Current Status: <span className="font-medium">{lead.status}</span>
          </p>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-2">Status Timeline</h4>
          <ul className="space-y-8 relative">
            <StatusItem completed={true} title="New" changedBy="System" description="Lead created from LinkedIn" />
            <StatusItem completed={true} title="Contacted" changedBy="John Smith" description="Initial outreach call completed" />
            <StatusItem completed={false} title="Engaged" changedBy="John Smith" description="Responded positively, showed interest" />
            <StatusItem completed={false} title="Qualified" changedBy="John Smith" description="Budget confirmed, decision maker identified" />
            <StatusItem completed={false} title="Demo Scheduled" changedBy="John Smith" description="Demo scheduled for next week" />
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <StatBlock value="5" label="Total Changes" />
          <StatBlock value="399" label="Days in Pipeline" />
          <StatBlock value="7" label="Days in Current Status" />
        </div>
      </div>
    </div>
  );
};

// View Lead Popup
const ViewLeadPopup = React.memo (({ lead, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Lead Details</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="text-left">
          <h3 className="font-semibold mb-2">Contact Information</h3>
          <p><strong>Name:</strong>  {lead.customerFirstName} {lead.customerLastName}</p>
          <p><strong>Email:</strong> {lead.emailAddress}</p>
          <p><strong>Phone:</strong> {lead.phoneNumber}</p>
          <p><strong>Job Title:</strong> {lead.jobTitle || 'Not specified'}</p>
        </div>

        <div className="text-left">
          <h3 className="font-semibold mb-2">Company Information</h3>
          <p><strong>Company Name:</strong>  {lead.companyName || 'Not Specified'}</p>
          <p><strong>Industry:</strong>  {lead.Industry || 'Not Specified'}</p>
           <p><strong>Website:</strong>  {lead.Website || 'Not Specified'}</p>
            <p><strong>Location:</strong>  {lead.Location || 'Not Specified'}</p>
        </div>


        <div className="text-left">
          <h3 className="font-semibold mb-2">Lead Details</h3>
          <p><strong>Status:</strong>  {lead.new || 'On Progress'}</p>
          <p><strong>Stage:</strong> {lead.Stage || 'Not specified'}</p>
          <p><strong>Source:</strong> {lead.Source || 'Not specified'}</p>
          <p><strong>Score:</strong> {lead.Score || 'Not specified'}</p>
        </div>

        <div className="text-left">
          <h3 className="font-semibold mb-2">Tracking</h3>
          <p><strong>Status:</strong>  {lead.new || 'On Progress'}</p>
          <p><strong>Email:</strong> {lead.emailAddress}</p>
          <p><strong>Phone:</strong> {lead.phoneNumber}</p>
          <p><strong>Job Title:</strong> {lead.jobTitle || 'Not specified'}</p>
        </div>
        
      </div>
    </div>
  </div>
));

// Edit Lead Popup
const EditLeadPopup = ({ lead, onClose, onSave }) => {
  const [editedLead, setEditedLead] = useState(lead);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedLead(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedLead);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Edit Lead</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#ff8633]">Contact Information </h3>
              <div className="flex flex-row gap-4">
              <div>
                <label className="block text-base  font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="customerFirstName"
                  value={editedLead.customerFirstName || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-base  font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="customerLastName"
                  value={editedLead.customerLastName || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                />
              </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="emailAddress"
                  value={editedLead.emailAddress || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                />
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editedLead.phoneNumber || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={editedLead.jobTitle || 'Not Specified'}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                />
              </div>

            </div>

            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#ff8633]">Company Information</h3>
                <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={editedLead.companyName || 'Not Specified'}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                />
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <input
                  type="text"
                  name="Industry"
                  value={editedLead.Industry || 'Not Specified'}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                />
              </div>


                 <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="text"
                  name="Website"
                  value={editedLead.Website || 'Not Specified'}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                />
              </div>

                 <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="Location"
                  value={editedLead.Location|| 'Not Specified'}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                />
              </div>

            </div>

            {/* Lead Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#ff8633]">Lead Details</h3>
              <div>
                <label className="block text-sm p-4 font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={editedLead.status || ''}
                  onChange={handleChange}
                   className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                >
                  <option value="">New</option>
    <option value="Contacted">Contacted</option>
    <option value="Engaged">Engaged</option>
    <option value="Qualified">Qualified</option>
    <option value="Demo Scheduled">Demo Scheduled</option>
    <option value="Proposal sent">Proposal Sent</option>
    <option value="Negotiation">Negotiation</option>
    <option value="Cloaed Won">Closed Won</option>
    <option value="Closed Lost">Closed Lost</option>
    <option value="On Hold">On Hold</option>
    <option value="Nurturing">Nurturing</option>
    <option value="Disqualified">Disqualified</option>
    <option value="Do Not Contact">Do Not Contact</option>
                </select>
              </div>
            </div>

            {/* Tracking */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#ff8633]">Tracking</h3>
              {/* Add tracking-related fields */}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff8633]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Popup
const DeleteConfirmationPopup = React.memo(({ lead, onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Confirm Deletion</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="mb-6">
          Are you sure you want to delete the lead for <strong>{lead.customerFirstName} {lead.customerLastName}</strong> from <strong>{lead.companyName || 'Unknown Company'}</strong>?
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(lead.id)}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Delete Lead
          </button>
        </div>
      </div>
    </div>
));




const StatusItem = ({ completed, title, changedBy, description }) => {
  return (
    <li className="relative pl-8">  {/* Added relative and padding */}
      {/* Connecting line - add this */}
      <div className="absolute left-[11px] top-4 h-full w-0.5 bg-gray-300 -translate-y-1/2"></div>
      
      {/* Status dot */}
      <div className={`absolute left-0 top-1/2 h-6 w-6 rounded-full border-4 ${completed ? 'border-green-500' : 'bg-white border-gray-300'} transform -translate-y-1/2`}></div>
      
      {/* Content */}
      <div className="text-left p-4">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">Changed by: {changedBy}</p>
        <p className="text-sm mt-1">{description}</p>
      </div>
    </li>
  );
}

const StatBlock = ({ value, label }) => (
  <div className="bg-gray-50 p-3 rounded">
    <p className="text-xl font-bold">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);



const LeadRow = React.memo(({ lead, formatDate,setSelectedLead ,setCurrentLead,setViewPopupOpen,setEditPopupOpen,setDeletePopupOpen}) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900">{lead.title}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
       <div className="text-sm text-gray-900">
        {lead.customerFirstName || "N/A"} {lead.customerLastName || ""}
      </div>
      <div className="text-sm text-gray-900">{lead.emailAddress || "N/A"}</div>
      <div className="text-sm text-gray-500">{lead.phoneNumber || "N/A"}</div>
    </td>
 <td className="px-6 py-4 whitespace-nowrap">
      <button 
        onClick={() => setSelectedLead(lead)}
        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
      >
        {lead.status}
      </button>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center justify-center space-x-2">
        {/* View Button */}
        <button   onClick={() => { setCurrentLead(lead); setViewPopupOpen(true); }} className="p-1 text-blue-500 hover:text-blue-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* Edit Button */}
        <button onClick={() => { setCurrentLead(lead); setEditPopupOpen(true); }} className="p-1 text-green-500 hover:text-green-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        
        {/* Delete Button */}
        <button  onClick={() => { setCurrentLead(lead);  setDeletePopupOpen(true);  }}  className="p-1 text-red-500 hover:text-red-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </td>
  </tr>
));

export default LeadsActivity;