import { EmptyState } from "../../../components/EmptyState/EmptyState";

export const EmptyStateNoEvents = () => {
  return (
    <EmptyState heading="No events yet?">
      <ul className="space-y-2">
        <li>Get started by adding an event with the bottom right button ➕</li>
        <li>
          Click on a specific day to see a summary of what's going on on that
          date 🗓️
        </li>
        <li>Hover over today's events to see your action buttons 👋</li>
        <li>And use the filter menu to search your events 🔎</li>
      </ul>
    </EmptyState>
  );
};
