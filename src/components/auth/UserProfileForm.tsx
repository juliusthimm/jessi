
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserMode } from "@/types/auth";

export const UserProfileForm = () => {
  const [username, setUsername] = useState<string>("");
  const [mode, setMode] = useState<UserMode>("personal");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('username, mode')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (profile) {
          setUsername(profile.username || "");
          setMode(profile.mode || "personal");
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    loadProfile();
  }, [navigate, toast]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username,
          mode
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      if (mode === 'company') {
        navigate('/company-onboarding');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="text-center">Loading profile...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-white/10 border-white/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mode">Account Type</Label>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={mode === 'personal' ? 'default' : 'outline'}
            onClick={() => setMode('personal')}
            className={mode === 'personal' ? 'bg-pulse-700 hover:bg-pulse-600' : ''}
          >
            Personal
          </Button>
          <Button
            type="button"
            variant={mode === 'company' ? 'default' : 'outline'}
            onClick={() => setMode('company')}
            className={mode === 'company' ? 'bg-pulse-700 hover:bg-pulse-600' : ''}
          >
            Company
          </Button>
        </div>
      </div>

      <div className="pt-4">
        <Button
          className="w-full bg-pulse-700 hover:bg-pulse-600"
          onClick={handleSubmit}
          disabled={loading || !username}
        >
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
};
