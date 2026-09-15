import axios from 'axios'

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  // Array query params (e.g. features, exclude_ids) must serialize as repeated
  // keys (?features=Pool&features=Gym) to match FastAPI's List[str] parsing —
  // axios's default bracket-notation (features[]=...) is silently ignored by it.
  paramsSerializer: { indexes: null },
})

export default client
