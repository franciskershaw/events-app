import {
  FaBeer,
  FaBirthdayCake,
  FaBriefcase,
  FaCalendarAlt,
  FaChurch,
  FaFutbol,
  FaGlassCheers,
  FaMusic,
  FaPlane,
  FaTrain,
  FaUserMd,
  FaUtensils,
} from "react-icons/fa";

// TODO: Change data structure of categories - no need to have icons, just map against name?
// TODO: Other ideas for categories - coffee
const categoryIcons: Record<string, JSX.Element> = {
  Appointment: <FaUserMd />,
  Birthday: <FaBirthdayCake />,
  Dinner: <FaUtensils />,
  Drinks: <FaBeer />,
  Festival: <FaMusic />,
  Gig: <FaMusic />,
  Holiday: <FaPlane />,
  "In Transit": <FaTrain />,
  "Night Out": <FaGlassCheers />,
  Other: <FaCalendarAlt />,
  Party: <FaBirthdayCake />,
  Sport: <FaFutbol />,
  Wedding: <FaChurch />,
  Work: <FaBriefcase />,
};

export const getCategoryIcon = (categoryName: string) => {
  return categoryIcons[categoryName] || <FaCalendarAlt />;
};
