import { apiClient } from '../client';
import type { DashboardStats, RecentActivity, UpcomingAppointment, ApiResponse } from '../types';

export const dashboardService = {
  getStats: () => apiClient.get<DashboardStats>('/dashboard/stats'),

  getRecentActivity: () =>
    apiClient.get<RecentActivity[]>('/dashboard/recent-activity'),

  getUpcomingAppointments: () =>
    apiClient.get<UpcomingAppointment[]>('/dashboard/upcoming'),
};
