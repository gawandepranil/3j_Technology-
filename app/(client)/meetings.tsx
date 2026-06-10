import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenHeader } from '../../src/components/ui/ScreenHeader';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { Colors, Typography, Spacing, BorderRadius } from '../../src/theme/tokens';
import { MOCK_MEETINGS } from '../../src/data/mockData';
import { useMeetingStore } from '../../src/store/meetingStore';
import { useProjectStore } from '../../src/store/projectStore';
import { useAuthStore } from '../../src/store/authStore';

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];
const DAYS = ['Mon\nJun 2', 'Tue\nJun 3', 'Wed\nJun 4', 'Thu\nJun 5', 'Fri\nJun 6'];

export default function MeetingsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingMode, setBookingMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { meetings, isLoading: meetingsLoading, fetchMeetings, createMeeting } = useMeetingStore();
  const { projects, fetchProjects } = useProjectStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchMeetings();
    fetchProjects();
  }, []);

  const handleBook = async () => {
    if (!selectedSlot) {
      Alert.alert('Select Time', 'Please select a time slot first.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const dayMap: Record<number, string> = {
        0: '2026-06-02',
        1: '2026-06-03',
        2: '2026-06-04',
        3: '2026-06-05',
        4: '2026-06-06'
      };
      const datePart = dayMap[selectedDay] || '2026-06-02';
      
      let timePart = '09:00:00';
      if (selectedSlot === '09:00 AM') timePart = '09:00:00';
      else if (selectedSlot === '10:00 AM') timePart = '10:00:00';
      else if (selectedSlot === '11:00 AM') timePart = '11:00:00';
      else if (selectedSlot === '02:00 PM') timePart = '14:00:00';
      else if (selectedSlot === '03:00 PM') timePart = '15:00:00';
      else if (selectedSlot === '04:00 PM') timePart = '16:00:00';

      const isoDateTime = `${datePart}T${timePart}Z`;
      
      const userId = user?.id ? parseInt(user.id, 10) : null;
      const myProjects = projects.filter(p => p.client_id === userId);
      const projectId = myProjects.length > 0 ? myProjects[0].id : undefined;

      const newMeeting = await createMeeting({
        title: 'Project Discussion Call',
        description: `Scheduled via Client Portal for ${selectedSlot}`,
        date: isoDateTime,
        project_id: projectId
      });

      if (newMeeting) {
        Alert.alert(
          'Meeting Scheduled!',
          `Your meeting has been scheduled for ${DAYS[selectedDay].replace('\n', ', ')} at ${selectedSlot}.\n\nA Google Meet link will be sent to your email.`,
          [{ text: 'OK', onPress: () => { setBookingMode(false); setSelectedSlot(null); } }]
        );
        fetchMeetings();
      } else {
        Alert.alert('Booking Failed', 'Failed to schedule meeting. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Booking Failed', error?.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert backend meetings to UI-compatible objects
  const uiMeetings = (meetings || []).map((m) => {
    let dateStr = '2026-06-02';
    let timeStr = '10:00 AM';
    try {
      const d = new Date(m.date);
      dateStr = d.toISOString().split('T')[0];
      let hours = d.getUTCHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutes = d.getUTCMinutes().toString().padStart(2, '0');
      timeStr = `${hours}:${minutes} ${ampm}`;
    } catch (e) {
      // fallback
    }

    const isUpcoming = new Date(m.date) > new Date();

    return {
      id: `real-${m.id}`,
      client_name: user?.full_name || 'Client',
      agenda: m.description || m.title || 'Project Consultation',
      status: isUpcoming ? 'upcoming' : 'completed',
      date: dateStr,
      time: timeStr,
      platform: 'google_meet',
      link: 'https://meet.google.com/abc-defg-hij',
    };
  });

  const combinedMeetings = [...uiMeetings, ...MOCK_MEETINGS];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Meetings"
        subtitle="Schedule and manage meetings"
        rightAction={
          <TouchableOpacity
            style={[styles.bookBtn, bookingMode && { backgroundColor: Colors.error }]}
            onPress={() => setBookingMode(!bookingMode)}
          >
            <Ionicons
              name={bookingMode ? 'close' : 'add'}
              size={20}
              color={Colors.white}
            />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Book Meeting Panel */}
        {bookingMode && (
          <View style={styles.bookingPanel}>
            <LinearGradient colors={['#0047B3', '#0066FF']} style={styles.bookingHeader}>
              <Text style={styles.bookingTitle}>Schedule New Meeting</Text>
              <Text style={styles.bookingSubtitle}>Select a day and time slot</Text>
            </LinearGradient>

            {/* Day Selector */}
            <View style={styles.daySelector}>
              {DAYS.map((day, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.dayBtn, selectedDay === i && styles.dayBtnActive]}
                  onPress={() => { setSelectedDay(i); setSelectedSlot(null); }}
                >
                  <Text style={[styles.dayText, selectedDay === i && styles.dayTextActive]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Time Slots */}
            <View style={styles.slots}>
              {TIME_SLOTS.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[styles.slotBtn, selectedSlot === slot && styles.slotBtnActive]}
                  onPress={() => setSelectedSlot(slot)}
                >
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={selectedSlot === slot ? Colors.white : Colors.textSecondary}
                  />
                  <Text style={[styles.slotText, selectedSlot === slot && styles.slotTextActive]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Platform Selection */}
            <View style={styles.platformRow}>
              <Text style={styles.platformLabel}>Platform:</Text>
              {[
                { name: 'Google Meet', color: '#EA4335' },
                { name: 'Zoom', color: '#2D8CFF' },
              ].map((p) => (
                <View key={p.name} style={[styles.platformChip, { borderColor: p.color }]}>
                  <View style={[styles.platformDot, { backgroundColor: p.color }]} />
                  <Text style={[styles.platformName, { color: p.color }]}>{p.name}</Text>
                </View>
              ))}
            </View>

            <Button
              title="Confirm Meeting"
              fullWidth
              onPress={handleBook}
              style={{ margin: Spacing.base }}
            />
          </View>
        )}

        {/* Meetings List */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>All Meetings</Text>
          {combinedMeetings.map((meeting) => (
            <Card key={meeting.id} style={styles.meetingCard}>
              <View style={styles.meetingTop}>
                <View style={[
                  styles.platformIcon,
                  { backgroundColor: meeting.platform === 'google_meet' ? '#EA433520' : '#2D8CFF20' }
                ]}>
                  <Ionicons
                    name="videocam-outline"
                    size={22}
                    color={meeting.platform === 'google_meet' ? '#EA4335' : '#2D8CFF'}
                  />
                </View>
                <View style={styles.meetingMain}>
                  <Text style={styles.meetingClient}>{meeting.client_name}</Text>
                  <Text style={styles.meetingAgenda} numberOfLines={2}>{meeting.agenda}</Text>
                </View>
                <Badge
                  label={meeting.status === 'upcoming' ? 'Upcoming' : meeting.status === 'completed' ? 'Done' : 'Cancelled'}
                  variant={meeting.status === 'upcoming' ? 'info' : meeting.status === 'completed' ? 'success' : 'error'}
                />
              </View>
              <View style={styles.meetingMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={14} color={Colors.textMuted} />
                  <Text style={styles.metaText}>{meeting.date}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
                  <Text style={styles.metaText}>{meeting.time}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons
                    name={meeting.platform === 'google_meet' ? 'logo-google' : 'videocam-outline'}
                    size={14}
                    color={Colors.textMuted}
                  />
                  <Text style={styles.metaText}>
                    {meeting.platform === 'google_meet' ? 'Google Meet' : 'Zoom'}
                  </Text>
                </View>
              </View>
              {meeting.link && meeting.status === 'upcoming' && (
                <TouchableOpacity
                  style={styles.joinBtn}
                  onPress={() => Alert.alert('Join Meeting', 'Opening meeting link...')}
                >
                  <Ionicons name="videocam" size={14} color={Colors.white} />
                  <Text style={styles.joinBtnText}>Join Meeting</Text>
                </TouchableOpacity>
              )}
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 100 },
  bookBtn: {
    width: 36, height: 36,
    backgroundColor: Colors.primary,
    borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  bookingPanel: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
    marginBottom: Spacing.base,
  },
  bookingHeader: {
    padding: Spacing.base,
  },
  bookingTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.white,
  },
  bookingSubtitle: { fontSize: Typography.size.sm, color: Colors.white + 'AA', marginTop: 2 },
  daySelector: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  dayBtn: {
    flex: 1, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
    alignItems: 'center',
  },
  dayBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dayText: { fontSize: 10, color: Colors.textSecondary, textAlign: 'center', lineHeight: 14 },
  dayTextActive: { color: Colors.white, fontWeight: Typography.weight.semibold },
  slots: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: Spacing.base, gap: Spacing.sm,
  },
  slotBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  slotBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  slotText: { fontSize: Typography.size.sm, color: Colors.textSecondary },
  slotTextActive: { color: Colors.white, fontWeight: Typography.weight.medium },
  platformRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingTop: Spacing.md, gap: Spacing.sm,
  },
  platformLabel: { fontSize: Typography.size.sm, color: Colors.textSecondary },
  platformChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.sm, paddingVertical: 4,
    borderRadius: BorderRadius.full, borderWidth: 1,
  },
  platformDot: { width: 8, height: 8, borderRadius: 4 },
  platformName: { fontSize: Typography.size.xs, fontWeight: Typography.weight.medium },
  content: { paddingHorizontal: Spacing.base },
  sectionTitle: {
    fontSize: Typography.size.lg, fontWeight: Typography.weight.bold,
    color: Colors.textPrimary, marginBottom: Spacing.md,
  },
  meetingCard: { marginBottom: Spacing.sm },
  meetingTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginBottom: Spacing.sm },
  platformIcon: {
    width: 46, height: 46, borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  meetingMain: { flex: 1 },
  meetingClient: { fontSize: Typography.size.base, fontWeight: Typography.weight.semibold, color: Colors.textPrimary },
  meetingAgenda: { fontSize: Typography.size.sm, color: Colors.textSecondary, marginTop: 2 },
  meetingMeta: {
    flexDirection: 'row', gap: Spacing.base,
    paddingTop: Spacing.sm,
    borderTopWidth: 1, borderTopColor: Colors.surfaceBorder,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: Typography.size.xs, color: Colors.textMuted },
  joinBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.sm,
    gap: 6,
  },
  joinBtnText: { fontSize: Typography.size.sm, color: Colors.white, fontWeight: Typography.weight.semibold },
});
