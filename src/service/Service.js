import { httpClient } from "../config/Axioshelper"

 export const createroomapi = async (roomdetial)=>{
     const response = await httpClient.post('/rooms',roomdetial,{
        headers:{
       "Content-Type":"text/plain"
        },
     })
     return response.data
 }
 export const joinroomapi =  (roomName) => {
    try {
      const response = httpClient.get(`/rooms/${roomName}`);
      return response// Return the room ID if the request is successful
    } catch (error) {
      throw new Error(`Failed to join the room: ${error.message}`);
    }
  };
 

export const getmessages = async (roomName,size=50,page=0)=>{
  try {
    const response = await httpClient.get(`/rooms/${roomName}/messages?size=${size}&pages=${page}`);
    return response.data// Return the room ID if the request is successful
  } catch (error) {
    throw new Error(`Failed to join the room: ${error.message}`);
  }
}