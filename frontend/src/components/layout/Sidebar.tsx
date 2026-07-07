"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Upload,
  FileText,
  BarChart3,
  Users,
  BookOpen,
  Settings,
  LogOut,
  FileUp,
  ClipboardCheck,
  ClipboardList,
  Menu,
  X
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/common/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/common/alert-dialog';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: ClipboardList, label: 'Examinations', path: '/assignments' },
  { icon: Upload, label: 'Exam Setup', path: '/upload' },
  { icon: FileUp, label: 'Upload Answers', path: '/upload-answers' },
  { icon: ClipboardCheck, label: 'Grading Review', path: '/grading-review' },
  { icon: FileText, label: 'Results', path: '/results' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Users, label: 'Classes', path: '/classes' },
  { icon: BookOpen, label: 'Rubrics', path: '/rubrics' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed') === 'true';
    setCollapsed(saved);
  }, []);

  useEffect(() => {
    if (collapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [collapsed]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add('sidebar-mobile-open');
    } else {
      document.body.classList.remove('sidebar-mobile-open');
    }
  }, [mobileOpen]);

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleCollapsed = (value: boolean) => {
    setCollapsed(value);
    localStorage.setItem('sidebar-collapsed', String(value));
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* Mobile Hamburger Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] h-10 w-10 flex items-center justify-center bg-edtech-navy border border-white/10 text-white rounded-xl shadow-md hover:bg-white/5 transition-colors"
        title="Toggle Menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-edtech-navy flex flex-col border-r border-white/10 transition-all duration-300 z-50",
          collapsed ? "lg:w-[72px]" : "lg:w-[260px]",
          "w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 h-[65px]">
          {collapsed ? (
            <div className="flex items-center justify-center w-full">
              <button
                onClick={() => toggleCollapsed(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-edtech-slate hover:text-white flex items-center justify-center"
                title="Expand Sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2.5">
                <div className="h-12 w-12 flex items-center justify-center flex-shrink-0">
                  <img src="/fevicon.ico" alt="EvalueX Logo" className="w-full h-full object-contain" />
                </div>
                <span className="font-black text-2xl text-white tracking-tight">EvalueX</span>
              </div>
              <button
                onClick={() => toggleCollapsed(true)}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-edtech-slate hover:text-white flex items-center justify-center"
                title="Collapse Sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path ||
              (item.path === '/assignments' && pathname.startsWith('/assignment'));

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  collapsed && "justify-center px-2",
                  isActive
                    ? "bg-edtech-indigo text-white font-medium shadow-sm"
                    : "text-edtech-slate hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-white" : "text-edtech-slate")} />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User profile */}
        <div className="p-3 border-t border-white/10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors",
                  collapsed && "justify-center"
                )}
                title={collapsed ? displayName : undefined}
              >
                <Avatar className="h-9 w-9 flex-shrink-0">
                  <AvatarFallback className="bg-edtech-teal/20 text-edtech-teal font-semibold">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-white truncate">{displayName}</p>
                    <p className="text-xs text-edtech-slate truncate">{user?.email}</p>
                  </div>
                )}
                {!collapsed && (
                  <Settings className="h-4 w-4 text-edtech-slate" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={collapsed ? "start" : "end"} className="w-48">
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setShowSignOutDialog(true); }} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out of EvalueX?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSignOut} 
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
