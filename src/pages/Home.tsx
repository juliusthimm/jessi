import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatInterface } from "@/components/ChatInterface";
import { supabase } from "@/integrations/supabase/client";
import { CompanyRole } from "@/types/auth";
import { AnalysisHistory } from "@/components/AnalysisHistory";
import { Card } from "@/components/ui/card";
import { formatDistance, format, differenceInDays } from "date-fns";
import { WelcomeCard } from "@/components/home/WelcomeCard";
import { AdminTools } from "@/components/home/AdminTools";
import { DashboardStats } from "@/components/home/DashboardStats";
const Home = () => {
  const [showAssessment, setShowAssessment] = useState(false);
  const [userRole, setUserRole] = useState<CompanyRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalChats, setTotalChats] = useState(0);
  const [personalChats, setPersonalChats] = useState(0);
  const [lastAssessmentDate, setLastAssessmentDate] = useState<string | null>(null);
  const [lastCompanyAssessmentDate, setLastCompanyAssessmentDate] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const {
          data: {
            user
          }
        } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }
        const {
          data: member
        } = await supabase.from('company_members').select('role, company_id').eq('user_id', user.id).single();
        setUserRole(member?.role || null);

        // Fetch personal chats count
        const {
          count: personalCount
        } = await supabase.from('conversation_analyses').select('*', {
          count: 'exact',
          head: true
        }).eq('user_id', user.id);
        setPersonalChats(personalCount || 0);

        // Fetch last assessment date
        const {
          data: lastAssessment
        } = await supabase.from('conversation_analyses').select('created_at').eq('user_id', user.id).eq('status', 'done').order('created_at', {
          ascending: false
        }).limit(1).single();
        if (lastAssessment) {
          const date = new Date(lastAssessment.created_at);
          const daysDifference = differenceInDays(new Date(), date);
          if (daysDifference <= 7) {
            const distance = formatDistance(date, new Date(), {
              includeSeconds: false,
              addSuffix: true
            });
            setLastAssessmentDate(distance);
          } else {
            setLastAssessmentDate(format(date, 'MMMM do, yyyy'));
          }
        }

        // If admin, fetch total company chats and last company assessment
        if (member?.role === 'admin' && member?.company_id) {
          const {
            count
          } = await supabase.from('conversation_analyses').select('*', {
            count: 'exact',
            head: true
          }).eq('company_id', member.company_id);
          setTotalChats(count || 0);

          // Fetch last company assessment date
          const {
            data: lastCompanyAssessment
          } = await supabase.from('conversation_analyses').select('created_at').eq('company_id', member.company_id).eq('status', 'done').order('created_at', {
            ascending: false
          }).limit(1).single();
          if (lastCompanyAssessment) {
            const date = new Date(lastCompanyAssessment.created_at);
            const daysDifference = differenceInDays(new Date(), date);
            if (daysDifference <= 7) {
              const distance = formatDistance(date, new Date(), {
                includeSeconds: false,
                addSuffix: true
              });
              setLastCompanyAssessmentDate(distance);
            } else {
              setLastCompanyAssessmentDate(format(date, 'MMMM do, yyyy'));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserRole();
  }, [navigate]);
  if (loading) {
    return <div className="min-h-screen bg-pulse-800 text-pulse-100 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pulse-300"></div>
        </div>
      </div>;
  }
  return <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-[1fr,300px] gap-6">
        <div className="flex flex-col gap-6">
          <div className="w-full">
            {!showAssessment ? <WelcomeCard onStartAssessment={() => setShowAssessment(true)} /> : <ChatInterface onComplete={() => setShowAssessment(false)} />}
          </div>

          {!showAssessment && <div className="w-full">
              <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-pulse-100">My Reports</h2>
                </div>
                <AnalysisHistory />
              </Card>
            </div>}

          {userRole === 'admin' && <AdminTools />}
        </div>

        <DashboardStats userRole={userRole} totalChats={totalChats} personalChats={personalChats} lastCompanyAssessmentDate={lastCompanyAssessmentDate} lastAssessmentDate={lastAssessmentDate} showAssessment={showAssessment} />
      </div>
    </div>;
};
export default Home;