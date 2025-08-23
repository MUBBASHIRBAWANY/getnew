import mongoose from "mongoose";

const userRoleSchema = new mongoose.Schema({
  RoleName: {
    type: String,
    required: true,
  },
  Roles: {
    type: Object,
    required: true,
  },
  createdBy: {
    type: String,
  },
  updatedBy: {
    type: String,
  },
  createDate: {
    type: String,
  },
  updateDate: {
    type: String,
  },
});

// ✅ Fix OverwriteModelError by reusing existing model if already compiled
const UserRoleModel =
  mongoose.models.UserRole || mongoose.model("UserRole", userRoleSchema);

export default UserRoleModel;
