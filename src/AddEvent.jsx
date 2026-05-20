import { useState } from "react";

function AddEvent({ onAdd }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    category: "",
    email: ""
  });

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
      const res = await fetch(
        "https://api.allorigins.win/raw?url=https://www.boredapi.com/api/activity"
      );

      const data = await res.json();
      setSuggestion(data.activity);
    } catch {
      try {
        const res2 = await fetch("https://api.quotable.io/random");
        const data2 = await res2.json();

        setSuggestion(data2.content);
      } catch {
        setSuggestion("Try learning something new!");
      }
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

    onAdd(newEvent);

    setForm({
      title: "",
      description: "",
      date: "",
      category: "",
      email: ""
    });

    setSuggestion("");
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
      />
      <p className="error">{errors.title}</p>

      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <p className="error">{errors.description}</p>

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />
      <p className="error">{errors.date}</p>

      <input
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
      />
      <p className="error">{errors.category}</p>

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <p className="error">{errors.email}</p>

      <button type="button" onClick={getSuggestion}>
        Get Suggestion
      </button>

      <p>{loading ? "Loading..." : suggestion}</p>

      <button type="submit">Add Event</button>
    </form>
  );
}

export default AddEvent;