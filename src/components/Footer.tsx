
import { ExternalLink } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-pulse-800 border-t border-white/10">
      <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <p className="text-sm text-pulse-300">
          © {new Date().getFullYear()} Pulse. All rights reserved.
        </p>
        <a
          href="https://github.com/juliusthimm/jessi"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-pulse-300 hover:text-pulse-100 transition-colors"
        >
          View on GitHub
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
};
