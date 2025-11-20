# Panduan Deploy Khairo Tour ke Ubuntu Server (Apache + MySQL)

## Prasyarat
- Ubuntu Server 20.04 LTS atau lebih baru
- Akses SSH ke server
- Domain yang sudah di-pointing ke IP server (opsional, bisa pakai IP langsung)
- MySQL Database (bisa di server yang sama atau terpisah)

## Langkah 1: Persiapan Server

### 1.1 Update sistem
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Node.js 20.x
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Harus v20.x atau lebih
npm --version
```

### 1.3 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 1.4 Install Apache2
```bash
sudo apt install -y apache2
sudo systemctl start apache2
sudo systemctl enable apache2
```

### 1.5 Enable Apache modules yang diperlukan
```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_balancer
sudo a2enmod lbmethod_byrequests
sudo a2enmod rewrite
sudo a2enmod headers
sudo systemctl restart apache2
```

### 1.6 Install MySQL Server
```bash
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 1.7 Amankan MySQL
```bash
sudo mysql_secure_installation
```
Ikuti prompt:
- Set root password: **YES** (pilih password yang kuat)
- Remove anonymous users: **YES**
- Disallow root login remotely: **YES**
- Remove test database: **YES**
- Reload privilege tables: **YES**

## Langkah 2: Setup Database MySQL

### 2.1 Login ke MySQL
```bash
sudo mysql -u root -p
```

### 2.2 Buat database dan user
Di MySQL prompt, jalankan:
```sql
-- Buat database
CREATE DATABASE khairo_tour CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Buat user dan berikan password
CREATE USER 'khairo_user'@'localhost' IDENTIFIED BY 'password_aman_anda';

-- Berikan privileges
GRANT ALL PRIVILEGES ON khairo_tour.* TO 'khairo_user'@'localhost';

-- Refresh privileges
FLUSH PRIVILEGES;

-- Lihat user yang sudah dibuat
SELECT user, host FROM mysql.user WHERE user = 'khairo_user';

-- Keluar
EXIT;
```

### 2.3 Test koneksi database
```bash
mysql -u khairo_user -p khairo_tour
# Masukkan password saat diminta
# Jika berhasil, keluar dengan EXIT;
```

## Langkah 3: Clone dan Setup Aplikasi

### 3.1 Buat direktori aplikasi
```bash
cd /var/www
sudo mkdir -p khairo-tour
sudo chown $USER:$USER khairo-tour
cd khairo-tour
```

### 3.2 Clone repository (atau upload file)
```bash
# Jika menggunakan Git
git clone https://github.com/yourusername/khairo-tour.git .

# Atau jika upload manual via FTP/SCP, skip langkah ini
```

### 3.3 Install dependencies
```bash
npm install
```

### 3.4 Setup Environment Variables
```bash
cp .env.example .env
nano .env
```

Edit file `.env` dengan konfigurasi berikut:
```env
# Database MySQL
DATABASE_URL="mysql://khairo_user:password_aman_anda@localhost:3306/khairo_tour"

# NextAuth
NEXTAUTH_URL="http://your-domain.com"  # Ganti dengan domain Anda
NEXTAUTH_SECRET="your-secret-key-here"  # Generate dengan: openssl rand -base64 32

# Google Analytics (opsional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=""

# Environment
NODE_ENV="production"
```

### 3.5 Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```
Copy hasilnya ke `.env` di bagian `NEXTAUTH_SECRET`

### 3.6 Update Prisma schema untuk MySQL
Buka file `prisma/schema.prisma`:
```bash
nano prisma/schema.prisma
```

Ubah bagian datasource menjadi:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### 3.7 Setup Database Schema
```bash
npx prisma generate
npx prisma db push
```

### 3.8 Build aplikasi
```bash
npm run build
```

### 3.9 Buat folder untuk uploads
```bash
mkdir -p public/uploads/images public/uploads/videos
chmod -R 755 public/uploads
```

### 3.10 Test aplikasi
```bash
npm start
```
Buka browser: `http://server-ip:3000`

Jika berfungsi dengan baik, tekan `Ctrl+C` untuk stop.

## Langkah 4: Setup PM2

### 4.1 Jalankan aplikasi dengan PM2
```bash
pm2 start npm --name "khairo-tour" -- start
```

### 4.2 Lihat status aplikasi
```bash
pm2 status
pm2 logs khairo-tour
```

### 4.3 Save PM2 process list
```bash
pm2 save
```

### 4.4 Setup PM2 startup script (agar auto-start saat reboot)
```bash
pm2 startup
```
Jalankan perintah yang ditampilkan (biasanya dimulai dengan `sudo env PATH=...`)

### 4.5 Verifikasi PM2 berjalan
```bash
pm2 list
```

## Langkah 5: Setup Apache sebagai Reverse Proxy

### 5.1 Buat konfigurasi VirtualHost
```bash
sudo nano /etc/apache2/sites-available/khairo-tour.conf
```

Isi dengan konfigurasi berikut:
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com

    ServerAdmin admin@your-domain.com

    # Proxy settings
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    # WebSocket support
    RewriteEngine on
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/?(.*) "ws://localhost:3000/$1" [P,L]

    # Logging
    ErrorLog ${APACHE_LOG_DIR}/khairo-tour-error.log
    CustomLog ${APACHE_LOG_DIR}/khairo-tour-access.log combined

    # Security headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"

    # Upload size limit
    LimitRequestBody 52428800
</VirtualHost>
```

**Catatan:** Ganti `your-domain.com` dengan domain Anda yang sebenarnya.

### 5.2 Enable site dan disable default
```bash
sudo a2ensite khairo-tour.conf
sudo a2dissite 000-default.conf
```

### 5.3 Test konfigurasi Apache
```bash
sudo apache2ctl configtest
```
Harus menampilkan "Syntax OK"

### 5.4 Restart Apache
```bash
sudo systemctl restart apache2
```

### 5.5 Cek status Apache
```bash
sudo systemctl status apache2
```

## Langkah 6: Setup SSL dengan Let's Encrypt (RECOMMENDED)

### 6.1 Install Certbot
```bash
sudo apt install -y certbot python3-certbot-apache
```

### 6.2 Dapatkan SSL Certificate
```bash
sudo certbot --apache -d your-domain.com -d www.your-domain.com
```

Ikuti prompt:
- Masukkan email Anda
- Agree to Terms of Service
- Pilih apakah redirect HTTP to HTTPS (pilih option 2: Redirect)

### 6.3 Verifikasi SSL
Buka `https://your-domain.com` di browser

### 6.4 Setup auto-renewal
```bash
sudo certbot renew --dry-run
```

Certbot akan otomatis renew sebelum certificate expired.

## Langkah 7: Setup Firewall (UFW)

```bash
# Allow SSH
sudo ufw allow OpenSSH

# Allow HTTP
sudo ufw allow 'Apache'

# Allow HTTPS
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Langkah 8: Buat Admin User Pertama

### 8.1 Buat user admin via database
```bash
mysql -u khairo_user -p khairo_tour
```

Di MySQL prompt:
```sql
-- Hash password "admin123" (ganti dengan password yang aman)
-- Gunakan online bcrypt generator atau Node.js untuk hash password

INSERT INTO User (id, email, password, name, createdAt, updatedAt)
VALUES (
    UUID(),
    'admin@khairotour.com',
    '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEF',  -- Ganti dengan bcrypt hash
    'Administrator',
    NOW(),
    NOW()
);

-- Lihat user yang dibuat
SELECT * FROM User;

EXIT;
```

### 8.2 Generate bcrypt hash untuk password
Buat file sementara untuk generate hash:
```bash
cd /var/www/khairo-tour
nano generate-hash.js
```

Isi:
```javascript
const bcrypt = require('bcryptjs');
const password = 'your_admin_password_here';  // Ganti dengan password yang diinginkan
const hash = bcrypt.hashSync(password, 10);
console.log('Hash:', hash);
```

Jalankan:
```bash
node generate-hash.js
```

Copy hash yang dihasilkan dan gunakan di query INSERT di atas.

Hapus file setelah selesai:
```bash
rm generate-hash.js
```

## Langkah 9: Verifikasi Deployment

### 9.1 Cek aplikasi berjalan
```bash
pm2 status
pm2 logs khairo-tour --lines 50
```

### 9.2 Cek Apache
```bash
sudo systemctl status apache2
sudo apache2ctl -S  # Lihat virtual hosts
```

### 9.3 Cek MySQL
```bash
sudo systemctl status mysql
```

### 9.4 Test di browser
- Buka `http://your-domain.com` atau `https://your-domain.com`
- Buka `http://your-domain.com/admin/login`
- Login dengan email dan password admin yang sudah dibuat

## Perintah Penting untuk Maintenance

### Update aplikasi
```bash
cd /var/www/khairo-tour

# Pull perubahan terbaru
git pull origin main

# Install dependencies baru (jika ada)
npm install

# Rebuild aplikasi
npm run build

# Restart PM2
pm2 restart khairo-tour

# Jika ada perubahan database schema
npx prisma db push
```

### Lihat logs aplikasi
```bash
# PM2 logs
pm2 logs khairo-tour
pm2 logs khairo-tour --lines 100

# Apache logs
sudo tail -f /var/log/apache2/khairo-tour-error.log
sudo tail -f /var/log/apache2/khairo-tour-access.log
```

### Restart services
```bash
# Restart aplikasi
pm2 restart khairo-tour

# Restart Apache
sudo systemctl restart apache2

# Restart MySQL
sudo systemctl restart mysql
```

### Backup database MySQL
```bash
# Backup dengan mysqldump
mysqldump -u khairo_user -p khairo_tour > backup_$(date +%Y%m%d_%H%M%S).sql

# Atau dengan compression
mysqldump -u khairo_user -p khairo_tour | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Restore database
```bash
# Restore dari backup
mysql -u khairo_user -p khairo_tour < backup_file.sql

# Atau dari compressed file
gunzip < backup_file.sql.gz | mysql -u khairo_user -p khairo_tour
```

### Monitoring resource
```bash
# Lihat resource usage PM2
pm2 monit

# Lihat overall system
htop

# Lihat disk usage
df -h

# Lihat MySQL processes
mysqladmin -u root -p processlist
```

## Troubleshooting

### 1. Aplikasi tidak bisa diakses

**Cek PM2:**
```bash
pm2 status
pm2 logs khairo-tour
```

**Cek port 3000:**
```bash
sudo netstat -tulpn | grep 3000
# atau
sudo ss -tulpn | grep 3000
```

**Restart aplikasi:**
```bash
pm2 restart khairo-tour
```

### 2. Error database connection

**Cek MySQL status:**
```bash
sudo systemctl status mysql
```

**Test koneksi:**
```bash
mysql -u khairo_user -p khairo_tour
```

**Cek DATABASE_URL di .env:**
```bash
cat /var/www/khairo-tour/.env | grep DATABASE_URL
```

**Restart MySQL:**
```bash
sudo systemctl restart mysql
```

### 3. Apache error / 502 Bad Gateway

**Cek Apache logs:**
```bash
sudo tail -f /var/log/apache2/error.log
```

**Test konfigurasi:**
```bash
sudo apache2ctl configtest
```

**Restart Apache:**
```bash
sudo systemctl restart apache2
```

**Cek apakah aplikasi berjalan di port 3000:**
```bash
curl http://localhost:3000
```

### 4. Upload file tidak berfungsi

**Cek permissions:**
```bash
ls -la /var/www/khairo-tour/public/uploads
```

**Fix permissions:**
```bash
cd /var/www/khairo-tour
mkdir -p public/uploads/images public/uploads/videos
chmod -R 755 public/uploads
chown -R $USER:$USER public/uploads
```

**Cek upload size limit di Apache:**
File: `/etc/apache2/sites-available/khairo-tour.conf`
```apache
LimitRequestBody 52428800  # 50MB
```

Restart Apache setelah perubahan:
```bash
sudo systemctl restart apache2
```

### 5. SSL certificate error

**Renew certificate:**
```bash
sudo certbot renew
```

**Check certificate status:**
```bash
sudo certbot certificates
```

### 6. High memory usage

**Restart PM2:**
```bash
pm2 restart khairo-tour
```

**Set memory limit:**
```bash
pm2 start npm --name "khairo-tour" --max-memory-restart 500M -- start
pm2 save
```

## Monitoring & Maintenance Rutin

### 1. Setup automated backups

Buat script backup:
```bash
nano ~/backup-khairo.sh
```

Isi:
```bash
#!/bin/bash
BACKUP_DIR="/home/$USER/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Buat folder backup jika belum ada
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u khairo_user -p'your_password' khairo_tour | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup files (opsional)
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/khairo-tour/public/uploads

# Hapus backup yang lebih dari 7 hari
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

Buat executable:
```bash
chmod +x ~/backup-khairo.sh
```

Setup cron job:
```bash
crontab -e
```

Tambahkan:
```bash
# Backup setiap hari jam 2 pagi
0 2 * * * /home/yourusername/backup-khairo.sh >> /home/yourusername/backup.log 2>&1
```

### 2. Setup log rotation untuk PM2
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

### 3. Update sistem secara rutin
```bash
sudo apt update && sudo apt upgrade -y
```

### 4. Monitor disk space
```bash
df -h
du -sh /var/www/khairo-tour/
du -sh /var/www/khairo-tour/public/uploads/
```

## Keamanan Tambahan

### 1. Install fail2ban
```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 2. Hardening MySQL
Edit `/etc/mysql/mysql.conf.d/mysqld.cnf`:
```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Tambahkan/uncomment:
```ini
[mysqld]
bind-address = 127.0.0.1
local-infile = 0
```

Restart MySQL:
```bash
sudo systemctl restart mysql
```

### 3. Disable directory listing di Apache
Sudah included di konfigurasi default, tapi pastikan:
```bash
sudo nano /etc/apache2/apache2.conf
```

Pastikan ada:
```apache
<Directory /var/www/>
    Options -Indexes
    AllowOverride All
    Require all granted
</Directory>
```

### 4. Update rutin
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update npm packages
cd /var/www/khairo-tour
npm update
npm audit fix

# Update PM2
sudo npm install -g pm2@latest
pm2 update
```

---

## Informasi Penting

**Lokasi File:**
- Aplikasi: `/var/www/khairo-tour`
- Apache config: `/etc/apache2/sites-available/khairo-tour.conf`
- Apache logs: `/var/log/apache2/`
- Environment: `/var/www/khairo-tour/.env`

**Port:**
- Aplikasi Next.js: `3000` (internal)
- Apache HTTP: `80`
- Apache HTTPS: `443`
- MySQL: `3306` (localhost only)

**Database:**
- Database name: `khairo_tour`
- User: `khairo_user`
- Host: `localhost`

**PM2:**
- Process name: `khairo-tour`
- Logs: `~/.pm2/logs/`

**Perintah Cepat:**
```bash
# Status semua services
sudo systemctl status apache2
sudo systemctl status mysql
pm2 status

# Restart semua
pm2 restart khairo-tour
sudo systemctl restart apache2

# Lihat logs
pm2 logs khairo-tour
sudo tail -f /var/log/apache2/khairo-tour-error.log
```

---

**Catatan:**
- Ganti semua `your-domain.com` dengan domain Anda yang sebenarnya
- Ganti semua password dengan password yang kuat dan aman
- Simpan semua credentials di tempat yang aman
- Lakukan backup secara rutin

Jika ada masalah atau pertanyaan, cek bagian Troubleshooting atau lihat logs untuk detail error.
