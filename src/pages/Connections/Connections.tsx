import { Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";

const Connections = () => {
  return (
    <div className="flex flex-col gap-8 border px-7 py-7">
      <div className="flex items-center gap-2">
        <Users />
        <Heading type="h1">Connections</Heading>
      </div>
      <div className="text-center">
        <Button>Share Connection</Button>
      </div>
      <div>
        <Heading type="h2">Your Connections</Heading>
      </div>
    </div>
  );
};

export default Connections;
