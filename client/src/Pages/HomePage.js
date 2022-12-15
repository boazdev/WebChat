import React, { useEffect, useState } from 'react'
import { ButtonGroup,Button, ThemeProvider, CssBaseline, Container, Grid, Typography } from '@mui/material'
import { createTheme } from '@mui/material/styles';
import { Box, padding } from '@mui/system'
import { useNavigate,Link, Outlet, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from '../Utils/userSlice';
import { io } from "socket.io-client";
import { addChatCurrMessages, addPrivChatItem, addPrivChatMessage, setChatDbId, setPrivChatDbId, setPrivChatItems } from '../Utils/chatSlice';
import { getWebChatWSParams } from '../Utils/webchatWsCRUD';
import Person2Icon from '@mui/icons-material/Person2';
import { all } from 'axios';
import { strToDate } from '../Utils/generalUtils';
export const HomePage = () => {
 const navigate = useNavigate()
 const dispatch = useDispatch()
  const theme = createTheme();
  const storeData = useSelector(state=>state.user)
  const chatData = useSelector(state=>state.chat)
  const [socketInstance, setSocketInstance] = useState("");
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    
      
        const socket = io("localhost:5001/", {
          transports: ["polling","websocket"],
          cors: {
            origin: "http://localhost:3000/",
          },
          extraHeaders:{"X-Username":storeData.userId, "X-access-token":storeData.token} //doesn't work with websocket, only with polling
          ,

          upgrade: true
        });

      setSocketInstance(socket);
    
      socket.on("connect", (data) => {
        console.log(data);
      });

      setLoading(false);

      socket.on("disconnect", (data) => {
        console.log(data);
      });
      
      

      const fetchIt = async () =>
      {
        let resp = await getWebChatWSParams("chats",{is_userid:storeData.userId},storeData.token)
      /* console.log("user chats data:")
      console.log(resp.data) */
      let privChatsData =[]
      if (resp.status===200)
      {
         privChatsData =  resp.data.data
        //privChatObj = {chatDbId:data.chatId, chatWithId:data.messageData.userId,messages:[data.messageData]}
        //dispatch(setPrivChatItems(resp2.data.data))
        privChatsData = privChatsData.map(item=>{return {chatDbId:item._id, 
          chatWithId: item.userIdFrom===storeData.userId? item.userIdTo: item.userIdFrom, messages:item.messages, 
          isGrp:false
        }})
        //dispatch(setPrivChatItems(privChatsData))
      }
      resp = await getWebChatWSParams("groups",{is_userid:storeData.userId},storeData.token)
      console.log("user groups data:")
      console.log(resp.data)
      let privGroupsData =[]
      if (resp.status===200)
      {
        privGroupsData =  resp.data.data
        //privChatObj = {chatDbId:data.chatId, chatWithId:data.messageData.userId,messages:[data.messageData]}
        //dispatch(setPrivChatItems(resp2.data.data))
        privGroupsData = privGroupsData.map(item=>{return {chatDbId:item._id, 
          groupName: item.name, messages:item.messages , 
          isGrp:true
        }})
        let allChatsData = [...privGroupsData,...privChatsData]
       

        allChatsData=allChatsData.sort(function(a,b){
          var c = strToDate(a.messages[a.messages.length-1].date);
          var d = strToDate(b.messages[b.messages.length-1].date);
         
          return d-c;
        })
        dispatch(setPrivChatItems(allChatsData))
        let groupIdList = privGroupsData.map(item=>item.chatDbId)
        socket.emit("join_room",{userId:storeData.userId,groups:groupIdList})
        /* dispatch(setPrivChatItems([...privGroupsData,...privChatsData])) */ //todo:sort it
      }

    }
      fetchIt()
      
      return function cleanup() {
        socket.removeAllListeners();
        
        socket.disconnect();
        
      };
      
  }, []);

  useEffect(() => {
    if(socketInstance==="")
      return
      socketInstance.off("join_priv_chat")
    socketInstance.on("join_priv_chat", (data) => {
      console.log("join private chat enent:")
      console.log(data);
      let privChatObj
      
      if(data.messageData.userId===storeData.userId) //we are the sender, set db id and push message to priv chat list
      {
        dispatch(setPrivChatDbId(data.chatId))
        dispatch(addChatCurrMessages(data.messageData))
        privChatObj = {chatDbId:data.chatId, chatWithId:chatData.privChatData.userId, messages:[data.messageData],isGrp:false}
      } 
      else if(data.messageData.userId==="server")
      {
        dispatch(addChatCurrMessages(data.messageData))
        return
      }
      else { // we have a new message, add the new chat to private chat items
        privChatObj = {chatDbId:data.chatId, chatWithId:data.messageData.userId,messages:[data.messageData],isGrp:false}
      }
      dispatch(addPrivChatItem(privChatObj))
    });
    socketInstance.off("data_priv_chat")
    socketInstance.on("data_priv_chat", (data) => {
      console.log("recv data_priv_chat data:")
      console.log(data);
      console.log("currdbid:" +chatData.privChatData.dbId, "rcv dbid: " + data.chatId)
      if(chatData.privChatData.dbId===data.chatId)
      {
        dispatch(addChatCurrMessages(data.messageData))
        
      }
      dispatch(addPrivChatMessage({chatDbId:data.chatId, message:data.messageData}))
    });
    socketInstance.off("join_grp_chat")
    socketInstance.on("join_grp_chat", (data) => {
      console.log("socket io join_grp_chat event123:")
      console.log(data);
      let privChatObj = {chatDbId:data.groupId, groupName:data.groupName,messages:data.messages,isGrp:true}
      
      dispatch(addPrivChatItem(privChatObj))
    });

    socketInstance.off("data_grp_chat")
    socketInstance.on("data_grp_chat", (data) => {
      console.log("recv data_grp_chat data:")
      console.log(data);
      /* console.log("currdbid:" +chatData.privChatData.dbId, "rcv dbid: " + data.chatId) */
      if(chatData.privChatData.dbId===data.chatId)
      {
        dispatch(addChatCurrMessages(data.messageData))
        
      }
      dispatch(addPrivChatMessage({chatDbId:data.chatId, message:data.messageData}))
    });
    
  },[socketInstance,chatData.privChatData]);
  const logoutHandle = () => {
    dispatch(logoutAction())
    navigate("/")
  }
  return (
    <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box  sx={{
                
                alignItems: 'center'
              }}>
      <ButtonGroup style={{marginLeft:"40px",padding:"10px", backgroundColor:"green"/* display: "flex", 
    flexDirection: "row",
   
  marginRight: "10" */}}  color='primary' variant='contained' orientation='horizontal' >
    <Button sx={{mr:"5px"}} onClick={()=>navigate("/homepage/chats")}>Chats</Button>
    <Button sx={{mr:"5px"}} onClick={()=>navigate("/homepage/groups")}>Groups</Button>
    <Button sx={{mr:"5px"}} onClick={()=>navigate("/homepage/blacklist")}>Blacklist</Button>
    <Button sx={{mr:"5px"}} onClick={()=>navigate("/")}>Logout</Button>
  </ButtonGroup>
  </Box>
  <Box sx={{borderStyle:"solid", borderColor:"green", mt:"2px"}}>
    <Grid container direction="row" ml={"200px"}>
    <Grid item>
            <Person2Icon sx={{ fontSize: "35px" }}/>
          </Grid>
          <Grid item>
          <Typography align="left" variant="h6" color="white" mr="8px">
        {storeData.nickname}
      </Typography>
          </Grid>
          </Grid>
  </Box>
  <div style={{marginTop:"2px",padding:"5px", borderColor:"green", borderStyle:"solid",
     minHeight:"500px", overflowY:"scroll"}}>
      {!loading&&<Outlet context={[socketInstance]}/>}
     </div>
  
  </Container>
        </ThemeProvider>
  )
}
