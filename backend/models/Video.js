const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["cartoon", "lullaby", "first_aid"],
      required: true,
    },
    channel: {
      type: String,
      required: function() {
        return this.type !== "first_aid";
      },
    },
    topic: {
      type: String,
      required: function() {
        return this.type === "first_aid";
      },
    },
    title: {
      type: String,
      required: true,
    },
    youtubeUrl: {
      type: String,
      required: true,
    },
    videoId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    addedBy: {
      type: String,
      default: "admin",
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
videoSchema.index({ type: 1, channel: 1 });
videoSchema.index({ type: 1, topic: 1 });

module.exports = mongoose.model("Video", videoSchema);
