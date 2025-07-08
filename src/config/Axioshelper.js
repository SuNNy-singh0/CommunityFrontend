import axios from "axios";
export const baseurL= 'http://13.201.100.143:8080'
export const httpClient = axios.create({
baseURL:baseurL
})