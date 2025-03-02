import { Users } from "lucide-react";

import Heading from "@/components/ui/heading";
import usePageTitle from "@/hooks/usePageTitle";
import useUser from "@/hooks/user/useUser";

import ConnectionForm from "./components/ConnectionForm/ConnectionForm";
import ConnectionListItem from "./components/ConnectionListItem/ConnectionListItem";
import ConnectionModal from "./components/ConnectionModals/ConnectionModal";
import { EmptyStateNoConnections } from "./components/EmptyStateNoConnections/EmptyStateNoConnections";

const Connections = () => {
  const { user } = useUser();
  const connections = user?.connections;

  usePageTitle("Connections");

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
                  <EmptyStateNoConnections />
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
                      <ConnectionListItem
                        key={connection._id}
                        connection={connection}
                      />
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
