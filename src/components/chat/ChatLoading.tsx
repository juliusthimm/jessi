
export const ChatLoading = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pulse-300"></div>
      <p className="text-pulse-300 mt-4">Connecting to ElevenLabs...</p>
    </div>
  );
};
