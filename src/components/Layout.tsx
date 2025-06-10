import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import WalletConnect from "./WalletConnect";
import NotificationSystem from "./NotificationSystem";
import { Home, BarChart2, MessageSquare, User, Menu, X, PlusCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onWalletConnected: (address: string, provider: any) => void;
}

const Layout = ({ children, onWalletConnected }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Create Proposal', href: '/create-proposal', icon: PlusCircle },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'Forum', href: '/forum', icon: MessageSquare },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Fan Arena Logo" className="h-10 w-auto" />
              <span className="sr-only">Fan Arena</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                      location.pathname === item.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <NotificationSystem />
            <WalletConnect onWalletConnected={onWalletConnected} />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <nav className="grid gap-2 py-4 px-4 sm:px-6 lg:px-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent ${
                    location.pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">{children}</main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with ❤️ for the Fan Community
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Privacy
            </Link>
            <Link
              to="/about"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              About
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
