import axios from "axios";
export const baseurL= 'https://asliengineers.com/'
export const httpClient = axios.create({
baseURL:baseurL
})