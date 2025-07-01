import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuoreandCompareComments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('compare');
  const [compareComments, setCompareComments] = useState([]);
  const [quoreComments, setQuoreComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [viewPopupOpen, setViewPopupOpen] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [activeTab]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please log in to view comments");
        navigate('/login');
        return;
      }

      const apiUrl = activeTab === 'compare' 
        ? 'http://localhost:3333/api/compareb/form' 
        : 'http://localhost:3333/api/quareb2b/form';
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const data = await response.json();
      
      if (activeTab === 'compare') {
        setCompareComments(data);
      } else {
        setQuoreComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  const handlegobacktodashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 relative w-full">
          {/* Mobile layout */}
          <div className="md:hidden sm:hidden w-full flex flex-col items-center space-y-4 mb-4">
            <div className="flex justify-center w-full items-center">
              <h1 className="text-base font-bold text-gray-800">
                {activeTab === 'compare' ? 'Compare Bazar Comments' : 'Quore B2B Comments'}
              </h1>
            </div>
            <BackButton onClick={handlegobacktodashboard} />
          </div>

          {/* Desktop layout */}
          <div className="hidden sm:flex md:flex w-full justify-between items-center">
            <div className="flex items-center absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-3xl md:text-lg lg:text-3xl font-bold text-gray-800 mr-2">
                {activeTab === 'compare' ? 'Compare Bazar Comments' : 'Quore B2B Comments'}
              </h1>
            </div>
            <BackButton onClick={handlegobacktodashboard} />
            <div className="w-10"></div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'compare' ? 'text-[#ff8633] border-b-2 border-[#ff8633]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('compare')}
          >
            Compare Bazar
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'quore' ? 'text-[#ff8633] border-b-2 border-[#ff8633]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('quore')}
          >
            Quore B2B
          </button>
        </div>
      </header>

      <main>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Comment</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(activeTab === 'compare' ? compareComments : quoreComments).map(comment => (
                    <CommentRow 
                      key={comment.id} 
                      comment={comment} 
                      onView={() => {
                        setSelectedComment(comment);
                        setViewPopupOpen(true);
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Comment View Popup */}
      {viewPopupOpen && selectedComment && (
        <ViewCommentPopup
          comment={selectedComment}
          onClose={() => setViewPopupOpen(false)}
          activeTab={activeTab}
        />
      )}
    </div>
  );
};

// Sub-components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff8633]"></div>
  </div>
);

const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 bg-[#ff8633] text-white rounded-lg hover:bg-[#e57328] transition-colors"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
    Back to Dashboard
  </button>
);

const TableHeader = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const CommentRow = ({ comment, onView }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-600 font-medium">
            {comment.firstName.charAt(0)}{comment.lastName.charAt(0)}
          </span>
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">
            {comment.firstName} {comment.lastName}
          </div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="text-sm text-left text-gray-900 line-clamp-2">
        {comment.comment}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
      <button
        onClick={onView}
        className="text-[#ff8633] hover:text-[#e57328]"
      >
        View
      </button>
    </td>
  </tr>
);

const ViewCommentPopup = ({ comment, onClose,activeTab  }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Comment Details</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600 font-medium text-xl">
              {comment.firstName.charAt(0)}{comment.lastName.charAt(0)}
            </span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              {comment.firstName} {comment.lastName}
            </h3>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
         <p className="text-gray-800 whitespace-pre-line">
  Commented "{comment.comment}" on{" "}
  <span className="font-semibold">
    {comment.companyName || (activeTab === 'compare' ? 'Compare Bazar' : 'Quore B2B')}
  </span>
</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-[#ff8633] text-white rounded-md hover:bg-[#e57328] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default QuoreandCompareComments;