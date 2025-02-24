import { EmptyState } from "../../../components/EmptyState/EmptyState";

export const EmptyStateNoEvents = () => {
  return (
    <EmptyState heading="No events yet?">
      <ul className="space-y-2">
        <li>Get started by adding an event with the bottom right button ➕</li>
        <li>Swipe left on the event to see your action buttons ⬅️</li>
        <li>And swipe down to see all the event details ⬇️</li>
        <li>Use the navbar at the top to quickly search your events 🔎</li>
        <li>Or use the menu at the bottom to apply specific filters 🔼</li>
      </ul>
    </EmptyState>
  );
};
