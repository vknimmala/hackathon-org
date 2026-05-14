export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "participant" | "volunteer" | "mentor" | "admin";
export type Organization = "surgevector" | "taxilla";
export type RegistrationStatus = "draft" | "submitted" | "approved" | "rejected";
export type MentorAssignmentStatus = "active" | "reassigned" | "removed";
export type VolunteerStatus = "submitted" | "approved" | "waitlisted" | "declined";
export type AuditAction =
  | "created"
  | "updated"
  | "deleted"
  | "submitted"
  | "approved"
  | "rejected"
  | "assigned"
  | "reassigned";

export interface Database {
  public: {
    Tables: {
      sv_audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          entity_table: string;
          entity_id: string;
          action: AuditAction;
          before_state: Json | null;
          after_state: Json | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          entity_table: string;
          entity_id: string;
          action: AuditAction;
          before_state?: Json | null;
          after_state?: Json | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sv_audit_logs"]["Insert"]>;
        Relationships: [];
      };
      sv_idea_submissions: {
        Row: {
          id: string;
          participant_user_id: string | null;
          participant_full_name: string;
          participant_email: string;
          organization: Organization;
          department: string;
          idea_title: string;
          problem_statement: string;
          proposed_solution: string;
          ai_usage: string;
          status: RegistrationStatus;
          submitted_at: string;
          reviewed_by: string | null;
          reviewed_at: string | null;
          review_notes: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          participant_user_id?: string | null;
          participant_full_name: string;
          participant_email: string;
          organization: Organization;
          department: string;
          idea_title: string;
          problem_statement: string;
          proposed_solution: string;
          ai_usage: string;
          status?: RegistrationStatus;
          submitted_at?: string;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          review_notes?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["sv_idea_submissions"]["Insert"]
        >;
        Relationships: [];
      };
      sv_team_members: {
        Row: {
          id: string;
          team_id: string;
          full_name: string;
          email: string;
          role: string;
          is_primary_contact: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          team_id: string;
          full_name: string;
          email: string;
          role: string;
          is_primary_contact?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["sv_team_members"]["Insert"]>;
        Relationships: [];
      };
      sv_teams: {
        Row: {
          id: string;
          name: string;
          organization: Organization;
          theme_id: string | null;
          idea_submission_id: string | null;
          project_summary: string | null;
          status: RegistrationStatus;
          submitted_by: string | null;
          mentor_id: string | null;
          participation_points: number;
          created_at: string;
          updated_at: string;
          submitted_at: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          organization: Organization;
          theme_id?: string | null;
          idea_submission_id?: string | null;
          project_summary?: string | null;
          status?: RegistrationStatus;
          submitted_by?: string | null;
          mentor_id?: string | null;
          participation_points?: number;
          created_at?: string;
          updated_at?: string;
          submitted_at?: string | null;
          deleted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["sv_teams"]["Insert"]>;
        Relationships: [];
      };
      sv_mentors: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          email: string;
          expertise: string[];
          capacity: number;
          current_team_count: number;
          is_available: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name: string;
          email: string;
          expertise?: string[];
          capacity?: number;
          current_team_count?: number;
          is_available?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["sv_mentors"]["Insert"]>;
        Relationships: [];
      };
      sv_achievements: {
        Row: {
          id: string;
          code: string;
          name: string;
          description: string | null;
          points: number;
          badge_icon: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          description?: string | null;
          points?: number;
          badge_icon?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["sv_achievements"]["Insert"]>;
        Relationships: [];
      };
      sv_leaderboard_entries: {
        Row: {
          id: string;
          team_id: string;
          total_points: number;
          badges: Json;
          completion_progress: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          team_id: string;
          total_points?: number;
          badges?: Json;
          completion_progress?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["sv_leaderboard_entries"]["Insert"]
        >;
        Relationships: [];
      };
      sv_volunteer_registrations: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          email: string;
          department: string;
          preferred_roles: string[];
          availability_notes: string | null;
          status: VolunteerStatus;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name: string;
          email: string;
          department: string;
          preferred_roles?: string[];
          availability_notes?: string | null;
          status?: VolunteerStatus;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["sv_volunteer_registrations"]["Insert"]
        >;
        Relationships: [];
      };
      sv_users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["sv_users"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
