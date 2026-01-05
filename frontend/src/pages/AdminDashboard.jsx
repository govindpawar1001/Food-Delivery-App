import React, { useState, useEffect } from 'react';
import { restaurantAPI, orderAPI, menuAPI, userAPI } from '../utils/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    totalRestaurants: 0,
    pendingOrders: 0,
    todayOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      fetchDashboardData();
      setCurrentTime(new Date());
    }, 30000);

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, usersRes, restaurantsRes] = await Promise.all([
        orderAPI.getAllOrders(),
        userAPI.getAll(),
        restaurantAPI.getAll()
      ]);

      const orders = [...ordersRes.data, ...JSON.parse(localStorage.getItem('userOrders') || '[]')];
      const users = usersRes.data;
      const restaurants = restaurantsRes.data;

      const today = new Date().toDateString();
      const todayOrders = orders.filter(order => 
        new Date(order.createdAt).toDateString() === today
      );

      setStats({
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
        activeUsers: users.filter(user => user.isActive).length,
        totalRestaurants: restaurants.length,
        pendingOrders: orders.filter(order => order.status === 'Pending').length,
        todayOrders: todayOrders.length
      });

      setRecentOrders(orders.slice(0, 6));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Sidebar Navigation */}
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
            <Link to="/admin" style={styles.navItemActive}>
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
            <Link to="/admin/users" style={styles.navItem}>
              <span style={styles.navIcon}>👥</span>
              Users
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Top Header */}
        <div style={styles.topHeader}>
          <div>
            <h1 style={styles.pageTitle}>Dashboard Overview</h1>
            <p style={styles.pageSubtitle}>Real-time food delivery analytics</p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.timeDisplay}>
              <div style={styles.currentTime}>{currentTime.toLocaleTimeString()}</div>
              <div style={styles.currentDate}>{currentTime.toLocaleDateString()}</div>
            </div>
            <button onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/';
            }} style={styles.logoutBtn}>
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={{...styles.statCard, ...styles.primaryGradient}}>
            <div style={styles.statIcon}>📈</div>
            <div style={styles.statContent}>
              <h3 style={styles.statNumber}>{stats.totalOrders}</h3>
              <p style={styles.statLabel}>Total Orders</p>
              <span style={styles.statTrend}>+12% from last month</span>
            </div>
          </div>

          <div style={{...styles.statCard, ...styles.successGradient}}>
            <div style={styles.statIcon}>💰</div>
            <div style={styles.statContent}>
              <h3 style={styles.statNumber}>${stats.totalRevenue.toFixed(0)}</h3>
              <p style={styles.statLabel}>Total Revenue</p>
              <span style={styles.statTrend}>+8% from last month</span>
            </div>
          </div>

          <div style={{...styles.statCard, ...styles.warningGradient}}>
            <div style={styles.statIcon}>⏳</div>
            <div style={styles.statContent}>
              <h3 style={styles.statNumber}>{stats.pendingOrders}</h3>
              <p style={styles.statLabel}>Pending Orders</p>
              <span style={styles.statTrend}>Needs attention</span>
            </div>
          </div>

          <div style={{...styles.statCard, ...styles.infoGradient}}>
            <div style={styles.statIcon}>👥</div>
            <div style={styles.statContent}>
              <h3 style={styles.statNumber}>{stats.activeUsers}</h3>
              <p style={styles.statLabel}>Active Users</p>
              <span style={styles.statTrend}>+5% this week</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div style={styles.contentGrid}>
          {/* Recent Orders */}
          <div style={styles.contentCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Recent Orders</h3>
              <button style={styles.refreshBtn} onClick={fetchDashboardData}>
                🔄 Refresh
              </button>
            </div>
            <div style={styles.ordersContainer}>
              {recentOrders.length === 0 ? (
                <div style={styles.emptyState}>
                  <span style={styles.emptyIcon}>📋</span>
                  <p>No recent orders</p>
                </div>
              ) : (
                recentOrders.map(order => (
                  <div key={order._id} style={styles.orderItem}>
                    <div style={styles.orderInfo}>
                      <div style={styles.orderRestaurant}>
                        {order.restaurant?.name || 'Unknown Restaurant'}
                      </div>
                      <div style={styles.orderCustomer}>
                        {order.user?.name || 'Unknown Customer'}
                      </div>
                      <div style={styles.orderTime}>
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <div style={styles.orderActions}>
                      <div style={styles.orderAmount}>
                        ${order.totalAmount?.toFixed(2) || '0.00'}
                      </div>
                      <select 
                        value={order.status || 'Pending'}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        style={{
                          ...styles.statusSelect,
                          backgroundColor: getStatusColor(order.status)
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div style={styles.contentCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Today's Summary</h3>
            </div>
            <div style={styles.quickStats}>
              <div style={styles.quickStatItem}>
                <span style={styles.quickStatIcon}>📅</span>
                <div>
                  <div style={styles.quickStatNumber}>{stats.todayOrders}</div>
                  <div style={styles.quickStatLabel}>Today's Orders</div>
                </div>
              </div>
              <div style={styles.quickStatItem}>
                <span style={styles.quickStatIcon}>🏪</span>
                <div>
                  <div style={styles.quickStatNumber}>{stats.totalRestaurants}</div>
                  <div style={styles.quickStatLabel}>Total Restaurants</div>
                </div>
              </div>
              <div style={styles.quickStatItem}>
                <span style={styles.quickStatIcon}>⭐</span>
                <div>
                  <div style={styles.quickStatNumber}>4.8</div>
                  <div style={styles.quickStatLabel}>Avg Rating</div>
                </div>
              </div>
            </div>

            <div style={styles.quickActions}>
              <h4 style={styles.quickActionsTitle}>Quick Actions</h4>
              <div style={styles.actionGrid}>
                <Link to="/admin/orders" style={styles.actionButton}>
                  <span>📋</span> View Orders
                </Link>
                <Link to="/admin/restaurants" style={styles.actionButton}>
                  <span>🏪</span> Manage Restaurants
                </Link>
                <Link to="/admin/users" style={styles.actionButton}>
                  <span>👥</span> User Management
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch(status) {
    case 'Pending': return '#ffc107';
    case 'Preparing': return '#17a2b8';
    case 'Delivered': return '#28a745';
    default: return '#6c757d';
  }
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
  },
  mainContent: {
    flex: 1,
    padding: '2rem',
    overflow: 'auto'
  },
  topHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
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
  headerRight: {
    textAlign: 'right'
  },
  timeDisplay: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '10px'
  },
  currentTime: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2c3e50'
  },
  currentDate: {
    fontSize: '0.9rem',
    color: '#7f8c8d',
    marginTop: '0.25rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    position: 'relative',
    overflow: 'hidden'
  },
  primaryGradient: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  successGradient: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  warningGradient: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  infoGradient: {
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  statIcon: {
    fontSize: '3rem',
    opacity: 0.8
  },
  statContent: {
    color: 'white'
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: 0,
    color: 'white'
  },
  statLabel: {
    fontSize: '1rem',
    margin: '0.5rem 0',
    opacity: 0.9
  },
  statTrend: {
    fontSize: '0.8rem',
    opacity: 0.8
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem'
  },
  contentCard: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0
  },
  refreshBtn: {
    backgroundColor: '#ff6b35',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  ordersContainer: {
    maxHeight: '400px',
    overflowY: 'auto'
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    borderBottom: '1px solid #ecf0f1',
    transition: 'background-color 0.3s'
  },
  orderInfo: {
    flex: 1
  },
  orderRestaurant: {
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '0.25rem'
  },
  orderCustomer: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    marginBottom: '0.25rem'
  },
  orderTime: {
    color: '#95a5a6',
    fontSize: '0.8rem'
  },
  orderActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  orderAmount: {
    fontWeight: '700',
    color: '#27ae60',
    fontSize: '1.1rem'
  },
  statusSelect: {
    padding: '0.5rem',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.8rem',
    cursor: 'pointer'
  },
  quickStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  quickStatItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px'
  },
  quickStatIcon: {
    fontSize: '2rem'
  },
  quickStatNumber: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2c3e50'
  },
  quickStatLabel: {
    color: '#7f8c8d',
    fontSize: '0.9rem'
  },
  quickActions: {
    borderTop: '1px solid #ecf0f1',
    paddingTop: '1.5rem'
  },
  quickActionsTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '1rem'
  },
  actionGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    backgroundColor: '#ff6b35',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'transform 0.3s'
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
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#95a5a6'
  },
  emptyIcon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '1rem'
  }
};

export default AdminDashboard;