import useAuth from "@/pages/Auth/hooks/useAuth";
import { Button } from "../../components/ui/button";
import useGetEvents from "./hooks/useGetEvents";

const Events = () => {
  const { logout } = useAuth();
  const { events } = useGetEvents();

  console.log(events);

  return (
    <div>
      Events!!!!!
      <button onClick={logout}>Logout</button>
      <Button>Hello</Button>
    </div>
  );
};

export default Events;
