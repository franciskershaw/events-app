interface EmptyStateProps {
  heading: string;
  children: React.ReactNode;
}

export const EmptyState = ({ heading, children }: EmptyStateProps) => {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
      <div className="text-center px-8">
        <h4 className="text-xl font-bold mb-4">{heading}</h4>
        {children}
      </div>
    </div>
  );
};
