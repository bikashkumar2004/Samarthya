import { configureStore } from "@reduxjs/toolkit";
import authReducerSlice from "./auth-slice/index.js"
const store=configureStore({
  reducer:{
    auth:authReducerSlice
  }
})

export default store;