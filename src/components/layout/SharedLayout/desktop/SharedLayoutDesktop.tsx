export const AuthenticatedLayoutDesktop = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen">
      <h1>Desktop</h1>
      <main>{children}</main>
    </div>
  );
};

export const UnauthenticatedLayoutDesktop = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen">
      <h1>Desktop</h1>
      <main>{children}</main>
    </div>
  );
};
