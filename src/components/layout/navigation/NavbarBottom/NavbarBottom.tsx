import { useModals } from "../../../../contexts/ModalsContext";
import useUser from "../../../../hooks/user/useUser";
import { Button } from "../../../ui/button";

const NavbarBottom = () => {
  const { openEventModal } = useModals();
  const { user } = useUser();

  return (
    <nav className="box fixed bottom-0 left-0 right-0 bg-white z-30">
      {user && <Button onClick={() => openEventModal()}>Add event</Button>}
    </nav>
  );
};

export default NavbarBottom;
