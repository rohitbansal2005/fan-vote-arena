
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Vote, Users, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Proposal } from '@/utils/contract';

interface ProposalCardProps {
  proposal: Proposal;
  onVote: (proposalId: number) => void;
  isConnected: boolean;
  userHasVoted?: boolean;
}

const ProposalCard = ({ proposal, onVote, isConnected, userHasVoted = false }: ProposalCardProps) => {
  const [isVoting, setIsVoting] = useState(false);
  const { toast } = useToast();

  const handleVote = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to vote on proposals.",
        variant: "destructive",
      });
      return;
    }

    if (!proposal.active) {
      toast({
        title: "Proposal Closed",
        description: "This proposal is no longer accepting votes.",
        variant: "destructive",
      });
      return;
    }

    setIsVoting(true);
    try {
      await onVote(proposal.id);
      toast({
        title: "Vote Cast Successfully!",
        description: `Your vote for "${proposal.title}" has been recorded.`,
      });
    } catch (error) {
      console.error('Voting error:', error);
      toast({
        title: "Voting Failed",
        description: "There was an error casting your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Infrastructure': 'bg-primary/20 text-primary border-primary/30',
      'Design': 'bg-accent/20 text-accent border-accent/30',
      'Entertainment': 'bg-stadium-purple/20 text-stadium-purple border-stadium-purple/30',
      'Pricing': 'bg-destructive/20 text-destructive border-destructive/30',
      'Sustainability': 'bg-stadium-green/20 text-stadium-green border-stadium-green/30',
    };
    return colors[category as keyof typeof colors] || 'bg-muted/20 text-muted-foreground border-muted/30';
  };

  return (
    <Card className="gradient-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-[1.02] stadium-entrance">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 text-foreground">{proposal.title}</CardTitle>
            <Badge variant="outline" className={getCategoryColor(proposal.category)}>
              {proposal.category}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {!proposal.active && <CheckCircle className="h-5 w-5 text-muted-foreground" />}
            {proposal.active ? (
              <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
                <Clock className="h-3 w-3 mr-1" />
                Active
              </Badge>
            ) : (
              <Badge variant="secondary">
                Closed
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          {proposal.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-semibold text-primary">
              {proposal.voteCount.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">votes</span>
          </div>
          
          <Button 
            onClick={handleVote}
            disabled={!isConnected || !proposal.active || isVoting || userHasVoted}
            className={`${
              userHasVoted 
                ? 'bg-primary/20 text-primary' 
                : 'gradient-primary hover:scale-105'
            } transition-transform font-semibold`}
            size="sm"
          >
            {isVoting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Voting...
              </>
            ) : userHasVoted ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Voted
              </>
            ) : (
              <>
                <Vote className="h-4 w-4 mr-2" />
                Vote
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProposalCard;
