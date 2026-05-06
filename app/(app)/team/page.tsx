// v1.11 — Team management: invite, roles, seat counter
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Home, Users, UserPlus, Trash2, Loader2, Crown, Shield } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

interface TeamMember {
  user_id: string;
  role: string;
  created_at: string;
  user_email?: string;
}

interface Team {
  id: string;
  name: string;
  owner_id: string;
  plan: string;
  seat_limit: number;
}

export default function TeamPage() {
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [userPlan, setUserPlan] = useState("trial");

  const supabase = createClient();

  const fetchTeam = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get user plan
    const { data: dbUser } = await supabase
      .from("users")
      .select("plan")
      .eq("id", user.id)
      .single();
    setUserPlan(dbUser?.plan || "trial");

    // Find team membership
    const { data: membership } = await supabase
      .from("team_members")
      .select("team_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (membership) {
      const { data: teamData } = await supabase
        .from("teams")
        .select("*")
        .eq("id", membership.team_id)
        .single();

      if (teamData) {
        setTeam(teamData as Team);

        // Get members with emails
        const { data: memberData } = await supabase
          .from("team_members")
          .select("user_id, role, created_at")
          .eq("team_id", teamData.id);

        if (memberData) {
          // Fetch emails for each member
          const membersWithEmail = await Promise.all(
            memberData.map(async (m) => {
              const { data: u } = await supabase
                .from("users")
                .select("email")
                .eq("id", m.user_id)
                .single();
              return { ...m, user_email: u?.email || "Unknown" };
            })
          );
          setMembers(membersWithEmail);
        }
      }
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      toast.error("Enter a team name");
      return;
    }
    setCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: newTeam, error } = await supabase
      .from("teams")
      .insert({
        name: teamName.trim(),
        owner_id: user.id,
        plan: userPlan,
        seat_limit: userPlan === "brokerage" ? 25 : 5,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create team");
    } else if (newTeam) {
      // Add owner as member
      await supabase.from("team_members").insert({
        team_id: newTeam.id,
        user_id: user.id,
        role: "owner",
      });
      toast.success("Team created!");
      fetchTeam();
    }
    setCreating(false);
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !team) return;
    if (members.length >= team.seat_limit) {
      toast.error(`Seat limit reached (${team.seat_limit})`);
      return;
    }
    setInviting(true);

    // Check if user exists
    const { data: invitedUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", inviteEmail.trim())
      .single();

    if (!invitedUser) {
      toast.error("User not found. They need to sign up first.");
      setInviting(false);
      return;
    }

    // Check not already a member
    const existing = members.find((m) => m.user_id === invitedUser.id);
    if (existing) {
      toast.error("Already a team member");
      setInviting(false);
      return;
    }

    const { error } = await supabase.from("team_members").insert({
      team_id: team.id,
      user_id: invitedUser.id,
      role: "member",
    });

    if (error) {
      toast.error("Failed to add member");
    } else {
      toast.success(`${inviteEmail} added to team`);
      setInviteEmail("");
      fetchTeam();
    }
    setInviting(false);
  };

  const handleRemove = async (userId: string) => {
    if (!team) return;
    if (userId === team.owner_id) {
      toast.error("Cannot remove the team owner");
      return;
    }

    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("team_id", team.id)
      .eq("user_id", userId);

    if (error) {
      toast.error("Failed to remove member");
    } else {
      toast.success("Member removed");
      fetchTeam();
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!team) return;
    const { error } = await supabase
      .from("team_members")
      .update({ role: newRole })
      .eq("team_id", team.id)
      .eq("user_id", userId);

    if (error) {
      toast.error("Failed to update role");
    } else {
      toast.success("Role updated");
      fetchTeam();
    }
  };

  const canManageTeam = !["trial", "solo"].includes(userPlan);

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="bg-card border-b-4 border-blue-500 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/generate" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                <Home className="text-white w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-blue-800">Team</h1>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          </div>
        ) : !canManageTeam ? (
          <Card className="p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground/70 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Teams require a Team or Brokerage plan</h2>
            <p className="text-muted-foreground mb-6">Upgrade to invite team members and share listings.</p>
            <Link href="/pricing">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">View Plans</Button>
            </Link>
          </Card>
        ) : !team ? (
          <Card className="p-8">
            <h2 className="text-xl font-bold mb-4">Create your team</h2>
            <div className="flex gap-3">
              <Input
                placeholder="Team or brokerage name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <Button onClick={handleCreateTeam} disabled={creating} className="bg-blue-600 hover:bg-blue-700 text-white">
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Team"}
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Team info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">{team.name}</h2>
                  <Badge variant="secondary">
                    {members.length} / {team.seat_limit} seats
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Invite */}
            <Card>
              <CardContent className="pt-6">
                <Label className="text-sm font-medium">Invite a team member</Label>
                <div className="flex gap-3 mt-2">
                  <Input
                    type="email"
                    placeholder="agent@email.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                  <Button onClick={handleInvite} disabled={inviting} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserPlus className="w-4 h-4 mr-1" /> Invite</>}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">User must have a ListEze account first.</p>
              </CardContent>
            </Card>

            {/* Members */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Members</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {members.map((m) => (
                    <div key={m.user_id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-3">
                        {m.role === "owner" ? (
                          <Crown className="w-4 h-4 text-amber-500" />
                        ) : m.role === "admin" ? (
                          <Shield className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Users className="w-4 h-4 text-muted-foreground/70" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{m.user_email}</p>
                          <p className="text-xs text-muted-foreground capitalize">{m.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {m.role !== "owner" && (
                          <>
                            <Select
                              value={m.role}
                              onValueChange={(v) => handleRoleChange(m.user_id, v ?? m.role)}
                            >
                              <SelectTrigger className="w-[100px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="member">Member</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemove(m.user_id)}
                              className="text-red-500 hover:text-red-700 h-8"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
