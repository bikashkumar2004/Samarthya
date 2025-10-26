import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import contactListReducer from "./agent-slice";
import contactDetailsReducer from "./agent-slice/showDetails";
import agentDetails from "./auth-slice/accountVerified"
import callInitiate from "./call-slice/index"

const store = configureStore({
  reducer: {
    auth: authReducer,
    contactList: contactListReducer,
    contactDetails: contactDetailsReducer,
    getdata:agentDetails,
    call:callInitiate
  },
});

export default store;
