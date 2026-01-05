import React, { useState, useEffect } from 'react';
import { orderAPI } from '../utils/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getUserOrders();
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ffc107';
      case 'Preparing': return '#17a2b8';
      case 'Delivered': return '#28a745';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading orders...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Orders</h1>
      
      {orders.length === 0 ? (
        <div style={styles.empty}>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div style={styles.orders}>
          {orders.map(order => (
            <div key={order._id} style={styles.order}>
              <div style={styles.orderHeader}>
                <div>
                  <h3 style={styles.restaurantName}>{order.restaurant.name}</h3>
                  <p style={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div style={styles.statusContainer}>
                  <span 
                    style={{
                      ...styles.status,
                      backgroundColor: getStatusColor(order.status)
                    }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div style={styles.orderItems}>
                {order.items.map((item, index) => (
                  <div key={index} style={styles.orderItem}>
                    <span>{item.menuItem.name}</span>
                    <span>x{item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div style={styles.orderFooter}>
                <div style={styles.deliveryInfo}>
                  <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                  <p><strong>Phone:</strong> {order.phone}</p>
                </div>
                <div style={styles.totalAmount}>
                  <strong>Total: ₹{order.totalAmount.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2rem'
  },
  orders: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  order: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '1.5rem'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  },
  restaurantName: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.25rem',
    fontWeight: 'bold'
  },
  orderDate: {
    margin: 0,
    color: '#666',
    fontSize: '0.9rem'
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  orderItems: {
    marginBottom: '1rem'
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid #eee'
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: '1rem',
    borderTop: '1px solid #eee'
  },
  deliveryInfo: {
    fontSize: '0.9rem'
  },
  totalAmount: {
    fontSize: '1.1rem',
    color: '#ff6b35'
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.2rem'
  },
  error: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.2rem',
    color: '#c33'
  },
  empty: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.2rem',
    color: '#666'
  }
};

export default Orders;