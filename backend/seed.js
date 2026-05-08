/**
 * Seed script — creates demo admin + user accounts
 * Run once: node seed.js
 */
require('dotenv').config();
const { connectDB } = require('./src/config/database');
const { User } = require('./src/models/index');

const seed = async () => {
  await connectDB();

  const users = [
    { name: 'Admin User', email: 'admin@taskflow.dev', password: 'Admin123', role: 'admin' },
    { name: 'Demo User',  email: 'user@taskflow.dev',  password: 'User1234', role: 'user'  },
  ];

  for (const u of users) {
    const exists = await User.findOne({ where: { email: u.email } });
    if (!exists) {
      await User.create(u);
      console.log(`✅ Created ${u.role}: ${u.email}`);
    } else {
      console.log(`⏭  Already exists: ${u.email}`);
    }
  }

  console.log('\n🎉 Seed complete!');
  console.log('   Admin → admin@taskflow.dev / Admin123');
  console.log('   User  → user@taskflow.dev  / User1234');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
