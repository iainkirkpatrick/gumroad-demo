# Be sure to restart your server when you modify this file.

# Define an application-wide content security policy.
# See the Securing Rails Applications Guide for more information:
# https://guides.rubyonrails.org/security.html#content-security-policy-header

Rails.application.configure do
  if Rails.env.production?
    config.content_security_policy do |policy|
      policy.default_src :self, :https
      policy.font_src    :self, :https, :data
      policy.img_src     :self, :https, :data
      policy.object_src  :none
      policy.script_src  :self, 'https://assets.calendly.com', 'https://cal.com'
      policy.frame_src   :self, 'https://calendly.com', 'https://cal.com'

      # Allow @vite/client to hot reload javascript changes in development
      # policy.script_src *policy.script_src, :unsafe_eval, "http://#{ ViteRuby.config.host_with_port }"

      # You may need to enable this in production as well depending on your setup.
      # policy.script_src *policy.script_src, :blob

      policy.style_src   :self, :https
      # Allow @vite/client to hot reload style changes in development
      # policy.style_src *policy.style_src, :unsafe_inline

      # Specify URI for violation reports
      # policy.report_uri "/csp-violation-report-endpoint"
    end

    # Generate session nonces for permitted importmap, inline scripts, and inline styles.
    config.content_security_policy_nonce_generator = ->(request) { request.session.id.to_s }
    config.content_security_policy_nonce_directives = %w(script-src style-src)

    # Report violations without enforcing the policy.
    # config.content_security_policy_report_only = true
  end
end
