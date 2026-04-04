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
  Animated,
  Dimensions,
  FlatList,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_BASE_URL } from './apiConfig';

const BACKEND_URL = API_BASE_URL;
const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.78, 320);

// App-consistent palette
const PINK = '#FF6B9D';
const PURPLE = '#6C5CE7';
const DEEP_ROSE = '#961e46';
const HEADER_GRAD = ['#f0cfe3', '#de81fa'];
const BG_GRAD = ['#F5EEFF', '#E8D5FF'];
const SEND_GRAD = ['#de81fa', '#b054d4'];
const USER_BUBBLE_GRAD = ['#FF6B9D', '#e8558a'];

// Simple markdown renderer for bold (**text**) and italic (*text*)
const renderFormattedText = (text, baseStyle) => {
  // Split on **bold** and *italic* patterns
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), style: null });
    }
    if (match[2]) {
      // **bold**
      parts.push({ text: match[2], style: { fontWeight: '700' } });
    } else if (match[3]) {
      // *italic*
      parts.push({ text: match[3], style: { fontStyle: 'italic' } });
    }
    lastIndex = match.index + match[0].length;
  }
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), style: null });
  }

  if (parts.length === 0) return <Text style={baseStyle}>{text}</Text>;

  return (
    <Text style={baseStyle}>
      {parts.map((part, i) =>
        part.style ? <Text key={i} style={part.style}>{part.text}</Text> : part.text
      )}
    </Text>
  );
};

const MODE_LABELS = { pregnancy: 'Pregnancy', toddler: 'Toddler', both: 'Both' };
const MODE_ICONS = { pregnancy: 'baby-carriage', toddler: 'human-child', both: 'account-heart' };
const MODE_COLORS = { pregnancy: PINK, toddler: PURPLE, both: '#E17055' };

const WELCOME_MSG = (name, mode) => ({
  id: 'welcome',
  text: mode
    ? `Hi ${name || 'there'}! This is your ${MODE_LABELS[mode] || ''} chat. How can I help you today?`
    : "Hi! I'm WOMBLY's AI Assistant. Tap the menu icon to start a new conversation.",
  sender: 'bot',
  timestamp: new Date(),
});

const AIChatScreen = ({ navigation, route }) => {
  const userEmail = route.params?.userEmail;
  const userName = route.params?.userName || 'User';

  const [activeConvId, setActiveConvId] = useState(route.params?.conversationId || null);
  const [activeMode, setActiveMode] = useState(route.params?.conversationMode || null);
  const [activeTitle, setActiveTitle] = useState(route.params?.conversationTitle || 'WOMBLY AI');

  const isMultiConversation = !!activeConvId;

  const [messages, setMessages] = useState([WELCOME_MSG(userName, activeMode)]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();

  const drawerAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(false);

  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [intakeWeek, setIntakeWeek] = useState('');
  const [intakeToddlerAge, setIntakeToddlerAge] = useState('');
  const [creating, setCreating] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [renameText, setRenameText] = useState('');

  const [menuOpenId, setMenuOpenId] = useState(null);
  const [kavKey, setKavKey] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKavKey(k => k + 1);
    });
    return () => hideSub.remove();
  }, []);

  // ===================== HELPERS =====================
  const showError = (msg) => {
    setErrorMessage(msg);
    setShowErrorModal(true);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const diffMins = Math.floor((Date.now() - d) / 60000);
    if (diffMins < 1) return 'Now';
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d`;
    return d.toLocaleDateString();
  };

  // ===================== DRAWER =====================
  const toggleDrawer = () => {
    if (drawerOpen) {
      Animated.timing(drawerAnim, { toValue: -DRAWER_WIDTH, duration: 250, useNativeDriver: true }).start();
    } else {
      fetchConversations();
      Animated.timing(drawerAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    }
    setDrawerOpen(!drawerOpen);
  };

  const closeDrawer = () => {
    if (!drawerOpen) return;
    Animated.timing(drawerAnim, { toValue: -DRAWER_WIDTH, duration: 250, useNativeDriver: true }).start();
    setDrawerOpen(false);
  };

  const fetchConversations = async () => {
    if (!userEmail) return;
    setLoadingConvs(true);
    try {
      const url = `${BACKEND_URL}/api/conversations?email=${encodeURIComponent(userEmail)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setConversations(data.conversations || []);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoadingConvs(false);
    }
  };

  const switchConversation = (conv) => {
    closeDrawer();
    setActiveConvId(conv._id);
    setActiveMode(conv.mode);
    setActiveTitle(conv.title);
    setMessages([WELCOME_MSG(userName, conv.mode)]);
  };

  useEffect(() => {
    if (userEmail) loadChatHistory();
  }, [activeConvId]);

  // ===================== INTAKE (NEW CHAT) =====================
  const handleNewChat = () => {
    closeDrawer();
    setSelectedMode(null);
    setIntakeWeek('');
    setIntakeToddlerAge('');
    setShowIntakeModal(true);
  };

  const handleCreateConversation = async () => {
    if (!selectedMode) return;
    setCreating(true);
    try {
      const body = { email: userEmail, mode: selectedMode };
      if ((selectedMode === 'pregnancy' || selectedMode === 'both') && intakeWeek) {
        body.pregnancyWeek = parseInt(intakeWeek, 10);
      }
      if ((selectedMode === 'toddler' || selectedMode === 'both') && intakeToddlerAge) {
        body.toddlerAgeMonths = parseInt(intakeToddlerAge, 10);
      }

      const res = await fetch(`${BACKEND_URL}/api/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success && data.conversation) {
        setShowIntakeModal(false);
        setActiveConvId(data.conversation._id);
        setActiveMode(data.conversation.mode);
        setActiveTitle(data.conversation.title);
        setMessages([WELCOME_MSG(userName, data.conversation.mode)]);
      } else {
        showError(data.message || 'Failed to create conversation');
      }
    } catch (err) {
      showError('Cannot connect to server. Please check your network.');
    } finally {
      setCreating(false);
    }
  };

  // ===================== MESSAGING =====================
  useEffect(() => {
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  // Scroll to bottom when keyboard opens (especially needed on Android)
  useEffect(() => {
    const sub = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 150);
    });
    return () => sub.remove();
  }, []);

  const sendMessageMultiConv = async (userMessage) => {
    const url = `${BACKEND_URL}/api/conversations/${activeConvId}/messages`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, message: userMessage }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to get AI response');
    return data.reply;
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;
    if (!isMultiConversation) {
      handleNewChat();
      return;
    }

    const newUserMessage = { id: `user-${Date.now()}`, text: inputText, sender: 'user', timestamp: new Date() };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    const messageText = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      if (!userEmail) throw new Error('User email is missing. Please log in again.');
      const botResponse = await sendMessageMultiConv(messageText);
      setMessages((prev) => [...prev, { id: `bot-${Date.now()}`, text: botResponse, sender: 'bot', timestamp: new Date() }]);
    } catch (error) {
      let errorText = error.message;
      if (!errorText || errorText.includes('HTTP')) {
        errorText = "Sorry, I'm having trouble connecting. Please try again.";
      }
      setMessages((prev) => [...prev, { id: `err-${Date.now()}`, text: errorText, sender: 'bot', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputKeyPress = (e) => {
    if (Platform.OS === 'web' && (e.nativeEvent?.key === 'Enter' || e.key === 'Enter') && !e.shiftKey) {
      handleSendMessage();
    }
  };

  // ===================== LOAD HISTORY =====================
  const loadChatHistory = async () => {
    if (!userEmail || !activeConvId) return;
    try {
      const url = `${BACKEND_URL}/api/conversations/${activeConvId}/messages?email=${encodeURIComponent(userEmail)}`;
      const response = await fetch(url);
      if (!response.ok) return;
      const data = await response.json();
      if (data.success && data.messages && data.messages.length > 0) {
        setMessages(data.messages.map((m, i) => ({
          id: m._id || `msg-${i}`,
          text: m.content,
          sender: m.role === 'user' ? 'user' : 'bot',
          timestamp: m.createdAt,
        })));
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  // ===================== DELETE =====================
  const openDeleteModal = (conv) => {
    setDeleteTarget(conv || null);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const convId = deleteTarget ? deleteTarget._id : activeConvId;
    if (!convId) return;
    try {
      await fetch(`${BACKEND_URL}/api/conversations/${convId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });
      setShowDeleteModal(false);
      if (deleteTarget) {
        setConversations((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      }
      if (convId === activeConvId) {
        setActiveConvId(null);
        setActiveMode(null);
        setActiveTitle('WOMBLY AI');
        setMessages([WELCOME_MSG(userName, null)]);
      }
      setDeleteTarget(null);
    } catch (error) {
      console.error('Failed to delete:', error);
      showError('Failed to delete conversation. Please try again.');
    }
  };

  // ===================== RENAME =====================
  const openRenameModal = (conv) => {
    const target = conv || (activeConvId ? { _id: activeConvId, title: activeTitle } : null);
    if (!target) return;
    setRenameTarget(target);
    setRenameText(target.title || '');
    setShowRenameModal(true);
  };

  const handleConfirmRename = async () => {
    if (!renameTarget || !renameText.trim()) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/conversations/${renameTarget._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, title: renameText.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        if (renameTarget._id === activeConvId) {
          setActiveTitle(renameText.trim());
        }
        setConversations((prev) =>
          prev.map((c) => c._id === renameTarget._id ? { ...c, title: renameText.trim() } : c)
        );
      } else {
        showError(data.message || 'Failed to rename conversation');
      }
    } catch (err) {
      showError('Failed to rename. Please check your connection.');
    } finally {
      setShowRenameModal(false);
      setRenameTarget(null);
    }
  };

  // ===================== RENDER =====================
  return (
    <View style={styles.root}>
      {/* ===== SIDE DRAWER ===== */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerAnim }] }]}>
        {/* Drawer header with gradient strip */}
        <LinearGradient colors={HEADER_GRAD} style={styles.drawerHeaderGradient}>
          <Text style={styles.drawerHeaderTitle}>Conversations</Text>
          <TouchableOpacity onPress={closeDrawer} style={styles.drawerCloseBtn}>
            <MaterialCommunityIcons name="close" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>

        {/* New Chat button */}
        <TouchableOpacity style={styles.newChatBtn} onPress={handleNewChat} activeOpacity={0.7}>
          <LinearGradient colors={SEND_GRAD} style={styles.newChatGradient}>
            <MaterialCommunityIcons name="plus" size={20} color="#FFF" />
            <Text style={styles.newChatText}>New Chat</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Conversation list */}
        {loadingConvs ? (
          <ActivityIndicator size="small" color={PURPLE} style={{ marginTop: 20 }} />
        ) : conversations.length === 0 ? (
          <View style={styles.drawerEmpty}>
            <MaterialCommunityIcons name="chat-plus-outline" size={36} color="#D4B3FF" />
            <Text style={styles.drawerEmptyText}>No conversations yet</Text>
          </View>
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity
                  style={[styles.drawerItem, item._id === activeConvId && styles.drawerItemActive]}
                  onPress={() => { setMenuOpenId(null); switchConversation(item); }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.drawerItemDot, { backgroundColor: MODE_COLORS[item.mode] || PURPLE }]} />
                  <View style={styles.drawerItemContent}>
                    <Text style={[styles.drawerItemTitle, item._id === activeConvId && styles.drawerItemTitleActive]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.drawerItemMeta}>
                      {MODE_LABELS[item.mode] || item.mode} · {formatDate(item.lastMessageAt)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.threeDotBtn}
                    onPress={() => setMenuOpenId(menuOpenId === item._id ? null : item._id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <MaterialCommunityIcons name="dots-vertical" size={22} color={menuOpenId === item._id ? PURPLE : '#B0A3C8'} />
                  </TouchableOpacity>
                </TouchableOpacity>

                {menuOpenId === item._id && (
                  <View style={styles.popupMenu}>
                    <TouchableOpacity
                      style={styles.popupMenuItem}
                      onPress={() => { setMenuOpenId(null); openRenameModal(item); }}
                    >
                      <MaterialCommunityIcons name="pencil-outline" size={18} color={PURPLE} />
                      <Text style={styles.popupMenuText}>Rename</Text>
                    </TouchableOpacity>
                    <View style={styles.popupMenuDivider} />
                    <TouchableOpacity
                      style={styles.popupMenuItem}
                      onPress={() => { setMenuOpenId(null); openDeleteModal(item); }}
                    >
                      <MaterialCommunityIcons name="trash-can-outline" size={18} color={PINK} />
                      <Text style={[styles.popupMenuText, { color: PINK }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          />
        )}
      </Animated.View>

      {/* Overlay */}
      {drawerOpen && (
        <TouchableOpacity style={styles.drawerOverlay} activeOpacity={1} onPress={closeDrawer} />
      )}

      {/* ===== MAIN CHAT AREA ===== */}
      <LinearGradient colors={BG_GRAD} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.container}>
        {/* Header */}
        <LinearGradient colors={HEADER_GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={toggleDrawer}>
            <MaterialCommunityIcons name="menu" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.botAvatarHeader}>
              <MaterialCommunityIcons name="chat-processing" size={22} color={PINK} />
            </View>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { if (isMultiConversation) openRenameModal(null); }} activeOpacity={isMultiConversation ? 0.6 : 1}>
              <Text style={styles.headerTitle} numberOfLines={1}>{activeTitle}</Text>
              <Text style={styles.headerSubtitle}>
                {isMultiConversation && activeMode ? `${MODE_LABELS[activeMode]} mode` : 'Tap menu to start a chat'}
              </Text>
            </TouchableOpacity>
          </View>

          {isMultiConversation && activeMode && (
            <View style={[styles.headerModeBadge, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
              <Text style={styles.headerModeBadgeText}>{MODE_LABELS[activeMode]}</Text>
            </View>
          )}

          {isMultiConversation && (
            <TouchableOpacity style={styles.clearButton} onPress={() => openDeleteModal(null)}>
              <MaterialCommunityIcons name="delete-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </LinearGradient>

        {/* Chat body */}
        <KeyboardAvoidingView
          key={Platform.OS === 'android' ? kavKey : undefined}
          behavior="padding"
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
                style={[styles.messageWrapper, message.sender === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper]}
              >
                {message.sender === 'bot' && (
                  <View style={styles.botAvatar}>
                    <MaterialCommunityIcons name="chat-processing" size={14} color="#FFFFFF" />
                  </View>
                )}
                {message.sender === 'user' ? (
                  <LinearGradient colors={USER_BUBBLE_GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.messageBubble, styles.userMessage]}>
                    <Text style={[styles.messageText, styles.userMessageText]}>{message.text}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.messageBubble, styles.botMessage]}>
                    {renderFormattedText(message.text, [styles.messageText, styles.botMessageText])}
                  </View>
                )}
              </View>
            ))}
            {isLoading && (
              <View style={[styles.messageWrapper, styles.botMessageWrapper]}>
                <View style={styles.botAvatar}>
                  <MaterialCommunityIcons name="chat-processing" size={14} color="#FFFFFF" />
                </View>
                <View style={[styles.messageBubble, styles.botMessage, styles.typingBubble]}>
                  <View style={styles.typingDots}>
                    <View style={[styles.dot, { backgroundColor: PURPLE }]} />
                    <View style={[styles.dot, { backgroundColor: PINK, marginHorizontal: 4 }]} />
                    <View style={[styles.dot, { backgroundColor: PURPLE }]} />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={isMultiConversation ? 'Type your message...' : 'Tap menu to start a new chat...'}
              placeholderTextColor="#B0A3C8"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxHeight={100}
              editable={!isLoading}
              onKeyPress={handleInputKeyPress}
            />
            <TouchableOpacity
              style={[styles.sendButton, (isLoading || inputText.trim() === '') && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={isLoading || inputText.trim() === ''}
            >
              <LinearGradient colors={SEND_GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.sendButtonGradient}>
                <MaterialCommunityIcons name="send" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* ===== DELETE MODAL ===== */}
        <Modal transparent visible={showDeleteModal} animationType="fade" onRequestClose={() => setShowDeleteModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <MaterialCommunityIcons name="delete-outline" size={40} color={PINK} />
              <Text style={styles.modalTitle}>Delete Conversation</Text>
              <Text style={styles.modalMessage}>
                {deleteTarget
                  ? `Are you sure you want to delete "${deleteTarget.title}"? This cannot be undone.`
                  : 'Are you sure you want to delete this conversation and all its messages? This cannot be undone.'}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonNo]}
                  onPress={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
                >
                  <Text style={styles.modalButtonNoText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.modalButtonYes]} onPress={handleConfirmDelete}>
                  <Text style={styles.modalButtonYesText}>Yes, Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ===== ERROR MODAL ===== */}
        <Modal transparent visible={showErrorModal} animationType="fade" onRequestClose={() => setShowErrorModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <MaterialCommunityIcons name="alert-circle-outline" size={40} color={PINK} />
              <Text style={styles.modalTitle}>Something went wrong</Text>
              <Text style={styles.modalMessage}>{errorMessage}</Text>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonYes, { paddingHorizontal: 40 }]}
                onPress={() => setShowErrorModal(false)}
              >
                <Text style={styles.modalButtonYesText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ===== RENAME MODAL ===== */}
        <Modal transparent visible={showRenameModal} animationType="fade" onRequestClose={() => setShowRenameModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <MaterialCommunityIcons name="pencil-outline" size={40} color={PURPLE} />
              <Text style={styles.modalTitle}>Rename Conversation</Text>
              <TextInput
                style={styles.renameInput}
                value={renameText}
                onChangeText={setRenameText}
                placeholder="Enter new name"
                placeholderTextColor="#B0A3C8"
                autoFocus
                maxLength={80}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonNo]}
                  onPress={() => { setShowRenameModal(false); setRenameTarget(null); }}
                >
                  <Text style={styles.modalButtonNoText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonYes, !renameText.trim() && { opacity: 0.5 }]}
                  onPress={handleConfirmRename}
                  disabled={!renameText.trim()}
                >
                  <Text style={styles.modalButtonYesText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ===== INTAKE MODAL ===== */}
        <Modal visible={showIntakeModal} transparent animationType="slide" onRequestClose={() => setShowIntakeModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.intakeModal}>
              <Text style={styles.intakeTitle}>New Conversation</Text>
              <Text style={styles.intakeSubtitle}>What would you like help with?</Text>

              <View style={styles.modeOptions}>
                {['pregnancy', 'toddler', 'both'].map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    style={[
                      styles.modeOption,
                      selectedMode === mode && { borderColor: MODE_COLORS[mode], backgroundColor: MODE_COLORS[mode] + '15' },
                    ]}
                    onPress={() => setSelectedMode(mode)}
                  >
                    <MaterialCommunityIcons
                      name={MODE_ICONS[mode]}
                      size={32}
                      color={selectedMode === mode ? MODE_COLORS[mode] : '#C0B3D9'}
                    />
                    <Text style={[styles.modeOptionText, selectedMode === mode && { color: MODE_COLORS[mode], fontWeight: '700' }]}>
                      {MODE_LABELS[mode]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {(selectedMode === 'pregnancy' || selectedMode === 'both') && (
                <View style={styles.enricherRow}>
                  <MaterialCommunityIcons name="calendar-week" size={18} color={PURPLE} />
                  <TextInput
                    style={styles.enricherInput}
                    placeholder="Pregnancy week (optional, 1-42)"
                    placeholderTextColor="#B0A3C8"
                    keyboardType="numeric"
                    value={intakeWeek}
                    onChangeText={(t) => setIntakeWeek(t.replace(/[^0-9]/g, ''))}
                    maxLength={2}
                  />
                </View>
              )}
              {(selectedMode === 'toddler' || selectedMode === 'both') && (
                <View style={styles.enricherRow}>
                  <MaterialCommunityIcons name="human-child" size={18} color={PURPLE} />
                  <TextInput
                    style={styles.enricherInput}
                    placeholder="Toddler age in months (optional)"
                    placeholderTextColor="#B0A3C8"
                    keyboardType="numeric"
                    value={intakeToddlerAge}
                    onChangeText={(t) => setIntakeToddlerAge(t.replace(/[^0-9]/g, ''))}
                    maxLength={2}
                  />
                </View>
              )}

              <View style={styles.intakeActions}>
                <TouchableOpacity style={styles.intakeCancelBtn} onPress={() => setShowIntakeModal(false)}>
                  <Text style={styles.intakeCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.intakeStartBtn, !selectedMode && styles.intakeStartBtnDisabled]}
                  disabled={!selectedMode || creating}
                  onPress={handleCreateConversation}
                >
                  {creating ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.intakeStartText}>Start Chat</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },

  // ===== DRAWER =====
  drawer: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#FDFBFF',
    zIndex: 200,
    elevation: 20,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(45,0,80,0.35)',
    zIndex: 150,
  },
  drawerHeaderGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 16,
  },
  drawerHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  drawerCloseBtn: { padding: 4 },
  newChatBtn: { marginHorizontal: 16, marginTop: 16, marginBottom: 12 },
  newChatGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },
  newChatText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  drawerEmpty: { alignItems: 'center', marginTop: 40 },
  drawerEmptyText: { color: '#B0A3C8', fontSize: 13, marginTop: 8 },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F0FF',
  },
  drawerItemActive: { backgroundColor: '#F0E8FF' },
  drawerItemDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  drawerItemContent: { flex: 1 },
  drawerItemTitle: { fontSize: 14, fontWeight: '500', color: '#2D3436' },
  drawerItemTitleActive: { fontWeight: '700', color: PURPLE },
  drawerItemMeta: { fontSize: 11, color: '#B0A3C8', marginTop: 2 },
  threeDotBtn: { padding: 4 },
  popupMenu: {
    marginHorizontal: 16, marginBottom: 6,
    backgroundColor: '#FFFFFF', borderRadius: 12,
    shadowColor: '#6C5CE7', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6,
    overflow: 'hidden',
  },
  popupMenuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 12, paddingHorizontal: 16,
  },
  popupMenuText: { fontSize: 14, fontWeight: '600', color: '#2D3436' },
  popupMenuDivider: { height: 1, backgroundColor: '#F5F0FF' },

  // ===== MAIN =====
  container: { flex: 1 },
  header: {
    paddingTop: 50, paddingBottom: 16, paddingHorizontal: 10,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#6C5CE7', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6,
  },
  menuButton: { padding: 8, marginRight: 4 },
  backButton: { padding: 8, marginRight: 6 },
  clearButton: { padding: 8, marginLeft: 4 },
  headerContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  botAvatarHeader: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 11, color: 'rgba(255, 255, 255, 0.85)', marginTop: 1 },
  headerModeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, marginRight: 4 },
  headerModeBadgeText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },

  // ===== MODALS =====
  modalOverlay: { flex: 1, backgroundColor: 'rgba(45,0,80,0.45)', justifyContent: 'center', alignItems: 'center' },
  modalBox: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 30, width: '80%', alignItems: 'center',
    shadowColor: '#6C5CE7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3436', marginTop: 12, marginBottom: 8 },
  modalMessage: { fontSize: 14, color: '#636E72', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  modalButtons: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
  modalButton: { flex: 1, minWidth: 100, paddingVertical: 12, paddingHorizontal: 8, borderRadius: 12, alignItems: 'center' },
  modalButtonNo: { backgroundColor: '#F5F0FF' },
  modalButtonYes: { backgroundColor: PINK },
  modalButtonNoText: { color: '#2D3436', fontWeight: '600', fontSize: 15 },
  modalButtonYesText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15, textAlign: 'center' },
  renameInput: {
    width: '100%', backgroundColor: '#F5F0FF', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: '#2D3436',
    borderWidth: 1.5, borderColor: '#EDE7F6', marginBottom: 20,
  },

  // ===== INTAKE MODAL =====
  intakeModal: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, width: '88%', maxWidth: 400 },
  intakeTitle: { fontSize: 20, fontWeight: 'bold', color: DEEP_ROSE, textAlign: 'center' },
  intakeSubtitle: { fontSize: 14, color: '#636E72', textAlign: 'center', marginTop: 6, marginBottom: 20 },
  modeOptions: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  modeOption: {
    flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 14,
    borderWidth: 2, borderColor: '#EDE7F6', backgroundColor: '#FDFBFF',
  },
  modeOptionText: { fontSize: 12, color: '#8A7BA8', marginTop: 8, fontWeight: '500' },
  enricherRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: 16,
    backgroundColor: '#F5F0FF', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4,
  },
  enricherInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#2D3436', paddingVertical: 10 },
  intakeActions: { flexDirection: 'row', marginTop: 24, gap: 12 },
  intakeCancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#F5F0FF', alignItems: 'center' },
  intakeCancelText: { color: '#636E72', fontWeight: '600', fontSize: 15 },
  intakeStartBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: PINK, alignItems: 'center' },
  intakeStartBtnDisabled: { backgroundColor: '#D4B3FF' },
  intakeStartText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },

  // ===== CHAT MESSAGES =====
  keyboardAvoidingView: { flex: 1 },
  messagesContainer: { flex: 1 },
  messagesContent: { paddingHorizontal: 15, paddingVertical: 15 },
  messageWrapper: { marginBottom: 15, flexDirection: 'row', alignItems: 'flex-end' },
  userMessageWrapper: { justifyContent: 'flex-end' },
  botMessageWrapper: { justifyContent: 'flex-start' },
  botAvatar: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: PURPLE,
    justifyContent: 'center', alignItems: 'center', marginRight: 10, marginBottom: 5,
  },
  messageBubble: { maxWidth: '80%', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 18 },
  userMessage: { borderBottomRightRadius: 4 },
  botMessage: {
    backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4,
    shadowColor: '#6C5CE7', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  messageText: { fontSize: 14, lineHeight: 21 },
  userMessageText: { color: '#FFFFFF', fontWeight: '500' },
  botMessageText: { color: '#2D3436' },
  typingBubble: { paddingVertical: 16, paddingHorizontal: 20 },
  typingDots: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, opacity: 0.6 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.95)', borderTopWidth: 1, borderTopColor: '#EDE7F6', gap: 10,
  },
  input: {
    flex: 1, backgroundColor: '#F5F0FF', borderRadius: 24,
    paddingHorizontal: 18, paddingVertical: 11, fontSize: 14, color: '#2D3436', maxHeight: 100,
    borderWidth: 1, borderColor: '#EDE7F6',
  },
  sendButton: { marginBottom: 2 },
  sendButtonGradient: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  sendButtonDisabled: { opacity: 0.5 },
});

export default AIChatScreen;
