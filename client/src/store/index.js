import { configureStore } from "@reduxjs/toolkit";
import authReducerSlice from "./auth-slice/index.js";
import contactReducerSlice from "./auth-slice/index.js"
const store=configureStore({
  reducer:{
    auth:authReducerSlice,
    contactList:contactReducerSlice
  }
})

export default store;