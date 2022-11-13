# frozen_string_literal: true

Rails.application.routes.draw do
  get '/' => 'root#index', defaults: { format: 'html' }
  get '/suggested_timeslots' => 'time_slot#suggested_timeslots', defaults: { format: 'json' }
  get '/timeslots' => 'time_slot#index', defaults: { format: 'json' }
  post '/timeslots' => 'time_slot#create', defaults: { format: 'json' }
end
