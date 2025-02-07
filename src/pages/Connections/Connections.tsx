import { Eye, EyeOff, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import useUser from "@/hooks/user/useUser";

import ConnectionForm from "./components/ConnectionForm/ConnectionForm";
import ConnectionModal from "./components/ConnectionModals/ConnectionModal";
import RemoveConnectionModal from "./components/ConnectionModals/RemoveConnectionModal";
import useUpdateConnectionPreferences from "./hooks/useUpdateConnectionPreferences";

const Connections = () => {
  const { user } = useUser();
  const connections = user?.connections;

  const { mutate: updateConnectionVisibility, isPending } =
    useUpdateConnectionPreferences();

  return (
    <>
      <div className="flex flex-col gap-8 px-7 lg:px-28 py-7">
        <div className="flex items-center gap-2">
          <Users />
          <Heading type="h1">Connections</Heading>
        </div>
        <div className="flex flex-col lg:flex-row lg:gap-12">
          <div className="flex-1 lg:w-1/2 lg:flex-none">
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
                  <div className="lg:hidden">
                    <ConnectionModal />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="lg:hidden">
                    <ConnectionModal />
                  </div>
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
                            size="sm"
                            className="gap-2"
                            disabled={isPending}
                          >
                            {connection.hideEvents ? (
                              <>
                                <EyeOff className="h-4 w-4" />
                                <span className="hidden lg:block">
                                  Show Events
                                </span>
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4" />
                                <span className="hidden lg:block">
                                  Hide Events
                                </span>
                              </>
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

          {/* Right side - Connection Form (desktop only) */}
          <div className="hidden lg:block lg:w-1/2">
            <ConnectionForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default Connections;
