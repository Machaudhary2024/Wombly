const { YOUTUBE_API_KEY, API_BASE_URL, SAFE_SEARCH, VIDEO_TYPE } = require('./config');

// Video category mappings for Wombly app
const VIDEO_CATEGORIES = {
  pregnancy: {
    keywords: 'pregnancy care tips pregnancy guidance',
    maxResults: 5,
  },
  toddler: {
    keywords: 'toddler care tips child development',
    maxResults: 5,
  },
  hygiene: {
    keywords: 'baby hygiene child hygiene handwashing',
    maxResults: 5,
  },
  nutrition: {
    keywords: 'pregnancy nutrition baby nutrition toddler meals',
    maxResults: 5,
  },
  postpartum: {
    keywords: 'postpartum recovery postpartum care',
    maxResults: 5,
  },
  firstaid: {
    keywords: 'first aid kids baby first aid emergency care',
    maxResults: 5,
  },
  entertainment: {
    keywords: 'kids songs baby songs nursery rhymes playtime',
    maxResults: 5,
  },
};

/**
 * Search YouTube videos by keyword
 * @param {string} searchQuery - Search query string
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Promise<Array>} Array of video results
 */
const searchVideos = async (searchQuery, maxResults = 3) => {
  const url = `${API_BASE_URL}/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=${VIDEO_TYPE}&maxResults=${maxResults}&safeSearch=${SAFE_SEARCH}&key=${YOUTUBE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('YouTube API Error:', data.error.message);
      return [];
    }

    if (!data.items || data.items.length === 0) {
      console.warn(`No videos found for query: ${searchQuery}`);
      return [];
    }

    return data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};

/**
 * Get videos from a specific channel
 * @param {string} channelId - YouTube channel ID
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Promise<Array>} Array of video results
 */
const getChannelVideos = async (channelId, maxResults = 5) => {
  const url = `${API_BASE_URL}/search?part=snippet&channelId=${channelId}&type=${VIDEO_TYPE}&order=date&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('YouTube API Error:', data.error.message);
      return [];
    }

    return data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    return [];
  }
};

/**
 * Get videos from a playlist
 * @param {string} playlistId - YouTube playlist ID
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Promise<Array>} Array of video results
 */
const getPlaylistVideos = async (playlistId, maxResults = 10) => {
  const url = `${API_BASE_URL}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('YouTube API Error:', data.error.message);
      return [];
    }

    return data.items.map((item) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
      url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
    }));
  } catch (error) {
    console.error('Error fetching playlist videos:', error);
    return [];
  }
};

/**
 * Get videos by category (pregnancy, toddler, hygiene, etc.)
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of video results
 */
const getVideosByCategory = async (category) => {
  try {
    const categoryInfo = VIDEO_CATEGORIES[category.toLowerCase()];

    if (!categoryInfo) {
      throw new Error(`Category "${category}" not found. Available categories: ${Object.keys(VIDEO_CATEGORIES).join(', ')}`);
    }

    const videos = await searchVideos(categoryInfo.keywords, categoryInfo.maxResults);
    return videos;
  } catch (error) {
    console.error('Get videos by category error:', error);
    return [];
  }
};

/**
 * Get videos by specific subcategory (e.g., 'diaper care', 'bathing')
 * @param {string} category - Main category
 * @param {string} subcategory - Specific topic
 * @returns {Promise<Array>} Array of video results
 */
const getVideosBySubcategory = async (category, subcategory) => {
  try {
    const categoryInfo = VIDEO_CATEGORIES[category.toLowerCase()];

    if (!categoryInfo) {
      throw new Error(`Category "${category}" not found`);
    }

    const searchQuery = `${categoryInfo.keywords} ${subcategory}`;
    const videos = await searchVideos(searchQuery, 5);
    return videos;
  } catch (error) {
    console.error('Get videos by subcategory error:', error);
    return [];
  }
};

/**
 * Get all available categories
 * @returns {Object} Object with available categories and their descriptions
 */
const getAvailableCategories = () => {
  return {
    categories: Object.keys(VIDEO_CATEGORIES),
    details: {
      pregnancy: 'Pregnancy care, tips, and guidance',
      toddler: 'Toddler care and child development',
      hygiene: 'Baby hygiene, handwashing, and cleanliness',
      nutrition: 'Pregnancy and toddler nutrition',
      postpartum: 'Postpartum recovery and care',
      firstaid: 'First aid for babies and children',
      entertainment: 'Kids songs, nursery rhymes, and play',
    },
  };
};

module.exports = {
  searchVideos,
  getChannelVideos,
  getPlaylistVideos,
  getVideosByCategory,
  getVideosBySubcategory,
  getAvailableCategories,
};
