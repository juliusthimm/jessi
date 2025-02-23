import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { WELLBEING_TOPICS } from "@/constants/wellbeing-topics";
import { ArrowRight } from "lucide-react";
const Index = () => {
  const navigate = useNavigate();
  const handleLogin = () => navigate("/auth");
  const handleSignup = () => navigate("/auth?tab=signup");
  return <div className="min-h-screen bg-pulse-800 text-pulse-100">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-pulse-800 via-pulse-800/95 to-pulse-800/80 backdrop-blur-xl border-b border-white/5">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/f5560acd-a657-4200-a4fa-4ce9590ba88a.png" alt="Pulsato Logo" className="h-14 w-14" />
            <span className="font-semibold text-pulse-100">Pulsato</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-pulse-100 hover:text-white hover:bg-white/5 transition-all" onClick={handleLogin}>
              Login
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-all duration-300 text-white border-0 shadow-lg shadow-purple-500/25" onClick={handleSignup}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen pt-32 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent" />
        <div className="absolute inset-0 bg-[url('/lovable-uploads/2efe3633-fad8-4edf-b731-9a87f0fd1edf.png')] opacity-5 bg-cover bg-center mix-blend-overlay" />
        <div className="container max-w-7xl mx-auto space-y-8 text-center relative animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text leading-tight max-w-4xl mx-auto md:text-5xl">
            Employee pulse surveys suck.
          </h1>
          <div className="space-y-4 text-xl md:text-2xl max-w-2xl mx-auto">
            <p className="text-pulse-300 font-normal">Self-rating your wellbeing from 0 to 10 is like reading one sentence of a book:</p>
            
            <p className="font-semibold text-pulse-100">You miss the story & emotions.</p>
          </div>
          <div className="pt-8">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-all duration-300 text-white gap-2 text-lg border-0 shadow-lg shadow-purple-500/25" onClick={handleSignup}>
              Transform your employee wellbeing
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Maya Section */}
      <section className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-pulse-700/30 to-transparent" />
        <div className="container max-w-7xl mx-auto space-y-16 relative">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Meet Maya, the best friend
            </h2>
            <p className="text-2xl text-pulse-100">of modern people teams.</p>
            <p className="text-lg text-pulse-300 max-w-2xl mx-auto">
              Maya chats with your employees & creates anonymized wellbeing
              insights for your people team across seven key categories.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Object.values(WELLBEING_TOPICS).map((topic, index) => <Card key={topic.id} className="p-6 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 backdrop-blur-lg border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/5">
                <p className="text-sm font-medium text-pulse-100">{topic.title}</p>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-32 px-4 bg-gradient-to-b from-pulse-700/20 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/a5e9f09a-e485-46be-818d-ed43ce51f6e3.png')] opacity-5 bg-cover bg-center mix-blend-overlay" />
        <div className="container max-w-7xl mx-auto space-y-8 text-center relative">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            See how it works.
          </h2>
          <p className="text-xl text-pulse-300">It's easier than you think.</p>
          <div className="max-w-3xl mx-auto aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center hover:opacity-90 transition-all duration-300 cursor-pointer group relative overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-pulse-800/50 backdrop-blur-sm" />
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform relative">
              <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-l-white border-t-transparent border-b-transparent ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div className="container max-w-7xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Get started today.
          </h2>
          <p className="text-xl text-pulse-300">No setup. No payment. Instant results.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-all duration-300 text-white gap-2 text-lg border-0 shadow-lg shadow-purple-500/25" onClick={handleSignup}>
              Signup for free
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-purple-500/50 text-pulse-100 hover:bg-purple-500/10 transition-all duration-300 text-lg" onClick={handleLogin}>
              Login
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 px-4 bg-gradient-to-b from-pulse-700/20 to-transparent">
        <div className="container max-w-7xl mx-auto text-center space-y-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            About us.
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-12">
            <div className="text-center group">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 mx-auto mb-6 backdrop-blur-xl border border-white/10 transition-transform group-hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-pulse-800/50" />
              </div>
              <p className="text-lg text-pulse-100 font-medium">Anshul M.</p>
              <p className="text-sm text-pulse-300">Founder & CEO</p>
            </div>
            <div className="text-center group">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 mx-auto mb-6 backdrop-blur-xl border border-white/10 transition-transform group-hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-pulse-800/50" />
              </div>
              <p className="text-lg text-pulse-100 font-medium">Julius T.</p>
              <p className="text-sm text-pulse-300">Co-Founder & CTO</p>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default Index;