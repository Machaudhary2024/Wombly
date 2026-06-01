import React, { useState } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const YouTubeVideoPlayer = ({ videoId, height = 400 }) => {
  const [loading, setLoading] = useState(true);
  const [webViewLoaded, setWebViewLoaded] = useState(false);

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

  // For native mobile platforms, use WebView with direct YouTube embed URL
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0&playsinline=1&fs=1`;
  
  const youtubeHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        * {
          margin: 0;
          padding: 0;
        }
        html, body {
          width: 100%;
          height: 100%;
          background: #000;
        }
        iframe {
          display: block;
          width: 100%;
          height: 100%;
          border: none;
          background: #000;
        }
      </style>
    </head>
    <body>
      <iframe
        src="${youtubeEmbedUrl}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        webkitallowfullscreen
        mozallowfullscreen
      ></iframe>
    </body>
    </html>
  `;

  return (
    <View style={[styles.mobileContainer, { height }]}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <WebView
        source={{ html: youtubeHTML }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo={true}
        allowsInlineMediaPlayback={true}
        scalesPageToFit={false}
        scrollEnabled={false}
        startInLoadingState={true}
        onLoadEnd={() => {
          setLoading(false);
          setWebViewLoaded(true);
        }}
        onError={(e) => {
          console.log('WebView error:', e.nativeEvent);
          setLoading(false);
        }}
        onHttpError={(e) => {
          console.log('WebView HTTP error:', e.nativeEvent);
        }}
        onMessage={(event) => {
          console.log('WebView message:', event.nativeEvent.data);
        }}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
        }}
        containerStyle={{
          backgroundColor: '#000',
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
