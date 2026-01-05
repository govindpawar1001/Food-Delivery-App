import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RestaurantCard from '../components/RestaurantCard';
import { restaurantAPI } from '../utils/api';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll();
      setRestaurants(response.data);
    } catch (error) {
      // Use mock data if API fails
      setRestaurants([
        {
          _id: '1',
          name: 'Pizza Palace',
          cuisine: 'Italian',
          rating: 4.5,
          deliveryTime: '30-45 min',
          address: '123 Pizza St, Food City',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
        },
        {
          _id: '2',
          name: 'Burger Barn',
          cuisine: 'American',
          rating: 4.2,
          deliveryTime: '25-35 min',
          address: '456 Burger Ave, Food City',
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
        },
        {
          _id: '3',
          name: 'Sushi Spot',
          cuisine: 'Japanese',
          rating: 4.8,
          deliveryTime: '40-50 min',
          address: '789 Sushi Blvd, Food City',
          image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div className="spinner"></div>
        <p>Loading restaurants...</p>
      </div>
    );
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <motion.div 
      style={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1 
        style={styles.title}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Restaurants
      </motion.h1>
      
      {restaurants.length === 0 ? (
        <motion.div 
          style={styles.empty}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p>No restaurants available at the moment.</p>
        </motion.div>
      ) : (
        <motion.div 
          style={styles.grid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {restaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant._id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: 0.4 + (index * 0.1), 
                duration: 0.5,
                type: "spring",
                stiffness: 100
              }}
              className="stagger-item"
            >
              <RestaurantCard 
                restaurant={restaurant}
                onUpdate={fetchRestaurants}
                onDelete={fetchRestaurants}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
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
    marginBottom: '2rem',
    textAlign: 'center'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem'
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

export default Restaurants;