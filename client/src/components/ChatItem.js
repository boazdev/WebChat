import { BorderColor } from '@mui/icons-material'
import { Container, Grid, Typography } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import React from 'react'

export const ChatItem = (props) => { //props={Title:str,date:str, lastMessage:str, isGrp:boolean, dbId}
  return (
      <Grid container sx={{mt:"5px", border:2, borderColor:"black", cursor:"pointer"}} onClick={props.callback}>
      <Grid item xs>
          <Grid container direction="row">
          <Grid item marginRight={"4px"}>{props.isGrp?<PeopleIcon sx={{height:"30px"}}/>:<PersonIcon sx={{height:"30px"}}/>}</Grid>
                    
                    <div>
                  <Grid item><Typography align="left" variant="body1" color="white">
          {props.title}
        </Typography></Grid>
        <Grid item><Typography align="left" variant="body1" color="gray" fontSize="13px">
          {props.lastMessage.substring(0,53) /* + props.lastMessage.length>53 ? "..." :"" */}
          {props.lastMessage.length>53 ? "..." :""}
        </Typography></Grid>
        </div>
          
              </Grid>
          
      </Grid>
      <Grid item sx={{mr:"3px", align:"center"}}>
        <Typography align="right" variant="caption" color="gray" >
          {props.date}
        </Typography>
      </Grid>
    </Grid>
  
  )
}
