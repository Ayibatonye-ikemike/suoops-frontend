/**
 * Team management API client
 */
import { apiClient } from "./client";
import type { components } from "./types";

type TeamWithMembersOut = components["schemas"]["TeamWithMembersOut"];
type TeamOut = components["schemas"]["TeamOut"];
type UserTeamRole = components["schemas"]["UserTeamRole"];
type InvitationOut = components["schemas"]["InvitationOut"];
type InvitationValidation = components["schemas"]["InvitationValidation"];
type TeamMemberOut = components["schemas"]["TeamMemberOut"];

/**
 * Get current user's team role (admin/member status)
 */
export async function getTeamRole(): Promise<UserTeamRole> {
  const response = await apiClient.get<UserTeamRole>("/team/role");
  return response.data;
}

/**
 * Get team details including members and invitations
 */
export async function getTeam(): Promise<TeamWithMembersOut | null> {
  const response = await apiClient.get<TeamWithMembersOut | null>("/team");
  return response.data;
}

/**
 * Create a new team (makes user the admin)
 */
export async function createTeam(name: string): Promise<TeamOut> {
  const response = await apiClient.post<TeamOut>("/team", { name });
  return response.data;
}

/**
 * Update team settings
 */
export async function updateTeam(name: string): Promise<TeamOut> {
  const response = await apiClient.patch<TeamOut>("/team", { name });
  return response.data;
}

/**
 * Send invitation to email
 */
export async function sendInvitation(email: string): Promise<InvitationOut> {
  const response = await apiClient.post<InvitationOut>("/team/invitations", { email });
  return response.data;
}

/**
 * Revoke a pending invitation
 */
export async function revokeInvitation(invitationId: number): Promise<InvitationOut> {
  const response = await apiClient.delete<InvitationOut>(`/team/invitations/${invitationId}`);
  return response.data;
}

/**
 * Validate an invitation token (public - for preview)
 */
export async function validateInvitation(token: string): Promise<InvitationValidation> {
  const response = await apiClient.get<InvitationValidation>("/team/invitations/validate", {
    params: { token },
  });
  return response.data;
}

/**
 * Accept an invitation and join the team
 */
export async function acceptInvitation(token: string): Promise<TeamMemberOut> {
  const response = await apiClient.post<TeamMemberOut>("/team/invitations/accept", { token });
  return response.data;
}

/**
 * Remove a member from the team (admin only)
 */
export async function removeMember(userId: number): Promise<{ detail: string }> {
  const response = await apiClient.delete<{ detail: string }>(`/team/members/${userId}`);
  return response.data;
}

/**
 * Leave the current team (member only)
 */
export async function leaveTeam(): Promise<{ detail: string }> {
  const response = await apiClient.post<{ detail: string }>("/team/leave");
  return response.data;
}
