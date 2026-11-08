import { useParams } from 'react-router';
import { useState } from 'react';
import './Card.css'


const AddTripOptionCard = (props) =>  {
  const {destination_id} = useParams();
  const [error, setError] = useState('')

  const addToTrip = async (event) => {
    event.preventDefault();

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({trip_id: props.id, destination_id: destination_id}) 
    }

    try {
      const response = await fetch(`${props.api_url}/api/trip-destinations`, options)
      if (!response.ok) throw new Error(`Unable to add destination (${response.status})`)
      window.location.href = '/'
    } catch (requestError) {
      setError(requestError.message)
    }
}

  return (
      <div className="Card" style={{ backgroundImage:`url(${props.img_url})`}} >
        <div className="card-info">
          <h2 className="title">{props.title}</h2>
          <p className="description">{props.description}</p>
          <button className="addToTrip" onClick={addToTrip}>+ Add to Trip</button>
          {error && <p role="alert">{error}</p>}
        </div>
      </div>
  );
};

export default AddTripOptionCard;