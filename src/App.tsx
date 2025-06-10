import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateProposal from "./pages/CreateProposal";
import UserProfile from "./components/UserProfile";
import DiscussionForum from "./components/DiscussionForum";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import Layout from "./components/Layout";
import { useState } from "react";
import { ethers } from "ethers";

const queryClient = new QueryClient();

const App = () => {
  const [connectedAddress, setConnectedAddress] = useState<string>('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  const handleWalletConnected = (address: string, provider: ethers.BrowserProvider) => {
    setConnectedAddress(address);
    setProvider(provider);
    console.log("Wallet connected in App.tsx:", address);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout onWalletConnected={handleWalletConnected}>
            <Routes>
              <Route path="/" element={<Index connectedAddress={connectedAddress} provider={provider} />} />
              <Route path="/profile" element={<UserProfile 
                walletAddress={connectedAddress || "0xPlaceholderAddress"}
                username="CryptoWhale"
                level={5.2}
                totalVotes={42}
                votingPower={100}
                achievements={[
                  {
                    id: "1",
                    name: "Active Voter",
                    description: "Voted on 10+ proposals",
                    icon: "🏆",
                    unlocked: true
                  },
                  {
                    id: "2",
                    name: "Community Leader",
                    description: "Created 5+ proposals",
                    icon: "👑",
                    unlocked: false
                  }
                ]}
                votingHistory={[
                  {
                    id: "1",
                    proposalTitle: "Community Treasury Management",
                    vote: "for",
                    date: "2024-03-15",
                    votingPower: 50
                  }
                ]}
              />} />
              <Route path="/forum" element={<DiscussionForum />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/create-proposal" element={<CreateProposal provider={provider} account={connectedAddress} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
