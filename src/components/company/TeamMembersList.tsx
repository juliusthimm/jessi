
import { Button } from "@/components/ui/button";
import { Shield, UserCheck, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { CompanyRole } from "@/types/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: string;
  user_id: string;
  role: CompanyRole;
  profiles: {
    username?: string;
  } | null;
}

interface TeamMembersListProps {
  members: TeamMember[];
  currentUserRole?: CompanyRole;
}

export const TeamMembersList = ({ members, currentUserRole }: TeamMembersListProps) => {
  const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleRoleChange = async (memberId: string, newRole: CompanyRole) => {
    if (currentUserRole !== 'admin') {
      toast({
        title: "Unauthorized",
        description: "Only admins can manage roles",
        variant: "destructive",
      });
      return;
    }

    setUpdatingMemberId(memberId);
    try {
      const { error } = await supabase
        .from('company_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) {
        throw error;
      }

      toast({
        title: "Role updated",
        description: "Member's role has been successfully updated.",
      });

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update member's role",
        variant: "destructive",
      });
    } finally {
      setUpdatingMemberId(null);
    }
  };

  // Sort members to put current user first
  const sortedMembers = [...members].sort((a, b) => {
    if (a.user_id === currentUserId) return -1;
    if (b.user_id === currentUserId) return 1;
    return 0;
  });

  return (
    <div className="glass-card p-6 max-w-3xl mx-auto w-full">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Users className="h-5 w-5" />
        Team Members
      </h2>
      <div className="space-y-4">
        {sortedMembers.map((member) => {
          const isCurrentUser = member.user_id === currentUserId;
          return (
            <div
              key={member.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                isCurrentUser 
                  ? "bg-pulse-500/50 border border-pulse-400/50" 
                  : "bg-pulse-600/50"
              }`}
            >
              <div className="flex items-center gap-2">
                {isCurrentUser && <UserCheck className="h-4 w-4 text-pulse-300" />}
                <div>
                  <p className="font-medium">
                    {member.profiles?.username || 'Anonymous User'}
                    {isCurrentUser && " (You)"}
                  </p>
                  <p className="text-sm text-pulse-300">{member.role}</p>
                </div>
              </div>
              {member.role !== 'admin' && currentUserRole === 'admin' && (
                <Select
                  defaultValue={member.role}
                  onValueChange={(value: CompanyRole) => handleRoleChange(member.id, value)}
                  disabled={updatingMemberId === member.id}
                >
                  <SelectTrigger 
                    className="w-[140px] bg-pulse-700/50 border-white/10 text-pulse-100 hover:bg-pulse-600"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-pulse-700 border-white/10">
                    <SelectItem 
                      value="hr" 
                      className="text-pulse-100 focus:bg-pulse-600 focus:text-pulse-100"
                    >
                      HR
                    </SelectItem>
                    <SelectItem 
                      value="employee"
                      className="text-pulse-100 focus:bg-pulse-600 focus:text-pulse-100"
                    >
                      Employee
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
