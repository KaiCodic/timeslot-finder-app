# frozen_string_literal: true

class CreateTimeslots < ActiveRecord::Migration[7.0]
  def change
    create_table :timeslots do |t|
      t.datetime :start_date, null: false
      t.datetime :end_date, null: false
      t.timestamps
    end
  end
end
