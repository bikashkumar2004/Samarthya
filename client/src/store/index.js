import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
// import contactListReducer from "./agent-slice";
// import contactDetailsReducer from "./agent-slice/showDetails";
import agentDetails from "./auth-slice/accountVerified"
import callInitiate from "./call-slice/index"
import uploadDetails from "./create-task/createTask"
import Campaigns from "./campaign/index.js";
import bulkCall from "./call-mannager/index.js"
import callReducer from "./call-mannager/aiCallmanage.js"
import callhistoryDisplay from "./call-mannager/callhistory.js"
import AllLeads from "./allLeads/index.js"
import pendingFollowUps from "./call-mannager/pendingFollowups.js"
import AllConcats  from "./agent-slice/allConcats.js"
import dashbord from "./dashboard/index.js"


import barchat from "./dashboard/barchat.js"
import weaklychat from "./dashboard/wealychat.js"

const store = configureStore({
  reducer: {
    auth: authReducer,
    // contactList: contactListReducer,
    // contactDetails: contactDetailsReducer,
    getdata:agentDetails,
    call:callInitiate,
    upload:uploadDetails,
    campaigns:Campaigns,
    bulkCalls:bulkCall,
    calls:callReducer,
    callHistory:callhistoryDisplay,
    leads:AllLeads,
    pendingdata:pendingFollowUps,
    contactList:AllConcats ,
    dashboardSummary:dashbord,
    categoryDistribution:barchat,
    weeklyPerformance:weaklychat,

  },
});

export default store;
