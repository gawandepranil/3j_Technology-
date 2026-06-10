import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenHeader } from '../../src/components/ui/ScreenHeader';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Colors, Typography, Spacing, BorderRadius } from '../../src/theme/tokens';
import { ProjectType } from '../../src/types';
import { useAuthStore } from '../../src/store/authStore';
import { projectService } from '../../src/api/projectService';
import { requirementService } from '../../src/api/requirementService';
import { Alert } from '../../src/utils/alert';


const PROJECT_TYPES: { value: ProjectType; label: string; icon: string }[] = [
  { value: 'web_development', label: 'Web Development', icon: 'globe-outline' },
  { value: 'mobile_app', label: 'Mobile App', icon: 'phone-portrait-outline' },
  { value: 'iot', label: 'IoT Solution', icon: 'hardware-chip-outline' },
  { value: 'cloud', label: 'Cloud Services', icon: 'cloud-outline' },
  { value: 'cybersecurity', label: 'Cybersecurity', icon: 'shield-outline' },
  { value: 'custom', label: 'Custom Software', icon: 'code-slash-outline' },
];

const BUDGETS = ['< PKR 100K', 'PKR 100K–300K', 'PKR 300K–700K', 'PKR 700K–1.5M', '> PKR 1.5M'];
const TIMELINES = ['1–2 Weeks', '1 Month', '2–3 Months', '3–6 Months', '6+ Months'];

export default function SubmitRequirement() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuthStore();

  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [requirements, setRequirements] = useState('');
  const [referenceLinks, setReferenceLinks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!requirements.trim()) {
      Alert.alert('Required', 'Please describe your project requirements.');
      return;
    }
    if (!projectName.trim() || !projectType) {
      Alert.alert('Required', 'Please complete Step 1 — project name and type are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create the project in the database
      const description = [
        `Type: ${PROJECT_TYPES.find(t => t.value === projectType)?.label ?? projectType}`,
        `Budget: ${budget || 'Not specified'}`,
        `Timeline: ${timeline || 'Not specified'}`,
        `References: ${referenceLinks.trim() || 'None'}`,
      ].join('\n');

      const newProject = await projectService.createProject({
        title: projectName.trim(),
        description,
        status: 'planning',
        client_id: user?.id ? parseInt(user.id, 10) : undefined,
      });

      // Step 2: Create the requirement linked to that project
      await requirementService.createRequirement({
        description: requirements.trim(),
        project_id: newProject.id,
        status: 'pending',
      });

      setIsSubmitting(false);

      Alert.alert(
        '🎉 Requirement Submitted!',
        'Your project requirement has been saved. Our team will review it and contact you within 24 hours to schedule a discussion meeting.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      setIsSubmitting(false);
      const msg =
        error?.response?.data?.detail ||
        error?.message ||
        'Failed to submit your requirement. Please check your connection and try again.';
      Alert.alert('Submission Failed', msg);
    }
  };

  const canProceedStep1 = projectName.trim() && projectType;
  const canProceedStep2 = budget && timeline;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScreenHeader title="Start a Project" showBack subtitle="Tell us about your idea" />

        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <View style={[styles.stepDot, step >= s && styles.stepDotActive]}>
                {step > s
                  ? <Ionicons name="checkmark" size={12} color={Colors.white} />
                  : <Text style={[styles.stepNum, step === s && styles.stepNumActive]}>{s}</Text>
                }
              </View>
              {s < 3 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
            </React.Fragment>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Step 1: Basics */}
          {step === 1 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Project Basics</Text>
              <Text style={styles.stepSubtitle}>What are you looking to build?</Text>

              <Input
                label="Project Name *"
                placeholder="e.g. E-commerce Mobile App"
                value={projectName}
                onChangeText={setProjectName}
                leftIcon={<Ionicons name="briefcase-outline" size={18} color={Colors.textMuted} />}
              />

              <Text style={styles.typeLabel}>Project Type *</Text>
              <View style={styles.typeGrid}>
                {PROJECT_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[styles.typeCard, projectType === type.value && styles.typeCardActive]}
                    onPress={() => setProjectType(type.value)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={type.icon as any}
                      size={24}
                      color={projectType === type.value ? Colors.white : Colors.primary}
                    />
                    <Text style={[styles.typeCardText, projectType === type.value && styles.typeCardTextActive]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Step 2: Budget & Timeline */}
          {step === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Budget & Timeline</Text>
              <Text style={styles.stepSubtitle}>Help us plan the right scope</Text>

              <Text style={styles.typeLabel}>Budget Range *</Text>
              {BUDGETS.map((b) => (
                <TouchableOpacity
                  key={b}
                  style={[styles.optionRow, budget === b && styles.optionRowActive]}
                  onPress={() => setBudget(b)}
                >
                  <Ionicons
                    name={budget === b ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={budget === b ? Colors.primary : Colors.textMuted}
                  />
                  <Text style={[styles.optionText, budget === b && styles.optionTextActive]}>{b}</Text>
                </TouchableOpacity>
              ))}

              <Text style={[styles.typeLabel, { marginTop: Spacing.base }]}>Expected Timeline *</Text>
              {TIMELINES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.optionRow, timeline === t && styles.optionRowActive]}
                  onPress={() => setTimeline(t)}
                >
                  <Ionicons
                    name={timeline === t ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={timeline === t ? Colors.primary : Colors.textMuted}
                  />
                  <Text style={[styles.optionText, timeline === t && styles.optionTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Step 3: Requirements */}
          {step === 3 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Project Details</Text>
              <Text style={styles.stepSubtitle}>The more detail, the better the proposal</Text>

              <Input
                label="Project Requirements *"
                placeholder="Describe what you need in detail. Features, functionality, target audience, etc."
                value={requirements}
                onChangeText={setRequirements}
                multiline
                numberOfLines={6}
              />

              <Input
                label="Reference Websites / Apps (optional)"
                placeholder="https://example.com, https://another.com"
                value={referenceLinks}
                onChangeText={setReferenceLinks}
                leftIcon={<Ionicons name="link-outline" size={18} color={Colors.textMuted} />}
              />

              {/* Summary */}
              <View style={styles.summaryCard}>
                <LinearGradient colors={['#0047B3', '#0066FF']} style={styles.summaryHeader}>
                  <Text style={styles.summaryTitle}>Submission Summary</Text>
                </LinearGradient>
                <View style={styles.summaryContent}>
                  {[
                    { label: 'Project', value: projectName },
                    { label: 'Type', value: PROJECT_TYPES.find(t => t.value === projectType)?.label || '' },
                    { label: 'Budget', value: budget },
                    { label: 'Timeline', value: timeline },
                  ].map((row) => (
                    <View key={row.label} style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>{row.label}</Text>
                      <Text style={styles.summaryValue}>{row.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Navigation Buttons */}
          <View style={styles.navButtons}>
            {step > 1 && (
              <Button
                title="Back"
                variant="secondary"
                onPress={() => setStep(step - 1)}
                style={{ flex: 1 }}
                disabled={isSubmitting}
              />
            )}
            {step < 3 ? (
              <Button
                title="Next"
                onPress={() => setStep(step + 1)}
                disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                style={{ flex: 1 }}
              />
            ) : (
              <Button
                title={isSubmitting ? 'Submitting…' : 'Submit Requirement'}
                onPress={handleSubmit}
                disabled={isSubmitting}
                style={{ flex: 1 }}
                icon={
                  isSubmitting
                    ? <ActivityIndicator size="small" color={Colors.white} />
                    : <Ionicons name="send-outline" size={16} color={Colors.white} />
                }
              />
            )}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.base, paddingBottom: 100 },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing['2xl'],
  },
  stepDot: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 2, borderColor: Colors.surfaceBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  stepDotActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepNum: { fontSize: Typography.size.sm, color: Colors.textMuted, fontWeight: Typography.weight.bold },
  stepNumActive: { color: Colors.white },
  stepLine: { flex: 1, height: 2, backgroundColor: Colors.surfaceBorder },
  stepLineActive: { backgroundColor: Colors.primary },
  stepContent: { paddingTop: Spacing.base },
  stepTitle: { fontSize: Typography.size['2xl'], fontWeight: Typography.weight.bold, color: Colors.textPrimary },
  stepSubtitle: { fontSize: Typography.size.sm, color: Colors.textSecondary, marginTop: 4, marginBottom: Spacing.xl },
  typeLabel: { fontSize: Typography.size.sm, fontWeight: Typography.weight.medium, color: Colors.textSecondary, marginBottom: Spacing.sm },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.base },
  typeCard: {
    width: '47%',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
    padding: Spacing.base,
    alignItems: 'center', gap: Spacing.sm,
  },
  typeCardActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeCardText: { fontSize: Typography.size.xs, color: Colors.textSecondary, textAlign: 'center', fontWeight: Typography.weight.medium },
  typeCardTextActive: { color: Colors.white },
  optionRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
  },
  optionRowActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '10' },
  optionText: { fontSize: Typography.size.base, color: Colors.textSecondary },
  optionTextActive: { color: Colors.textPrimary, fontWeight: Typography.weight.medium },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
    overflow: 'hidden',
    marginTop: Spacing.base,
  },
  summaryHeader: { padding: Spacing.md },
  summaryTitle: { fontSize: Typography.size.base, fontWeight: Typography.weight.bold, color: Colors.white },
  summaryContent: { padding: Spacing.base },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  summaryLabel: { fontSize: Typography.size.sm, color: Colors.textSecondary },
  summaryValue: { fontSize: Typography.size.sm, color: Colors.textPrimary, fontWeight: Typography.weight.medium },
  navButtons: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xl },
});
