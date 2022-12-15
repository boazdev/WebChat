import React, { useEffect, useRef, useState } from 'react'
import Person2Icon from '@mui/icons-material/Person2';
import { ArrowBack } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import PeopleIcon from '@mui/icons-material/People';
import { useSelector } from 'react-redux';
import { Box,Button,Grid, TextField, Typography } from '@mui/material';
import { color } from '@mui/system';
import { ChatMessage, ChatMessageLeft, ChatMessageRight } from '../components/ChatMessage';
import { useNavigate, useOutletContext } from "react-router-dom";

export const StartPrivChat = () => {
  const [isStart,setIsStart]=useState(false)
  const [currMessage,setCurrMessage] = useState("")
  const userStoreData = useSelector(state=>state.user)
  const chatStoreData = useSelector(state=>state.chat)
  const [socketInstance] = useOutletContext();
  const navigate = useNavigate()
  const bottomRef = useRef(null);
  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [chatStoreData.privChatData.messages]);

  const isChatStarted = () =>
  {
    return chatStoreData.privChatData.dbId!=="" 
  }
  const sendClickHandler = () => {
      /* console.log("curr message : " + currMessage + "userId:" + userStoreData.userId)
      console.log("send message to : userid: " + chatStoreData.privChatData.userId +
      "his nickname: " + chatStoreData.privChatData.nickname)
     console.log(chatStoreData) */
     
     let sendObj={userIdFrom:userStoreData.userId, userIdTo:chatStoreData.privChatData.userId, message:currMessage}
     if (isChatStarted())
     {
      sendObj["chatDbId"] = chatStoreData.privChatData.dbId
      console.log("sending message with dbId: "+ chatStoreData.privChatData.dbId)
      let dataType = chatStoreData.privChatData.isGrp? "data_grp_chat" : "data_priv_chat"
      socketInstance.emit(dataType,sendObj)
     }
     else
     {
      socketInstance.emit("start_priv_chat",sendObj)
     }
     setCurrMessage("");
  }
  return (
    <>
    <Box>
        <Grid container direction="row">
        <Grid item alignSelf={"center"}>
            <ArrowBack color="info" sx={{ fontSize: "25px",mt:"4px", cursor:"pointer" }} onClick={()=>navigate("/homepage/chats")}/>
          </Grid>
          <Grid item alignContent='stretch'>
            {chatStoreData.privChatData.isGrp?<PeopleIcon color="info" sx={{ fontSize: "25px",mt:"4px", mr:"2px" }}/>:<Person2Icon color="info" sx={{ fontSize: "25px",mt:"4px" }}/>}
          </Grid>
          <Grid item>
          <Typography align="left" variant="h6" color="white" mr="8px">
        {chatStoreData.privChatData.nickname}
      </Typography>
          </Grid>
    
          

          
        </Grid>
        <Box height="420px" sx={{backgroundColor:"green", padding:"1px" ,overflowY:"scroll"}}>
        
        {chatStoreData.privChatData.messages.map((item,index)=>item.userId===userStoreData.userId? 
        <ChatMessageRight content={item.content} date={item.date} key={index}/>:
        item.userId.startsWith("server")?<ChatMessageLeft content={item.content} date={item.date} key={index} bgcolor="gray"/>
        :<ChatMessageLeft content={userStoreData.nicknamesDict[item.userId] + ": "  + item.content} date={item.date} key={index} bgcolor="black"/>)}
        <div ref={bottomRef}></div>
        </Box>
       
        <Grid container direction="row" alignContent={'start'}>
          <Grid item>
            <TextField margin="normal"
                  required
                  sx={{width:"430px", input: { color: 'white' },backgroundColor:"black"}} placeholder="Type message here" 
                   value={currMessage} onChange={(e)=>setCurrMessage(e.target.value)}></TextField></Grid>
          <Grid item>
          <Button variant="contained"  sx={{height:"55px", ml:"10px", mt:"15px", backgroundColor:"#4193D3"
            }} onClick={sendClickHandler}>
            <SendIcon color="info" sx={{color:"white"}}/* sx={{ fontSize: "45px",ml:"10px", mt:"20px" }} */></SendIcon>
            </Button>
            
            </Grid>
          
          </Grid>

        </Box>
    </>
  )
}
