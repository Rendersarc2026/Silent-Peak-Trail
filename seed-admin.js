const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function seed() {
  const envFile = fs.readFileSync('.env', 'utf-8');
  let dbUrl = '';
  envFile.split('\n').forEach(line => {
    if (line.startsWith('DATABASE_URL=')) {
      dbUrl = line.replace('DATABASE_URL=', '').replace(/['"]/g, '').trim();
    }
  });

  if (!dbUrl) {
    throw new Error('DATABASE_URL not found in .env');
  }

  await mongoose.connect(dbUrl);
  
  const AdminSchema = new mongoose.Schema(
    {
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
    },
    { timestamps: true }
  );
  
  const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

  const username = "admin";
  const password = "ladakh2025";
  const hashedPassword = await bcrypt.hash(password, 10);

  await Admin.findOneAndUpdate(
    { username },
    { password: hashedPassword },
    { upsert: true, new: true }
  );

  console.log("Admin seeded successfully");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
