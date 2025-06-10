
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, SortDesc } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProposalFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  onSearchChange: (search: string) => void;
  activeProposalsCount: number;
  totalProposalsCount: number;
}

interface FilterState {
  category: string;
  sortBy: string;
  status: string;
}

const ProposalFilters = ({ onFilterChange, onSearchChange, activeProposalsCount, totalProposalsCount }: ProposalFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    sortBy: 'newest',
    status: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  const clearFilters = () => {
    const resetFilters = { category: 'all', sortBy: 'newest', status: 'all' };
    setFilters(resetFilters);
    setSearchTerm('');
    onFilterChange(resetFilters);
    onSearchChange('');
  };

  return (
    <Card className="gradient-card border-primary/20 mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background/50 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger className="w-[140px] bg-background/50 border-primary/20">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Pricing">Pricing</SelectItem>
                <SelectItem value="Sustainability">Sustainability</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-[120px] bg-background/50 border-primary/20">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
              <SelectTrigger className="w-[140px] bg-background/50 border-primary/20">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="most-votes">Most Votes</SelectItem>
                <SelectItem value="least-votes">Least Votes</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="border-primary/30 hover:bg-primary/10"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-primary/20">
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            {activeProposalsCount} Active
          </Badge>
          <Badge variant="outline" className="bg-muted/20 text-muted-foreground border-muted/30">
            {totalProposalsCount} Total
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProposalFilters;
