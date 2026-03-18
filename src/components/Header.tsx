import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, LogIn, LogOut, Shield, Trophy, Sun, Moon, Bell, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
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

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? 'bg-background/80 backdrop-blur-xl border-border/50 shadow-lg shadow-black/20 py-2' : 'bg-transparent border-transparent py-4'}`}
      >
        <div className="container relative z-10">
          {/* Top row: Logo + Nav buttons */}
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 hover:opacity-90 transition-opacity min-w-0 group">
              <div className="p-2 sm:p-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 shrink-0 group-hover:shadow-primary/50 group-hover:scale-105 transition-all duration-200">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate text-glow">
                FAST-NUCES
              </h1>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
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
        </div>
      </motion.header>

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
