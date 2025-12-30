import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          🍕 FoodDelivery
        </Link>
        
        <nav style={styles.nav}>
          {isAuthenticated ? (
            <>
              <Link to="/restaurants" style={styles.link}>Restaurants</Link>
              <Link to="/orders" style={styles.link}>Orders</Link>
              <Link to="/cart" style={styles.cartLink}>
                Cart ({items.length})
              </Link>
              {user?.isAdmin && (
                <Link to="/admin" style={styles.link}>Admin</Link>
              )}
              <span style={styles.welcome}>Hi, {user?.name}</span>
              <button onClick={handleLogout} style={styles.button}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.link}>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: 'white'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s'
  },
  cartLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    fontWeight: 'bold'
  },
  welcome: {
    marginLeft: '1rem'
  },
  button: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default Header;