import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding social media data...");

  // Clear existing social media
  await prisma.socialMedia.deleteMany({});

  // Create default social media buttons
  const socialMedia = [
    {
      name: "WhatsApp",
      icon: "MessageCircle",
      url: "https://wa.me/6281234567890", // Ganti dengan nomor WhatsApp Anda
      bgColor: "bg-green-500",
      hoverColor: "bg-green-600",
      order: 0,
      isActive: true,
    },
    {
      name: "Instagram",
      icon: "Instagram",
      url: "https://instagram.com/khairotour", // Ganti dengan username Instagram Anda
      bgColor: "bg-pink-500",
      hoverColor: "bg-pink-600",
      order: 1,
      isActive: true,
    },
    {
      name: "Facebook",
      icon: "Facebook",
      url: "https://facebook.com/khairotour", // Ganti dengan halaman Facebook Anda
      bgColor: "bg-blue-600",
      hoverColor: "bg-blue-700",
      order: 2,
      isActive: true,
    },
    {
      name: "Phone",
      icon: "Phone",
      url: "tel:+6281234567890", // Ganti dengan nomor telepon Anda
      bgColor: "bg-teal-500",
      hoverColor: "bg-teal-600",
      order: 3,
      isActive: true,
    },
  ];

  for (const item of socialMedia) {
    await prisma.socialMedia.create({
      data: item,
    });
  }

  console.log("✅ Social media seeded successfully!");
  console.log("📝 Jangan lupa ubah URL/nomor di halaman Social Media CMS Admin");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
