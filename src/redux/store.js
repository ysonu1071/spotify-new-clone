import { configureStore } from '@reduxjs/toolkit';
import musicDataReducer from '../redux/slices/musicDataSlice';
import authSliceReducer from "../redux/slices/authSlice"

const store = configureStore({
    reducer: {
        musicData: musicDataReducer,
        auth: authSliceReducer,
    }
})

export default store;