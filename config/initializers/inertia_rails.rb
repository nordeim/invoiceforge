# config/initializers/inertia_rails.rb
InertiaRails.configure do |config|
  # Specify the component path resolver
  # config.component_path_resolver = ->(path) { path }
  
  # Default props shared with every Inertia response
  # These will be available in all pages via usePage()
  config.version = -> { "1.0" }
end
