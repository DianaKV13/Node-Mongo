const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user.model');
const Card = require('../models/card.model');
const bcrypt = require('bcryptjs');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Clear old data
    await User.deleteMany();
    await Card.deleteMany();

    // Create users
    const password = await bcrypt.hash('123456', 10);

    const regularUser = await User.create({
      name: { first: 'Regular', last: 'User' },
      email: 'regular@example.com',
      password,
      isBusiness: false,
      isAdmin: false,
    });

    const businessUser = await User.create({
      name: { first: 'Business', last: 'User' },
      email: 'business@example.com',
      password,
      isBusiness: true,
      isAdmin: false,
    });

    const adminUser = await User.create({
      name: { first: 'Admin', last: 'User' },
      email: 'admin@example.com',
      password,
      isBusiness: false,
      isAdmin: true,
    });

    // Create cards (with bizNumber)
    const card1 = await Card.create({
      title: 'Coffee Shop',
      subtitle: 'Best coffee in town',
      description: 'Come and taste our freshly brewed coffee.',
      phone: '052-1234567',
      email: 'coffee@shop.com',
      web: 'http://coffeeshop.com',
      image: { url: 'https://picsum.photos/200', alt: 'Coffee shop' },
      address: {
        country: 'Israel',
        city: 'Tel Aviv',
        street: 'Main',
        houseNumber: 1,
        zip: '12345',
      },
      user_id: businessUser._id,
      bizNumber: 100001,
    });

    const card2 = await Card.create({
      title: 'Book Store',
      subtitle: 'All genres available',
      description: 'A wide variety of books for all ages.',
      phone: '053-7654321',
      email: 'info@bookstore.com',
      web: 'http://bookstore.com',
      image: { url: 'https://picsum.photos/201', alt: 'Book store' },
      address: {
        country: 'Israel',
        city: 'Jerusalem',
        street: 'King George',
        houseNumber: 10,
        zip: '67890',
      },
      user_id: businessUser._id,
      bizNumber: 100002,
    });

    const card3 = await Card.create({
      title: 'Tech Repair',
      subtitle: 'We fix everything',
      description: 'Professional repair service for electronics.',
      phone: '054-9876543',
      email: 'support@techrepair.com',
      web: 'http://techrepair.com',
      image: { url: 'https://picsum.photos/202', alt: 'Tech repair shop' },
      address: {
        country: 'Israel',
        city: 'Haifa',
        street: 'Herzl',
        houseNumber: 5,
        zip: '24680',
      },
      user_id: businessUser._id,
      bizNumber: 100003,
    });

    console.log('Seed completed:', { regularUser, businessUser, adminUser, card1, card2, card3 });
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
