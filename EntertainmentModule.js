import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, ActivityIndicator, Image, Modal, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_BASE_URL } from './apiConfig';
import YouTubeVideoPlayer from './components/YouTubeVideoPlayer';

const EntertainmentModule = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('Cartoons');
  const [showDropdown, setShowDropdown] = useState(false);
  const [lullabyChannels, setLullabyChannels] = useState([]);
  const [cartoons, setCartoons] = useState([]);
  const [loading, setLoading] = useState(false);

  // Video player state
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('error');

  const showNotificationModal = (title, message, type = 'error') => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };



  const API_URL = `${API_BASE_URL}/api/entertainment`;

  // Default lullaby channels for fallback
  const defaultLullabyChannels = [
    {
      key: 'SuperSimpleSongs',
      name: 'Super Simple Songs',
      description: 'Educational songs for babies',
      icon: 'music-box-outline',
    },
    {
      key: 'ZeaZaraKidsTV',
      name: 'Zea Zara Kids TV',
      description: 'Creative nursery rhymes',
      icon: 'music-note-multiple',
    },
    {
      key: 'Kidzone',
      name: 'Kidzone',
      description: 'Relaxing children songs',
      icon: 'music-sleep',
    },
    {
      key: 'BabyTV',
      name: 'BabyTV',
      description: 'Gentle lullabies for sleep',
      icon: 'baby-carriage',
    },
    {
      key: 'TinyMuslimsClub',
      name: 'Tiny Muslims Club',
      description: 'Islamic nursery rhymes',
      icon: 'quran',
    },
  ];

  // Fetch lullaby channels from API
  useEffect(() => {
    const fetchLullabyChannels = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/lullabies/channels`);
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          setLullabyChannels(result.data);
        } else {
          // Use default lullaby channels if API returns empty
          setLullabyChannels(defaultLullabyChannels);
        }
      } catch (error) {
        console.log('Error fetching lullaby channels:', error);
        // Use default lullaby channels on error
        setLullabyChannels(defaultLullabyChannels);
      } finally {
        setLoading(false);
      }
    };

    fetchLullabyChannels();
  }, []);

  // Fetch cartoon channels info
  useEffect(() => {
    const fetchCartoons = async () => {
      try {
        const response = await fetch(`${API_URL}/cartoons/channels`);
        const result = await response.json();
        if (result.success && result.data) {
          setCartoons(result.data);
        }
      } catch (error) {
        console.log('Error fetching cartoons:', error);
      }
    };

    fetchCartoons();
  }, []);



  const handlePlayLullaby = (lullaby) => {
    if (!lullaby || !lullaby.videoId) {
      showNotificationModal('Error', 'Video ID not available. Please try another lullaby.', 'error');
      return;
    }
    // Ensure videoId is a string and valid
    const validVideoId = String(lullaby.videoId).trim();
    if (!validVideoId) {
      showNotificationModal('Error', 'Invalid video ID', 'error');
      return;
    }
    setSelectedVideoId(validVideoId);
    setSelectedVideoTitle(lullaby.title || 'Untitled Lullaby');
    setShowPlayer(true);
  };

  const handleCartoonPress = (cartoonKey, cartoonName) => {
    navigation.navigate('CartoonDetail', {
      cartoonKey,
      cartoonName,
    });
  };

  const handleLullabyPress = (lullabyKey, lullabyName) => {
    navigation.navigate('LullabyDetail', {
      lullabyKey,
      lullabyName,
    });
  };

  const handlePlayCartoon = (video) => {
    if (!video || !video.videoId) {
      showNotificationModal('Error', 'Video ID not available. Please try another video.', 'error');
      return;
    }
    // Ensure videoId is a string and valid
    const validVideoId = String(video.videoId).trim();
    if (!validVideoId) {
      showNotificationModal('Error', 'Invalid video ID', 'error');
      return;
    }
    setSelectedVideoId(validVideoId);
    setSelectedVideoTitle(video.title || 'Untitled Video');
    setShowPlayer(true);
  };



  const categories = [
    { id: 1, name: 'Lullabies', icon: 'moon-waning-crescent', color: '#E8D5FF' },
    { id: 2, name: 'Cartoons', icon: 'television-play', color: '#FFE5F1' },
  ];

  const renderChannelBox = ({ item, type = 'cartoon' }) => (
    <TouchableOpacity
      style={styles.channelBox}
      activeOpacity={0.75}
      onPress={() => type === 'cartoon' ? handleCartoonPress(item.key, item.name) : handleLullabyPress(item.key, item.name)}
    >
      <LinearGradient
        colors={type === 'cartoon' ? ['#FFE5F1', '#F3E5F5'] : ['#E8D5FF', '#F3E5F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.channelBoxGradient}
      >
        <View style={styles.channelBoxIcon}>
          <MaterialCommunityIcons
            name={item.icon}
            size={48}
            color={type === 'cartoon' ? '#FF6B9D' : '#9C27B0'}
          />
        </View>
        <Text style={styles.channelBoxName}>{item.name}</Text>
        <Text style={styles.channelBoxDescription} numberOfLines={1}>{item.description}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCartoonItem = ({ item }) => (
    renderChannelBox({ item, type: 'cartoon' })
  );

  const renderLullabyItem = ({ item }) => (
    renderChannelBox({ item, type: 'lullaby' })
  );

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
        {/* Category Selector */}
        <View style={styles.selectorContainer}>
          <Text style={styles.selectorLabel}>Choose Entertainment Type</Text>
          
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <MaterialCommunityIcons
              name={selectedCategory ? (selectedCategory === 'Lullabies' ? 'moon-waning-crescent' : 'television-play') : 'menu-down'}
              size={24}
              color="#9C27B0"
            />
            <Text style={styles.dropdownButtonText}>
              {selectedCategory || 'Select a category'}
            </Text>
            <MaterialCommunityIcons
              name={showDropdown ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#9C27B0"
            />
          </TouchableOpacity>

          {/* Dropdown Menu */}
          {showDropdown && (
            <View style={styles.dropdownMenu}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedCategory(category.name);
                    setShowDropdown(false);
                  }}
                >
                  <MaterialCommunityIcons
                    name={category.icon}
                    size={20}
                    color="#9C27B0"
                    style={styles.dropdownItemIcon}
                  />
                  <Text style={styles.dropdownItemText}>{category.name}</Text>
                  {selectedCategory === category.name && (
                    <MaterialCommunityIcons name="check" size={20} color="#FF6B9D" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Content Display */}
        {selectedCategory === 'Lullabies' && (
          <View style={styles.contentContainer}>
            <View style={styles.categoryHeader}>
              <MaterialCommunityIcons name="moon-waning-crescent" size={32} color="#9C27B0" />
              <Text style={styles.categoryTitle}>Soothing Lullabies</Text>
            </View>
            <Text style={styles.categorySubtitle}>Help your little one fall asleep peacefully</Text>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#9C27B0" />
                <Text style={styles.loadingText}>Loading lullaby channels...</Text>
              </View>
            ) : lullabyChannels.length > 0 ? (
              <FlatList
                data={lullabyChannels}
                renderItem={renderLullabyItem}
                keyExtractor={(item) => `lullaby-${item.key}`}
                scrollEnabled={false}
                numColumns={2}
                columnWrapperStyle={styles.gridContainer}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No lullaby channels available</Text>
              </View>
            )}
          </View>
        )}

        {selectedCategory === 'Cartoons' && (
          <View style={styles.contentContainer}>
            <View style={styles.categoryHeader}>
              <MaterialCommunityIcons name="television-play" size={32} color="#FF6B9D" />
              <Text style={styles.categoryTitle}>Fun Cartoons</Text>
            </View>
            <Text style={styles.categorySubtitle}>Educational and entertaining shows for toddlers</Text>

            {cartoons.length > 0 ? (
              <FlatList
                data={cartoons}
                renderItem={renderCartoonItem}
                keyExtractor={(item) => `cartoon-${item.key}`}
                scrollEnabled={false}
                numColumns={2}
                columnWrapperStyle={styles.gridContainer}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No cartoons available</Text>
              </View>
            )}
          </View>
        )}

      </ScrollView>

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

            <YouTubeVideoPlayer
              key={selectedVideoId}
              videoId={selectedVideoId}
              height={Platform.OS === 'web' ? 400 : 300}
            />

            {Platform.OS !== 'web' && (
              <View style={styles.mobilePlayerInfo}>
                <Text style={styles.mobilePlayerInfoText}>Tap the video to enter fullscreen mode</Text>
              </View>
            )}
          </View>
        </Modal>
      )}

      {/* Success/Error Modal */}
      <Modal
        transparent={true}
        visible={showModal}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <MaterialCommunityIcons
              name={modalType === 'success' ? 'check-circle' : 'alert-circle'}
              size={50}
              color={modalType === 'success' ? '#00B894' : '#FF6B9D'}
            />
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonYes]}
              onPress={closeModal}
            >
              <Text style={styles.modalButtonYesText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    padding: 20,
    paddingBottom: 90,
  },
  selectorContainer: {
    marginBottom: 24,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 12,
  },
  dropdownButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    flex: 1,
    marginHorizontal: 12,
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E6F6',
  },
  dropdownItemIcon: {
    marginRight: 12,
  },
  dropdownItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2D3436',
    flex: 1,
  },
  contentContainer: {
    marginTop: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3436',
    marginLeft: 12,
  },
  categorySubtitle: {
    fontSize: 14,
    color: '#6C5CE7',
    marginBottom: 16,
  },
  itemCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemGradient: {
    padding: 12,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: '#6C5CE7',
    marginBottom: 4,
  },
  itemDuration: {
    fontSize: 12,
    color: '#B0BEC5',
    fontStyle: 'italic',
  },
  playButton: {
    marginLeft: 12,
  },
  cartoonCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cartoonGradient: {
    padding: 14,
  },
  cartoonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartoonIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(156, 39, 176, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cartoonTextContainer: {
    flex: 1,
  },
  cartoonTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 4,
  },
  cartoonDescription: {
    fontSize: 13,
    color: '#6C5CE7',
    marginBottom: 4,
  },
  cartoonRating: {
    fontSize: 13,
    color: '#FF6B9D',
    fontWeight: '600',
  },
  watchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B9D',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6C5CE7',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: '#6C5CE7',
    marginTop: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  videoCard: {
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
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
  playerModalContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  playerCloseTop: {
    alignSelf: 'flex-end',
    paddingRight: 20,
    paddingBottom: 20,
  },

  mobilePlayerInfo: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B9D',
  },
  mobilePlayerInfoText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FF6B9D',
    textAlign: 'center',
  },
  channelBox: {
    flex: 0.48,
    marginBottom: 12,
    marginHorizontal: '1%',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  channelBoxGradient: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
  },
  channelBoxIcon: {
    marginBottom: 10,
  },
  channelBoxName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D3436',
    textAlign: 'center',
    marginBottom: 4,
  },
  channelBoxDescription: {
    fontSize: 12,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 16,
  },
  gridContainer: {
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  backToLullabies: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    color: '#9C27B0',
    fontWeight: '600',
    marginLeft: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 12,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonYes: {
    backgroundColor: '#FF6B9D',
  },
  modalButtonYesText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default EntertainmentModule;
