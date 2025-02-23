export const EmptyStateNoSearch = () => {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
      <div className="text-center px-8">
        <h4 className="text-xl font-bold mb-4">Search events</h4>
        <p>Try adding some filters to search through your events 🔎</p>
      </div>
    </div>
  );
};
