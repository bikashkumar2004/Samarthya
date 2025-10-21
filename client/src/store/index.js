import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import contactListReducer from "./admin-slice";
import contactDetailsReducer from "./admin-slice/showDetails";

const store = configureStore({
  reducer: {
    auth: authReducer,
    contactList: contactListReducer,
    contactDetails: contactDetailsReducer,
  },
});

export default store;
