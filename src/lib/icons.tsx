import {
  FaBeer,
  FaBell,
  FaBirthdayCake,
  FaBriefcase,
  FaCalendarAlt,
  FaCalendarDay,
  FaChurch,
  FaFutbol,
  FaGlassCheers,
  FaMusic,
  FaPlane,
  FaRunning,
  FaTrain,
  FaUserMd,
  FaUtensils,
} from "react-icons/fa";
import { FaTent } from "react-icons/fa6";

// TODO: Change data structure of categories - no need to have icons, just map against name?
// TODO: Other ideas for categories - coffee
const categoryIcons: Record<string, JSX.Element> = {
  Activity: <FaRunning />,
  Anniversary: <FaCalendarDay />,
  Appointment: <FaUserMd />,
  Birthday: <FaBirthdayCake />,
  Dinner: <FaUtensils />,
  Drinks: <FaBeer />,
  Festival: <FaTent />,
  Gig: <FaMusic />,
  Holiday: <FaPlane />,
  "In Transit": <FaTrain />,
  "Night Out": <FaGlassCheers />,
  Other: <FaCalendarAlt />,
  Party: <FaBirthdayCake />,
  Reminder: <FaBell />,
  Sport: <FaFutbol />,
  Wedding: <FaChurch />,
  Work: <FaBriefcase />,
};

export const getCategoryIcon = (categoryName: string) => {
  return categoryIcons[categoryName] || <FaCalendarAlt />;
};
