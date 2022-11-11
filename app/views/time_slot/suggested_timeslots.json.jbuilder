# frozen_string_literal: true

json.timeslots do
  json.partial! 'timeslot', collection: @open_timeslots, as: :timeslot
end
