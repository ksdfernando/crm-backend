// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser'); // ADD THIS
// const userRoutes = require('./routes/user.routes');
// const authRoutes = require('./routes/auth.routes');
// const leadRoutes = require('./routes/lead.routes');
// const customerRoutes = require('./routes/customer.routes');
// const ticketRoutes = require('./routes/ticket.routes');
// const taskRoutes = require('./routes/task.routes');
// const app = express();
// app.use(cors({
//   origin: 'http://localhost:3000', // React app origin
//   credentials: true // ALLOW COOKIES
// }));
// app.use(express.json());
// app.use(cookieParser());

// app.use('/api', userRoutes);
// app.use('/api', authRoutes);
// app.use('/api', customerRoutes);
// app.use('/api', leadRoutes);
// app.use('/api', ticketRoutes);
// app.use('/api', taskRoutes);
// app.listen(3001, () => console.log('Server running on port 3001'));

// app.get('/', (req, res) => {
//   res.json("CRM Backend Running");
// });

// module.exports = app; 


// aws aws


const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const leadRoutes = require('./routes/lead.routes');
const customerRoutes = require('./routes/customer.routes');
const ticketRoutes = require('./routes/ticket.routes');
const taskRoutes = require('./routes/task.routes');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', customerRoutes);
app.use('/api', leadRoutes);
app.use('/api', ticketRoutes);
app.use('/api', taskRoutes);

app.get('/health', (req, res) => {
  res.json("CRM Backend Running");
   res.status(200).send('OK');
});

module.exports = app;
