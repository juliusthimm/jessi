
import { Button } from "@/components/ui/button";
import { Shield, Users } from "lucide-react";

interface TeamMember {
  id: string;
  user_id: string;
  role: 'admin' | 'hr' | 'employee';
  profiles: {
    username?: string;
  } | null;
}

interface TeamMembersListProps {
  members: TeamMember[];
}

export const TeamMembersList = ({ members }: TeamMembersListProps) => {
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
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-pulse-500/50"
              >
                <Shield className="h-4 w-4 mr-2" />
                Manage Role
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
