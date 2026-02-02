import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample route for health check
app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy');
});
app.get('/', (req, res) => {
  res.status(200).send('Server is running...');
});

import chatRouter from './src/routers/chat.router.js';
app.use('/api', chatRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});