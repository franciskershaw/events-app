import { EmptyState } from "../EmptyState/EmptyState";

export const EmptyStateNoSearch = () => {
  return (
    <EmptyState heading="Search events">
      <p>Try adding some filters to search through your events 🔎</p>
    </EmptyState>
  );
};
