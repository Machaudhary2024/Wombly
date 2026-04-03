const { YOUTUBE_API_KEY, API_BASE_URL, SAFE_SEARCH, VIDEO_TYPE } = require('./config');

// Channel-specific mock video data for when YouTube API quota is exceeded
const MOCK_VIDEOS_BY_CHANNEL = {
  // Cartoon channels
  pink_panther: [
    { id: 'pink_1', title: 'Pink Panther - Episode 1', description: 'Classic Pink Panther adventure', thumbnail: 'https://i.ytimg.com/vi/Dqd8rqtJqnQ/default.jpg', channelTitle: 'Pink Panther', publishedAt: '2020-01-01T00:00:00Z', url: 'https://www.youtube.com/watch?v=Dqd8rqtJqnQ' },
    { id: 'pink_2', title: 'Pink Panther - Episode 2', description: 'Pink Panther jungle adventure', thumbnail: 'https://i.ytimg.com/vi/P1wZ4qC3Q0w/default.jpg', channelTitle: 'Pink Panther', publishedAt: '2020-01-02T00:00:00Z', url: 'https://www.youtube.com/watch?v=P1wZ4qC3Q0w' },
    { id: 'pink_3', title: 'Pink Panther - Episode 3', description: 'Pink Panther funny moments', thumbnail: 'https://i.ytimg.com/vi/W7x2W0LZTxc/default.jpg', channelTitle: 'Pink Panther', publishedAt: '2020-01-03T00:00:00Z', url: 'https://www.youtube.com/watch?v=W7x2W0LZTxc' },
    { id: 'pink_4', title: 'Pink Panther - Episode 4', description: 'Pink Panther amazing adventure', thumbnail: 'https://i.ytimg.com/vi/8GyV5E_0P8o/default.jpg', channelTitle: 'Pink Panther', publishedAt: '2020-01-04T00:00:00Z', url: 'https://www.youtube.com/watch?v=8GyV5E_0P8o' },
    { id: 'pink_5', title: 'Pink Panther - Episode 5', description: 'Pink Panther best scenes', thumbnail: 'https://i.ytimg.com/vi/xqJf5R_Vbdo/default.jpg', channelTitle: 'Pink Panther', publishedAt: '2020-01-05T00:00:00Z', url: 'https://www.youtube.com/watch?v=xqJf5R_Vbdo' },
  ],
  tom_jerry: [
    { id: 'tom_1', title: 'Tom and Jerry - Episode 1', description: 'Classic Tom and Jerry chase', thumbnail: 'https://i.ytimg.com/vi/0K6rPly0Yl8/default.jpg', channelTitle: 'Tom and Jerry', publishedAt: '2020-02-01T00:00:00Z', url: 'https://www.youtube.com/watch?v=0K6rPly0Yl8' },
    { id: 'tom_2', title: 'Tom and Jerry - Episode 2', description: 'Tom and Jerry funny moments', thumbnail: 'https://i.ytimg.com/vi/cSL6mYCCzVE/default.jpg', channelTitle: 'Tom and Jerry', publishedAt: '2020-02-02T00:00:00Z', url: 'https://www.youtube.com/watch?v=cSL6mYCCzVE' },
    { id: 'tom_3', title: 'Tom and Jerry - Episode 3', description: 'Tom and Jerry comedy', thumbnail: 'https://i.ytimg.com/vi/zqFvwKZZpQE/default.jpg', channelTitle: 'Tom and Jerry', publishedAt: '2020-02-03T00:00:00Z', url: 'https://www.youtube.com/watch?v=zqFvwKZZpQE' },
    { id: 'tom_4', title: 'Tom and Jerry - Episode 4', description: 'Tom chases Jerry', thumbnail: 'https://i.ytimg.com/vi/7VhZqScB1RY/default.jpg', channelTitle: 'Tom and Jerry', publishedAt: '2020-02-04T00:00:00Z', url: 'https://www.youtube.com/watch?v=7VhZqScB1RY' },
    { id: 'tom_5', title: 'Tom and Jerry - Episode 5', description: 'Best Tom and Jerry adventures', thumbnail: 'https://i.ytimg.com/vi/r6BhHSkyKQc/default.jpg', channelTitle: 'Tom and Jerry', publishedAt: '2020-02-05T00:00:00Z', url: 'https://www.youtube.com/watch?v=r6BhHSkyKQc' },
  ],
  mr_bean: [
    { id: 'bean_1', title: 'Mr Bean - Funny Episode 1', description: 'Mr Bean hilarious moments', thumbnail: 'https://i.ytimg.com/vi/t6-F7SgFfA0/default.jpg', channelTitle: 'Mr Bean', publishedAt: '2020-03-01T00:00:00Z', url: 'https://www.youtube.com/watch?v=t6-F7SgFfA0' },
    { id: 'bean_2', title: 'Mr Bean - Funny Episode 2', description: 'Mr Bean adventures', thumbnail: 'https://i.ytimg.com/vi/Ygvl83Z_Xt0/default.jpg', channelTitle: 'Mr Bean', publishedAt: '2020-03-02T00:00:00Z', url: 'https://www.youtube.com/watch?v=Ygvl83Z_Xt0' },
    { id: 'bean_3', title: 'Mr Bean - Funny Episode 3', description: 'Mr Bean comedy show', thumbnail: 'https://i.ytimg.com/vi/0iIx7Sj4--s/default.jpg', channelTitle: 'Mr Bean', publishedAt: '2020-03-03T00:00:00Z', url: 'https://www.youtube.com/watch?v=0iIx7Sj4--s' },
    { id: 'bean_4', title: 'Mr Bean - Funny Episode 4', description: 'Mr Bean best scenes', thumbnail: 'https://i.ytimg.com/vi/VCQfUEkJW_E/default.jpg', channelTitle: 'Mr Bean', publishedAt: '2020-03-04T00:00:00Z', url: 'https://www.youtube.com/watch?v=VCQfUEkJW_E' },
    { id: 'bean_5', title: 'Mr Bean - Funny Episode 5', description: 'Mr Bean entertainment', thumbnail: 'https://i.ytimg.com/vi/sVc7DEuAEIc/default.jpg', channelTitle: 'Mr Bean', publishedAt: '2020-03-05T00:00:00Z', url: 'https://www.youtube.com/watch?v=sVc7DEuAEIc' },
  ],
  deans_tv: [
    { id: 'deans_1', title: 'Dean\'s TV - Educational 1', description: 'Fun learning with Dean', thumbnail: 'https://i.ytimg.com/vi/eT_mKWn8Zzk/default.jpg', channelTitle: 'Dean\'s TV', publishedAt: '2020-04-01T00:00:00Z', url: 'https://www.youtube.com/watch?v=eT_mKWn8Zzk' },
    { id: 'deans_2', title: 'Dean\'s TV - Educational 2', description: 'Learning adventure with Dean', thumbnail: 'https://i.ytimg.com/vi/Z0-8fJx_rnE/default.jpg', channelTitle: 'Dean\'s TV', publishedAt: '2020-04-02T00:00:00Z', url: 'https://www.youtube.com/watch?v=Z0-8fJx_rnE' },
    { id: 'deans_3', title: 'Dean\'s TV - Educational 3', description: 'Fun content with Dean', thumbnail: 'https://i.ytimg.com/vi/M3E1C9nEVcc/default.jpg', channelTitle: 'Dean\'s TV', publishedAt: '2020-04-03T00:00:00Z', url: 'https://www.youtube.com/watch?v=M3E1C9nEVcc' },
    { id: 'deans_4', title: 'Dean\'s TV - Educational 4', description: 'Animated stories with Dean', thumbnail: 'https://i.ytimg.com/vi/XFkHNNKQKgw/default.jpg', channelTitle: 'Dean\'s TV', publishedAt: '2020-04-04T00:00:00Z', url: 'https://www.youtube.com/watch?v=XFkHNNKQKgw' },
    { id: 'deans_5', title: 'Dean\'s TV - Educational 5', description: 'Best Dean\'s TV episodes', thumbnail: 'https://i.ytimg.com/vi/Kx3C9M6JCRE/default.jpg', channelTitle: 'Dean\'s TV', publishedAt: '2020-04-05T00:00:00Z', url: 'https://www.youtube.com/watch?v=Kx3C9M6JCRE' },
  ],
  islamic_cartoon: [
    { id: 'islam_1', title: 'Islamic Cartoon - Episode 1', description: 'Islamic educational content', thumbnail: 'https://i.ytimg.com/vi/2VnKyXxDR_o/default.jpg', channelTitle: 'Islamic Cartoon', publishedAt: '2020-05-01T00:00:00Z', url: 'https://www.youtube.com/watch?v=2VnKyXxDR_o' },
    { id: 'islam_2', title: 'Islamic Cartoon - Episode 2', description: 'Islamic stories for kids', thumbnail: 'https://i.ytimg.com/vi/eN7kK2r1r_U/default.jpg', channelTitle: 'Islamic Cartoon', publishedAt: '2020-05-02T00:00:00Z', url: 'https://www.youtube.com/watch?v=eN7kK2r1r_U' },
    { id: 'islam_3', title: 'Islamic Cartoon - Episode 3', description: 'Islamic lessons for children', thumbnail: 'https://i.ytimg.com/vi/PNDhz_-uPDs/default.jpg', channelTitle: 'Islamic Cartoon', publishedAt: '2020-05-03T00:00:00Z', url: 'https://www.youtube.com/watch?v=PNDhz_-uPDs' },
    { id: 'islam_4', title: 'Islamic Cartoon - Episode 4', description: 'Islamic education entertainment', thumbnail: 'https://i.ytimg.com/vi/4DhxhZ7Kbdk/default.jpg', channelTitle: 'Islamic Cartoon', publishedAt: '2020-05-04T00:00:00Z', url: 'https://www.youtube.com/watch?v=4DhxhZ7Kbdk' },
    { id: 'islam_5', title: 'Islamic Cartoon - Episode 5', description: 'Islamic kids entertainment', thumbnail: 'https://i.ytimg.com/vi/7C3EFfVVbCU/default.jpg', channelTitle: 'Islamic Cartoon', publishedAt: '2020-05-05T00:00:00Z', url: 'https://www.youtube.com/watch?v=7C3EFfVVbCU' },
  ],
  // Lullaby channels
  SuperSimpleSongs: [
    { id: 'sss_1', title: 'Super Simple Songs - The Wheels on the Bus', description: 'Nursery rhyme for babies', thumbnail: 'https://i.ytimg.com/vi/E5wFMwP0HEY/default.jpg', channelTitle: 'Super Simple Songs', publishedAt: '2020-06-01T00:00:00Z', url: 'https://www.youtube.com/watch?v=E5wFMwP0HEY' },
    { id: 'sss_2', title: 'Super Simple Songs - Twinkle Twinkle Little Star', description: 'Classic lullaby', thumbnail: 'https://i.ytimg.com/vi/SBJUD7EjWFc/default.jpg', channelTitle: 'Super Simple Songs', publishedAt: '2020-06-02T00:00:00Z', url: 'https://www.youtube.com/watch?v=SBJUD7EjWFc' },
    { id: 'sss_3', title: 'Super Simple Songs - Old MacDonald', description: 'Farm songs for kids', thumbnail: 'https://i.ytimg.com/vi/7x85DwqdzJk/default.jpg', channelTitle: 'Super Simple Songs', publishedAt: '2020-06-03T00:00:00Z', url: 'https://www.youtube.com/watch?v=7x85DwqdzJk' },
    { id: 'sss_4', title: 'Super Simple Songs - Bingo', description: 'Dog song for children', thumbnail: 'https://i.ytimg.com/vi/sKV-oT0cM9s/default.jpg', channelTitle: 'Super Simple Songs', publishedAt: '2020-06-04T00:00:00Z', url: 'https://www.youtube.com/watch?v=sKV-oT0cM9s' },
    { id: 'sss_5', title: 'Super Simple Songs - ABC Song', description: 'Alphabet learning song', thumbnail: 'https://i.ytimg.com/vi/75p-N7SJNic/default.jpg', channelTitle: 'Super Simple Songs', publishedAt: '2020-06-05T00:00:00Z', url: 'https://www.youtube.com/watch?v=75p-N7SJNic' },
  ],
  ZeaZaraKidsTV: [
    { id: 'zeazara_1', title: 'Zea Zara - Nursery Rhymes 1', description: 'Creative kids songs', thumbnail: 'https://i.ytimg.com/vi/67Yd-BI8EYc/default.jpg', channelTitle: 'Zea Zara Kids TV', publishedAt: '2020-07-01T00:00:00Z', url: 'https://www.youtube.com/watch?v=67Yd-BI8EYc' },
    { id: 'zeazara_2', title: 'Zea Zara - Baby Rhymes 2', description: 'Fun children songs', thumbnail: 'https://i.ytimg.com/vi/Aa36XBHX2Q8/default.jpg', channelTitle: 'Zea Zara Kids TV', publishedAt: '2020-07-02T00:00:00Z', url: 'https://www.youtube.com/watch?v=Aa36XBHX2Q8' },
    { id: 'zeazara_3', title: 'Zea Zara - Kids Songs 3', description: 'Playful nursery rhymes', thumbnail: 'https://i.ytimg.com/vi/q7vLhLJ0VBI/default.jpg', channelTitle: 'Zea Zara Kids TV', publishedAt: '2020-07-03T00:00:00Z', url: 'https://www.youtube.com/watch?v=q7vLhLJ0VBI' },
    { id: 'zeazara_4', title: 'Zea Zara - Learning Songs 4', description: 'Educational children content', thumbnail: 'https://i.ytimg.com/vi/Hlk6gvBBl3c/default.jpg', channelTitle: 'Zea Zara Kids TV', publishedAt: '2020-07-04T00:00:00Z', url: 'https://www.youtube.com/watch?v=Hlk6gvBBl3c' },
    { id: 'zeazara_5', title: 'Zea Zara - Lullabies 5', description: 'Sleep time songs', thumbnail: 'https://i.ytimg.com/vi/4oQwqRvveCc/default.jpg', channelTitle: 'Zea Zara Kids TV', publishedAt: '2020-07-05T00:00:00Z', url: 'https://www.youtube.com/watch?v=4oQwqRvveCc' },
  ],
  Kidzone: [
    { id: 'kidzone_1', title: 'Kidzone - Relaxing Songs 1', description: 'Calm children music', thumbnail: 'https://i.ytimg.com/vi/oWXGJQWcEGA/default.jpg', channelTitle: 'Kidzone', publishedAt: '2020-08-01T00:00:00Z', url: 'https://www.youtube.com/watch?v=oWXGJQWcEGA' },
    { id: 'kidzone_2', title: 'Kidzone - Sleep Songs 2', description: 'Soothing bedtime songs', thumbnail: 'https://i.ytimg.com/vi/lKa9dWstKMk/default.jpg', channelTitle: 'Kidzone', publishedAt: '2020-08-02T00:00:00Z', url: 'https://www.youtube.com/watch?v=lKa9dWstKMk' },
    { id: 'kidzone_3', title: 'Kidzone - Baby Rhymes 3', description: 'Fun nursery rhymes', thumbnail: 'https://i.ytimg.com/vi/67Yd-BI8EYc/default.jpg', channelTitle: 'Kidzone', publishedAt: '2020-08-03T00:00:00Z', url: 'https://www.youtube.com/watch?v=67Yd-BI8EYc' },
    { id: 'kidzone_4', title: 'Kidzone - Night Time 4', description: 'Peaceful sleep music', thumbnail: 'https://i.ytimg.com/vi/J2rfp6lMX28/default.jpg', channelTitle: 'Kidzone', publishedAt: '2020-08-04T00:00:00Z', url: 'https://www.youtube.com/watch?v=J2rfp6lMX28' },
    { id: 'kidzone_5', title: 'Kidzone - Lullaby Collection 5', description: 'Best sleep time songs', thumbnail: 'https://i.ytimg.com/vi/Z2E2Y5e0M14/default.jpg', channelTitle: 'Kidzone', publishedAt: '2020-08-05T00:00:00Z', url: 'https://www.youtube.com/watch?v=Z2E2Y5e0M14' },
  ],
  BabyTV: [
    { id: 'babytv_1', title: 'BabyTV - Gentle Lullabies 1', description: 'Soft music for babies', thumbnail: 'https://i.ytimg.com/vi/lKa9dWstKMk/default.jpg', channelTitle: 'BabyTV', publishedAt: '2020-09-01T00:00:00Z', url: 'https://www.youtube.com/watch?v=lKa9dWstKMk' },
    { id: 'babytv_2', title: 'BabyTV - Sleep Time 2', description: 'Relaxing music for sleeping', thumbnail: 'https://i.ytimg.com/vi/J2rfp6lMX28/default.jpg', channelTitle: 'BabyTV', publishedAt: '2020-09-02T00:00:00Z', url: 'https://www.youtube.com/watch?v=J2rfp6lMX28' },
    { id: 'babytv_3', title: 'BabyTV - Baby Songs 3', description: 'Soothing songs for infants', thumbnail: 'https://i.ytimg.com/vi/67Yd-BI8EYc/default.jpg', channelTitle: 'BabyTV', publishedAt: '2020-09-03T00:00:00Z', url: 'https://www.youtube.com/watch?v=67Yd-BI8EYc' },
    { id: 'babytv_4', title: 'BabyTV - Bedtime Classics 4', description: 'Classic baby songs', thumbnail: 'https://i.ytimg.com/vi/SBJUD7EjWFc/default.jpg', channelTitle: 'BabyTV', publishedAt: '2020-09-04T00:00:00Z', url: 'https://www.youtube.com/watch?v=SBJUD7EjWFc' },
    { id: 'babytv_5', title: 'BabyTV - Restful Music 5', description: 'Calming music for babies', thumbnail: 'https://i.ytimg.com/vi/Z2E2Y5e0M14/default.jpg', channelTitle: 'BabyTV', publishedAt: '2020-09-05T00:00:00Z', url: 'https://www.youtube.com/watch?v=Z2E2Y5e0M14' },
  ],
  TinyMuslimsClub: [
    { id: 'tmc_1', title: 'Tiny Muslims - Islamic Rhymes 1', description: 'Islamic nursery rhymes', thumbnail: 'https://i.ytimg.com/vi/PNDhz_-uPDs/default.jpg', channelTitle: 'Tiny Muslims Club', publishedAt: '2020-10-01T00:00:00Z', url: 'https://www.youtube.com/watch?v=PNDhz_-uPDs' },
    { id: 'tmc_2', title: 'Tiny Muslims - Islamic Songs 2', description: 'Islamic children songs', thumbnail: 'https://i.ytimg.com/vi/7C3EFfVVbCU/default.jpg', channelTitle: 'Tiny Muslims Club', publishedAt: '2020-10-02T00:00:00Z', url: 'https://www.youtube.com/watch?v=7C3EFfVVbCU' },
    { id: 'tmc_3', title: 'Tiny Muslims - Quran Recitation 3', description: 'Islamic learning for kids', thumbnail: 'https://i.ytimg.com/vi/2VnKyXxDR_o/default.jpg', channelTitle: 'Tiny Muslims Club', publishedAt: '2020-10-03T00:00:00Z', url: 'https://www.youtube.com/watch?v=2VnKyXxDR_o' },
    { id: 'tmc_4', title: 'Tiny Muslims - Islamic Lullabies 4', description: 'Islamic bedtime songs', thumbnail: 'https://i.ytimg.com/vi/eN7kK2r1r_U/default.jpg', channelTitle: 'Tiny Muslims Club', publishedAt: '2020-10-04T00:00:00Z', url: 'https://www.youtube.com/watch?v=eN7kK2r1r_U' },
    { id: 'tmc_5', title: 'Tiny Muslims - Kids Learning 5', description: 'Islamic education for children', thumbnail: 'https://i.ytimg.com/vi/4DhxhZ7Kbdk/default.jpg', channelTitle: 'Tiny Muslims Club', publishedAt: '2020-10-05T00:00:00Z', url: 'https://www.youtube.com/watch?v=4DhxhZ7Kbdk' },
  ],
};

// Specific channels for entertainment (lullabies and cartoons)
const ENTERTAINMENT_CHANNELS = {
  LULLABIES: {
    SuperSimpleSongs: 'UCkRfArvrzheW2E7b6SVV-Cw', // Super Simple Songs
    ZeaZaraKidsTV: 'UC2m5SVhCN2RNvP0MZ-qVwZQ', // Zeazara Kids TV
    Kidzone: 'UCXJZdip7jrHk8urIjf_5Pcw', // Kidzone
    BabyTV: 'UCJLwpP9u-5q5q-q_q_q_q_q', // BabyTV
    TinyMuslimsClub: 'UCKz-VvQ3f3WyJlTdL6yKZsw', // Tiny Muslims Club
  },
  CARTOONS: {
    pink_panther: 'UCkMeyN87kTCyFZi4j_UNvZg', // Pink Panther Official
    tom_jerry: 'UCkJDy3-cD-8l6xIjPt_8XAQ', // Tom and Jerry Official
    mr_bean: 'UChFV2yF2F6gOzpDCJ7Rmy6w', // Mr Bean
    deans_tv: 'UCJ0DumJQmH5rQqCXgIL_5cw', // Dean's TV
    islamic_cartoon: 'UCEz3-x8n7Ym2JvhN0UZr2rQ', // Islamic Cartoon Channel
  },
};

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
      
      // Check if quota exceeded (403 or specific error codes)
      if (data.error.code === 403 || data.error.message.includes('quota')) {
        console.warn('YouTube API quota exceeded. Using mock data for development.');
        return [];
      }
      return [];
    }

    if (!data.items || data.items.length === 0) {
      console.warn(`No videos found for query: ${searchQuery}. Using mock data.`);
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
    console.log(`Fetching videos from channel: ${channelId}`);
    
    // First, check if we have mock data for this channel ID
    for (const [type, channels] of Object.entries(ENTERTAINMENT_CHANNELS)) {
      for (const [key, id] of Object.entries(channels)) {
        if (id === channelId && MOCK_VIDEOS_BY_CHANNEL[key]) {
          console.log(`Found mock data for channel ${key}, attempting API fetch first`);
          // Try API, but have mock data ready as fallback
          try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
              console.warn(`YouTube API error: ${data.error.message}. Using mock data for ${key}`);
              return MOCK_VIDEOS_BY_CHANNEL[key].slice(0, maxResults);
            }

            if (!data.items || data.items.length === 0) {
              console.warn(`No API results for ${key}. Using mock data.`);
              return MOCK_VIDEOS_BY_CHANNEL[key].slice(0, maxResults);
            }

            // API succeeded, return real data
            return data.items.map((item) => ({
              id: item.id.videoId,
              title: item.snippet.title,
              description: item.snippet.description,
              thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
              url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            }));
          } catch (err) {
            console.log(`API fetch failed for ${key}: ${err.message}. Using mock data.`);
            return MOCK_VIDEOS_BY_CHANNEL[key].slice(0, maxResults);
          }
        }
      }
    }

    // If channel not found in config, try API anyway
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('YouTube API Error:', data.error.message);
      console.warn('No mock data available for this channel');
      return [];
    }

    if (!data.items || data.items.length === 0) {
      console.warn(`No videos found for channel: ${channelId}`);
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
    
    // Last resort: find and return any mock data we have
    for (const [type, channels] of Object.entries(ENTERTAINMENT_CHANNELS)) {
      for (const [key, id] of Object.entries(channels)) {
        if (id === channelId && MOCK_VIDEOS_BY_CHANNEL[key]) {
          console.log(`Using mock data for ${key} as fallback`);
          return MOCK_VIDEOS_BY_CHANNEL[key].slice(0, maxResults);
        }
      }
    }
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
      
      // Check if quota exceeded
      if (data.error.code === 403 || data.error.message.includes('quota')) {
        console.warn('YouTube API quota exceeded. Using mock data for development.');
        return Object.values(MOCK_VIDEOS_BY_CHANNEL)[0].slice(0, maxResults);
      }
      return [];
    }

    if (!data.items || data.items.length === 0) {
      console.warn(`No videos found for playlist: ${playlistId}. Using mock data.`);
      return Object.values(MOCK_VIDEOS_BY_CHANNEL)[0].slice(0, maxResults);
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
    // Return mock data on any error
    return Object.values(MOCK_VIDEOS_BY_CHANNEL)[0].slice(0, maxResults);
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

/**
 * Get lullaby videos from specific channels or search query
 * @param {string} query - Search query or channel name (e.g., "super simple songs", "wonderful lullabies", "zeazara kids tv")
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Promise<Array>} Array of video results
 */
const getLullabyVideos = async (query = '', maxResults = 5) => {
  try {
    console.log('Fetching lullaby videos for query:', query);

    // First priority: Direct match with mock data keys
    const normalizedQuery = query.toLowerCase().replace(/[_\s]/g, '');
    for (const [key, videoData] of Object.entries(MOCK_VIDEOS_BY_CHANNEL)) {
      const normalizedKey = key.toLowerCase().replace(/[_\s]/g, '');
      if (normalizedKey === normalizedQuery && ENTERTAINMENT_CHANNELS.LULLABIES[key]) {
        console.log(`✓ Direct match to lullaby channel: ${key}`);
        return videoData.slice(0, maxResults);
      }
    }

    // If no query provided, fetch from all lullaby channels and combine
    if (!query || query.trim() === '') {
      const allLullabies = [];
      for (const [name, channelId] of Object.entries(ENTERTAINMENT_CHANNELS.LULLABIES)) {
        try {
          const videos = await getChannelVideos(channelId, Math.ceil(maxResults / 3));
          if (videos.length > 0) allLullabies.push(...videos);
        } catch (err) {
          console.log(`Failed to fetch from ${name}, trying mock data`);
          if (MOCK_VIDEOS_BY_CHANNEL[name]) {
            allLullabies.push(...MOCK_VIDEOS_BY_CHANNEL[name].slice(0, 2));
          }
        }
      }
      return allLullabies.slice(0, maxResults);
    }

    // Second priority: Match channel name in ENTERTAINMENT_CHANNELS.LULLABIES
    const lowerQuery = query.toLowerCase().replace(/[_\s]/g, '');
    let foundChannelId = null;
    let foundChannelKey = null;

    for (const [key, id] of Object.entries(ENTERTAINMENT_CHANNELS.LULLABIES)) {
      const normalizedKey = key.toLowerCase().replace(/[_\s]/g, '');
      if (normalizedKey === lowerQuery || normalizedKey.includes(lowerQuery) || lowerQuery.includes(normalizedKey)) {
        foundChannelId = id;
        foundChannelKey = key;
        console.log(`✓ Matched lullaby channel in config: ${key}`);
        break;
      }
    }

    // If matched, get or use mock data
    if (foundChannelId && foundChannelKey) {
      // First try to use mock if available
      if (MOCK_VIDEOS_BY_CHANNEL[foundChannelKey]) {
        console.log(`✓ Using mock data for: ${foundChannelKey}`);
        return MOCK_VIDEOS_BY_CHANNEL[foundChannelKey].slice(0, maxResults);
      }
      // Then try API
      try {
        const videos = await getChannelVideos(foundChannelId, maxResults);
        if (videos.length > 0) {
          console.log(`✓ Got ${videos.length} videos from API for: ${foundChannelKey}`);
          return videos;
        }
      } catch (err) {
        console.log(`API failed for ${foundChannelKey}: ${err.message}`);
      }
    }

    // Fallback: search
    console.log(`No mock/API match found, using search fallback for: ${query}`);
    const searchResults = await searchVideos(`${query} lullaby babies sleep`, maxResults);
    if (searchResults.length === 0) {
      return await searchVideos(`${query} kids songs`, maxResults);
    }
    return searchResults;
  } catch (error) {
    console.error('Error fetching lullaby videos:', error);
    return [];
  }
};

/**
 * Get cartoon videos from specific channels or search query
 * @param {string} query - Search query or channel name (e.g., "pink panther", "tom and jerry", "mr bean")
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Promise<Array>} Array of video results
 */
const getCartoonVideos = async (query = '', maxResults = 5) => {
  try {
    console.log('Fetching cartoon videos for query:', query);

    // First priority: Direct match with mock data keys
    const normalizedQuery = query.toLowerCase().replace(/[_\s]/g, '');
    for (const [key, videoData] of Object.entries(MOCK_VIDEOS_BY_CHANNEL)) {
      const normalizedKey = key.toLowerCase().replace(/[_\s]/g, '');
      if (normalizedKey === normalizedQuery && ENTERTAINMENT_CHANNELS.CARTOONS[key]) {
        console.log(`✓ Direct match to cartoon channel: ${key}`);
        return videoData.slice(0, maxResults);
      }
    }

    // If no query provided, fetch from all cartoon channels and combine
    if (!query || query.trim() === '') {
      const allCartoons = [];
      for (const [name, channelId] of Object.entries(ENTERTAINMENT_CHANNELS.CARTOONS)) {
        try {
          const videos = await getChannelVideos(channelId, Math.ceil(maxResults / Object.keys(ENTERTAINMENT_CHANNELS.CARTOONS).length));
          if (videos.length > 0) allCartoons.push(...videos);
        } catch (err) {
          console.log(`Failed to fetch from ${name}, trying mock data`);
          if (MOCK_VIDEOS_BY_CHANNEL[name]) {
            allCartoons.push(...MOCK_VIDEOS_BY_CHANNEL[name].slice(0, 2));
          }
        }
      }
      return allCartoons.slice(0, maxResults);
    }

    // Second priority: Match channel name in ENTERTAINMENT_CHANNELS.CARTOONS
    const lowerQuery = query.toLowerCase().replace(/[_\s]/g, '');
    let foundChannelId = null;
    let foundChannelKey = null;

    for (const [key, id] of Object.entries(ENTERTAINMENT_CHANNELS.CARTOONS)) {
      const normalizedKey = key.toLowerCase().replace(/[_\s]/g, '');
      if (normalizedKey === lowerQuery || normalizedKey.includes(lowerQuery) || lowerQuery.includes(normalizedKey)) {
        foundChannelId = id;
        foundChannelKey = key;
        console.log(`✓ Matched cartoon channel in config: ${key}`);
        break;
      }
    }

    // If matched, get or use mock data
    if (foundChannelId && foundChannelKey) {
      // First try to use mock if available
      if (MOCK_VIDEOS_BY_CHANNEL[foundChannelKey]) {
        console.log(`✓ Using mock data for: ${foundChannelKey}`);
        return MOCK_VIDEOS_BY_CHANNEL[foundChannelKey].slice(0, maxResults);
      }
      // Then try API
      try {
        const videos = await getChannelVideos(foundChannelId, maxResults);
        if (videos.length > 0) {
          console.log(`✓ Got ${videos.length} videos from API for: ${foundChannelKey}`);
          return videos;
        }
      } catch (err) {
        console.log(`API failed for ${foundChannelKey}: ${err.message}`);
      }
    }

    // Fallback: search
    console.log(`No mock/API match found, using search fallback for: ${query}`);
    const searchResults = await searchVideos(`${query} cartoon for kids children`, maxResults);
    if (searchResults.length === 0) {
      return await searchVideos(`${query} animated`, maxResults);
    }
    return searchResults;
  } catch (error) {
    console.error('Error fetching cartoon videos:', error);
    return [];
  }
};

/**
 * Get all entertainment channels info
 * @returns {Object} Object with lullaby and cartoon channels
 */
const getEntertainmentChannels = () => {
  return {
    lullabies: Object.keys(ENTERTAINMENT_CHANNELS.LULLABIES),
    cartoons: Object.keys(ENTERTAINMENT_CHANNELS.CARTOONS),
    channels: ENTERTAINMENT_CHANNELS,
  };
};

module.exports = {
  searchVideos,
  getChannelVideos,
  getPlaylistVideos,
  getVideosByCategory,
  getVideosBySubcategory,
  getAvailableCategories,
  getLullabyVideos,
  getCartoonVideos,
  getEntertainmentChannels,
};
