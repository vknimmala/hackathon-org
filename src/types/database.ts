export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Organization = "surgevector" | "taxila";
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
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "participant" | "volunteer" | "mentor" | "admin";
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "participant" | "volunteer" | "mentor" | "admin";
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
