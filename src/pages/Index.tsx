import ProposalList from '@/components/ProposalList';
import Leaderboard from '@/components/Leaderboard';
import BuilderScore from '@/components/BuilderScore';
import VotingProgress from '@/components/VotingProgress';
import RecentActivity from '@/components/RecentActivity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRing, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { ethers } from 'ethers';

interface IndexProps {
  connectedAddress: string;
  provider: ethers.BrowserProvider | null;
}

const Index = ({ connectedAddress, provider }: IndexProps) => {
  // Mock Data for Overview Stats (replace with real data)
  const overviewStats = [
    { title: "Total Votes Cast", value: "15.2M", icon: CheckCircle2 },
    { title: "Active Proposals", value: "12", icon: BellRing },
    { title: "Active Voters", value: "5,300", icon: Users },
    { title: "Voting Participation", value: "78%", icon: TrendingUp },
  ];

  // Mock data for featured proposals (replace with real data)
  const featuredProposals = [
    {
      id: "fp1",
      title: "Decentralized Governance Model Update",
      description: "A proposal to update the existing governance model for better community participation and efficiency.",
      status: "Active",
      votesFor: 1200,
      votesAgainst: 300,
      link: "#"
    },
    {
      id: "fp2",
      title: "Fan Token Utility Expansion",
      description: "Proposal to expand the utility of the FAN token to include exclusive content access and merchandise discounts.",
      status: "Voting Soon",
      votesFor: 0,
      votesAgainst: 0,
      link: "#"
    },
  ];

  // Mock data for community news
  const communityNews = [
    {
      id: "cn1",
      title: "New Voting Round Announced!",
      date: "2024-07-20",
      content: "Get ready to cast your votes on the upcoming proposals. The voting period starts next week."
    },
    {
      id: "cn2",
      title: "Platform Upgrade Complete",
      date: "2024-07-18",
      content: "Our platform has been successfully upgraded with new features and improved performance."
    },
  ];


  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12 bg-gradient-to-br from-primary/10 to-transparent rounded-lg border border-primary/20">
        {connectedAddress ? (
          <>
            <h2 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
              Welcome Back to the Fan Arena!
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Your voice continues to shape the future of fan engagement. Explore new proposals or check your builder score.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
              🎉 Welcome to the Arena! 🎉
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Connect your wallet to start participating in fan voting and join our decentralized community.
            </p>
            <div className="p-8 rounded-lg bg-primary/10 border border-primary/20 inline-block">
              <p className="text-primary font-semibold">
                🚀 Ready to Vote
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Connect your MetaMask wallet to access proposals, cast votes, and view your builder score
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                (Requires the MetaMask browser extension installed.)
              </p>
            </div>
          </>
        )}
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="flex flex-col items-center justify-center p-6 text-center">
              <Icon className="h-10 w-10 text-primary mb-3" />
              <CardTitle className="text-3xl font-bold">{stat.value}</CardTitle>
              <CardDescription className="text-sm">{stat.title}</CardDescription>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Proposals and Featured */}
        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-2xl font-bold">Featured Proposals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProposals.map((proposal) => (
              <Card key={proposal.id}>
                <CardHeader>
                  <CardTitle>{proposal.title}</CardTitle>
                  <CardDescription>{proposal.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <span className="font-semibold">{proposal.status}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Votes For:</span>
                    <span className="font-semibold">{proposal.votesFor}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Votes Against:</span>
                    <span className="font-semibold">{proposal.votesAgainst}</span>
                  </div>
                  <Button className="w-full mt-4">View Proposal</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <h3 className="text-2xl font-bold mt-8">All Proposals</h3>
          <ProposalList provider={provider} account={connectedAddress} />
        </div>

        {/* Right Column: Sidebar - Builder Score, Voting Progress, Recent Activity, Leaderboard */}
        <div className="lg:col-span-1 space-y-8">
          <h3 className="text-2xl font-bold">Your Stats</h3>
          <BuilderScore walletAddress={connectedAddress} />

          <h3 className="text-2xl font-bold">Voting Progress</h3>
          <VotingProgress 
            currentVotes={57302}
            targetVotes={100000}
            participationRate={73}
          />

          <h3 className="text-2xl font-bold">Recent Activity</h3>
          <RecentActivity />

          <h3 className="text-2xl font-bold">Leaderboard</h3>
          <Leaderboard />

          {/* Community News */}
          <h3 className="text-2xl font-bold">Community News</h3>
          <div className="space-y-4">
            {communityNews.map((news) => (
              <Card key={news.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{news.title}</CardTitle>
                  <CardDescription className="text-sm">{news.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{news.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
