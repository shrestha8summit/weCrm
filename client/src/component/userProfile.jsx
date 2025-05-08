import React from 'react';
const UserProfile = ({ onLogout }) => {
  return (
    <div>
      <h1>User Profile</h1>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};
export default UserProfile;