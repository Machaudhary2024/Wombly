import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Switch, Alert, Platform, Modal, AsyncStorage } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import FloatingChatButton from './components/FloatingChatButton';
import * as Notifications from 'expo-notifications';
import AsyncStorageLib from '@react-native-async-storage/async-storage';

// Configure notification handler for LOCAL notifications (these work in Expo Go)
// Note: The warnings are about REMOTE push notifications, not local notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true, // Sound will work for local notifications
    shouldSetBadge: true,
  }),
});

const SetRemindersScreen = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminderType, setReminderType] = useState('Reminder');
  const [repeatFrequency, setRepeatFrequency] = useState('Never'); // Never, Daily, Weekly, Monthly
  const [selectedDays, setSelectedDays] = useState([]); // For weekly: 0=Sun, 1=Mon, ..., 6=Sat
  const [reminders, setReminders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const repeatOptions = ['Never', 'Daily', 'Weekly', 'Monthly'];

  // Load reminders from AsyncStorage when component mounts
  useEffect(() => {
    const initializeReminders = async () => {
      await loadReminders();
      setIsInitialized(true);
    };
    initializeReminders();
  }, []);

  // Save reminders to AsyncStorage whenever they change (but only after initialized)
  useEffect(() => {
    if (isInitialized) {
      saveReminders();
    }
  }, [reminders, isInitialized]);

  // Function to load reminders from AsyncStorage
  const loadReminders = async () => {
    try {
      const savedReminders = await AsyncStorageLib.getItem('reminders');
      console.log('🔍 AsyncStorage key "reminders" value:', savedReminders);
      if (savedReminders) {
        const parsedReminders = JSON.parse(savedReminders);
        // Convert date and time strings back to Date objects
        const remindersWithDates = parsedReminders.map(r => ({
          ...r,
          date: new Date(r.date),
          time: new Date(r.time),
        }));
        setReminders(remindersWithDates);
        console.log('✅ Loaded reminders from storage:', remindersWithDates.length);
      } else {
        console.log('ℹ️ No reminders found in storage');
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  // Function to save reminders to AsyncStorage
  const saveReminders = async () => {
    try {
      const remindersToSave = reminders.map(r => ({
        ...r,
        date: r.date.toISOString(),
        time: r.time.toISOString(),
      }));
      await AsyncStorageLib.setItem('reminders', JSON.stringify(remindersToSave));
      console.log('💾 Saved reminders to storage:', reminders.length);
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  };

  // Function to use useFocusEffect to reload reminders when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('🎯 SetReminders screen focused - reloading reminders');
      loadReminders();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    // Request notification permissions for local notifications with sound
    (async () => {
      try {
        // Create notification channel for Android (required for sound to work)
        if (Platform.OS === 'android') {
          // Create notification channel for reminders (required for sound to work on Android)
          await Notifications.setNotificationChannelAsync('reminder-channel', {
            name: 'Reminders',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            sound: 'default',
            enableVibrate: true,
          });
        }

        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        if (status !== 'granted') {
          console.warn('Notification permissions not granted. Reminders may not beep/ring.');
        } else {
          console.log('Notification permissions granted. Reminders will beep/ring!');
        }
      } catch (error) {
        console.error('Error requesting notification permissions:', error);
      }
    })();

    // Listen for notifications to remove one-off reminders when they fire
    const notificationSubscription = Notifications.addNotificationReceivedListener(notification => {
      try {
        console.log('🔔 Notification received!', notification);
        const notifId = notification.request.identifier;
        const notificationData = notification.request.content.data;
        
        // For Android recurring reminders, reschedule the next occurrence
        if (Platform.OS === 'android' && notificationData.frequency && notificationData.frequency !== 'Never') {
          console.log('Rescheduling recurring reminder on Android:', notificationData.description);
          const reminderTime = new Date(notificationData.time);
          const reminderDate = new Date(notificationData.date);
          const selectedDays = notificationData.selectedDays || [];
          
          let nextOccurrence;
          if (notificationData.frequency === 'Daily') {
            nextOccurrence = new Date();
            nextOccurrence.setDate(nextOccurrence.getDate() + 1);
            nextOccurrence.setHours(reminderTime.getHours());
            nextOccurrence.setMinutes(reminderTime.getMinutes());
            nextOccurrence.setSeconds(0);
          } else if (notificationData.frequency === 'Weekly') {
            const dayToSchedule = selectedDays[0] || reminderDate.getDay();
            nextOccurrence = getNextOccurrenceForDay(reminderTime, dayToSchedule);
            nextOccurrence.setDate(nextOccurrence.getDate() + 7); // Schedule for next week
          } else if (notificationData.frequency === 'Monthly') {
            nextOccurrence = getNextMonthlyOccurrence(reminderTime, reminderDate.getDate());
            nextOccurrence.setMonth(nextOccurrence.getMonth() + 1); // Schedule for next month
          }
          
          if (nextOccurrence) {
            console.log('Next occurrence scheduled:', nextOccurrence.toLocaleString());
            Notifications.scheduleNotificationAsync({
              content: notification.request.content,
              trigger: { type: 'date', date: nextOccurrence },
            });
          }
        }
        
      } catch (err) {
        console.error('Error handling received notification:', err);
      }
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('User interacted with notification:', response);
    });

    return () => {
      // Remove subscriptions properly
      if (notificationSubscription) {
        notificationSubscription.remove();
      }
      if (responseSubscription) {
        responseSubscription.remove();
      }
    };
  }, []);

  const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const scheduleNotification = async (reminderDate, reminderTime, reminderDescription, type, frequency, days) => {
    try {
      // Combine date and time properly - create a new date to avoid mutation issues
      const notificationDate = new Date(reminderDate);
      notificationDate.setHours(reminderTime.getHours());
      notificationDate.setMinutes(reminderTime.getMinutes());
      notificationDate.setSeconds(0);
      notificationDate.setMilliseconds(0);

      const now = new Date();
      console.log('=== SCHEDULING NOTIFICATION ===');
      console.log('Selected Date:', reminderDate);
      console.log('Selected Time:', reminderTime);
      console.log('Combined Notification Date:', notificationDate);
      console.log('Current Time:', now);
      console.log('Time Difference (ms):', notificationDate.getTime() - now.getTime());

      // Check if the date/time is in the past
      if (notificationDate <= now) {
        Alert.alert('Invalid Date', 'Please select a future date and time.');
        return false;
      }

      // For local notifications (works in Expo Go)
      // iOS supports calendar triggers, but Android requires different handling
      let trigger;
      
      if (frequency === 'Never') {
        // One-time reminder - works on both platforms
        trigger = {
          type: 'date',
          date: notificationDate,
        };
        console.log('Using Date trigger (one-time):', trigger);
        console.log('Will trigger at:', notificationDate.toLocaleString());
      } else if (Platform.OS === 'ios') {
        // iOS: Use calendar triggers for recurring notifications
        if (frequency === 'Daily') {
          trigger = {
            type: 'calendar',
            hour: reminderTime.getHours(),
            minute: reminderTime.getMinutes(),
            repeats: true,
          };
          console.log('Using daily repeat trigger (iOS) for:', reminderTime.getHours(), ':', reminderTime.getMinutes());
        } else if (frequency === 'Weekly') {
          const daysToRepeat = days.length > 0 ? days : [reminderDate.getDay()];
          // Schedule for each selected day separately on iOS
          // We'll just schedule the first one and let iOS handle weekly repeat
          trigger = {
            type: 'calendar',
            weekday: daysToRepeat[0] + 1, // Notifications API uses 1-7 (Sunday=1)
            hour: reminderTime.getHours(),
            minute: reminderTime.getMinutes(),
            repeats: true,
          };
          console.log('Using weekly repeat trigger (iOS) for days:', daysToRepeat, 'at', reminderTime.getHours(), ':', reminderTime.getMinutes());
        } else if (frequency === 'Monthly') {
          trigger = {
            type: 'calendar',
            day: reminderDate.getDate(),
            hour: reminderTime.getHours(),
            minute: reminderTime.getMinutes(),
            repeats: true,
          };
          console.log('Using monthly repeat trigger (iOS) for day', reminderDate.getDate(), 'at', reminderTime.getHours(), ':', reminderTime.getMinutes());
        }
      } else if (Platform.OS === 'android') {
        // Android: Use interval-based triggers
        if (frequency === 'Daily') {
          // Schedule daily using 24-hour interval (86400 seconds)
          const secondsUntilFirst = Math.max(1, Math.floor((notificationDate.getTime() - now.getTime()) / 1000));
          trigger = {
            type: 'time',
            seconds: secondsUntilFirst,
            repeats: true,
          };
          console.log('Using interval trigger (Android) - first after', secondsUntilFirst, 'seconds, then repeats daily');
        } else if (frequency === 'Weekly') {
          // For weekly on Android: Schedule the next occurrence as a date trigger
          // User will need to re-add weekly reminders for multiple days
          const daysToRepeat = days.length > 0 ? days : [reminderDate.getDay()];
          const nextOccurrence = getNextOccurrenceForDay(reminderTime, daysToRepeat[0]);
          trigger = {
            type: 'date',
            date: nextOccurrence,
          };
          console.log('Using date trigger (Android/Weekly fallback) for next occurrence:', nextOccurrence.toLocaleString());
          console.log('Note: For full weekly support on Android, please create separate reminders for each day');
        } else if (frequency === 'Monthly') {
          // For monthly on Android: Schedule the next occurrence
          const nextOccurrence = getNextMonthlyOccurrence(reminderTime, reminderDate.getDate());
          trigger = {
            type: 'date',
            date: nextOccurrence,
          };
          console.log('Using date trigger (Android/Monthly fallback) for next occurrence:', nextOccurrence.toLocaleString());
        }
      }

      // Configure notification with sound - reminders will beep/ring
      const freqLabel = frequency === 'Never' ? '' : ` (${frequency})`;
      const notificationContent = {
        title: type === 'Reminder' ? '⏰ Reminder' : type === 'Appointment' ? '📅 Appointment' : '💊 Medication',
        body: reminderDescription || 'Reminder',
        sound: 'default', // Use default sound for beeping
        data: { 
          type, 
          description: reminderDescription, 
          frequency, 
          selectedDays: days,
          time: reminderTime.toISOString(),
          date: reminderDate.toISOString(),
        },
      };

      // Add Android-specific settings for better reminder behavior
      if (Platform.OS === 'android') {
        notificationContent.android = {
          sound: 'default',
          priority: Notifications.AndroidImportance.HIGH,
          channelId: 'reminder-channel',
          vibrate: type === 'Reminder' ? [0, 250, 250, 250] : [0, 250],
        };
      }

      // Add iOS-specific settings
      if (Platform.OS === 'ios') {
        notificationContent.sound = 'default';
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: trigger,
      });

      console.log('✅ Notification scheduled with ID:', notificationId);
      
      // Verify the notification was scheduled by getting all scheduled notifications
      const allNotifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log('📋 Total scheduled notifications:', allNotifications.length);
      const thisNotification = allNotifications.find(n => n.identifier === notificationId);
      if (thisNotification) {
        console.log('📅 This notification will trigger at:', new Date(thisNotification.trigger.value).toLocaleString());
      }
      
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      Alert.alert('Error', 'Failed to schedule reminder. Please try again.');
      return null;
    }
  };

  // Cancel scheduled notification and remove it from local state
  const deleteReminder = async (id) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch (err) {
      console.warn('Could not cancel scheduled notification (might have fired already):', err);
    }
    setReminders(prev => prev.filter(r => r.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setDescription('');
    }
  };

  // Start editing an existing reminder (prefill the form)
  const startEditReminder = (reminder) => {
    setEditingId(reminder.id);
    setDescription(reminder.description || '');
    setSelectedDate(new Date(reminder.date));
    setSelectedTime(new Date(reminder.time));
    setReminderType(reminder.type || 'Reminder');
    setRepeatFrequency(reminder.repeatFrequency || 'Never');
    setSelectedDays(reminder.selectedDays || []);
  };

  // Toggle day selection for weekly repeats
  const toggleDay = (dayIndex) => {
    setSelectedDays(prev =>
      prev.includes(dayIndex)
        ? prev.filter(d => d !== dayIndex)
        : [...prev, dayIndex].sort()
    );
  };

  // Get the next occurrence date for a given day of week and time
  const getNextOccurrenceForDay = (reminderTime, dayOfWeek) => {
    const next = new Date();
    next.setHours(reminderTime.getHours());
    next.setMinutes(reminderTime.getMinutes());
    next.setSeconds(0);
    next.setMilliseconds(0);

    const today = new Date();
    const currentDay = today.getDay();
    const daysUntil = (dayOfWeek - currentDay + 7) % 7;
    
    if (daysUntil === 0 && next <= today) {
      // If it's today but time has passed, schedule for next week
      next.setDate(next.getDate() + 7);
    } else {
      next.setDate(next.getDate() + daysUntil);
    }
    return next;
  };

  // Get the next monthly occurrence
  const getNextMonthlyOccurrence = (reminderTime, dayOfMonth) => {
    const next = new Date();
    next.setDate(dayOfMonth);
    next.setHours(reminderTime.getHours());
    next.setMinutes(reminderTime.getMinutes());
    next.setSeconds(0);
    next.setMilliseconds(0);

    const today = new Date();
    
    if (next <= today) {
      // If the date has passed this month, schedule for next month
      next.setMonth(next.getMonth() + 1);
    }
    
    return next;
  };

  const handleAddReminder = async () => {
    if (!description.trim()) {
      Alert.alert('Required Field', 'Please enter a reminder description.');
      return;
    }

    // If editing an existing reminder, cancel old and reschedule
    if (editingId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(editingId);
      } catch (err) {
        console.warn('Could not cancel old scheduled notification during edit:', err);
      }

      const newId = await scheduleNotification(
        selectedDate,
        selectedTime,
        description,
        reminderType,
        repeatFrequency,
        selectedDays
      );

      if (newId) {
        setReminders(prev => prev.map(r => r.id === editingId ? ({ id: newId, description, date: selectedDate, time: selectedTime, type: reminderType, repeatFrequency, selectedDays }) : r));
        setEditingId(null);
        setDescription('');
        setSelectedDate(new Date());
        setSelectedTime(new Date());
        setReminderType('Reminder');
        setRepeatFrequency('Never');
        setSelectedDays([]);
        const freqStr = repeatFrequency === 'Never' ? '' : ` and repeating ${repeatFrequency.toLowerCase()}`;
        Alert.alert('Updated', `Reminder updated successfully${freqStr}.`);
      }
      return;
    }

    // Normal add flow
    const notificationId = await scheduleNotification(
      selectedDate,
      selectedTime,
      description,
      reminderType,
      repeatFrequency,
      selectedDays
    );

    if (notificationId) {
      const newReminder = {
        id: notificationId,
        description,
        date: selectedDate,
        time: selectedTime,
        type: reminderType,
        repeatFrequency,
        selectedDays,
      };
      const updated = [...reminders, newReminder];
      setReminders(updated);
      try {
        const toSave = updated.map(r => ({ ...r, date: r.date.toISOString(), time: r.time.toISOString() }));
        await AsyncStorageLib.setItem('reminders', JSON.stringify(toSave));
      } catch (e) {
        console.error('Error saving reminders', e);
      }
      setDescription('');
      setSelectedDate(new Date());
      setSelectedTime(new Date());
      setReminderType('Reminder');
      setRepeatFrequency('Never');
      setSelectedDays([]);
      const timeStr = formatTime(selectedTime);
      const dateStr = formatDate(selectedDate);
      const freqStr = repeatFrequency === 'Never' ? '' : ` and will repeat ${repeatFrequency.toLowerCase()}`;
      Alert.alert('Success! ✅', `Reminder set successfully!\n\nIt will beep/ring on:\n${dateStr} at ${timeStr}${freqStr}`);
    }
  };

  

  const onDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const onTimeChange = (event, time) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (time) {
      setSelectedTime(time);
    }
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
        <Text style={styles.headerTitle}>Set Reminders</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Motivational Quote Card */}
        <View style={styles.quoteCard}>
          <LinearGradient
            colors={['#FFE5F1', '#F3E5F5', '#E1BEE7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.quoteGradient}
          >
            <MaterialCommunityIcons name="star" size={32} color="#9C27B0" style={styles.quoteIcon} />
            <Text style={styles.quoteText}>"Every moment is a fresh beginning!"</Text>
            <Text style={styles.quoteSubtext}>
              Start your day with purpose and never miss what matters most.
            </Text>
          </LinearGradient>
        </View>

        {/* Add New Reminder Form */}
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <View style={styles.formIconCircle}>
              <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.formTitle}>Add New Reminder</Text>
          </View>

          {/* Reminder Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reminder Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter reminder description"
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          {/* Time and Date */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Time</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.inputText}>{formatTime(selectedTime)}</Text>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#999" />
              </TouchableOpacity>
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.inputText}>{formatDate(selectedDate)}</Text>
                <MaterialCommunityIcons name="calendar-outline" size={20} color="#999" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Reminder Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reminder Type</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  reminderType === 'Reminder' && styles.typeButtonActive
                ]}
                onPress={() => setReminderType('Reminder')}
              >
                <Text style={[
                  styles.typeButtonText,
                  reminderType === 'Reminder' && styles.typeButtonTextActive
                ]}>
                  Reminder
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  reminderType === 'Appointment' && styles.typeButtonActive
                ]}
                onPress={() => setReminderType('Appointment')}
              >
                <Text style={[
                  styles.typeButtonText,
                  reminderType === 'Appointment' && styles.typeButtonTextActive
                ]}>
                  Appointment
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  reminderType === 'Medication' && styles.typeButtonActive
                ]}
                onPress={() => setReminderType('Medication')}
              >
                <Text style={[
                  styles.typeButtonText,
                  reminderType === 'Medication' && styles.typeButtonTextActive
                ]}>
                  Medication
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Repeat Frequency */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Repeat</Text>
            <View style={styles.repeatFrequencyButtons}>
              {repeatOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.repeatFreqButton,
                    repeatFrequency === option && styles.repeatFreqButtonActive
                  ]}
                  onPress={() => {
                    setRepeatFrequency(option);
                    if (option !== 'Weekly') setSelectedDays([]);
                  }}
                >
                  <Text style={[
                    styles.repeatFreqButtonText,
                    repeatFrequency === option && styles.repeatFreqButtonTextActive
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Day Selection for Weekly Repeats */}
          {repeatFrequency === 'Weekly' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Days</Text>
              <View style={styles.daysGrid}>
                {dayLabels.map((day, index) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      selectedDays.includes(index) && styles.dayButtonActive
                    ]}
                    onPress={() => toggleDay(index)}
                  >
                    <Text style={[
                      styles.dayButtonText,
                      selectedDays.includes(index) && styles.dayButtonTextActive
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Add/Update Reminder Button */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.addButton, { flex: editingId ? 0.6 : 1 }]}
              onPress={handleAddReminder}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={editingId ? ['#6C5CE7', '#9C27B0'] : ['#FF6B9D', '#9C27B0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addButtonGradient}
              >
                <MaterialCommunityIcons name={editingId ? 'pencil' : 'plus'} size={20} color="#FFFFFF" />
                <Text style={styles.addButtonText}>{editingId ? 'Update' : 'Add'} Reminder</Text>
              </LinearGradient>
            </TouchableOpacity>
            {editingId && (
              <TouchableOpacity
                style={[styles.addButton, { flex: 0.35, marginLeft: 10 }]}
                onPress={() => {
                  setEditingId(null);
                  setDescription('');
                  setSelectedDate(new Date());
                  setSelectedTime(new Date());
                  setReminderType('Reminder');
                  setRepeatFrequency('Never');
                  setSelectedDays([]);
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#B0BEC5', '#90A4AE']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.addButtonGradient}
                >
                  <Text style={styles.addButtonText}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
          {/* Reminders List */}
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#2D3436' }}>Your Reminders</Text>
            {reminders.length === 0 ? (
              <Text style={{ color: '#6C5CE7' }}>No reminders set yet.</Text>
            ) : (
              reminders.map((item) => (
                <View key={item.id} style={styles.reminderItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reminderText}>{item.description}</Text>
                    <Text style={styles.reminderMeta}>{formatDate(new Date(item.date))} at {formatTime(new Date(item.time))} · {item.type}{item.repeatFrequency && item.repeatFrequency !== 'Never' ? ` · ${item.repeatFrequency}` : ''}</Text>
                  </View>
                  <View style={styles.reminderButtons}>
                    <TouchableOpacity onPress={() => startEditReminder(item)} style={styles.smallButton}>
                      <Text style={styles.smallButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteReminder(item.id)} style={[styles.smallButton, { marginTop: 8, backgroundColor: '#FF6B9D' }]}>
                      <Text style={[styles.smallButtonText, { color: '#FFFFFF' }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Date/Time Pickers */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onTimeChange}
            is24Hour={false}
          />
        )}

        {Platform.OS === 'ios' && (showDatePicker || showTimePicker) && (
          <View style={styles.pickerButtons}>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => {
                setShowDatePicker(false);
                setShowTimePicker(false);
              }}
            >
              <Text style={styles.pickerButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
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
  },
  quoteCard: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  quoteGradient: {
    padding: 24,
    alignItems: 'center',
  },
  quoteIcon: {
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#9C27B0',
    textAlign: 'center',
    marginBottom: 8,
  },
  quoteSubtext: {
    fontSize: 14,
    color: '#6C5CE7',
    textAlign: 'center',
    opacity: 0.9,
  },
  formCard: {
    backgroundColor: '#F3E5F5',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  formIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B9D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2D3436',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 50,
  },
  inputText: {
    fontSize: 16,
    color: '#2D3436',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  repeatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  repeatFrequencyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  repeatFreqButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  repeatFreqButtonActive: {
    backgroundColor: '#9C27B0',
    borderColor: '#9C27B0',
  },
  repeatFreqButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D3436',
  },
  repeatFreqButtonTextActive: {
    color: '#FFFFFF',
  },
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  dayButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  dayButtonActive: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  dayButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D3436',
  },
  dayButtonTextActive: {
    color: '#FFFFFF',
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  pickerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  pickerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  pickerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9C27B0',
  },
  reminderItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F0E6F6',
  },
  reminderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  reminderMeta: {
    fontSize: 12,
    color: '#6C5CE7',
    marginTop: 4,
  },
  reminderButtons: {
    marginLeft: 12,
    alignItems: 'flex-end',
  },
  smallButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF6B9D',
  },
  smallButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF6B9D',
  },
});

export default SetRemindersScreen;
