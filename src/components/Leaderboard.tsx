
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  proposalId: number;
  title: string;
  voteCount: number;
  category: string;
  trend: 'up' | 'down' | 'stable';
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    proposalId: 0,
    title: "New Stadium Design Vote",
    voteCount: 15420,
    category: "Infrastructure",
    trend: "up"
  },
  {
    rank: 2,
    proposalId: 1,
    title: "Team Jersey Color Scheme",
    voteCount: 12890,
    category: "Design",
    trend: "up"
  },
  {
    rank: 3,
    proposalId: 4,
    title: "Sustainable Stadium Initiative",
    voteCount: 11200,
    category: "Sustainability",
    trend: "stable"
  },
  {
    rank: 4,
    proposalId: 2,
    title: "Fan Zone Entertainment",
    voteCount: 9340,
    category: "Entertainment",
    trend: "down"
  },
  {
    rank: 5,
    proposalId: 3,
    title: "Season Ticket Pricing",
    voteCount: 8750,
    category: "Pricing",
    trend: "stable"
  }
];

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLeaderboard(MOCK_LEADERBOARD);
      setLoading(false);
    }, 1000);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs font-bold text-muted-foreground">{rank}</span>
          </div>
        );
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-primary" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-destructive rotate-180" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-muted-foreground/30" />;
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

  if (loading) {
    return (
      <Card className="gradient-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Proposal Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-card border-primary/20 stadium-entrance">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Proposal Leaderboard
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Most voted proposals in the FanDAO arena
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-2">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.proposalId}
              className={`p-4 flex items-center gap-4 hover:bg-muted/5 transition-colors ${
                index === 0 ? 'bg-primary/5' : ''
              } ${index < leaderboard.length - 1 ? 'border-b border-border/50' : ''}`}
            >
              {/* Rank */}
              <div className="flex-shrink-0">
                {getRankIcon(entry.rank)}
              </div>

              {/* Proposal Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground truncate">
                    {entry.title}
                  </h4>
                  <Badge variant="outline" className={`${getCategoryColor(entry.category)} text-xs`}>
                    {entry.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{entry.voteCount.toLocaleString()} votes</span>
                  {getTrendIcon(entry.trend)}
                </div>
              </div>

              {/* Vote Count */}
              <div className="flex-shrink-0 text-right">
                <div className="text-lg font-bold text-primary">
                  {entry.voteCount.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">votes</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
