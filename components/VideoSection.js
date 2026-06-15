import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import YouTubeVideoPlayer from './YouTubeVideoPlayer';
import { getYouTubeId, getYouTubeThumbnail } from '../utils/youtube';
import { getScreenVideos } from '../data/videos';

// A single video: shows a lightweight thumbnail "facade" first.
// - On web, tapping mounts an inline <iframe> (works perfectly in the browser).
// - On native, tapping opens the video in an in-app browser tab (Chrome Custom
//   Tab / Safari sheet). We do NOT embed a WebView on native because
//   react-native-webview does not render under the New Architecture in Expo Go;
//   the system browser plays YouTube reliably and the user swipes back.
const Caption = ({ title, description }) => {
  if (!title && !description) return null;
  return (
    <View style={styles.captionWrap}>
      {!!title && <Text style={styles.captionTitle}>{title}</Text>}
      {!!description && <Text style={styles.captionDesc}>{description}</Text>}
    </View>
  );
};

const VideoCard = ({ videoId, title, description }) => {
  const [playing, setPlaying] = useState(false);

  const handlePress = () => {
    if (Platform.OS === 'web') {
      setPlaying(true);
    } else {
      WebBrowser.openBrowserAsync(`https://www.youtube.com/watch?v=${videoId}`);
    }
  };

  if (playing) {
    return (
      <View style={styles.card}>
        <YouTubeVideoPlayer videoId={videoId} height={220} />
        <Caption title={title} description={description} />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.thumbWrapper}
        activeOpacity={0.85}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={title ? `Play video: ${title}` : 'Play video'}
      >
        <Image
          source={{ uri: getYouTubeThumbnail(videoId) }}
          style={styles.thumb}
          resizeMode="cover"
        />
        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <MaterialCommunityIcons name="play" size={22} color="#FFFFFF" />
          </View>
        </View>
      </TouchableOpacity>
      <Caption title={title} description={description} />
    </View>
  );
};

/**
 * Renders the YouTube videos for a screen.
 *
 * Usage:
 *   <VideoSection screen="tom_jerry" />          // looks up data/videos.js by key
 *   <VideoSection videos={[{ url, title, description }]} />  // or pass videos directly
 *
 * Renders nothing when there are no valid videos.
 */
const VideoSection = ({ screen, videos, heading = 'Watch' }) => {
  const source = videos || getScreenVideos(screen);

  // Filter out empty/invalid urls and resolve each to a video id.
  const resolved = (source || [])
    .map((v) => ({ id: getYouTubeId(v.url), title: v.title, description: v.description }))
    .filter((v) => !!v.id);

  if (resolved.length === 0) return null;

  return (
    <View style={styles.section}>
      {!!heading && (
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconBg}>
            <MaterialCommunityIcons name="play-circle" size={24} color="#FF6B9D" />
          </View>
          <Text style={styles.sectionTitle}>{heading}</Text>
        </View>
      )}

      <View style={styles.grid}>
        {resolved.map((v, i) => (
          <VideoCard key={`${v.id}-${i}`} videoId={v.id} title={v.title} description={v.description} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#FFE5F1',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  thumbWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000000',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 107, 157, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionWrap: {
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  captionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
    lineHeight: 20,
  },
  captionDesc: {
    fontSize: 13,
    color: '#636E72',
    lineHeight: 18,
    marginTop: 2,
  },
});

export default VideoSection;
