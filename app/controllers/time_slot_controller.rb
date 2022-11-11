class TimeSlotController < ApplicationController
  skip_before_action :verify_authenticity_token

  def suggested_timeslots
    puts params[:date]
    puts params[:interval]
    wanted_date = Time.at(params[:date].to_i / 1000).utc
    overlapping = Timeslot.include_time(wanted_date).maximum('end_date') # check if older reservation overlap and update the wanted date if yes
    wanted_date = overlapping unless overlapping.nil?
    @open_timeslots = []
    possible_start = wanted_date
    interval = params[:interval].to_i
    while @open_timeslots.length < 5
      possible_end = possible_start + interval.minutes
      if  Timeslot.include_time(possible_start).length == 0 && (
        Timeslot.include_time(possible_end).length == 0 || Timeslot.include_time(possible_start + interval.minutes).first.start_date == possible_end)
        @open_timeslots << Timeslot.new(start_date: possible_start, end_date: possible_end)
      end
      possible_start = possible_start + 15.minutes
    end

  end

  def create
    @timeslot = Timeslot.new(start_date: params[:start_date], end_date: params[:end_date])
    @timeslot.save!
    respond_to do |format|
      format.json { render action: 'show', status: :created }
    end
  end
end
