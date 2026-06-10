// ─── User & Auth ───────────────────────────────────────────────
// Must match backend UserRole enum exactly: admin | employee | client
export type UserRole =
  | 'client'
  | 'admin'
  | 'employee';

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  skills?: string[];
  experience_years?: number;
  availability: 'available' | 'on_project' | 'on_leave';
  project_assigned?: string;
}

// ─── Client ───────────────────────────────────────────────────
export interface Client {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  user_id: string;
}

// ─── Lead ─────────────────────────────────────────────────────
export type LeadStatus =
  | 'new'
  | 'meeting_scheduled'
  | 'proposal_sent'
  | 'approved'
  | 'rejected';

export interface Lead {
  id: string;
  client_name: string;
  company: string;
  email: string;
  phone: string;
  service_interest: string;
  status: LeadStatus;
  created_at: string;
  notes?: string;
}

// ─── Project ──────────────────────────────────────────────────
export type ProjectStatus =
  | 'requirement_analysis'
  | 'design'
  | 'development'
  | 'testing'
  | 'deployment'
  | 'completed';

export type ProjectType =
  | 'web_development'
  | 'mobile_app'
  | 'iot'
  | 'cloud'
  | 'cybersecurity'
  | 'hardware'
  | 'custom';

export interface Project {
  id: string;
  client_id: string;
  client_name: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  budget: string;
  timeline: string;
  requirements: string;
  reference_links?: string[];
  created_at: string;
  team_members?: TeamMember[];
  progress: number; // 0-100
}

export interface TeamMember {
  user_id: string;
  name: string;
  role: string;
  avatar?: string;
}

// ─── Milestone ────────────────────────────────────────────────
export type MilestoneStatus = 'completed' | 'active' | 'pending';

export interface Milestone {
  id: string;
  name: string;
  status: MilestoneStatus;
  description?: string;
}

// ─── Meeting ──────────────────────────────────────────────────
export type MeetingStatus = 'upcoming' | 'completed' | 'cancelled';
export type MeetingPlatform = 'google_meet' | 'zoom' | 'in_person';

export interface Meeting {
  id: string;
  project_id?: string;
  client_name: string;
  date: string;
  time: string;
  platform: MeetingPlatform;
  status: MeetingStatus;
  agenda?: string;
  link?: string;
}

// ─── Daily Update ─────────────────────────────────────────────
export interface DailyUpdate {
  id: string;
  project_id: string;
  project_name: string;
  user_id: string;
  user_name: string;
  user_role: string;
  today_work: string;
  blockers: string;
  tomorrow_plan: string;
  date: string;
}

// ─── File ─────────────────────────────────────────────────────
export interface ProjectFile {
  id: string;
  project_id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  uploaded_by: string;
  uploaded_at: string;
}

// ─── Feedback ─────────────────────────────────────────────────
export type FeedbackStatus = 'pending' | 'approved' | 'changes_requested';

export interface Feedback {
  id: string;
  project_id: string;
  comment: string;
  status: FeedbackStatus;
  created_at: string;
}

// ─── Requirement Form ─────────────────────────────────────────
export interface RequirementForm {
  project_name: string;
  project_type: ProjectType;
  budget: string;
  timeline: string;
  requirements: string;
  reference_links: string;
}

// ─── Stats ────────────────────────────────────────────────────
export interface DashboardStats {
  total_projects: number;
  active_projects: number;
  new_leads: number;
  team_utilization: number;
}
