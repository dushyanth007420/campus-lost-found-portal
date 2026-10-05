const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Item = require('./models/Item');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lostfound');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});

    const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN || 'college.edu';

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      name: 'System Admin',
      email: `admin@${allowedDomain}`,
      password: adminPassword,
      phone: '1234567890',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin user created');

    // Create Standard User
    const userPassword = await bcrypt.hash('user123', 10);
    const standardUser = new User({
      name: 'John Doe',
      email: `johndoe@${allowedDomain}`,
      password: userPassword,
      phone: '0987654321',
      role: 'user'
    });
    await standardUser.save();
    console.log('Standard user created');

    // Create Sample Items
    const items = [
      {
        title: 'Lost Blue Backpack',
        description: 'Left a blue JanSport backpack in Library Room 3.',
        category: 'Bag',
        type: 'lost',
        location: 'Library',
        date: new Date(),
        postedBy: standardUser._id,
        status: 'open'
      },
      {
        title: 'Found iPhone 13',
        description: 'Found a black iPhone 13 with a clear case near the cafeteria.',
        category: 'Phone',
        type: 'found',
        location: 'Cafeteria',
        date: new Date(),
        postedBy: adminUser._id,
        status: 'open'
      }
    ];

    await Item.insertMany(items);
    console.log('Sample items created');

    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
