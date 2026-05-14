import { useState, useEffect } from "react";
import gsap from "gsap";

function App() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    category: "",
    email: ""
  });

  const [events, setEvents] = useState([]);
  const [errors, setErrors] = useState({});
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    let newErrors = {};

    const titleRegex = /^[a-zA-Z0-9 ]{3,}$/;
    const categoryRegex = /^[A-Za-z ]+$/;
    const emailRegex = /^[fF]\d{8}@pilani\.bits-pilani\.ac\.in$/;

    if (!titleRegex.test(form.title)) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (form.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!form.date) {
      newErrors.date = "Date is required";
    }

    if (!categoryRegex.test(form.category)) {
      newErrors.category = "Only letters allowed";
    }

    if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getSuggestion = async () => {
    setLoading(true);

    try {
      const res = await fetch("https://www.boredapi.com/api/activity");

      if (!res.ok) {
        throw new Error("Network error");
      }

      const data = await res.json();
      setSuggestion(data.activity);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch suggestion");
    }

    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newEvent = {
      ...form,
      suggestion,
      id: Date.now()
    };

    setEvents((prev) => [...prev, newEvent]);

    setForm({
      title: "",
      description: "",
      date: "",
      category: "",
      email: ""
    });

    setSuggestion("");
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
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Add Event</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <p style={{ color: "red" }}>{errors.title}</p>

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <p style={{ color: "red" }}>{errors.description}</p>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />
        <p style={{ color: "red" }}>{errors.date}</p>

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />
        <p style={{ color: "red" }}>{errors.category}</p>

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <p style={{ color: "red" }}>{errors.email}</p>

        <button type="button" onClick={getSuggestion}>
          Get Suggestion
        </button>

        <p>{loading ? "Loading..." : suggestion}</p>

        <button type="submit">Add Event</button>
      </form>

      <h2>Timeline</h2>

      {sortedEvents.map((event) => (
        <div
          key={event.id}
          id={event.id}
          className="card"
          style={{
            border: "1px solid gray",
            margin: "10px 0",
            padding: "10px",
            borderRadius: "8px",
            background: "#f9f9f9"
          }}
        >
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Category:</strong> {event.category}</p>
          <p><strong>Email:</strong> {event.email}</p>
          <p><strong>Suggestion:</strong> {event.suggestion}</p>

          <button onClick={() => deleteEvent(event.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;