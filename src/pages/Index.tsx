
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { WELLBEING_TOPICS } from "@/constants/wellbeing-topics";

const Index = () => {
  const navigate = useNavigate();

  const handleLogin = () => navigate("/auth");
  const handleSignup = () => navigate("/auth?tab=signup");

  return (
    <div className="min-h-screen bg-pulse-800 text-pulse-100">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-pulse-800/50 backdrop-blur-lg">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/lovable-uploads/f5560acd-a657-4200-a4fa-4ce9590ba88a.png"
              alt="Pulsato Logo"
              className="h-6 w-6"
            />
            <span className="font-semibold text-pulse-100">Pulsato</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-pulse-100 hover:text-white hover:bg-pulse-700"
              onClick={handleLogin}
            >
              Login
            </Button>
            <Button
              className="bg-pulse-700 hover:bg-pulse-600 text-white"
              onClick={handleSignup}
            >
              Signup
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container max-w-7xl mx-auto space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Employee pulse surveys suck.
          </h1>
          <div className="space-y-2 text-lg text-pulse-300">
            <p>Self-rating your wellbeing from 0 to 10...</p>
            <p>...is like reading one sentence of a book.</p>
            <p className="font-semibold text-pulse-100">You miss the story & emotions.</p>
          </div>
        </div>
      </section>

      {/* Wave Illustration */}
      <div className="w-full h-32 md:h-48 relative overflow-hidden">
        <img
          src="/lovable-uploads/a5e9f09a-e485-46be-818d-ed43ce51f6e3.png"
          alt="Wave Pattern"
          className="w-full object-cover"
        />
      </div>

      {/* Maya Section */}
      <section className="py-20 px-4">
        <div className="container max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Meet Maya, the best friend
            </h2>
            <p className="text-xl text-pulse-100">of modern people teams.</p>
            <p className="text-pulse-300 max-w-2xl mx-auto">
              Maya chats with your employees & creates anonymized wellbeing
              insights for your people team across seven key categories.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.values(WELLBEING_TOPICS).map((topic) => (
              <Card key={topic.id} className="p-4 bg-white/5 backdrop-blur-lg border-white/10">
                <p className="text-sm text-pulse-100">{topic.title}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 px-4 bg-pulse-700/20">
        <div className="container max-w-7xl mx-auto space-y-8 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            See how it works.
          </h2>
          <p className="text-pulse-300">It's easier than you think.</p>
          <div className="max-w-3xl mx-auto aspect-video bg-pulse-700/50 rounded-xl flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-l-white border-t-transparent border-b-transparent ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container max-w-7xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Get started today.
          </h2>
          <p className="text-pulse-300">No setup. No payment. Instant results.</p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-pulse-700 hover:bg-pulse-600 text-white"
              onClick={handleSignup}
            >
              Signup for free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-pulse-700 text-pulse-100 hover:bg-pulse-700"
              onClick={handleLogin}
            >
              Login
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-pulse-700/20">
        <div className="container max-w-7xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            About us.
          </h2>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-pulse-700/50 mx-auto mb-4" />
              <p className="text-pulse-100">Anshul M.</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-pulse-700/50 mx-auto mb-4" />
              <p className="text-pulse-100">Julius T.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
