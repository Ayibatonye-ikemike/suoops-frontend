"use client";

import { useState, useEffect, useCallback, ChangeEvent, KeyboardEvent } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Crown, UserMinus, Loader2, Plus, X, AlertTriangle } from "lucide-react";
import {
  getTeam,
  getTeamRole,
  createTeam,
  sendInvitation,
  revokeInvitation,
  removeMember,
} from "@/api/team";
import type { components } from "@/api/types";
import { hasPlanFeature, type PlanTier } from "@/constants/pricing";

type TeamWithMembersOut = components["schemas"]["TeamWithMembersOut"];
type UserTeamRole = components["schemas"]["UserTeamRole"];

interface TeamManagementSectionProps {
  userPlan: PlanTier;
}

// Simple toast implementation
function useSimpleToast() {
  const toast = (options: { title: string; description?: string; variant?: "default" | "destructive" }) => {
    // In a real implementation, this would show a toast notification
    // For now, we'll use console.log and alert for errors
    if (options.variant === "destructive") {
      console.error(`${options.title}: ${options.description}`);
    } else {
      console.log(`${options.title}: ${options.description}`);
    }
  };
  return { toast };
}

// Simple confirm dialog
function ConfirmDialog({
  title,
  description,
  onConfirm,
  children,
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <span onClick={() => setIsOpen(true)}>{children}</span>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  onConfirm();
                  setIsOpen(false);
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function TeamManagementSection({ userPlan }: TeamManagementSectionProps) {
  const { toast } = useSimpleToast();
  const [loading, setLoading] = useState(true);
  const [teamRole, setTeamRole] = useState<UserTeamRole | null>(null);
  const [team, setTeam] = useState<TeamWithMembersOut | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [creating, setCreating] = useState(false);

  const hasTeamFeature = hasPlanFeature(userPlan, "TEAM_MANAGEMENT");

  const loadTeamData = useCallback(async () => {
    try {
      setLoading(true);
      const [roleData, teamData] = await Promise.all([
        getTeamRole(),
        hasTeamFeature ? getTeam() : Promise.resolve(null),
      ]);
      setTeamRole(roleData);
      setTeam(teamData);
    } catch (error) {
      console.error("Failed to load team data:", error);
    } finally {
      setLoading(false);
    }
  }, [hasTeamFeature]);

  useEffect(() => {
    loadTeamData();
  }, [loadTeamData]);

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a team name",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreating(true);
      await createTeam(teamName);
      toast({
        title: "Team created",
        description: "Your team has been created successfully",
      });
      await loadTeamData();
      setTeamName("");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create team";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setInviting(true);
      await sendInvitation(inviteEmail);
      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${inviteEmail}`,
      });
      await loadTeamData();
      setInviteEmail("");
    } catch (error: unknown) {
      const errorData = (error as { response?: { data?: { detail?: string | { message?: string } } } })?.response?.data;
      const message = typeof errorData?.detail === "string" 
        ? errorData.detail 
        : (errorData?.detail as { message?: string })?.message || "Failed to send invitation";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setInviting(false);
    }
  };

  const handleRevokeInvitation = async (invitationId: number) => {
    try {
      await revokeInvitation(invitationId);
      toast({
        title: "Invitation revoked",
        description: "The invitation has been cancelled",
      });
      await loadTeamData();
    } catch {
      toast({
        title: "Error",
        description: "Failed to revoke invitation",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (userId: number, userName: string) => {
    try {
      await removeMember(userId);
      toast({
        title: "Member removed",
        description: `${userName} has been removed from the team`,
      });
      await loadTeamData();
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  if (!hasTeamFeature) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Management
          </h3>
          <p className="text-sm text-gray-600">
            Invite team members to collaborate on your account
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-2">Team Management requires Pro plan or higher</p>
            <p className="text-sm">Upgrade to invite up to 3 team members</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Management
          </h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // If user is a member (not admin), show limited view
  if (teamRole && !teamRole.is_admin && teamRole.has_team) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team
          </h3>
          <p className="text-sm text-gray-600">
            You are a member of this team
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Badge className="mb-2">Team Member</Badge>
            <p className="text-sm text-gray-500 mt-2">
              Contact your team admin to manage team settings
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no team exists yet, show creation form
  if (!team) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Management
          </h3>
          <p className="text-sm text-gray-600">
            Create a team to invite up to 3 members to collaborate
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="teamName" className="block text-sm font-medium">
                Team Name
              </label>
              <input
                id="teamName"
                type="text"
                placeholder="Enter your team or business name"
                value={teamName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTeamName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-jade focus:border-transparent"
              />
            </div>
            <Button onClick={handleCreateTeam} disabled={creating}>
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Team
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Management
        </h3>
        <p className="text-sm text-gray-600">
          {team.team.name} • {team.members.length} of {team.team.max_members} members
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Admin Section */}
        <div>
          <h4 className="text-sm font-medium mb-3">Admin (You)</h4>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-jade/10">
              <Crown className="h-4 w-4 text-brand-jade" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{team.admin.user_name}</p>
              <p className="text-sm text-gray-500">{team.admin.user_email}</p>
            </div>
            <Badge variant="success">Admin</Badge>
          </div>
        </div>

        {/* Team Members */}
        {team.members.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Team Members</h4>
            <div className="space-y-2">
              {team.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
                    <Users className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{member.user_name}</p>
                    <p className="text-sm text-gray-500">{member.user_email}</p>
                  </div>
                  <ConfirmDialog
                    title="Remove team member?"
                    description={`Are you sure you want to remove ${member.user_name} from the team? They will lose access to your account.`}
                    onConfirm={() => handleRemoveMember(member.user_id, member.user_name)}
                  >
                    <Button variant="ghost" size="sm">
                      <UserMinus className="h-4 w-4 text-red-500" />
                    </Button>
                  </ConfirmDialog>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Invitations */}
        {team.pending_invitations.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Pending Invitations</h4>
            <div className="space-y-2">
              {team.pending_invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center gap-3 p-3 border border-dashed border-gray-300 rounded-lg"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                    <Mail className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{invitation.email}</p>
                    <p className="text-sm text-gray-500">
                      Expires {new Date(invitation.expires_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="warning">Pending</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevokeInvitation(invitation.id)}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Invite Form */}
        {team.can_invite && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium mb-3">Invite New Member</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInviteEmail(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    handleInvite();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-jade focus:border-transparent"
              />
              <Button onClick={handleInvite} disabled={inviting}>
                {inviting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Invite
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {team.team.max_members - team.members.length - team.pending_invitations.length} invitation(s) remaining
            </p>
          </div>
        )}

        {!team.can_invite && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-500 justify-center">
              <AlertTriangle className="h-4 w-4" />
              <span>Team is at maximum capacity ({team.team.max_members} members)</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
