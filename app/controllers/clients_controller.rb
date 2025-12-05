class ClientsController < ApplicationController
  def index
    render inertia: 'Clients/Index'
  end
end
