# InvoiceForge Dockerfile
# For running the Rails application in a container
#
# Build:   docker build -t invoiceforge .
# Run:     docker run -p 3000:3000 invoiceforge

# ═══════════════════════════════════════════════════════════════════════════
# Stage 1: Base image with Ruby
# ═══════════════════════════════════════════════════════════════════════════
FROM ruby:3.4-alpine AS base

# Install runtime dependencies
RUN apk add --no-cache \
    postgresql-client \
    nodejs \
    npm \
    tzdata \
    gcompat

# Set working directory
WORKDIR /app

# Set environment
ENV RAILS_ENV=production \
    BUNDLE_DEPLOYMENT=1 \
    BUNDLE_WITHOUT="development test" \
    BUNDLE_PATH="/usr/local/bundle"

# ═══════════════════════════════════════════════════════════════════════════
# Stage 2: Build dependencies
# ═══════════════════════════════════════════════════════════════════════════
FROM base AS build

# Install build dependencies
RUN apk add --no-cache \
    build-base \
    git \
    postgresql-dev

# Copy Gemfile and install gems
COPY Gemfile Gemfile.lock ./
RUN bundle install --jobs 4 && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git

# Copy package.json and install Node modules
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Copy application code
COPY . .

# Build frontend assets
RUN npm run build

# Precompile bootsnap
RUN bundle exec bootsnap precompile app/ lib/

# ═══════════════════════════════════════════════════════════════════════════
# Stage 3: Production image
# ═══════════════════════════════════════════════════════════════════════════
FROM base AS production

# Create non-root user for security
RUN addgroup -g 1000 rails && \
    adduser -u 1000 -G rails -D rails

# Copy built gems
COPY --from=build /usr/local/bundle /usr/local/bundle

# Copy application
COPY --from=build --chown=rails:rails /app /app

# Switch to non-root user
USER rails

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:3000/up || exit 1

# Start the server
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
