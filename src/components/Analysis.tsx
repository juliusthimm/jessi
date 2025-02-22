
import { useEffect, useState } from "react";

export const Analysis = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const options = {
    headers: {
      'xi-api-key': `sk_35611c06d6d6fcbb16675b6548018917694e2e30f0c9db3d`
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.elevenlabs.io/v1/convai/conversations/GvnMMrjMmbtEYuOmCVBp', options); // Replace with your API endpoint
        console.log(response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pulse-300"></div>
        <p className="text-pulse-300 ml-3">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
          <p className="text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
        <h2 className="text-2xl font-bold text-pulse-100 mb-4">Analysis Results</h2>
        <pre className="text-pulse-300 overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};
