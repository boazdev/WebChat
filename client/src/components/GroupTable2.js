import { Button } from '@mui/material'
import { padding, textAlign } from '@mui/system'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { removePrivChatItem } from '../Utils/chatSlice'
import { updateWebChatWS } from '../Utils/webchatWsCRUD'

export const GroupTable2 = (props) => {
    const storeData = useSelector(state=>state.user)
    const dispatch = useDispatch()
    const navigate= useNavigate()
    const leaveGroupHandler = async (groupId) => {
        console.log("user " + storeData.nickname+ "is leaving group: " + groupId)
        await updateWebChatWS("groups",groupId,{userIdLeave:storeData.userId, nickname:storeData.nickname},storeData.token)
        dispatch(removePrivChatItem(groupId))
        props.reloadCallback()
    }

  return (
    <div style={{marginTop:"5px"}}>
        <table style={{borderColor:"black", borderStyle:"solid", borderWidth:"2px", width:"540px", borderSpacing: "2px",
    borderCollapse: "collapse"}}>
            <thead style={{color:"white", border: "3px solid rgb(0, 0, 0)"}}>
                <tr><th>Group name</th>
                <th>Created by</th>
                <th>Participants</th>
                <th>Actions</th>
                </tr>
                
            </thead>
            <tbody>
                {props.data.map(item=><tr key={item._id} style={{color:"azure",  border: "3px solid rgb(0, 0, 0)"}}>
                    <td style={{/* verticalAlign: ''  */}}>{item.name}</td>
                    <td style={{verticalAlign: '' }}>{storeData.nicknamesDict[item.creatorId]}</td>
                    <td style={{verticalAlign: '' }}><ul style={{textAlign:"left", display:"inline-block"}}>{item.members.map(item2=><li key={item2}>{storeData.nicknamesDict[item2]}</li>)}</ul></td>
                    <td style={{verticalAlign:''  }}>{item.creatorId===storeData.userId &&<><Button variant='outlined' onClick={()=>navigate("/homepage/editgroup/"+item._id)}>Edit Group</Button ><br/></>}
                    <Button variant='outlined' sx={{mt:"2px"}} onClick={()=>leaveGroupHandler(item._id)}>Leave Group</Button></td>
                </tr>)}
            </tbody>
        </table>
    </div>
  )
}