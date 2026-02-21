import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const NutritionGuideScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E8D5FF', '#D4B3FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nutrition Guide</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Healthy Eating in Pregnancy</Text>
          <Text style={styles.text}>
            Eating well is one of the best things you can do for yourself and your baby. 
            Aim for a balanced diet with plenty of fruits, vegetables, whole grains, and lean proteins.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Essential Nutrients</Text>
          <View style={styles.nutrientItem}>
            <Text style={styles.nutrientTitle}>Folic Acid</Text>
            <Text style={styles.text}>Crucial for baby's neural tube development.</Text>
          </View>
          <View style={styles.nutrientItem}>
            <Text style={styles.nutrientTitle}>Iron</Text>
            <Text style={styles.text}>Helps red blood cells deliver oxygen to your baby.</Text>
          </View>
          <View style={styles.nutrientItem}>
            <Text style={styles.nutrientTitle}>Calcium</Text>
            <Text style={styles.text}>Builds strong bones and teeth.</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.dosDontsButton}
          onPress={() => navigation.navigate('DosDonts')}
        >
          <LinearGradient
            colors={['#FF6B9D', '#FF8EQA']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Check Food Do's & Don'ts</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
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
    elevation: 4,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 34,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C5CE7',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#2D3436',
    lineHeight: 24,
  },
  nutrientItem: {
    marginBottom: 15,
  },
  nutrientTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 5,
  },
  dosDontsButton: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NutritionGuideScreen;
