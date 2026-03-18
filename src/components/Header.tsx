import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, LogIn, LogOut, Shield, Trophy, Sun, Moon, Bell, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LoginModal } from './LoginModal';
import { AdminPanel } from './AdminPanel';
import { RecentReviewsDialog } from './RecentReviewsDialog';
import { MobileMenu } from './MobileMenu';
import { ProcessedFaculty } from '@/hooks/useFacultyData';

interface HeaderProps {
  totalFaculty: number;
  totalDepartments: number;
  faculty: ProcessedFaculty[];
  onFacultyClick: (faculty: ProcessedFaculty) => void;
}

export function Header({ totalFaculty, totalDepartments, faculty, onFacultyClick }: HeaderProps) {
  const { user, isAdmin, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/10 bg-background/40 backdrop-blur-2xl transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

        <div className="container py-4 relative z-10">
          {/* Top row: Logo + Nav buttons */}
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity min-w-0 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/80 to-primary-end/80 text-primary-foreground shadow-lg shadow-primary/20 shrink-0 group-hover:shadow-primary/40 group-hover:scale-105 transition-all duration-300 ring-1 ring-white/10">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight truncate font-sans text-foreground/90">
                FAST-NUCES <span className="text-primary font-serif italic font-normal ml-1">Reviews</span>
              </h1>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="bg-background/60 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-2 bg-background/60 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all"
              >
                <Link to="/leaderboard">
                  <Trophy className="w-4 h-4 text-primary" />
                  Leaderboard
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowReviews(true)}
                aria-label="View recent reviews"
                className="bg-background/60 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all"
              >
                <Bell className="w-4 h-4" />
              </Button>
              {user ? (
                <>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAdmin(true)}
                      className="gap-2 bg-background/60 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all"
                    >
                      <Shield className="w-4 h-4 text-primary" />
                      Admin
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="gap-2 hover:bg-destructive/10 hover:text-destructive transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLogin(true)}
                  className="gap-2 bg-background/60 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Admin Login
                </Button>
              )}
            </div>

            {/* Mobile navigation */}
            <div className="flex sm:hidden items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="bg-background/60 backdrop-blur-sm border-border/50"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <MobileMenu
                user={user}
                isAdmin={isAdmin}
                onShowLogin={() => setShowLogin(true)}
                onShowAdmin={() => setShowAdmin(true)}
                onShowReviews={() => setShowReviews(true)}
                onSignOut={() => signOut()}
              />
            </div>
          </div>

          {/* Subtitle + Stats */}
          <div className="hidden md:flex items-center gap-4 mt-1 opacity-60 ml-12">
            <div className="flex items-center gap-1.5 text-xs font-mono tracking-widest uppercase">
              <span className="text-primary">{totalFaculty}</span>
              <span>Faculty</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-1.5 text-xs font-mono tracking-widest uppercase">
              <span className="text-primary">{totalDepartments}</span>
              <span>Departments</span>
            </div>
          </div>
        </div>
      </header>


      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <AdminPanel open={showAdmin} onClose={() => setShowAdmin(false)} />
      <RecentReviewsDialog
        open={showReviews}
        onClose={() => setShowReviews(false)}
        faculty={faculty}
        onFacultyClick={onFacultyClick}
      />
    </>
  );
}
