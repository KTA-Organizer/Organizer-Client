// export const API_URL = 'https://ktatje.herokuapp.com/api'
export const API_URL = process.env.NODE_ENV === "production" ? "/api" : 'http://localhost:3000/api'
