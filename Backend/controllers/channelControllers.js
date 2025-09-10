import Channel from "../models/channel.js";

// @desc Create a new channel
// @route POST /api/channels
export const createChannel = async(req, res) => {
    try {
        const userId = req.user._id; // logged-in user

        let { name, handle } = req.body;

        if (!name || !handle) {
            return res.status(400).json({ message: "Name and handle are required" });
        }

        name = name.trim();
        handle = handle.toLowerCase().trim();

        // Check for duplicate handle
        const existing = await Channel.findOne({ handle });
        if (existing) {
            return res.status(400).json({ message: "Handle already exists" });
        }

        const channel = await Channel.create({
            name,
            handle,
            user: userId,
            profilePicture: req.file ?
                `/uploads/${req.file.filename}` : "https://via.placeholder.com/150",
        });

        res.status(201).json(channel);
    } catch (error) {
        console.error("Error creating channel:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc Get channel by handle
// @route GET /api/channels/:handle
export const getChannelByHandle = async(req, res) => {
    try {
        const channel = await Channel.findOne({
            handle: req.params.handle.toLowerCase(),
        });
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }
        res.json(channel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};