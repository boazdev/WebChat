import { useEffect, useState } from "react";

export default function WebSocketCall({ socket }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageTo, setMessageTo] = useState("")
  const handleText = (e) => {
    const inputMessage = e.target.value;
    setMessage(inputMessage);
  };

  const handleText2 = (e) => {
    const inputMessage = e.target.value;
    setMessageTo(inputMessage);
  };

  const handleSubmit = () => {
    if (!message) {
      return;
    }
    socket.emit("data", message);
    setMessage("");
  };

  const handleSendTo = () => {
    if (!messageTo) {
      return;
    }
    socket.emit("send_to", messageTo);
    setMessage("");
  };

  useEffect(() => {
    socket.on("data", (data) => {
      setMessages([...messages, data.data]);
    });
    return () => {
      socket.off("data", () => {
        console.log("data event was removed");
      });
    };
  }, [socket, messages]);

  return (
    <div>
      <h2>WebSocket Communication</h2>
      <input type="text" value={message} onChange={handleText} />
      <button onClick={handleSubmit}>submit</button><br/>
      <input type="text" value={messageTo} onChange={handleText2}/>
      <button onClick={handleSendTo}>send to client:</button>
      <input type="text" /* value={messageTo} onChange={handleText2} *//>
      <ul >
        {messages.map((message, ind) => {
          return <li style={{color:"white"}} key={ind}><span style={{color:"white"}}>{message}</span></li>;
        })}
      </ul>
    </div>
  );
}
