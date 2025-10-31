import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import contactListReducer from "./agent-slice";
import contactDetailsReducer from "./agent-slice/showDetails";
import agentDetails from "./auth-slice/accountVerified"
import callInitiate from "./call-slice/index"
import uploadDetails from "./create-task/createTask"
import Campaigns from "./campaign/index.js";
import bulkCall from "./call-mannager/index.js"
import callReducer from "./call-mannager/aiCallmanage.js"
import callhistoryDisplay from "./call-mannager/callhistory.js"


const store = configureStore({
  reducer: {
    auth: authReducer,
    contactList: contactListReducer,
    contactDetails: contactDetailsReducer,
    getdata:agentDetails,
    call:callInitiate,
    upload:uploadDetails,
    campaigns:Campaigns,
    bulkCalls:bulkCall,
    calls:callReducer,
    callHistory:callhistoryDisplay,
  },
});

export default store;
