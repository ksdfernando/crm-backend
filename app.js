const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // ADD THIS
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // React app origin
  credentials: true // ALLOW COOKIES
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.listen(3001, () => console.log('Server running on port 5000'));

app.get('/', (req, res) => {
  res.json("CRM Backend Running");
});

module.exports = app; 