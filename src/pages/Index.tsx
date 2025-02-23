
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatInterface } from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { HeartPulse, History, BarChart2, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CompanyRole } from "@/types/auth";
import { AnalysisHistory } from "@/components/AnalysisHistory";
import { Card } from "@/components/ui/card";

const Index = () => {
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pulse-300"></div>
      </div>
    );
  }

  const renderDashboard = () => {
    const commonElements = (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Takes up 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {!showAssessment ? (
            <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/10">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-pulse-700/50">
                  <HeartPulse className="h-8 w-8 text-pulse-300" />
                </div>
                <h1 className="text-3xl font-bold">How are you doing today?</h1>
                <p className="text-lg text-pulse-300">Take a quick assessment to check your wellbeing</p>
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

          {/* Admin Stats */}
          {userRole === 'admin' && (
            <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/10">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-pulse-700/50">
                  <BarChart2 className="h-6 w-6 text-pulse-300" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Total Assessments</h2>
                  <p className="text-3xl font-bold text-pulse-300">{totalChats}</p>
                </div>
              </div>
            </Card>
          )}

          {/* HR Actions */}
          {userRole === 'hr' && (
            <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/10">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">HR Tools</h2>
                <div className="flex gap-4">
                  <Button 
                    className="bg-pulse-700 hover:bg-pulse-600"
                    onClick={() => navigate('/hr-reports')}
                  >
                    <FileText className="mr-2" />
                    View Team Reports
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar - Takes up 1 column */}
        <div className="space-y-6">
          <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent History</h2>
              <History className="h-5 w-5 text-pulse-300" />
            </div>
            <AnalysisHistory />
          </Card>
        </div>
      </div>
    );

    return commonElements;
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {renderDashboard()}
    </div>
  );
};

export default Index;
