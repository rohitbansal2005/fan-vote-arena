
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Star, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BuilderScoreData {
  score: number;
  rank: string;
  verified: boolean;
  talentProtocolId?: string;
  lastUpdated: string;
}

interface BuilderScoreProps {
  walletAddress: string;
}

const BuilderScore = ({ walletAddress }: BuilderScoreProps) => {
  const [scoreData, setScoreData] = useState<BuilderScoreData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (walletAddress) {
      fetchBuilderScore();
    }
  }, [walletAddress]);

  const fetchBuilderScore = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock Talent Protocol API call
      // In production, replace with actual API call:
      // const response = await fetch(`https://api.talentprotocol.com/api/v2/passports/${walletAddress}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data based on wallet address
      const mockScore = Math.floor(Math.random() * 100) + 1;
      const mockData: BuilderScoreData = {
        score: mockScore,
        rank: mockScore > 80 ? 'Elite Builder' : mockScore > 60 ? 'Experienced Builder' : mockScore > 40 ? 'Rising Builder' : 'New Builder',
        verified: mockScore > 50,
        talentProtocolId: `talent-${walletAddress.slice(-6)}`,
        lastUpdated: new Date().toLocaleDateString()
      };
      
      setScoreData(mockData);
    } catch (error) {
      console.error('Error fetching builder score:', error);
      setError('Failed to fetch builder score');
      toast({
        title: "Score Fetch Failed",
        description: "Unable to load builder score from Talent Protocol",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-accent';
    if (score >= 40) return 'text-stadium-purple';
    return 'text-muted-foreground';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-primary to-accent';
    if (score >= 60) return 'from-accent to-stadium-purple';
    if (score >= 40) return 'from-stadium-purple to-primary';
    return 'from-muted-foreground to-muted';
  };

  if (!walletAddress) {
    return (
      <Card className="gradient-card border-muted/20">
        <CardContent className="p-6 text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Connect wallet to view Builder Score</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-card border-primary/20 stadium-entrance">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Builder Score
          <Badge variant="outline" className="text-xs">
            Talent Protocol
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Fetching score...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchBuilderScore}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        ) : scoreData ? (
          <div className="space-y-6">
            {/* Score Display */}
            <div className="text-center">
              <div className={`text-6xl font-bold bg-gradient-to-r ${getScoreGradient(scoreData.score)} bg-clip-text text-transparent mb-2`}>
                {scoreData.score}
              </div>
              <p className="text-lg font-medium text-foreground">{scoreData.rank}</p>
              {scoreData.verified && (
                <Badge variant="default" className="mt-2 bg-primary/20 text-primary border-primary/30">
                  Verified Builder
                </Badge>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Builder Progress</span>
                <span className={getScoreColor(scoreData.score)}>{scoreData.score}/100</span>
              </div>
              <div className="w-full bg-muted/20 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(scoreData.score)} transition-all duration-1000`}
                  style={{ width: `${scoreData.score}%` }}
                />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wallet:</span>
                <span className="font-mono text-foreground">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
              {scoreData.talentProtocolId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Talent ID:</span>
                  <span className="text-foreground">{scoreData.talentProtocolId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="text-foreground">{scoreData.lastUpdated}</span>
              </div>
            </div>

            {/* Action Button */}
            <Button 
              variant="outline" 
              className="w-full gap-2" 
              onClick={() => window.open('https://www.talentprotocol.com', '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              View on Talent Protocol
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default BuilderScore;
