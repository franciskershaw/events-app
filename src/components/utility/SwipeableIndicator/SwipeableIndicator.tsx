interface SwipeableIndicatorProps {
  alignment?: "left" | "right";
  orientation: "horizontal" | "vertical";
}

const SwipeableIndicator = ({
  alignment,
  orientation = "vertical",
}: SwipeableIndicatorProps) => {
  return (
    <>
      {orientation === "vertical" ? (
        <div
          className={`flex items-center justify-center absolute top-0 bottom-0 px-1 py-2 ${alignment === "left" ? "left-0" : "right-0"}`}
        >
          <div
            className="w-1 h-full max-h-52 rounded-full bg-secondary"
            aria-hidden="true"
          ></div>
        </div>
      ) : (
        <div className="mx-auto pt-4">
          <div
            className="h-1 w-[100px] rounded-full bg-secondary"
            aria-hidden="true"
          />
        </div>
      )}
    </>
  );
};

export default SwipeableIndicator;
