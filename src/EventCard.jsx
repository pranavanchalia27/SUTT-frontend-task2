function EventCard({ event, onDelete }) {
  return (
    <div id={event.id} className="card">
      <h3>{event.title}</h3>

      <p>{event.description}</p>

      <p>
        <strong>Date:</strong> {event.date}
      </p>

      <p>
        <strong>Category:</strong> {event.category}
      </p>

      <p>
        <strong>Email:</strong> {event.email}
      </p>

      <p>
        <strong>Suggestion:</strong> {event.suggestion}
      </p>

      <button onClick={() => onDelete(event.id)}>
        Delete
      </button>
    </div>
  );
}

export default EventCard;