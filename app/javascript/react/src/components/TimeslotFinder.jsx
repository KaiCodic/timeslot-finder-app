import React, {useState} from 'react';
import DatePicker from 'react-datepicker'
import {ReactNotifications, Store} from 'react-notifications-component'

const TimeslotFinder = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0,0,0,0)
    const [startDate, setStartDate] = useState(tomorrow.getTime());
    const [interval, setInterval] = useState(15);
    const [suggestions, setSuggestions] = useState([]);
    const [existingTimeslots, setExistingTimeslots] = useState([]);

    const [selectedTimeIndex, setSelectedTimeIndex] = useState();

    const loadData = async () => {
        const response = await fetch('/timeslots');
        const body = await response.json();
        setExistingTimeslots(body.timeslots);
    }

    React.useEffect(() => {
        loadData();
    }, []);

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

    const handleSubmit = async (e) => {
        try{
            e.preventDefault();
            const result = await fetch('/timeslots', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({start_date: suggestions[selectedTimeIndex].start_date, end_date: suggestions[selectedTimeIndex].end_date})
            });
            if (result.status !== 201) {
                throw new Error("Something went wrong");
            }
            loadData();

            Store.addNotification({
                title: "Timeslot reserved!",
                message: "Timeslot was successfully created.",
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: [],
                animationOut: [],
                dismiss: {
                    duration: 3000
                }
            });

        }catch(error) {
            Store.addNotification({
                title: "Something went wrong",
                message: "Please try again",
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: [],
                animationOut: [],
                dismiss: {
                    duration: 3000
                }
            });
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
        <div>
            <ReactNotifications/>
        <form onSubmit={handleSubmit}>
                <div className="container">
                    <div className="row">
                        <div className="col col-md-6" style={{height: '200px'}}>

                            <div className="form-group" style={{paddingTop: '20px'}}>
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
                            <div className="form-group" style={{paddingTop: '20px'}}>
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
                        {suggestionsElements.length > 0 ?
                            (<div className="col col-md-6 radio" style={{paddingTop: '20px'}}>
                            <div className="form-group">
                                <label htmlFor="calendar">Available timeslots:</label>
                                {suggestionsElements}
                            </div>
                        </div>):null}

                    </div>
                    <div className="row">
                        <div className="col col-md-6">
                            <button type="submit"
                                    disabled={selectedTimeIndex == undefined}
                                    className="btn btn-primary"
                            >Submit</button>
                        </div>
                    </div>
                </div>
        </form>
        <div className="container">
            <table className="table fixed-table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Start date</th>
                    <th scope="col">End date</th>
                </tr>
                </thead>
                <tbody>
                {existingTimeslots.map((s, index) => {
                    return (
                        <tr key={index}>
                            <th scope="row">{index}</th>
                            <td>{new Date(Date.parse(s.start_date)).toLocaleString()}</td>
                            <td>{new Date(Date.parse(s.end_date)).toLocaleString()}</td>
                        </tr>)
                })}

                </tbody>
            </table>
        </div>
        </div>
       )
}

export default TimeslotFinder
