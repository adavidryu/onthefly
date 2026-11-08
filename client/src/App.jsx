import './App.css';
import { useState, useEffect } from 'react';
import { Link, useRoutes } from 'react-router'
import ReadTrips from './pages/ReadTrips'
import CreateTrip from './pages/CreateTrip'
import EditTrip from './pages/EditTrip'
import CreateDestination from './pages/CreateDestination';
import ReadDestinations from './pages/ReadDestinations'
import TripDetails from './pages/TripDetails'
import CreateActivity from './pages/CreateActivity';
import AddToTrip from './pages/AddToTrip';
import Login from './pages/Login';
import Avatar from './components/Avatar';

const API_URL = import.meta.env.PROD ? 'https://server-on0w.onrender.com' : ''

const App = () => {
  
  const [trips, setTrips] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [user, setUser] = useState(null);

  const fetchDestinations = async () => {
    const response = await fetch(`${API_URL}/api/destinations`);
    if (!response.ok) throw new Error(`Unable to load destinations (${response.status})`);
    const data = await response.json();
    setDestinations(data);
  }

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`${API_URL}/auth/login/success`, { credentials: 'include' })
      const json = await response.json()
      setUser(json.user)
    }

    const fetchTrips = async() => {
      const response = await fetch(`${API_URL}/api/trips`);
      const data = await response.json();
      setTrips(data);
    }

    getUser();
    fetchTrips().catch(console.error);
    fetchDestinations().catch(console.error);
  }, []);

  const logout = async () => {
    const url = `${API_URL}/auth/logout`
    await fetch(url, { credentials: 'include' })
    window.location.href = '/'
  }

  const login = <Login api_url={API_URL} />
  const isAuthenticated = user && user.id

  // Sets up routes
  let element = useRoutes([
    {
      path: "/",
      element: isAuthenticated ? <ReadTrips user={user} data={trips} /> : login
    },
    {
      path:"/trip/new",
      element: isAuthenticated ? <CreateTrip user={user} api_url={API_URL} /> : login
    },
    {
      path:"/edit/:id",
      element: isAuthenticated ? <EditTrip user={user} data={trips} api_url={API_URL} /> : login
    },
    {
      path:"/destinations",
      element: isAuthenticated ? <ReadDestinations user={user} data={destinations} /> : login
    },
    {
      path:"/trip/get/:id",
      element: isAuthenticated ? <TripDetails user={user} data={trips} api_url={API_URL} /> : login
    },
    {
      path:"/destination/new",
      element: isAuthenticated ? <CreateDestination user={user} api_url={API_URL} refreshDestinations={fetchDestinations} /> : login
    },
    {
      path:"/activity/create/:trip_id",
      element: isAuthenticated ? <CreateActivity user={user} api_url={API_URL} /> : login
    },
    {
      path:"/destinations/add/:destination_id",
      element: isAuthenticated ? <AddToTrip user={user} data={trips} api_url={API_URL} /> : login
    }
  ]);

  
  return ( 

    <div className="App">
      {
        isAuthenticated ?
          <div className="header">
            <h1>On The Fly ✈️</h1>
            <Link to="/"><button className="headerBtn">Explore Trips</button></Link>
            <Link to="/destinations"><button className="headerBtn">Explore Destinations</button></Link>
            <Link to="/trip/new"><button className="headerBtn"> + Add Trip </button></Link>
            <Link to="/destination/new"><button className="headerBtn"> + Add Destination </button></Link>
            <button onClick={logout} className="headerBtn">Logout</button>
            <Avatar className="avatar" user={user} />
          </div>
        : <></>
      }
      {element}
    </div>

  );
}

export default App;