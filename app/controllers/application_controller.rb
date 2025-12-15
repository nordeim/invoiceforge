# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  # Protect from CSRF attacks
  protect_from_forgery with: :exception
  
  # Add flash types for Inertia
  add_flash_types :success, :error, :warning, :info
  
  # Share flash messages with Inertia
  inertia_share flash: -> { flash.to_hash }
  
  # Share errors if any
  inertia_share errors: -> { session.delete(:errors) || {} }
end
