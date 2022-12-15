import {  createSlice } from "@reduxjs/toolkit"
/* import { current } from "@reduxjs/toolkit" */


const chatSlice = createSlice({ 
name:"chat",
initialState: {privChatData:{userId:"", nickname:"", dbId:"", messages:[], isGrp:false}, privChatItems:[]}
,
reducers:{
    setChatUserData :(state,action) => //the private chat current data when starting
    {
        state.privChatData.userId = action.payload.userId 
        state.privChatData.nickname = action.payload.nickname
        state.privChatData.dbId = ""
        state.privChatData.messages = []
    },
    setResumePrivChat : (state,action) => {
        state.privChatData.userId = action.payload.userId 
        state.privChatData.nickname = action.payload.nickname
        state.privChatData.dbId = action.payload.dbId
        state.privChatData.messages = action.payload.messages
        state.privChatData.isGrp = action.payload.isGrp
    }
    ,
    setPrivChatDbId :(state,action) =>
    {
        state.privChatData.dbId = action.payload
    },
    addChatCurrMessages : (state,action) =>
    {
        state.privChatData.messages=[...state.privChatData.messages, action.payload]
    }
    ,
    addPrivChatItem :(state,action) =>
    {
        state.privChatItems=[action.payload,...state.privChatItems]
    }
    ,
    setPrivChatItems :(state,action) =>
    {
        state.privChatItems=action.payload
    }
    ,
    addPrivChatMessage :(state,action) => //add on data_priv_data, find db id and add the message to its list
    {
        let index = state.privChatItems.findIndex(item=>item.chatDbId===action.payload.chatDbId)
        if(index!==-1)
        {
            state.privChatItems[index].messages.push(action.payload.message) //todo:move the item to the top of the list
        let tempItem = state.privChatItems[index]
        state.privChatItems.splice(index,1)
        state.privChatItems=[tempItem,...state.privChatItems]
        }
        //state.privChatItems=[action.payload,...state.privChatItems]
    },
    removePrivChatItem :(state,action) =>
    {
        let index = state.privChatItems.findIndex(item=>item.chatDbId===action.payload)
        if(index!==-1)
        {
            state.privChatItems.splice(index,1)
        }
    }
    /* setEditData : (state,action) => {
            state.editData = action.payload
    } */
   
}
})

const {actions, reducer} = chatSlice
export const {setChatUserData,setPrivChatDbId,addChatCurrMessages, addPrivChatItem, setPrivChatItems,
    setResumePrivChat,addPrivChatMessage,removePrivChatItem} = actions
export default reducer