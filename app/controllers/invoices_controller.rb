class InvoicesController < ApplicationController
  def index
    render inertia: 'Invoices/Index'
  end
end
