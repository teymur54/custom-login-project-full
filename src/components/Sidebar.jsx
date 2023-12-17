import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/SideBar.css'; // Import the CSS file
import { toast } from 'react-hot-toast';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="sidebar-container">
      <div className="sidebar-application" onClick={() => navigate('/')}>
        <p>Application</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className="sidebar-link">
          Home
        </NavLink>
        <NavLink to="post" className="sidebar-link">
          Post
        </NavLink>
        <NavLink to="/private" className="sidebar-link">
          Private Page
        </NavLink>
        <NavLink to="*" className="sidebar-link">
          Missing
        </NavLink>
      </nav>

      <button className="sidebar-logout" onClick={() => {
        logout()
        navigate('/login', { replace: true })
        toast.success('İstifadəçi çıxış etdi', {duration: 1000})
      }}>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;