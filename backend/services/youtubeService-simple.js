// Simple YouTube Video Service
// Just returns basic video data with videoId for the YouTube player

// Simple cartoon videos data
const CARTOON_VIDEOS = {
  pink_panther: [
    { videoId: 'RHaRvXWN2Cw', title: 'Pink Panther Episode 1' },
    { videoId: '0VZfPBxdqIw', title: 'Pink Panther Episode 2' },
    { videoId: '_cPTPT11-Es', title: 'Pink Panther Episode 3' },
    { videoId: 'j-Z9K57TxUg', title: 'Pink Panther Episode 4' },
    { videoId: 'OPf0YbXqDm0', title: 'Pink Panther Episode 5' },
  ],
  tom_jerry: [
    { videoId: 'x9YT3XnYaXQ', title: 'Tom & Jerry Episode 1' },
    { videoId: 'VOgFJJTCcXY', title: 'Tom & Jerry Episode 2' },
    { videoId: 'r0I-__4NdDQ', title: 'Tom & Jerry Episode 3' },
    { videoId: '_RkJPxj9BW0', title: 'Tom & Jerry Episode 4' },
    { videoId: 'wt_6eFVJ3Aw', title: 'Tom & Jerry Episode 5' },
  ],
  mr_bean: [
    { videoId: 'zUqRCyVAaHY', title: 'Mr Bean Episode 1' },
    { videoId: 'TEK2cV7NMkE', title: 'Mr Bean Episode 2' },
    { videoId: 'gLJLCW17wYU', title: 'Mr Bean Episode 3' },
    { videoId: 'OMNWCcl-WkI', title: 'Mr Bean Episode 4' },
    { videoId: 'eLyKVlgIgVU', title: 'Mr Bean Episode 5' },
  ],
  deans_tv: [
    { videoId: 'ZWe9AYhDIqI', title: 'Deans TV Episode 1' },
    { videoId: 'y6Sxv-sUYtM', title: 'Deans TV Episode 2' },
    { videoId: 'aJOTlE1K90k', title: 'Deans TV Episode 3' },
    { videoId: 'HRqJmVKCcE4', title: 'Deans TV Episode 4' },
    { videoId: 'aKUXc_qY2jA', title: 'Deans TV Episode 5' },
  ],
  islamic_cartoon: [
    { videoId: 'aq-2tgoDIVQ', title: 'Islamic Cartoon Episode 1' },
    { videoId: 'JZQJNDhKxxQ', title: 'Islamic Cartoon Episode 2' },
    { videoId: 'uIpgfzHjw8k', title: 'Islamic Cartoon Episode 3' },
    { videoId: 'P9aSKwMgqfo', title: 'Islamic Cartoon Episode 4' },
    { videoId: 'sFCrfbHWrLQ', title: 'Islamic Cartoon Episode 5' },
  ],
};

// Simple lullaby videos data
const LULLABY_VIDEOS = {
  SuperSimpleSongs: [
    { videoId: 'E5wFMwP0HEY', title: 'Wheels on the Bus' },
    { videoId: 'SBJUD7EjWFc', title: 'Twinkle Twinkle Little Star' },
    { videoId: '7x85DwqdzJk', title: 'Old MacDonald' },
    { videoId: 'sKV-oT0cM9s', title: 'Bingo' },
    { videoId: '75p-N7SJNic', title: 'ABC Alphabet Song' },
  ],
  ZeaZaraKidsTV: [
    { videoId: 'hcD1A9cxXiQ', title: 'Nursery Rhymes Compilation' },
    { videoId: 'LXb3EKWsInQ', title: 'Baby Songs Collection' },
    { videoId: 'r8JqG3H4aQ0', title: 'Kids Nursery Rhymes' },
    { videoId: 'B_tz89YN6Ek', title: 'Learning Through Songs' },
    { videoId: 'jDn0tPcaVrA', title: 'Lullabies for Sleep' },
  ],
  Kidzone: [
    { videoId: 'oCfWRjxBxYA', title: 'Relaxing Kids Songs' },
    { videoId: 'w8X-ZvGl6pE', title: 'Sleep Songs for Kids' },
    { videoId: 'aVLGBDWpwqQ', title: 'Baby Nursery Rhymes' },
    { videoId: 'S4DcDIGk7tE', title: 'Night Time Calm Music' },
    { videoId: 'CqT01HFbXMg', title: 'Best Baby Lullabies' },
  ],
  BabyTV: [
    { videoId: 'UcjZj3wH4Qs', title: 'Gentle Lullabies for Babies' },
    { videoId: 'WQx1zcqWgQE', title: 'Sleep Time Music' },
    { videoId: 'uL6PeA8qFAI', title: 'Baby Songs Collection' },
    { videoId: 'j7GCTM7Qg0s', title: 'Bedtime Classics' },
    { videoId: 'Vwm6D0B6ooY', title: 'Restful Music for Babies' },
  ],
  TinyMuslimsClub: [
    { videoId: 'u8qcJ-5Ws1k', title: 'Islamic Nursery Rhymes' },
    { videoId: '3Av_1d6S1bw', title: 'Islamic Children Songs' },
    { videoId: 'zJ5TvGV7JI0', title: 'Quran Recitation for Kids' },
    { videoId: 'kVlmVsEjMjQ', title: 'Islamic Lullabies' },
    { videoId: '_6xhIKQ1xCs', title: 'Islamic Kids Entertainment' },
  ],
};

// Get cartoon videos for a channel
const getCartoonVideos = (channelKey) => {
  return CARTOON_VIDEOS[channelKey] || [];
};

// Get lullaby videos for a channel
const getLullabyVideos = (channelKey) => {
  return LULLABY_VIDEOS[channelKey] || [];
};

// Get all cartoon channels
const getCartoonChannels = () => {
  return Object.keys(CARTOON_VIDEOS).map(key => ({
    key,
    name: key.replace(/_/g, ' ').toUpperCase(),
    count: CARTOON_VIDEOS[key].length,
  }));
};

// Get all lullaby channels
const getLullabyChannels = () => {
  return Object.keys(LULLABY_VIDEOS).map(key => ({
    key,
    name: key,
    count: LULLABY_VIDEOS[key].length,
  }));
};

module.exports = {
  getCartoonVideos,
  getLullabyVideos,
  getCartoonChannels,
  getLullabyChannels,
  CARTOON_VIDEOS,
  LULLABY_VIDEOS,
};
