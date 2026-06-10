/**
 * INTEGRATION EXAMPLES
 * 
 * This file shows how to integrate API calls into your React Native screens.
 * Replace the mock data imports with API service calls using the stores.
 */

// ─── BEFORE (Using Mock Data) ────────────────────────────────────
// import { MOCK_PROJECTS, MOCK_LEADS, MOCK_EMPLOYEES } from '@/src/data/mockData';
// 
// export function DashboardScreen() {
//   return (
//     <View>
//       <ProjectList projects={MOCK_PROJECTS} />
//       <LeadList leads={MOCK_LEADS} />
//     </View>
//   );
// }

// ─── AFTER (Using API) ───────────────────────────────────────────

import { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import { useProjectStore } from '@/store/projectStore';
import { useLeadStore } from '@/store/leadStore';
import { useEmployeeStore } from '@/store/employeeStore';
import { useMeetingStore } from '@/store/meetingStore';
import { useDailyUpdateStore } from '@/store/dailyUpdateStore';

// Example 1: Dashboard Screen
export function DashboardScreenExample() {
  const { projects, isLoading: projectsLoading, fetchProjects } = useProjectStore();
  const { leads, isLoading: leadsLoading, fetchLeads } = useLeadStore();

  useEffect(() => {
    fetchProjects();
    fetchLeads();
  }, []);

  if (projectsLoading || leadsLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
        Projects ({projects.length})
      </Text>
      <FlatList
        data={projects}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderRadius: 8, marginBottom: 8, backgroundColor: '#f0f0f0' }}>
            <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
            <Text>{item.status}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
      />

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 16 }}>
        Active Leads ({leads.length})
      </Text>
      <FlatList
        data={leads}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderRadius: 8, marginBottom: 8, backgroundColor: '#f0f0f0' }}>
            <Text style={{ fontWeight: 'bold' }}>{item.company}</Text>
            <Text>{item.status}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
      />
    </View>
  );
}

// Example 2: Projects Screen
export function ProjectsScreenExample() {
  const { projects, isLoading, fetchProjects, createProject, updateProject, deleteProject } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    const newProject = await createProject({
      title: 'New Project',
      description: 'Description',
      status: 'planning',
      client_id: 1,
    });
    if (newProject) {
      console.log('Project created:', newProject);
    }
  };

  const handleUpdateProject = async (id: number) => {
    const updated = await updateProject(id, {
      status: 'in_progress',
    });
    if (updated) {
      console.log('Project updated:', updated);
    }
  };

  const handleDeleteProject = async (id: number) => {
    await deleteProject(id);
    console.log('Project deleted');
  };

  if (isLoading) return <ActivityIndicator size="large" />;

  return (
    <FlatList
      data={projects}
      renderItem={({ item }) => (
        <View style={{ padding: 12, borderRadius: 8, marginBottom: 8, backgroundColor: '#f0f0f0' }}>
          <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
          <Text>{item.description}</Text>
          <Text>Status: {item.status}</Text>
          {/* Add buttons for update/delete */}
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}

// Example 3: Employees Screen
export function EmployeesScreenExample() {
  const { employees, isLoading, fetchEmployees } = useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, []);

  if (isLoading) return <ActivityIndicator size="large" />;

  return (
    <FlatList
      data={employees}
      renderItem={({ item }) => (
        <View style={{ padding: 12, borderRadius: 8, marginBottom: 8, backgroundColor: '#f0f0f0' }}>
          <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
          <Text>{item.designation}</Text>
          <Text>{item.department}</Text>
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}

// Example 4: Leads Screen
export function LeadsScreenExample() {
  const { leads, isLoading, fetchLeads, updateLead } = useLeadStore();

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    await updateLead(leadId, { status: newStatus as any });
  };

  if (isLoading) return <ActivityIndicator size="large" />;

  return (
    <FlatList
      data={leads}
      renderItem={({ item }) => (
        <View style={{ padding: 12, borderRadius: 8, marginBottom: 8, backgroundColor: '#f0f0f0' }}>
          <Text style={{ fontWeight: 'bold' }}>{item.company}</Text>
          <Text>{item.contact_name}</Text>
          <Text>{item.contact_email}</Text>
          <Text>Status: {item.status}</Text>
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}

// Example 5: Meetings Screen
export function MeetingsScreenExample() {
  const { meetings, isLoading, fetchMeetings } = useMeetingStore();

  useEffect(() => {
    fetchMeetings();
  }, []);

  if (isLoading) return <ActivityIndicator size="large" />;

  return (
    <FlatList
      data={meetings}
      renderItem={({ item }) => (
        <View style={{ padding: 12, borderRadius: 8, marginBottom: 8, backgroundColor: '#f0f0f0' }}>
          <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
          <Text>{item.date}</Text>
          <Text>{item.description}</Text>
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}

// Example 6: Daily Updates Screen
export function DailyUpdatesScreenExample() {
  const { updates, isLoading, fetchDailyUpdates, createDailyUpdate } = useDailyUpdateStore();

  useEffect(() => {
    fetchDailyUpdates();
  }, []);

  const handleSubmitUpdate = async () => {
    const newUpdate = await createDailyUpdate({
      content: 'Completed task X, working on Y',
      employee_id: 1,
    });
    if (newUpdate) {
      console.log('Daily update submitted:', newUpdate);
    }
  };

  if (isLoading) return <ActivityIndicator size="large" />;

  return (
    <FlatList
      data={updates}
      renderItem={({ item }) => (
        <View style={{ padding: 12, borderRadius: 8, marginBottom: 8, backgroundColor: '#f0f0f0' }}>
          <Text style={{ fontWeight: 'bold' }}>Date: {item.date}</Text>
          <Text>{item.content}</Text>
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}

/**
 * KEY POINTS:
 * 
 * 1. Import the store you need: useProjectStore, useLeadStore, etc.
 * 2. Call fetchX() in useEffect to load data when component mounts
 * 3. Use isLoading to show loading state
 * 4. Use error state to show error messages
 * 5. Call create/update/delete functions for mutations
 * 6. Data is automatically updated in the store
 * 
 * AUTHENTICATION:
 * - Token is automatically included in all requests
 * - Token is stored in AsyncStorage after login
 * - Token is cleared on logout
 * - 401 errors redirect to login
 */
