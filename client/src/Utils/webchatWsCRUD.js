import axios from "axios";
import { useNavigate } from "react-router-dom";
const wsUrl = "http://localhost:5001/"


export const getWebChatWS = async (path,token) => {
   // const navigate= useNavigate()
    try {
            let resp = await axios.get(wsUrl+path,{headers: {
                "x-access-token": token,
               "Content-Type":"application/json"
               
            }})
            return resp 
        }
        
    
    
     catch (error) {
        console.log("get request error")
        console.log(error)
        //navigate("/error/"+error.data)
        return error.response
    }
}

export const getWebChatWSParams = async (path,params,token) => {
    // const navigate= useNavigate()
     try {
           /*  console.log("params:" )
            console.log(params) */
             let resp = await axios.get(wsUrl+path,{params:params,headers: {
                 "x-access-token": token,
                "Content-Type":"application/json"
                
             }})
             return resp 
         }
         
     
     
      catch (error) {
         console.log("get request error")
         console.log(error)
         //navigate("/error/"+error.data)
         return error.response
     }
 }

export const postWebChatWS = async (path,obj,token) => {
    try {
            let resp = await axios.post(wsUrl+path,obj,{headers: {
                "x-access-token": token,
               "Content-Type":"application/json"
            }})
            return resp 
        }
     catch (error) {
        console.log("post request error")
        console.log(error)
        return error.response
    }
}

export const updateWebChatWS = async (path,id,obj,token) => {
    try {
            let resp = await axios.put(wsUrl+path+"/"+id,obj,{headers: {
                "x-access-token": token,
               "Content-Type":"application/json"
            }})
            return resp 
        }
     catch (error) {
        console.log("update request error")
        console.log(error)
        return error.response
    }
}

export const deleteWebChatWS = async (path,id,token) => {
    try {
            let resp = await axios.delete(wsUrl+path+'/'+id,{headers: {
                "x-access-token": token,
               "Content-Type":"application/json"
            }})
            return resp 
        }
     catch (error) {
        console.log("update request error")
        console.log(error)
        return error.response
    }
}