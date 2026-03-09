const youtubeService = require('./youtubeService');

// YouTube channel IDs and information for cartoons
const CARTOON_CHANNELS = {
  bluey: {
    name: 'Bluey',
    channelId: 'UC42KDR80LW4EjEn5M0eTJg',
    description: 'Educational and fun adventures',
    icon: 'dog',
  },
  peppa_pig: {
    name: 'Peppa Pig',
    channelId: 'UCwR8iBGwL4xFMaWJ4v31r3w',
    description: 'Fun family stories',
    icon: 'pig',
  },
  puffin_rock: {
    name: 'Puffin Rock',
    channelId: 'UCLp66IwFmAVy5i-ck8BTCHQ',
    description: 'Nature and adventure stories',
    icon: 'bird',
  },
  daniel_tiger: {
    name: 'Daniel Tiger',
    channelId: 'UCTzXp8bVTkWLLx0SRXLOXNg',
    description: 'Learning and emotions',
    icon: 'tiger',
  },
  cocomelon: {
    name: 'Cocomelon',
    channelId: 'UCjwhUcAN3U3YiqeVxHBqG8A',
    description: 'Songs and nursery rhymes',
    icon: 'music-box-multiple',
  },
  bubble_guppies: {
    name: 'Bubble Guppies',
    channelId: 'UC2Yg3Y0Fdk6E5Hdt0n7LrRA',
    description: 'Educational underwater fun',
    icon: 'water',
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
  getLullabies,
  searchCartoons,
  getPopularCartoons,
  getCartoonChannels,
  getCartoonChannelVideos,
  getAllCartoons,
};
