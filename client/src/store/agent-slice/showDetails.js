import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/agent/contactList";

const initialState = {
  isLoading: false,
  contactDetails: null, 
  contactList: [],
  error: null,
  successMessage: null,
};

export const showContactList = createAsyncThunk(
  "admin/contactList/show",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/get/${id}`, {
        withCredentials: true,
      });

      return response.data; 
    } catch (error) {
      console.error(" Fetch contact details error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch contact details"
      );
    }
  }
);

const contactDetailsSlice = createSlice({
  name: "contactDetails",
  initialState,
  reducers: {
    clearData: (state) => {
      state.error = null;
      state.successMessage = null;
      state.contactDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(showContactList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(showContactList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contactDetails = action.payload.data || action.payload; 
        state.successMessage = "Contact fetched successfully";
      })
      .addCase(showContactList.rejected, (state, action) => {
        state.isLoading = false;
        state.contactDetails = null;
        state.error = action.payload;
      });
  },
});

export const { clearData } = contactDetailsSlice.actions;
export default contactDetailsSlice.reducer;
