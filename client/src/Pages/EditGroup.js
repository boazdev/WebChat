import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { WText } from '../components/WText'
import { getWebChatWS, updateWebChatWS } from '../Utils/webchatWsCRUD'
import Select from "react-select";
import { Button, ButtonGroup, Grid, TextField, Typography } from '@mui/material'
import { MemberItem } from '../components/MemberItem'
import { useOutletContext } from 'react-router-dom'
import PeopleIcon from '@mui/icons-material/People';
import { ArrowBack } from '@mui/icons-material'

export const EditGroup = () => {
    const params= useParams()
    const [usersAdd,setUsersAdd]=useState([])
    const [userToAdd,setUserToAdd] = useState({userIdAdd:"", nickname:""})
    const [groupData, setGroupData] = useState(null)
    const [usersInGrp,setUsersInGrp] = useState([])
    const [loading,setLoading] = useState(false)
    const storeData = useSelector(state=>state.user)
    const navigate = useNavigate()
    const [dummy,setDummy] =useState(false)
    const [socketInstance] = useOutletContext();
    useEffect(() => {
          
        const fetchIt = async () => {
            //console.log(storeData)
            let resp = await getWebChatWS("groups/"+params.id,storeData.token)
            let tmpGroupData= {}
            if (resp.status===200)
            {
              
              tmpGroupData = resp.data
              setGroupData(resp.data)
            }
              

            resp = await getWebChatWS("users",storeData.token)
            
              if (resp.status===200)
                {
                  //setUsersList(resp.data.data)
                  let tmpUsers =resp.data.data.filter(item=>tmpGroupData.members.findIndex(item2=>item.userId===item2)===-1)
                  //setUsersRemove(tmpUsers)
                  //console.log("users remove " + JSON.stringify(shit))
                  let tmpUsersInGroup =resp.data.data.filter(item=>tmpGroupData.members.findIndex(item2=>item.userId===item2)!==-1)
                  setUsersAdd(tmpUsers)
                  setUsersInGrp(tmpUsersInGroup)
                  setLoading(true)
                }
                
    
        };
        fetchIt()
    },[dummy])
   const submitHandler = async() =>{
    console.log("will submit obj: " + JSON.stringify(userToAdd))
    let resp = await updateWebChatWS("groups",params.id,userToAdd,storeData.token)
    socketInstance.emit("user_add_grp",{userIdAdd:userToAdd.userIdAdd,groupId:params.id,groupName:groupData.name})
    setDummy(!dummy)
   }

   const removeHandler = async (item) =>
   {
    console.log("will remove user :" + JSON.stringify(item) + "from group id:" + params.id)
    let objRemove ={...item,groupId:params.id}
    socketInstance.emit("user_remove_grp", objRemove)
    setDummy(!dummy)
   }
    const selectHandler = (data) => {
      //console.log(data)
      setUserToAdd({userIdAdd:data.value, nickname:data.label})
  }
  return (
    <div>
      <Grid container direction="row">
        <Grid item> <ArrowBack color="info" sx={{ fontSize: "25px",mt:"4px", cursor:"pointer" }} onClick={()=>navigate("/homepage/groups")}/></Grid>
        <Grid item><PeopleIcon color="info" sx={{ fontSize: "30px" , mr:"3px"}}></PeopleIcon></Grid>
        <Grid item><WText>Edit Group: {loading!=false && groupData.name}</WText></Grid>
        
        </Grid>
        <br/>
        {loading!=false && <>
        <Grid container direction="row">
        <Grid item>
          <Typography variant="h7" color="white" sx={{mt:"300px ", mr:"3px"}}>Group name: </Typography>
          </Grid>
          <Grid item>
            <input type="text" value={groupData.name} disabled/>
          </Grid>
        </Grid>
        <Grid container direction="row" marginTop={"3px"}>
        <Grid item>
          <Typography variant="h7" color="white" sx={{mt:"300px ", mr:"3px"}}>Add Member: </Typography>
          </Grid>
          <Grid item marginBottom={"3px"}>
            <Select /* defaultValue={usersRemove.map(item=>{return{value:item.userId, label:item.nickname}})} */
          options={usersAdd.map(item=>{return{value:item.userId, label:item.nickname}})} placeholder="Select Member to add "
              onChange={selectHandler}   styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  width:"250px", backgroundColor:"#39191b" , 
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
              }}/>
              </Grid>
              <Grid item>
              <Button variant='contained' onClick={submitHandler} sx={{ml:"5px"}}>Add him</Button>
              </Grid>
              
              
          </Grid>
          {usersInGrp.map(item=><MemberItem key={item.userId } name={item.nickname} onClick={()=>removeHandler(item)}></MemberItem>)}
          
          
          <ButtonGroup sx={{padding:"3px"}}>
                
                <Button variant='contained' onClick={()=>navigate("/homepage/groups")}>Cancel</Button>
              </ButtonGroup>
          </> }
    </div>
  )
}
