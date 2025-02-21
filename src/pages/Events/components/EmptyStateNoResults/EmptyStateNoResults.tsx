export const EmptyStateNoResults = () => {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
      <div className="text-center px-8">
        <h4 className="text-xl font-bold mb-4">No search results?</h4>
        <p>Try changing your search filters 🔎</p>
      </div>
    </div>
  );
};
