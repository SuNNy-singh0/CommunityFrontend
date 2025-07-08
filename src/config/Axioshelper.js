import axios from "axios";
export const baseurL= 'https://buyproduct4u.org'
export const httpClient = axios.create({
baseURL:baseurL
})