import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  return (
    <div style={styles.card}>
      <img 
        src={restaurant.image} 
        alt={restaurant.name}
        style={styles.image}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x200?text=Restaurant';
        }}
      />
      <div style={styles.content}>
        <h3 style={styles.name}>{restaurant.name}</h3>
        <p style={styles.cuisine}>{restaurant.cuisine}</p>
        <div style={styles.info}>
          <span style={styles.rating}>⭐ {restaurant.rating}</span>
          <span style={styles.deliveryTime}>🕒 {restaurant.deliveryTime}</span>
        </div>
        <p style={styles.address}>📍 {restaurant.address}</p>
        <Link to={`/restaurant/${restaurant._id}`} style={styles.button}>
          View Menu
        </Link>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'transform 0.3s',
    cursor: 'pointer'
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  content: {
    padding: '1rem'
  },
  name: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.25rem',
    fontWeight: 'bold'
  },
  cuisine: {
    margin: '0 0 0.5rem 0',
    color: '#666',
    fontSize: '0.9rem'
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0.5rem 0',
    fontSize: '0.9rem'
  },
  rating: {
    color: '#ff6b35'
  },
  deliveryTime: {
    color: '#666'
  },
  address: {
    margin: '0.5rem 0',
    fontSize: '0.8rem',
    color: '#666'
  },
  button: {
    display: 'inline-block',
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: '0.5rem 1rem',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
    marginTop: '0.5rem'
  }
};

export default RestaurantCard;