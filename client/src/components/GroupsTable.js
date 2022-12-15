import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useSelector } from 'react-redux';

export const GroupsTable = (props) => {
    const storeData = useSelector(state=>state.user)
  return (
    <TableContainer component={Paper} >
      <Table  sx={{ minWidth: 650 , backgroundColor:"azure", textAlign:"left", color:"white"}} aria-label="Groups">
        <TableHead>
          <TableRow>
            <TableCell align="left" width="40px">Group name</TableCell>
            <TableCell align="left" width="40px">Created by</TableCell>
            <TableCell align="left" width="40px">{"            Members"}</TableCell>
            <TableCell align="left"  width="50px">actions</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
        {props.data.map((item) => (
            <TableRow
              key={item._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } , columnWidth:"50px", padding:"5px"}}
            >
              <TableCell component="th" scope="row">
                {item.name}
              </TableCell>
              <TableCell align="left">{storeData.nicknamesDict[item.creatorId]}</TableCell>
              <TableCell align="justify"  >
                <ul style={{textAlign:"left", display:"inline-block"}}>{item.members.map(item2=><li key={item2}>{storeData.nicknamesDict[item2]}</li>)}</ul>
                </TableCell>
                <TableCell component="th" scope="row">
                {"shit"}
              </TableCell>
            </TableRow>
          ))}
            </TableBody>
            </Table>
        </TableContainer>
  )
}
