class ApplicationController < ActionController::Base
  
  private

  def root_domain
    # Extract the second-level domain and top-level domain
    host_parts = request.host.split('.')
    if host_parts.length > 1
      "#{host_parts[-2]}.#{host_parts[-1]}"
    else
      request.host # Return the host as is if it's already the root domain
    end
  end
end
