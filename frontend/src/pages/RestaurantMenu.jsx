import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MenuItemCard from '../components/MenuItemCard';
import { restaurantAPI, menuAPI } from '../utils/api';
import { useCart } from '../context/CartContext';

const RestaurantMenu = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { setRestaurant: setCartRestaurant, clearCart } = useCart();

  useEffect(() => {
    fetchRestaurantAndMenu();
  }, [id]);

  const fetchRestaurantAndMenu = async () => {
    try {
      const [restaurantResponse, menuResponse] = await Promise.all([
        restaurantAPI.getById(id),
        menuAPI.getByRestaurant(id)
      ]);
      
      setRestaurant(restaurantResponse.data);
      setMenuItems(menuResponse.data);
      setCartRestaurant(restaurantResponse.data);
      clearCart();
    } catch (error) {
    // Use mock data if API fails
const mockRestaurants = {
  '1': {
    _id: '1',
    name: "McDonald's",
    cuisine: 'Fast Food',
    rating: 4.3,
    deliveryTime: '20-30 min',
    address: 'MG Road, City Center',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400'
  },
  '2': {
    _id: '2',
    name: 'Subway',
    cuisine: 'Healthy & Fast Food',
    rating: 4.1,
    deliveryTime: '25-35 min',
    address: 'Mall Road, Downtown',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400'
  },
  '3': {
    _id: '3',
    name: 'Irani Cafe',
    cuisine: 'Cafe & Bakery',
    rating: 4.6,
    deliveryTime: '30-40 min',
    address: 'Heritage Street, Old City',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'
  },
  '4': {
    _id: '4',
    name: 'Sushi Zen',
    cuisine: 'Japanese',
    rating: 4.8,
    deliveryTime: '35-45 min',
    address: 'Japan Street, Downtown',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400'
  }
};

const mockMenus = {
  '1': [
    {
      _id: '1',
      name: 'McChicken Burger',
      description: 'Crispy chicken patty with lettuce and mayo',
      price: 149,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'
    },
    {
      _id: '2',
      name: 'French Fries',
      description: 'Golden crispy fries',
      price: 99,
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop'
    }
  ],
  '2': [
    {
      _id: '3',
      name: 'Veggie Delight Sub',
      description: 'Fresh veggies with multigrain bread',
      price: 179,
      image: 'https://images.unsplash.com/photo-1555072956-7758afb4d7eb?w=400&h=300&fit=crop'
    },
    {
      _id: '4',
      name: 'Chicken Teriyaki Sub',
      description: 'Grilled chicken with teriyaki sauce',
      price: 229,
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop'
    }
  ],
  '3': [
    {
      _id: '5',
      name: 'Irani Chai',
      description: 'Traditional strong Irani tea',
      price: 40,
      image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop'
    },
    {
      _id: '6',
      name: 'Bun Maska',
      description: 'Soft bun with fresh butter',
      price: 60,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'
    }
  ],
  '4': [
    {
      _id: '7',
      name: 'Edamame',
      description: 'Steamed young soybeans with sea salt',
      price: 80,
      image: null
    },
    {
      _id: '8',
      name: 'California Roll',
      description: 'Crab, avocado, and cucumber sushi roll',
      price: 250,
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop'
    }
  ]
};

      
      setRestaurant(mockRestaurants[id]);
      setMenuItems(mockMenus[id] || []);
      setCartRestaurant(mockRestaurants[id]);
      clearCart();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading menu...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (!restaurant) {
    return <div style={styles.error}>Restaurant not found</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          style={styles.image}
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/800x300/ff6b35/ffffff?text=${encodeURIComponent(restaurant.name)}`;
          }}
        />
        <div style={styles.info}>
          <h1 style={styles.name}>{restaurant.name}</h1>
          <p style={styles.cuisine}>{restaurant.cuisine}</p>
          <div style={styles.details}>
            <span style={styles.rating}>⭐ {restaurant.rating}</span>
            <span style={styles.deliveryTime}>🕒 {restaurant.deliveryTime}</span>
          </div>
          <p style={styles.address}>📍 {restaurant.address}</p>
        </div>
      </div>

      <div style={styles.menuSection}>
        <h2 style={styles.menuTitle}>Menu</h2>
        {menuItems.length === 0 ? (
          <div style={styles.empty}>
            <p>No menu items available.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {menuItems.map(item => (
              <MenuItemCard 
                key={item._id} 
                item={item} 
                onUpdate={fetchRestaurantAndMenu}
                onDelete={fetchRestaurantAndMenu}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  header: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    marginBottom: '2rem'
  },
  image: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    backgroundColor: '#f8f9fa'
  },
  info: {
    padding: '2rem'
  },
  name: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  },
  cuisine: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '1rem'
  },
  details: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '1rem'
  },
  rating: {
    color: '#ff6b35',
    fontWeight: 'bold'
  },
  deliveryTime: {
    color: '#666'
  },
  address: {
    color: '#666'
  },
  menuSection: {
    marginTop: '2rem'
  },
  menuTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem'
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

export default RestaurantMenu;