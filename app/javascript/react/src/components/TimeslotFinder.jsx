import React, {useState} from 'react';
import DatePicker from 'react-datepicker'

const TimeslotFinder = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0,0,0,0)
    const [startDate, setStartDate] = useState(tomorrow.getTime());
    const [interval, setInterval] = useState(15);
    const [suggestions, setSuggestions] = useState([]);

    const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
    const handleSelectChange = (event) => {
        const newInterval = event.target.value
        setInterval(newInterval);
        getSuggestions(startDate, newInterval);
    }

    const handleCalendarChange = (date) => {
        const newDate = date.getTime()
        if(date > new Date()) {
            getSuggestions(newDate, interval);
        } else {
            setSuggestions([]);
        }
        setStartDate(newDate)
    }

    const handleSubmit = async () => {
        try{
            await fetch('/timeslots', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({start_date: suggestions[selectedTimeIndex].start_date, end_date: suggestions[selectedTimeIndex].end_date})
            });
        }catch(error) {
        }
    }

    const onTimePick = (event) => {
        setSelectedTimeIndex(event.target.value)
    }

    async function getSuggestions(date,interval) {

        try{
            const response = await fetch('/suggested_timeslots?date=' + date + '&interval=' + interval);
            const body = await response.json();
            setSuggestions(body.timeslots);
        }catch(error) {
            setSuggestions([]);
        }

    }

    const suggestionsElements = suggestions.map((suggestion, index) => {
        return (<div className="form-check" key={index}>
            <input
                type="radio"
                value={index}
                className="form-check-input"
                id={`suggestion-${index}`}
                checked={index == selectedTimeIndex}
                onChange={onTimePick}
            />
            <label className="form-check-label" htmlFor={`suggestion-${index}`}>
                {new Date(Date.parse(suggestion.start_date)).toLocaleString()}-{new Date(Date.parse(suggestion.end_date)).toLocaleString()}
            </label>
        </div>)
    });

    return (
        <form onSubmit={handleSubmit}>
                <div className="container">
                    <div className="row">
                        <div className="col col-md-8">

                            <div className="form-group">
                                <label htmlFor="calendar">Possible Start</label>
                        <DatePicker
                            id="calendar"
                            selected={startDate}
                            onChange={handleCalendarChange}
                            showTimeSelect
                            minDate={new Date()}
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="MMMM d, yyyy HH:mm "
                        />
                        </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col col-md-8">
                            <div className="form-group">
                                <label htmlFor="calendar">Needed time (in minutes):</label>
                            <select className="form-select" aria-label="Default select example" onChange={handleSelectChange}>
                                <option>15</option>
                                <option>30</option>
                                <option>45</option>
                                <option>60</option>
                                <option>75</option>
                                <option>90</option>
                                <option>105</option>
                                <option>120</option>
                            </select>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-md-8 radio">
                            <div className="form-group">
                                <label htmlFor="calendar">possible timeslot:</label>
                            {suggestionsElements}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-md-8">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </div>
                </div>
        </form>
       )
}

export default TimeslotFinder
