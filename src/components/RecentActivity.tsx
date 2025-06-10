
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Vote, Clock, TrendingUp } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'vote' | 'proposal_created' | 'proposal_closed';
  user: string;
  proposal: string;
  timestamp: string;
  category: string;
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'vote',
    user: '0x1234...5678',
    proposal: 'New Stadium Design Vote',
    timestamp: '2 minutes ago',
    category: 'Infrastructure'
  },
  {
    id: '2',
    type: 'vote',
    user: '0x8765...4321',
    proposal: 'Team Jersey Color Scheme',
    timestamp: '5 minutes ago',
    category: 'Design'
  },
  {
    id: '3',
    type: 'proposal_created',
    user: '0x9876...1234',
    proposal: 'Sustainable Stadium Initiative',
    timestamp: '1 hour ago',
    category: 'Sustainability'
  },
  {
    id: '4',
    type: 'vote',
    user: '0x5432...8765',
    proposal: 'Fan Zone Entertainment',
    timestamp: '2 hours ago',
    category: 'Entertainment'
  },
  {
    id: '5',
    type: 'proposal_closed',
    user: 'System',
    proposal: 'Season Ticket Pricing',
    timestamp: '1 day ago',
    category: 'Pricing'
  }
];

const RecentActivity = () => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vote':
        return <Vote className="h-4 w-4 text-primary" />;
      case 'proposal_created':
        return <TrendingUp className="h-4 w-4 text-accent" />;
      case 'proposal_closed':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Vote className="h-4 w-4 text-primary" />;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'vote':
        return 'voted on';
      case 'proposal_created':
        return 'created';
      case 'proposal_closed':
        return 'closed';
      default:
        return 'interacted with';
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
    <Card className="gradient-card border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {MOCK_ACTIVITIES.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs bg-primary/20">
                {activity.user === 'System' ? 'SYS' : activity.user.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {getActivityIcon(activity.type)}
                <span className="text-sm font-medium text-foreground truncate">
                  {activity.user}
                </span>
                <span className="text-sm text-muted-foreground">
                  {getActivityText(activity)}
                </span>
              </div>
              
              <p className="text-sm text-foreground truncate mb-2">
                {activity.proposal}
              </p>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={`text-xs ${getCategoryColor(activity.category)}`}>
                  {activity.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {activity.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
