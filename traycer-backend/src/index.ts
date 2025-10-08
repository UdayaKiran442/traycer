import { Hono } from 'hono';

import documentRoute from './routes/document.route'
import planRoute from './routes/plan.route'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/documents', documentRoute);
app.route('/plan', planRoute);

export default app
