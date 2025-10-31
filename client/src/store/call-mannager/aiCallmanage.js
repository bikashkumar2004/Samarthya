// src/store/call-mannager/aiCallmanage.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/aiCall";

const initialState = {
  live: {
    isLoading: false,
    data: [],
    error: null,
    lastFetchedAt: null,
    polling: false,
  },
  all: {
    isLoading: false,
    data: [],
    page: 1,
    pageSize: 100,
    sort: "updated_at_iso",
    order: "desc",
    error: null,
  },
};

export const fetchLiveMonitor = createAsyncThunk(
  "calls/fetchLiveMonitor",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/live-monitor`, {
        withCredentials: true,
      });
      return res?.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load live monitor"
      );
    }
  }
);

export const fetchAllCalls = createAsyncThunk(
  "calls/fetchAllCalls",
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const s = getState().calls.all;
      const query = {
        page: params.page ?? s.page,
        pageSize: params.pageSize ?? s.pageSize,
        sort: params.sort ?? s.sort,
        order: params.order ?? s.order,
      };
      const res = await axios.get(`${API_URL}/fetch`, {
        params: query,
        withCredentials: true,
      });
      return res?.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch calls"
      );
    }
  }
);

const callsSlice = createSlice({
  name: "calls",
  initialState,
  reducers: {
    startLivePolling(state) {
      state.live.polling = true;
    },
    stopLivePolling(state) {
      state.live.polling = false;
    },
    resetLive(state) {
      state.live = {
        isLoading: false,
        data: [],
        error: null,
        lastFetchedAt: null,
        polling: false,
      };
    },
    setAllPage(state, action) {
      state.all.page = action.payload || 1;
    },
    setAllPageSize(state, action) {
      state.all.pageSize = action.payload || 100;
    },
    setAllSort(state, action) {
      const { sort = "updated_at_iso", order = "desc" } = action.payload || {};
      state.all.sort = sort;
      state.all.order = order;
    },
    resetAll(state) {
      state.all = {
        isLoading: false,
        data: [],
        page: 1,
        pageSize: 100,
        sort: "updated_at_iso",
        order: "desc",
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveMonitor.pending, (state) => {
        state.live.isLoading = true;
        state.live.error = null;
      })
      .addCase(fetchLiveMonitor.fulfilled, (state, action) => {
        state.live.isLoading = false;
        state.live.data = action.payload?.data || [];
        state.live.lastFetchedAt = Date.now();
      })
      .addCase(fetchLiveMonitor.rejected, (state, action) => {
        state.live.isLoading = false;
        state.live.error = action.payload || "Live monitor fetch failed";
      })
      .addCase(fetchAllCalls.pending, (state) => {
        state.all.isLoading = true;
        state.all.error = null;
      })
      .addCase(fetchAllCalls.fulfilled, (state, action) => {
        state.all.isLoading = false;
        state.all.data = action.payload?.data || [];
        state.all.page = action.payload?.page || state.all.page;
        state.all.pageSize = action.payload?.pageSize || state.all.pageSize;
      })
      .addCase(fetchAllCalls.rejected, (state, action) => {
        state.all.isLoading = false;
        state.all.error = action.payload || "Fetch all calls failed";
      });
  },
});

export const {
  startLivePolling,
  stopLivePolling,
  resetLive,
  setAllPage,
  setAllPageSize,
  setAllSort,
  resetAll,
} = callsSlice.actions;

export const selectLiveData = (s) => s.calls.live.data;
export const selectLiveLoading = (s) => s.calls.live.isLoading;
export const selectLivePolling = (s) => s.calls.live.polling;

export const selectAllRows = (s) => s.calls.all.data;
export const selectAllMeta = (s) => ({
  page: s.calls.all.page,
  pageSize: s.calls.all.pageSize,
  sort: s.calls.all.sort,
  order: s.calls.all.order,
});

export default callsSlice.reducer;
