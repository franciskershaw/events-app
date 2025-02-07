import ConnectionFormContent from "./ConnectionFormContent";

const ConnectionForm = () => {
  return (
    <div className="rounded-lg border bg-card p-6 h-full md:p-8">
      <h2 className="text-xl font-semibold text-center mb-2">
        Connect with Friends
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Share your events with friends by either generating a code or entering
        theirs
      </p>
      <ConnectionFormContent inputId="form-connection-id" />
    </div>
  );
};

export default ConnectionForm;
