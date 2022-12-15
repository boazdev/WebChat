import React, { useState } from 'react'

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MLink from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { LabelImportant } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createUserWs, loginCinemaWs } from '../Utils/loginUtils';
import { useNavigate } from 'react-router-dom';

const Copyright = (props) => {
    return (
      <Typography variant="body2" color="white" align="center" {...props}>
        {'Copyright © '}
        <MLink color="inherit" href="/">
          Web Chat
        </MLink>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

export const SignUp = () => {
    const theme = createTheme();
    const [loginError,setLoginError] = useState(false)
    const navigate= useNavigate()
    const [username,setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [nickname, setNickname] = useState("")
    const [errorColor,setErrorColor] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const handleSubmit = async (event) => {
        event.preventDefault();
        
       
        let loginObj = {username:username, password:password, nickname:nickname}
        console.log("sending obj:" )
        console.log(loginObj)
          let resp = await createUserWs(loginObj)  
          
          if(resp.status==403)
          {
            setLoginError(resp.data.error)
            setErrorColor(!errorColor)
          }
          else if(resp.status==200)
          {
            setIsSuccess(true)
            const timer = setTimeout(() => {
                navigate("/")
               
              }, 3500);
          }
          

      };

  return (
   
        <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            sx={{input: { color: 'white' }, "& .MuiFormLabel-root": {
              color: 'white'
          },
          "& .MuiFormLabel-root.Mui-focused": {
              color: 'white'
          }} }
            //autoComplete="username"
            onChange={(e)=>setUsername(e.target.value)}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            sx={{input: { color: 'white' }, "& .MuiFormLabel-root": {
              color: 'white'
          },
          "& .MuiFormLabel-root.Mui-focused": {
              color: 'white'
          }} }
            onChange={(e)=>setPassword(e.target.value)}
            //autoComplete="current-password"
          />

            <TextField
            margin="normal"
            required
            fullWidth
            name="nickname"
            label="Nickname"
            id="nickname"
            sx={{input: { color: 'white' }, "& .MuiFormLabel-root": {
              color: 'white'
          },
          "& .MuiFormLabel-root.Mui-focused": {
              color: 'white'
          }}}
            onChange={(e)=>setNickname(e.target.value)}
            //autoComplete="current-password"
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          {loginError&& 
          <Typography  variant="h7" color={errorColor?"red":"orange"}>
          {loginError}
        </Typography>}
          {isSuccess &&
          <Typography  variant="h7" color={"blue"}>
          User created successfully. You can now Sign In.
        </Typography>
        
          }
          <Grid container>
                  {/* <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid> */}
                  <Grid item>
                    <MLink href="#" variant="body2" onClick={()=>navigate("/")}>
                      {"Already have an account? Sign in"}
                    </MLink>
                  </Grid>
                </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  </ThemeProvider>
  )
}
