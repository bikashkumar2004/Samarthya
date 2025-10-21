import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import contactListReducer from "./admin-slice";
import contactDetailsReducer from "./admin-slice/showDetails";
import adminDetails from "./auth-slice/accountVerified"
import callInitiate from "./call-slice/index"

const store = configureStore({
  reducer: {
    auth: authReducer,
    contactList: contactListReducer,
    contactDetails: contactDetailsReducer,
    getdata:adminDetails,
    call:callInitiate
  },
});

export default store;
