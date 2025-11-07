import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Buat admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@khairo.com" },
    update: {},
    create: {
      email: "admin@khairo.com",
      name: "Admin",
      password: hashedPassword,
      role: "admin",
    },
  });

  // Buat settings default
  await prisma.setting.createMany({
    data: [
      {
        key: "site_name",
        value: "Tour Haji & Umroh",
        description: "Nama website",
      },
      {
        key: "whatsapp_number",
        value: "6281234567890",
        description: "Nomor WhatsApp untuk checkout",
      },
      {
        key: "site_description",
        value: "Layanan tour Haji dan Umroh terpercaya",
        description: "Deskripsi website",
      },
      {
        key: "site_email",
        value: "info@tourhajiumumroh.com",
        description: "Email kontak",
      },
      {
        key: "site_phone",
        value: "021-12345678",
        description: "Nomor telepon",
      },
    ],
    skipDuplicates: true,
  });

  console.log({ admin });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
