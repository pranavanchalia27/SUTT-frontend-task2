import { useState, useEffect } from "react";
import gsap from "gsap";

import AddEvent from "./AddEvent";
import Timeline from "./Timeline";

import "./App.css";

function App() {
  const [events, setEvents] = useState([]);

  const addEvent = (newEvent) => {
    setEvents((prev) => [...prev, newEvent]);
  };

  const deleteEvent = (id) => {
    const el = document.getElementById(id);

    if (!el) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      return;
    }

    gsap.to(el, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: () => {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
    });
  };
  
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  useEffect(() => {
    const elements = document.querySelectorAll(".card");

    if (elements.length === 0) return;

    gsap.fromTo(
      elements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.5
      }
    );
  }, [events]);

  return (
    <div className="container">
      <h1>Event Timeline</h1>

      <AddEvent onAdd={addEvent} />

      <Timeline events={sortedEvents} onDelete={deleteEvent} />
    </div>
  );
}

export default App;