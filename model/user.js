import mongoose from "mongoose";
const UserCanSchema = new mongoose.Schema(
    {
        user_name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["admin", "user", "admin-vip"], required: true },
    },
    { timestamps: true }
);



const User = mongoose.model("User", UserCanSchema);
export default User;
