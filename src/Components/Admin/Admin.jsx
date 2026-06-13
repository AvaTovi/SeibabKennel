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
    galleryFiles: [],
    pedigreeFile: null,
    featured: false,
    sold: false,
  });

  const [studForm, setStudForm] = useState({
    name: "",
    fee: "",
    status: "Available",
    bloodline: "",
    description: "",
    imageFile: null,
    galleryFiles: [],
    pedigreeFile: null,
    featured: false,
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

  const uploadFile = async (file, folder) => {
    if (!file) return null;

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
      alert(`Upload failed: ${error.message}`);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("kennel-images")
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  };

  const uploadMultipleFiles = async (files, folder) => {
    const urls = [];

    for (const file of files) {
      const url = await uploadFile(file, folder);
      if (url) urls.push(url);
    }

    return urls;
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

    const imageUrl = await uploadFile(puppyForm.imageFile, "puppies/main");
    if (!imageUrl) {
      alert("Please upload a main puppy image.");
      return;
    }

    const galleryUrls = await uploadMultipleFiles(
      puppyForm.galleryFiles,
      "puppies/gallery"
    );

    const pedigreeUrl = await uploadFile(
      puppyForm.pedigreeFile,
      "puppies/pedigrees"
    );

    const { error } = await supabase.from("Puppies").insert([
      {
        name: puppyForm.name,
        image_url: imageUrl,
        gender: puppyForm.gender,
        price: puppyForm.price,
        status: puppyForm.status,
        description: puppyForm.description,
        gallery_urls: galleryUrls,
        pedigree_url: pedigreeUrl,
        featured: puppyForm.featured,
        sold: puppyForm.sold,
      },
    ]);

    if (error) {
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
      galleryFiles: [],
      pedigreeFile: null,
      featured: false,
      sold: false,
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

  const updatePuppyMainImage = async (id, file) => {
    const imageUrl = await uploadFile(file, "puppies/main");
    if (!imageUrl) return;
    await updatePuppy(id, "image_url", imageUrl);
  };

  const addPuppyGalleryImages = async (puppy) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;

    input.onchange = async (e) => {
      const files = Array.from(e.target.files);
      const newUrls = await uploadMultipleFiles(files, "puppies/gallery");
      const currentUrls = puppy.gallery_urls || [];
      await updatePuppy(puppy.id, "gallery_urls", [...currentUrls, ...newUrls]);
    };

    input.click();
  };

  const removePuppyGalleryImage = async (puppy, urlToRemove) => {
    const updatedGallery = (puppy.gallery_urls || []).filter(
      (url) => url !== urlToRemove
    );

    await updatePuppy(puppy.id, "gallery_urls", updatedGallery);
  };

  const updatePuppyPedigree = async (id, file) => {
    const pedigreeUrl = await uploadFile(file, "puppies/pedigrees");
    if (!pedigreeUrl) return;
    await updatePuppy(id, "pedigree_url", pedigreeUrl);
  };

  const deletePuppy = async (id) => {
    if (!window.confirm("Delete this puppy?")) return;
    await supabase.from("Puppies").delete().eq("id", id);
    fetchPuppies();
  };

  const addStud = async (e) => {
    e.preventDefault();

    const imageUrl = await uploadFile(studForm.imageFile, "studs/main");
    if (!imageUrl) {
      alert("Please upload a main stud image.");
      return;
    }

    const galleryUrls = await uploadMultipleFiles(
      studForm.galleryFiles,
      "studs/gallery"
    );

    const pedigreeUrl = await uploadFile(studForm.pedigreeFile, "studs/pedigrees");

    const { error } = await supabase.from("Studs").insert([
      {
        name: studForm.name,
        image_url: imageUrl,
        fee: studForm.fee,
        status: studForm.status,
        bloodline: studForm.bloodline,
        description: studForm.description,
        gallery_urls: galleryUrls,
        pedigree_url: pedigreeUrl,
        featured: studForm.featured,
      },
    ]);

    if (error) {
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
      galleryFiles: [],
      pedigreeFile: null,
      featured: false,
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

  const updateStudMainImage = async (id, file) => {
    const imageUrl = await uploadFile(file, "studs/main");
    if (!imageUrl) return;
    await updateStud(id, "image_url", imageUrl);
  };

  const addStudGalleryImages = async (stud) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;

    input.onchange = async (e) => {
      const files = Array.from(e.target.files);
      const newUrls = await uploadMultipleFiles(files, "studs/gallery");
      const currentUrls = stud.gallery_urls || [];
      await updateStud(stud.id, "gallery_urls", [...currentUrls, ...newUrls]);
    };

    input.click();
  };

  const removeStudGalleryImage = async (stud, urlToRemove) => {
    const updatedGallery = (stud.gallery_urls || []).filter(
      (url) => url !== urlToRemove
    );

    await updateStud(stud.id, "gallery_urls", updatedGallery);
  };

  const updateStudPedigree = async (id, file) => {
    const pedigreeUrl = await uploadFile(file, "studs/pedigrees");
    if (!pedigreeUrl) return;
    await updateStud(id, "pedigree_url", pedigreeUrl);
  };

  const deleteStud = async (id) => {
    if (!window.confirm("Delete this stud?")) return;
    await supabase.from("Studs").delete().eq("id", id);
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
                  <a
                    className="email-customer-button"
                    href={`mailto:${msg.email}?subject=Seibab Kennel Inquiry&body=Hi ${msg.name},%0D%0A%0D%0AThank you for reaching out to Seibab Kennel.%0D%0A%0D%0A`}
                  >
                    Email Customer
                  </a>

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

            <label className="admin-file-label">Main Puppy Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setPuppyForm({ ...puppyForm, imageFile: e.target.files[0] })
              }
              required
            />

            <label className="admin-file-label">
              Extra Gallery Images: front, side, stack, etc.
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setPuppyForm({
                  ...puppyForm,
                  galleryFiles: Array.from(e.target.files),
                })
              }
            />

            <label className="admin-file-label">Pedigree PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                setPuppyForm({ ...puppyForm, pedigreeFile: e.target.files[0] })
              }
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

            <div className="admin-check-row">
              <label>
                <input
                  type="checkbox"
                  checked={puppyForm.featured}
                  onChange={(e) =>
                    setPuppyForm({ ...puppyForm, featured: e.target.checked })
                  }
                />
                Featured Puppy
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={puppyForm.sold}
                  onChange={(e) =>
                    setPuppyForm({ ...puppyForm, sold: e.target.checked })
                  }
                />
                Sold Puppy
              </label>
            </div>

            <button type="submit">Add Puppy</button>
          </form>

          {puppies.map((p) => (
            <article className="admin-card edit-card" key={p.id}>
              {p.image_url && (
                <img className="admin-preview-img" src={p.image_url} alt={p.name} />
              )}

              <label className="admin-file-label">Change Main Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => updatePuppyMainImage(p.id, e.target.files[0])}
              />

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
                onChange={(e) => updatePuppy(p.id, "description", e.target.value)}
              />

              <div className="admin-check-row">
                <label>
                  <input
                    type="checkbox"
                    checked={!!p.featured}
                    onChange={(e) =>
                      updatePuppy(p.id, "featured", e.target.checked)
                    }
                  />
                  Featured
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={!!p.sold}
                    onChange={(e) => updatePuppy(p.id, "sold", e.target.checked)}
                  />
                  Sold
                </label>
              </div>

              <div className="admin-gallery-section">
                <div className="admin-section-top">
                  <h4>Gallery Images</h4>
                  <button type="button" onClick={() => addPuppyGalleryImages(p)}>
                    Add Gallery Images
                  </button>
                </div>

                <div className="admin-gallery-grid">
                  {(p.gallery_urls || []).map((url) => (
                    <div className="admin-gallery-item" key={url}>
                      <img src={url} alt="Puppy gallery" />
                      <button
                        type="button"
                        className="danger"
                        onClick={() => removePuppyGalleryImage(p, url)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-pedigree-row">
                <h4>Pedigree PDF</h4>

                {p.pedigree_url ? (
                  <a href={p.pedigree_url} target="_blank" rel="noreferrer">
                    View Current Pedigree
                  </a>
                ) : (
                  <p>No pedigree uploaded</p>
                )}

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => updatePuppyPedigree(p.id, e.target.files[0])}
                />
              </div>

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

            <label className="admin-file-label">Main Stud Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setStudForm({ ...studForm, imageFile: e.target.files[0] })
              }
              required
            />

            <label className="admin-file-label">Extra Gallery Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setStudForm({
                  ...studForm,
                  galleryFiles: Array.from(e.target.files),
                })
              }
            />

            <label className="admin-file-label">Pedigree PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                setStudForm({ ...studForm, pedigreeFile: e.target.files[0] })
              }
            />

            <input
              placeholder="Stud fee"
              value={studForm.fee}
              onChange={(e) => setStudForm({ ...studForm, fee: e.target.value })}
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

            <div className="admin-check-row">
              <label>
                <input
                  type="checkbox"
                  checked={studForm.featured}
                  onChange={(e) =>
                    setStudForm({ ...studForm, featured: e.target.checked })
                  }
                />
                Featured Stud
              </label>
            </div>

            <button type="submit">Add Stud</button>
          </form>

          {studs.map((s) => (
            <article className="admin-card edit-card" key={s.id}>
              {s.image_url && (
                <img className="admin-preview-img" src={s.image_url} alt={s.name} />
              )}

              <label className="admin-file-label">Change Main Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => updateStudMainImage(s.id, e.target.files[0])}
              />

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
                onChange={(e) => updateStud(s.id, "description", e.target.value)}
              />

              <div className="admin-check-row">
                <label>
                  <input
                    type="checkbox"
                    checked={!!s.featured}
                    onChange={(e) =>
                      updateStud(s.id, "featured", e.target.checked)
                    }
                  />
                  Featured
                </label>
              </div>

              <div className="admin-gallery-section">
                <div className="admin-section-top">
                  <h4>Gallery Images</h4>
                  <button type="button" onClick={() => addStudGalleryImages(s)}>
                    Add Gallery Images
                  </button>
                </div>

                <div className="admin-gallery-grid">
                  {(s.gallery_urls || []).map((url) => (
                    <div className="admin-gallery-item" key={url}>
                      <img src={url} alt="Stud gallery" />
                      <button
                        type="button"
                        className="danger"
                        onClick={() => removeStudGalleryImage(s, url)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-pedigree-row">
                <h4>Pedigree PDF</h4>

                {s.pedigree_url ? (
                  <a href={s.pedigree_url} target="_blank" rel="noreferrer">
                    View Current Pedigree
                  </a>
                ) : (
                  <p>No pedigree uploaded</p>
                )}

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => updateStudPedigree(s.id, e.target.files[0])}
                />
              </div>

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