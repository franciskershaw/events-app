import { useModals } from "../../../../contexts/ModalsContext";
import { Button } from "../../../ui/button";

const NavbarBottom = () => {
  const { openEventModal } = useModals();

  return (
    <nav className="box fixed bottom-0 left-0 right-0 bg-white z-30">
      <Button onClick={() => openEventModal()}>Add event</Button>
    </nav>
  );
};

export default NavbarBottom;
