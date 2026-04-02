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
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { API_BASE_URL } from './apiConfig'; // Importing the backend URL from a separate config file

const BACKEND_URL = API_BASE_URL; // Use the imported API_BASE_URL

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

  const [showClearModal, setShowClearModal] = useState(false); // for deleting chat history confirmation custom pop-up
  useEffect(() => {
    // Scroll to bottom when messages update
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // ============ CHATBOT IMPLEMENTATION UPDATED CODE =============
  const getAIResponse = async (userMessage, updatedMessages) => {
    try {
      // Send message + full conversation history for memory
      const chatUrl = `${BACKEND_URL}/api/chat`;
      console.log('Sending chat message to:', chatUrl);
      console.log('User email:', userEmail);
      
      const response = await fetch(chatUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,           // already passed via route.params
          message: userMessage,
          conversationHistory: updatedMessages, // sends full chat history so AI remembers context
        }),
        timeout: 15000, // 15 second timeout
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Chat response:', data);
      
      if (!data.success) {
        throw new Error(data.message || "Failed to get AI response");
      }
      
      return data.reply;
    } catch (error) {
      console.error('Chat API Error:', error.message);
      console.error('Error details:', error);
      
      // Provide more specific error messages
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Check your network and server status.');
      }
      
      throw error;
    }
  };

  // Update handleSendMessage to handle errors
  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    const newUserMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    // Create updated messages array with the new user message
    const updatedMessages = [...messages, newUserMessage];
    
    setMessages(updatedMessages);
    setInputText("");
    setIsLoading(true);

    try {
      if (!userEmail) {
        throw new Error("User email is missing. Please log in again.");
      }

      const botResponse = await getAIResponse(inputText, updatedMessages);
      const newBotMessage = {
        id: updatedMessages.length + 1,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      let errorText = error.message;
      
      // Fallback to generic message if too technical
      if (!errorText || errorText.includes('HTTP')) {
        errorText = "Sorry, I'm having trouble connecting to the server. Please check your network connection and try again.";
      }
      
      const errorMessage = {
        id: updatedMessages.length + 1,
        text: errorText || "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press - send on web, new line on mobile
  const handleInputKeyPress = (e) => {
    if (Platform.OS === 'web' && (e.nativeEvent?.key === 'Enter' || e.key === 'Enter') && !e.shiftKey) {
      handleSendMessage();
    }
  };

  // Function tp Load Chat History
  const loadChatHistory = async () => {
    if (!userEmail) {
      console.warn("Cannot load chat history: userEmail is missing");
      return;
    }

    try {
      const historyUrl = `${BACKEND_URL}/api/chat-history?email=${encodeURIComponent(userEmail)}`;
      console.log('Loading chat history from:', historyUrl);
      
      const response = await fetch(historyUrl);
      
      if (!response.ok) {
        console.warn(`Failed to load chat history: HTTP ${response.status}`);
        return;
      }

      const data = await response.json();

      if (data.success && data.messages && data.messages.length > 0) {
        console.log('Loaded', data.messages.length, 'messages from history');
        setMessages(data.messages); // replaces the default welcome message with real history
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
      // Don't throw - this is not critical, user can still chat
    }
  };

  // use effect for preserving and loading chat history
  useEffect(() => {
    if (userEmail) {
      loadChatHistory();
    }
  }, []); // runs once when screen opens

  // to clear chat history
  const clearChatHistory = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/chat-history`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      setMessages([{
        id: 1,
        text: "Hi! I'm WOMBLY's AI Assistant. Ask me anything about pregnancy, toddler care, nutrition, or parenting. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error("Failed to clear chat:", error);
    } finally {
      setShowClearModal(false);
    }
  };
// =============================== CHATBOT IMPLEMENTATION DONE ==================================

  return (
    <LinearGradient
      colors={['#E0F7FA', '#B2DFDB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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

      {/* Chat History Delete Button */}
      <TouchableOpacity style={styles.clearButton} onPress={() => setShowClearModal(true)}>
        <MaterialCommunityIcons name="delete-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
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
            onKeyPress={handleInputKeyPress}
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
    
    {/* Clear Chat Confirmation Modal */}
      <Modal
        transparent={true}
        visible={showClearModal}
        animationType="fade"
        onRequestClose={() => setShowClearModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <MaterialCommunityIcons name="delete-outline" size={40} color="#FF6B6B" />
            <Text style={styles.modalTitle}>Clear Chat History</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete all chat history? This cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonNo]}
                onPress={() => setShowClearModal(false)}
              >
                <Text style={styles.modalButtonNoText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonYes]}
                onPress={clearChatHistory}
              >
                <Text style={styles.modalButtonYesText}>Yes, Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  // Delete Chat History Button
  clearButton: {
  padding: 8,
  marginLeft: 8,
  },
  // Delete Chat History Confirmation Pop-up
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3436",
    marginTop: 12,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: "#636E72",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap", 
    justifyContent: "center",
  },
  modalButton: {
    flex: 1,
    minWidth: 100,  
    paddingVertical: 12,
    paddingHorizontal: 8, 
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonNo: {
    backgroundColor: "#F0F0F0",
  },
  modalButtonYes: {
    backgroundColor: "#FF6B6B",
  },
  modalButtonNoText: {
    color: "#2D3436",
    fontWeight: "600",
    fontSize: 15,
  },
  modalButtonYesText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
    flexShrink: 1,      
    flexWrap: "wrap",   
    textAlign: "center",
  }, // Pop-up end
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
