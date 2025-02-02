import { Eye, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import useUser from "@/hooks/user/useUser";

import ConnectionModal from "./components/ConnectionModals/ConnectionModal";
import RemoveConnectionModal from "./components/ConnectionModals/RemoveConnectionModal";

const Connections = () => {
  const { user } = useUser();
  const connections = user?.connections;

  return (
    <>
      <div className="flex flex-col gap-8 px-7 py-7">
        <div className="flex items-center gap-2">
          <Users />
          <Heading type="h1">Connections</Heading>
        </div>
        <div>
          <Heading type="h2">Your Connections</Heading>
          <div className="mt-4 text-center">
            {!connections?.length ? (
              <div className="rounded-lg p-8">
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
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                {connections?.map((connection) => (
                  <div
                    className="flex items-center justify-between"
                    key={connection._id}
                  >
                    <h3>{connection.name}</h3>
                    <div>
                      <RemoveConnectionModal _id={connection._id} />
                      <Button variant="outline">
                        <Eye />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Connections;
