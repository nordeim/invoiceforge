# InvoiceForge Phase 2 Implementation Plan

**Version:** 1.0
**Created:** 2025-12-15
**Status:** Ready for Review

---

## Executive Summary

This plan outlines the implementation of **Phase 2: Backend Integration & Features** for InvoiceForge. Phase 1 delivered a complete static frontend with mock data. Phase 2 will integrate real backend persistence, authentication, payments, PDF generation, and email notifications.

### Key Deliverables

| Deliverable | Priority | Estimated Effort |
|-------------|----------|------------------|
| Backend Foundation (Models, Migrations, Controllers) | P0 - Critical | 3-4 days |
| User Authentication (Devise) | P1 - High | 1-2 days |
| Payment Integration (Stripe) | P2 - Medium | 2-3 days |
| PDF Generation | P2 - Medium | 1 day |
| Email Notifications | P3 - Lower | 1-2 days |

> [!IMPORTANT]
> **Dependency Chain:** Backend Foundation → Authentication → Payments → PDF → Email
> Each component depends on the previous being complete.

---

## Proposed Changes

### Workstream 1: Backend Foundation (P0 - Critical Path)

The current project has minimal Rails structure. We need to establish a complete Rails 8 backend with database persistence.

---

#### [MODIFY] [Gemfile](file:///home/project/invoiceforge/Gemfile)

**Current State:** Only has `inertia_rails` gem.

**Changes Required:**
- Add Rails 8 framework gems
- Add PostgreSQL v16 database gem (all environments)
- Add authentication gem (Devise)
- Add PDF generation gem (Prawn or wicked_pdf)
- Add Stripe gem for payments
- Add testing gems (RSpec, Factory Bot, Faker)

**Checklist:**
- [ ] Added `rails` gem (version 8.x)
- [ ] Added `pg` gem for PostgreSQL v16
- [ ] Added `devise` gem for authentication
- [ ] Added `prawn` or `wicked_pdf` gem for PDF
- [ ] Added `stripe` gem for payments
- [ ] Added testing gems (rspec-rails, factory_bot_rails, faker)
- [ ] Bundle install successful

---

#### [NEW] [config/database.yml](file:///home/project/invoiceforge/config/database.yml)

**Purpose:** Configure PostgreSQL v16 for all environments.

**Changes Required:**
```yaml
default: &default
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  host: <%= ENV.fetch("PGHOST") { "localhost" } %>
  username: <%= ENV.fetch("PGUSER") { "postgres" } %>
  password: <%= ENV.fetch("PGPASSWORD") { "" } %>

development:
  <<: *default
  database: invoiceforge_development

test:
  <<: *default
  database: invoiceforge_test

production:
  <<: *default
  url: <%= ENV['DATABASE_URL'] %>
```

**Checklist:**
- [ ] File created with correct structure
- [ ] All environments use PostgreSQL v16
- [ ] Environment variables supported for flexible configuration

---

#### [NEW] [db/migrate/001_create_clients.rb](file:///home/project/invoiceforge/db/migrate/001_create_clients.rb)

**Purpose:** Create clients table matching TypeScript `Client` interface.

**Schema Design:**
```ruby
create_table :clients do |t|
  t.string :name, null: false
  t.string :email, null: false
  t.string :company
  t.text :address
  t.string :phone
  t.string :city
  t.string :country
  t.string :postal_code
  t.text :notes
  t.timestamps
end
add_index :clients, :email
```

**Checklist:**
- [ ] All fields from TypeScript interface included
- [ ] `name` and `email` are required (null: false)
- [ ] Index on email for lookups
- [ ] Timestamps included

---

#### [NEW] [db/migrate/002_create_invoices.rb](file:///home/project/invoiceforge/db/migrate/002_create_invoices.rb)

**Purpose:** Create invoices table matching TypeScript `Invoice` interface.

**Schema Design:**
```ruby
create_table :invoices do |t|
  t.references :client, null: false, foreign_key: true
  t.string :invoice_number, null: false
  t.string :status, null: false, default: 'draft'
  t.date :issue_date, null: false
  t.date :due_date, null: false
  t.text :notes
  t.string :token, null: false
  t.decimal :subtotal, precision: 10, scale: 2, default: 0
  t.decimal :total_discount, precision: 10, scale: 2, default: 0
  t.decimal :total, precision: 10, scale: 2, default: 0
  t.timestamps
end
add_index :invoices, :invoice_number, unique: true
add_index :invoices, :token, unique: true
add_index :invoices, :status
```

**Checklist:**
- [ ] Foreign key to clients table
- [ ] Status defaults to 'draft'
- [ ] Money fields use decimal with precision: 10, scale: 2
- [ ] Unique indexes on invoice_number and token
- [ ] Index on status for filtering

---

#### [NEW] [db/migrate/003_create_line_items.rb](file:///home/project/invoiceforge/db/migrate/003_create_line_items.rb)

**Purpose:** Create line_items table matching TypeScript `LineItem` interface.

**Schema Design:**
```ruby
create_table :line_items do |t|
  t.references :invoice, null: false, foreign_key: true
  t.string :item_type, null: false  # 'item', 'section', 'discount'
  t.text :description, null: false
  t.decimal :quantity, precision: 10, scale: 2
  t.string :unit_type  # 'hours', 'days', 'items', 'units', 'fixed'
  t.decimal :unit_price, precision: 10, scale: 2
  t.integer :position, null: false, default: 0
  t.timestamps
end
add_index :line_items, [:invoice_id, :position]
```

**Checklist:**
- [ ] Foreign key to invoices table
- [ ] item_type column (not 'type' to avoid Rails reserved word)
- [ ] Nullable quantity/unit_type/unit_price for section headers
- [ ] Position for ordering

---

#### [NEW] [app/models/client.rb](file:///home/project/invoiceforge/app/models/client.rb)

**Purpose:** Client model with validations and associations.

**Implementation:**
```ruby
class Client < ApplicationRecord
  has_many :invoices, dependent: :restrict_with_error
  
  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  
  # Computed fields for list views
  def total_billed
    invoices.where(status: 'paid').sum(:total)
  end
  
  def last_invoice_date
    invoices.maximum(:issue_date)
  end
end
```

**Checklist:**
- [ ] Association to invoices
- [ ] Validations for required fields
- [ ] Email format validation
- [ ] Computed methods for total_billed and last_invoice_date

---

#### [NEW] [app/models/invoice.rb](file:///home/project/invoiceforge/app/models/invoice.rb)

**Purpose:** Invoice model with validations, associations, and status management.

**Implementation:**
```ruby
class Invoice < ApplicationRecord
  belongs_to :client
  has_many :line_items, dependent: :destroy
  
  validates :invoice_number, presence: true, uniqueness: true
  validates :status, presence: true, inclusion: { in: %w[draft pending paid overdue cancelled] }
  validates :issue_date, presence: true
  validates :due_date, presence: true
  validates :token, presence: true, uniqueness: true
  
  before_validation :generate_token, on: :create
  after_save :recalculate_totals
  
  scope :by_status, ->(status) { where(status: status) if status.present? && status != 'all' }
  
  def overdue?
    status == 'pending' && due_date < Date.today
  end
  
  def calculated_status
    return status unless status == 'pending'
    overdue? ? 'overdue' : 'pending'
  end
  
  private
  
  def generate_token
    self.token ||= SecureRandom.urlsafe_base64(16)
  end
  
  def recalculate_totals
    items = line_items.where(item_type: 'item')
    discounts = line_items.where(item_type: 'discount')
    
    self.subtotal = items.sum { |i| (i.quantity || 0) * (i.unit_price || 0) }
    self.total_discount = discounts.sum { |d| (d.unit_price || 0).abs }
    self.total = subtotal - total_discount
    update_columns(subtotal: subtotal, total_discount: total_discount, total: total)
  end
end
```

**Checklist:**
- [ ] Associations to client and line_items
- [ ] All validations implemented
- [ ] Token auto-generation
- [ ] Totals recalculation callback
- [ ] Overdue status calculation

---

#### [NEW] [app/models/line_item.rb](file:///home/project/invoiceforge/app/models/line_item.rb)

**Purpose:** LineItem model with validations.

**Implementation:**
```ruby
class LineItem < ApplicationRecord
  belongs_to :invoice
  
  validates :item_type, presence: true, inclusion: { in: %w[item section discount] }
  validates :description, presence: true
  validates :position, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  
  validates :quantity, :unit_price, presence: true, if: -> { item_type == 'item' }
  
  def line_total
    return 0 if item_type == 'section'
    (quantity || 0) * (unit_price || 0)
  end
end
```

**Checklist:**
- [ ] Association to invoice
- [ ] Type validation with allowed values
- [ ] Conditional validation for item type
- [ ] line_total computed method

---

#### [MODIFY] [app/controllers/dashboard_controller.rb](file:///home/project/invoiceforge/app/controllers/dashboard_controller.rb)

**Current State:** Renders Inertia page with no props.

**Changes Required:**
- Query real metrics from database
- Pass props to Dashboard page

**Checklist:**
- [ ] Calculate totalOutstanding from pending + overdue invoices
- [ ] Calculate totalPaidThisMonth from invoices paid this month
- [ ] Calculate totalPaidYTD from invoices paid this year
- [ ] Get recent invoices (last 5)
- [ ] Build recent activity from recent records
- [ ] Pass all props to Inertia render

---

#### [MODIFY] [app/controllers/clients_controller.rb](file:///home/project/invoiceforge/app/controllers/clients_controller.rb)

**Current State:** Only renders Inertia page with no props.

**Changes Required:**
- Implement full CRUD actions
- Query clients from database
- Handle create/update/delete operations

**Checklist:**
- [ ] Index action returns all clients with computed fields
- [ ] Create action handles new client creation
- [ ] Update action handles client updates
- [ ] Destroy action handles client deletion
- [ ] Strong parameters implemented
- [ ] Error handling for validation failures

---

#### [MODIFY] [app/controllers/invoices_controller.rb](file:///home/project/invoiceforge/app/controllers/invoices_controller.rb)

**Current State:** Pre-written with full CRUD logic referencing models.

**Changes Required:**
- Review and verify compatibility with actual model implementations
- Update serialize methods if needed
- Add error handling improvements

**Checklist:**
- [ ] Verify serialize_invoice matches model structure
- [ ] Verify serialize_client matches model structure
- [ ] Test create/update with line_items
- [ ] Test status transition actions (mark_paid, mark_sent, cancel)
- [ ] Test duplicate action

---

#### [MODIFY] Frontend pages to use real props

**Pages to update:**
- `app/frontend/pages/Dashboard.tsx` - Already uses optional props with mock fallback
- `app/frontend/pages/Clients/Index.tsx` - Already uses optional props with mock fallback  
- `app/frontend/pages/Invoices/Index.tsx` - Already uses optional props with mock fallback
- `app/frontend/pages/Invoices/New.tsx` - Needs to accept clients prop
- `app/frontend/pages/Invoices/Edit.tsx` - Needs to accept invoice and clients props

**Checklist:**
- [ ] Verify all pages gracefully handle real props
- [ ] Remove mock data fallbacks once backend is verified
- [ ] Update form submissions to use Inertia form helpers

---

### Workstream 2: User Authentication (P1 - High)

---

#### [NEW] Devise Installation & Configuration

**Files to Create/Modify:**
- `config/initializers/devise.rb` - Devise configuration
- `app/models/user.rb` - User model
- `db/migrate/XXX_devise_create_users.rb` - Users table
- `app/controllers/application_controller.rb` - Add `before_action :authenticate_user!`
- `config/routes.rb` - Add Devise routes

**Checklist:**
- [ ] Run `rails generate devise:install`
- [ ] Run `rails generate devise User`
- [ ] Configure Devise for session-based auth
- [ ] Add `before_action :authenticate_user!` to ApplicationController
- [ ] Skip authentication for PublicInvoicesController
- [ ] Verify root redirect to login when not authenticated

---

### Workstream 3: Payment Integration (P2 - Medium)

---

#### [NEW] Stripe Integration

**Files to Create/Modify:**
- `config/initializers/stripe.rb` - Stripe configuration
- `app/controllers/payments_controller.rb` - Payment handling
- `config/routes.rb` - Payment routes
- `app/frontend/components/public-invoice/PaymentModal.tsx` - Real Stripe Elements

**Checklist:**
- [ ] Configure Stripe API keys from ENV
- [ ] Create PaymentIntent endpoint
- [ ] Handle Stripe webhooks for payment status
- [ ] Replace mock PaymentModal with Stripe Elements
- [ ] Update invoice status on successful payment
- [ ] Handle payment failures gracefully

---

### Workstream 4: PDF Generation (P2 - Medium)

---

#### [NEW] PDF Export Feature

**Files to Create/Modify:**
- `app/controllers/invoices_controller.rb` - Add `download_pdf` action
- `app/views/invoices/show.pdf.prawn` or equivalent template
- `config/routes.rb` - Add PDF download route

**Checklist:**
- [ ] Create PDF template matching public invoice design
- [ ] Add download endpoint `/invoices/:id/download_pdf`
- [ ] Add "Download PDF" button to Invoice Edit page
- [ ] Test PDF rendering with all line item types
- [ ] Verify correct currency formatting in PDF

---

### Workstream 5: Email Notifications (P3 - Lower)

---

#### [NEW] Action Mailer Setup

**Files to Create/Modify:**
- `app/mailers/invoice_mailer.rb` - Invoice email mailer
- `app/views/invoice_mailer/send_invoice.html.erb` - Email template
- `config/environments/development.rb` - Email settings
- `app/controllers/invoices_controller.rb` - Send email on `mark_sent`

**Checklist:**
- [ ] Configure Action Mailer for development (letter_opener or similar)
- [ ] Create branded email template
- [ ] Include public invoice link in email
- [ ] Attach PDF optionally
- [ ] Send email when invoice status changes to 'pending'

---

## Verification Plan

### Automated Tests

> [!NOTE]
> Currently **no automated tests exist** in the project. Vitest is configured in package.json but no test files have been written. Phase 2 should include test creation.

**Proposed Test Strategy:**

1. **Backend Tests (RSpec)**
   - Model validations and associations
   - Controller actions with request specs
   - Invoice calculations

2. **Frontend Tests (Vitest)**
   - Invoice calculation utilities
   - Component rendering

**Commands to Run:**
```bash
# Backend tests (after adding RSpec)
bundle exec rspec

# Frontend tests (after adding test files)
npm run test
```

### Manual Verification

#### Backend Foundation Verification

**Prerequisite:** Run migrations and seed database
```bash
# After creating migrations
rails db:create db:migrate

# Optionally seed with test data
rails db:seed
```

**Test Steps:**
1. Start development server: `./start_dev_server.sh` or `bin/dev`
2. Navigate to `/dashboard` - verify metrics display real data or zeros (not mock)
3. Navigate to `/clients` - verify empty state or seeded clients display
4. Create a new client - verify it appears in list
5. Navigate to `/invoices` - verify empty state or seeded invoices
6. Create a new invoice - verify it appears in list with correct totals
7. Edit invoice - add/remove line items - verify totals recalculate
8. Test status transitions: Send (draft→pending), Mark Paid (pending→paid)
9. Navigate to public invoice URL `/i/:token` - verify invoice displays

#### Authentication Verification

**Test Steps:**
1. Log out and navigate to `/dashboard` - should redirect to login
2. Create new user account
3. Login - should redirect to dashboard
4. Verify all protected routes require authentication
5. Verify `/i/:token` works without authentication

---

## User Review Required

> [!NOTE]
> **Database Choice:** This plan uses PostgreSQL v16 for all environments (development, test, production) as confirmed by user.

> [!IMPORTANT]
> **Stripe Integration:** Real payment processing requires Stripe API keys. Will you be providing test/production keys, or should this be deferred?

**Questions for User:**

1. **Database:** ✅ PostgreSQL v16 for all environments (confirmed)
2. **Authentication:** Devise is recommended - any preference for different auth?
3. **Stripe:** Do you have Stripe API keys ready, or defer payment integration?
4. **Email Service:** Which email provider for production (SendGrid, Mailgun, etc.)?
5. **PDF Library:** Prawn (pure Ruby) or wicked_pdf (requires wkhtmltopdf)?

---

## Implementation Order

```
Phase 2 Execution Sequence:

Day 1-2: Backend Foundation (Models + Migrations)
   ├── Add gems to Gemfile
   ├── Create database.yml
   ├── Create migrations
   ├── Create models with validations
   └── Seed database for testing

Day 3: Controllers Integration
   ├── Update DashboardController
   ├── Implement ClientsController CRUD
   ├── Verify InvoicesController
   └── Test all endpoints

Day 4: Authentication
   ├── Install Devise
   ├── Create User model
   ├── Protect routes
   └── Create login UI if needed

Day 5-6: Payments (if approved)
   ├── Configure Stripe
   ├── Create payment endpoints
   ├── Update PaymentModal
   └── Handle webhooks

Day 7: PDF + Email
   ├── Create PDF template
   ├── Configure mailer
   ├── Create email template
   └── Wire up to invoice actions

Day 8: Testing & QA
   ├── Write RSpec tests
   ├── Write Vitest tests
   ├── Manual QA
   └── Fix issues
```

---

## Success Criteria

- [ ] All CRUD operations work with real database
- [ ] Invoice totals calculate correctly from line items
- [ ] Status transitions work correctly
- [ ] Public invoice displays correctly
- [ ] Authentication protects admin routes
- [ ] (If approved) Stripe payments process
- [ ] (If approved) PDF downloads work
- [ ] (If approved) Emails send successfully

---

# InvoiceForge Phase 2 Planning

## Current Objective
Create a comprehensive implementation plan for Phase 2 (Backend Integration & Features)

## Tasks

### Phase 2 Research & Planning
- [x] Save validated deep analysis as `Updated_Deep_Analysis_PRD_v4.2.md`
- [x] Explore codebase structure and current implementation
- [x] Analyze current backend state (controllers, models, routes)
- [x] Identify gaps between mock data and production requirements
- [x] Create comprehensive Phase 2 implementation plan
- [x] Review and validate the implementation plan (✅ PostgreSQL v16 confirmed)

### Phase 2 Implementation
- [/] Backend Integration: Gemfile, database.yml, models, migrations
  - [x] Gemfile with Rails 8, PostgreSQL, Devise, Prawn, RSpec
  - [x] config/database.yml for PostgreSQL v16
  - [x] Migrations: clients, invoices, line_items
  - [x] Models: Client, Invoice, LineItem with validations
  - [x] Controllers: Dashboard, Clients, Invoices updated
  - [x] Environment configs: development, test, production
  - [ ] Bundle install and database setup
- [ ] User Authentication: Session-based auth with Devise
- [ ] Real Payment Integration: Stripe Elements
- [ ] PDF Generation: Invoice exports
- [ ] Email Notifications: Action Mailer
