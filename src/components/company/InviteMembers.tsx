
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface InviteMembersProps {
  companyId: string;
  companyName: string;
}

export const InviteMembers = ({ companyId, companyName }: InviteMembersProps) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const { toast } = useToast();

  const handleInvite = async () => {
    try {
      setInviting(true);

      // Generate invite token
      const inviteToken = crypto.randomUUID();
      
      // Create invite record in database
      const { error: inviteError } = await supabase
        .from('company_invites')
        .insert([{
          company_id: companyId,
          email: inviteEmail,
          token: inviteToken,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        }]);

      if (inviteError) throw inviteError;

      // Generate invite link
      const inviteLink = `${window.location.origin}/auth?invite=${inviteToken}`;

      // Send invite email
      const { error: emailError } = await supabase.functions.invoke('send-invite-email', {
        body: {
          email: inviteEmail,
          companyName,
          inviteLink,
        },
      });

      if (emailError) throw emailError;

      toast({
        title: "Invite sent",
        description: `Invitation sent to ${inviteEmail}`,
      });
      setInviteEmail("");
    } catch (error: any) {
      console.error("Invite error:", error);
      toast({
        title: "Error",
        description: "Failed to send invite",
        variant: "destructive",
      });
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="bg-pulse-700/50 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <UserPlus className="h-5 w-5" />
        Invite Team Members
      </h2>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter email address"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="bg-white/10 border-white/20"
          />
          <Button
            onClick={handleInvite}
            disabled={inviting || !inviteEmail}
            className="bg-pulse-600 hover:bg-pulse-500"
          >
            <Mail className="h-4 w-4 mr-2" />
            {inviting ? "Sending..." : "Send Invite"}
          </Button>
        </div>
      </div>
    </div>
  );
};
