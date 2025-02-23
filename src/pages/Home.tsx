
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatInterface } from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { History, BarChart2, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CompanyRole } from "@/types/auth";
import { AnalysisHistory } from "@/components/AnalysisHistory";
import { Card } from "@/components/ui/card";

const Home = () => {
  const [showAssessment, setShowAssessment] = useState(false);
  const [userRole, setUserRole] = useState<CompanyRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalChats, setTotalChats] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        const { data: member } = await supabase
          .from('company_members')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        setUserRole(member?.role || null);

        // If admin, fetch total chats
        if (member?.role === 'admin') {
          const { count } = await supabase
            .from('conversation_analyses')
            .select('*', { count: 'exact', head: true });
          setTotalChats(count || 0);
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
    return (
      <div className="min-h-screen bg-pulse-800 text-pulse-100 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pulse-300"></div>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    const commonElements = (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {!showAssessment ? (
            <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/10">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-pulse-700/50 px-[5px] py-[5px]">
                  <img alt="Pulsato Logo" src="/lovable-uploads/759af5a0-30c2-4e87-9faa-2aee05cdba88.png" className="h-14 w-14" />
                </div>
                <h1 className="text-3xl font-bold text-pulse-100">
                  How are you doing today?
                </h1>
                <p className="text-lg text-pulse-300">
                  Take a quick assessment to check your wellbeing
                </p>
                <Button
                  size="lg"
                  className="bg-pulse-700 hover:bg-pulse-600 text-white"
                  onClick={() => setShowAssessment(true)}
                >
                  Start Assessment
                </Button>
              </div>
            </Card>
          ) : (
            <ChatInterface onComplete={() => setShowAssessment(false)} />
          )}

          {/* Recent History - Moved here */}
          {!showAssessment && (
            <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-pulse-100">
                  Recent History
                </h2>
              </div>
              <AnalysisHistory />
            </Card>
          )}

          {/* HR Actions */}
          {userRole === 'hr' && (
            <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/10">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-pulse-100">HR Tools</h2>
                <div className="flex gap-4">
                  <Button
                    className="bg-pulse-700 hover:bg-pulse-600 text-white"
                    onClick={() => navigate('/hr-reports')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Team Reports
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar - Admin Stats moved here */}
        {!showAssessment && userRole === 'admin' && (
          <div className="space-y-6">
            <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/10">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-pulse-700/50">
                  <BarChart2 className="h-6 w-6 text-pulse-300" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-pulse-100">
                    Total Assessments
                  </h2>
                  <p className="text-3xl font-bold text-pulse-300">{totalChats}</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    );

    return commonElements;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {renderDashboard()}
    </div>
  );
};

export default Home;
