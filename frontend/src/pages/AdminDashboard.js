import React, { useState, useEffect } from 'react';
import { restaurantAPI, orderAPI } from '../utils/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'restaurants') {
      fetchRestaurants();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderAPI.getAllOrders();
      const apiOrders = response.data;
      
      // Get orders from localStorage
      const localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      
      // Combine API orders and local orders
      setOrders([...apiOrders, ...localOrders]);
    } catch (error) {
      // If API fails, just show local orders
      const localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      setOrders(localOrders);
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await restaurantAPI.getAll();
      setRestaurants(response.data);
    } catch (error) {
      console.error('Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      // Update in localStorage
      const localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      const updatedOrders = localOrders.map(order => 
        order._id === orderId ? { ...order, status } : order
      );
      localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
      
      // Try API update
      await orderAPI.updateStatus(orderId, status);
      fetchOrders(); // Refresh orders
    } catch (error) {
      // Even if API fails, localStorage is updated
      fetchOrders();
    }
  };

  const deleteRestaurant = async (restaurantId) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await restaurantAPI.delete(restaurantId);
        fetchRestaurants(); // Refresh restaurants
      } catch (error) {
        console.error('Failed to delete restaurant');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>
      
      <div style={styles.tabs}>
        <button 
          onClick={() => setActiveTab('orders')}
          style={activeTab === 'orders' ? styles.activeTab : styles.tab}
        >
          Orders
        </button>
        <button 
          onClick={() => setActiveTab('restaurants')}
          style={activeTab === 'restaurants' ? styles.activeTab : styles.tab}
        >
          Restaurants
        </button>
      </div>

      {loading && <div style={styles.loading}>Loading...</div>}

      {activeTab === 'orders' && (
        <div style={styles.content}>
          <h2>Manage Orders</h2>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div style={styles.orders}>
              {orders.map(order => (
                <div key={order._id} style={styles.orderCard}>
                  <div style={styles.orderHeader}>
                    <div>
                      <h4>{order.restaurant?.name || 'Unknown Restaurant'}</h4>
                      <p>Customer: {order.user?.name || 'Unknown'} ({order.user?.email || 'No email'})</p>
                      <p>Phone: {order.phone || 'No phone'}</p>
                      <p>Address: {order.deliveryAddress || 'No address'}</p>
                    </div>
                    <div>
                      <p>Total: ${order.totalAmount?.toFixed(2) || '0.00'}</p>
                      <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div style={styles.orderItems}>
                    {order.items?.map((item, index) => (
                      <div key={index} style={styles.orderItem}>
                        {item.menuItem?.name || 'Unknown Item'} x{item.quantity || 0}
                      </div>
                    )) || <div>No items</div>}
                  </div>
                  
                  <div style={styles.statusControls}>
                    <span>Status: </span>
                    <select 
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      style={styles.statusSelect}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'restaurants' && (
        <div style={styles.content}>
          <h2>Manage Restaurants</h2>
          {restaurants.length === 0 ? (
            <p>No restaurants found.</p>
          ) : (
            <div style={styles.restaurants}>
              {restaurants.map(restaurant => (
                <div key={restaurant._id} style={styles.restaurantCard}>
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    style={styles.restaurantImage}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x150?text=Restaurant';
                    }}
                  />
                  <div style={styles.restaurantInfo}>
                    <h4>{restaurant.name}</h4>
                    <p>Cuisine: {restaurant.cuisine}</p>
                    <p>Rating: {restaurant.rating}</p>
                    <p>Delivery Time: {restaurant.deliveryTime}</p>
                    <p>Address: {restaurant.address}</p>
                    <button 
                      onClick={() => deleteRestaurant(restaurant._id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2rem'
  },
  tabs: {
    display: 'flex',
    marginBottom: '2rem',
    borderBottom: '1px solid #ddd'
  },
  tab: {
    padding: '1rem 2rem',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  activeTab: {
    padding: '1rem 2rem',
    border: 'none',
    backgroundColor: '#ff6b35',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  content: {
    marginTop: '2rem'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.2rem'
  },
  orders: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  orderCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  },
  orderItems: {
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px'
  },
  orderItem: {
    marginBottom: '0.5rem'
  },
  statusControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  statusSelect: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  restaurants: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  restaurantCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  restaurantImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover'
  },
  restaurantInfo: {
    padding: '1rem'
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1rem'
  }
};

export default AdminDashboard;