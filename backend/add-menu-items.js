require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

const menuItems = {
  "Pizza Palace": [
    { name: "Margherita Pizza", description: "Fresh tomatoes, mozzarella, basil", price: 14.99, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop", category: "Pizza" },
    { name: "Pepperoni Pizza", description: "Classic pepperoni with cheese", price: 16.99, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop", category: "Pizza" },
    { name: "Meat Lovers Pizza", description: "Pepperoni, sausage, ham, bacon", price: 19.99, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop", category: "Pizza" },
    { name: "Veggie Supreme", description: "Bell peppers, onions, mushrooms, olives", price: 17.99, image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop", category: "Pizza" },
    { name: "Caesar Salad", description: "Romaine lettuce, parmesan, croutons", price: 8.99, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop", category: "Salad" },
    { name: "Garlic Bread", description: "Toasted bread with garlic butter", price: 5.99, image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=300&fit=crop", category: "Appetizer" },
    { name: "Chicken Wings", description: "Spicy buffalo wings with ranch", price: 11.99, image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop", category: "Appetizer" },
    { name: "Lasagna", description: "Layers of pasta, meat, cheese", price: 15.99, image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop", category: "Pasta" },
    { name: "Tiramisu", description: "Classic Italian dessert", price: 6.99, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop", category: "Dessert" },
    { name: "Soda", description: "Coca-Cola, Pepsi, Sprite", price: 2.99, image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop", category: "Beverage" }
  ],
  "Burger Barn": [
    { name: "Classic Burger", description: "Beef patty, lettuce, tomato, onion", price: 12.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop", category: "Burger" },
    { name: "Cheeseburger", description: "Classic burger with cheese", price: 13.99, image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop", category: "Burger" },
    { name: "Bacon Burger", description: "Burger with crispy bacon", price: 15.99, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=300&fit=crop", category: "Burger" },
    { name: "Veggie Burger", description: "Plant-based patty with veggies", price: 11.99, image: "https://images.unsplash.com/photo-1525059696034-4967a729002e?w=400&h=300&fit=crop", category: "Burger" },
    { name: "French Fries", description: "Crispy golden fries", price: 4.99, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop", category: "Side" },
    { name: "Onion Rings", description: "Battered and fried onion rings", price: 5.99, image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop", category: "Side" },
    { name: "Chicken Nuggets", description: "Crispy chicken pieces", price: 8.99, image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop", category: "Chicken" },
    { name: "Milkshake", description: "Vanilla, chocolate, or strawberry", price: 4.99, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop", category: "Beverage" },
    { name: "Apple Pie", description: "Warm apple pie slice", price: 3.99, image: "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=400&h=300&fit=crop", category: "Dessert" },
    { name: "Iced Tea", description: "Fresh brewed iced tea", price: 2.99, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop", category: "Beverage" }
  ],
  "Sushi Zen": [
    { name: "California Roll", description: "Crab, avocado, cucumber", price: 8.99, image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400", category: "Roll" },
    { name: "Salmon Nigiri", description: "Fresh salmon over rice", price: 6.99, image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400", category: "Nigiri" },
    { name: "Tuna Sashimi", description: "Fresh tuna slices", price: 12.99, image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400", category: "Sashimi" },
    { name: "Dragon Roll", description: "Eel, cucumber, avocado on top", price: 14.99, image: "https://images.unsplash.com/photo-1563612116625-3012372fccce?w=400", category: "Roll" },
    { name: "Miso Soup", description: "Traditional soybean soup", price: 3.99, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400", category: "Soup" },
    { name: "Edamame", description: "Steamed soybeans with salt", price: 4.99, image: "https://images.unsplash.com/photo-1609501676725-7186f734b2b0?w=400", category: "Appetizer" },
    { name: "Tempura Shrimp", description: "Battered and fried shrimp", price: 9.99, image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400", category: "Tempura" },
    { name: "Chicken Teriyaki", description: "Grilled chicken with teriyaki sauce", price: 13.99, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400", category: "Entree" },
    { name: "Green Tea Ice Cream", description: "Traditional Japanese dessert", price: 4.99, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400", category: "Dessert" },
    { name: "Sake", description: "Japanese rice wine", price: 7.99, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400", category: "Beverage" }
  ],
  "Taco Fiesta": [
    { name: "Beef Tacos", description: "Seasoned ground beef, lettuce, cheese", price: 9.99, image: "https://images.unsplash.com/photo-1565299585323-38174c4a6c7b?w=400", category: "Taco" },
    { name: "Chicken Quesadilla", description: "Grilled chicken and cheese", price: 8.99, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400", category: "Quesadilla" },
    { name: "Beef Burrito", description: "Large flour tortilla with beef and beans", price: 11.99, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400", category: "Burrito" },
    { name: "Nachos Supreme", description: "Chips with cheese, meat, jalapeños", price: 10.99, image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400", category: "Appetizer" },
    { name: "Fish Tacos", description: "Grilled fish with cabbage slaw", price: 12.99, image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400", category: "Taco" },
    { name: "Guacamole & Chips", description: "Fresh avocado dip with tortilla chips", price: 6.99, image: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400", category: "Appetizer" },
    { name: "Chicken Enchiladas", description: "Rolled tortillas with chicken and sauce", price: 13.99, image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400", category: "Entree" },
    { name: "Mexican Rice", description: "Seasoned rice with vegetables", price: 3.99, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400", category: "Side" },
    { name: "Churros", description: "Fried dough with cinnamon sugar", price: 5.99, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400", category: "Dessert" },
    { name: "Horchata", description: "Sweet rice milk drink", price: 3.99, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400", category: "Beverage" }
  ],
  "Dragon Garden": [
    { name: "Sweet & Sour Pork", description: "Battered pork with sweet sauce", price: 14.99, image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400", category: "Pork" },
    { name: "Kung Pao Chicken", description: "Spicy chicken with peanuts", price: 13.99, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400", category: "Chicken" },
    { name: "Beef & Broccoli", description: "Tender beef with fresh broccoli", price: 15.99, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400", category: "Beef" },
    { name: "Fried Rice", description: "Wok-fried rice with vegetables", price: 8.99, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400", category: "Rice" },
    { name: "Spring Rolls", description: "Crispy vegetable rolls", price: 6.99, image: "https://images.unsplash.com/photo-1544982503-9f984c14501a?w=400", category: "Appetizer" },
    { name: "Hot & Sour Soup", description: "Spicy and tangy soup", price: 5.99, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400", category: "Soup" },
    { name: "Orange Chicken", description: "Crispy chicken in orange sauce", price: 14.99, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400", category: "Chicken" },
    { name: "Lo Mein Noodles", description: "Soft noodles with vegetables", price: 10.99, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400", category: "Noodles" },
    { name: "Fortune Cookies", description: "Traditional Chinese cookies", price: 2.99, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400", category: "Dessert" },
    { name: "Jasmine Tea", description: "Fragrant Chinese tea", price: 2.99, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400", category: "Beverage" }
  ],
  "Curry House": [
    { name: "Chicken Tikka Masala", description: "Creamy tomato curry with chicken", price: 16.99, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400", category: "Curry" },
    { name: "Lamb Biryani", description: "Fragrant rice with spiced lamb", price: 18.99, image: "https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400", category: "Rice" },
    { name: "Butter Chicken", description: "Rich and creamy chicken curry", price: 15.99, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400", category: "Curry" },
    { name: "Naan Bread", description: "Traditional Indian flatbread", price: 3.99, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400", category: "Bread" },
    { name: "Samosas", description: "Crispy pastries with spiced filling", price: 6.99, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400", category: "Appetizer" },
    { name: "Dal Lentils", description: "Spiced lentil curry", price: 9.99, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400", category: "Vegetarian" },
    { name: "Tandoori Chicken", description: "Clay oven roasted chicken", price: 17.99, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400", category: "Chicken" },
    { name: "Basmati Rice", description: "Fragrant long-grain rice", price: 4.99, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400", category: "Rice" },
    { name: "Gulab Jamun", description: "Sweet milk dumplings in syrup", price: 5.99, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400", category: "Dessert" },
    { name: "Mango Lassi", description: "Sweet yogurt drink with mango", price: 4.99, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400", category: "Beverage" }
  ],
  "Mediterranean Delight": [
    { name: "Chicken Shawarma", description: "Marinated chicken with tahini", price: 13.99, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400", category: "Entree" },
    { name: "Falafel Plate", description: "Crispy chickpea balls with hummus", price: 11.99, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400", category: "Vegetarian" },
    { name: "Greek Salad", description: "Tomatoes, olives, feta cheese", price: 9.99, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400", category: "Salad" },
    { name: "Hummus & Pita", description: "Creamy chickpea dip with bread", price: 7.99, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400", category: "Appetizer" },
    { name: "Lamb Gyros", description: "Seasoned lamb in pita bread", price: 15.99, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400", category: "Entree" },
    { name: "Tabbouleh", description: "Parsley salad with bulgur", price: 8.99, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400", category: "Salad" },
    { name: "Stuffed Grape Leaves", description: "Rice-filled grape leaves", price: 9.99, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400", category: "Appetizer" },
    { name: "Moussaka", description: "Layered eggplant casserole", price: 16.99, image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400", category: "Entree" },
    { name: "Baklava", description: "Sweet pastry with nuts and honey", price: 5.99, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400", category: "Dessert" },
    { name: "Turkish Coffee", description: "Strong traditional coffee", price: 3.99, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400", category: "Beverage" }
  ],
  "BBQ Smokehouse": [
    { name: "Pulled Pork Sandwich", description: "Slow-smoked pork with BBQ sauce", price: 12.99, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400", category: "Sandwich" },
    { name: "Beef Brisket", description: "Tender smoked brisket", price: 18.99, image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400", category: "Beef" },
    { name: "BBQ Ribs", description: "Fall-off-the-bone pork ribs", price: 22.99, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400", category: "Pork" },
    { name: "Smoked Chicken", description: "Half chicken with dry rub", price: 15.99, image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400", category: "Chicken" },
    { name: "Mac & Cheese", description: "Creamy baked macaroni", price: 6.99, image: "https://images.unsplash.com/photo-1543826173-1ad64b6ac3c9?w=400", category: "Side" },
    { name: "Coleslaw", description: "Creamy cabbage salad", price: 4.99, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400", category: "Side" },
    { name: "Cornbread", description: "Sweet southern cornbread", price: 3.99, image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400", category: "Side" },
    { name: "Baked Beans", description: "Sweet and smoky beans", price: 5.99, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400", category: "Side" },
    { name: "Peach Cobbler", description: "Warm peach dessert", price: 6.99, image: "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=400", category: "Dessert" },
    { name: "Sweet Tea", description: "Southern-style iced tea", price: 2.99, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400", category: "Beverage" }
  ],
  "Fresh Salad Co": [
    { name: "Caesar Salad", description: "Romaine, parmesan, croutons", price: 9.99, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400", category: "Salad" },
    { name: "Greek Salad", description: "Mixed greens, feta, olives", price: 10.99, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", category: "Salad" },
    { name: "Quinoa Bowl", description: "Quinoa with roasted vegetables", price: 11.99, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", category: "Bowl" },
    { name: "Chicken Salad", description: "Grilled chicken over mixed greens", price: 12.99, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400", category: "Salad" },
    { name: "Avocado Toast", description: "Multigrain bread with avocado", price: 8.99, image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400", category: "Toast" },
    { name: "Smoothie Bowl", description: "Acai bowl with fresh fruits", price: 9.99, image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400", category: "Bowl" },
    { name: "Veggie Wrap", description: "Fresh vegetables in whole wheat wrap", price: 8.99, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400", category: "Wrap" },
    { name: "Kale Salad", description: "Massaged kale with lemon dressing", price: 10.99, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", category: "Salad" },
    { name: "Chia Pudding", description: "Healthy chia seed pudding", price: 6.99, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400", category: "Dessert" },
    { name: "Green Juice", description: "Fresh pressed vegetable juice", price: 5.99, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400", category: "Beverage" }
  ],
  "Pasta Corner": [
    { name: "Spaghetti Carbonara", description: "Creamy pasta with bacon and eggs", price: 14.99, image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400", category: "Pasta" },
    { name: "Fettuccine Alfredo", description: "Rich cream sauce with parmesan", price: 13.99, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400", category: "Pasta" },
    { name: "Penne Arrabbiata", description: "Spicy tomato sauce with garlic", price: 12.99, image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400", category: "Pasta" },
    { name: "Chicken Parmigiana", description: "Breaded chicken with marinara", price: 16.99, image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400", category: "Entree" },
    { name: "Caprese Salad", description: "Tomatoes, mozzarella, basil", price: 9.99, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400", category: "Salad" },
    { name: "Minestrone Soup", description: "Italian vegetable soup", price: 6.99, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400", category: "Soup" },
    { name: "Ravioli", description: "Cheese-filled pasta with marinara", price: 15.99, image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400", category: "Pasta" },
    { name: "Bruschetta", description: "Toasted bread with tomato topping", price: 7.99, image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400", category: "Appetizer" },
    { name: "Gelato", description: "Italian ice cream", price: 5.99, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400", category: "Dessert" },
    { name: "Italian Soda", description: "Sparkling flavored water", price: 3.99, image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400", category: "Beverage" }
  ]
};

async function addMenuItems() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');
    
    // Get all restaurants
    const restaurants = await Restaurant.find({});
    
    for (const restaurant of restaurants) {
      const items = menuItems[restaurant.name];
      if (items) {
        const menuItemsWithRestaurant = items.map(item => ({
          ...item,
          restaurant: restaurant._id
        }));
        
        await MenuItem.insertMany(menuItemsWithRestaurant);
        console.log(`Added ${items.length} menu items for ${restaurant.name}`);
      }
    }
    
    console.log('All menu items added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addMenuItems();