import { Button, Grid, Typography } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import React from 'react'

export const MemberItem = (props) => {
  return (
    <Grid container sx={{mt:"5px", border:2, borderColor:"black"}} /* onClick={props.callback} */>
     
          <Grid container direction="row">
          <Grid item marginRight={"4px"}>{<PersonIcon sx={{height:"30px"}}/>}
          </Grid>
                    
               
                  <Grid item sx={{minWidth:"150px"}}><Typography align="left" variant="body1" color="white">
          {props.name}
        </Typography></Grid>
        <Grid item sx={{ml:"4px "}}><Button sx={{height:"20px"}}variant="contained" onClick={()=>props.onClick()}>Remove From Group</Button></Grid>
      
          
              </Grid>
              </Grid>
  )
}
