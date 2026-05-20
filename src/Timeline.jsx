import EventCard from "./EventCard";

function Timeline({ events, onDelete }) {
  return (
    <div>
      <h2>Timeline</h2>

      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default Timeline;