import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
export const AdminTools = () => {
  const navigate = useNavigate();
  return <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/10">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-pulse-100">Company Reports</h2>
        <div className="flex gap-4">
          <Button className="bg-pulse-700 hover:bg-pulse-600 text-white" onClick={() => navigate('/hr-reports')}>
            <FileText className="h-4 w-4 mr-2" />
            View Team Reports
          </Button>
        </div>
      </div>
    </Card>;
};