const fetch = require('node-fetch');

// Video data to add
const videosData = {
  cartoons: {
    tom_jerry: [
      'https://www.youtube.com/watch?v=m_2XzeSTEAM',
      'https://www.youtube.com/watch?v=qsbmjEQitmw',
      'https://www.youtube.com/watch?v=giO_iq5Xe_c',
      'https://www.youtube.com/watch?v=t0Q2otsqC4I&t=31s',
      'https://www.youtube.com/watch?v=rilFfbm7j8k'
    ],
    pink_panther: [
      'https://www.youtube.com/watch?v=DWYeStSYZwk&t=36s',
      'https://www.youtube.com/watch?v=JAD9e-cDb-Y',
      'https://www.youtube.com/watch?v=ZdQweZuxR3E',
      'https://www.youtube.com/watch?v=uvHzle4Qze8',
      'https://www.youtube.com/watch?v=LU3O3YE88bg'
    ],
    DeanTV: [
      'https://www.youtube.com/watch?v=Iyt61nmRvOs',
      'https://www.youtube.com/watch?v=Mjy_VMyKoQ8',
      'https://www.youtube.com/watch?v=PGDmUJhMC5k',
      'https://www.youtube.com/watch?v=D6UlvqD_Fw4',
      'https://www.youtube.com/watch?v=-5LILyG2tcM'
    ],
    MrBean: [
      'https://www.youtube.com/watch?v=chDzys9QnIs&t=28s',
      'https://www.youtube.com/watch?v=z4p1onTh7oU',
      'https://www.youtube.com/watch?v=vTlx-pmjTkM',
      'https://www.youtube.com/watch?v=_fsjQXoqFtM',
      'https://www.youtube.com/watch?v=a5GhERqvlds'
    ],
    Masha_bear: [
      'https://www.youtube.com/watch?v=mWXrM-OKBNQ',
      'https://www.youtube.com/watch?v=jCvSEuHms5M',
      'https://www.youtube.com/watch?v=taAU0ZJ4IBY',
      'https://www.youtube.com/watch?v=YDhoIHgYYwo',
      'https://www.youtube.com/watch?v=jGaaHVuUcaU'
    ]
  },
  lullabies: {
    SuperSimpleSongs: [
      'https://www.youtube.com/watch?v=hSdG4A-pUro',
      'https://www.youtube.com/watch?v=GbDiJcYYO28',
      'https://www.youtube.com/watch?v=vyyllg6fx1I',
      'https://www.youtube.com/watch?v=E4ISZemF2UM',
      'https://www.youtube.com/watch?v=vcKxZLQETgE'
    ],
    Zeazara_KidsTV: [
      'https://www.youtube.com/watch?v=M-GEDglyt-4&t=106s',
      'https://www.youtube.com/watch?v=HSy3kzu0kF0',
      'https://www.youtube.com/watch?v=_lgyvcWHKy4',
      'https://www.youtube.com/watch?v=2XayiNmDuXQ',
      'https://www.youtube.com/watch?v=9eNs8M7bZMY'
    ],
    kidzone: [
      'https://www.youtube.com/watch?v=J1THCT-DU3E',
      'https://www.youtube.com/watch?v=0DP1lidVv2o',
      'https://www.youtube.com/watch?v=8Z2r44lrNAs',
      'https://www.youtube.com/watch?v=shHVZvwz_Zs',
      'https://www.youtube.com/watch?v=85I0NkYZFK0'
    ],
    BabyTV: [
      'https://www.youtube.com/watch?v=pZuaMn_eFfA',
      'https://www.youtube.com/watch?v=qV_C2o-XsA0',
      'https://www.youtube.com/watch?v=kU3eJvTmmfU',
      'https://www.youtube.com/watch?v=pXGuLNePCO4',
      'https://www.youtube.com/watch?v=JCXk9ISMDG0'
    ],
    Tiny_MuslimClub: [
      'https://www.youtube.com/watch?v=grjWkYMr3M0',
      'https://www.youtube.com/watch?v=nU6S1tR5s4A',
      'https://www.youtube.com/watch?v=pSWRPGOvG_w',
      'https://www.youtube.com/watch?v=i6FmG6b2Jtc',
      'https://www.youtube.com/watch?v=B-3KFUmQaoI'
    ]
  }
};

// Extract video ID from YouTube URL
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /([a-zA-Z0-9_-]{11})/
  ];
  
  for (let pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Add video to database
async function addVideo(type, channel, title, youtubeUrl) {
  try {
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      console.log(`❌ Failed to extract video ID from: ${youtubeUrl}`);
      return false;
    }

    const response = await fetch('http://localhost:5000/api/videos/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        channel,
        title,
        youtubeUrl: youtubeUrl.split('&t=')[0], // Remove timestamp parameter
        description: `${channel} - ${title}`
      })
    });

    const result = await response.json();
    if (result.success) {
      console.log(`✅ Added: ${channel} - ${title}`);
      return true;
    } else {
      console.log(`⚠️  ${result.message} - ${title}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error adding video: ${error.message}`);
    return false;
  }
}

// Main function to add all videos
async function addAllVideos() {
  console.log('\n🎬 Starting to add cartoons and lullabies to database...\n');
  
  let successCount = 0;
  let totalCount = 0;

  // Add cartoons
  console.log('📺 ADDING CARTOONS...\n');
  for (const [channel, urls] of Object.entries(videosData.cartoons)) {
    for (let i = 0; i < urls.length; i++) {
      totalCount++;
      const title = `${channel} Episode ${i + 1}`;
      const success = await addVideo('cartoon', channel, title, urls[i]);
      if (success) successCount++;
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay between requests
    }
  }

  console.log('\n🎵 ADDING LULLABIES...\n');
  // Add lullabies
  for (const [channel, urls] of Object.entries(videosData.lullabies)) {
    for (let i = 0; i < urls.length; i++) {
      totalCount++;
      const title = `${channel} Song ${i + 1}`;
      const success = await addVideo('lullaby', channel, title, urls[i]);
      if (success) successCount++;
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay between requests
    }
  }

  console.log(`\n✨ DONE! Added ${successCount}/${totalCount} videos successfully\n`);
}

// Run the script
addAllVideos().catch(console.error);
