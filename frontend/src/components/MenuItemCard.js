import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const MenuItemCard = ({ item }) => {
  const { addItem } = useCart();
  const [showMessage, setShowMessage] = useState(false);

  const handleAddToCart = () => {
    addItem(item);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  return (
    <div style={styles.card}>
      <img 
        src={item.image} 
        alt={item.name}
        style={styles.image}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/200x150?text=Food';
        }}
      />
      <div style={styles.content}>
        <h4 style={styles.name}>{item.name}</h4>
        <p style={styles.description}>{item.description}</p>
        <div style={styles.footer}>
          <span style={styles.price}>${item.price}</span>
          <button onClick={handleAddToCart} style={styles.button}>
            Add to Cart
          </button>
        </div>
        {showMessage && (
          <div style={styles.message}>Item added to cart!</div>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover'
  },
  content: {
    padding: '1rem'
  },
  name: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem',
    fontWeight: 'bold'
  },
  description: {
    margin: '0 0 1rem 0',
    fontSize: '0.9rem',
    color: '#666',
    lineHeight: '1.4'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  price: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#ff6b35'
  },
  button: {
    backgroundColor: '#ff6b35',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  message: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    textAlign: 'center',
    marginTop: '0.5rem',
    border: '1px solid #c3e6cb'
  }
};

export default MenuItemCard;