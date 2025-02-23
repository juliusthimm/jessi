
import { Button } from "@/components/ui/button";
import { Shield, Users } from "lucide-react";
import { useState } from "react";
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
}

export const TeamMembersList = ({ members }: TeamMembersListProps) => {
  const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRoleChange = async (memberId: string, newRole: CompanyRole) => {
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

  return (
    <div className="bg-pulse-700/50 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Users className="h-5 w-5" />
        Team Members
      </h2>
      <div className="space-y-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 bg-pulse-600/50 rounded"
          >
            <div>
              <p className="font-medium">{member.profiles?.username || 'Anonymous User'}</p>
              <p className="text-sm text-pulse-300">{member.role}</p>
            </div>
            {member.role !== 'admin' && (
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
        ))}
      </div>
    </div>
  );
};
