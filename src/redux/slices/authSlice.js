import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState:{
        showLoginPage: false,
        showRegisterPage: false,
        loginStatus: false,
    },

    reducers: {
        setLoginPage: (state, action) => {
            // alert("its working");
            state.showLoginPage = action.payload
        },

        setRegisterPage: (state, action) => {
            state.showRegisterPage = action.payload
        },

        setLoginStatus: (state, action)=>{
            // alert("hi");
            state.loginStatus = action.payload;
        }
    }

})


export const{setLoginPage, setRegisterPage, setLoginStatus} = authSlice.actions;
export default authSlice.reducer;
