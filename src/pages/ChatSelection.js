import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setChatRoom } from '../reducers/chat-room/chatroomSlice';
import { setNickname, setChatId } from '../reducers/user/userSlice';

import Axios from 'axios';

let errorMessage = "";
export const ChatSelector = () => {
    const chatNameField = useRef();
    const nicknameField = useRef();
    const chatIDField = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {userName, password, token} = useSelector(state => state.user);

    const registerMember= (chatId, nickname) => {
      let updateUser = {
          id: token,
          name: userName,
          password: password,
          connectedStatus : true,
          chatRoomId: chatId,
          nickname: nickname
        }
        Axios.put("http://localhost:9090/login", updateUser)
        .then(response => {
          const data = response.data;
          console.log("User : "+ data.name + " was succesfully updated with Chat ID: "+ data.chatRoomId);
        }).catch(err => {
          console.log(err.message);
        });
    }

    const setErrorMessage = (err) => {
        errorMessage = err;
    }

    const handleCreateChat = e => {
        e.preventDefault();
        const newChat = {
            name: chatNameField.current.value,
        };
        
        Axios.post("http://localhost:9090/create-chat-room", newChat)
        .then(response => {
            dispatch(setChatRoom({
              chatName : response.data.name,
              id : response.data.id
            }));
            dispatch(setNickname({
                nickname: nicknameField.current.value
            }));
            dispatch(setChatId({
              chatId: response.data.id
            }));
            registerMember(response.data.id, nicknameField.current.value);
        }).catch((err) => {
            console.log(err);
        });
            
            navigate("/chatroom");
      
    }

    const handleJoinChat = e => {
        e.preventDefault();
        Axios.get("http://localhost:9090/chat-room/"+chatIDField.current.value)
        .then(response => {
        const chatToLog = response.data;
        if (chatToLog) {
            dispatch(setChatRoom({
                id: chatToLog.id,
                chatName: chatToLog.name,
            }));
            dispatch(setNickname({
              nickname: nicknameField.current.value
          }));
          dispatch(setChatId({
            chatId: response.data.id
          }));
            registerMember(response.data.id, nicknameField.current.value);
            navigate("/chatroom");
          } else {
          console.warn("Wrong Chat ID");
          setErrorMessage("Wrong Chat ID");
          navigate("/chat-selection");
        }
      })
    }

    return (
        <div className="mb-3">

        <div className="row justify-content-center">
        <div className="container">
        <div className="mt-4">
        <h2 className="text-muted" style={{fontFamily: "Trebuchet MS, Helvetica, sans-serif", 
        textDecorationLine: "underline overline", 
        textDecorationStyle: "wavy",
        textDecorationColor: "rgb(0, 128, 192)", 
        float: "none", textAlign: "center",
        textShadow: "1px 1px 1px",
        }}>Welcome to Chat Rooms!<br/></h2>
      </div>
      <div className="jumbotron" style={{marginLeft: "10em", 
      marginRight: "10em", 
      marginTop: "2em", 
      background: "rgba(100, 160, 255,0.4)",
      borderRadius: "1em",
      padding: "0.1em",
      boxShadow: "0.2em 0.2em 0.5em"
      }}>
        <div style={{margin: "1em 1em 1em 1em"}}>

        <form onSubmit={handleCreateChat}>
        <div className="mb-3">
            <label>Create a Chat Room</label>
            <input type="text" className="form-control" placeholder='Chat name'ref={chatNameField}/>
                </div>
        <p></p>
      <div className="form-group">
        <label>Choose your nickname</label>
      <input type="text" className="form-control" placeholder='Nickname' ref={nicknameField}/>
      </div>
      <div className='mt-2 text-center'>
      <button type="submit" className="btn btn-success">Create</button>
      </div>
      <h3 className = "text-center"style={{marginTop: "30px", marginBottom: "30px"}}>Or<br/>
      </h3>
    </form>
      <form onSubmit={handleJoinChat}>
        <div className="form-group">
            <label>Join an existing Chat Room with the Chat ID</label>
            <input type="text" className="form-control" placeholder='Chat ID' ref={chatIDField}/>
            <label>Choose your nickname</label>
            <input type="text" className="form-control" placeholder='Nickname' ref={nicknameField}/>
            <div className='mt-2 text-center'>
            <h3 className = "row justify-content-center" style={{fontSize : "1em", color:"red"}}>{errorMessage}</h3>
            <button type="submit" className="btn btn-primary">Join</button>
            </div>
            </div>
            </form>
        </div>
        </div>
        </div>
    </div>
</div>
    );
}