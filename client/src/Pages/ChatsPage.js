import { Box, Button, Grid, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import AppChat from '../AppChat'
import { WText } from '../components/WText'
import SendIcon from '@mui/icons-material/Send';
import CreateIcon from '@mui/icons-material/MessageRounded'
import { ChatItem } from '../components/ChatItem';
import { BorderColor } from '@mui/icons-material';
import Person2Icon from '@mui/icons-material/Person2';
import { useDispatch, useSelector } from 'react-redux';
import { getWebChatWS, getWebChatWSParams } from '../Utils/webchatWsCRUD';
import Select from "react-select";
import { borderColor } from '@mui/system';
import { Navigate, useNavigate } from 'react-router-dom';
import { setChatUserData, setPrivChatDbId, setPrivChatItems, setResumePrivChat } from '../Utils/chatSlice';
import { setNicknamesDict } from '../Utils/userSlice';

export const ChatsPage = () => {
  const storeData = useSelector(state=>state.user)
  const storeChatData = useSelector(state=>state.chat)
  useEffect(
    () => {
      dispatch(setPrivChatDbId(""))
        const fetchIt = async () => {
            //console.log(storeData)
            let resp = await getWebChatWS("users",storeData.token)
            /* console.log("users data:")
            console.log(resp.data) */
            let tempdata= resp.data.data
            if (resp.status===200)
              {
                setUsersList(resp.data.data)
                let tmpUsersList= resp.data.data
                resp = await getWebChatWS("blacklists/"+storeData.userId,storeData.token)
                
                if (resp.status===200)
                {
                  let blockList= resp.data.data
                  let filterList = tmpUsersList.filter(item=>blockList.findIndex(item2=>item2.userIdBlock===item.userId)===-1 && item.userId!==storeData.userId)
                  setFilteredUsers(filterList)
                }
            }
            let tmpUsersDict={}
            tempdata.forEach(item => {
              tmpUsersDict[item.userId]=item.nickname
            });
            tmpUsersDict["server"] = "Group Message"
            tmpUsersDict["serverError"] ="Error"
            setUsersDict(tmpUsersDict)
            dispatch(setNicknamesDict(tmpUsersDict))
            
              
        };
        fetchIt()
    },[]
)
  const [usersDict,setUsersDict] = useState({})
  const [isStart,setIsStart] =useState(false)
  const [usersList,setUsersList] = useState([])
  const [filteredUsers,setFilteredUsers] = useState([])
  const [chatWithObj, setChatWithObj] = useState({userId:"",nickname:""})
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const startChatCallback=(dbId) =>
  {
    console.log("will resume private chat with db id: " + dbId)
    let privChatData = storeChatData.privChatItems.find(item=>item.chatDbId===dbId)
    console.log("and his data:")
    console.log(privChatData)
    if(privChatData.isGrp)
      dispatch(setResumePrivChat({userId:"",nickname:privChatData.groupName,
      dbId:dbId,messages:privChatData.messages, isGrp:privChatData.isGrp}))
    else
      dispatch(setResumePrivChat({userId:privChatData.chatWithId, nickname:usersDict[privChatData.chatWithId],
      dbId:dbId,messages:privChatData.messages,isGrp:privChatData.isGrp}))

    navigate("/homepage/privatechat")
  }
  const privChatCallback = (dbId) => {
    console.log("will resume private chat with db id: " + dbId)
    let privChatData = storeChatData.privChatItems.find(item=>item.chatDbId===dbId)
    console.log("and his data:")
    console.log(privChatData)
    dispatch(setResumePrivChat({userId:privChatData.chatWithId, nickname:usersDict[privChatData.chatWithId],
    dbId:dbId,messages:privChatData.messages}))
   // dispatch(setPrivChatDbId(dbId))
    navigate("/homepage/privatechat")
  }

  const groupChatCallback = (dbId) => {
    console.log("will resume group chat with db id: " + dbId)
    let groupChatData = storeChatData.privChatItems.find(item=>item.chatDbId===dbId)
    console.log("and its data:")
    console.log(groupChatData)
    dispatch(setResumePrivChat({userId:"",nickname:groupChatData.groupName,
    dbId:dbId,messages:groupChatData.messages}))
   // dispatch(setPrivChatDbId(dbId))
    navigate("/homepage/privatechat")
  }

  const startChatHandler = () =>
  { 
    console.log("chat with obj")
    console.log(chatWithObj)
    
    dispatch(setChatUserData(chatWithObj))
    navigate("/homepage/privatechat")
    //navigate to private chat page, when message sent, emit chat message with both users id's
  }
  return (
    
        <>
        <Grid container direction="row" >
        {/* <Grid item>
            <Person2Icon sx={{ fontSize: "35px" }}/>
          </Grid>
          <Grid item>
          <Typography align="left" variant="h6" color="white" mr="8px">
        {storeData.nickname}
      </Typography>
          </Grid> */}
          <Grid item>
            {!isStart&&
              <Button variant='outlined' endIcon={<CreateIcon />} onClick={()=>setIsStart(true)}>Start a new Chat</Button>}
              {isStart && <Select options={filteredUsers.map(item=>{return{value:item.userId, label:item.nickname}})} placeholder="Select user to chat"
              onChange={(e)=>setChatWithObj({userId:e.value, nickname: e.label})}    styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  width:"200px", backgroundColor:"#39191b" , 
                }),
                singleValue: (provided, state) => ({
                  ...provided,
                  color: "white",
                  fontSize: state.selectProps.myFontSize
                }),
                input: (provided, state) => ({
                  ...provided,
                  color: "white",
                  fontSize: state.selectProps.myFontSize
                }),
              }}/>  }
               
          </Grid>
          <Grid item sx={{ml:"5px"}}>
          {isStart &&<Button variant='outlined' endIcon={<CreateIcon />} onClick={startChatHandler}>Enter Chat</Button>}
          </Grid>

          
        </Grid>
        
        <Box /* height="380px" */ sx={{/* backgroundColor:"green", padding:"1px" , */maxHeight:"400px", /* overflowY:"scroll" */}}>
        
        {storeChatData.privChatItems.map(item=> <ChatItem key={ item.chatDbId } 
            title={item.isGrp? item.groupName:usersDict[item.chatWithId]} date={item.messages[item.messages.length-1].date} 
            lastMessage={usersDict[item.messages[item.messages.length-1].userId] +": " +item.messages[item.messages.length-1].content} isGrp={item.isGrp}
             callback={()=>startChatCallback(item.chatDbId)}/>)} 
             
             </Box>
        
       </>
    
  )
}
