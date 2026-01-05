import React, { useState, useEffect } from 'react';
import { restaurantAPI } from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ 
    name: '', 
    cuisine: '', 
    description: '', 
    image: '', 
    deliveryTime: '', 
    address: '', 
    phone: '' 
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll();
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setError('Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      if (editingId) {
        await restaurantAPI.update(editingId, formData);
        setMessage('Restaurant updated successfully!');
      } else {
        await restaurantAPI.create(formData);
        setMessage('Restaurant added successfully!');
      }
      fetchRestaurants();
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', cuisine: '', description: '', image: '', deliveryTime: '', address: '', phone: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving restaurant:', error);
      setError(error.response?.data?.message || 'Error saving restaurant');
    }
  };

  const handleEdit = (restaurant) => {
    setFormData({ 
      name: restaurant.name, 
      cuisine: restaurant.cuisine, 
      description: restaurant.description || '',
      image: restaurant.image || '',
      deliveryTime: restaurant.deliveryTime || '',
      address: restaurant.address || '',
      phone: restaurant.phone || ''
    });
    setEditingId(restaurant._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      setError('');
      setMessage('');
      try {
        await restaurantAPI.delete(id);
        setRestaurants(restaurants.filter(r => r._id !== id));
        setMessage('Restaurant deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting restaurant:', error);
        setError(error.response?.data?.message || 'Error deleting restaurant');
      }
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading Restaurants...</p>
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
            <Link to="/admin/restaurants" style={styles.navItemActive}>
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
            <Link to="/admin/users" style={styles.navItem}>
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
              <h1 style={styles.pageTitle}>Restaurant Management</h1>
              <p style={styles.pageSubtitle}>Manage your restaurant partners</p>
            </div>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            style={styles.addButton}
          >
            + Add Restaurant
          </button>
        </div>

        {/* Messages */}
        {message && <div style={styles.successMessage}>{message}</div>}
        {error && <div style={styles.errorMessage}>{error}</div>}

        {/* Form Modal */}
        {showForm && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>
                  {editingId ? 'Edit Restaurant' : 'Add New Restaurant'}
                </h3>
                <button 
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: '', cuisine: '', description: '', image: '', deliveryTime: '', address: '', phone: '' });
                  }}
                  style={styles.closeButton}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGrid}>
                  <input
                    type="text"
                    placeholder="Restaurant Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={styles.input}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Cuisine Type"
                    value={formData.cuisine}
                    onChange={(e) => setFormData({...formData, cuisine: e.target.value})}
                    style={styles.input}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    style={styles.input}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Delivery Time (e.g., 30-45 min)"
                    value={formData.deliveryTime}
                    onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})}
                    style={styles.input}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    style={styles.input}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={styles.input}
                    required
                  />
                </div>
                <textarea
                  placeholder="Description (optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={styles.textarea}
                />
                <div style={styles.formButtons}>
                  <button type="submit" style={styles.saveButton}>
                    {editingId ? 'Update Restaurant' : 'Add Restaurant'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({ name: '', cuisine: '', description: '', image: '', deliveryTime: '', address: '', phone: '' });
                    }}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Restaurants Grid */}
        <div style={styles.restaurantsGrid}>
          {restaurants.map(restaurant => (
            <div key={restaurant._id} style={styles.restaurantCard}>
              <div style={styles.restaurantImage}>
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name}
                  style={styles.image}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Restaurant';
                  }}
                />
              </div>
              <div style={styles.restaurantInfo}>
                <h3 style={styles.restaurantName}>{restaurant.name}</h3>
                <div style={styles.restaurantMeta}>
                  <span style={styles.cuisine}>{restaurant.cuisine}</span>
                  <span style={styles.deliveryTime}>🕒 {restaurant.deliveryTime}</span>
                </div>
                <p style={styles.address}>📍 {restaurant.address}</p>
                <p style={styles.phone}>📞 {restaurant.phone}</p>
                <div style={styles.actions}>
                  <button 
                    onClick={() => handleEdit(restaurant)}
                    style={styles.editButton}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(restaurant._id)}
                    style={styles.deleteButton}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {restaurants.length === 0 && (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>🏪</span>
            <h3>No Restaurants Found</h3>
            <p>Add your first restaurant to get started</p>
            <button onClick={() => setShowForm(true)} style={styles.emptyButton}>
              Add Restaurant
            </button>
          </div>
        )}
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
  addButton: {
    backgroundColor: '#ff6b35',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)'
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
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '2rem',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '2rem',
    cursor: 'pointer',
    color: '#95a5a6'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem'
  },
  input: {
    padding: '1rem',
    border: '2px solid #ecf0f1',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.3s'
  },
  textarea: {
    padding: '1rem',
    border: '2px solid #ecf0f1',
    borderRadius: '8px',
    fontSize: '1rem',
    minHeight: '100px',
    resize: 'vertical'
  },
  formButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end'
  },
  saveButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  restaurantsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem'
  },
  restaurantCard: {
    backgroundColor: 'white',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s'
  },
  restaurantImage: {
    height: '200px',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  restaurantInfo: {
    padding: '1.5rem'
  },
  restaurantName: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 1rem 0'
  },
  restaurantMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem'
  },
  cuisine: {
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '15px',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  deliveryTime: {
    color: '#7f8c8d',
    fontSize: '0.9rem'
  },
  address: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    margin: '0.5rem 0'
  },
  phone: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    margin: '0.5rem 0 1rem 0'
  },
  actions: {
    display: 'flex',
    gap: '0.75rem'
  },
  editButton: {
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    flex: 1
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    flex: 1
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  emptyIcon: {
    fontSize: '4rem',
    display: 'block',
    marginBottom: '1rem'
  },
  emptyButton: {
    backgroundColor: '#ff6b35',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    marginTop: '1rem'
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

export default AdminRestaurants;