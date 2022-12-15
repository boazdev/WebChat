import axios from "axios";
const baseUrl="http://localhost:5001/login"


export const loginWebchatWs = async (loginObj) => {
    try {
        let resp = await axios.post(baseUrl,loginObj) 
    return resp 
    } catch (error) {
        /* console.log("login error")
        console.log(error.response.data.toString()) */
        return error.response
    }
    
    

}

export const createUserWs = async (userObj) => {
    try {
        let resp = await axios.post("http://localhost:5001/users",userObj) 
    return resp 
    } catch (error) {
        return error.response
    }
       
}

export function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}