import React, { useState, useEffect } from 'react';
import { restaurantAPI, menuAPI } from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';

const AdminMenu = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    restaurant: ''
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

  const fetchMenuItems = async (restaurantId) => {
    setLoading(true);
    try {
      const response = await menuAPI.getByRestaurant(restaurantId);
      setMenuItems(response.data);
      const restaurant = restaurants.find(r => r._id === restaurantId);
      setSelectedRestaurant(restaurant);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError('Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const menuData = {
        ...formData,
        price: parseFloat(formData.price),
        restaurant: selectedRestaurant._id
      };
      
      if (editingId) {
        await menuAPI.update(editingId, menuData);
        setMessage('Menu item updated successfully!');
      } else {
        await menuAPI.create(menuData);
        setMessage('Menu item added successfully!');
      }
      
      fetchMenuItems(selectedRestaurant._id);
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', description: '', price: '', image: '', category: '', restaurant: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving menu item:', error);
      setError(error.response?.data?.message || 'Error saving menu item');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      image: item.image,
      category: item.category,
      restaurant: item.restaurant
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      setError('');
      setMessage('');
      try {
        await menuAPI.delete(id);
        setMenuItems(menuItems.filter(item => item._id !== id));
        setMessage('Menu item deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting menu item:', error);
        setError(error.response?.data?.message || 'Error deleting menu item');
      }
    }
  };

  if (loading && restaurants.length === 0) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading Menu Management...</p>
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
            <Link to="/admin/menu" style={styles.navItemActive}>
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
              <h1 style={styles.pageTitle}>Menu Management</h1>
              <p style={styles.pageSubtitle}>Manage menu items across all restaurants</p>
            </div>
          </div>
          {selectedRestaurant && (
            <button 
              onClick={() => setShowForm(true)}
              style={styles.addButton}
            >
              + Add Menu Item
            </button>
          )}
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
                  {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h3>
                <button 
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: '', description: '', price: '', image: '', category: '', restaurant: '' });
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
                    placeholder="Item Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={styles.input}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    style={styles.input}
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    style={styles.input}
                    required
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    style={styles.input}
                    required
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={styles.textarea}
                  required
                />
                <div style={styles.formButtons}>
                  <button type="submit" style={styles.saveButton}>
                    {editingId ? 'Update Item' : 'Add Item'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({ name: '', description: '', price: '', image: '', category: '', restaurant: '' });
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

        {/* Content */}
        {!selectedRestaurant ? (
          <div style={styles.restaurantSelection}>
            <h2 style={styles.sectionTitle}>Select Restaurant to Manage Menu</h2>
            <div style={styles.restaurantGrid}>
              {restaurants.map(restaurant => (
                <div 
                  key={restaurant._id} 
                  style={styles.restaurantCard}
                  onClick={() => fetchMenuItems(restaurant._id)}
                >
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    style={styles.restaurantImage}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Restaurant';
                    }}
                  />
                  <div style={styles.restaurantInfo}>
                    <h4 style={styles.restaurantName}>{restaurant.name}</h4>
                    <p style={styles.restaurantCuisine}>{restaurant.cuisine}</p>
                    <button style={styles.manageButton}>Manage Menu</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={styles.menuSection}>
            <div style={styles.menuHeader}>
              <h2 style={styles.sectionTitle}>{selectedRestaurant.name} - Menu Items</h2>
              <button 
                onClick={() => {
                  setSelectedRestaurant(null);
                  setMenuItems([]);
                }}
                style={styles.backToRestaurants}
              >
                ← Back to Restaurants
              </button>
            </div>
            
            <div style={styles.menuGrid}>
              {menuItems.map(item => (
                <div key={item._id} style={styles.menuCard}>
                  <img 
                    src={item.image} 
                    alt={item.name}
                    style={styles.menuImage}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x150?text=Food';
                    }}
                  />
                  <div style={styles.menuInfo}>
                    <div style={styles.menuItemHeader}>
                      <h4 style={styles.menuItemName}>{item.name}</h4>
                      <span style={styles.categoryBadge}>{item.category}</span>
                    </div>
                    <p style={styles.menuItemDescription}>{item.description}</p>
                    <div style={styles.menuItemFooter}>
                      <span style={styles.menuItemPrice}>${item.price}</span>
                      <div style={styles.menuActions}>
                        <button 
                          onClick={() => handleEdit(item)}
                          style={styles.editButton}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(item._id)}
                          style={styles.deleteButton}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {menuItems.length === 0 && (
              <div style={styles.emptyState}>
                <span style={styles.emptyIcon}>📋</span>
                <h3>No Menu Items Found</h3>
                <p>Add your first menu item for {selectedRestaurant.name}</p>
                <button onClick={() => setShowForm(true)} style={styles.emptyButton}>
                  Add Menu Item
                </button>
              </div>
            )}
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
  restaurantSelection: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '2rem'
  },
  restaurantGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem'
  },
  restaurantCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.3s',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  restaurantImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover'
  },
  restaurantInfo: {
    padding: '1rem',
    textAlign: 'center'
  },
  restaurantName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 0.5rem 0'
  },
  restaurantCuisine: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    margin: '0 0 1rem 0'
  },
  manageButton: {
    backgroundColor: '#ff6b35',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  menuSection: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  menuHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  backToRestaurants: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  menuCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  menuImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover'
  },
  menuInfo: {
    padding: '1rem'
  },
  menuItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem'
  },
  menuItemName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0,
    flex: 1
  },
  categoryBadge: {
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: '600'
  },
  menuItemDescription: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    margin: '0.5rem 0',
    lineHeight: '1.4'
  },
  menuItemFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  menuItemPrice: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#28a745'
  },
  menuActions: {
    display: 'flex',
    gap: '0.5rem'
  },
  editButton: {
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600'
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
  }
};

export default AdminMenu;