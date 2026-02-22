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
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary pointer-events-none">
          <Search className="w-4 h-4" />
        </div>
        <Input
          type="text"
          placeholder="Search faculty by name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 h-11 rounded-xl border-border/50 bg-card/80 backdrop-blur-sm focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all"
        />
      </div>
      
      <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
        <SelectTrigger className="w-full sm:w-[280px] h-11 rounded-xl border-border/50 bg-card/80 backdrop-blur-sm focus:ring-primary/30">
          <SelectValue placeholder="All Departments" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-border/50 bg-card/95 backdrop-blur-sm">
          <SelectItem value="all">All Departments</SelectItem>
          {departments.map((dept) => (
            <SelectItem key={dept} value={dept}>
              {dept}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
