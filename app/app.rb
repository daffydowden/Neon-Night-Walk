class Whizzrun < Padrino::Application
  register ScssInitializer
  register Padrino::Mailer
  register Padrino::Helpers

  enable :sessions

  require 'open-uri'
  require 'json'

  configure :development do
    require 'sass'

    # Convert SCSS to CSS
    get '/stylesheets/default.css' do
      scss 'stylesheets/default'
    end
  end
  configure :production do
    require 'newrelic_rpm'
    require 'hoptoad_notifier'

    HoptoadNotifier.configure do |config|
      config.api_key = '911a7b0fdcddf4908dcf3cf4a91586ac'
    end

    use HoptoadNotifier::Rack
    enable :raise_errors
  end
  ##
  # Caching support
  #
  # register Padrino::Cache
  # enable :caching
  #
  # You can customize caching store engines:
  #
  #   set :cache, Padrino::Cache::Store::Memcache.new(::Memcached.new('127.0.0.1:11211', :exception_retry_limit => 1))
  #   set :cache, Padrino::Cache::Store::Memcache.new(::Dalli::Client.new('127.0.0.1:11211', :exception_retry_limit => 1))
  #   set :cache, Padrino::Cache::Store::Redis.new(::Redis.new(:host => '127.0.0.1', :port => 6379, :db => 0))
  #   set :cache, Padrino::Cache::Store::Memory.new(50)
  #   set :cache, Padrino::Cache::Store::File.new(Padrino.root('tmp', app_name.to_s, 'cache')) # default choice
  #

  ##
  # Application configuration options
  #
  # set :raise_errors, true     # Raise exceptions (will stop application) (default for test)
  # set :dump_errors, true      # Exception backtraces are written to STDERR (default for production/development)
  # set :show_exceptions, true  # Shows a stack trace in browser (default for development)
  # set :logging, true          # Logging in STDOUT for development and file for production (default only for development)
  # set :public, "foo/bar"      # Location for static assets (default root/public)
  # set :reload, false          # Reload application files (default in development)
  # set :default_builder, "foo" # Set a custom form builder (default 'StandardFormBuilder')
  # set :locale_path, "bar"     # Set path for I18n translations (default your_app/locales)
  # disable :sessions           # Disabled sessions by default (enable if needed)
  # disable :flash              # Disables rack-flash (enabled by default if Rack::Flash is defined)
  # layout  :my_layout          # Layout can be in views/layouts/foo.ext or views/foo.ext (default :application)

  ##
  # You can configure for a specified environment like:
  #
  #   configure :development do
  #     set :foo, :bar
  #     disable :asset_stamp # no asset timestamping for dev
  #   end
  #

  ##
  # You can manage errors like:
  #
  #   error 404 do
  #     render 'errors/404'
  #   end
  #
  #   error 505 do
  #     render 'errors/505'
  #   end
  #

  # Default Application Route
  get '/' do
    render :index
  end

  # Thank-you page
  get '/thank-you' do
    render :thank_you
  end

  get '/fundraising_status.json' do
    doc = Nokogiri::HTML(open("http://www.justgiving.com/teamsparklemotion"))
    @details = {}

    @details[:target] = doc.css("#donationInfo strong")[0].text
    @details[:raised] = doc.css("#donationInfo strong")[1].text
    @details[:target_clean] = @details[:target].scan(/\d+\,?\d+?\.\d{2}$/).first.gsub(',','')
    @details[:raised_clean] = @details[:raised].scan(/\d+\,?\d+?\.\d{2}$/).first.gsub(',','')

    @details.to_json
  end
end