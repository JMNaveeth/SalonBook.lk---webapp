const http = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');
const app = require('./src/app');
const env = require('./src/config/env');
const BookingModel = require('./src/models/bookingModel');

const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: env.frontendUrl,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log(`[SOCKET CONNECTED] Client ID: ${socket.id}`);

  socket.on('join_room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Socket ${socket.id} joined room user_${userId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[SOCKET DISCONNECTED] Client ID: ${socket.id}`);
  });
});

// Make io accessible globally in req if needed
app.set('io', io);

// Auto-Expire Cron Job: Runs every hour
// Finds bookings where status = 'pending' AND auto_expire_at <= NOW()
cron.schedule('0 * * * *', async () => {
  console.log('[CRON] Running hourly auto-expire booking check...');
  try {
    const expiredBookings = await BookingModel.expirePendingBookings();
    console.log(`[CRON] Expired ${expiredBookings.length} pending bookings.`);
  } catch (err) {
    console.error('[CRON ERROR]', err);
  }
});

const PORT = env.port;
server.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`💈 SalonBook LK Backend Server active on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${env.frontendUrl}`);
  console.log(`=================================================`);
});
