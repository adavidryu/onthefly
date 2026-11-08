import {useState} from 'react';
import './ActivityBtn.css'

const ActivityBtn = (props) =>  {

  const [num_votes, setNumVotes] = useState(props.num_votes)
  const [error, setError] = useState('')

  const updateCount = async () => {
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({num_votes: num_votes + 1})
    }

    try {
      const response = await fetch(`${props.api_url}/api/activities/${props.id}`, options)
      if (!response.ok) throw new Error(`Unable to vote (${response.status})`)
      setNumVotes((num_votes) => num_votes + 1)
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <>
      <button className='activityBtn' id={props.id} onClick={updateCount}>
        {props.activity} <br/> {'△ ' + num_votes + ' Upvotes' }
      </button>
      {error && <p role="alert">{error}</p>}
    </>
  )

}

export default ActivityBtn;
