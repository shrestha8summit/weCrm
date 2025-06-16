import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const LeadsActivity = () => {
  const navigate = useNavigate();
  const [leadsData, setLeadsData] = useState([]);
  const [stats, setStats] = useState({
    userNumber: 0,
    leadsNumber: 0,
    company: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlegobacktodashboard = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

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

      <LeadsTable leadsData={leadsData} />
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

const LeadsTable = React.memo(({ leadsData }) => {
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
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader>Title</TableHeader>
              <TableHeader>Customer</TableHeader>
              <TableHeader>Contact</TableHeader>
              <TableHeader>Topic</TableHeader>
              <TableHeader>Notes for Future</TableHeader>
              <TableHeader>Closing Date</TableHeader>
              <TableHeader>Status</TableHeader>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leadsData.map((lead) => (
              <LeadRow key={lead.id} lead={lead} formatDate={formatDate} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

const TableHeader = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const LeadRow = React.memo(({ lead, formatDate }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900">{lead.title}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">
        {lead.customerFirstName || "N/A"} {lead.customerLastName || ""}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">{lead.emailAddress || "N/A"}</div>
      <div className="text-sm text-gray-500">{lead.phoneNumber || "N/A"}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {lead.topicOfWork}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {lead.notes}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {formatDate(lead.closingDate)}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
        {lead.status}
      </span>
    </td>
  </tr>
));

export default LeadsActivity;