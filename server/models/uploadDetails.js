import mongoose, { Schema } from "mongoose";

const uploaduserDetails = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phoneNo: {
      type: String,
      required: true,
      trim: true,
      set: (value) => {
        if (!value.startsWith("+91")) {
          return `+91${value.replace(/^(\+91)?/, "")}`;
        }
        return value;
      },
    },
    email: { type: String, required: true, lowercase: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    taskId: { type: Schema.Types.ObjectId, ref: "TaskDetails", required: true },
  },
  { timestamps: true }
);

uploaduserDetails.pre("save", function (next) {
  if (this.phoneNo && !this.phoneNo.startsWith("+91")) {
    this.phoneNo = `+91${this.phoneNo.replace(/^(\+91)?/, "")}`;
  }
  next();
});

const UploadDetails = mongoose.model("UploadDetails", uploaduserDetails);
export default UploadDetails;
