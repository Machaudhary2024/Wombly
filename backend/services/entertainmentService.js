const youtubeService = require('./youtubeService');

// YouTube channel IDs and information for cartoons
// User-specified cartoon channels with popular/official IDs
const CARTOON_CHANNELS = {
  pink_panther: {
    name: 'Pink Panther',
    channelId: 'UCkMeyN87kTCyFZi4j_UNvZg',
    description: 'Classic animated adventures',
    icon: 'cat',
  },
  tom_jerry: {
    name: 'Tom & Jerry',
    channelId: 'UCkJDy3-cD-8l6xIjPt_8XAQ',
    description: 'Classic comedy and chases',
    icon: 'mouse',
  },
  mr_bean: {
    name: 'Mr Bean',
    channelId: 'UChFV2yF2F6gOzpDCJ7Rmy6w',
    description: 'Funny animated bean character',
    icon: 'smiley-plus',
  },
  deans_tv: {
    name: 'Dean\'s TV',
    channelId: 'UCJ0DumJQmH5rQqCXgIL_5cw',
    description: 'Educational and fun content',
    icon: 'television',
  },
  islamic_cartoon: {
    name: 'Islamic Cartoon',
    channelId: 'UCEz3-x8n7Ym2JvhN0UZr2rQ',
    description: 'Islamic educational content',
    icon: 'book-open-page-variant',
  },
};

// YouTube channel IDs and information for lullabies
const LULLABY_CHANNELS = {
  super_simple_songs: {
    name: 'Super Simple Songs',
    channelId: 'UCkRfArvrzheW2E7b6SVV-Cw',
    description: 'Songs and nursery rhymes for babies',
    icon: 'music-box',
  },
  wonderful_lullabies: {
    name: 'Wonderful Lullabies',
    channelId: 'UC5W_VPjcq5MBGvmT-eLkqig',
    description: 'Soothing lullabies for sleep',
    icon: 'moon-waning-crescent',
  },
  zeazara_kids_tv: {
    name: 'Zeazara Kids TV',
    channelId: 'UC2m5SVhCN2RNvP0MZ-qVwZQ',
    description: 'Educational songs and nursery rhymes',
    icon: 'television-box',
  },
};

/**
 * Get lullaby videos from YouTube with dynamic search
 * @param {number} maxResults - Maximum number of results
 * @param {string} searchQuery - Optional custom search query
 * @returns {Promise<Array>} Array of lullaby videos
 */
const getLullabies = async (maxResults = 10, searchQuery = null) => {
  try {
    const lullabySongs = [
      'Twinkle Twinkle Little Star lullaby',
      'Rock-a-Bye Baby lullaby',
      'Brahms Lullaby classical',
      'Hush Little Baby lullaby',
      'Sleep Little One lullaby',
      'Brahms Waltz of the Flowers',
      'baby lullaby soothing music',
      'newborn sleep music',
      'lullaby for babies sleep',
      'soft baby sleep music',
      'baby sleep sounds',
      'calming lullaby music',
      'peaceful baby music',
    ];

    // Use custom search query if provided, otherwise randomly select a lullaby keyword
    const query = searchQuery || lullabySongs[Math.floor(Math.random() * lullabySongs.length)];
    const videos = await youtubeService.searchVideos(query, maxResults);
    return videos;
  } catch (error) {
    console.error('Error fetching lullabies:', error);
    return [];
  }
};

/**
 * Search for cartoons dynamically using YouTube API
 * @param {string} searchQuery - Cartoon name or keyword to search for
 * @param {number} maxResults - Maximum number of results
 * @returns {Promise<Array>} Array of cartoon videos
 */
const searchCartoons = async (searchQuery, maxResults = 10) => {
  try {
    if (!searchQuery || searchQuery.trim().length === 0) {
      throw new Error('Search query is required');
    }
    
    const query = `${searchQuery} cartoon for kids`;
    const videos = await youtubeService.searchVideos(query, maxResults);
    return videos;
  } catch (error) {
    console.error('Error searching cartoons:', error);
    return [];
  }
};

/**
 * Get cartoon videos for multiple popular cartoons
 * @param {number} maxResults - Maximum number of results per cartoon
 * @returns {Promise<Object>} Object with cartoon videos organized by type
 */
const getPopularCartoons = async (maxResults = 8) => {
  try {
    const cartoonKeywords = [
      'Bluey',
      'Peppa Pig',
      'Cocomelon',
      'Daniel Tiger',
      'Puffin Rock',
      'Bubble Guppies',
    ];

    const cartoonResults = {};

    for (const cartoonName of cartoonKeywords) {
      const videos = await searchCartoons(cartoonName, maxResults);
      cartoonResults[cartoonName.toLowerCase().replace(/\s+/g, '_')] = {
        name: cartoonName,
        videos: videos,
      };
    }

    return cartoonResults;
  } catch (error) {
    console.error('Error fetching popular cartoons:', error);
    return {};
  }
};

/**
 * Get all cartoon channels information
 * @returns {Object} Object with all cartoon channels
 */
const getCartoonChannels = () => {
  return CARTOON_CHANNELS;
};

/**
 * Get videos from a specific cartoon channel
 * @param {string} cartoonKey - Key of the cartoon (e.g., 'bluey', 'peppa_pig')
 * @param {number} maxResults - Maximum number of results
 * @returns {Promise<Array>} Array of videos from the channel
 */
const getCartoonChannelVideos = async (cartoonKey, maxResults = 5) => {
  try {
    const cartoon = CARTOON_CHANNELS[cartoonKey.toLowerCase()];
    
    if (!cartoon) {
      throw new Error(`Cartoon "${cartoonKey}" not found. Available: ${Object.keys(CARTOON_CHANNELS).join(', ')}`);
    }

    const videos = await youtubeService.getChannelVideos(cartoon.channelId, maxResults);
    return {
      channel: cartoon,
      videos: videos,
    };
  } catch (error) {
    console.error('Error fetching cartoon videos:', error);
    return {
      channel: null,
      videos: [],
    };
  }
};

/**
 * Get all cartoons with their basic info
 * @returns {Array} Array of cartoon channel information
 */
const getAllCartoons = () => {
  return Object.entries(CARTOON_CHANNELS).map(([key, value]) => ({
    key,
    ...value,
  }));
};

module.exports = {
  CARTOON_CHANNELS,
  LULLABY_CHANNELS,
  getLullabies,
  searchCartoons,
  getPopularCartoons,
  getCartoonChannels,
  getCartoonChannelVideos,
  getAllCartoons,
};
