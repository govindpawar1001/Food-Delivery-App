import React, { useState, useEffect } from 'react';
import { userAPI } from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await userAPI.updateStatus(userId, !currentStatus);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isActive: !currentStatus } : user
      ));
      setMessage('User status updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating user status:', error);
      setError('Failed to update user status');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.delete(userId);
        setUsers(users.filter(user => user._id !== userId));
        setMessage('User deleted successfully');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading Users...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🍔</span>
            <span style={styles.logoText}>Foody</span>
          </div>
          <div style={styles.adminBadge}>Admin Panel</div>
        </div>

        <nav style={styles.sidebarNav}>
          <div style={styles.navSection}>
            <h4 style={styles.navSectionTitle}>MAIN</h4>
            <Link to="/admin" style={styles.navItem}>
              <span style={styles.navIcon}>📊</span>
              Dashboard
            </Link>
          </div>

          <div style={styles.navSection}>
            <h4 style={styles.navSectionTitle}>MANAGEMENT</h4>
            <Link to="/admin/restaurants" style={styles.navItem}>
              <span style={styles.navIcon}>🏪</span>
              Restaurants
            </Link>
            <Link to="/admin/menu" style={styles.navItem}>
              <span style={styles.navIcon}>📋</span>
              Menu
            </Link>
            <Link to="/admin/orders" style={styles.navItem}>
              <span style={styles.navIcon}>📦</span>
              Orders
            </Link>
            <Link to="/admin/users" style={styles.navItemActive}>
              <span style={styles.navIcon}>👥</span>
              Users
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <button onClick={() => navigate('/admin')} style={styles.backButton}>
              ← Back to Dashboard
            </button>
            <div>
              <h1 style={styles.pageTitle}>User Management</h1>
              <p style={styles.pageSubtitle}>Manage platform users and their access</p>
            </div>
          </div>
          <div style={styles.statsContainer}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{users.length}</span>
              <span style={styles.statLabel}>Total Users</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{users.filter(u => u.isActive).length}</span>
              <span style={styles.statLabel}>Active Users</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && <div style={styles.successMessage}>{message}</div>}
        {error && <div style={styles.errorMessage}>{error}</div>}

        {/* Users Table */}
        <div style={styles.tableContainer}>
          <div style={styles.tableHeader}>
            <h3 style={styles.tableTitle}>All Users</h3>
          </div>
          
          <div style={styles.table}>
            <div style={styles.tableHeaderRow}>
              <div style={styles.tableHeaderCell}>User Info</div>
              <div style={styles.tableHeaderCell}>Role</div>
              <div style={styles.tableHeaderCell}>Status</div>
              <div style={styles.tableHeaderCell}>Joined</div>
              <div style={styles.tableHeaderCell}>Actions</div>
            </div>
            
            {users.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={styles.emptyIcon}>👥</span>
                <h3>No Users Found</h3>
                <p>No users have registered yet</p>
              </div>
            ) : (
              users.map(user => (
                <div key={user._id} style={styles.tableRow}>
                  <div style={styles.tableCell}>
                    <div style={styles.userInfo}>
                      <div style={styles.userAvatar}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={styles.userName}>{user.name}</div>
                        <div style={styles.userEmail}>{user.email}</div>
                        <div style={styles.userPhone}>📞 {user.phone}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={styles.tableCell}>
                    <span style={{
                      ...styles.roleBadge,
                      backgroundColor: user.isAdmin ? '#ff6b35' : '#28a745'
                    }}>
                      {user.isAdmin ? '👑 Admin' : '👤 User'}
                    </span>
                  </div>
                  
                  <div style={styles.tableCell}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: user.isActive ? '#28a745' : '#dc3545'
                    }}>
                      {user.isActive ? '✅ Active' : '❌ Inactive'}
                    </span>
                  </div>
                  
                  <div style={styles.tableCell}>
                    <div style={styles.dateInfo}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div style={styles.tableCell}>
                    <div style={styles.actionButtons}>
                      <button 
                        onClick={() => toggleUserStatus(user._id, user.isActive)}
                        style={{
                          ...styles.actionButton,
                          backgroundColor: user.isActive ? '#dc3545' : '#28a745'
                        }}
                      >
                        {user.isActive ? '🚫 Deactivate' : '✅ Activate'}
                      </button>
                      {!user.isAdmin && (
                        <button 
                          onClick={() => deleteUser(user._id)}
                          style={{...styles.actionButton, backgroundColor: '#dc3545'}}
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #e3e3e3',
    borderTop: '5px solid #ff6b35',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    marginTop: '1rem',
    fontSize: '1.2rem',
    color: '#666'
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#2c3e50',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
  },
  sidebarHeader: {
    padding: '2rem 1.5rem',
    borderBottom: '1px solid #34495e'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem'
  },
  logoIcon: {
    fontSize: '2rem'
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: '700'
  },
  adminBadge: {
    backgroundColor: '#ff6b35',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    textAlign: 'center'
  },
  sidebarNav: {
    flex: 1,
    padding: '1rem 0'
  },
  navSection: {
    marginBottom: '2rem'
  },
  navSectionTitle: {
    fontSize: '0.7rem',
    fontWeight: '600',
    color: '#95a5a6',
    margin: '0 0 1rem 1.5rem',
    letterSpacing: '1px'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    color: '#ecf0f1',
    textDecoration: 'none',
    transition: 'all 0.3s',
    borderLeft: '3px solid transparent'
  },
  navItemActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    color: 'white',
    textDecoration: 'none',
    backgroundColor: '#34495e',
    borderLeft: '3px solid #ff6b35'
  },
  navIcon: {
    fontSize: '1.2rem'
  },
  mainContent: {
    flex: 1,
    padding: '2rem',
    overflow: 'auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  backButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  pageTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2c3e50',
    margin: 0
  },
  pageSubtitle: {
    color: '#7f8c8d',
    fontSize: '1.1rem',
    margin: '0.5rem 0 0 0'
  },
  statsContainer: {
    display: 'flex',
    gap: '2rem'
  },
  statItem: {
    textAlign: 'center'
  },
  statNumber: {
    display: 'block',
    fontSize: '2rem',
    fontWeight: '700',
    color: '#ff6b35'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#7f8c8d'
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '1px solid #c3e6cb'
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '1px solid #f5c6cb'
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    overflow: 'hidden'
  },
  tableHeader: {
    padding: '2rem 2rem 1rem 2rem',
    borderBottom: '1px solid #ecf0f1'
  },
  tableTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0
  },
  table: {
    width: '100%'
  },
  tableHeaderRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr',
    gap: '1rem',
    padding: '1rem 2rem',
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #ecf0f1'
  },
  tableHeaderCell: {
    fontWeight: '600',
    color: '#2c3e50',
    fontSize: '0.9rem'
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr',
    gap: '1rem',
    padding: '1.5rem 2rem',
    borderBottom: '1px solid #ecf0f1',
    transition: 'background-color 0.3s'
  },
  tableCell: {
    display: 'flex',
    alignItems: 'center'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  userAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#ff6b35',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: '600'
  },
  userName: {
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '0.25rem'
  },
  userEmail: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    marginBottom: '0.25rem'
  },
  userPhone: {
    color: '#95a5a6',
    fontSize: '0.8rem'
  },
  roleBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  statusBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  dateInfo: {
    color: '#7f8c8d',
    fontSize: '0.9rem'
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  actionButton: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.3s'
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem',
    color: '#95a5a6'
  },
  emptyIcon: {
    fontSize: '4rem',
    display: 'block',
    marginBottom: '1rem'
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginLeft: '1rem'
  },
  sidebarFooter: {
    padding: '1.5rem',
    borderTop: '1px solid #34495e'
  },
  liveStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  liveDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#2ecc71',
    borderRadius: '50%',
    animation: 'pulse 2s infinite'
  },
  liveText: {
    fontSize: '0.9rem',
    color: '#95a5a6'
  },
  footerActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  footerButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: '#34495e',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'background-color 0.3s'
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  }
};

export default AdminUsers;