import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth'; // Import your useAuth hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface ProfileDropdownProps {
  // setCurrentPage is no longer needed as a prop for navigation
  // setCurrentPage: (page: string) => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, loading } = useAuth(); // Use your useAuth hook
  const navigate = useNavigate(); // Initialize useNavigate

  // New handleNavigation function using useNavigate
  const handleNavigation = (path: string) => {
    navigate(path); // Navigate to the specified path
    setIsOpen(false); // Close dropdown after navigation
  };

  const handleSignOut = async () => {
    const { error } = await signOut(); // Call signOut from useAuth hook
    if (error) {
      console.error("Error signing out:", error.message);
      // Optionally show a message modal here
    } else {
      console.log("Signed out successfully.");
      navigate('/login'); // Redirect to login page after successful sign out
    }
    setIsOpen(false); // Close dropdown
  };

  // Show a loading indicator or nothing if auth state is still loading
  if (loading) {
    return (
      <div className="flex items-center justify-center p-2">
        <div
          className="animate-spin rounded-full h-5 w-5 border-b-2"
          style={{ borderColor: 'var(--color-primary)' }} // Using --color-primary for the spinner
        ></div>
      </div>
    );
  }

  // If not logged in, show a login button
  if (!user) {
    return (
      <button
        onClick={() => handleNavigation('/login')} // Use handleNavigation with the login path
        className="flex items-center space-x-2 p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-75"
        aria-label="Login"
        style={{
          color: 'var(--color-text)', // Default text color for the icon
          backgroundColor: 'var(--color-button-bg-primary)', // Assuming a primary button style
          boxShadow: 'var(--shadow-medium)',
          transition: 'background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          style={{ color: 'var(--color-button-text-primary)' }} // Icon color from button text
        >
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        <span
          className="hidden lg:inline-block font-medium"
          style={{ color: 'var(--color-button-text-primary)' }} // Text color from button text
        >
          Log In
        </span>
      </button>
    );
  }

  // If logged in, show profile dropdown
  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center space-x-2 p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-75"
        aria-label="User profile menu"
        style={{
          color: 'var(--color-text)', // Default text color for the main button
          backgroundColor: 'transparent', // No background for the trigger button itself
          padding: '0.5rem', // Consistent padding
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center border"
          style={{
            color: 'var(--color-primary)', // Profile icon color
            borderColor: 'var(--color-border)', // Profile icon border
            backgroundColor: 'var(--color-bg-secondary)', // Subtle background for the circle
          }}
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: 'inherit' }} // Inherit color from parent div
          >
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        {/* Display user email (or a part of it) */}
        <span
          className="hidden lg:inline-block font-medium"
          style={{ color: 'var(--color-text)' }}
        >
          Hi, {user.email || 'User'}!
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl py-2 z-50 transform origin-top-right transition-all duration-200 ease-out scale-100 opacity-100"
          style={{
            backgroundColor: 'var(--color-card-bg)', // Use card background
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)', // Default text color for dropdown items
          }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              {user.email || 'N/A'}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-soft)' }}>
              ID: {user.id.substring(0, 8)}...
            </p>
          </div>
          <button
            onClick={() => handleNavigation('/profile')} // Navigate to /profile
            className="block w-full text-left px-4 py-2 text-sm transition-colors duration-200"
            style={{
              color: 'var(--color-text)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-hover-light)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Profile
          </button>
          <button
            onClick={() => handleNavigation('/settings')} // Navigate to /settings
            className="block w-full text-left px-4 py-2 text-sm transition-colors duration-200"
            style={{
              color: 'var(--color-text)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-hover-light)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Settings
          </button>
          <div className="border-t my-1" style={{ borderColor: 'var(--color-border)' }}></div>
          <button
            onClick={handleSignOut} // Call handleSignOut
            className="block w-full text-left px-4 py-2 text-sm transition-colors duration-200"
            style={{
              color: 'var(--color-danger)', // Use danger color for sign out
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-hover-light)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;