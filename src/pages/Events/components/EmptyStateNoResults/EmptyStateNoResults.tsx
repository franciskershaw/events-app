import { EmptyState } from "../EmptyState/EmptyState";

export const EmptyStateNoResults = () => {
  return (
    <EmptyState heading="No search results?">
      <p>Try changing your search filters 🔎</p>
    </EmptyState>
  );
};
