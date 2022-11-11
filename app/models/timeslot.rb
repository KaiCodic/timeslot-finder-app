class Timeslot < ApplicationRecord

  scope :start_date_after_or_equal, ->(time) { where('start_date >= ?', time) }
  scope :include_time, ->(time) { where('start_date <= ? and end_date > ?', time, time) }
end
