import { configureStore } from "@reduxjs/toolkit";

// Reducers
import userReducer from '../reducers/user/userSlice';
import chatroomReducer from "../reducers/chat-room/chatroomSlice";
import messagesReducer from "../reducers/chat-room/messagesSlice";

export default configureStore ({
    reducer: {
        user: userReducer,
        chatroom: chatroomReducer,
        message: messagesReducer,
    }
})