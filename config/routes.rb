Rails.application.routes.draw do
  # Health check
  get "up" => "rails/health#show", as: :rails_health_check

  # PWA files
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  # API
  namespace :api do
    post "/register", to: "auth#register"
    post "/login", to: "auth#login"
    delete "/logout", to: "auth#logout"
    get "/me", to: "auth#me"

    resources :users, only: [:show, :update]
  end
end