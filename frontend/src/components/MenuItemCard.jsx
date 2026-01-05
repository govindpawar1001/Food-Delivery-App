import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { menuAPI } from '../utils/api';
import getFoodImage from '../utils/getFoodImage';

const MenuItemCard = ({ item, onUpdate, onDelete }) => {
  const { addItem, removeItem, getItemQuantity } = useCart();
  const { user } = useAuth();
  const [showMessage, setShowMessage] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState({
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category || '',
    image: item.image
  });
  const quantity = getItemQuantity(item._id);

  const handleAddToCart = () => {
    addItem(item);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  const handleRemoveFromCart = () => {
    removeItem(item._id);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await menuAPI.update(item._id, editData);
      setShowEditForm(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating menu item:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await menuAPI.delete(item._id);
        if (onDelete) onDelete();
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  return (
    <motion.div 
      style={styles.card} 
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="card-animate"
    >
      <motion.div style={styles.imageContainer}>
        {item.image ? (
          <motion.img 
            src={item.image} 
            alt={item.name}
            style={styles.image}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            onError={(e) => {
              e.target.src = getFoodImage(item.name);
            }}
          />
        ) : (
          <motion.img 
            src={getFoodImage(item.name)} 
            alt={item.name}
            style={styles.image}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
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
              placeholder="Item name"
              required
              whileFocus={{ scale: 1.02, borderColor: '#ff6b35' }}
            />
            <motion.input
              type="text"
              value={editData.category}
              onChange={(e) => setEditData({...editData, category: e.target.value})}
              style={styles.input}
              placeholder="Category"
              whileFocus={{ scale: 1.02, borderColor: '#ff6b35' }}
            />
            <motion.textarea
              value={editData.description}
              onChange={(e) => setEditData({...editData, description: e.target.value})}
              style={styles.textarea}
              placeholder="Description"
              required
              whileFocus={{ scale: 1.02, borderColor: '#ff6b35' }}
            />
            <motion.input
              type="number"
              step="0.01"
              value={editData.price}
              onChange={(e) => setEditData({...editData, price: parseFloat(e.target.value)})}
              style={styles.input}
              placeholder="Price"
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
            <motion.div 
              style={styles.header}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h4 style={styles.name}>{item.name}</h4>
              {item.category && (
                <motion.span 
                  style={styles.category}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  {item.category}
                </motion.span>
              )}
            </motion.div>
            <motion.p 
              style={styles.description}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {item.description}
            </motion.p>
            
            {user?.isAdmin ? (
              <motion.div 
                style={styles.adminControls}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
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
            ) : (
              <motion.div 
                style={styles.footer}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.span 
                  style={styles.price}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  ₹{item.price}
                </motion.span>
                
                <AnimatePresence mode="wait">
                  {quantity === 0 ? (
                    <motion.button 
                      key="add-button"
                      onClick={handleAddToCart} 
                      style={styles.addButton}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)' 
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      + Add to Cart
                    </motion.button>
                  ) : (
                    <motion.div 
                      key="quantity-controls"
                      style={styles.quantityControls}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.button 
                        onClick={handleRemoveFromCart} 
                        style={styles.quantityBtn}
                        whileHover={{ scale: 1.1, backgroundColor: '#e55a4f' }}
                        whileTap={{ scale: 0.9 }}
                      >
                        -
                      </motion.button>
                      <motion.span 
                        style={styles.quantity}
                        key={quantity}
                        initial={{ scale: 1.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {quantity}
                      </motion.span>
                      <motion.button 
                        onClick={handleAddToCart} 
                        style={styles.quantityBtn}
                        whileHover={{ scale: 1.1, backgroundColor: '#e55a4f' }}
                        whileTap={{ scale: 0.9 }}
                      >
                        +
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
        <AnimatePresence>
          {showMessage && (
            <motion.div 
              style={styles.message}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              Item added to cart!
            </motion.div>
          )}
        </AnimatePresence>
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
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255,255,255,0.2)'
  },
  imageContainer: {
    width: '100%',
    height: '150px',
    position: 'relative',
    backgroundColor: '#f8f9fa'
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover'
  },
  placeholder: {
    width: '100%',
    height: '150px',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px dashed #ff6b35'
  },
  placeholderContent: {
    textAlign: 'center'
  },
  placeholderIcon: {
    fontSize: '2rem',
    marginBottom: '0.5rem'
  },
  placeholderText: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#ff6b35'
  },
  content: {
    padding: '1rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem'
  },
  name: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 'bold',
    flex: 1
  },
  category: {
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: '600'
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
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#ff6b35'
  },
  addButton: {
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    padding: '0.25rem'
  },
  quantityBtn: {
    background: 'linear-gradient(135deg, #4834d4 0%, #686de0 100%)',
    color: 'white',
    border: 'none',
    width: '30px',
    height: '30px',
    borderRadius: '15px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(72, 52, 212, 0.3)'
  },
  quantity: {
    fontSize: '1rem',
    fontWeight: 'bold',
    minWidth: '20px',
    textAlign: 'center'
  },
  adminControls: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem'
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
  textarea: {
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.9rem',
    minHeight: '60px',
    resize: 'vertical'
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