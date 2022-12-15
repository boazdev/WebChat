import React from 'react'
import { Typography } from '@mui/material'
export const WText = (props) => {
  return (
    <Typography component="h1" variant="h5" color="white" align="center" {...props}>
      {props.children}
    </Typography>
  )
}
