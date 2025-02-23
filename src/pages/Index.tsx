import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { WELLBEING_TOPICS } from "@/constants/wellbeing-topics";
import { ArrowRight } from "lucide-react";
import WebFont from 'webfontloader';
import { useEffect } from "react";
const Index = () => {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Instrument Serif']
      }
    });
  }, []);
  const navigate = useNavigate();
  const handleLogin = () => navigate("/auth");
  const handleSignup = () => navigate("/auth?tab=signup");
  return <div className="min-h-screen bg-pulse-800 text-pulse-100">
    {/* Header */}
    <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-pulse-800 via-pulse-800/95 to-pulse-800/80 backdrop-blur-xl border-b border-white/5">
      <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/logo.png" alt="Pulsato Logo" className="h-10 w-10" />
          <span className="font-semibold text-pulse-100">Pulsato</span>
        </div>
        <div className="flex items-center gap-4">
          <Button className="text-pulse-100 hover:text-white hover:bg-white/5 transition-all" onClick={handleLogin}>
            Login
          </Button>
          <Button variant="secondary" className="hover:opacity-90 transition-all duration-300 text-black border-0" onClick={handleSignup}>
            Sign up
          </Button>
        </div>
      </div>
    </header>

    {/* Hero Section */}
    <section className="min-h-screen pt-32 flex-column items-center justify-center px-4 relative overflow-hidden">
      <div className="container max-w-2xl mx-auto space-y-8 text-center relative animate-fade-in my-0 py-[90px]">
        <h1 style={{
          fontFamily: 'Instrument Serif'
        }} className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text leading-tight max-w-4xl mx-auto text-left md:text-[AA8BFF]">
          Employee pulse surveys suck.
        </h1>
        <div className="space-y-4 text-xl md:text-2xl max-w-2xl mx-auto">
          <p className="text-pulse-300 font-normal text-left">Self-submission surveys to measure employee wellbeing is like trying to capture the full story of a book in one sentence.</p>
          
          
        </div>
        <div className="pt-8 text-left">
          <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-all duration-300 text-white gap-2 text-lg border-0 shadow-lg shadow-purple-500/25" onClick={handleSignup}>
            Transform your employee wellbeing
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="w-screen relative left-[50%] right-[50%] -mx-[50vw] -mt-[10%]">
        <img alt="Pulsato Logo" className="w-full" src="/lovable-uploads/af6ce922-36ab-4bb9-8bfd-d437800545ac.png" />
      </div>
    </section>

    {/* Maya Section */}
    <section className="py-32 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-pulse-700/30 to-transparent" />
      <div className="container max-w-2xl mx-auto space-y-16 relative">
        <div className="text-center space-y-6">
          <div className="flex gap-10">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text text-left" style={{
              fontFamily: 'Instrument Serif'
            }}>
              Meet <span className="underline decoration-purple-400">Maya</span>, the best friend <br /> of modern people teams.
            </h2>
            <div className="flex items-center gap-10">
              <div className="rounded-full p-2 border border-white/40" style={{
                borderWidth: "1px"
              }}>
                <img src="/lovable-uploads/logo.png" alt="Pulsato Logo" style={{
                  height: '5rem',
                  width: '5rem'
                }} />
              </div>
            </div>
          </div>

          <p className="text-lg text-pulse-300 max-w-2xl mx-auto text-left">
            Maya chats with your employees & creates anonymized wellbeing
            insights for your people team across seven key categories.
          </p>
        </div>

        {/* Categories Carousel */}
        <div className="relative w-screen left-[50%] right-[50%] -mx-[50vw]">
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-4" style={{
              minWidth: 'max-content'
            }}>
              {Object.values(WELLBEING_TOPICS).map((topic, index) => <Card key={topic.id} className="p-6 glass-card bg-white/5
                    hover:bg-white/20
                    transition-all duration-500 ease-in-out
                    cursor-pointer group
                    min-w-[200px]
                    min-h-[200px]">
                  <p className="text-base font-medium text-pulse-100 group-hover:text-white transition-colors truncate">
                    {topic.title}
                  </p>
                </Card>)}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Video Section */}
    <section className="py-32 px-4 bg-gradient-to-b from-pulse-700/20 to-transparent relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/lovable-uploads/a5e9f09a-e485-46be-818d-ed43ce51f6e3.png')] opacity-5 bg-cover bg-center mix-blend-overlay" />
      <div className="container max-w-2xl mx-auto space-y-8 text-center relative">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text text-left" style={{
          fontFamily: 'Instrument Serif'
        }}>
          See how it works.
        </h2>
        <p className="text-xl text-pulse-300 text-left">It's easier than you think.</p>
        <div className="max-w-3xl mx-auto aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center hover:opacity-90 transition-all duration-300 cursor-pointer group relative overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-pulse-800/50 backdrop-blur-sm" />
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform relative">
            <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-l-white border-t-transparent border-b-transparent ml-1" />
          </div>
        </div>
      </div>
    </section>

    {/* About Section */}
    <section className="py-32 px-4 bg-gradient-to-b from-pulse-700/20 to-transparent">
      <div className="container max-w-2xl mx-auto text-center space-y-12 ">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text text-left" style={{
          fontFamily: 'Instrument Serif'
        }}>
          About us.
        </h2>
        <div className="flex flex-col sm:flex-row justify-left gap-12">
          <div className="text-center group">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 mx-auto mb-6 backdrop-blur-xl border border-white/10 transition-transform group-hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-pulse-800/50" />
              </div>
              <p className="text-lg text-pulse-100 font-medium">Julius T.</p>
              <p className="text-sm text-pulse-300">Founder & CEO</p>
          </div>
          <div className="text-center group">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 mx-auto mb-6 backdrop-blur-xl border border-white/10 transition-transform group-hover:scale-105 relative overflow-hidden">
              <img src="/lovable-uploads/anshul.jpeg" alt="Anshul M." className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-pulse-800/50" />
            </div>
            <p className="text-lg text-pulse-100 font-medium">Anshul M.</p>
            <p className="text-sm text-pulse-300">Founder & CTO</p>
          </div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="py-12 px-4 border-t border-white/10">
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/lovable-uploads/logo.png" alt="Pulsato Logo" className="h-8 w-8" />
              <span className="font-semibold text-pulse-100">Pulsato</span>
            </div>
            <p className="text-sm text-pulse-300">
              Transforming employee wellbeing through meaningful conversations.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-pulse-300">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-pulse-300">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-pulse-300">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-sm text-pulse-300 text-center">
          <p>&copy; {new Date().getFullYear()} Pulsato. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>;
};
export default Index;