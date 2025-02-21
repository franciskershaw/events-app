import Filters from "../../../components/Filters/Filters";

export const EventsSearch = () => {
  return (
    <>
      <div className="date-header m-2 mb-0">
        <h2 className="text-lg font-semibold">Search functionality</h2>
      </div>
      <div className="p-2 flex flex-col justify-end h-full">
        <hr className="mb-2"></hr>
        <Filters />
      </div>
    </>
  );
};
