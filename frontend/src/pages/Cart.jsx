import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../utils/api';

const Cart = () => {
  const { items, restaurant, updateQuantity, removeItem, clearCart, getTotalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    if (!deliveryAddress.trim()) {
      setError('Please enter a delivery address');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter a phone number');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const orderData = {
      restaurant: restaurant._id,
      items: items.map(item => ({
        menuItem: item._id,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: getTotalAmount(),
      deliveryAddress: deliveryAddress.trim(),
      phone: phone.trim()
    };

    try {
      // Try to save to database first
      const response = await orderAPI.create(orderData);
      
      // Also store in localStorage as backup
      const newOrder = {
        _id: response.data._id || Date.now().toString(),
        user: {
          _id: user._id || '1',
          name: user.name || 'Customer',
          email: user.email || 'customer@email.com',
          phone: phone.trim(),
          address: deliveryAddress.trim()
        },
        restaurant: restaurant,
        items: items.map(item => ({
          menuItem: item,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getTotalAmount(),
        deliveryAddress: deliveryAddress.trim(),
        phone: phone.trim(),
        status: 'Pending',
        createdAt: new Date()
      };
      
      const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      existingOrders.push(newOrder);
      localStorage.setItem('userOrders', JSON.stringify(existingOrders));
      
      setSuccess('Order placed successfully and saved to database!');
    } catch (error) {
      console.log('Database save failed, using localStorage only');
      
      // Fallback to localStorage only
      const newOrder = {
        _id: Date.now().toString(),
        user: {
          _id: user._id || '1',
          name: user.name || 'Customer',
          email: user.email || 'customer@email.com',
          phone: phone.trim(),
          address: deliveryAddress.trim()
        },
        restaurant: restaurant,
        items: items.map(item => ({
          menuItem: item,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getTotalAmount(),
        deliveryAddress: deliveryAddress.trim(),
        phone: phone.trim(),
        status: 'Pending',
        createdAt: new Date()
      };
      
      const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      existingOrders.push(newOrder);
      localStorage.setItem('userOrders', JSON.stringify(existingOrders));
      
      setSuccess('Order placed successfully!');
    }

    setTimeout(() => {
      clearCart();
      navigate('/orders');
    }, 2000);
    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.empty}>
          <h2>Your cart is empty</h2>
          <p>Add some delicious items to your cart!</p>
          <button onClick={() => navigate('/restaurants')} style={styles.button}>
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Cart</h1>
      
      {restaurant && (
        <div style={styles.restaurantInfo}>
          <h3>Ordering from: {restaurant.name}</h3>
        </div>
      )}

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <div style={styles.items}>
        {items.map(item => (
          <div key={item._id} style={styles.item}>
            <img 
              src={item.image} 
              alt={item.name}
              style={styles.itemImage}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/80x80?text=Food';
              }}
            />
            <div style={styles.itemInfo}>
              <h4 style={styles.itemName}>{item.name}</h4>
              <p style={styles.itemPrice}>₹{item.price}</p>
            </div>
            <div style={styles.quantityControls}>
              <button 
                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                style={styles.quantityButton}
              >
                -
              </button>
              <span style={styles.quantity}>{item.quantity}</span>
              <button 
                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                style={styles.quantityButton}
              >
                +
              </button>
            </div>
            <div style={styles.itemTotal}>
              ₹{(item.price * item.quantity).toFixed(2)}
            </div>
            <button 
              onClick={() => handleRemoveItem(item._id)}
              style={styles.removeButton}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div style={styles.deliveryForm}>
        <h3>Delivery Information</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Delivery Address *</label>
          <textarea
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Enter your full delivery address"
            style={styles.textarea}
            rows={3}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Phone Number *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.summary}>
        <div style={styles.total}>
          <h3>Total: ₹{getTotalAmount().toFixed(2)}</h3>
        </div>
        <button 
          onClick={handlePlaceOrder}
          disabled={loading}
          style={styles.orderButton}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2rem'
  },
  restaurantInfo: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '2rem'
  },
  empty: {
    textAlign: 'center',
    padding: '4rem'
  },
  items: {
    marginBottom: '2rem'
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '1rem'
  },
  itemImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginRight: '1rem'
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem'
  },
  itemPrice: {
    margin: 0,
    color: '#666'
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginRight: '1rem'
  },
  quantityButton: {
    backgroundColor: '#ff6b35',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    width: '30px',
    height: '30px',
    cursor: 'pointer'
  },
  quantity: {
    fontWeight: 'bold',
    minWidth: '20px',
    textAlign: 'center'
  },
  itemTotal: {
    fontWeight: 'bold',
    marginRight: '1rem',
    minWidth: '60px'
  },
  removeButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  summary: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  total: {
    textAlign: 'center',
    marginBottom: '1rem'
  },
  orderButton: {
    width: '100%',
    backgroundColor: '#ff6b35',
    color: 'white',
    border: 'none',
    padding: '1rem',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  button: {
    backgroundColor: '#ff6b35',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    textAlign: 'center',
    border: '1px solid #c3e6cb'
  },
  deliveryForm: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  },
  formGroup: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    resize: 'vertical',
    boxSizing: 'border-box'
  }
};

export default Cart;