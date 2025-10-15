import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/auth";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);


export const loginUser = createAsyncThunk("auth/login", async (formData) => {
  const response = await axios.post(`${API_URL}/login`, formData, {
    withCredentials: true,
  });
  return response.data;
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  const response = await axios.post(
    `${API_URL}/logout`,
    {},
    { withCredentials: true }
  );
  return response.data;
});

export const sendVerifyOTP = createAsyncThunk(
  "auth/send-verify-otp",
  async ({ formData, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/send-verify-otp`,
        { ...formData, otp }, // merge both formData and otp into one object
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to send OTP" });
    }
  }
);


export const verifyAccount = createAsyncThunk(
  "auth/verify-account",
  async (formData) => {
    const response = await axios.post(`${API_URL}/verify-account`, formData, {
      withCredentials: true,
    });
    return response.data;
  }
);

export const checkAuth = createAsyncThunk("auth/is-auth", async () => {
  const response = await axios.get(`${API_URL}/is-auth`, {
    withCredentials: true,
  });

  return response.data;
});

export const resetOTP = createAsyncThunk("auth/reset-OTP", async (formData) => {
  const response = await axios.post(`${API_URL}/reset-OTP`, formData, {
    withCredentials: true,
  });
  return response.data;
});

export const resetPassword = createAsyncThunk(
  "auth/reset-Password",
  async (formData) => {
    const response = await axios.post(`${API_URL}/reset-Password`, formData, {
      withCredentials: true,
    });
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Reducer to manually set user state, often useful after successful async actions or for clearing state
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    // REGISTER
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // User may not be authenticated immediately after register (needs verification)
        state.isAuthenticated = action.payload.isAuthenticated || false;
        state.user = action.payload.user || null;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = !!action.payload.success; // Assuming 'success' means authentication worked
        state.user = action.payload.user || null;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // LOGOUT (Added pending and rejected for completeness and consistency)
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
      })

      // SEND VERIFY OTP
      .addCase(sendVerifyOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendVerifyOTP.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendVerifyOTP.rejected, (state) => {
        state.isLoading = false;
      })

      // VERIFY ACCOUNT
      .addCase(verifyAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        // Upon successful verification, the user should be authenticated and the user object updated.
        state.isAuthenticated = !!action.payload.success;
        state.user = action.payload.user || null;
      })
      .addCase(verifyAccount.rejected, (state) => {
        state.isLoading = false;
      })

      // CHECK AUTH (Added pending for initial app load consistency)
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = !!action.payload.isAuthenticated;
        state.user = action.payload.user || null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // RESET OTP
      .addCase(resetOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetOTP.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetOTP.rejected, (state) => {
        state.isLoading = false;
      })

      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
