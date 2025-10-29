import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/agent/create-task";


//  Upload file
export const uploadDetails = createAsyncThunk(
  "agent/uploadDetails",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, 
      });

      return response.data; 
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const fetchAllDetails = createAsyncThunk(
  "agent/fetchAllDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/upload-details`, {
        withCredentials: true,
      });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

const initialState = {
  isLoading: false,
  contactList: [],
  error: null,
  successMessage: null,
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(uploadDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message || "Upload successful";
        if (action.payload.taskId) {
          state.contactList.unshift({
            taskId: action.payload.taskId,
            fileName: action.payload.fileName,
            rows: action.payload.importedRecords,
            createdAt: new Date().toISOString(),
          });
        }
      })
      .addCase(uploadDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Upload failed";
      })
      .addCase(fetchAllDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contactList = action.payload.data || [];
      })
      .addCase(fetchAllDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch details";
      });
  },
});

export const { clearMessages } = uploadSlice.actions;
export default uploadSlice.reducer;
