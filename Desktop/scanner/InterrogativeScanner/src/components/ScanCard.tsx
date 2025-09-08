/**
 * Reusable scan result card component
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip, IconButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScanResult } from '../types';
import { formatRelativeTime, getVerdictDisplay, truncateText } from '../utils/format';
import { spacing, borderRadius } from '../theme';

interface ScanCardProps {
  scan: ScanResult;
  onPress?: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
}

const ScanCard: React.FC<ScanCardProps> = ({
  scan,
  onPress,
  onDelete,
  showDelete = false,
}) => {
  const theme = useTheme();
  const verdictDisplay = getVerdictDisplay(scan.verdict);

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons
              name={scan.targetType === 'file' ? 'file-document' : 'web'}
              size={24}
              color={theme.colors.primary}
            />
            <View style={styles.titleContainer}>
              <Text variant="titleMedium" style={styles.title}>
                {truncateText(scan.targetName, 30)}
              </Text>
              <Text variant="bodySmall" style={styles.subtitle}>
                {formatRelativeTime(scan.createdAt)} • {scan.scanMode}
                {scan.isTestData && ' • Test Data'}
              </Text>
            </View>
          </View>
          {showDelete && (
            <IconButton
              icon="delete"
              size={20}
              onPress={onDelete}
              iconColor={theme.colors.error}
            />
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.verdictRow}>
            <Chip
              icon={verdictDisplay.icon}
              style={[styles.verdictChip, { backgroundColor: `${verdictDisplay.color}20` }]}
              textStyle={{ color: verdictDisplay.color }}
            >
              {verdictDisplay.label}
            </Chip>
            <View style={styles.scores}>
              <Text variant="bodySmall" style={styles.scoreText}>
                Risk: {scan.riskScore}%
              </Text>
              <Text variant="bodySmall" style={styles.scoreText}>
                Confidence: {scan.confidence}%
              </Text>
            </View>
          </View>

          {scan.threatTypes.length > 0 && (
            <View style={styles.threatsContainer}>
              <Text variant="bodySmall" style={styles.threatsLabel}>
                Threats:
              </Text>
              <View style={styles.threatChips}>
                {scan.threatTypes.slice(0, 2).map((threat, index) => (
                  <Chip
                    key={index}
                    compact
                    style={styles.threatChip}
                    textStyle={styles.threatChipText}
                  >
                    {threat}
                  </Chip>
                ))}
                {scan.threatTypes.length > 2 && (
                  <Text variant="bodySmall" style={styles.moreThreats}>
                    +{scan.threatTypes.length - 2} more
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.xs,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  titleContainer: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  title: {
    fontWeight: '600',
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 2,
  },
  content: {
    gap: spacing.sm,
  },
  verdictRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verdictChip: {
    alignSelf: 'flex-start',
  },
  scores: {
    alignItems: 'flex-end',
  },
  scoreText: {
    opacity: 0.8,
    fontWeight: '500',
  },
  threatsContainer: {
    gap: spacing.xs,
  },
  threatsLabel: {
    fontWeight: '500',
    opacity: 0.8,
  },
  threatChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    alignItems: 'center',
  },
  threatChip: {
    height: 24,
  },
  threatChipText: {
    fontSize: 11,
  },
  moreThreats: {
    opacity: 0.6,
    fontStyle: 'italic',
  },
});

export default ScanCard;
