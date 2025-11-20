// Script untuk membuat admin user
// Jalankan: node scripts/create-admin.js

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = 'admin@khairotour.com';
    const password = 'admin123';  // Ganti dengan password yang diinginkan
    const name = 'Administrator';

    // Cek apakah user sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('❌ User dengan email ini sudah ada!');
      console.log('Email:', existingUser.email);
      console.log('\nJika ingin reset password, hapus user dulu dengan:');
      console.log(`DELETE FROM User WHERE email = '${email}';`);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      }
    });

    console.log('✅ Admin user berhasil dibuat!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  PENTING: Segera ganti password setelah login pertama kali!');
    console.log('\nLogin di: http://your-domain.com/admin/login');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
