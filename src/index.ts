import express from 'express';
import cors from 'cors';
import registerRouter from './routes/register';

const app = express();

app.use(cors());
app.use('/api', registerRouter);

app.listen(4000, () => {
  console.log('Service A running at http://localhost:4000');
});
