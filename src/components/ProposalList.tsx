import { useState, useEffect, useMemo, useCallback } from 'react';
import { ethers } from 'ethers';
import ProposalCard from './ProposalCard';
import ProposalFilters from './ProposalFilters';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Vote, TrendingUp, Archive } from 'lucide-react';
import { Proposal, getContract, getSignerContract } from '@/utils/contract';
import { useToast } from '@/hooks/use-toast';

interface ProposalListProps {
  provider: ethers.BrowserProvider | null;
  account: string;
}

interface FilterState {
  category: string;
  sortBy: string;
  status: string;
}

const ProposalList = ({ provider, account }: ProposalListProps) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedProposals, setVotedProposals] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    sortBy: 'newest',
    status: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const loadProposals = useCallback(async () => {
    setLoading(true);
    try {
      const contract = getContract(provider);
      const allProposals = await contract.getAllProposals();
      const formattedProposals: Proposal[] = allProposals.map((p: any) => ({
        id: Number(p.id),
        title: p.title,
        description: p.description,
        voteCountFor: Number(p.voteCountFor),
        voteCountAgainst: Number(p.voteCountAgainst),
        startTime: Number(p.startTime),
        endTime: Number(p.endTime),
        active: p.active,
        creator: p.creator,
      }));
      setProposals(formattedProposals);

      // Check user's voted status for each proposal
      if (account) {
        const newVotedProposals = new Set<number>();
        for (const p of formattedProposals) {
          const hasVoted = await contract.hasUserVoted(p.id, account);
          if (hasVoted) {
            newVotedProposals.add(p.id);
          }
        }
        setVotedProposals(newVotedProposals);
      }

    } catch (error) {
      console.error('Error loading proposals from contract:', error);
      // Fallback to mock data if contract call fails (optional)
      // setProposals(MOCK_PROPOSALS);
    } finally {
      setLoading(false);
    }
  }, [provider, account]);

  useEffect(() => {
    loadProposals();
  }, [loadProposals]);

  const handleVote = async (proposalId: number, voteFor: boolean) => {
    if (!provider || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to vote.",
        variant: "destructive",
      });
      return;
    }

    try {
      const signerContract = await getSignerContract(provider);
      const tx = await signerContract.vote(proposalId, voteFor);
      await tx.wait(); // Wait for the transaction to be mined

      toast({
        title: "Vote Submitted!",
        description: "Your vote has been successfully recorded on the blockchain.",
      });

      // Optimistically update UI or re-fetch proposals
      setVotedProposals(prev => new Set(prev).add(proposalId));
      setProposals(prev =>
        prev.map(p =>
          p.id === proposalId
            ? { ...p, [voteFor ? 'voteCountFor' : 'voteCountAgainst']: (voteFor ? p.voteCountFor + 1 : p.voteCountAgainst + 1) }
            : p
        )
      );
      // loadProposals(); // Uncomment to re-fetch all proposals after vote

    } catch (error: any) {
      console.error('Vote transaction failed:', error);
      toast({
        title: "Vote Failed",
        description: error.data?.message || error.message || "Failed to submit your vote.",
        variant: "destructive",
      });
    }
  };

  const filteredAndSortedProposals = useMemo(() => {
    let filtered = proposals.filter(proposal => {
      const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           proposal.description.toLowerCase().includes(searchTerm.toLowerCase());
      // Removed category filtering for now, as smart contract doesn't have categories directly
      // const matchesCategory = filters.category === 'all' || proposal.category === filters.category;
      const matchesStatus = filters.status === 'all' || 
                           (filters.status === 'active' && proposal.active) ||
                           (filters.status === 'closed' && !proposal.active);
      
      return matchesSearch && matchesStatus;
    });

    // Sort proposals
    switch (filters.sortBy) {
      case 'oldest':
        filtered = filtered.sort((a, b) => a.id - b.id);
        break;
      case 'most-votes':
        filtered = filtered.sort((a, b) => (b.voteCountFor + b.voteCountAgainst) - (a.voteCountFor + a.voteCountAgainst));
        break;
      case 'least-votes':
        filtered = filtered.sort((a, b) => (a.voteCountFor + a.voteCountAgainst) - (b.voteCountFor + b.voteCountAgainst));
        break;
      default: // newest
        filtered = filtered.sort((a, b) => b.id - a.id);
    }

    return filtered;
  }, [proposals, filters, searchTerm]);

  const activeProposals = filteredAndSortedProposals.filter(p => p.active);
  const closedProposals = filteredAndSortedProposals.filter(p => !p.active);
  const trendingProposals = [...filteredAndSortedProposals]
    .sort((a, b) => (b.voteCountFor + b.voteCountAgainst) - (a.voteCountFor + a.voteCountAgainst))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading proposals from blockchain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <ProposalFilters
        onFilterChange={setFilters}
        onSearchChange={setSearchTerm}
        activeProposalsCount={proposals.filter(p => p.active).length}
        totalProposalsCount={proposals.length}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="gradient-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Vote className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-primary">{activeProposals.length}</p>
                <p className="text-sm text-muted-foreground">Active Proposals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold text-accent">
                  {proposals.reduce((sum, p) => sum + p.voteCountFor + p.voteCountAgainst, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Votes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card border-stadium-purple/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Archive className="h-8 w-8 text-stadium-purple" />
              <div>
                <p className="text-2xl font-bold text-stadium-purple">{votedProposals.size}</p>
                <p className="text-sm text-muted-foreground">Your Votes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proposals Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card/50">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Vote className="h-4 w-4" />
            Active ({activeProposals.length})
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="closed" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Closed ({closedProposals.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-6 mt-6">
          {activeProposals.length > 0 ? (
            <div className="grid gap-6">
              {activeProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  onVote={handleVote}
                  isConnected={!!account}
                  userHasVoted={votedProposals.has(proposal.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="gradient-card border-muted/20">
              <CardContent className="p-12 text-center">
                <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No active proposals found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="trending" className="space-y-6 mt-6">
          <div className="grid gap-6">
            {trendingProposals.map((proposal, index) => (
              <div key={proposal.id} className="relative">
                <Badge 
                  variant="default" 
                  className="absolute -top-2 -left-2 z-10 bg-accent text-accent-foreground"
                >
                  #{index + 1}
                </Badge>
                <ProposalCard
                  proposal={proposal}
                  onVote={handleVote}
                  isConnected={!!account}
                  userHasVoted={votedProposals.has(proposal.id)}
                />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="closed" className="space-y-6 mt-6">
          {closedProposals.length > 0 ? (
            <div className="grid gap-6">
              {closedProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  onVote={handleVote}
                  isConnected={!!account}
                  userHasVoted={votedProposals.has(proposal.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="gradient-card border-muted/20">
              <CardContent className="p-12 text-center">
                <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No closed proposals found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProposalList;
