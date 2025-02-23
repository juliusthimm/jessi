
import { StatsCard } from "@/components/stats/StatsCard";
import { BarChart2, User } from "lucide-react";
import { CompanyRole } from "@/types/auth";

interface DashboardStatsProps {
  userRole: CompanyRole | null;
  totalChats: number;
  personalChats: number;
  lastCompanyAssessmentDate: string | null;
  lastAssessmentDate: string | null;
  showAssessment: boolean;
}

export const DashboardStats = ({
  userRole,
  totalChats,
  personalChats,
  lastCompanyAssessmentDate,
  lastAssessmentDate,
  showAssessment
}: DashboardStatsProps) => {
  return (
    <div className="space-y-6">
      {!showAssessment && (userRole === 'admin' || userRole === 'hr') && (
        <StatsCard
          icon={BarChart2}
          title="Company Assessments"
          value={totalChats}
          lastUpdated={lastCompanyAssessmentDate}
        />
      )}
      {!showAssessment && (
        <StatsCard
          icon={User}
          title="My Assessments"
          value={personalChats}
          lastUpdated={lastAssessmentDate}
        />
      )}
    </div>
  );
};
