import React, { useState, useRef } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';

const YouTubeVideoPlayer = ({ videoId, height = 400 }) => {
  const [loading, setLoading] = useState(true);
  const playerRef = useRef(null);

  if (!videoId) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.errorContainer}>
          <View style={styles.errorBox} />
        </View>
      </View>
    );
  }

  // For web platform, render iframe directly
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.webContainer, { height }]}>
        <iframe
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '8px',
          }}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0`}
          title="YouTube player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </View>
    );
  }

  // For native mobile, use react-native-youtube-iframe (much more reliable)
  return (
    <View style={[styles.mobileContainer, { height }]}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <YoutubePlayer
        ref={playerRef}
        videoId={videoId}
        height={height}
        play={true}
        onReady={() => setLoading(false)}
        onError={(error) => {
          console.log('YouTube player error:', error);
          setLoading(false);
        }}
        onChangeState={(state) => {
          if (state === 'playing') {
            setLoading(false);
          }
        }}
        webViewProps={{
          javaScriptEnabled: true,
          domStorageEnabled: true,
          mediaPlaybackRequiresUserAction: false,
          allowsFullscreenVideo: true,
          allowsInlineMediaPlayback: true,
          scrollEnabled: false,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webContainer: {
    width: '100%',
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  mobileContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  errorContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBox: {
    width: '80%',
    height: '80%',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderBox: {
    width: '80%',
    height: '80%',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
});

export default YouTubeVideoPlayer;
