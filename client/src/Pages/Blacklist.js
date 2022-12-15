import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { WText } from '../components/WText';
import { deleteWebChatWS, getWebChatWS, postWebChatWS } from '../Utils/webchatWsCRUD';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { BlockUserItem } from '../components/BlockUserItem';

export const Blacklist = () => {
    const storeData = useSelector(state=>state.user)
    const [usersList,setUsersList] = useState([])
    const [dummy,setDummy] = useState(false)
    const blockHandler = async(userIdBlock) => {
      
      //console.log("we will Block user:" + userIdBlock)
      let objPost = {userId:storeData.userId,userIdBlock:userIdBlock}
      await postWebChatWS("blacklists",objPost,storeData.token)
      setDummy(!dummy)
    }

    const unBlockHandler =  async(blacklistId) => {
      //console.log("we will Unblock blacklistid:" + blacklistId)

      await deleteWebChatWS("blacklists",blacklistId,storeData.token)
      setDummy(!dummy)
    }
  useEffect(
    () => {
      
        const fetchIt = async () => {

            let resp = await getWebChatWS("users",storeData.token)
            if (resp.status===200)
            {
                let tmpUsersList=resp.data.data
                tmpUsersList = tmpUsersList.filter(item=>item.userId!==storeData.userId)
                
                resp = await getWebChatWS("blacklists/"+storeData.userId,storeData.token)
                /* console.log("blacklists user data:")
                console.log(resp.data) */
                if (resp.status===200)
                {
                  let blockList= resp.data.data
                  let func = (item,blist) =>
                  {
                    let res=blockList.find(item2=>item2.userIdBlock===item.userId)
                    if (res===undefined)
                      return false
                    else
                      return res
                  }
                  tmpUsersList=tmpUsersList.map(item=>{return{...item,
                  blockData:func(item,blockList)}})
                  //console.log("tmp users list: " +JSON.stringify(tmpUsersList)) 
                  setUsersList(tmpUsersList)
                }
            }

            
              
            
            
              
        };
        fetchIt()
    },[dummy]
)
  return (
    <div><Grid container direction="row">
    <Grid item><PersonOffIcon sx={{ fontSize: "30px" , mr:"3px"}}/></Grid>
    <Grid item><WText>Manage Block List</WText></Grid>
    
    </Grid>
    <Grid>
      {usersList.map(item=><BlockUserItem key={item.userId} name={item.nickname}
       blockData={item.blockData} onBlock={()=>blockHandler(item.userId)} onUnBlock={()=>unBlockHandler(item.blockData._id)}/>)}
    </Grid>
    </div>
  )
}
