/**
 * Community Screen - Crowdsourced threat reporting and community features
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  Dimensions,
  RefreshControl
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  Button,
  Searchbar,
  useTheme,
  Surface,
  IconButton,
  FAB,
  Divider,
  Avatar,
  Badge
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useCommunityStore, { ThreatReport } from '../stores/communityStore';
import ReportThreatModal from '../components/ReportThreatModal';

const { width: screenWidth } = Dimensions.get('window');

const CommunityScreen: React.FC = () => {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'verified' | 'trending' | 'my-reports'>('all');
  const [showReportModal, setShowReportModal] = useState(false);

  const {
    searchQuery,
    selectedThreatType,
    selectedSeverity,
    sortBy,
    communityStats,
    upvotedReports,
    downvotedReports,
    setSearchQuery,
    setThreatTypeFilter,
    setSeverityFilter,
    setSortBy,
    upvoteReport,
    downvoteReport,
    getFilteredReports,
    getMyReports,
    getVerifiedReports,
    getTrendingReports,
    initializeCommunityData
  } = useCommunityStore();

  useEffect(() => {
    initializeCommunityData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getReportsForTab = () => {
    switch (selectedTab) {
      case 'verified':
        return getVerifiedReports();
      case 'trending':
        return getTrendingReports();
      case 'my-reports':
        return getMyReports();
      default:
        return getFilteredReports();
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return '#ff1744';
      case 'High': return '#ff5722';
      case 'Medium': return '#ff9800';
      case 'Low': return '#4caf50';
      default: return theme.colors.primary;
    }
  };

  const getThreatTypeIcon = (type: string): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (type) {
      case 'Malware': return 'bug';
      case 'Phishing': return 'fish';
      case 'Scam': return 'alert-decagram';
      case 'Suspicious URL': return 'link-variant';
      case 'Fake App': return 'application-outline';
      case 'Data Breach': return 'database-alert';
      default: return 'shield-alert';
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

  const handleThreatCardPress = (item: ThreatReport) => {
    Alert.alert(
      item.title,
      `${item.description}\n\nThreat Type: ${item.threatType}\nSeverity: ${item.severity}\nReported by: ${item.reportedBy}\nUpvotes: ${item.upvotes} | Downvotes: ${item.downvotes}${item.url ? `\n\nURL: ${item.url}` : ''}${item.fileName ? `\n\nFile: ${item.fileName}` : ''}`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Report False Positive', onPress: () => Alert.alert('Reported', 'Thank you for your feedback!') },
        { text: 'Share', onPress: () => Alert.alert('Share', 'Sharing functionality coming soon!') }
      ]
    );
  };

  const renderThreatReport = ({ item }: { item: ThreatReport }) => (
    <TouchableOpacity onPress={() => handleThreatCardPress(item)}>
      <Card style={styles.reportCard}>
        <Card.Content>
          {/* Header */}
          <View style={styles.reportHeader}>
            <View style={styles.reportTitleRow}>
              <MaterialCommunityIcons 
                name={getThreatTypeIcon(item.threatType) as any} 
                size={20} 
                color={getSeverityColor(item.severity)} 
              />
              <Text style={styles.reportTitle} numberOfLines={2}>{item.title}</Text>
              {item.verified && (
                <MaterialCommunityIcons name="check-decagram" size={16} color="#4caf50" />
              )}
            </View>
            
            <View style={styles.reportMeta}>
              <Chip 
                mode="outlined" 
                style={[styles.severityChip, { borderColor: getSeverityColor(item.severity) }]}
                textStyle={{ color: getSeverityColor(item.severity), fontSize: 10 }}
                compact
              >
                {item.severity}
              </Chip>
              <Chip 
                mode="outlined" 
                style={styles.typeChip}
                textStyle={{ fontSize: 10 }}
                compact
              >
                {item.threatType}
              </Chip>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.reportDescription} numberOfLines={3}>
            {item.description}
          </Text>

          {/* URL/File info */}
          {(item.url || item.fileName) && (
            <Surface style={styles.targetInfo}>
              <MaterialCommunityIcons 
                name={item.url ? "link" : "file"} 
                size={14} 
                color={theme.colors.primary} 
              />
              <Text style={styles.targetText} numberOfLines={1}>
                {item.url || item.fileName}
              </Text>
            </Surface>
          )}

          {/* Tags */}
          {item.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tags.slice(0, 3).map((tag, index) => (
                <Chip key={index} style={styles.tag} textStyle={styles.tagText} compact>
                  #{tag}
                </Chip>
              ))}
              {item.tags.length > 3 && (
                <Text style={styles.moreTags}>+{item.tags.length - 3} more</Text>
              )}
            </View>
          )}

          {/* Footer */}
          <View style={styles.reportFooter}>
            <View style={styles.authorInfo}>
              <Avatar.Text size={24} label={item.reportedBy.charAt(0)} />
              <View style={styles.authorDetails}>
                <Text style={styles.authorName}>{item.reportedBy}</Text>
                <Text style={styles.reportTime}>{formatTimeAgo(item.reportedAt)}</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.voteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  upvoteReport(item.id);
                }}
              >
                <MaterialCommunityIcons 
                  name={upvotedReports.includes(item.id) ? "arrow-up-bold" : "arrow-up-bold-outline"} 
                  size={18} 
                  color={upvotedReports.includes(item.id) ? "#4caf50" : theme.colors.onSurface} 
                />
                <Text style={styles.voteCount}>{item.upvotes}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.voteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  downvoteReport(item.id);
                }}
              >
                <MaterialCommunityIcons 
                  name={downvotedReports.includes(item.id) ? "arrow-down-bold" : "arrow-down-bold-outline"} 
                  size={18} 
                  color={downvotedReports.includes(item.id) ? "#f44336" : theme.colors.onSurface} 
                />
                <Text style={styles.voteCount}>{item.downvotes}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.commentButton}
                onPress={(e) => {
                  e.stopPropagation();
                  Alert.alert('Comments', `View ${item.comments.length} comments for this threat report`);
                }}
              >
                <MaterialCommunityIcons name="comment-outline" size={18} color={theme.colors.onSurface} />
                <Text style={styles.commentCount}>{item.comments.length}</Text>
              </TouchableOpacity>

              <IconButton 
                icon="share-variant" 
                size={16} 
                onPress={(e) => {
                  e?.stopPropagation();
                  Alert.alert('Share', 'Sharing functionality coming soon!');
                }}
              />
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderStatsCard = () => (
    <Card style={styles.statsCard}>
      <Card.Content>
        <Text style={styles.statsTitle}>Community Impact</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{communityStats.totalReports.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Reports</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{communityStats.verifiedReports.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{communityStats.threatsBlocked.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Threats Blocked</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{communityStats.activeUsers.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Active Users</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { key: 'all', label: 'All Reports', icon: 'shield-alert' },
          { key: 'verified', label: 'Verified', icon: 'check-decagram' },
          { key: 'trending', label: 'Trending', icon: 'trending-up' },
          { key: 'my-reports', label: 'My Reports', icon: 'account' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabButton,
              selectedTab === tab.key && styles.activeTabButton
            ]}
            onPress={() => setSelectedTab(tab.key as any)}
          >
            <MaterialCommunityIcons 
              name={tab.icon as any} 
              size={16} 
              color={selectedTab === tab.key ? theme.colors.primary : theme.colors.onSurface} 
            />
            <Text style={[
              styles.tabLabel,
              selectedTab === tab.key && styles.activeTabLabel
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => {
            // Show sort options
            Alert.alert('Sort By', 'Choose sorting option', [
              { text: 'Recent', onPress: () => setSortBy('recent') },
              { text: 'Popular', onPress: () => setSortBy('popular') },
              { text: 'Severity', onPress: () => setSortBy('severity') },
              { text: 'Verified', onPress: () => setSortBy('verified') }
            ]);
          }}
        >
          <MaterialCommunityIcons name="sort" size={16} color={theme.colors.primary} />
          <Text style={styles.filterText}>Sort: {sortBy}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => {
            // Show threat type filter
            const types = ['All', 'Malware', 'Phishing', 'Scam', 'Suspicious URL', 'Fake App', 'Data Breach', 'Other'];
            Alert.alert('Filter by Type', 'Choose threat type', 
              types.map(type => ({ text: type, onPress: () => setThreatTypeFilter(type) }))
            );
          }}
        >
          <MaterialCommunityIcons name="filter" size={16} color={theme.colors.primary} />
          <Text style={styles.filterText}>Type: {selectedThreatType}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => {
            // Show severity filter
            const severities = ['All', 'Critical', 'High', 'Medium', 'Low'];
            Alert.alert('Filter by Severity', 'Choose severity level',
              severities.map(severity => ({ text: severity, onPress: () => setSeverityFilter(severity) }))
            );
          }}
        >
          <MaterialCommunityIcons name="alert" size={16} color={theme.colors.primary} />
          <Text style={styles.filterText}>Severity: {selectedSeverity}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Surface style={styles.header}>
        <Text style={styles.headerTitle}>Community Threats</Text>
        <Text style={styles.headerSubtitle}>Crowdsourced cybersecurity intelligence</Text>
      </Surface>

      {/* Search */}
      <Searchbar
        placeholder="Search threat reports..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {/* Stats Card */}
      {renderStatsCard()}

      {/* Tab Bar */}
      {renderTabBar()}

      {/* Filters */}
      {renderFilters()}

      {/* Reports List */}
      <FlatList
        data={getReportsForTab()}
        renderItem={renderThreatReport}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="shield-search" size={64} color={theme.colors.outline} />
            <Text style={styles.emptyTitle}>No threat reports found</Text>
            <Text style={styles.emptySubtitle}>
              {selectedTab === 'my-reports' 
                ? 'You haven\'t reported any threats yet'
                : 'Try adjusting your search or filters'
              }
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowReportModal(true)}
        label="Report Threat"
      />

      {/* Report Threat Modal */}
      <ReportThreatModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
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
  searchBar: {
    margin: 16,
    elevation: 2,
  },
  statsCard: {
    margin: 16,
    marginTop: 0,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  tabBar: {
    backgroundColor: 'white',
    paddingVertical: 8,
    elevation: 1,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: '#e3f2fd',
  },
  tabLabel: {
    marginLeft: 6,
    fontSize: 14,
  },
  activeTabLabel: {
    color: '#1976d2',
    fontWeight: '600',
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
  },
  filterText: {
    marginLeft: 4,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  listContainer: {
    padding: 16,
  },
  reportCard: {
    marginBottom: 16,
    elevation: 2,
  },
  reportHeader: {
    marginBottom: 8,
  },
  reportTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reportTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 4,
  },
  reportMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  severityChip: {
    height: 24,
  },
  typeChip: {
    height: 24,
  },
  reportDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    opacity: 0.8,
  },
  targetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  targetText: {
    marginLeft: 6,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  tag: {
    height: 20,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
  },
  moreTags: {
    fontSize: 10,
    opacity: 0.6,
    marginLeft: 4,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorDetails: {
    marginLeft: 8,
  },
  authorName: {
    fontSize: 12,
    fontWeight: '600',
  },
  reportTime: {
    fontSize: 10,
    opacity: 0.6,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  voteCount: {
    fontSize: 12,
    marginLeft: 2,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  commentCount: {
    fontSize: 12,
    marginLeft: 2,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default CommunityScreen;
