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
      {
        key: "site_logo",
        value: "",
        description: "Logo website untuk homepage",
      },
      {
        key: "site_logo_admin",
        value: "",
        description: "Logo untuk halaman admin/CMS",
      },
      {
        key: "site_favicon",
        value: "",
        description: "Favicon website (icon di browser tab)",
      },
    ],
    skipDuplicates: true,
  });

  // Buat hero stats default
  const existingStats = await prisma.heroStat.count();
  if (existingStats === 0) {
    await prisma.heroStat.createMany({
      data: [
        {
          label: "Pengalaman",
          value: "10+",
          suffix: "Tahun",
          icon: "Award",
          order: 1,
          isActive: true,
        },
        {
          label: "Jamaah Terlayani",
          value: "5000+",
          suffix: null,
          icon: "Users",
          order: 2,
          isActive: true,
        },
        {
          label: "Kepuasan",
          value: "100%",
          suffix: null,
          icon: "ThumbsUp",
          order: 3,
          isActive: true,
        },
      ],
    });
    console.log("Hero stats created");
  }

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
