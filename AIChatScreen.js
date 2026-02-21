import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AIChatScreen = ({ navigation, route }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm WOMBLY's AI Assistant. Ask me anything about pregnancy, toddler care, nutrition, or parenting. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();

  const userEmail = route.params?.userEmail;
  const userName = route.params?.userName || 'User';

  useEffect(() => {
    // Scroll to bottom when messages update
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const getAIResponse = async (userMessage) => {
    // Simulated AI responses based on keywords
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes('pregnancy') ||
      lowerMessage.includes('pregnant') ||
      lowerMessage.includes('pregnant')
    ) {
      return "Pregnancy is an exciting journey! Make sure to:\n• Attend regular prenatal check-ups\n• Eat a balanced diet rich in nutrients\n• Stay hydrated and get adequate rest\n• Take prenatal vitamins as recommended\n\nIs there anything specific about pregnancy you'd like to know?";
    } else if (
      lowerMessage.includes('toddler') ||
      lowerMessage.includes('baby') ||
      lowerMessage.includes('child')
    ) {
      return "Toddler care is important! Here are some tips:\n• Establish a consistent routine\n• Ensure they get 10-14 hours of sleep daily\n• Encourage healthy eating habits\n• Keep them safe and supervised\n• Spend quality time together\n\nWhat specific toddler concern do you have?";
    } else if (
      lowerMessage.includes('nutrition') ||
      lowerMessage.includes('diet') ||
      lowerMessage.includes('eat')
    ) {
      return "Good nutrition is essential:\n• During pregnancy: Focus on calcium, iron, and folic acid\n• For toddlers: Include fruits, vegetables, proteins, and whole grains\n• Stay hydrated throughout the day\n• Limit sugary foods and drinks\n\nWould you like specific meal suggestions?";
    } else if (
      lowerMessage.includes('sleep') ||
      lowerMessage.includes('rest')
    ) {
      return "Sleep is crucial for health:\n• Pregnant women: 8-10 hours per night\n• Toddlers: 10-14 hours daily\n• Establish a bedtime routine\n• Keep the room dark and cool\n• Avoid screens before bed\n\nAre you having sleep issues?";
    } else if (
      lowerMessage.includes('hello') ||
      lowerMessage.includes('hi') ||
      lowerMessage.includes('hey')
    ) {
      return "Hello! Great to see you. How can I help you with pregnancy or parenting today?";
    } else if (
      lowerMessage.includes('thank') ||
      lowerMessage.includes('thanks')
    ) {
      return "You're welcome! Feel free to ask me any more questions whenever you need help. I'm here to support you!";
    } else {
      return "That's a great question! While I can provide general information, please consult with your healthcare provider for medical advice specific to your situation. What else would you like to know?";
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newUserMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(async () => {
      const botResponse = await getAIResponse(inputText);
      const newBotMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newBotMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <LinearGradient
      colors={['#E0F7FA', '#B2DFDB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.botAvatarHeader}>
            <MaterialCommunityIcons name="robot" size={24} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.headerTitle}>WOMBLY AI Assistant</Text>
            <Text style={styles.headerSubtitle}>Always here to help</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.sender === 'user'
                  ? styles.userMessageWrapper
                  : styles.botMessageWrapper,
              ]}
            >
              {message.sender === 'bot' && (
                <View style={styles.botAvatar}>
                  <MaterialCommunityIcons
                    name="robot"
                    size={16}
                    color="#FFFFFF"
                  />
                </View>
              )}
              <View
                style={[
                  styles.messageBubble,
                  message.sender === 'user'
                    ? styles.userMessage
                    : styles.botMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.sender === 'user'
                      ? styles.userMessageText
                      : styles.botMessageText,
                  ]}
                >
                  {message.text}
                </Text>
              </View>
            </View>
          ))}
          {isLoading && (
            <View style={[styles.messageWrapper, styles.botMessageWrapper]}>
              <View style={styles.botAvatar}>
                <MaterialCommunityIcons
                  name="robot"
                  size={16}
                  color="#FFFFFF"
                />
              </View>
              <View style={[styles.messageBubble, styles.botMessage]}>
                <ActivityIndicator size="small" color="#00B894" />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxHeight={100}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              isLoading && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={isLoading || inputText.trim() === ''}
          >
            <LinearGradient
              colors={['#00B894', '#009E7F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sendButtonGradient}
            >
              <MaterialCommunityIcons name="send" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
  },
  header: {
    backgroundColor: 'rgba(0, 184, 148, 0.9)',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    marginRight: 15,
    padding: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  botAvatarHeader: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  messageWrapper: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  botMessageWrapper: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00B894',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  userMessage: {
    backgroundColor: '#00B894',
    borderBottomRightRadius: 3,
  },
  botMessage: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  botMessageText: {
    color: '#2D3436',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2D3436',
    maxHeight: 100,
  },
  sendButton: {
    marginBottom: 2,
  },
  sendButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
});

export default AIChatScreen;
