'use client';

import { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Check, CheckCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DashboardLayout from '@/components/DashboardLayout';
import { Button, Spinner, Badge, EmptyState, Pagination } from '@/components/ui';
import { notificationsApi } from '@/lib/api/notifications';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api/client';
import { ProtectedRoute } from '@/lib/auth';
import type { NotificationLog } from '@/types/notification';

const channelIcons: Record<string, typeof Mail> = {
  email: Mail,
  sms: MessageSquare,
  in_app: Bell,
};

const statusColors: Record<string, 'green' | 'red' | 'yellow'> = {
  sent: 'green',
  failed: 'red',
  pending: 'yellow',
};

export default function NotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchNotifications = async (page: number) => {
    setLoading(true);
    try {
      const data = await notificationsApi.list(`page=${page}`);
      setNotifications(data.data);
      setCurrentPage(data.current_page);
      setLastPage(data.last_page);
    } catch (err) {
      if (err instanceof ApiError) toast('error', err.errors[0] || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const updated = await notificationsApi.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? updated : n)));
    } catch (err) {
      if (err instanceof ApiError) toast('error', err.errors[0] || 'Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      toast('success', 'All notifications marked as read');
      fetchNotifications(currentPage);
    } catch (err) {
      if (err instanceof ApiError) toast('error', err.errors[0] || 'Failed to mark all as read');
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <DashboardLayout>
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-serif text-[var(--text-primary)]">Notifications</h1>
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" icon={<CheckCheck size={14} />} onClick={handleMarkAllAsRead}>
                Mark All Read
              </Button>
            )}
          </div>

          {loading ? (
            <div className="py-16"><Spinner size="lg" /></div>
          ) : notifications.length === 0 ? (
            <EmptyState title="No Notifications" description="You're all caught up." />
          ) : (
            <>
              <div className="space-y-3">
                {notifications.map((notif) => {
                  const Icon = channelIcons[notif.channel] || Bell;
                  return (
                    <div key={notif.id} className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-5 flex items-start gap-4">
                      <div className="w-9 h-9 border border-primary/30 flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-serif text-[var(--text-primary)]">{notif.subject}</p>
                          <Badge label={notif.status_label} color={statusColors[notif.status] || 'gray'} size="sm" />
                        </div>
                        <p className="text-xs text-[var(--text-muted)] font-sans">{notif.type_label} via {notif.channel}</p>
                        {notif.error_message && (
                          <p className="text-xs text-red-400 font-sans mt-1">{notif.error_message}</p>
                        )}
                        <p className="text-[10px] text-[var(--text-muted)] font-sans mt-2">
                          {notif.sent_at ? new Date(notif.sent_at).toLocaleString() : new Date(notif.created_at).toLocaleString()}
                        </p>
                      </div>
                      <button onClick={() => handleMarkAsRead(notif.id)} className="text-[var(--text-muted)] hover:text-primary transition-colors shrink-0" title="Mark as read">
                        <Check size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8">
                <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={fetchNotifications} />
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
      <Footer />
    </ProtectedRoute>
  );
}
