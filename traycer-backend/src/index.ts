import { Hono } from 'hono'
import documentRoute from './routes/document.route'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/documents', documentRoute);

export default app
