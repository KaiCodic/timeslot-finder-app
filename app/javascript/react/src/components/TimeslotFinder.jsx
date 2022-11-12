import React, {useState} from 'react';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

const TimeslotFinder = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0,0,0,0)
    const [startDate, setStartDate] = useState(tomorrow);
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
            const response = await fetch('/timeslots', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({start_date: suggestions[selectedTimeIndex].start_date, end_date: suggestions[selectedTimeIndex].end_date})
            });
            console.log(await response.json());
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
        return (<label key={index}>
            <input
                type="radio"
                value={index}
                checked={index == selectedTimeIndex}
                onChange={onTimePick}
            /> {new Date(Date.parse(suggestion.start_date)).toLocaleString()}-{new Date(Date.parse(suggestion.end_date)).toLocaleString()}</label>)
        })

    return (

        <form onSubmit={handleSubmit}>
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col col-md-8">
                        <h2>Possible Start</h2>

                        <DatePicker
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

                    <div className="row">
                        <div className="col col-md-4">
                        <label className="form-label">
                            <h2>Needed time in minutes</h2>
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
                        </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-md-4 radio">
                            {suggestionsElements}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-md-8">
                            <button type="submit" className="btn btn-primary btn-lg btn-danger">Submit</button>
                        </div>
                    </div>
                </div>
            </section>
        </form>
       )
}

export default TimeslotFinder
