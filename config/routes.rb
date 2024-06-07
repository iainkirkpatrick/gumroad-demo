Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  resources :products, param: :public_id, only: [:index, :show, :new, :create, :edit, :update]

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  get "dashboard", to: "dashboard#index" 

  # Defines the root path route ("/")
  root "dashboard#index"
end