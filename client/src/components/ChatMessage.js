import React from 'react'
import { Box,Button,Grid, TextField, Typography } from '@mui/material';
export const ChatMessageRight = (props) => {
  return (
    <>
    <Box minHeight="50px"  wrap="nowrap"  sx={{backgroundColor:"teal", alignContent:"right", borderRadius:"10px",
    mt:"10px",  marginRight:"5px", marginLeft:"100px",
}}>
    <Grid container direction="row" wrap='wrap'  
      justify="flex-end" sx={{ display: "flex", justifyContent: "flex-end" ,width:'auto'}} >
        <Grid item flexGrow={'revert'}>
        <Typography  variant="body2" color="white" ml="8px">
      {props.content}
      </Typography>
          </Grid>
          <Grid item sx={{marginTop:"10px"}}>
          <Typography  variant="caption" color="whitesmoke" ml="8px" marginRight={"10px"}>
        {props.date}
      </Typography>
      </Grid>
      </Grid>
    </Box>
    </>
  )
}

export const ChatMessageLeft = (props) => {
    return (
      <>
      <Box minHeight="50px"  wrap="nowrap"   sx={{backgroundColor:props.bgcolor, alignContent:"right", borderRadius:"10px",
      mt:"10px",  marginRight:"160px", width:'auto'
  }}>
      <Grid container direction="row" wrap='wrap' sx={{ display: "flex", justifyContent: "flex-start" ,width:'auto'}} >
          <Grid item flexGrow={'revert'}>
          <Typography  variant="body2" color="white" ml="12px">
        {props.content}
        </Typography>
            </Grid>
            <Grid item style={{marginTop:"10px"}}>
            <Typography  variant="caption" color="whitesmoke" ml="8px" marginRight={"10px"}>
          {props.date}
        </Typography>
        </Grid>
        </Grid>
      </Box>
      </>
    )
  }