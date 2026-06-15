// data/videos.js
//
// CENTRAL VIDEO REGISTRY — the only file you edit to add/remove videos.
//
// Videos are grouped by "page" key:
//   - cartoon channels  (key === channel, e.g. 'tom_jerry')
//   - lullaby channels  (key === channel, e.g. 'SuperSimpleSongs')
//   - first-aid topics  (key === topic, e.g. 'CPR & Choking')
//   - content screens   (e.g. 'cultural_remedies', 'cravings')
//
// Each video: { url, title?, description? }
//   - url: any YouTube url (watch?v=..., youtu.be/..., /shorts/...). Parsed by utils/youtube.js.
//   - title: caption shown under the thumbnail.
//   - description: smaller line under the title (optional).
//
// `cartoonChannels` / `lullabyChannels` drive the channel grid on the
// Entertainment screen. Tapping a channel opens its detail page, which lists
// that channel's videos (looked up here by key). Tapping a video opens it in
// the in-app browser (native) or inline (web) — see components/VideoSection.js.

export const cartoonChannels = [
  { key: 'tom_jerry', name: 'Tom & Jerry', icon: 'paw', description: 'Classic cartoon adventures' },
  { key: 'pink_panther', name: 'Pink Panther', icon: 'cat', description: 'Hilarious panther stories' },
  { key: 'DeanTV', name: 'Dean TV', icon: 'filmstrip', description: 'Fun educational content' },
  { key: 'MrBean', name: 'Mr. Bean', icon: 'run', description: 'Funny Mr. Bean episodes' },
  { key: 'Masha_bear', name: 'Masha and Bear', icon: 'teddy-bear', description: 'Adventure tales' },
];

export const lullabyChannels = [
  { key: 'SuperSimpleSongs', name: 'Super Simple Songs', icon: 'music-box-outline', description: 'Educational songs for babies' },
  { key: 'Zeazara_KidsTV', name: 'Zea Zara Kids TV', icon: 'music-note-multiple', description: 'Creative nursery rhymes' },
  { key: 'kidzone', name: 'Kidzone', icon: 'music-sleep', description: 'Relaxing children songs' },
  { key: 'BabyTV', name: 'BabyTV', icon: 'baby-carriage', description: 'Gentle lullabies for sleep' },
  { key: 'Tiny_MuslimClub', name: 'Tiny Muslims Club', icon: 'quran', description: 'Islamic nursery rhymes' },
];

export const screenVideos = {
  // ----- Cartoon channels (page header shows the channel name) -----
  tom_jerry: [
    { url: 'https://www.youtube.com/watch?v=m_2XzeSTEAM', title: 'Episode 1' },
    { url: 'https://www.youtube.com/watch?v=qsbmjEQitmw', title: 'Episode 2' },
    { url: 'https://www.youtube.com/watch?v=giO_iq5Xe_c', title: 'Episode 3' },
    { url: 'https://www.youtube.com/watch?v=t0Q2otsqC4I', title: 'Episode 4' },
    { url: 'https://www.youtube.com/watch?v=rilFfbm7j8k', title: 'Episode 5' },
  ],
  pink_panther: [
    { url: 'https://www.youtube.com/watch?v=DWYeStSYZwk', title: 'Episode 1' },
    { url: 'https://www.youtube.com/watch?v=JAD9e-cDb-Y', title: 'Episode 2' },
    { url: 'https://www.youtube.com/watch?v=ZdQweZuxR3E', title: 'Episode 3' },
    { url: 'https://www.youtube.com/watch?v=uvHzle4Qze8', title: 'Episode 4' },
    { url: 'https://www.youtube.com/watch?v=LU3O3YE88bg', title: 'Episode 5' },
  ],
  DeanTV: [
    { url: 'https://www.youtube.com/watch?v=Iyt61nmRvOs', title: 'Episode 1' },
    { url: 'https://www.youtube.com/watch?v=Mjy_VMyKoQ8', title: 'Episode 2' },
    { url: 'https://www.youtube.com/watch?v=PGDmUJhMC5k', title: 'Episode 3' },
    { url: 'https://www.youtube.com/watch?v=D6UlvqD_Fw4', title: 'Episode 4' },
    { url: 'https://www.youtube.com/watch?v=-5LILyG2tcM', title: 'Episode 5' },
  ],
  MrBean: [
    { url: 'https://www.youtube.com/watch?v=chDzys9QnIs', title: 'Episode 1' },
    { url: 'https://www.youtube.com/watch?v=z4p1onTh7oU', title: 'Episode 2' },
    { url: 'https://www.youtube.com/watch?v=vTlx-pmjTkM', title: 'Episode 3' },
    { url: 'https://www.youtube.com/watch?v=_fsjQXoqFtM', title: 'Episode 4' },
    { url: 'https://www.youtube.com/watch?v=eXmC8R4C2iE', title: 'Episode 5' },
  ],
  Masha_bear: [
    { url: 'https://www.youtube.com/watch?v=mWXrM-OKBNQ', title: 'Episode 1' },
    { url: 'https://www.youtube.com/watch?v=jCvSEuHms5M', title: 'Episode 2' },
    { url: 'https://www.youtube.com/watch?v=taAU0ZJ4IBY', title: 'Episode 3' },
    { url: 'https://www.youtube.com/watch?v=YDhoIHgYYwo', title: 'Episode 4' },
    { url: 'https://www.youtube.com/watch?v=jGaaHVuUcaU', title: 'Episode 5' },
  ],

  // ----- Lullaby channels (page header shows the channel name) -----
  SuperSimpleSongs: [
    { url: 'https://www.youtube.com/watch?v=hSdG4A-pUro', title: 'Song 1' },
    { url: 'https://www.youtube.com/watch?v=GbDiJcYYO28', title: 'Song 2' },
    { url: 'https://www.youtube.com/watch?v=vyyllg6fx1I', title: 'Song 3' },
    { url: 'https://www.youtube.com/watch?v=E4ISZemF2UM', title: 'Song 4' },
    { url: 'https://www.youtube.com/watch?v=vcKxZLQETgE', title: 'Song 5' },
  ],
  Zeazara_KidsTV: [
    { url: 'https://www.youtube.com/watch?v=M-GEDglyt-4', title: 'Song 1' },
    { url: 'https://www.youtube.com/watch?v=HSy3kzu0kF0', title: 'Song 2' },
    { url: 'https://www.youtube.com/watch?v=_lgyvcWHKy4', title: 'Song 3' },
    { url: 'https://www.youtube.com/watch?v=2XayiNmDuXQ', title: 'Song 4' },
    { url: 'https://www.youtube.com/watch?v=9eNs8M7bZMY', title: 'Song 5' },
  ],
  kidzone: [
    { url: 'https://www.youtube.com/watch?v=J1THCT-DU3E', title: 'Song 1' },
    { url: 'https://www.youtube.com/watch?v=0DP1lidVv2o', title: 'Song 2' },
    { url: 'https://www.youtube.com/watch?v=8Z2r44lrNAs', title: 'Song 3' },
    { url: 'https://www.youtube.com/watch?v=shHVZvwz_Zs', title: 'Song 4' },
    { url: 'https://www.youtube.com/watch?v=85I0NkYZFK0', title: 'Song 5' },
  ],
  BabyTV: [
    { url: 'https://www.youtube.com/watch?v=pZuaMn_eFfA', title: 'Song 1' },
    { url: 'https://www.youtube.com/watch?v=qV_C2o-XsA0', title: 'Song 2' },
    { url: 'https://www.youtube.com/watch?v=kU3eJvTmmfU', title: 'Song 3' },
    { url: 'https://www.youtube.com/watch?v=pXGuLNePCO4', title: 'Song 4' },
    { url: 'https://www.youtube.com/watch?v=JCXk9ISMDG0', title: 'Song 5' },
  ],
  Tiny_MuslimClub: [
    { url: 'https://www.youtube.com/watch?v=grjWkYMr3M0', title: 'Song 1' },
    { url: 'https://www.youtube.com/watch?v=nU6S1tR5s4A', title: 'Song 2' },
    { url: 'https://www.youtube.com/watch?v=pSWRPGOvG_w', title: 'Song 3' },
    { url: 'https://www.youtube.com/watch?v=i6FmG6b2Jtc', title: 'Song 4' },
    { url: 'https://www.youtube.com/watch?v=B-3KFUmQaoI', title: 'Song 5' },
  ],

  // ----- First-aid topics -----
  'CPR & Choking': [
    { url: 'https://www.youtube.com/watch?v=4j329wUsl3s', title: 'CPR Tutorial', description: 'Step-by-step CPR for choking emergencies' },
  ],
  'Allergies & Reactions': [
    { url: 'https://www.youtube.com/watch?v=yOTgmfA8jNk', title: 'Allergies & Reactions', description: 'Recognising and responding to allergic reactions' },
  ],
  'Fever & Infection': [
    { url: 'https://www.youtube.com/watch?v=HsRBsNp_cNw', title: 'Fever & Infection', description: 'Managing fever and signs of infection' },
  ],
  'Poisoning': [
    { url: 'https://www.youtube.com/watch?v=K36B1wnMHIo', title: 'Poisoning', description: 'First response to suspected poisoning' },
  ],
  'Minor Injuries': [
    { url: 'https://www.youtube.com/watch?v=V6ucRwBliqc', title: 'Minor Injuries', description: 'Caring for cuts, bruises and sprains' },
  ],
  'Burns & Scalds': [
    { url: 'https://www.youtube.com/watch?v=VS4ezqDKS8Y', title: 'Burns & Scalds', description: 'First aid for burns and scalds' },
  ],

  // ----- Cultural remedies -----
  cultural_remedies: [
    { url: 'https://www.youtube.com/watch?v=VL0jHTThHyQ', title: 'Diet Tips for Healthy Pregnancy' },
    { url: 'https://www.youtube.com/watch?v=OPv161ft2BI', title: 'Traditional foods during pregnancy' },
  ],

  // ----- Cravings -----
  cravings: [
    { url: 'https://www.youtube.com/watch?v=LTlGwenhPlA', title: 'Pregnancy cravings – healthy tips' },
    { url: 'https://www.youtube.com/watch?v=eFEIYbccZNo', title: 'Pakistani pregnancy diet ideas' },
  ],
};

/**
 * Look up the videos for a channel/topic/screen key.
 * @param {string} key
 * @returns {{url: string, title?: string, description?: string}[]}
 */
export function getScreenVideos(key) {
  return screenVideos[key] || [];
}
