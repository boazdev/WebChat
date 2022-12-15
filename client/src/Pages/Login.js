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
import { loginCinemaWs, loginWebchatWs, parseJwt } from '../Utils/loginUtils';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginAction } from '../Utils/userSlice';
import { setPrivChatItems } from '../Utils/chatSlice';


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



export const Login = () => {
    const theme = createTheme();
    const [loginError,setLoginError] = useState(false)
    const navigate= useNavigate()
    const [username,setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errorColor,setErrorColor] = useState(false)
    const dispatch = useDispatch()

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log({
          username: username,
          password: password
        });
       
        let loginObj = {username:username, password:password}
          let resp = await loginWebchatWs(loginObj)  
          
          if(resp.status==401)
          {
            setLoginError(resp.data.error)
            setErrorColor(!errorColor)
          }
          else if(resp.status==200)
          {
            //decode token and add user data to redux store
            //
            //console.log(resp.data)
            let data = parseJwt(resp.data.token)
            console.log(data)
            /* let loginObj = {username: data.username, permissionList: data.permissions,
                 fullname:data.userData.firstname+" " + data.userData.lastname, token:resp.data.token}
            dispatch(loginAction(loginObj)) */
            let loginObj = {userId:data._id, nickname:data.nickname, token:resp.data.token}
            /* console.log("login obj dispatching:")
            console.log(loginObj) */
            dispatch(loginAction(loginObj))
            dispatch(setPrivChatItems([]))
            navigate("/homepage/chats")
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
              <Typography component="h1" variant="h5" color="white">
                Sign in
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  sx={{input: { color: 'white' }, "& .MuiFormLabel-root": {
                    color: 'white'
                },
                "& .MuiFormLabel-root.Mui-focused": {
                    color: 'white'
                }}}
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
                }}}
                  onChange={(e)=>setPassword(e.target.value)}
                  //autoComplete="current-password"
                />
                {/* <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                /> */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                {loginError&& 
                <Typography  variant="h7" color={errorColor?"red":"orange"}>
                {loginError}
              </Typography>}
                <Grid container>
                  {/* <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid> */}
                  <Grid item>
                    <MLink href="#" variant="body2" onClick={()=>navigate("/signup")}>
                      {"Don't have an account? Sign Up"}
                    </MLink>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
          </Container>
        </ThemeProvider>
      );
}
