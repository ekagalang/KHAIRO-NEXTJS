#!/bin/bash

# Script untuk setup database PostgreSQL untuk Khairo Tour
# Jalankan dengan: bash scripts/setup-database.sh

echo "=================================================="
echo "Setup Database PostgreSQL untuk Khairo Tour"
echo "=================================================="
echo ""

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
DB_NAME="khairo_tour"
DB_USER="khairo_user"
DB_PASSWORD=""

# Prompt untuk password
echo -e "${YELLOW}Masukkan password untuk database user (akan dibuat):${NC}"
read -s -p "Password: " DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}Password tidak boleh kosong!${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Membuat database dan user...${NC}"

# Buat user dan database
sudo -u postgres psql <<EOF
-- Buat user jika belum ada
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = '$DB_USER') THEN
        CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
    END IF;
END
\$\$;

-- Buat database jika belum ada
SELECT 'CREATE DATABASE $DB_NAME'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Berikan privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

-- Untuk PostgreSQL 15+
\c $DB_NAME
GRANT ALL ON SCHEMA public TO $DB_USER;
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Database dan user berhasil dibuat!${NC}"
    echo ""
    echo "DATABASE_URL untuk .env:"
    echo "=================================================="
    echo "DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public\""
    echo "=================================================="
    echo ""
    echo "Salin DATABASE_URL di atas ke file .env Anda"
    echo ""
else
    echo -e "${RED}✗ Gagal membuat database dan user${NC}"
    exit 1
fi

# Tanya apakah ingin menjalankan migration
echo ""
read -p "Jalankan Prisma migration sekarang? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Menjalankan Prisma migration...${NC}"
    npx prisma generate
    npx prisma db push

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Migration berhasil!${NC}"
    else
        echo -e "${RED}✗ Migration gagal${NC}"
    fi
fi

echo ""
echo -e "${GREEN}Setup database selesai!${NC}"
