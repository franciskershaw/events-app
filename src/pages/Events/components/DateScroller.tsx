import dayjs from "dayjs";

const DateScroller = ({ date, label }: { date?: string; label?: string }) => {
  const formattedDate = date ? dayjs(date).format("MMMM YYYY") : "Today";

  return (
    <div className="sticky top-2 z-20 bg-white w-fit mx-auto">
      <div className="flex items-center justify-center space-x-2 p-2">
        <hr className="w-12 h-1 bg-black rounded-full"></hr>
        <div className="text-lg tracking-widest uppercase">
          {label || formattedDate}
        </div>
        <hr className="w-12 h-1 bg-black rounded-full"></hr>
      </div>
    </div>
  );
};

export default DateScroller;
