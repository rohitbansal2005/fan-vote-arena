import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThumbsUp, MessageSquare, Share2, Flag } from "lucide-react";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    walletAddress: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
}

interface Thread {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    walletAddress: string;
  };
  timestamp: string;
  likes: number;
  comments: Comment[];
  tags: string[];
}

const DiscussionForum = () => {
  const [activeTab, setActiveTab] = useState("trending");
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);

  // Mock data - replace with real data in production
  const threads: Thread[] = [
    {
      id: "1",
      title: "Proposal for Community Treasury Management",
      content: "I think we should implement a new system for managing our community treasury...",
      author: {
        name: "CryptoWhale",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=CryptoWhale",
        walletAddress: "0x123...abc"
      },
      timestamp: "2 hours ago",
      likes: 42,
      comments: [
        {
          id: "c1",
          author: {
            name: "BlockchainPro",
            avatar: "https://api.dicebear.com/7.x/initials/svg?seed=BlockchainPro",
            walletAddress: "0x456...def"
          },
          content: "Great idea! I would suggest adding more transparency...",
          timestamp: "1 hour ago",
          likes: 15,
          replies: []
        }
      ],
      tags: ["Treasury", "Governance", "Proposal"]
    }
  ];

  const handleCreateThread = () => {
    // Implement thread creation logic
    setShowNewThreadForm(false);
    setNewThreadTitle("");
    setNewThreadContent("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Discussion Forum</h2>
        <Button onClick={() => setShowNewThreadForm(!showNewThreadForm)}>
          New Thread
        </Button>
      </div>

      {showNewThreadForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Thread</CardTitle>
            <CardDescription>Share your thoughts with the community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Thread Title"
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
            />
            <Textarea
              placeholder="Write your thoughts..."
              value={newThreadContent}
              onChange={(e) => setNewThreadContent(e.target.value)}
              rows={4}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowNewThreadForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateThread}>Create Thread</Button>
          </CardFooter>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {threads.map((thread) => (
            <Card key={thread.id}>
              <CardHeader>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={thread.author.avatar} />
                      <AvatarFallback>{thread.author.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{thread.title}</CardTitle>
                      <CardDescription>
                        Posted by {thread.author.name} • {thread.timestamp}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                    {thread.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{thread.content}</p>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <div className="flex gap-4">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    {thread.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    {thread.comments.length}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="gap-2 mt-2 sm:mt-0">
                  <Flag className="h-4 w-4" />
                  Report
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiscussionForum; 