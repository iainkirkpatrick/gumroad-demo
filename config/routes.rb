Rails.application.routes.draw do
  if Rails.env.development? || Rails.env.test? 
    scope :e2e do
      match ':action', to: 'e2e#:action', via: [:get, :post]
    end
  end

  resources :purchases

  # updating a cart is possible from either the user subdomain or the main domain (checkout page)
  resources :carts, only: [:update]

  constraints subdomain: "test-user" do
  # constraints subdomain: /.+/ do
    get '/', to: 'user_content#index', as: :user_content
    get 'l/:public_id', to: 'products#show', as: :product_link

    resources :user_content, controller: 'user_content'   
  end

  constraints subdomain: "" do
    resources :products, param: :public_id, only: [:index, :new, :create, :edit, :update]

    get '/checkout', to: 'carts#show', as: 'checkout'

    get 'd/:public_id', to: 'user_content#show', as: :content_link

    get "dashboard", to: "dashboard#index" 
  end
  # Defines the root path route ("/")
  root "dashboard#index"

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
end
