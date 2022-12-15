import React from 'react'
/* import { Login } from './Pages/Login'; */
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ChatsPage } from './Pages/ChatsPage';
import { CreateGroup } from './Pages/CreateGroup';
import { GroupsPage } from './Pages/GroupsPage';
import { HomePage } from './Pages/HomePage';
import { Login } from './Pages/Login';
import { SignUp } from './Pages/SignUp';
import { StartPrivChat } from './Pages/StartPrivChat';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { EditGroup } from './Pages/EditGroup';
import { Blacklist } from './Pages/Blacklist';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
export const App = () => {
  return (
    
    <div styles ={{backgroundColor:"#39191b"}}>
        <div style={{backgroundColor:"#39191b" , textAlign:"left", marginLeft:"10px"}}>
    <hr/>
        <h2 style={{textAlign:"center", color:"white"}}>Web Chat App</h2>
        <hr/>
  {/* <Login/> */}
  <Router>
  <Routes>
  
    <Route exact path="/" element={<Login />} />
    <Route exact path="/signup" element={<SignUp />} />
    <Route exact path="/homepage" element={<HomePage />} > 
        <Route exact path="chats" element={<ChatsPage />} /> 
        <Route exact path="groups" element={<GroupsPage />} /> 
        <Route exact path="privatechat" element={<StartPrivChat/>} />
        <Route exact path="creategroup" element={<CreateGroup/>}/>
        <Route exact path="editgroup/:id" element={<EditGroup/>}/>
        <Route exact path="blacklist" element={<Blacklist/>}/>
    </Route>
    </Routes>
      </Router>
        </div>
    </div>
    
  );
}
