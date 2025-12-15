# app/controllers/clients_controller.rb
class ClientsController < ApplicationController
  before_action :set_client, only: [:show, :edit, :update, :destroy]

  # GET /clients
  def index
    @clients = Client.ordered

    render inertia: 'Clients/Index', props: {
      clients: @clients.map { |client| serialize_client(client) }
    }
  end

  # GET /clients/:id
  def show
    redirect_to edit_client_path(@client)
  end

  # GET /clients/new
  def new
    render inertia: 'Clients/New'
  end

  # POST /clients
  def create
    @client = Client.new(client_params)

    if @client.save
      redirect_to clients_path, notice: 'Client created successfully.'
    else
      render inertia: 'Clients/Index', props: {
        clients: Client.ordered.map { |c| serialize_client(c) },
        errors: @client.errors.to_hash
      }
    end
  end

  # GET /clients/:id/edit
  def edit
    render inertia: 'Clients/Edit', props: {
      client: serialize_client(@client)
    }
  end

  # PATCH/PUT /clients/:id
  def update
    if @client.update(client_params)
      redirect_to clients_path, notice: 'Client updated successfully.'
    else
      render inertia: 'Clients/Edit', props: {
        client: serialize_client(@client),
        errors: @client.errors.to_hash
      }
    end
  end

  # DELETE /clients/:id
  def destroy
    if @client.invoices.any?
      redirect_to clients_path, alert: 'Cannot delete client with existing invoices.'
    else
      @client.destroy
      redirect_to clients_path, notice: 'Client deleted successfully.'
    end
  end

  private

  def set_client
    @client = Client.find(params[:id])
  end

  def client_params
    params.require(:client).permit(
      :name, :email, :company, :address, :phone,
      :city, :country, :postal_code, :notes
    )
  end

  def serialize_client(client)
    {
      id: client.id.to_s,
      name: client.name,
      email: client.email,
      company: client.company,
      address: client.address,
      phone: client.phone,
      city: client.city,
      country: client.country,
      postalCode: client.postal_code,
      notes: client.notes,
      totalBilled: client.total_billed.to_f,
      lastInvoiceDate: client.last_invoice_date&.iso8601,
      invoiceCount: client.invoice_count,
      createdAt: client.created_at.iso8601,
      updatedAt: client.updated_at.iso8601
    }
  end
end
