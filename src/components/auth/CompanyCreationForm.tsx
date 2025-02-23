
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

interface CompanyCreationFormProps {
  onBack: () => void;
}

export const CompanyCreationForm = ({ onBack }: CompanyCreationFormProps) => {
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateCompany = async () => {
    try {
      setLoading(true);

      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([{ name: companyName }])
        .select()
        .single();

      if (companyError || !companyData) {
        throw new Error(companyError?.message || "Failed to create company");
      }

      const { error: memberError } = await supabase
        .from('company_members')
        .insert([{
          company_id: companyData.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          role: 'admin'
        }]);

      if (memberError) {
        throw new Error(memberError.message);
      }

      toast({
        title: "Company created",
        description: "Your company has been created successfully",
      });
      navigate("/company");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create company",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Input
        type="text"
        placeholder="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        className="bg-white/10 border-white/20"
      />
      <Button
        className="w-full bg-pulse-700 hover:bg-pulse-600"
        onClick={handleCreateCompany}
        disabled={loading || !companyName}
      >
        {loading ? "Creating..." : "Create Company"}
      </Button>
    </>
  );
};
