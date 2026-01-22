import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(
        'http://localhost/User/api/products/index.php'
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );

      console.log("FETCH PRODUCTS RESPONSE:", response.data); // 👈 confirm
      return response.data; // 👈 MUST return array
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: 'Failed to fetch products' }
      );
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch products';
      });
      
  }
});

export default productsSlice.reducer;