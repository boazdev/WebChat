import {  createSlice } from "@reduxjs/toolkit"
/* import { current } from "@reduxjs/toolkit" */


const userSlice = createSlice({ 
name:"user",
initialState: {userId:"",nickname:"", token:"", nicknamesDict:{} }
,
reducers:{
    loginAction :(state,action) =>
    {
        state.nickname = action.payload.nickname
        state.userId = action.payload.userId
        state.token = action.payload.token
    },
    logoutAction : (state,action) =>
    {
        state.nickname = ""
        state.userId = ""
        state.token = ""
    }
    ,
    setNicknamesDict : (state,action) =>
    {
       state.nicknamesDict=action.payload
    }

   
}
})

const {actions, reducer} = userSlice
export const {loginAction,logoutAction,setNicknamesDict} = actions
export default reducer