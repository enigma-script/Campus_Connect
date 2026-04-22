import { useState, useEffect } from 'react';
import { Search, ArrowRight, CalendarDays, Users, Zap, Trophy, Cpu, Palette, BookOpen, Wrench } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import EventCard from '../components/events/EventCard';
import { supabase } from '../lib/supabase';
import type { Event } from '../lib/database.types';
import { useRouter } from '../contexts/RouterContext';
import { useAuth } from '../contexts/AuthContext';

const HERO_STATS = [
  { label: 'Events This Semester', value: '24+', icon: <CalendarDays className="w-5 h-5" /> },
  { label: 'Registered Students', value: '1,200+', icon: <Users className="w-5 h-5" /> },
  { label: 'Prizes Worth', value: '₹5L+', icon: <Trophy className="w-5 h-5" /> },
];

const CATEGORIES = [
  { name: 'Robotics & IoT', icon: <Cpu className="w-6 h-6" />, color: 'bg-orange-50 text-orange-600 border-orange-200', filter: 'Robotics' },
  { name: 'Cultural', icon: <Palette className="w-6 h-6" />, color: 'bg-pink-50 text-pink-600 border-pink-200', filter: 'Cultural' },
  { name: 'Technical', icon: <Zap className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600 border-blue-200', filter: 'Technical' },
  { name: 'Workshops', icon: <Wrench className="w-6 h-6" />, color: 'bg-emerald-50 text-emerald-600 border-emerald-200', filter: 'Workshop' },
  { name: 'Seminars', icon: <BookOpen className="w-6 h-6" />, color: 'bg-cyan-50 text-cyan-600 border-cyan-200', filter: 'Seminar' },
];

export default function HomePage() {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'Upcoming')
        .order('date', { ascending: true })
        .limit(6);
      setUpcomingEvents((data as Event[]) ?? []);
      setLoadingEvents(false);
    };
    fetchUpcoming();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('events');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <Cpu className="w-4 h-4 text-cyan-300" />
              <span>Robotics Week 2025 is here!</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 leading-[1.1]">
              Your Campus.<br />
              <span className="text-cyan-300">Your Events.</span>
            </h1>

            <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-xl mx-auto">
              Discover, register, and participate in the most exciting college events — from IoT hackathons to cultural extravaganzas.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto mb-10">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events, workshops, hackathons..."
                  className="pl-11 h-12 text-base bg-white text-slate-900 border-0 shadow-xl rounded-xl placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-white/50"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 shadow-xl rounded-xl h-12 border-0"
                onClick={() => navigate('events')}
              >
                <Search className="w-5 h-5" />
              </Button>
            </form>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/15">
                  <div className="text-cyan-300">{stat.icon}</div>
                  <div className="text-left">
                    <div className="text-xl font-bold leading-tight">{stat.value}</div>
                    <div className="text-xs text-blue-200">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 80" className="w-full" fill="white">
            <path d="M0,40 C300,80 900,0 1200,40 L1200,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Browse by Category</h2>
          <p className="text-slate-500 mt-2">Find events that match your interests</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate('events')}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border font-medium transition-all hover:shadow-md hover:-translate-y-0.5 ${cat.color}`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Upcoming Events</h2>
              <p className="text-slate-500 mt-1">Don't miss out on these exciting opportunities</p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('events')}
              className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 hidden sm:flex"
            >
              View All Events <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {loadingEvents ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 h-80 animate-pulse">
                  <div className="h-48 bg-slate-200 rounded-t-xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                    <div className="h-3 bg-slate-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              <CalendarDays className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-medium">No upcoming events</p>
              <p className="text-sm">Check back soon for new events!</p>
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Button onClick={() => navigate('events')} className="bg-blue-600 hover:bg-blue-700 gap-2">
              View All Events <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      {!user && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-10 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-700/20 rounded-2xl" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-3">Ready to get started?</h2>
              <p className="text-blue-100 mb-7 text-lg max-w-lg mx-auto">
                Create your free account and start registering for campus events today.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={() => navigate('auth')}
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 shadow-lg"
                >
                  Sign Up Free
                </Button>
                <Button
                  onClick={() => navigate('events')}
                  size="lg"
                  variant="outline"
                  className="border-white/50 text-white hover:bg-white/10 font-semibold px-8"
                >
                  Browse Events
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-slate-800">CampusConnect Events</span>
            </div>
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} CampusConnect Events. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
