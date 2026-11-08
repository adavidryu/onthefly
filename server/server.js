import express from 'express'
import cors from 'cors'
import tripRoutes from './routes/trips.js'
import activityRoutes from './routes/activities.js'
import destinationRoutes from './routes/destinations.js'
import tripDestinationRoutes from './routes/trip_destinations.js'
import passport from 'passport'
import session from 'express-session'
import { GitHub } from './config/auth.js'
import authRoutes from './routes/auth.js'

passport.use(GitHub)

passport.serializeUser((user, done) => {
    const { accesstoken, ...sessionUser } = user
    done(null, sessionUser)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

const app = express()
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true'
if (isProduction) {
    app.set('trust proxy', 1)
}
app.use(session({
    secret: 'codepath',
    resave: false,
    saveUninitialized: true,
    cookie: isProduction ? { sameSite: 'none', secure: true } : {}
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(cors({
    origin: 'https://client-d337.onrender.com',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true
}))
app.use('/auth', authRoutes)

app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">✈️ On the Fly API</h1>')
})

app.use('/api/trips', tripRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/destinations', destinationRoutes)
app.use('/api/trip-destinations', tripDestinationRoutes)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})