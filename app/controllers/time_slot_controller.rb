class TimeSlotController < ApplicationController
  skip_before_action :verify_authenticity_token

  def suggested_timeslots
    puts params[:date]
    puts params[:interval]
    wanted_date = Time.at(params[:date].to_i / 1000).utc
    overlapping = Timeslot.include_time(wanted_date).maximum('end_date') # check if older reservation overlap and update the wanted date if yes
    wanted_date = overlapping unless overlapping.nil?
    @timeslots = []
    possible_start = wanted_date
    interval = params[:interval].to_i
    while @timeslots.length < 5
      possible_end = possible_start + interval.minutes
      next_timeslots = Timeslot.end_date_after(possible_start).order(:start_date).limit(1)
      if next_timeslots.length > 0
        next_timeslot = next_timeslots.first
        if !Timeslot.overlaps(possible_start, possible_end, next_timeslot.start_date, next_timeslot.end_date)
          @timeslots << Timeslot.new(start_date: possible_start, end_date: possible_end)
        end
      else
        @timeslots << Timeslot.new(start_date: possible_start, end_date: possible_end)
      end

      possible_start = possible_start + 15.minutes
    end
    respond_to do |format|
      format.json { render action: 'index', status: :ok }
    end
  end

  def index
    @timeslots = Timeslot.order(:start_date).all.to_a
    respond_to do |format|
      format.json { render action: 'index', status: :ok }
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
