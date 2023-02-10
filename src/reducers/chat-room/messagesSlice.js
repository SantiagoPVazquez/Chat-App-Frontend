import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    from: "",
    to: "",
    message: "",
}

export const messagesSlice = createSlice({
    name: 'messages',
    initialState: initialState,
    reducers: {
        setMessage: (state, action) => {
            state.from = action.payload.from;
            state.to = action.payload.to;
            state.message = action.payload.message;
        },
        setSelectedUser: (state, action) => {
            state.to = action.payload.to;
        }
    }
})

export const {setMessage, setSelectedUser} = messagesSlice.actions;

export default messagesSlice.reducer;