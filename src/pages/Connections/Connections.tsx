import { useState } from "react";

import { Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";

import ConnectionModal from "./components/ConnectionModals/ConnectionModal";

const Connections = () => {
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  return (
    <>
      <div className="flex flex-col gap-8 border px-7 py-7">
        <div className="flex items-center gap-2">
          <Users />
          <Heading type="h1">Connections</Heading>
        </div>
        <div className="text-center">
          <Button onClick={() => setIsConnectionModalOpen(true)}>
            Connect with a friend
          </Button>
        </div>
        <div>
          <Heading type="h2">Your Connections</Heading>
        </div>
      </div>
      <ConnectionModal
        isOpen={isConnectionModalOpen}
        onOpenChange={setIsConnectionModalOpen}
      />
    </>
  );
};

export default Connections;
