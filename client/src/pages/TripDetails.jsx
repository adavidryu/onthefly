import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import ActivityBtn from '../components/ActivityBtn';
import DestinationBtn from '../components/DestinationBtn';
import './TripDetails.css';

const TripDetails = ({ data = [] }) => {
    const { id } = useParams();
    const [activities, setActivities] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [trip, setTrip] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const result = data.find((item) => item.id === Number(id));
        setTrip(result ?? null);
    }, [data, id]);

    useEffect(() => {
        let isCurrent = true;

        const fetchActivities = async () => {
            const response = await fetch(`/api/activities/${id}`);
            if (!response.ok) {
                throw new Error(`Unable to load activities (${response.status})`);
            }
            const data = await response.json();
            if (isCurrent) setActivities(data);
        };

        const fetchDestinations = async () => {
            const response = await fetch(`/api/trip-destinations/destinations/${id}`);
            if (!response.ok) {
                throw new Error(`Unable to load destinations (${response.status})`);
            }
            const data = await response.json();
            if (isCurrent) setDestinations(data);
        };

        setError('');
        Promise.all([fetchActivities(), fetchDestinations()]).catch((fetchError) => {
            if (isCurrent) setError(fetchError.message);
        });

        return () => {
            isCurrent = false;
        };
    }, [id]);

    if (!trip) {
        return (
            <div className="out">
                {data.length === 0 ? <h3>Loading trip...</h3> : <h3>Trip not found.</h3>}
            </div>
        );
    }

    return (
        <div className="out">
            <div className="flex-container">
                <div className="left-side">
                    <h3>{trip.title}</h3>
                    <p>{`🗓️ Duration: ${trip.num_days} days`}</p>
                    <p>{`🛫 Depart: ${trip.start_date?.slice(0, 10)}`}</p>
                    <p>{`🛬 Return: ${trip.end_date?.slice(0, 10)}`}</p>
                    <p>{trip.description}</p>
                    <p>{`Total cost: ${trip.total_cost}`}</p>
                </div>

                <div
                    className="right-side"
                    style={{ backgroundImage: `url(${trip.img_url})` }}
                    role="img"
                    aria-label={trip.title}
                />
            </div>

            <div className="flex-container">
                <div className="activities">
                    <h3>Activities</h3>
                    {activities.length > 0 ? (
                        activities.map((activity) => (
                            <ActivityBtn
                                key={activity.id}
                                id={activity.id}
                                activity={activity.activity}
                                num_votes={activity.num_votes}
                            />
                        ))
                    ) : <p>No activities added yet.</p>}
                    <Link to={`/activity/create/${id}`}>
                        <button className="addActivityBtn">+ Add Activity</button>
                    </Link>
                </div>

                <div className="destinations">
                    <h3>Destinations</h3>
                    {destinations.length > 0 ? (
                        destinations.map((destination) => (
                            <DestinationBtn
                                key={destination.id}
                                id={destination.id}
                                destination={destination.destination}
                            />
                        ))
                    ) : <p>No destinations added yet.</p>}
                </div>
            </div>

            {error && <p role="alert">{error}</p>}
        </div>
    );
};

export default TripDetails;
