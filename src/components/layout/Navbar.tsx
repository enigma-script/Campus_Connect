import { useState } from 'react';
import { Zap, Menu, X, LogOut, User, LayoutDashboard, CalendarDays, BookmarkCheck, Chrome as Home } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter, type Page } from '../../contexts/RouterContext';

const NAV_LINKS: { label: string; page: Page; icon: React.ReactNode }[] = [
  { label: 'Home', page: 'home', icon: <Home className="w-4 h-4" /> },
  { label: 'Events', page: 'events', icon: <CalendarDays className="w-4 h-4" /> },
];

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { currentPage, navigate } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('home');
    setMobileOpen(false);
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[15px] font-bold text-slate-900 tracking-tight">CampusConnect</span>
              <span className="text-[10px] font-medium text-blue-600 tracking-widest uppercase -mt-0.5">Events</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.page}
                onClick={() => navigate(link.page)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === link.page
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
            {user && profile?.role === 'admin' && (
              <button
                onClick={() => navigate('admin')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === 'admin' || currentPage === 'admin-event-form'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
            )}
            {user && profile?.role === 'student' && (
              <button
                onClick={() => navigate('my-registrations')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === 'my-registrations'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <BookmarkCheck className="w-4 h-4" />
                My Events
              </button>
            )}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="text-sm font-medium text-slate-800">
                        {profile?.full_name || profile?.email?.split('@')[0] || 'User'}
                      </span>
                      <Badge
                        variant={profile?.role === 'admin' ? 'default' : 'secondary'}
                        className={`text-[10px] px-1.5 py-0 h-4 ${
                          profile?.role === 'admin'
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {profile?.role ?? 'student'}
                      </Badge>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="gap-2" onClick={() => navigate(profile?.role === 'admin' ? 'admin' : 'my-registrations')}>
                    <User className="w-4 h-4" />
                    <span>{profile?.role === 'admin' ? 'Dashboard' : 'My Registrations'}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('auth')} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <User className="w-4 h-4" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.page}
              onClick={() => { navigate(link.page); setMobileOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${
                currentPage === link.page ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {link.icon} {link.label}
            </button>
          ))}
          {user && profile?.role === 'admin' && (
            <button
              onClick={() => { navigate('admin'); setMobileOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-left ${
                currentPage === 'admin' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
          )}
          {user && profile?.role === 'student' && (
            <button
              onClick={() => { navigate('my-registrations'); setMobileOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-left ${
                currentPage === 'my-registrations' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" /> My Events
            </button>
          )}
          <div className="pt-2 border-t border-slate-100 mt-2">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{profile?.full_name || 'User'}</p>
                    <p className="text-xs text-slate-500">{profile?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <Button onClick={() => { navigate('auth'); setMobileOpen(false); }} className="w-full bg-blue-600 hover:bg-blue-700">
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
