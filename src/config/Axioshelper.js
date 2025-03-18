import axios from "axios";
export const baseurL= 'http://localhost:8080'
export const httpClient = axios.create({
baseURL:baseurL
})