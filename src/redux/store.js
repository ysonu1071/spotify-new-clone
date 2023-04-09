import { configureStore } from '@reduxjs/toolkit';
import musicDataReducer from '../redux/slices/musicDataSlice';

const store = configureStore({
    reducer: {
        musicData: musicDataReducer
    }
})

export default store;