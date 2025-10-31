// src/redux/slices/campaignSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/campaigns";

export const createNewCampaign = createAsyncThunk(
  "campaigns/create",
  async (campaignData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/create`, campaignData, { withCredentials: true });
      return res.data.data;
    } catch (err) {
      const payload = err.response?.data || { message: err.message || "Request failed" };
      return rejectWithValue(payload);
    }
  }
);

export const getTaskById = createAsyncThunk(
  "campaigns/getTaskById",
  async ({ taskId, category }, { rejectWithValue }) => {
    try {
      const url = category
        ? `${API_URL}/get/${taskId}?category=${encodeURIComponent(category)}`
        : `${API_URL}/get/${taskId}`;
      const res = await axios.get(url, { withCredentials: true });
      return res.data.data;
    } catch (err) {
      const payload = err.response?.data || { message: err.message || "Request failed" };
      return rejectWithValue(payload);
    }
  }
);

const initialState = {
  isLoading: false,
  campaigns: [],
  taskData: null,
  error: null,
  successMessage: null,
};

const campaignSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {
    clearTaskData: (state) => {
      state.taskData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewCampaign.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns.unshift(action.payload);
        state.successMessage = "Campaign created successfully!";
      })
      .addCase(createNewCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getTaskById.pending, (state) => {
        state.isLoading = true;
        state.taskData = null;
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taskData = action.payload;
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTaskData } = campaignSlice.actions;
export default campaignSlice.reducer;
