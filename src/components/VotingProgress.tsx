
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, Target } from 'lucide-react';

interface VotingProgressProps {
  currentVotes: number;
  targetVotes: number;
  participationRate: number;
}

const VotingProgress = ({ currentVotes, targetVotes, participationRate }: VotingProgressProps) => {
  const progressPercentage = Math.min((currentVotes / targetVotes) * 100, 100);
  
  return (
    <Card className="gradient-card border-primary/20">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">Voting Progress</h3>
            <p className="text-sm text-muted-foreground">Community participation across all proposals</p>
          </div>

          <div className="space-y-4">
            {/* Main Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Votes Cast</span>
                <span className="text-sm font-semibold text-primary">
                  {currentVotes.toLocaleString()} / {targetVotes.toLocaleString()}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="text-center">
                <span className="text-xs text-muted-foreground">
                  {progressPercentage.toFixed(1)}% of target reached
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-primary/20">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="text-lg font-bold text-primary">{participationRate}%</div>
                <div className="text-xs text-muted-foreground">Participation</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-4 w-4 text-accent" />
                </div>
                <div className="text-lg font-bold text-accent">+12%</div>
                <div className="text-xs text-muted-foreground">vs Last Week</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-4 w-4 text-stadium-purple" />
                </div>
                <div className="text-lg font-bold text-stadium-purple">5</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VotingProgress;
