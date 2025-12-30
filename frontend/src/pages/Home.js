import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Delicious Food Delivered Fast</h1>
        <p style={styles.subtitle}>
          Order from your favorite restaurants and get food delivered to your doorstep
        </p>
        {isAuthenticated ? (
          <Link to="/restaurants" style={styles.button}>
            Browse Restaurants
          </Link>
        ) : (
          <div style={styles.buttonGroup}>
            <Link to="/register" style={styles.button}>
              Get Started
            </Link>
            <Link to="/login" style={styles.buttonSecondary}>
              Login
            </Link>
          </div>
        )}
      </div>
      
      <div style={styles.features}>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>🍕</div>
          <h3>Wide Selection</h3>
          <p>Choose from hundreds of restaurants and cuisines</p>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>🚚</div>
          <h3>Fast Delivery</h3>
          <p>Get your food delivered in 30 minutes or less</p>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>📱</div>
          <h3>Easy Ordering</h3>
          <p>Simple and intuitive ordering process</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '80vh'
  },
  hero: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '2rem',
    maxWidth: '600px',
    margin: '0 auto 2rem auto'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: '1rem 2rem',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold'
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    color: '#ff6b35',
    padding: '1rem 2rem',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    border: '2px solid #ff6b35'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    padding: '4rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  feature: {
    textAlign: 'center',
    padding: '2rem'
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  }
};

export default Home;