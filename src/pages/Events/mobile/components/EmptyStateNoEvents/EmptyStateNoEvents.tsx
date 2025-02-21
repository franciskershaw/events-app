export const EmptyStateNoEvents = () => {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
      <div className="text-center px-8">
        <h4 className="text-xl font-bold mb-4">No events yet?</h4>
        <ul className="space-y-2">
          <li>
            Get started by adding an event with the bottom right button ➕
          </li>
          <li>Swipe left on the event to see your action buttons ⬅️</li>
          <li>And swipe down to see all the event details ⬇️</li>
          <li>Use the navbar at the top to quickly search your events 🔎</li>
          <li>Or use the menu at the bottom to apply specific filters 🔼</li>
        </ul>
      </div>
    </div>
  );
};
