/**
 * Customer Support Screen - 24/7 support ticket management
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Searchbar,
  useTheme,
  Surface,
  Chip,
  IconButton,
  FAB,
  TextInput,
  SegmentedButtons,
  Avatar,
  Badge
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useAdminStore, { SupportTicket } from '../stores/adminStore';

const CustomerSupportScreen: React.FC = () => {
  const theme = useTheme();
  const {
    supportTickets,
    updateSupportTicket,
    addSupportMessage,
    isLoading
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState('open');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const getFilteredTickets = () => {
    let filtered = supportTickets;
    
    // Filter by status
    if (activeTab !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === activeTab);
    }
    
    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const filteredTickets = getFilteredTickets();

  const handleUpdateTicketStatus = (ticketId: string, status: string) => {
    updateSupportTicket(ticketId, { status });
    Alert.alert('Success', `Ticket ${status}`);
  };

  const handleUpdateTicketPriority = (ticketId: string, priority: string) => {
    updateSupportTicket(ticketId, { priority });
    Alert.alert('Success', `Priority updated to ${priority}`);
  };

  const handleSendMessage = () => {
    if (!selectedTicket || !newMessage.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    addSupportMessage(selectedTicket.id, {
      content: newMessage,
      sender: 'admin',
      timestamp: new Date().toISOString()
    });

    setNewMessage('');
    Alert.alert('Success', 'Message sent to user');
  };

  const openTicketDetails = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ff1744';
      case 'high': return '#ff5722';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return theme.colors.primary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#2196f3';
      case 'in_progress': return '#ff9800';
      case 'resolved': return '#4caf50';
      case 'closed': return '#9e9e9e';
      default: return theme.colors.primary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return 'email-open';
      case 'in_progress': return 'clock';
      case 'resolved': return 'check-circle';
      case 'closed': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderTicketCard = ({ item }: { item: SupportTicket }) => (
    <TouchableOpacity onPress={() => openTicketDetails(item)}>
      <Card style={styles.ticketCard}>
        <Card.Content>
          <View style={styles.ticketHeader}>
            <View style={styles.ticketInfo}>
              <Text style={styles.ticketSubject} numberOfLines={1}>
                {item.subject}
              </Text>
              <Text style={styles.ticketId}>#{item.id.substring(0, 8)}</Text>
            </View>
            
            <View style={styles.ticketBadges}>
              <Chip
                mode="outlined"
                style={[styles.priorityChip, { borderColor: getPriorityColor(item.priority) }]}
                textStyle={[styles.chipText, { color: getPriorityColor(item.priority) }]}
                compact
              >
                {item.priority.toUpperCase()}
              </Chip>
              <Chip
                mode="outlined"
                style={[styles.statusChip, { borderColor: getStatusColor(item.status) }]}
                textStyle={[styles.chipText, { color: getStatusColor(item.status) }]}
                icon={getStatusIcon(item.status) as any}
                compact
              >
                {item.status.replace('_', ' ').toUpperCase()}
              </Chip>
            </View>
          </View>

          <Text style={styles.ticketDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.ticketMeta}>
            <View style={styles.userInfo}>
              <Avatar.Text 
                size={24} 
                label={item.userName.split(' ').map(n => n[0]).join('')}
                style={styles.userAvatar}
              />
              <View>
                <Text style={styles.userName}>{item.userName}</Text>
                <Text style={styles.userEmail}>{item.userEmail}</Text>
              </View>
            </View>
            
            <View style={styles.ticketTime}>
              <Text style={styles.timeText}>{formatTimeAgo(item.createdAt)}</Text>
              {item.messages.length > 1 && (
                <View style={styles.messageCount}>
                  <MaterialCommunityIcons name="message" size={12} color={theme.colors.primary} />
                  <Text style={styles.messageCountText}>{item.messages.length}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.quickActions}>
            <Button
              mode="outlined"
              onPress={() => handleUpdateTicketStatus(item.id, 'in_progress')}
              style={styles.quickButton}
              icon="clock"
              compact
              disabled={item.status === 'in_progress'}
            >
              In Progress
            </Button>
            <Button
              mode="contained"
              onPress={() => handleUpdateTicketStatus(item.id, 'resolved')}
              style={styles.quickButton}
              icon="check"
              compact
              disabled={item.status === 'resolved' || item.status === 'closed'}
            >
              Resolve
            </Button>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderTicketModal = () => {
    if (!selectedTicket) return null;

    return (
      <Modal
        visible={showTicketModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowTicketModal(false);
          setSelectedTicket(null);
        }}
      >
        <View style={styles.modalContainer}>
          <Surface style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{selectedTicket.subject}</Text>
              <Text style={styles.modalSubtitle}>#{selectedTicket.id.substring(0, 8)}</Text>
            </View>
            <IconButton
              icon="close"
              onPress={() => {
                setShowTicketModal(false);
                setSelectedTicket(null);
              }}
            />
          </Surface>

          <ScrollView style={styles.modalContent}>
            {/* Ticket Info */}
            <Card style={styles.ticketInfoCard}>
              <Card.Content>
                <View style={styles.ticketInfoHeader}>
                  <Avatar.Text 
                    size={40} 
                    label={selectedTicket.userName.split(' ').map(n => n[0]).join('')}
                  />
                  <View style={styles.ticketInfoDetails}>
                    <Text style={styles.ticketInfoName}>{selectedTicket.userName}</Text>
                    <Text style={styles.ticketInfoEmail}>{selectedTicket.userEmail}</Text>
                    <Text style={styles.ticketInfoTime}>
                      Created {formatTimeAgo(selectedTicket.createdAt)}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.ticketInfoDescription}>
                  {selectedTicket.description}
                </Text>

                <View style={styles.ticketInfoActions}>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      Alert.alert('Change Priority', 'Select new priority', [
                        { text: 'Low', onPress: () => handleUpdateTicketPriority(selectedTicket.id, 'low') },
                        { text: 'Medium', onPress: () => handleUpdateTicketPriority(selectedTicket.id, 'medium') },
                        { text: 'High', onPress: () => handleUpdateTicketPriority(selectedTicket.id, 'high') },
                        { text: 'Critical', onPress: () => handleUpdateTicketPriority(selectedTicket.id, 'critical') }
                      ]);
                    }}
                    icon="flag"
                    compact
                  >
                    Priority: {selectedTicket.priority}
                  </Button>
                  
                  <Button
                    mode="outlined"
                    onPress={() => {
                      Alert.alert('Change Status', 'Select new status', [
                        { text: 'Open', onPress: () => handleUpdateTicketStatus(selectedTicket.id, 'open') },
                        { text: 'In Progress', onPress: () => handleUpdateTicketStatus(selectedTicket.id, 'in_progress') },
                        { text: 'Resolved', onPress: () => handleUpdateTicketStatus(selectedTicket.id, 'resolved') },
                        { text: 'Closed', onPress: () => handleUpdateTicketStatus(selectedTicket.id, 'closed') }
                      ]);
                    }}
                    icon="cog"
                    compact
                  >
                    Status: {selectedTicket.status.replace('_', ' ')}
                  </Button>
                </View>
              </Card.Content>
            </Card>

            {/* Messages */}
            <Text style={styles.messagesTitle}>Conversation</Text>
            {selectedTicket.messages.map((message, index) => (
              <Card key={index} style={[
                styles.messageCard,
                message.sender === 'admin' ? styles.adminMessage : styles.userMessage
              ]}>
                <Card.Content>
                  <View style={styles.messageHeader}>
                    <Text style={styles.messageSender}>
                      {message.sender === 'admin' ? 'Support Team' : selectedTicket.userName}
                    </Text>
                    <Text style={styles.messageTime}>
                      {formatTimeAgo(message.timestamp)}
                    </Text>
                  </View>
                  <Text style={styles.messageContent}>{message.content}</Text>
                </Card.Content>
              </Card>
            ))}

            {/* Reply Input */}
            <Card style={styles.replyCard}>
              <Card.Content>
                <Text style={styles.replyTitle}>Send Reply</Text>
                <TextInput
                  label="Your message"
                  value={newMessage}
                  onChangeText={setNewMessage}
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  style={styles.replyInput}
                  placeholder="Type your response..."
                />
                <Button
                  mode="contained"
                  onPress={handleSendMessage}
                  style={styles.sendButton}
                  icon="send"
                  disabled={!newMessage.trim()}
                >
                  Send Message
                </Button>
              </Card.Content>
            </Card>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Surface style={styles.header}>
        <Text style={styles.headerTitle}>Customer Support</Text>
        <Text style={styles.headerSubtitle}>
          {filteredTickets.length} tickets • 24/7 Support
        </Text>
      </Surface>

      {/* Tab Navigation */}
      <SegmentedButtons
        value={activeTab}
        onValueChange={setActiveTab}
        buttons={[
          {
            value: 'open',
            label: `Open (${supportTickets.filter(t => t.status === 'open').length})`,
            icon: 'email-open'
          },
          {
            value: 'in_progress',
            label: `In Progress (${supportTickets.filter(t => t.status === 'in_progress').length})`,
            icon: 'clock'
          },
          {
            value: 'resolved',
            label: `Resolved (${supportTickets.filter(t => t.status === 'resolved').length})`,
            icon: 'check-circle'
          }
        ]}
        style={styles.tabButtons}
      />

      {/* Search */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search tickets..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Tickets List */}
      <FlatList
        data={filteredTickets}
        renderItem={renderTicketCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="ticket" size={64} color={theme.colors.outline} />
            <Text style={styles.emptyTitle}>No support tickets</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'open' ? 'No open tickets at the moment' : `No ${activeTab.replace('_', ' ')} tickets`}
            </Text>
          </View>
        }
      />

      {/* Ticket Details Modal */}
      {renderTicketModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  tabButtons: {
    margin: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  searchBar: {
    elevation: 2,
  },
  listContainer: {
    padding: 16,
  },
  ticketCard: {
    marginBottom: 12,
    elevation: 2,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketSubject: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ticketId: {
    fontSize: 12,
    opacity: 0.6,
    fontFamily: 'monospace',
  },
  ticketBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  priorityChip: {
    height: 24,
  },
  statusChip: {
    height: 24,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '600',
  },
  ticketDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 18,
    marginBottom: 12,
  },
  ticketMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    marginRight: 8,
  },
  userName: {
    fontSize: 12,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 10,
    opacity: 0.6,
  },
  ticketTime: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 12,
    opacity: 0.6,
  },
  messageCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  messageCountText: {
    fontSize: 10,
    marginLeft: 2,
    color: '#1976d2',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickButton: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    elevation: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    fontSize: 12,
    opacity: 0.6,
    fontFamily: 'monospace',
  },
  modalContent: {
    padding: 16,
  },
  ticketInfoCard: {
    marginBottom: 16,
  },
  ticketInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketInfoDetails: {
    marginLeft: 12,
    flex: 1,
  },
  ticketInfoName: {
    fontSize: 16,
    fontWeight: '600',
  },
  ticketInfoEmail: {
    fontSize: 14,
    opacity: 0.7,
  },
  ticketInfoTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  ticketInfoDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  ticketInfoActions: {
    flexDirection: 'row',
    gap: 8,
  },
  messagesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  messageCard: {
    marginBottom: 8,
  },
  adminMessage: {
    marginLeft: 20,
    backgroundColor: '#e3f2fd',
  },
  userMessage: {
    marginRight: 20,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: '600',
  },
  messageTime: {
    fontSize: 10,
    opacity: 0.6,
  },
  messageContent: {
    fontSize: 14,
    lineHeight: 18,
  },
  replyCard: {
    marginTop: 16,
    marginBottom: 32,
  },
  replyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  replyInput: {
    marginBottom: 12,
  },
  sendButton: {
    borderRadius: 8,
  },
});

export default CustomerSupportScreen;
