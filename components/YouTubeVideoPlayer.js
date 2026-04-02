import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

const YouTubeVideoPlayer = ({ videoId, height = 400 }) => {
  if (!videoId) {
    return null;
  }

  // For web platform, render iframe directly
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { height }]}>
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

  // For native platforms, show a message (can be enhanced later)
  return (
    <View style={[styles.container, { height }]}>
      {/* Placeholder for mobile - can integrate native YouTube player later */}
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
});

export default YouTubeVideoPlayer;
