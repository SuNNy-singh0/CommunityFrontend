import axios from "axios";
export const baseurL = '/api/'
export const httpClient = axios.create({
baseURL:baseurL
})