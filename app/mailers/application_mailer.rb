# app/mailers/application_mailer.rb
class ApplicationMailer < ActionMailer::Base
  default from: 'noreply@invoiceforge.app'
  layout 'mailer'
end
