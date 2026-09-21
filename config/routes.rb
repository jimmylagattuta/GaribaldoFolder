Rails.application.routes.draw do
  # Health check
  get "up" => "rails/health#show", as: :rails_health_check

  # PWA files
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  # API
  namespace :api do
    # Authentication
    post "/register", to: "auth#register"
    post "/login", to: "auth#login"
    delete "/logout", to: "auth#logout"
    get "/me", to: "auth#me"

    # Cloudinary signed uploads
    post "/uploads/signature", to: "uploads#signature"

    # Users
    resources :users,
              only: [
                :show,
                :update
              ]

    # Products
    resources :products,
              only: [
                :index,
                :show,
                :create,
                :update,
                :destroy
              ]
  end

  # React frontend fallback
  get "*path",
      to: proc { |_env|
        [
          200,
          { "Content-Type" => "text/html" },
          [File.read(Rails.root.join("public", "index.html"))]
        ]
      },
      constraints: lambda { |request|
        !request.path.start_with?("/api") &&
          !request.path.start_with?("/up") &&
          File.exist?(Rails.root.join("public", "index.html"))
      }
end