import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/campaigns";

export const fetchAllCampaigns = createAsyncThunk(
  "campaigns/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/retrive`, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createNewCampaign = createAsyncThunk(
  "campaigns/create",
  async (campaignData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/create`, campaignData, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateCampaign = createAsyncThunk(
  "campaigns/update",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/update/${id}`, updatedData, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteCampaign = createAsyncThunk(
  "campaigns/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_URL}/delete/${id}`, {
        withCredentials: true,
      });
      return { id, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getTaskById = createAsyncThunk(
  "tasks/getById",
  async (taskId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/get-task/${taskId}`, {
        withCredentials: true,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  isLoading: false,
  campaigns: {
    active: [],
    scheduled: [],
    completed: [],
    draft: [],
  },
  taskDetails: null,
  error: null,
};

const campaignSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {
    clearTaskDetails: (state) => {
      state.taskDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCampaigns.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllCampaigns.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns = action.payload;
        state.error = null;
      })
      .addCase(fetchAllCampaigns.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createNewCampaign.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns.active.unshift(action.payload);
      })
      .addCase(createNewCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload;
        const allGroups = Object.keys(state.campaigns);
        allGroups.forEach((group) => {
          const idx = state.campaigns[group].findIndex(
            (c) => c._id === updated._id
          );
          if (idx !== -1) {
            state.campaigns[group][idx] = updated;
          }
        });
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        const { id } = action.payload;
        const allGroups = Object.keys(state.campaigns);
        allGroups.forEach((group) => {
          state.campaigns[group] = state.campaigns[group].filter(
            (c) => c._id !== id
          );
        });
      })
      .addCase(getTaskById.pending, (state) => {
        state.isLoading = true;
        state.taskDetails = null;
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taskDetails = action.payload;
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTaskDetails } = campaignSlice.actions;
export default campaignSlice.reducer;
