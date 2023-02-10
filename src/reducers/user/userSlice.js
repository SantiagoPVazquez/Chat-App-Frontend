import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    userName: "",
    password: "",
    status: "",
    token: "",
    nickname: "",
    chatId: ""
}

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setUser: (state, action) => {
            state.userName = action.payload.userName;
            state.password = action.payload.password;
            state.status = action.payload.status;
            state.token = action.payload.token;
            state.nickname = action.payload.nickname;
            state.chatId = action.payload.chatId;
        },
        setNickname: (state, action) => {
            state.nickname = action.payload.nickname;  
        },
        changeStatus: (state, action) => {
            state.status = action.payload.status;
        },
        setChatId: (state, action) => {
            state.chatId = action.payload.chatId;
        }
    }
})

export const { setUser, setNickname, changeStatus, setChatId } = userSlice.actions;

export default userSlice.reducer;