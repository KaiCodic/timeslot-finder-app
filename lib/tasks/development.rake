# frozen_string_literal: true

require_relative './development/postgres'

namespace :dev do
  include Development::Postgres


  desc 'Reset everything and create everything new'
  task :setup do
    create_postgres
  end
end
