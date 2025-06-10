import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface UserProfileProps {
  walletAddress: string;
  username?: string;
  level: number;
  totalVotes: number;
  votingPower: number;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
  }>;
  votingHistory: Array<{
    id: string;
    proposalTitle: string;
    vote: 'for' | 'against';
    date: string;
    votingPower: number;
  }>;
}

const UserProfile = ({
  walletAddress,
  username = "Anonymous",
  level = 1,
  totalVotes = 0,
  votingPower = 0,
  achievements = [],
  votingHistory = []
}: UserProfileProps) => {
  const initials = username.slice(0, 2).toUpperCase();
  const nextLevelProgress = ((level % 1) * 100).toFixed(0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${walletAddress}`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{username}</CardTitle>
            <CardDescription className="text-sm font-mono">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </CardDescription>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">Level {Math.floor(level)}</Badge>
              <Badge variant="outline">{totalVotes} Votes</Badge>
              <Badge variant="outline">{votingPower} VP</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to next level</span>
              <span>{nextLevelProgress}%</span>
            </div>
            <Progress value={Number(nextLevelProgress)} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="history">Voting History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={achievement.unlocked ? "" : "opacity-50"}>
                <CardHeader className="flex flex-row items-center gap-2">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{achievement.name}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {votingHistory.map((vote) => (
            <Card key={vote.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{vote.proposalTitle}</p>
                    <p className="text-sm text-muted-foreground">{vote.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={vote.vote === 'for' ? 'default' : 'destructive'}>
                      {vote.vote === 'for' ? 'For' : 'Against'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {vote.votingPower} VP
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile; 