# frozen_string_literal: true

json.timeslots do
  json.partial! 'timeslot', collection: @timeslots, as: :timeslot
end
