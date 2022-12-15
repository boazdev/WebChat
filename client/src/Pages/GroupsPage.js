import { GroupAdd } from '@mui/icons-material'
import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { GroupsTable } from '../components/GroupsTable'
import { GroupTable2 } from '../components/GroupTable2'
import { WText } from '../components/WText'
import { getWebChatWSParams } from '../Utils/webchatWsCRUD'

export const GroupsPage = () => {
  const navigate = useNavigate()
  const [userGroups,setUserGroups] = useState([])
  const storeData = useSelector(state=>state.user)
  useEffect(() => {
          
    const fetchIt = async () => {
        //console.log(storeData)
        let resp = await getWebChatWSParams("groups",{is_userid:storeData.userId},storeData.token)
        
        if (resp.status===200)
          setUserGroups(resp.data.data)
        

    };
    fetchIt()
},[])
const reload = async () => {
  console.log("leave group reload function")
  let resp = await getWebChatWSParams("groups",{is_userid:storeData.userId},storeData.token)
        
        if (resp.status===200)
          setUserGroups(resp.data.data)
        
}
  return (
    <div style={{height:"420px"}}>
        <WText>Groups Page</WText>
        <Button variant='outlined' endIcon={<GroupAdd />} onClick={()=>navigate("/homepage/creategroup")}>Create a new group</Button>
        <GroupTable2 data={userGroups} reloadCallback={()=>reload()}/>
    </div>
  )
}
