import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_BASE_URL } from './apiConfig';
import FloatingChatButton from './components/FloatingChatButton';

const categories = [
  { key: 'All', label: 'All' },
  { key: 'Fruit', label: 'Fruit' },
  { key: 'Dairy', label: 'Dairy' },
  { key: 'Meat', label: 'Meat' },
  { key: 'Drinks', label: 'Drinks' },
  { key: 'Veggies', label: 'Veggies' },
  { key: 'Grains', label: 'Grains' },
  { key: 'Meals', label: 'Meals' },
];

const DosDontsScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const params = [];
      if (selectedCategory !== 'All') params.push(`category=${encodeURIComponent(selectedCategory)}`);
      if (search.trim()) params.push(`search=${encodeURIComponent(search.trim())}`);
      const qs = params.length ? `?${params.join('&')}` : '';
      const res = await fetch(`${API_BASE_URL}/api/nutrition/dos-donts${qs}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data || []);
      } else {
        setError(json.message || 'Could not load data');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const onSearchSubmit = () => {
    fetchData();
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
        <Text style={styles.headerTitle}>Do’s & Don’ts</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search foods or notes"
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={onSearchSubmit}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={onSearchSubmit}>
          <MaterialCommunityIcons name="magnify" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryRow}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.categoryChip,
              selectedCategory === cat.key && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(cat.key)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat.key && styles.categoryTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#6C5CE7" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {!loading && !error && data.length === 0 ? (
          <Text style={styles.emptyText}>No items found.</Text>
        ) : null}
        {data.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => toggleExpand(item.id)}
            activeOpacity={0.9}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.pill, item.type === 'Do' ? styles.doPill : styles.dontPill]}>
                <Text style={styles.pillText}>{item.type}</Text>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardCategory}>{item.category}</Text>
              <MaterialCommunityIcons
                name={expandedId === item.id ? 'chevron-up' : 'chevron-down'}
                size={22}
                color="#636E72"
              />
            </View>
            {expandedId === item.id && (
              <View style={styles.cardBody}>
                <Text style={styles.sectionLabel}>Benefits</Text>
                <Text style={styles.bodyText}>{item.benefits}</Text>
                <Text style={styles.sectionLabel}>Risks</Text>
                <Text style={styles.bodyText}>{item.risks}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FloatingChatButton navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#6C5CE7', flex: 1, textAlign: 'center' },
  headerSpacer: { width: 24 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#F9F9F9',
    color: '#2D3436',
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: '#6C5CE7',
    borderRadius: 10,
    padding: 10,
  },
  categoryScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  categoryRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#6C5CE7',
  },
  categoryText: { fontSize: 13, color: '#2D3436', fontWeight: '600' },
  categoryTextActive: { color: '#FFFFFF' },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingBottom: 90 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  loadingText: { marginLeft: 10, color: '#636E72' },
  errorText: { color: '#F44336', marginVertical: 12 },
  emptyText: { color: '#636E72', marginVertical: 12 },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  doPill: { backgroundColor: '#E8F5E9' },
  dontPill: { backgroundColor: '#FFEBEE' },
  pillText: { fontSize: 12, fontWeight: '700', color: '#2D3436' },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: '#2D3436' },
  cardCategory: { fontSize: 12, color: '#6C5CE7', marginRight: 6 },
  cardBody: { marginTop: 10 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#2D3436', marginBottom: 4 },
  bodyText: { fontSize: 13, color: '#2D3436', lineHeight: 20, marginBottom: 8 },
});

export default DosDontsScreen;

