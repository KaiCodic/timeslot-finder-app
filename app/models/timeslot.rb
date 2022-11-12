class Timeslot < ApplicationRecord

  scope :end_date_after, ->(time) { where('end_date > ?', time) }
  scope :include_time, ->(time) { where('start_date <= ? and end_date > ?', time, time) }
  scope :start_date_after, ->(time) { where('start_date > ? ', time) }

  def self.overlaps(start_1,end_1, start_2, end_2)
    !(start_1 >= end_2 || end_1 <= start_2)
  end
end
