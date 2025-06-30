import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedList } from "@/components/magicui/animated-list";
import { format } from "date-fns";

interface ProjectRightPanelProps {
  events: Array<{
    id: string;
    title: string;
    description: string | null;
    date: string;
    status: string;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    description: string | null;
    deadline: string | null;
    status: string;
    assignedTo: string | null;
  }>;
  reminders: Array<{
    id: string;
    title: string;
    description: string | null;
    dueDate: string;
    status: string;
  }>;
}

export function ProjectRightPanel({ events, tasks, reminders }: ProjectRightPanelProps) {
  // Filter upcoming events
  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= new Date() && event.status === "upcoming"
  );

  // Filter pending tasks
  const pendingTasks = tasks.filter((task) => task.status === "pending");

  // Filter active reminders
  const activeReminders = reminders.filter(
    (reminder) => reminder.status === "active" && new Date(reminder.dueDate) >= new Date()
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-[300px] h-full">
      {/* Calendar Placeholder */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-48 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-500">Calendar component will be integrated here.</p>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatedList className="space-y-2 max-h-48 overflow-y-auto">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col p-2 bg-gray-50 rounded-md border-l-4 border-blue-500"
                >
                  <span className="font-medium text-sm">{event.title}</span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(event.date), "MMM d, yyyy")}
                  </span>
                  {event.description && (
                    <span className="text-xs text-gray-600 mt-1 truncate">{event.description}</span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No upcoming events.</p>
            )}
          </AnimatedList>
        </CardContent>
      </Card>

      {/* Pending Tasks */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Pending Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatedList className="space-y-2 max-h-48 overflow-y-auto">
            {pendingTasks.length > 0 ? (
              pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col p-2 bg-gray-50 rounded-md border-l-4 border-orange-500"
                >
                  <span className="font-medium text-sm">{task.title}</span>
                  {task.deadline && (
                    <span className="text-xs text-gray-500">
                      Due: {format(new Date(task.deadline), "MMM d, yyyy")}
                    </span>
                  )}
                  {task.description && (
                    <span className="text-xs text-gray-600 mt-1 truncate">{task.description}</span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No pending tasks.</p>
            )}
          </AnimatedList>
        </CardContent>
      </Card>

      {/* Active Reminders */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Active Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatedList className="space-y-2 max-h-48 overflow-y-auto">
            {activeReminders.length > 0 ? (
              activeReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex flex-col p-2 bg-gray-50 rounded-md border-l-4 border-green-500"
                >
                  <span className="font-medium text-sm">{reminder.title}</span>
                  <span className="text-xs text-gray-500">
                    Due: {format(new Date(reminder.dueDate), "MMM d, yyyy")}
                  </span>
                  {reminder.description && (
                    <span className="text-xs text-gray-600 mt-1 truncate">{reminder.description}</span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No active reminders.</p>
            )}
          </AnimatedList>
        </CardContent>
      </Card>
    </div>
  );
}
