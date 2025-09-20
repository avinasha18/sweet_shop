import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Sweet from '../models/Sweet.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Sweet.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@sweetshop.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('👤 Created admin user');

    // Create regular user
    const regularUser = new User({
      name: 'John Doe',
      email: 'john@sweetshop.com',
      password: 'user123',
      role: 'user'
    });
    await regularUser.save();
    console.log('👤 Created regular user');

    // Create sample sweets
    const sweets = [
      {
        name: 'Chocolate Chip Cookies',
        category: 'Cookies',
        price: 8.99,
        quantity: 25,
        description: 'Freshly baked chocolate chip cookies with premium chocolate chips and a soft, chewy texture.',
        imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'
      },
      {
        name: 'Red Velvet Cake',
        category: 'Cakes',
        price: 32.99,
        quantity: 8,
        description: 'Classic red velvet cake with cream cheese frosting, perfect for special occasions.',
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'
      },
      {
        name: 'Gummy Bears',
        category: 'Candy',
        price: 4.99,
        quantity: 50,
        description: 'Assorted fruit-flavored gummy bears in various colors and flavors.',
        imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400'
      },
      {
        name: 'Vanilla Ice Cream',
        category: 'Ice Cream',
        price: 12.99,
        quantity: 15,
        description: 'Creamy vanilla ice cream made with real vanilla beans and fresh cream.',
        imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400'
      },
      {
        name: 'Chocolate Truffles',
        category: 'Chocolates',
        price: 18.99,
        quantity: 20,
        description: 'Rich dark chocolate truffles with a smooth ganache center, dusted with cocoa powder.',
        imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400'
      },
      {
        name: 'Strawberry Tart',
        category: 'Pastries',
        price: 15.99,
        quantity: 12,
        description: 'Delicate pastry shell filled with vanilla custard and topped with fresh strawberries.',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'
      },
      {
        name: 'Caramel Popcorn',
        category: 'Other',
        price: 6.99,
        quantity: 30,
        description: 'Sweet and salty caramel popcorn with a perfect crunch and rich caramel coating.',
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
      },
      {
        name: 'Lemon Cupcakes',
        category: 'Cakes',
        price: 14.99,
        quantity: 18,
        description: 'Light and fluffy lemon cupcakes with zesty lemon frosting and a hint of vanilla.',
        imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400'
      },
      {
        name: 'Mint Chocolate Chip Ice Cream',
        category: 'Ice Cream',
        price: 13.99,
        quantity: 10,
        description: 'Refreshing mint ice cream loaded with chocolate chips for the perfect summer treat.',
        imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400'
      },
      {
        name: 'Sugar Cookies',
        category: 'Cookies',
        price: 7.99,
        quantity: 35,
        description: 'Classic sugar cookies with a soft texture and sweet vanilla flavor, perfect for decorating.',
        imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'
      }
    ];

    for (const sweetData of sweets) {
      const sweet = new Sweet(sweetData);
      await sweet.save();
    }

    console.log(`🍭 Created ${sweets.length} sweets`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Sample accounts:');
    console.log('Admin: admin@sweetshop.com / admin123');
    console.log('User: john@sweetshop.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
