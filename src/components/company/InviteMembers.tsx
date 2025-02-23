import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, RefreshCw, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
interface InviteMembersProps {
  companyId: string;
  companyName: string;
}
interface PendingInvite {
  id: string;
  email: string;
  created_at: string;
  status: 'pending' | 'accepted' | 'expired';
}
export const InviteMembers = ({
  companyId,
  companyName
}: InviteMembersProps) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const {
    toast
  } = useToast();
  useEffect(() => {
    fetchPendingInvites();
  }, [companyId]);
  const fetchPendingInvites = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('company_invites').select('id, email, created_at, status').eq('company_id', companyId).eq('status', 'pending').gte('expires_at', new Date().toISOString());
      if (error) throw error;
      setPendingInvites(data || []);
    } catch (error) {
      console.error('Error fetching pending invites:', error);
    }
  };
  const handleInvite = async () => {
    try {
      setInviting(true);

      // Generate invite token
      const inviteToken = crypto.randomUUID();

      // Create invite record in database
      const {
        error: inviteError
      } = await supabase.from('company_invites').insert([{
        company_id: companyId,
        email: inviteEmail,
        token: inviteToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        // 7 days
        status: 'pending'
      }]);
      if (inviteError) throw inviteError;

      // Generate invite link
      const inviteLink = `${window.location.origin}/auth?invite=${inviteToken}`;

      // Send invite email
      const {
        error: emailError
      } = await supabase.functions.invoke('send-invite-email', {
        body: {
          email: inviteEmail,
          companyName,
          inviteLink
        }
      });
      if (emailError) throw emailError;
      toast({
        title: "Invite sent",
        description: `Invitation sent to ${inviteEmail}`
      });
      setInviteEmail("");
      fetchPendingInvites(); // Refresh the list
    } catch (error: any) {
      console.error("Invite error:", error);
      toast({
        title: "Error",
        description: "Failed to send invite",
        variant: "destructive"
      });
    } finally {
      setInviting(false);
    }
  };
  const handleResend = async (inviteId: string, email: string) => {
    try {
      setResendingId(inviteId);

      // Generate new invite token
      const inviteToken = crypto.randomUUID();

      // Update invite record with new token and expiry
      const {
        error: updateError
      } = await supabase.from('company_invites').update({
        token: inviteToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      }).eq('id', inviteId);
      if (updateError) throw updateError;

      // Generate invite link
      const inviteLink = `${window.location.origin}/auth?invite=${inviteToken}`;

      // Resend invite email
      const {
        error: emailError
      } = await supabase.functions.invoke('send-invite-email', {
        body: {
          email,
          companyName,
          inviteLink
        }
      });
      if (emailError) throw emailError;
      toast({
        title: "Invite resent",
        description: `Invitation resent to ${email}`
      });
    } catch (error: any) {
      console.error("Resend error:", error);
      toast({
        title: "Error",
        description: "Failed to resend invite",
        variant: "destructive"
      });
    } finally {
      setResendingId(null);
    }
  };
  return <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <UserPlus className="h-5 w-5" />
        Invite Team Members
      </h2>
      <div className="space-y-6">
        <div className="flex gap-2">
          <Input type="email" placeholder="Enter email address" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="bg-white/10 border-white/20" />
          <Button onClick={handleInvite} disabled={inviting || !inviteEmail} className="bg-pulse-600 hover:bg-pulse-500">
            <Mail className="h-4 w-4 mr-2" />
            {inviting ? "Sending..." : "Send Invite"}
          </Button>
        </div>

        {pendingInvites.length > 0 && <div className="space-y-3">
            <h3 className="text-sm font-medium text-pulse-200">Pending Invites</h3>
            <div className="space-y-2">
              {pendingInvites.map(invite => <div key={invite.id} className="flex items-center justify-between p-2 bg-pulse-600/30 rounded">
                  <span className="text-sm text-pulse-100">{invite.email}</span>
                  <Button size="sm" onClick={() => handleResend(invite.id, invite.email)} disabled={resendingId === invite.id} className="bg-pulse-600 hover:bg-pulse-500">
                    <RefreshCw className={`h-4 w-4 mr-2 ${resendingId === invite.id ? 'animate-spin' : ''}`} />
                    Resend
                  </Button>
                </div>)}
            </div>
          </div>}
      </div>
    </div>;
};