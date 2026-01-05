import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { restaurantAPI } from '../utils/api';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll();
      setRestaurants(response.data.slice(0, 3)); // Show only first 3
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await restaurantAPI.delete(id);
        setRestaurants(restaurants.filter(r => r._id !== id));
      } catch (error) {
        console.error('Error deleting restaurant:', error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.leftSection}>
            <div style={styles.badge}>
              <span style={styles.badgeIcon}>📍</span>
              Now delivering in 50+ cities
            </div>
            
            <h1 style={styles.title}>
              Discover food you love. <span style={styles.titleHighlight}>Delivered fast.</span>
            </h1>
            
            <p style={styles.subtitle}>
              From local favorites to global cuisines — discover restaurants, order with ease, and enjoy lightning-fast delivery powered by smart logistics.
            </p>
            
            <div style={styles.buttonGroup}>
              {isAuthenticated ? (
                <Link to="/restaurants" style={styles.orderButton}>
                  Order Food →
                </Link>
              ) : (
                <Link to="/login" style={styles.orderButton}>
                  Order Food →
                </Link>
              )}
            </div>
            
            <div style={styles.stats}>
              50K+ Happy Customers
            </div>
          </div>
          
          <div style={styles.rightSection}>
            <div style={styles.foodImageContainer}>
              <div style={styles.foodGrid}>
                <div style={styles.foodItem1}>🍔</div>
                <div style={styles.foodItem2}>🍕</div>
                <div style={styles.foodItem3}>🥗</div>
                <div style={styles.foodItem4}>🍜</div>
                <div style={styles.foodItem5}>🧁</div>
              </div>
              
              <div style={styles.ratingCard}>
                <div style={styles.ratingStars}>⭐ 4.9</div>
                <div style={styles.ratingText}>(2.5K reviews)</div>
              </div>
              
              <div style={styles.deliveryCard}>
                <div style={styles.deliveryAvatar}>👨‍🍳</div>
                <div>
                  <div style={styles.deliveryTitle}>Order on the way!</div>
                  <div style={styles.deliveryTime}>Arriving in 12 min</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {restaurants.length > 0 && (
        <div style={styles.restaurantsSection}>
          <h2 style={styles.sectionTitle}>Featured Restaurants</h2>
          <div style={styles.restaurantGrid}>
            {restaurants.map(restaurant => (
              <div key={restaurant._id} style={styles.restaurantCard}>
                <h3 style={styles.restaurantName}>{restaurant.name}</h3>
                <p style={styles.restaurantCuisine}>{restaurant.cuisine}</p>
                {user?.isAdmin && (
                  <button 
                    onClick={() => handleDelete(restaurant._id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '90vh',
    backgroundColor: '#fef7f0'
  },
  hero: {
    padding: '2rem 0 4rem 0'
  },
  heroContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center',
    minHeight: '80vh'
  },
  leftSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    color: '#ff6b35',
    fontWeight: '500',
    width: 'fit-content',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  badgeIcon: {
    fontSize: '1rem'
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '700',
    color: '#333',
    lineHeight: '1.1',
    margin: '0'
  },
  titleHighlight: {
    color: '#ff6b35'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
    lineHeight: '1.6',
    margin: '0'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  orderButton: {
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: '1rem 2rem',
    textDecoration: 'none',
    borderRadius: '25px',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'transform 0.3s, box-shadow 0.3s',
    boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)'
  },
  partnerButton: {
    backgroundColor: 'transparent',
    color: '#666',
    padding: '1rem 2rem',
    textDecoration: 'none',
    borderRadius: '25px',
    fontSize: '1.1rem',
    fontWeight: '600',
    border: '2px solid #e0e0e0',
    transition: 'all 0.3s'
  },
  stats: {
    color: '#999',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  rightSection: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  foodImageContainer: {
    position: 'relative',
    width: '100%',
    height: '500px',
    background: 'linear-gradient(135deg, #ff8a50, #ff6b35)',
    borderRadius: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  foodGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    padding: '2rem'
  },
  foodItem1: {
    fontSize: '4rem',
    gridColumn: '1 / 3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '20px',
    padding: '1rem'
  },
  foodItem2: {
    fontSize: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '20px',
    padding: '1rem'
  },
  foodItem3: {
    fontSize: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '20px',
    padding: '1rem'
  },
  foodItem4: {
    fontSize: '3rem',
    gridColumn: '2 / 4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '20px',
    padding: '1rem'
  },
  foodItem5: {
    fontSize: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '15px',
    padding: '0.5rem'
  },
  ratingCard: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  ratingStars: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#333'
  },
  ratingText: {
    fontSize: '0.8rem',
    color: '#666'
  },
  deliveryCard: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    minWidth: '200px'
  },
  deliveryAvatar: {
    fontSize: '2rem',
    width: '40px',
    height: '40px',
    backgroundColor: '#f0f0f0',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deliveryTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#333'
  },
  deliveryTime: {
    fontSize: '0.8rem',
    color: '#666'
  },
  restaurantsSection: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: '2rem'
  },
  restaurantGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem'
  },
  restaurantCard: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  restaurantName: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 0.5rem 0'
  },
  restaurantCuisine: {
    fontSize: '1rem',
    color: '#ff6b35',
    margin: '0 0 1rem 0'
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  }
};

export default Home;