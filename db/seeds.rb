# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
puts "Seeding #{Rails.env} environment with sample data ..."
today = Date.today.strftime('%Y-%m-%d')
yesterday = Date.yesterday.strftime('%Y-%m-%d')
tomorrow = Date.tomorrow.strftime('%Y-%m-%d')
Timeslot.create([
                  { start_date: "#{today}T20:00:00.000Z", end_date: "#{today}T22:30:00.000Z" },
                  {  start_date: "#{yesterday}T23:00:00.000Z", end_date: "#{today}T06:00:00.000Z" },
                  {  start_date: "#{today}T10:15:00.000Z", end_date: "#{today}T10:45:00.000Z" },
                  {  start_date: "#{today}T13:55:00.000Z", end_date: "#{today}T14:30:00.000Z" },
                  {  start_date: "#{tomorrow}T10:00:00.000Z", end_date: "#{tomorrow}T20:00:00.000Z" },
                  {  start_date: "#{today}T09:00:00.000Z", end_date: "#{today}T10:00:00.000Z" },
                  {  start_date: "#{today}T11:30:00.000Z", end_date: "#{today}T13:00:00.000Z" },
                  {  start_date: "#{today}T13:00:00.000Z", end_date: "#{today}T13:10:00.000Z" }
                ])
puts '...seeding finished!'
