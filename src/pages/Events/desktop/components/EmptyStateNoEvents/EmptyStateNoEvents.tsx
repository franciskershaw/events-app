export const EmptyStateNoEvents = () => {
  return (
    <div className="text-center px-4 absolute top-0 bottom-0 left-0 right-0 flex flex-col justify-center">
      <h4 className="text-xl font-bold mb-4">No events yet?</h4>
      <ul className="space-y-2">
        <li>Get started by adding an event with the bottom right button ➕</li>
        <li>
          Click on a specific day to see a summary of what's going on on that
          date 🗓️
        </li>
        <li>Hover over today's events to see your action buttons 👋</li>
        <li>And use the filter menu to search your events 🔎</li>
      </ul>
    </div>
  );
};
