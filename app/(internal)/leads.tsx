import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../src/components/ui/ScreenHeader';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Avatar } from '../../src/components/ui/Avatar';
import { Button } from '../../src/components/ui/Button';
import { Colors, Typography, Spacing, BorderRadius } from '../../src/theme/tokens';
import { MOCK_LEADS } from '../../src/data/mockData';
import { useLeadStore } from '../../src/store/leadStore';
import { Lead, LeadStatus } from '../../src/types';
import { Alert } from '../../src/utils/alert';

const mapBackendStatus = (status: string): LeadStatus => {
  switch (status) {
    case 'new':
      return 'new';
    case 'contacted':
    case 'qualified':
      return 'meeting_scheduled';
    case 'proposal_sent':
    case 'negotiation':
      return 'proposal_sent';
    case 'won':
      return 'approved';
    case 'lost':
      return 'rejected';
    default:
      return 'new';
  }
};

const mapFrontendStatusToBackend = (status: LeadStatus): string => {
  switch (status) {
    case 'new':
      return 'new';
    case 'meeting_scheduled':
      return 'contacted';
    case 'proposal_sent':
      return 'proposal_sent';
    case 'approved':
      return 'won';
    case 'rejected':
      return 'lost';
    default:
      return 'new';
  }
};

const STATUS_COLUMNS: { status: LeadStatus; label: string; variant: any }[] = [
  { status: 'new', label: 'New', variant: 'lead_new' },
  { status: 'meeting_scheduled', label: 'Meeting', variant: 'lead_meeting' },
  { status: 'proposal_sent', label: 'Proposal', variant: 'lead_proposal' },
  { status: 'approved', label: 'Approved', variant: 'lead_approved' },
  { status: 'rejected', label: 'Rejected', variant: 'lead_rejected' },
];

const NEXT_STATUS: Record<LeadStatus, LeadStatus | null> = {
  new: 'meeting_scheduled',
  meeting_scheduled: 'proposal_sent',
  proposal_sent: 'approved',
  approved: null,
  rejected: null,
};

export default function LeadsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all');

  const { leads: backendLeads, fetchLeads, updateLead } = useLeadStore();

  useEffect(() => {
    fetchLeads();
  }, []);

  const rawLeads = (backendLeads || []).length > 0 ? backendLeads : MOCK_LEADS;
  const leads = rawLeads.map((l: any) => {
    const isReal = typeof l.id === 'number';
    return {
      id: l.id.toString(),
      client_name: isReal ? l.contact_name : l.client_name,
      company: l.company,
      email: isReal ? l.contact_email : l.email,
      phone: isReal ? l.contact_phone : l.phone,
      service_interest: isReal ? 'Software Services' : l.service_interest,
      status: isReal ? mapBackendStatus(l.status) : (l.status as LeadStatus),
      notes: l.notes,
      created_at: isReal ? new Date(l.created_at).toISOString().split('T')[0] : l.created_at,
    };
  });

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter);

  const advanceLead = (leadId: string, currentStatus: LeadStatus) => {
    const next = NEXT_STATUS[currentStatus];
    if (!next) return;
    const labels: Record<LeadStatus, string> = {
      new: 'New',
      meeting_scheduled: 'Meeting Scheduled',
      proposal_sent: 'Proposal Sent',
      approved: 'Approved',
      rejected: 'Rejected',
    };
    Alert.alert(
      'Update Status',
      `Move this lead to "${labels[next]}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            if (leadId.startsWith('l')) {
              Alert.alert('Status Updated', 'Mock lead updated locally.');
            } else {
              await updateLead(parseInt(leadId, 10), { status: mapFrontendStatusToBackend(next) });
            }
          }
        },
      ]
    );
  };

  const rejectLead = (leadId: string) => {
    Alert.alert('Reject Lead', 'Mark this lead as rejected?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: async () => {
          if (leadId.startsWith('l')) {
            Alert.alert('Status Updated', 'Mock lead rejected locally.');
          } else {
            await updateLead(parseInt(leadId, 10), { status: 'lost' });
          }
        }
      },
    ]);
  };

  const statusVariantMap: Record<LeadStatus, any> = {
    new: 'lead_new',
    meeting_scheduled: 'lead_meeting',
    proposal_sent: 'lead_proposal',
    approved: 'lead_approved',
    rejected: 'lead_rejected',
  };

  const statusLabelMap: Record<LeadStatus, string> = {
    new: 'New',
    meeting_scheduled: 'Meeting Scheduled',
    proposal_sent: 'Proposal Sent',
    approved: 'Approved',
    rejected: 'Rejected',
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Leads"
        subtitle={`${leads.length} total leads`}
        rightAction={
          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add" size={20} color={Colors.white} />
          </TouchableOpacity>
        }
      />

      {/* Status Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All ({leads.length})
          </Text>
        </TouchableOpacity>
        {STATUS_COLUMNS.map((col) => {
          const count = leads.filter(l => l.status === col.status).length;
          return (
            <TouchableOpacity
              key={col.status}
              style={[styles.filterChip, filter === col.status && styles.filterChipActive]}
              onPress={() => setFilter(col.status)}
            >
              <Text style={[styles.filterText, filter === col.status && styles.filterTextActive]}>
                {col.label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Pipeline Summary */}
      <View style={styles.pipeline}>
        {STATUS_COLUMNS.map((col) => {
          const count = leads.filter(l => l.status === col.status).length;
          return (
            <View key={col.status} style={styles.pipelineItem}>
              <View style={[styles.pipelineDot, { backgroundColor: ({
                lead_new: Colors.info, lead_meeting: Colors.warning,
                lead_proposal: '#8B5CF6', lead_approved: Colors.success, lead_rejected: Colors.error
              } as Record<string, string>)[col.variant] }]} />
              <Text style={styles.pipelineCount}>{count}</Text>
              <Text style={styles.pipelineLabel}>{col.label}</Text>
            </View>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {filtered.map((lead) => (
          <Card key={lead.id} style={styles.leadCard}>
            <View style={styles.leadHeader}>
              <Avatar name={lead.client_name} size="md" />
              <View style={styles.leadInfo}>
                <Text style={styles.leadName}>{lead.client_name}</Text>
                <Text style={styles.leadCompany}>{lead.company}</Text>
              </View>
              <Badge
                label={statusLabelMap[lead.status]}
                variant={statusVariantMap[lead.status]}
                size="sm"
              />
            </View>

            <View style={styles.leadMeta}>
              <View style={styles.metaRow}>
                <Ionicons name="briefcase-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.metaText}>{lead.service_interest}</Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="mail-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.metaText}>{lead.email}</Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="call-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.metaText}>{lead.phone}</Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.metaText}>{lead.created_at}</Text>
              </View>
            </View>

            {lead.notes && (
              <View style={styles.notesBox}>
                <Text style={styles.notesText}>{lead.notes}</Text>
              </View>
            )}

            {/* Actions */}
            {lead.status !== 'approved' && lead.status !== 'rejected' && (
              <View style={styles.actionRow}>
                <Button
                  title="Reject"
                  variant="danger"
                  size="sm"
                  style={{ flex: 1 }}
                  onPress={() => rejectLead(lead.id)}
                />
                <Button
                  title={`→ ${statusLabelMap[NEXT_STATUS[lead.status]!]}`}
                  size="sm"
                  style={{ flex: 2 }}
                  onPress={() => advanceLead(lead.id, lead.status)}
                />
              </View>
            )}
          </Card>
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No leads in this stage</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.base, paddingBottom: 100 },
  addBtn: {
    width: 36, height: 36,
    backgroundColor: Colors.primary,
    borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  filterRow: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm },
  filterChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
    marginRight: Spacing.sm,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: Typography.size.xs, color: Colors.textSecondary, fontWeight: Typography.weight.medium },
  filterTextActive: { color: Colors.white },
  pipeline: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    gap: Spacing.sm,
  },
  pipelineItem: { flex: 1, alignItems: 'center', gap: 2 },
  pipelineDot: { width: 10, height: 10, borderRadius: 5 },
  pipelineCount: { fontSize: Typography.size.lg, fontWeight: Typography.weight.bold, color: Colors.textPrimary },
  pipelineLabel: { fontSize: 9, color: Colors.textMuted, textAlign: 'center' },
  leadCard: { marginBottom: Spacing.sm },
  leadHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  leadInfo: { flex: 1 },
  leadName: { fontSize: Typography.size.base, fontWeight: Typography.weight.semibold, color: Colors.textPrimary },
  leadCompany: { fontSize: Typography.size.sm, color: Colors.textSecondary, marginTop: 1 },
  leadMeta: { gap: 4, marginBottom: Spacing.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: Typography.size.xs, color: Colors.textSecondary },
  notesBox: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  notesText: { fontSize: Typography.size.xs, color: Colors.textSecondary, fontStyle: 'italic' },
  actionRow: { flexDirection: 'row', gap: Spacing.sm },
  empty: { alignItems: 'center', paddingVertical: Spacing['3xl'], gap: Spacing.base },
  emptyText: { fontSize: Typography.size.base, color: Colors.textMuted },
});
