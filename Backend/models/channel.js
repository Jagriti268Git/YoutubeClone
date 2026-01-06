import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, "Channel name must be at least 3 characters"],
        maxlength: [50, "Channel name must be at most 50 characters"],
    },
    handle: {
        type: String,
        required: [true, "Channel handle is required"],
        unique: true,
        trim: true,
        minlength: [4, "Handle must be at least 4 characters (including @)"],
        maxlength: [31, "Handle must be at most 31 characters (including @)"],
        match: [
            /^@[a-zA-Z][a-zA-Z0-9._]*$/,
            "Handle must start with @, followed by a letter and can only contain letters, numbers, underscores, or periods"
        ]
    },
    profilePicture: {
        type: String,
        default: "https://via.placeholder.com/150",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

channelSchema.pre("validate", function(next) {
    if (this.handle && !this.handle.startsWith("@")) {
        this.handle = `@${this.handle}`;
    }
    next();
});

const Channel = mongoose.model("Channel", channelSchema, "Channel");
export default Channel;