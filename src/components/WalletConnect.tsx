import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Wallet, Zap, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletConnectProps {
  onWalletConnected?: (address: string, provider: ethers.BrowserProvider) => void;
}

const WalletConnect = ({ onWalletConnected }: WalletConnectProps) => {
  const [account, setAccount] = useState<string>('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
          setAccount(accounts[0]);
          getBalance(accounts[0], provider);
          onWalletConnected?.(accounts[0], provider);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const getBalance = async (address: string, provider: ethers.BrowserProvider) => {
    try {
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to connect your wallet.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      setAccount(accounts[0]);
      getBalance(accounts[0], provider);
      
      onWalletConnected?.(accounts[0], provider);
      setIsOpen(false);
      
      toast({
        title: "Wallet Connected!",
        description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
      });
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setProvider(null);
    setBalance('');
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {account ? formatAddress(account) : "Connect Wallet"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        {account ? (
          <Card className="border-none shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Wallet className="h-8 w-8 text-primary" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{formatAddress(account)}</p>
                    <p className="text-sm text-muted-foreground">
                      {parseFloat(balance).toFixed(4)} ETH
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    <Zap className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={disconnectWallet}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none shadow-none">
            <CardContent className="p-6 text-center">
              <div className="spotlight mx-auto mb-4 w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground mb-4">
                Connect your MetaMask wallet to start voting on proposals
              </p>
              {typeof window.ethereum === 'undefined' ? (
                <div className="flex items-center justify-center gap-2 text-destructive mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">MetaMask not detected</span>
                </div>
              ) : null}
              <Button 
                onClick={connectWallet} 
                disabled={isConnecting || typeof window.ethereum === 'undefined'}
                className="gradient-primary font-semibold hover:scale-105 transition-transform"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect MetaMask
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default WalletConnect;
