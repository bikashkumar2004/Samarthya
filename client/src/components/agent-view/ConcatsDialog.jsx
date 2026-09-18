import React, { useEffect, useMemo, useState } from "react";
import { Phone, Mail, MessageCircle, MessageSquare, X, Hash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { showContactList } from "@/store/agent-slice/showDetails";
import { callInitiate, resetCallState } from "@/store/call-slice";
import { toast } from "sonner";

export default function DetailDialog({ isOpen, setIsOpen, id }) {
  const [loading, setLoading] = useState(null);
  const dispatch = useDispatch(); // provides dispatch function for actions [web:215]

  const { contactDetails, isLoading: detailsLoading } = useSelector((state) => state.contactDetails); // select detail slice [web:215]

  const { isLoading: callLoading, successMessage, error: callError } = useSelector((state) => state.call); // select call slice [web:215]

  useEffect(() => {
    if (isOpen && id) {
      dispatch(showContactList(id)); // thunk to load detail by id [web:199]
      dispatch(resetCallState()); // clear previous call messages/errors [web:199]
    }
  }, [isOpen, id, dispatch]); // effect wired to open + id [web:215]

  useEffect(() => {
    if (successMessage) toast.success(successMessage);
    if (callError) toast.error(callError);
  }, [successMessage, callError]); // reactive to call outcome [web:215]

  // Normalize to UploadDetails fields
  const customer = useMemo(() => {
    const c = contactDetails || {};
    return {
      _id: c._id || "",
      name: c.name || "",
      email: c.email || "",
      phoneNo: c.phoneNo || c.phone || "",
      category: c.category || "",
      description: c.description || "",
      userId: c.userId || "",
      taskId: c.taskId || "",
    };
  }, [contactDetails]); // avoid recompute on each render [web:215]

  const handleAction = async (action) => {
    if (action === "Call") {
      if (!customer._id) {
        toast.error("Missing contact id");
        return;
      }
      dispatch(callInitiate({ id: customer._id, purpose: customer.description || "General" })); // pass id+purpose [web:199]
      return;
    }
    setLoading(action);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(null);
    toast.info(`${action} automation triggered for ${customer.name || "contact"}`);
  }; // triggers call or simulates other actions [web:199]

  if (!isOpen) return null; // do not render when hidden [web:215]

  if (detailsLoading) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading contact details...</p>
        </div>
      </div>
    );
  } // basic loading state [web:215]

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto flex overflow-hidden relative sm:flex-row flex-col">
        {/* Left: Details */}
        <div className="flex-1 p-5 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Customer Details</h2>

          {/* IDs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1 flex items-center gap-1">
                <Hash className="w-3 h-3" /> Contact ID
              </p>
              <p className="text-sm sm:text-base font-mono text-gray-900 break-all">{customer._id || "—"}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1 flex items-center gap-1">
                <Hash className="w-3 h-3" /> User ID
              </p>
              <p className="text-sm sm:text-base font-mono text-gray-900 break-all">{customer.userId || "—"}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1 flex items-center gap-1">
                <Hash className="w-3 h-3" /> Task ID
              </p>
              <p className="text-sm sm:text-base font-mono text-gray-900 break-all">{customer.taskId || "—"}</p>
            </div>
          </div>

          <div>
            <p className="text-xs sm:text-sm text-gray-400 mb-1">Name</p>
            <p className="text-base sm:text-lg font-medium text-gray-900 break-words">{customer.name || "—"}</p>
          </div>

          <div>
            <p className="text-xs sm:text-sm text-gray-400 mb-1">Category</p>
            <p className="text-sm sm:text-base text-gray-700">{customer.category || "—"}</p>
          </div>

          <div>
            <p className="text-xs sm:text-sm text-gray-400 mb-1">Email</p>
            <p className="text-sm sm:text-base text-blue-600 font-medium break-all">{customer.email || "—"}</p>
          </div>

          <div>
            <p className="text-xs sm:text-sm text-gray-400 mb-1">Phone</p>
            <p className="text-sm sm:text-base text-blue-600 font-medium break-words">
              {customer.phoneNo || "—"} <span className="text-gray-500">Mobile</span>
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="w-full sm:w-2/5 bg-gray-50 border-t sm:border-t-0 sm:border-l p-5 sm:p-8 flex flex-col justify-start relative">
          <button
            onClick={() => {
              dispatch(resetCallState());
              setIsOpen(false);
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-5">Automation Actions</h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { action: "Call", icon: Phone, colors: "from-blue-500 to-blue-600" },
              { action: "Email", icon: Mail, colors: "from-purple-500 to-purple-600" },
              { action: "WhatsApp", icon: MessageCircle, colors: "from-green-500 to-green-600" },
              { action: "SMS", icon: MessageSquare, colors: "from-orange-500 to-orange-600" },
            ].map(({ action, icon: Icon, colors }) => (
              <button
                key={action}
                onClick={() => handleAction(action)}
                disabled={callLoading || loading !== null}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 bg-gradient-to-br ${colors} hover:brightness-110 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 group`}
              >
                {loading === action || (action === "Call" && callLoading) ? (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs sm:text-sm font-semibold">{action}</span>
                  </>
                )}
              </button>
            ))}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border mt-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Purpose</h4>
            <p className="text-gray-800 text-sm whitespace-pre-wrap">{customer.description || "No purpose added"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
