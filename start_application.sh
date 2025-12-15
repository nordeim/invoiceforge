# Option 1: With foreman
#foreman start -f Procfile.dev

# Stop foreman (Ctrl+C) and restart:
source .env && foreman start -f Procfile.dev

exit 0

###################################
# Option 2: Two terminals
# Terminal 1:
npm run dev

# Terminal 2:
source .env && bundle exec rails server

exit 0

###################################
# Access Points
Service	URLs:
- Rails App	http://localhost:3000
- Vite Dev	http://localhost:3036
- MailHog	http://localhost:8025

# Login Credentials
Email: admin@invoiceforge.app
Password: password123

---

# Stop foreman first (Ctrl+C)

# Clear Vite cache
rm -rf node_modules/.vite

# Clear Rails tmp cache
rm -rf tmp/cache

# Restart
source .env && foreman start -f Procfile.dev
