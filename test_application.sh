# Start PostgreSQL (already running)
#docker compose up -d db

# Start Rails server
#source .env && bundle exec rails server

# Visit http://localhost:3000
# Login: admin@invoiceforge.app / password123

# Start PostgreSQL + MailHog
docker compose up -d

# Install the new gem
source .env && bundle install

# Restart the Rails server
source .env && bundle exec rails server

# Start Rails server
#source .env && bundle exec rails server

### test PDF Generation ###
source .env && bin/rails runner "invoice = Invoice.includes(:client, :line_items).last; generator = InvoicePdfGenerator.new(invoice); pdf_data = generator.generate; File.binwrite('tmp/test_invoice.pdf', pdf_data); puts 'PDF generated: ' + pdf_data.bytesize.to_s + ' bytes'"
