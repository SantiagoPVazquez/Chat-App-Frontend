import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    id: "",
    chatName: "",
}

export const chatroomSlice = createSlice({
    name: 'chatroom',
    initialState: initialState,
    reducers: {
        setChatRoom: (state, action) => {
            state.id = action.payload.id;
            state.chatName = action.payload.chatName;
        }
    }
})

export const {setChatRoom, addChatMembers, getChatMembers} = chatroomSlice.actions;

export default chatroomSlice.reducer;