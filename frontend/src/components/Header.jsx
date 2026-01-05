import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Hide navbar completely for admin users
  if (user?.isAdmin) {
    return null;
  }

  return (
    <motion.header 
      style={styles.header}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <motion.div 
            style={styles.logoIcon}
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.3 }}
          >
            F
          </motion.div>
          <motion.span 
            style={styles.logoText}
            whileHover={{ scale: 1.05 }}
          >
            Foody
          </motion.span>
        </Link>
        
        <nav style={styles.nav}>
          {user?.isAdmin ? (
            <>
            </>
          ) : isAuthenticated ? (
            <>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
                className="nav-item"
              >
                <Link to="/restaurants" style={styles.navLink}>Restaurants</Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
                className="nav-item"
              >
                <Link to="/orders" style={styles.navLink}>My Orders</Link>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
                className="nav-item"
              >
                <Link to="/" style={styles.navLink}>Home</Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
                className="nav-item"
              >
                <Link to="/about" style={styles.navLink}>About</Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
                className="nav-item"
              >
                <Link to="/restaurants" style={styles.navLink}>Services</Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
                className="nav-item"
              >
                <Link to="/contact" style={styles.navLink}>Contact</Link>
              </motion.div>
            </>
          )}
        </nav>
        
        <div style={styles.rightNav}>
          {isAuthenticated ? (
            <>
              {!user?.isAdmin && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="pulse"
                >
                  <Link to="/cart" style={styles.cartLink}>
                    Cart ({items.length})
                  </Link>
                </motion.div>
              )}
              <motion.span 
                style={styles.welcome}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Hi, {user?.name}
              </motion.span>
              <motion.button 
                onClick={handleLogout} 
                style={styles.logoutBtn}
                whileHover={{ scale: 1.05, backgroundColor: '#ff6b35', color: 'white' }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" style={styles.signInBtn}>Sign In</Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
                className="btn-animate"
              >
                <Link to="/register" style={styles.orderBtn}>Order Now</Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
};

const styles = {
  header: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,255,0.95) 100%)',
    backdropFilter: 'blur(20px)',
    padding: '1rem 0',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    border: '1px solid rgba(255,255,255,0.2)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    gap: '0.5rem'
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  },
  navLink: {
    color: '#666',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'color 0.3s'
  },
  rightNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  signInBtn: {
    color: '#333',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500'
  },
  orderBtn: {
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    textDecoration: 'none',
    borderRadius: '25px',
    fontSize: '1rem',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
    border: 'none'
  },
  cartLink: {
    background: 'linear-gradient(135deg, #4834d4 0%, #686de0 100%)',
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(72, 52, 212, 0.3)'
  },
  welcome: {
    color: '#666',
    fontSize: '0.9rem'
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: '#666',
    border: '1px solid #ddd',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  }
};

export default Header;