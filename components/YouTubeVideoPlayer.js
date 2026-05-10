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
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&modestbranding=1&rel=0&playsinline=1`;
  
  const youtubeHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes, viewport-fit=cover, maximum-scale=5.0">
      <title>YouTube Video</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          width: 100%;
          height: 100%;
          background-color: #000;
          overflow: hidden;
        }
        body {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .video-container {
          width: 100%;
          height: 100%;
          position: relative;
          background-color: #000;
        }
        iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 8px;
        }
        .loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 16px;
        }
      </style>
    </head>
    <body>
      <div class="video-container">
        <div class="loading">Loading video...</div>
        <iframe
          id="youtube-iframe"
          src="${youtubeEmbedUrl}"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
          allow="autoplay"
          loading="lazy"
          webkit-playsinline="webkit-playsinline"
          playsinline
        ></iframe>
      </div>
      <script>
        window.onload = function() {
          document.querySelector('.loading').style.display = 'none';
        };
      </script>
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
        cacheEnabled={true}
        source={{ html: youtubeHTML }}
        scalesPageToFit={false}
        scrollEnabled={false}
        scrollEventThrottle={16}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo={true}
        allowsInlineMediaPlayback={true}
        allowFileAccess={true}
        mixedContentMode="always"
        useWebKit={true}
        startInLoadingState={true}
        onLoadEnd={() => {
          setLoading(false);
          setWebViewLoaded(true);
        }}
        onLoad={() => {
          setWebViewLoaded(true);
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.log('WebView error:', nativeEvent);
          setLoading(false);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.log('WebView HTTP error:', nativeEvent);
          setLoading(false);
        }}
        style={{
          width: '100%',
          height: '100%',
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
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
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
