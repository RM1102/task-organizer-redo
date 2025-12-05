import React, { useEffect } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import DailyBriefing from './components/Dashboard/DailyBriefing';
import UnifiedTimeline from './components/Dashboard/UnifiedTimeline';
import TaskCockpit from './components/Dashboard/TaskCockpit';
import ErrorBoundary from './components/ErrorBoundary';
import { useAppStore } from './store';

const App: React.FC = () => {
  const { fetchData } = useAppStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <ErrorBoundary>
      <DashboardLayout>
        <DailyBriefing />
        <UnifiedTimeline />
        <TaskCockpit />
      </DashboardLayout>
    </ErrorBoundary>
  );
};


export default App;
