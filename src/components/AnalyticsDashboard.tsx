import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const AnalyticsDashboard = () => {
  // Mock data - replace with real data in production
  const votingTrends = [
    { date: "2024-01", votes: 1200 },
    { date: "2024-02", votes: 1800 },
    { date: "2024-03", votes: 2400 },
    { date: "2024-04", votes: 2100 },
    { date: "2024-05", votes: 3000 },
  ];

  const proposalStats = [
    { category: "Treasury", count: 12 },
    { category: "Governance", count: 8 },
    { category: "Development", count: 15 },
    { category: "Community", count: 10 },
  ];

  const participationData = [
    { name: "Active Voters", value: 65 },
    { name: "Inactive Voters", value: 35 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Select defaultValue="7d">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Votes</CardTitle>
            <CardDescription>Across all proposals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">10,500</div>
            <p className="text-xs text-muted-foreground">+12% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Voters</CardTitle>
            <CardDescription>Unique addresses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2,450</div>
            <p className="text-xs text-muted-foreground">+8% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg. Voting Power</CardTitle>
            <CardDescription>Per active voter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.2 VP</div>
            <p className="text-xs text-muted-foreground">+5% from last period</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Voting Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="participation">Participation</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Voting Activity Over Time</CardTitle>
              <CardDescription>Daily voting volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={votingTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="votes" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Proposals by Category</CardTitle>
              <CardDescription>Distribution of proposal types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={proposalStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participation">
          <Card>
            <CardHeader>
              <CardTitle>Voter Participation</CardTitle>
              <CardDescription>Active vs Inactive voters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={participationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {participationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard; 