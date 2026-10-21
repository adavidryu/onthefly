import { useState } from 'react';
import { useParams } from 'react-router';
import './CreateActivity.css'

const CreateActivity = () => {

    const [activity, setActivity] = useState({activity: "" })
    const [error, setError] = useState('')
    const {trip_id} = useParams();


    const handleChange = (event) => {
        const {name, value} = event.target;
        setActivity( (prev) => {
            return {
                ...prev,
                [name]:value,
            }
        })
    }
    
    const createActivity = async (event) => {
        event.preventDefault();

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(activity)
        }

        try {
            const response = await fetch('/api/activities/' + trip_id, options);
            if (!response.ok) {
                throw new Error(`Unable to create activity (${response.status})`);
            }

            window.location.href = '/';
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    return (
        <div>
            <center><h3>Add Activity</h3></center>
            <form>
                <label>Activity</label> <br />
                <input type="text" id="activity" name="activity" value={activity.activity} onChange={handleChange}/><br />
                <br/>

                <label>Trip ID</label><br />
                <input type="number" id="trip_id" name="trip_id" value={trip_id} readOnly/><br />
                <br/>

                <input type="submit" value="Submit" onClick={createActivity} />
                {error && <p role="alert">{error}</p>}
            </form>
        </div>
    )
}

export default CreateActivity