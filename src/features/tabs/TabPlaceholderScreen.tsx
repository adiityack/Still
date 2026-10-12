import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandHeader, Card } from '@/components';
import { colors, spacing, typography } from '@/config/theme';

type TabPlaceholderScreenProps = {
  subtitle: string;
  title: string;
};

export function TabPlaceholderScreen({ subtitle, title }: TabPlaceholderScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BrandHeader />
        <View style={styles.hero}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Coming next</Text>
          <Text style={styles.cardBody}>
            This tab is wired into navigation. Its full static screen is the next design slice.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xl,
  },
  cardBody: {
    color: colors.muted,
    fontSize: typography.sizes.body,
    lineHeight: 24,
    marginTop: spacing.sm,
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.sizes.title,
    fontWeight: '700',
    lineHeight: 28,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 132,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  hero: {
    minHeight: 150,
    paddingTop: spacing.lg,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 26,
    marginTop: spacing.sm,
  },
  title: {
    color: colors.text,
    fontFamily: typography.displayFallback,
    fontSize: 36,
    lineHeight: 42,
    marginTop: spacing.xl,
  },
});
