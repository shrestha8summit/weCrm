import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Lazy load components and icons
const Eye = lazy(() => import('lucide-react').then(module => ({ default: module.Eye })));
const EyeOff = lazy(() => import('lucide-react').then(module => ({ default: module.EyeOff })));
const ReactToastifyCSS = lazy(() => import('react-toastify/dist/ReactToastify.css'));

const Sign = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
    profilePhoto: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.warning('Image size should be less than 2MB');
      return;
    }
    
    if (file) {
      setFormData(prev => ({ ...prev, profilePhoto: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      }

      const res = await fetch("http://localhost:8888/api/signUp", {
        method: 'POST',
        body: formDataToSend,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        toast.success('Account created successfully!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registration failed');
      }
    } catch (e) {
      console.error("Error in sending data", e);
      toast.error(e.name === 'AbortError' 
        ? 'Request timed out. Please try again.' 
        : e.message || 'An error occurred. Please try again.', {
        position: "top-center"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <Suspense fallback={
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8 mx-auto"></div>
            {/* More skeleton loaders */}
          </div>
        </div>
      }>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 transition-all hover:shadow-2xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-500">Join our community today</p>
          </div>

          {/* Profile Photo Upload */}
          <div className="mb-6 flex flex-col items-center">
            <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-gray-200">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              )}
            </div>
            <label className="cursor-pointer">
              <span className="px-4 py-2 bg-[#ff8633] text-white rounded-lg hover:bg-[#e6732b] transition">
                Upload Photo
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                placeholder="Doe"
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="mb-4">
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
              placeholder="your@email.com"
              autoComplete="email"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
              placeholder="+1 (123) 456-7890"
              autoComplete="tel"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Account Type</label>
            <div className="flex justify-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={formData.role === 'user'}
                  onChange={handleChange}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${formData.role === 'user' ? 'border-[#ff8633]' : 'border-gray-300'}`}>
                  {formData.role === 'user' && <div className="w-3 h-3 rounded-full bg-[#ff8633]"></div>}
                </div>
                <span className="text-gray-700">User</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={handleChange}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${formData.role === 'admin' ? 'border-[#ff8633]' : 'border-gray-300'}`}>
                  {formData.role === 'admin' && <div className="w-3 h-3 rounded-full bg-[#ff8633]"></div>}
                </div>
                <span className="text-gray-700">Admin</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
              placeholder="john_doe"
              autoComplete="username"
            />
          </div>

          <div className="relative mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all pr-12"
              autoComplete="new-password"
            />
            <Suspense fallback={<div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gray-300 rounded-full"></div>}>
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </Suspense>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full cursor-pointer bg-gradient-to-r from-[#ff8633] to-[#ff9a52] text-white py-3 rounded-lg font-medium hover:from-[#e6732b] hover:to-[#e6732b] transition-all shadow-md hover:shadow-lg active:scale-95 transform ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      </Suspense>
    </div>
  );
};

export default React.memo(Sign);