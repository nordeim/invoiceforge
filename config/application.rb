# config/application.rb
require_relative "boot"

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_view/railtie"
require "action_mailer/railtie"
require "active_job/railtie"
# require "action_cable/engine"
# require "action_mailbox/engine"
# require "action_text/engine"
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Invoiceforge
  class Application < Rails::Application
    # Initialize configuration defaults for current Rails version.
    config.load_defaults 8.0

    # Configuration for the application, engines, and railties goes here.
    config.autoload_lib(ignore: %w[assets tasks])

    # Time zone
    config.time_zone = "Singapore"

    # Generators
    config.generators do |g|
      g.test_framework :rspec
      g.fixture_replacement :factory_bot, dir: "spec/factories"
      g.skip_routes true
      g.helper false
      g.stylesheets false
      g.javascripts false
    end

    # API-only mode is off (we use Inertia for full-stack)
    config.api_only = false
  end
end
