import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { restaurantAPI } from '../utils/api';

const RestaurantCard = ({ restaurant, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState({
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    address: restaurant.address,
    phone: restaurant.phone || '',
    deliveryTime: restaurant.deliveryTime,
    image: restaurant.image
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await restaurantAPI.update(restaurant._id, editData);
      setShowEditForm(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating restaurant:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await restaurantAPI.delete(restaurant._id);
        if (onDelete) onDelete();
      } catch (error) {
        console.error('Error deleting restaurant:', error);
      }
    }
  };
  return (
    <motion.div 
      style={styles.card}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        y: -10, 
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="card-animate"
    >
      <motion.img 
        src={restaurant.image} 
        alt={restaurant.name}
        style={styles.image}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x200?text=Restaurant';
        }}
      />
      <div style={styles.content}>
        {showEditForm ? (
          <motion.form 
            onSubmit={handleUpdate} 
            style={styles.editForm}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({...editData, name: e.target.value})}
              style={styles.input}
              placeholder="Restaurant name"
              required
              whileFocus={{ scale: 1.02, borderColor: '#ff6b35' }}
            />
            <motion.input
              type="text"
              value={editData.cuisine}
              onChange={(e) => setEditData({...editData, cuisine: e.target.value})}
              style={styles.input}
              placeholder="Cuisine type"
              required
              whileFocus={{ scale: 1.02, borderColor: '#ff6b35' }}
            />
            <motion.input
              type="text"
              value={editData.address}
              onChange={(e) => setEditData({...editData, address: e.target.value})}
              style={styles.input}
              placeholder="Address"
              required
              whileFocus={{ scale: 1.02, borderColor: '#ff6b35' }}
            />
            <motion.input
              type="text"
              value={editData.phone}
              onChange={(e) => setEditData({...editData, phone: e.target.value})}
              style={styles.input}
              placeholder="Phone number"
              whileFocus={{ scale: 1.02, borderColor: '#ff6b35' }}
            />
            <motion.input
              type="text"
              value={editData.deliveryTime}
              onChange={(e) => setEditData({...editData, deliveryTime: e.target.value})}
              style={styles.input}
              placeholder="Delivery time"
              required
              whileFocus={{ scale: 1.02, borderColor: '#ff6b35' }}
            />
            <motion.input
              type="url"
              value={editData.image}
              onChange={(e) => setEditData({...editData, image: e.target.value})}
              style={styles.input}
              placeholder="Image URL"
              whileFocus={{ scale: 1.02, borderColor: '#ff6b35' }}
            />
            <div style={styles.formButtons}>
              <motion.button 
                type="submit" 
                style={styles.saveBtn}
                whileHover={{ scale: 1.05, backgroundColor: '#218838' }}
                whileTap={{ scale: 0.95 }}
              >
                Save
              </motion.button>
              <motion.button 
                type="button" 
                onClick={() => setShowEditForm(false)} 
                style={styles.cancelBtn}
                whileHover={{ scale: 1.05, backgroundColor: '#5a6268' }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.form>
        ) : (
          <>
            <motion.h3 
              style={styles.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {restaurant.name}
            </motion.h3>
            <motion.p 
              style={styles.cuisine}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {restaurant.cuisine}
            </motion.p>
            <motion.div 
              style={styles.info}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span style={styles.rating}>⭐ {restaurant.rating}</span>
              <span style={styles.deliveryTime}>🕒 {restaurant.deliveryTime}</span>
            </motion.div>
            <motion.p 
              style={styles.address}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              📍 {restaurant.address}
            </motion.p>
            
            <motion.div 
              style={styles.buttonContainer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={`/restaurant/${restaurant._id}`} style={styles.button}>
                  View Menu
                </Link>
              </motion.div>
              
              {user?.isAdmin && (
                <motion.div 
                  style={styles.adminButtons}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.button 
                    onClick={() => setShowEditForm(true)} 
                    style={styles.editBtn}
                    whileHover={{ scale: 1.05, backgroundColor: '#138496' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ✏️ Edit
                  </motion.button>
                  <motion.button 
                    onClick={handleDelete} 
                    style={styles.deleteBtn}
                    whileHover={{ scale: 1.05, backgroundColor: '#c82333' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🗑️ Delete
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

const styles = {
  card: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,255,0.9) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.2)'
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
  buttonContainer: {
    marginTop: '1rem'
  },
  button: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    color: 'white',
    padding: '0.5rem 1rem',
    textDecoration: 'none',
    borderRadius: '25px',
    fontSize: '0.9rem',
    width: '100%',
    textAlign: 'center',
    marginBottom: '0.5rem',
    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
  },
  adminButtons: {
    display: 'flex',
    gap: '0.5rem'
  },
  editBtn: {
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    flex: 1
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    flex: 1
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  input: {
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.9rem'
  },
  formButtons: {
    display: 'flex',
    gap: '0.5rem'
  },
  saveBtn: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    flex: 1
  },
  cancelBtn: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    flex: 1
  }
};

export default RestaurantCard;