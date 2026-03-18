import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  departments: string[];
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  departments,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-3xl bg-card/5 border border-border/10 backdrop-blur-md">
      <div className="relative flex-1 group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary pointer-events-none group-focus-within:scale-110 transition-transform duration-300">
          <Search className="w-4 h-4" />
        </div>
        <Input
          type="text"
          placeholder="Search for an instructor..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-14 h-14 text-lg rounded-2xl border-border/20 bg-background/50 backdrop-blur-md focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all shadow-inner"
        />
      </div>
      
      <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
        <SelectTrigger className="w-full sm:w-[320px] h-14 text-lg rounded-2xl border-border/20 bg-background/50 backdrop-blur-md focus:ring-primary/50 shadow-inner">
          <SelectValue placeholder="All Departments" />
        </SelectTrigger>
        <SelectContent className="rounded-2xl border-border/20 bg-card/95 backdrop-blur-xl">
          <SelectItem value="all" className="text-base py-3">All Departments</SelectItem>
          {departments.map((dept) => (
            <SelectItem key={dept} value={dept} className="text-base py-3">
              {dept}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
