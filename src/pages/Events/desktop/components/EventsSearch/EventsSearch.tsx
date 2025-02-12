export const EventsSearch = () => {
  return (
    <>
      <div className="date-header m-2 mb-0">
        <h2 className="text-lg font-semibold">Search functionality</h2>
      </div>
      <div className="p-2">
        {/* Events - today */}
        {/* {Object.keys(eventsByDay).length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {events.length > 0 ? (
              <>
                <ul>
                  {events.map((event) => (
                    <EventCard event={event} key={event._id} />
                  ))}
                </ul>
                <AddEventButton />
              </>
            ) : (
              <div className="px-2">
                <p className="text-center mt-4">No events on this day.</p>
                <AddEventButton />
              </div>
            )}
          </>
        )} */}

        {/* Events - next 7 days */}
        {/* {upcomingEvents.length > 0 && (
          <div className="p-2 border-t">
            <h3 className="text-md font-semibold mb-2">Coming Up</h3>
            <ul>
              {upcomingEvents.map(({ date, events }) => (
                <li key={date} className="mb-4">
                  <h4 className="text-sm font-medium">
                    {dayjs(date).format("dddd Do MMMM")}
                  </h4>
                  <ol>
                    {events.map((event) => (
                      <li
                        key={event._id}
                        className="text-sm text-gray-500 list-disc list-outside ml-4"
                      >
                        <div className="flex gap-1 items-center">
                          <UserEventInitials event={event} />
                          <span>
                            {formatTime(event.date) &&
                              `${formatTime(event.date)}: `}
                            {event.title}
                            {event.unConfirmed && "(?)"}
                            {event.location?.venue &&
                              ` @ ${event.location?.venue}`}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ul>
          </div>
        )} */}
      </div>
    </>
  );
};
