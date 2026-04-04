import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, ActivityIndicator, Modal, Image, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_BASE_URL } from './apiConfig';
import YouTubeVideoPlayer from './components/YouTubeVideoPlayer';

const CartoonDetailScreen = ({ navigation, route }) => {
  const { cartoonKey, cartoonName } = route.params;
  const [cartoonVideos, setCartoonVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Video player state
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);

  const API_URL = `${API_BASE_URL}/api/entertainment`;

  // Fetch videos for selected cartoon channel
  useEffect(() => {
    const fetchCartoonVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/cartoons/${cartoonKey}?maxResults=5`);
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          // Transform videos to ensure videoId is present
          const transformedVideos = result.data.map((video) => ({
            ...video,
            videoId: video.videoId || video.id,
          }));
          setCartoonVideos(transformedVideos);
        } else if (!result.success) {
          // API failed, but mock data is being used on backend
          console.log('API error, mock data should be used from backend');
        }
      } catch (error) {
        console.log('Error fetching cartoon videos:', error);
        console.log('Showing mock data from backend fallback');
      } finally {
        setLoading(false);
      }
    };

    fetchCartoonVideos();
  }, [cartoonKey]);

  const handlePlayCartoon = (video) => {
    if (!video.videoId) {
      Alert.alert('Error', 'Video ID not available');
      return;
    }
    setSelectedVideoId(video.videoId);
    setSelectedVideoTitle(video.title);
    setShowPlayer(true);
  };

  const renderCartoonVideoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.videoCard}
      activeOpacity={0.8}
      onPress={() => handlePlayCartoon(item)}
    >
      <LinearGradient
        colors={['#FFE5F1', '#F3E5F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.videoGradient}
      >
        <View style={styles.videoContent}>
          {item.thumbnail && (
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.videoThumbnail}
              resizeMode="cover"
            />
          )}
          <View style={styles.videoOverlay}>
            <MaterialCommunityIcons name="play-circle" size={50} color="#FFFFFF" />
          </View>
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle} numberOfLines={2}>
              {item.title}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f0cfe3', '#de81fa']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#961e46" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Entertainment</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categoryHeader}>
          <MaterialCommunityIcons name="television-play" size={32} color="#FF6B9D" />
          <Text style={styles.categoryTitle}>{cartoonName}</Text>
        </View>
        <Text style={styles.categorySubtitle}>Tap a video to watch on YouTube</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#9C27B0" />
            <Text style={styles.loadingText}>Loading videos...</Text>
          </View>
        ) : cartoonVideos.length > 0 ? (
          <FlatList
            data={cartoonVideos}
            renderItem={renderCartoonVideoItem}
            keyExtractor={(item) => `cartoon-detail-${item._id || item.id || item.videoId}`}
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={styles.videoGridContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No videos available for this cartoon</Text>
          </View>
        )}
      </ScrollView>

      {/* Video Player Modal */}
      {/* Video Player Modal */}
      {showPlayer && selectedVideoId && (
        <Modal
          visible={showPlayer}
          transparent={false}
          animationType="slide"
          onRequestClose={() => {
            setShowPlayer(false);
            setSelectedVideoId(null);
            setSelectedVideoTitle('');
          }}
        >
          <View style={styles.playerModalContainer}>
            <TouchableOpacity
              style={styles.playerCloseTop}
              onPress={() => {
                setShowPlayer(false);
                setSelectedVideoId(null);
                setSelectedVideoTitle('');
              }}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="close-circle" size={40} color="#FFFFFF" />
            </TouchableOpacity>

            {Platform.OS === 'web' ? (
              <YouTubeVideoPlayer
                key={selectedVideoId}
                videoId={selectedVideoId}
                height={400}
              />
            ) : (
              <YouTubeVideoPlayer
                key={selectedVideoId}
                videoId={selectedVideoId}
                height={300}
              />
            )}
          </View>
        </Modal>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    paddingBottom: 90,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginLeft: 12,
  },
  categorySubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 12,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  videoCard: {
    flex: 0.48,
    marginBottom: 12,
    marginHorizontal: '1%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  videoGradient: {
    padding: 0,
  },
  videoContent: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  videoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
  },
  videoTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  videoGridContainer: {
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  playerModalContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingTop: 40,
  },
  playerCloseTop: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    padding: 10,
  },

});

export default CartoonDetailScreen;
