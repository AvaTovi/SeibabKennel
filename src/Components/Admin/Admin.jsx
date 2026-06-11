import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./Admin.css";

const ADMIN_PASSWORD = "seibab123";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("messages");

  const [messages, setMessages] = useState([]);
  const [puppies, setPuppies] = useState([]);
  const [studs, setStuds] = useState([]);

  const [puppyForm, setPuppyForm] = useState({
    name: "",
    gender: "",
    price: "",
    status: "Available",
    description: "",
    imageFile: null,
  });

  const [studForm, setStudForm] = useState({
    name: "",
    fee: "",
    status: "Available",
    bloodline: "",
    description: "",
    imageFile: null,
  });

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("adminLoggedIn") === "true");
    fetchMessages();
    fetchPuppies();
    fetchStuds();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("Messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setMessages(data || []);
  };

  const fetchPuppies = async () => {
    const { data, error } = await supabase
      .from("Puppies")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setPuppies(data || []);
  };

  const fetchStuds = async () => {
    const { data, error } = await supabase
      .from("Studs")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setStuds(data || []);
  };

  const uploadImage = async (file, folder) => {
    if (!file) {
      alert("Please choose an image.");
      return null;
    }

    const fileExt = file.name.split(".").pop();
    const cleanFileName = file.name
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");

    const filePath = `${folder}/${Date.now()}-${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from("kennel-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error("Image upload error:", error);
      alert(`Image upload failed: ${error.message}`);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("kennel-images")
      .getPublicUrl(data.path);

    if (!publicUrlData.publicUrl) {
      alert("Could not create image URL.");
      return null;
    }

    return publicUrlData.publicUrl;
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("adminLoggedIn", "true");
      setIsLoggedIn(true);
      setPassword("");
    } else {
      alert("Incorrect password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    setIsLoggedIn(false);
  };

  const updateMessageStatus = async (id, status) => {
    await supabase.from("Messages").update({ status }).eq("id", id);
    fetchMessages();
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    await supabase.from("Messages").delete().eq("id", id);
    fetchMessages();
  };

  const addPuppy = async (e) => {
    e.preventDefault();

    const imageUrl = await uploadImage(puppyForm.imageFile, "puppies");

    if (!imageUrl) {
      alert("Puppy was not added because the image did not upload.");
      return;
    }

    const { error } = await supabase.from("Puppies").insert([
      {
        name: puppyForm.name,
        image_url: imageUrl,
        gender: puppyForm.gender,
        price: puppyForm.price,
        status: puppyForm.status,
        description: puppyForm.description,
      },
    ]);

    if (error) {
      console.error("Puppy insert error:", error);
      alert(`Failed to add puppy: ${error.message}`);
      return;
    }

    alert("Puppy added successfully!");

    setPuppyForm({
      name: "",
      gender: "",
      price: "",
      status: "Available",
      description: "",
      imageFile: null,
    });

    fetchPuppies();
  };

  const updatePuppy = async (id, field, value) => {
    const { error } = await supabase
      .from("Puppies")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      alert(`Update failed: ${error.message}`);
      return;
    }

    fetchPuppies();
  };

  const deletePuppy = async (id) => {
    if (!window.confirm("Delete this puppy?")) return;

    const { error } = await supabase.from("Puppies").delete().eq("id", id);

    if (error) {
      alert(`Delete failed: ${error.message}`);
      return;
    }

    fetchPuppies();
  };

  const addStud = async (e) => {
    e.preventDefault();

    const imageUrl = await uploadImage(studForm.imageFile, "studs");

    if (!imageUrl) {
      alert("Stud was not added because the image did not upload.");
      return;
    }

    const { error } = await supabase.from("Studs").insert([
      {
        name: studForm.name,
        image_url: imageUrl,
        fee: studForm.fee,
        status: studForm.status,
        bloodline: studForm.bloodline,
        description: studForm.description,
      },
    ]);

    if (error) {
      console.error("Stud insert error:", error);
      alert(`Failed to add stud: ${error.message}`);
      return;
    }

    alert("Stud added successfully!");

    setStudForm({
      name: "",
      fee: "",
      status: "Available",
      bloodline: "",
      description: "",
      imageFile: null,
    });

    fetchStuds();
  };

  const updateStud = async (id, field, value) => {
    const { error } = await supabase
      .from("Studs")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      alert(`Update failed: ${error.message}`);
      return;
    }

    fetchStuds();
  };

  const deleteStud = async (id) => {
    if (!window.confirm("Delete this stud?")) return;

    const { error } = await supabase.from("Studs").delete().eq("id", id);

    if (error) {
      alert(`Delete failed: ${error.message}`);
      return;
    }

    fetchStuds();
  };

  if (!isLoggedIn) {
    return (
      <main className="admin-login-page">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <p className="eyebrow">Admin Login</p>
          <h1>Seibab Kennel Admin</h1>
          <p>Manage messages, puppies, studs, and website information.</p>

          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Log In</button>
          <small>Temporary password: seibab123</small>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-header">
        <div>
          <p className="eyebrow">Owner Dashboard</p>
          <h1>Admin Dashboard</h1>
          <p>Update the website without touching code.</p>
        </div>

        <button className="admin-logout" onClick={handleLogout}>
          Log Out
        </button>
      </section>

      <section className="admin-stats">
        <div>
          <h3>Messages</h3>
          <p>{messages.length}</p>
        </div>
        <div>
          <h3>Puppies</h3>
          <p>{puppies.length}</p>
        </div>
        <div>
          <h3>Studs</h3>
          <p>{studs.length}</p>
        </div>
        <div>
          <h3>Resolved</h3>
          <p>{messages.filter((m) => m.status === "Resolved").length}</p>
        </div>
      </section>

      <nav className="admin-tabs">
        <button
          className={activeTab === "messages" ? "active" : ""}
          onClick={() => setActiveTab("messages")}
        >
          Messages
        </button>

        <button
          className={activeTab === "puppies" ? "active" : ""}
          onClick={() => setActiveTab("puppies")}
        >
          Puppies
        </button>

        <button
          className={activeTab === "studs" ? "active" : ""}
          onClick={() => setActiveTab("studs")}
        >
          Studs
        </button>
      </nav>

      {activeTab === "messages" && (
        <section className="admin-panel">
          <h2>Customer Messages & Issues</h2>

          {messages.length === 0 ? (
            <div className="empty-box">
              <h3>No messages yet</h3>
              <p>Customer messages will appear here.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <article className="admin-card" key={msg.id}>
                <div className="card-top">
                  <div>
                    <h3>{msg.name}</h3>
                    <p>{msg.email}</p>
                    <small>{new Date(msg.created_at).toLocaleString()}</small>
                  </div>
                  <span className="status-pill">{msg.status}</span>
                </div>

                <div className="message-box">{msg.message}</div>

                <div className="action-row">
                  <button onClick={() => updateMessageStatus(msg.id, "New")}>
                    Mark New
                  </button>

                  <button onClick={() => updateMessageStatus(msg.id, "In Progress")}>
                    In Progress
                  </button>

                  <button onClick={() => updateMessageStatus(msg.id, "Resolved")}>
                    Mark Resolved
                  </button>

                  <button className="danger" onClick={() => deleteMessage(msg.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      )}

      {activeTab === "puppies" && (
        <section className="admin-panel">
          <h2>Manage Puppies</h2>

          <form className="admin-form" onSubmit={addPuppy}>
            <input
              placeholder="Puppy name"
              value={puppyForm.name}
              onChange={(e) =>
                setPuppyForm({ ...puppyForm, name: e.target.value })
              }
              required
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setPuppyForm({ ...puppyForm, imageFile: e.target.files[0] })
              }
              required
            />

            <input
              placeholder="Gender"
              value={puppyForm.gender}
              onChange={(e) =>
                setPuppyForm({ ...puppyForm, gender: e.target.value })
              }
              required
            />

            <input
              placeholder="Price"
              value={puppyForm.price}
              onChange={(e) =>
                setPuppyForm({ ...puppyForm, price: e.target.value })
              }
              required
            />

            <select
              value={puppyForm.status}
              onChange={(e) =>
                setPuppyForm({ ...puppyForm, status: e.target.value })
              }
            >
              <option>Available</option>
              <option>Reserved</option>
              <option>Sold</option>
            </select>

            <textarea
              placeholder="Description"
              value={puppyForm.description}
              onChange={(e) =>
                setPuppyForm({ ...puppyForm, description: e.target.value })
              }
              required
            />

            <button type="submit">Add Puppy</button>
          </form>

          {puppies.map((p) => (
            <article className="admin-card edit-card" key={p.id}>
              {p.image_url && (
                <img className="admin-preview-img" src={p.image_url} alt={p.name} />
              )}

              <input
                value={p.name || ""}
                onChange={(e) => updatePuppy(p.id, "name", e.target.value)}
              />

              <input
                value={p.gender || ""}
                onChange={(e) => updatePuppy(p.id, "gender", e.target.value)}
              />

              <input
                value={p.price || ""}
                onChange={(e) => updatePuppy(p.id, "price", e.target.value)}
              />

              <select
                value={p.status || "Available"}
                onChange={(e) => updatePuppy(p.id, "status", e.target.value)}
              >
                <option>Available</option>
                <option>Reserved</option>
                <option>Sold</option>
              </select>

              <textarea
                value={p.description || ""}
                onChange={(e) =>
                  updatePuppy(p.id, "description", e.target.value)
                }
              />

              <button className="danger" onClick={() => deletePuppy(p.id)}>
                Delete Puppy
              </button>
            </article>
          ))}
        </section>
      )}

      {activeTab === "studs" && (
        <section className="admin-panel">
          <h2>Manage Studs</h2>

          <form className="admin-form" onSubmit={addStud}>
            <input
              placeholder="Stud name"
              value={studForm.name}
              onChange={(e) =>
                setStudForm({ ...studForm, name: e.target.value })
              }
              required
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setStudForm({ ...studForm, imageFile: e.target.files[0] })
              }
              required
            />

            <input
              placeholder="Stud fee"
              value={studForm.fee}
              onChange={(e) =>
                setStudForm({ ...studForm, fee: e.target.value })
              }
              required
            />

            <input
              placeholder="Bloodline"
              value={studForm.bloodline}
              onChange={(e) =>
                setStudForm({ ...studForm, bloodline: e.target.value })
              }
              required
            />

            <select
              value={studForm.status}
              onChange={(e) =>
                setStudForm({ ...studForm, status: e.target.value })
              }
            >
              <option>Available</option>
              <option>Limited Availability</option>
              <option>Unavailable</option>
            </select>

            <textarea
              placeholder="Description"
              value={studForm.description}
              onChange={(e) =>
                setStudForm({ ...studForm, description: e.target.value })
              }
              required
            />

            <button type="submit">Add Stud</button>
          </form>

          {studs.map((s) => (
            <article className="admin-card edit-card" key={s.id}>
              {s.image_url && (
                <img className="admin-preview-img" src={s.image_url} alt={s.name} />
              )}

              <input
                value={s.name || ""}
                onChange={(e) => updateStud(s.id, "name", e.target.value)}
              />

              <input
                value={s.fee || ""}
                onChange={(e) => updateStud(s.id, "fee", e.target.value)}
              />

              <input
                value={s.bloodline || ""}
                onChange={(e) => updateStud(s.id, "bloodline", e.target.value)}
              />

              <select
                value={s.status || "Available"}
                onChange={(e) => updateStud(s.id, "status", e.target.value)}
              >
                <option>Available</option>
                <option>Limited Availability</option>
                <option>Unavailable</option>
              </select>

              <textarea
                value={s.description || ""}
                onChange={(e) =>
                  updateStud(s.id, "description", e.target.value)
                }
              />

              <button className="danger" onClick={() => deleteStud(s.id)}>
                Delete Stud
              </button>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default Admin;