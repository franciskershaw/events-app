import { useMemo } from "react";

import { Eye, EyeOff, Loader2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import useUser from "@/hooks/user/useUser";

import ConnectionModal from "./components/ConnectionModals/ConnectionModal";
import RemoveConnectionModal from "./components/ConnectionModals/RemoveConnectionModal";
import useUpdateConnectionPreferences from "./hooks/useUpdateConnectionPreferences";

const Connections = () => {
  const { user } = useUser();
  const connections = useMemo(() => user?.connections, [user]);
  const { mutate: updateConnectionVisibility, isPending } =
    useUpdateConnectionPreferences();
  return (
    <>
      <div className="flex flex-col gap-8 px-7 py-7">
        <div className="flex items-center gap-2">
          <Users />
          <Heading type="h1">Connections</Heading>
        </div>
        <div>
          <Heading type="h2">Your Connections</Heading>
          <div className="mt-4">
            {!connections?.length ? (
              <div className="rounded-lg border p-8 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-sm font-semibold text-gray-900">
                  No connections yet
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Get started by connecting with friends to see each other's
                  events.
                </p>
                <ConnectionModal />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <ConnectionModal />
                <div className="space-y-2">
                  {connections?.map((connection) => (
                    <div
                      className="flex items-center justify-between rounded-md border bg-white p-4 shadow-sm hover:shadow-md transition-all"
                      key={connection._id}
                    >
                      <div className="flex flex-col">
                        <h3 className="font-semibold">{connection.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => {
                            updateConnectionVisibility({
                              connectionId: connection._id,
                              hideEvents: !connection.hideEvents,
                            });
                          }}
                          variant="outline"
                          size="icon"
                          disabled={isPending}
                        >
                          {isPending ? (
                            <Loader2 className="animate-spin" />
                          ) : connection.hideEvents ? (
                            <EyeOff />
                          ) : (
                            <Eye />
                          )}
                        </Button>
                        <RemoveConnectionModal _id={connection._id} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Connections;
