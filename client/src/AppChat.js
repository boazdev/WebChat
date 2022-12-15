import "./App.css";
import HttpCall from "./components/HttpCall";
import WebSocketCall from "./components/WebSocketCall";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function AppChat() {
  const [socketInstance, setSocketInstance] = useState("");
  const [loading, setLoading] = useState(true);
  const [buttonStatus, setButtonStatus] = useState(false);
  const [username,setUsername] = useState("default-user")
  const storeData = useSelector(state=>state.user)
  const handleClick = () => {
    if (buttonStatus === false) {
      setButtonStatus(true);
    } else {
      setButtonStatus(false);
    }
  };

  useEffect(() => {
    /* if (buttonStatus === true) {
      const socket = io("localhost:5001/", {
        transports: ["websocket"],
        cors: {
          origin: "http://localhost:3000/",
        },
        query:{user:username},
        auth: {
          token: "abcdefg"
        }
        //extraHeaders:{"X-Username":"alice"} //doesn't work with websocket, only with polling
      }); */
      if (buttonStatus === true) {
        const socket = io("localhost:5001/", {
          transports: ["polling","websocket"],
          cors: {
            origin: "http://localhost:3000/",
          },
          //query:{user:username}
          extraHeaders:{"X-Username":storeData.userId, "X-access-token":storeData.token} //doesn't work with websocket, only with polling
          ,
          //path:"chat",
          //rememberUpgrade:true,
          upgrade: true
        });

      setSocketInstance(socket);
      
      socket.on("connect", (data) => {
        console.log(data);
      });

      setLoading(false);

      socket.on("disconnect", (data) => {
        console.log(data);
      });

      return function cleanup() {
        socket.removeAllListeners();
        //socket.removeListener()
        socket.disconnect();
        
      };
    }
  }, [buttonStatus]);

  return (
    <div className="App">
      <h1>React/Flask App + socket.io</h1>
      <div className="line">
       {/*  <HttpCall /> */}
      </div>
      <span style={{color:"white"}}>Select Username:</span><input type="text" defaultValue={username} onChange={(e)=>setUsername(e.target.value)}/>
      {!buttonStatus ? (
        <button onClick={handleClick}>turn chat on</button>
      ) : (
        <>
          <button onClick={handleClick}>turn chat off</button>
          
          <div className="line">
            {!loading && <WebSocketCall socket={socketInstance} />}
          </div>
        </>
      )}
    </div>
  );
}

export default AppChat;
