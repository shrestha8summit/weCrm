import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const ReactToastifyCSS = lazy(() => import('react-toastify/dist/ReactToastify.css'));

const ContactQuore = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);



  const handlegobacktodashboard = () => {
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      
      const body = {
        customerFirstName: formData.firstName,
        customerLastName: formData.lastName,
        emailAddress: formData.email,
        phoneNumber: formData.phone,
        message: formData.message,
      };

      const res = await axios.post("api/api/contactquore",
      body,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

      toast.success("Lead Created Successfully!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: { fontSize: '1.2rem' }, // Increased font size
    });
    const userType = localStorage.getItem('userType'); 
   if (userType === 'user') {
   setTimeout(() => navigate("/userProfile"), 2000);
   window.location.reload();
  } else if (userType === 'admin') {
    setTimeout(() => navigate("/dashboard"), 2000);
  }     
    } catch (e) {
      console.error("Lead Creation Failed - Full Error:", e);
      console.error("Error details:", {
        message: e.message,
        stack: e.stack,
      });
      toast.error(e.message || "Lead Creation Failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <div className="flex items-center justify-center min-h-screen p-4">
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
          <div className="absolute top-4 right-4">
           {localStorage.getItem('userType') === 'admin' && (
  <button
    type="button"
    onClick={handlegobacktodashboard}
    className="cursor-pointer flex items-center gap-2 m-3 px-2 p-2 bg-[#ff8633] text-white rounded-lg transition-colors hover:bg-[#e57328] ml-auto"
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
)}
          </div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Contact Quore b2b</h2>
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
                className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
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
                className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                placeholder="Doe"
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg text-center border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                placeholder="+1 (123) 456-7890"
                autoComplete="tel"
              />
            </div>
          </div>




          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <input
              type="text"
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
              placeholder='Type your Message..'
              autoComplete="message"
            />
          </div>



          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full cursor-pointer bg-gradient-to-r from-[#ff8633] to-[#ff9a52] text-white py-3 rounded-lg font-medium hover:from-[#e6732b] hover:to-[#e6732b] transition-all shadow-md hover:shadow-lg active:scale-95 transform ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
          >
            {isSubmitting ? 'Sending Message...' : 'Send Message'}
          </button>
        </form>
      </Suspense>
    </div>
    </>
  );
};

export default React.memo(ContactQuore);