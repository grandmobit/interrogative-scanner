/**
 * Learning Screen - Comprehensive cybersecurity learning platform
 * Features: YouTube videos, documents, search, filters, bookmarks, modern UI
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  Linking,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Image
} from 'react-native';
import { Text, Card, Chip, Button, Searchbar, useTheme, Surface, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import useLearningStore, { Video, Document } from '../stores/learningStore';

const { width: screenWidth } = Dimensions.get('window');

const LearningScreen: React.FC = () => {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({});
  
  const {
    videos,
    documents,
    bookmarkedVideos,
    bookmarkedDocuments,
    searchQuery,
    selectedFilter,
    activeTab,
    isLoading,
    error,
    setSearchQuery,
    setSelectedFilter,
    setActiveTab,
    toggleVideoBookmark,
    toggleDocumentBookmark,
    getFilteredVideos,
    getFilteredDocuments,
    getBookmarkedVideos,
    getBookmarkedDocuments,
    initializeData
  } = useLearningStore();

  // Get filtered data
  const filteredVideos = getFilteredVideos();
  const filteredDocuments = getFilteredDocuments();
  const bookmarkedVideosList = getBookmarkedVideos();
  const bookmarkedDocumentsList = getBookmarkedDocuments();

  useEffect(() => {
    initializeData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Download document function
  const downloadDocument = async (document: Document) => {
    try {
      setDownloadProgress(prev => ({ ...prev, [document.id]: 0 }));
      
      // Check if URL is a placeholder
      if (document.downloadUrl.includes('example.com')) {
        Alert.alert(
          'Demo Mode', 
          `This is a demo. In a real app, "${document.title}" would be downloaded from a secure server.`,
          [
            { text: 'View Online', onPress: () => Linking.openURL('https://www.nist.gov/cyberframework') },
            { text: 'OK', style: 'cancel' }
          ]
        );
        return;
      }

      const fileName = document.title.replace(/[^a-z0-9\s]/gi, '_').replace(/\s+/g, '_') + '.pdf';
      const fileUri = FileSystem.documentDirectory + fileName;
      
      const downloadResumable = FileSystem.createDownloadResumable(
        document.downloadUrl,
        fileUri,
        {},
        (downloadProgressCallback) => {
          const progress = downloadProgressCallback.totalBytesWritten / downloadProgressCallback.totalBytesExpectedToWrite;
          setDownloadProgress(prev => ({ ...prev, [document.id]: Math.round(progress * 100) }));
        }
      );

      const result = await downloadResumable.downloadAsync();
      if (result) {
        Alert.alert(
          'Download Complete', 
          `${document.title} has been downloaded successfully!`,
          [
            { text: 'Open', onPress: () => Linking.openURL(result.uri) },
            { text: 'OK', style: 'cancel' }
          ]
        );
        setDownloadProgress(prev => ({ ...prev, [document.id]: 100 }));
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert(
        'Download Failed', 
        'Unable to download the document. Please check your internet connection and try again.',
        [
          { text: 'View Online', onPress: () => Linking.openURL(document.downloadUrl) },
          { text: 'OK', style: 'cancel' }
        ]
      );
      setDownloadProgress(prev => ({ ...prev, [document.id]: 0 }));
    }
  };

  // Get document icon
  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'PDF': return 'file-pdf-box';
      case 'Guide': return 'book-open-variant';
      case 'Whitepaper': return 'file-document';
      case 'Checklist': return 'checkbox-marked-circle-outline';
      default: return 'file-document';
    }
  };

  // Get document color
  const getDocumentColor = (type: Document['type']) => {
    switch (type) {
      case 'PDF': return '#F44336';
      case 'Guide': return '#4CAF50';
      case 'Whitepaper': return '#2196F3';
      case 'Checklist': return '#FF9800';
      default: return theme.colors.primary;
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: 'Beginner' | 'Intermediate' | 'Advanced') => {
    switch (difficulty) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return theme.colors.primary;
    }
  };

  // Render video item
  const renderVideoItem = ({ item }: { item: Video }) => (
    <Card style={styles.videoCard}>
      <View style={styles.videoThumbnailContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.videoThumbnail} />
        <TouchableOpacity 
          style={styles.playButton}
          onPress={() => {
            const youtubeUrl = `https://www.youtube.com/watch?v=${item.youtubeId}`;
            Linking.canOpenURL(youtubeUrl).then(supported => {
              if (supported) {
                Linking.openURL(youtubeUrl);
              } else {
                Alert.alert(
                  'Cannot Open Video',
                  'Unable to open YouTube. Please install the YouTube app or check your internet connection.',
                  [{ text: 'OK' }]
                );
              }
            }).catch(err => {
              console.error('Error opening YouTube:', err);
              Alert.alert('Error', 'Failed to open video');
            });
          }}
        >
          <MaterialCommunityIcons name="play-circle" size={48} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.videoDuration}>
          <Text style={styles.videoDurationText}>{item.duration}</Text>
        </View>
        <TouchableOpacity 
          style={styles.bookmarkButton}
          onPress={() => toggleVideoBookmark(item.id)}
        >
          <MaterialCommunityIcons 
            name={bookmarkedVideos.includes(item.id) ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color="#00d4ff" 
          />
        </TouchableOpacity>
      </View>
      
      <Card.Content style={styles.videoContent}>
        <Text style={styles.videoTitle}>{item.title}</Text>
        <Text style={styles.videoChannel}>by {item.channel}</Text>
        <Text style={styles.videoDescription} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.videoMeta}>
          <Chip 
            mode="outlined" 
            style={[styles.difficultyChip, { borderColor: getDifficultyColor(item.difficulty) }]}
            textStyle={{ color: getDifficultyColor(item.difficulty) }}
          >
            {item.difficulty}
          </Chip>
          <Text style={styles.videoViews}>{item.views} views</Text>
        </View>
      </Card.Content>
    </Card>
  );

  // Render document item
  const renderDocumentItem = ({ item }: { item: Document }) => {
    const progress = downloadProgress[item.id];
    const isDownloading = progress !== undefined && progress > 0 && progress < 100;
    const isDownloaded = progress !== undefined && progress === 100;
    
    return (
      <Card style={styles.documentCard}>
        <Card.Content>
          <View style={styles.documentHeader}>
            <View style={styles.documentIconContainer}>
              <MaterialCommunityIcons 
                name={getDocumentIcon(item.type) as any}
                size={32} 
                color={getDocumentColor(item.type)} 
              />
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>{item.title}</Text>
              <Text style={styles.documentAuthor}>by {item.author}</Text>
            </View>
            <TouchableOpacity 
              style={styles.bookmarkButton}
              onPress={() => toggleDocumentBookmark(item.id)}
            >
              <MaterialCommunityIcons 
                name={bookmarkedDocuments.includes(item.id) ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color="#00d4ff" 
              />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.documentDescription} numberOfLines={2}>{item.description}</Text>
          
          <View style={styles.documentMeta}>
            <Chip 
              mode="outlined" 
              style={[styles.difficultyChip, { borderColor: getDifficultyColor(item.difficulty) }]}
              textStyle={{ color: getDifficultyColor(item.difficulty) }}
            >
              {item.difficulty}
            </Chip>
            <Text style={styles.documentSize}>{item.fileSize}</Text>
            {item.pages && <Text style={styles.documentPages}>{item.pages} pages</Text>}
          </View>
          
          <View style={styles.documentActions}>
            <Button 
              mode="contained" 
              onPress={() => downloadDocument(item)}
              disabled={isDownloading}
              style={styles.downloadButton}
            >
              {isDownloading ? `${Math.round(progress)}%` : isDownloaded ? 'Downloaded' : 'Download'}
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => {
                Linking.canOpenURL(item.downloadUrl).then(supported => {
                  if (supported) {
                    Linking.openURL(item.downloadUrl);
                  } else {
                    Alert.alert(
                      'Cannot Open Document',
                      'Unable to open the document. Please check your internet connection.',
                      [{ text: 'OK' }]
                    );
                  }
                }).catch(err => {
                  console.error('Error opening document:', err);
                  Alert.alert('Error', 'Failed to open document');
                });
              }}
              style={styles.viewButton}
            >
              View Online
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  // Render empty state
  const renderEmptyState = (type: 'videos' | 'documents') => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons 
        name={type === 'videos' ? 'video-outline' : 'file-document-outline'} 
        size={64} 
        color="#666" 
      />
      <Text style={styles.emptyTitle}>No {type} found</Text>
      <Text style={styles.emptyDescription}>
        Try adjusting your search or filter criteria
      </Text>
    </View>
  );

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Videos':
        return (
          <FlatList
            data={filteredVideos}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyState('videos')}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        );
      
      case 'Documents':
        return (
          <FlatList
            data={filteredDocuments}
            renderItem={renderDocumentItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyState('documents')}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        );
      
      case 'My Library':
        return (
          <ScrollView 
            style={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {bookmarkedVideosList.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Bookmarked Videos</Text>
                {bookmarkedVideosList.map((video) => (
                  <View key={video.id}>
                    {renderVideoItem({ item: video })}
                  </View>
                ))}
              </View>
            )}
            
            {bookmarkedDocumentsList.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Bookmarked Documents</Text>
                {bookmarkedDocumentsList.map((document) => (
                  <View key={document.id}>
                    {renderDocumentItem({ item: document })}
                  </View>
                ))}
              </View>
            )}
            
            {bookmarkedVideosList.length === 0 && bookmarkedDocumentsList.length === 0 && (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="bookmark-outline" size={64} color="#666" />
                <Text style={styles.emptyTitle}>No bookmarks yet</Text>
                <Text style={styles.emptyDescription}>
                  Bookmark videos and documents to access them here
                </Text>
              </View>
            )}
          </ScrollView>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Surface style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          Learning Hub
        </Text>
        <Text variant="bodyMedium" style={styles.headerSubtitle}>
          Enhance your cybersecurity knowledge
        </Text>
      </Surface>

      {/* Search Bar */}
      <Searchbar
        placeholder="Search videos and documents..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        iconColor="#00d4ff"
      />

      {/* Filter Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {['All', 'Beginner', 'Intermediate', 'Advanced'].map((filter) => (
          <Chip
            key={filter}
            selected={selectedFilter === filter}
            onPress={() => setSelectedFilter(filter as 'All' | 'Beginner' | 'Intermediate' | 'Advanced')}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.selectedFilterChip
            ]}
            textStyle={[
              styles.filterChipText,
              selectedFilter === filter && styles.selectedFilterChipText
            ]}
          >
            {filter}
          </Chip>
        ))}
      </ScrollView>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: 'Videos', label: 'Videos', icon: 'play-circle-outline' },
          { key: 'Documents', label: 'Documents', icon: 'file-document-outline' },
          { key: 'My Library', label: 'My Library', icon: 'bookmark-outline' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.key as 'Videos' | 'Documents' | 'My Library')}
          >
            <MaterialCommunityIcons
              name={tab.icon as any}
              size={20}
              color={activeTab === tab.key ? '#00d4ff' : '#666'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00d4ff" />
          <Text style={styles.loadingText}>Loading content...</Text>
        </View>
      ) : (
        renderTabContent()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    opacity: 0.7,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderColor: '#00d4ff',
  },
  selectedFilterChip: {
    backgroundColor: '#00d4ff',
  },
  filterChipText: {
    color: '#00d4ff',
  },
  selectedFilterChipText: {
    color: '#ffffff',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#00d4ff',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  videoCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  videoThumbnailContainer: {
    position: 'relative',
    height: 200,
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
  },
  videoDuration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoDurationText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  videoContent: {
    paddingTop: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  videoChannel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  difficultyChip: {
    height: 28,
  },
  videoViews: {
    fontSize: 12,
    color: '#666',
  },
  documentCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  documentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  documentAuthor: {
    fontSize: 14,
    color: '#666',
  },
  documentDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  documentSize: {
    fontSize: 12,
    color: '#666',
  },
  documentPages: {
    fontSize: 12,
    color: '#666',
  },
  documentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  downloadButton: {
    flex: 1,
  },
  viewButton: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  libraryContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 16,
    color: '#333',
  },
});

export default LearningScreen;
