
export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-pulse-800 text-pulse-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pulse-300"></div>
      </div>
    </div>
  );
};
