module ApplicationHelper
  def subdomain_url(subdomain, path)
    host = request.host_with_port
    # Remove the port for production-like environments
    host = request.host if Rails.env.production? || Rails.env.staging?

    "#{request.protocol}#{subdomain}.#{host}#{path}"
  end
end
