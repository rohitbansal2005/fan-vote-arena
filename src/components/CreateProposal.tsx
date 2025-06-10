import { useState } from 'react';
import { ethers } from 'ethers';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { getSignerContract } from '@/utils/contract';

interface CreateProposalProps {
  provider: ethers.BrowserProvider | null;
  account: string;
}

const CreateProposal = ({ provider, account }: CreateProposalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [votingPeriod, setVotingPeriod] = useState<number>(7); // Default to 7 days
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a proposal.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please fill in both title and description.",
        variant: "destructive",
      });
      return;
    }

    if (votingPeriod <= 0) {
      toast({
        title: "Invalid Voting Period",
        description: "Voting period must be at least 1 day.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const signerContract = await getSignerContract(provider);
      const tx = await signerContract.createProposal(title, description, votingPeriod);
      await tx.wait();

      toast({
        title: "Proposal Created!",
        description: "Your proposal has been successfully submitted to the blockchain.",
      });

      setTitle('');
      setDescription('');
      setVotingPeriod(7);

    } catch (error: any) {
      console.error('Error creating proposal:', error);
      toast({
        title: "Proposal Creation Failed",
        description: error.data?.message || error.message || "Failed to create proposal.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-[calc(100vh-200px)] py-8">
      <Card className="w-full max-w-2xl gradient-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Create New Proposal</CardTitle>
          <CardDescription>Submit your idea for the community to vote on.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Proposal Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="e.g., Implement new staking rewards program"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed explanation of your proposal and its benefits."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="votingPeriod">Voting Period (in days)</Label>
              <Input
                id="votingPeriod"
                type="number"
                value={votingPeriod}
                onChange={(e) => setVotingPeriod(Number(e.target.value))}
                min="1"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Create Proposal'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Proposals are submitted directly to the blockchain and require a connected wallet.
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateProposal; 