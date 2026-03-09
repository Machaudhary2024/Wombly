// Configuration file for YouTube API
require('dotenv').config();

module.exports = {
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  API_BASE_URL: 'https://www.googleapis.com/youtube/v3',
  MAX_RESULTS: 10,
  SAFE_SEARCH: 'strict',
  VIDEO_TYPE: 'video',
};
