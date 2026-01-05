import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
          <motion.div 
            style={styles.leftSection}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              style={styles.badge}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <span style={styles.badgeIcon}>📍</span>
              Now delivering in 50+ cities
            </motion.div>
            
            <motion.h1 
              style={styles.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Discover food you love. <span style={styles.titleHighlight}>Delivered fast.</span>
            </motion.h1>
            
            <motion.p 
              style={styles.subtitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              From local favorites to global cuisines — discover restaurants, order with ease, and enjoy lightning-fast delivery powered by smart logistics.
            </motion.p>
            
            <motion.div 
              style={styles.buttonGroup}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {isAuthenticated ? (
                  <Link to="/restaurants" style={styles.orderButton}>
                    Order Food →
                  </Link>
                ) : (
                  <Link to="/login" style={styles.orderButton}>
                    Order Food →
                  </Link>
                )}
              </motion.div>
            </motion.div>
            
            <motion.div 
              style={styles.stats}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              50K+ Happy Customers
            </motion.div>
          </motion.div>
          
          <motion.div 
            style={styles.rightSection}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              style={styles.foodImageContainer}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div style={styles.foodGrid}>
                <motion.div 
                  style={styles.foodItem1}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  🍔
                </motion.div>
                <motion.div 
                  style={styles.foodItem2}
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.7, duration: 0.6, type: "spring" }}
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  🍕
                </motion.div>
                <motion.div 
                  style={styles.foodItem3}
                  initial={{ scale: 0, y: -50 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.6, type: "spring" }}
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  🥗
                </motion.div>
                <motion.div 
                  style={styles.foodItem4}
                  initial={{ scale: 0, x: -50 }}
                  animate={{ scale: 1, x: 0 }}
                  transition={{ delay: 1.1, duration: 0.6, type: "spring" }}
                  whileHover={{ scale: 1.1, x: 5 }}
                >
                  🍜
                </motion.div>
                <motion.div 
                  style={styles.foodItem5}
                  initial={{ scale: 0, rotate: 360 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.3, duration: 0.6, type: "spring" }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  🧁
                </motion.div>
              </div>
              
              <motion.div 
                style={styles.ratingCard}
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div style={styles.ratingStars}>⭐ 4.9</div>
                <div style={styles.ratingText}>(2.5K reviews)</div>
              </motion.div>
              
              <motion.div 
                style={styles.deliveryCard}
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 1.7, duration: 0.5 }}
                whileHover={{ scale: 1.05, x: 5 }}
              >
                <motion.div 
                  style={styles.deliveryAvatar}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  👨🍳
                </motion.div>
                <div>
                  <div style={styles.deliveryTitle}>Order on the way!</div>
                  <div style={styles.deliveryTime}>Arriving in 12 min</div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {restaurants.length > 0 && (
        <motion.div 
          style={styles.restaurantsSection}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.h2 
            style={styles.sectionTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Featured Restaurants
          </motion.h2>
          <div style={styles.restaurantGrid}>
            {restaurants.map((restaurant, index) => (
              <motion.div 
                key={restaurant._id} 
                style={styles.restaurantCard}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 0.9 + (index * 0.1), 
                  duration: 0.5,
                  type: "spring"
                }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                }}
                className="stagger-item"
              >
                <motion.h3 
                  style={styles.restaurantName}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + (index * 0.1) }}
                >
                  {restaurant.name}
                </motion.h3>
                <motion.p 
                  style={styles.restaurantCuisine}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 + (index * 0.1) }}
                >
                  {restaurant.cuisine}
                </motion.p>
                {user?.isAdmin && (
                  <motion.button 
                    onClick={() => handleDelete(restaurant._id)}
                    style={styles.deleteBtn}
                    whileHover={{ scale: 1.05, backgroundColor: '#c82333' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '90vh',
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
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
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,107,107,0.1) 100%)',
    backdropFilter: 'blur(20px)',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    color: '#ff6b6b',
    fontWeight: '500',
    width: 'fit-content',
    boxShadow: '0 4px 20px rgba(255, 107, 107, 0.2)',
    border: '1px solid rgba(255, 107, 107, 0.2)'
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
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
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
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    color: 'white',
    padding: '1rem 2rem',
    textDecoration: 'none',
    borderRadius: '25px',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)',
    display: 'inline-block'
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
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
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
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,107,107,0.05) 100%)',
    backdropFilter: 'blur(20px)',
    padding: '0.75rem 1rem',
    borderRadius: '15px',
    boxShadow: '0 8px 32px rgba(255, 107, 107, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    border: '1px solid rgba(255, 107, 107, 0.2)'
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
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,107,107,0.05) 100%)',
    backdropFilter: 'blur(20px)',
    padding: '1rem',
    borderRadius: '15px',
    boxShadow: '0 8px 32px rgba(255, 107, 107, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    minWidth: '200px',
    border: '1px solid rgba(255, 107, 107, 0.2)'
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
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,107,107,0.05) 100%)',
    backdropFilter: 'blur(20px)',
    padding: '1.5rem',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(255, 107, 107, 0.15)',
    textAlign: 'center',
    border: '1px solid rgba(255, 107, 107, 0.2)'
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