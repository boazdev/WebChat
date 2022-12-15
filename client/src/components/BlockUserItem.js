import { Button, ButtonGroup, Grid, Typography } from '@mui/material'
import React from 'react'
import PersonIcon from '@mui/icons-material/Person';

export const BlockUserItem = (props) => {
  return (
    
        <Grid container sx={{mt:"5px", border:2, borderColor:"black"}} /* onClick={props.callback} */>
         
              <Grid container direction="row">
              <Grid item marginRight={"4px"}>{<PersonIcon sx={{height:"30px"}}/>}
              </Grid>
                        
                   
                      <Grid item sx={{minWidth:"150px"}}><Typography align="left" variant="body1" color="white">
              {props.name}
            </Typography></Grid>
            <Grid item sx={{ml:"4px "}}>
                <ButtonGroup sx={{mt:"3px"}}>
                <Button sx={{height:"25px", mr:"3px", visibility:props.blockData?"hidden":"visible"}} variant="contained" onClick={()=>props.onBlock()}>Block</Button>
                <Button sx={{height:"25px", visibility:props.blockData?"visible":"hidden"}}variant="contained" onClick={()=>props.onUnBlock()}>Unblock</Button>
                </ButtonGroup>
              </Grid>
                  </Grid>
                  </Grid>
      
  )
}
