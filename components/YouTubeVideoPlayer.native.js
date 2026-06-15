import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

// Native (Android/iOS) player. Metro picks this on mobile and .web.js on web.
//
// We do NOT embed a WebView here: react-native-webview does not render under the
// New Architecture inside Expo Go (it paints a blank/black surface). Instead we
// show the video thumbnail and open the video in an in-app browser tab (Chrome
// Custom Tab / Safari sheet), which uses the real system browser engine and
// plays YouTube reliably. The user swipes back to return to the app.
//
// (If you move to a custom dev build where react-native-webview renders, you can
// swap this back to an inline WebView/iframe player.)
const YouTubeVideoPlayer = ({ videoId, height = 400 }) => {
  if (!videoId) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.errorBox} />
      </View>
    );
  }

  const openVideo = () =>
    WebBrowser.openBrowserAsync(`https://www.youtube.com/watch?v=${videoId}`);

  return (
    <TouchableOpacity
      style={[styles.container, { height }]}
      activeOpacity={0.85}
      onPress={openVideo}
      accessibilityRole="button"
      accessibilityLabel="Play video"
    >
      <Image
        source={{ uri: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` }}
        style={styles.thumb}
        resizeMode="cover"
      />
      <View style={styles.playOverlay}>
        <View style={styles.playButton}>
          <MaterialCommunityIcons name="play" size={22} color="#FFFFFF" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  thumb: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 107, 157, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBox: {
    width: '80%',
    height: '80%',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
  },
});

export default YouTubeVideoPlayer;
