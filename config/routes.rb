Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # constraints subdomain: "test-user" do
  constraints subdomain: /.+/ do
    get '/', to: 'user_content#index', as: :user_content
    get 'l/:public_id', to: 'products#show', as: :product_link

    resources :user_content, controller: 'user_content'   
  end

  constraints subdomain: "" do
    resources :products, param: :public_id, only: [:index, :new, :create, :edit, :update]

    # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
    # Can be used by load balancers and uptime monitors to verify that the app is live.
    get "up" => "rails/health#show", as: :rails_health_check

    get "dashboard", to: "dashboard#index" 

    # Defines the root path route ("/")
    root "dashboard#index"
  end
end
