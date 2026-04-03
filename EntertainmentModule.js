import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, Alert, ActivityIndicator, TextInput, Image, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_BASE_URL } from './apiConfig';
import FloatingChatButton from './components/FloatingChatButton';
import YouTubeVideoPlayer from './components/YouTubeVideoPlayer';

const EntertainmentModule = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('Cartoons');
  const [showDropdown, setShowDropdown] = useState(false);
  const [lullabyChannels, setLullabyChannels] = useState([]);
  const [cartoons, setCartoons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Video player state
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);

  // Cartoon search state
  const [showCartoonSearch, setShowCartoonSearch] = useState(false);



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
    if (!lullaby.videoId) {
      Alert.alert('Error', 'Video ID not available');
      return;
    }
    setSelectedVideoId(lullaby.videoId);
    setSelectedVideoTitle(lullaby.title);
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
    if (!video.videoId) {
      Alert.alert('Error', 'Video ID not available');
      return;
    }
    setSelectedVideoId(video.videoId);
    setSelectedVideoTitle(video.title);
    setShowPlayer(true);
  };

  // Dynamic cartoon search function
  const searchCartoonsHandler = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a cartoon name or keyword');
      return;
    }
    
    try {
      setSearchLoading(true);
      const encodedQuery = encodeURIComponent(searchQuery);
      const response = await fetch(`${API_URL}/cartoons/search/${encodedQuery}?maxResults=10`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setSearchResults(result.data);
      } else {
        Alert.alert('No Results', `No cartoons found for "${searchQuery}"`);
        setSearchResults([]);
      }
    } catch (error) {
      console.log('Error searching cartoons:', error);
      Alert.alert('Error', 'Failed to search for cartoons');
    } finally {
      setSearchLoading(false);
    }
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
        {/* Category Selector - Only show when not viewing cartoon search */}
        {!showCartoonSearch && (
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
        )}

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
                keyExtractor={(item) => item.key}
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

        {selectedCategory === 'Cartoons' && !showCartoonSearch && (
          <View style={styles.contentContainer}>
            <View style={styles.categoryHeader}>
              <MaterialCommunityIcons name="television-play" size={32} color="#FF6B9D" />
              <Text style={styles.categoryTitle}>Fun Cartoons</Text>
            </View>
            <Text style={styles.categorySubtitle}>Educational and entertaining shows for toddlers</Text>
            
            {/* Search Cartoons Button */}
            <TouchableOpacity
              style={styles.searchCartoonButton}
              onPress={() => setShowCartoonSearch(true)}
            >
              <MaterialCommunityIcons name="magnify" size={20} color="#FFFFFF" />
              <Text style={styles.searchCartoonButtonText}>Search for Cartoons</Text>
            </TouchableOpacity>

            {cartoons.length > 0 ? (
              <FlatList
                data={cartoons}
                renderItem={renderCartoonItem}
                keyExtractor={(item) => item.key}
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

        {selectedCategory === 'Cartoons' && showCartoonSearch && (
          <View style={styles.contentContainer}>
            <TouchableOpacity
              style={styles.backToCartoons}
              onPress={() => {
                setShowCartoonSearch(false);
                setSearchQuery('');
                setSearchResults([]);
              }}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="#9C27B0" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            
            <View style={styles.categoryHeader}>
              <MaterialCommunityIcons name="magnify" size={32} color="#FF6B9D" />
              <Text style={styles.categoryTitle}>Search Cartoons</Text>
            </View>
            <Text style={styles.categorySubtitle}>Find your favorite cartoon shows</Text>

            {/* Search Input */}
            <View style={styles.searchInputContainer}>
              <MaterialCommunityIcons name="magnify" size={20} color="#9C27B0" />
              <TextInput
                style={styles.searchInput}
                placeholder="Enter cartoon name..."
                placeholderTextColor="#B0BEC5"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={searchCartoonsHandler}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <MaterialCommunityIcons name="close" size={20} color="#9C27B0" />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.searchButton}
              onPress={searchCartoonsHandler}
              disabled={searchLoading || !searchQuery.trim()}
            >
              {searchLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.searchButtonText}>Search</Text>
              )}
            </TouchableOpacity>

            {searchLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#9C27B0" />
                <Text style={styles.loadingText}>Searching for cartoons...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={({ item }) => (
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
                )}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                numColumns={2}
                columnWrapperStyle={styles.videoGridContainer}
              />
            ) : searchQuery && !searchLoading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No results found</Text>
                <Text style={styles.emptySubtext}>Try searching for a different cartoon</Text>
              </View>
            ) : null}
          </View>
        )}

      </ScrollView>

      {/* Video Player Modal */}
      {showPlayer && selectedVideoId && (
        <Modal
          visible={showPlayer}
          transparent={false}
          animationType="slide"
          onRequestClose={() => setShowPlayer(false)}
        >
          <View style={styles.playerModalContainer}>
            <TouchableOpacity
              style={styles.playerCloseTop}
              onPress={() => setShowPlayer(false)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="close-circle" size={40} color="#FFFFFF" />
            </TouchableOpacity>

            <YouTubeVideoPlayer
              videoId={selectedVideoId}
              height={400}
            />

            <View style={styles.playerInfoContainer}>
              <Text style={styles.playerTitle} numberOfLines={2}>{selectedVideoTitle}</Text>
              <TouchableOpacity
                style={styles.playerCloseButton}
                onPress={() => setShowPlayer(false)}
              >
                <Text style={styles.playerCloseText}>Close Player</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <FloatingChatButton navigation={navigation} />
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
  backToCartoons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9C27B0',
    marginLeft: 8,
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
  videoGridContainer: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  searchCartoonButton: {
    backgroundColor: '#FF6B9D',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchCartoonButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  searchInputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E8D5FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  searchButton: {
    backgroundColor: '#9C27B0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButtonText: {
    fontSize: 16,
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
  playerInfoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#1a1a1a',
  },
  playerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  playerCloseButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
  },
  playerCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
});

export default EntertainmentModule;
