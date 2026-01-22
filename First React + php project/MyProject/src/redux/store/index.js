import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import productsReducer from '../features/productsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer
  }
});

export default store