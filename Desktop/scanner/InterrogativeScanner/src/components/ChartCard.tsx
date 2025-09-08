/**
 * Chart display card component for analytics
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { spacing, borderRadius } from '../theme';

const screenWidth = Dimensions.get('window').width;

interface ChartCardProps {
  title: string;
  type: 'line' | 'pie';
  data: any;
  height?: number;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  type,
  data,
  height = 200,
}) => {
  const theme = useTheme();

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.onSurface,
    style: {
      borderRadius: borderRadius.md,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  const renderChart = () => {
    if (type === 'line') {
      return (
        <LineChart
          data={data}
          width={screenWidth - spacing.md * 4}
          height={height}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      );
    }

    if (type === 'pie') {
      return (
        <PieChart
          data={data}
          width={screenWidth - spacing.md * 4}
          height={height}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      );
    }

    return null;
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          {title}
        </Text>
        <View style={styles.chartContainer}>
          {renderChart()}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: spacing.md,
    borderRadius: borderRadius.md,
  },
  title: {
    fontWeight: '600',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    borderRadius: borderRadius.md,
  },
});

export default ChartCard;
