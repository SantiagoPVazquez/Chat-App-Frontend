import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import { changeStatus } from '../reducers/user/userSlice';
import Axios from 'axios';
import $ from 'jquery'
import  ReactDOM from 'react-dom/client';

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBtn,
  MDBTypography,
  MDBTextArea,
  MDBCardHeader,
} from "mdb-react-ui-kit";
import { setMessage, setSelectedUser } from '../reducers/chat-room/messagesSlice';

let stompClient = null;
let selectedUser;
let usersList;

const ChatRoom = () => {
    //Redux
    const dispatch = useDispatch();
    const {token, userName, nickname, status, password, chatId} = useSelector(state => state.user);
    const {id, chatName} = useSelector(state => state.chatroom);
    dispatch(setMessage({
        from: userName,
        to: selectedUser,
        message: ""
    }))
    const {from, to, message} = useSelector(state => state.messages);

    // React
    // const [publicChats, setPublicChats] = useState([]);

    // const [privateChats, setPrivateChats] = useState(new Map());

    // const [tab, setTab] = useState("CHATROOM");  

    // const [userData, setUserData] = useState({
    //     username: "",
    //     receiverName: "",
    //     connected:false,
    //     message:""
    // });

    // const handleMessage = (event) => {
    //     const {value} = event.target;
    //     setUserData({...userData, "message":value});
    // }
    // const handleUserName = (event) => {
    //     const {value} = event.target;
    //     setUserData({...userData, "username":value});
    // }

    // const connect = () => {
    //     let Sock = new SockJS('http://localhost:9090/ws');
    //     stompClient = over(Sock);
    //     stompClient.connect({}, onConnected,onError);
    // }

    // const onConnected = () => {
    //     setUserData({...userData,"connected":true});
    //     stompClient.subscribe('/chatroom/public', onPublicMessageReceived);
    //     stompClient.subscribe('/user/'+ userData.username +'/private', onPrivateMessageReceived);
    //     userJoin();
    // }

    // const userJoin = () => {
    //         let chatMessage = {
    //             senderName:userData.username,
    //             status:'JOIN'
    //         };
    //         stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
    // }

    // const onError = (err) => {
    //     console.log(err);
    // }

    // const onPublicMessageReceived = (payload) => {
    //     let payloadData = JSON.parse(payload.body);
    //     switch(payloadData.status) {
    //         case "JOIN":
    //             if (!privateChats.get(payloadData.senderName)) {
    //                 privateChats.set(payloadData.senderName, []);
    //                 setPrivateChats(new Map(privateChats));
    //             }
    //             break;
    //         case "MESSAGE":
    //             publicChats.push(payloadData);
    //             setPublicChats([...publicChats])
    //             break;

    //     }
    // }

    // const onPrivateMessageReceived = (payload) => {
    //     console.log(payload);
    //     let payloadData = JSON.parse(payload.body);
    //     if (privateChats.get(payloadData.senderName)) {
    //         privateChats.get(payloadData.senderName).push(payloadData);
    //         setPrivateChats(new Map(privateChats));
    //     } else {
    //         let list = [];
    //         list.push(payloadData);
    //         privateChats.set(payloadData.senderName, list);
    //         setPrivateChats(new Map(privateChats));
    //     }
    // }

    // const sendPublicMessage = () => {
    //     if (stompClient) {
    //         let chatMessage = {
    //             senderName:userData.username,
    //             message:userData.message,
    //             status:'MESSAGE'
    //         };
    //         stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
    //         setUserData({...userData,"message":""})
    //     }
    // }
    
    // const sendPrivateMessage = () => {
    //     if (stompClient) {
    //         let chatMessage = {
    //             senderName:userData.username,
    //             receiverName:tab,
    //             message:userData.message,
    //             status:'MESSAGE'
    //         };
    //         if (userData.username !== tab) {
    //             privateChats.get(tab).push(chatMessage);
    //             setPrivateChats(new Map(privateChats));
    //         }
    //         stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
    //         setUserData({...userData,"message":""})
    //     }
    // }

    // const registerUser = () => {
    //     connect();
    // }

    const changeOnline = () => {
        if (status == true) {
            dispatch(changeStatus({status:false}));
            console.log("false");
        } else {
            dispatch(changeStatus({status: true}));
            console.log("true");
        }
    }

    const connectToChat = (name) => {
        let socket = new SockJS('http://localhost:9090/ws')
        stompClient = over (socket);
        stompClient.connect({}, frame => {
            console.log("connected to:" + frame);
            stompClient.subscribe('/user/'+ name +'/private', response => {
                let data = JSON.parse(response.body);
                console.log(data);
            });
        });
    }

    connectToChat(userName);

    const sendMsg = (message) => {
        let chatMessage = {
            senderName:userName,
            receiverName: selectedUser,
            message: message,
            status:'MESSAGE'
        };
        stompClient.send("/app/private-message",{}, JSON.stringify(chatMessage))
    }

    const refresh = () => {
        Axios.get("http://localhost:9090/users/"+chatId)
        .then(response => {
            console.log(response);
            let data = response.data;
            console.log(data);
            let usersHtmlTemplate = [];
            data.forEach(user => {
                usersHtmlTemplate.push(
                    <li className="p-2 border-bottom">
                      <a href="#!" className="d-flex justify-content-between" onClick={selectReceiver(user.name)}>
                        <div className="d-flex flex-row">
                          <div className="pt-1">
                            <h3 className="fw-bold mb-0">{user.nickname}</h3>
                          </div>
                        </div>
                        <div className="pt-1">
                        <button className = {`btn ${(user.connectedStatus)? 'btn-success': 'btn-danger'}`} 
                        style={{borderRadius: "10em"}}>{(user.connectedStatus)? "Online": "Offline"}</button>
                          <span className="badge bg-danger float-end">1</span>
                        </div>
                      </a>
                    </li>
            )
            
        });
            let container = ReactDOM.createRoot(document.getElementById("userList")) ;
            container.render(usersHtmlTemplate);
            })
            .catch(err => {
                console.log(err);
            });
            
        }

    const selectReceiver = (name) => {
        dispatch(setSelectedUser({
            to: name
        }));
        console.log("Selecting user: " + to);
        selectedUser = to;
    }
  return (
    <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee" }}>
      <MDBRow>
        <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
          <h5 className="font-weight-bold mb-3 text-center text-lg-start">
            Members
          </h5>
            <button className='position-relative start-50 top-0 mb-3 btn btn-primary' onClick={refresh}>Refresh</button>
          <MDBCard>
            <MDBCardBody>
              <MDBTypography listUnStyled className="mb-0" id="userList">
                
              </MDBTypography>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="6" lg="7" xl="8">
          <MDBTypography listUnStyled>
            <li className="d-flex justify-content-between mb-4">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp"
                alt="avatar"
                className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                width="60"
              />
              <MDBCard>
                <MDBCardHeader className="d-flex justify-content-between p-3">
                  <p className="fw-bold mb-0">Brad Pitt</p>
                  <p className="text-muted small mb-0">
                    <MDBIcon far icon="clock" /> 12 mins ago
                  </p>
                </MDBCardHeader>
                <MDBCardBody>
                  <p className="mb-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </MDBCardBody>
              </MDBCard>
            </li>
            <li className="d-flex justify-content-between mb-4">
              <MDBCard className="w-100">
                <MDBCardHeader className="d-flex justify-content-between p-3">
                  <p className="fw-bold mb-0">Lara Croft</p>
                  <p className="text-muted small mb-0">
                    <MDBIcon far icon="clock" /> 13 mins ago
                  </p>
                </MDBCardHeader>
                <MDBCardBody>
                  <p className="mb-0">
                    Sed ut perspiciatis unde omnis iste natus error sit
                    voluptatem accusantium doloremque laudantium.
                  </p>
                </MDBCardBody>
              </MDBCard>
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp"
                alt="avatar"
                className="rounded-circle d-flex align-self-start ms-3 shadow-1-strong"
                width="60"
              />
            </li>
            <li className="d-flex justify-content-between mb-4">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp"
                alt="avatar"
                className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                width="60"
              />
              <MDBCard>
                <MDBCardHeader className="d-flex justify-content-between p-3">
                  <p className="fw-bold mb-0">Brad Pitt</p>
                  <p className="text-muted small mb-0">
                    <MDBIcon far icon="clock" /> 10 mins ago
                  </p>
                </MDBCardHeader>
                <MDBCardBody>
                  <p className="mb-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </MDBCardBody>
              </MDBCard>
            </li>
            <li className="bg-white mb-3">
              <MDBTextArea placeholder='Message' id="textAreaExample" rows={4} />
            </li>
            <MDBBtn color="info" rounded className="float-end">
              Send
            </MDBBtn>
          </MDBTypography>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );

}

export default ChatRoom