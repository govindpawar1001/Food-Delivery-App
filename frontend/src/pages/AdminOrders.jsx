import React, { useState, useEffect } from 'react';
import { orderAPI } from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAllOrders();
      const apiOrders = response.data;
      
      // Get orders from localStorage
      const localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      
      // Combine API orders and local orders
      const allOrders = [...apiOrders, ...localOrders];
      setOrders(allOrders);
    } catch (error) {
      // If API fails, just show local orders
      const localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      setOrders(localOrders);
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

  const getFilteredOrders = () => {
    if (filter === 'all') return orders;
    return orders.filter(order => order.status === filter);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return '#ffc107';
      case 'Preparing': return '#17a2b8';
      case 'Delivered': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'Pending').length,
      preparing: orders.filter(o => o.status === 'Preparing').length,
      delivered: orders.filter(o => o.status === 'Delivered').length
    };
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading Orders...</p>
      </div>
    );
  }

  const stats = getStatusStats();
  const filteredOrders = getFilteredOrders();

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
            <Link to="/admin/orders" style={styles.navItemActive}>
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
              <h1 style={styles.pageTitle}>Order Management</h1>
              <p style={styles.pageSubtitle}>Track and manage all customer orders</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📊</div>
            <div>
              <h3 style={styles.statNumber}>{stats.total}</h3>
              <p style={styles.statLabel}>Total Orders</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⏳</div>
            <div>
              <h3 style={styles.statNumber}>{stats.pending}</h3>
              <p style={styles.statLabel}>Pending</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>👨‍🍳</div>
            <div>
              <h3 style={styles.statNumber}>{stats.preparing}</h3>
              <p style={styles.statLabel}>Preparing</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>✅</div>
            <div>
              <h3 style={styles.statNumber}>{stats.delivered}</h3>
              <p style={styles.statLabel}>Delivered</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={styles.filterContainer}>
          <div style={styles.filterTabs}>
            <button 
              onClick={() => setFilter('all')}
              style={filter === 'all' ? styles.activeTab : styles.tab}
            >
              All Orders ({stats.total})
            </button>
            <button 
              onClick={() => setFilter('Pending')}
              style={filter === 'Pending' ? styles.activeTab : styles.tab}
            >
              Pending ({stats.pending})
            </button>
            <button 
              onClick={() => setFilter('Preparing')}
              style={filter === 'Preparing' ? styles.activeTab : styles.tab}
            >
              Preparing ({stats.preparing})
            </button>
            <button 
              onClick={() => setFilter('Delivered')}
              style={filter === 'Delivered' ? styles.activeTab : styles.tab}
            >
              Delivered ({stats.delivered})
            </button>
          </div>
          <button onClick={fetchOrders} style={styles.refreshButton}>
            🔄 Refresh
          </button>
        </div>

        {/* Orders List */}
        <div style={styles.ordersContainer}>
          {filteredOrders.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>📋</span>
              <h3>No Orders Found</h3>
              <p>No orders match the current filter</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order._id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <div style={styles.orderInfo}>
                    <h4 style={styles.restaurantName}>
                      🏪 {order.restaurant?.name || 'Unknown Restaurant'}
                    </h4>
                    <div style={styles.orderMeta}>
                      <span style={styles.orderId}>Order #{order._id?.slice(-6) || 'N/A'}</span>
                      <span style={styles.orderDate}>
                        📅 {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span style={styles.orderTime}>
                        🕒 {new Date(order.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div style={styles.orderAmount}>
                    ₹{order.totalAmount?.toFixed(2) || '0.00'}
                  </div>
                </div>

                <div style={styles.customerInfo}>
                  <div style={styles.customerDetails}>
                    <div style={styles.customerName}>
                      👤 {order.user?.name || 'Unknown Customer'}
                    </div>
                    <div style={styles.customerContact}>
                      📧 {order.user?.email || 'No email'}
                    </div>
                    <div style={styles.customerPhone}>
                      📞 {order.user?.phone || order.phone || 'No phone'}
                    </div>
                    <div style={styles.deliveryAddress}>
                      📍 {order.deliveryAddress || order.user?.address || 'No address'}
                    </div>
                  </div>
                </div>

                <div style={styles.orderItems}>
                  <h5 style={styles.itemsTitle}>Order Items:</h5>
                  <div style={styles.itemsList}>
                    {order.items?.map((item, index) => (
                      <div key={index} style={styles.orderItem}>
                        <span style={styles.itemName}>
                          {item.menuItem?.name || 'Unknown Item'}
                        </span>
                        <span style={styles.itemQuantity}>
                          x{item.quantity || 0}
                        </span>
                        <span style={styles.itemPrice}>
                          ₹{((item.menuItem?.price || 0) * (item.quantity || 0)).toFixed(2)}
                        </span>
                      </div>
                    )) || <div style={styles.noItems}>No items</div>}
                  </div>
                </div>

                <div style={styles.orderActions}>
                  <div style={styles.statusSection}>
                    <label style={styles.statusLabel}>Status:</label>
                    <select 
                      value={order.status || 'Pending'}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      style={{
                        ...styles.statusSelect,
                        backgroundColor: getStatusColor(order.status)
                      }}
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="Preparing">👨‍🍳 Preparing</option>
                      <option value="Delivered">✅ Delivered</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  statIcon: {
    fontSize: '2.5rem'
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#2c3e50',
    margin: 0
  },
  statLabel: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    margin: '0.25rem 0 0 0'
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  filterTabs: {
    display: 'flex',
    gap: '0.5rem'
  },
  tab: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#7f8c8d',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  activeTab: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#ff6b35',
    color: 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  refreshButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  ordersContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem'
  },
  orderInfo: {
    flex: 1
  },
  restaurantName: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 0.5rem 0'
  },
  orderMeta: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  orderId: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  orderDate: {
    color: '#7f8c8d',
    fontSize: '0.9rem'
  },
  orderTime: {
    color: '#7f8c8d',
    fontSize: '0.9rem'
  },
  orderAmount: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#28a745'
  },
  customerInfo: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '10px',
    marginBottom: '1.5rem'
  },
  customerDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '0.5rem'
  },
  customerName: {
    fontWeight: '600',
    color: '#2c3e50'
  },
  customerContact: {
    color: '#7f8c8d',
    fontSize: '0.9rem'
  },
  customerPhone: {
    color: '#7f8c8d',
    fontSize: '0.9rem'
  },
  deliveryAddress: {
    color: '#7f8c8d',
    fontSize: '0.9rem'
  },
  orderItems: {
    marginBottom: '1.5rem'
  },
  itemsTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '1rem'
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  itemName: {
    flex: 1,
    fontWeight: '500',
    color: '#2c3e50'
  },
  itemQuantity: {
    color: '#7f8c8d',
    marginRight: '1rem'
  },
  itemPrice: {
    fontWeight: '600',
    color: '#28a745'
  },
  noItems: {
    color: '#95a5a6',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '1rem'
  },
  orderActions: {
    borderTop: '1px solid #ecf0f1',
    paddingTop: '1.5rem'
  },
  statusSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  statusLabel: {
    fontWeight: '600',
    color: '#2c3e50'
  },
  statusSelect: {
    padding: '0.75rem 1rem',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    minWidth: '150px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
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
    fontWeight: '600'
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

export default AdminOrders;