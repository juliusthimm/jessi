
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const UserProfileForm = () => {
  const [username, setUsername] = useState<string>("");
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
          .select('username')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (profile) {
          setUsername(profile.username || "");
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
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      navigate('/');
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
        <Label htmlFor="username">First Name</Label>
        <Input
          id="username"
          type="text"
          placeholder="Enter your first name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-white/10 border-white/20"
        />
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
