import { Button, Grid, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { WText } from '../components/WText'
import { getWebChatWS, postWebChatWS } from '../Utils/webchatWsCRUD'
import Select from "react-select";
import { SelectComp } from '../components/SelectComp'
import { useNavigate, useOutletContext } from 'react-router-dom'

export const CreateGroup = () => {
    const [usersList,setUsersList] = useState([])
    const [groupName, setGroupName] = useState("")
    const [groupMembers, setGroupMembers] = useState([])
    const navigate = useNavigate()
    const storeData=useSelector(state=>state.user)
    const [socketInstance] = useOutletContext();
    const submitHandle = (e) => {
        e.preventDefault()
        let objPost={name:groupName, creatorId:storeData.userId, members:[...groupMembers,{userId:storeData.userId, nickname:storeData.nickname}]}
        console.log("sending new group obj:")
        console.log(objPost)
        socketInstance.emit("start_grp_chat", objPost)
        //postWebChatWS("groups",objPost,storeData.token)
        navigate("/homepage/groups")
    }
    useEffect(
        () => {
          
            const fetchIt = async () => {
                //console.log(storeData)
                const resp = await getWebChatWS("users",storeData.token)
                let tmpUsersList= resp.data.data.filter(item=>item.userId!==storeData.userId)
                if (resp.status===200)
                  setUsersList(tmpUsersList)
 
            };
            fetchIt()
        },[]
    )
    
  return (
    <>
    <div>
        <WText>Create a new Group</WText></div>
        <Box component="form" onSubmit={submitHandle} noValidate sx={{ mt: 1, width:"500px", paddingBottom:"20px"}}>
        <Grid container direction="row" >
        <Grid item>
          <Typography variant="h7" color="white" sx={{mt:"300px ", mr:"3px"}}>Group Name:</Typography>
          </Grid>
          <Grid item>
            <input type="text" onChange={(e)=>setGroupName(e.target.value)} placeholder="Type a group name..."/>
            </Grid>
            
          </Grid>
          
          <Grid container direction="row" marginTop="10px" >
            <Grid item>
                <Typography variant="h7" color="white" sx={{mt:"300px ", mr:"3px"}}>Group Users:</Typography>
            </Grid>
            <Grid item>
                <SelectComp options={usersList.map(item=>{return{value:item.userId, label:item.nickname}})}
                placeholder="Select users to add" onChange={setGroupMembers} />

              </Grid>
          </Grid>
          <Grid container direction="row" >
            <Grid item> <Button
                  type="submit"
                  
                  variant="contained"
                  sx={{ mt: 2, mb: 2 , mr:1, width:"150px"}}
                >
                  Submit
                </Button>
            </Grid>
         <Grid item><Button
                  type="button"
                  onClick={()=>navigate("/homepage/groups")}
                  variant="contained"
                  sx={{ mt: 2, mb: 2 , width:"150px"}}
                >
                  Cancel
                </Button></Grid>
                
          </Grid>
          
          </Box>
    </>
    
  )
}
