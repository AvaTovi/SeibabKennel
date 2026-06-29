import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./Admin.css";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "";
const ADMIN_SESSION_KEY = "seibabAdminSession";
const ADMIN_SESSION_LENGTH_MS = 8 * 60 * 60 * 1000;

const getSavedAdminSession = () => {
  try {
    const savedSession = JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY));
    return savedSession && savedSession.expiresAt > Date.now();
  } catch {
    return false;
  }
};

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("messages");

  const [messages, setMessages] = useState([]);
  const [puppies, setPuppies] = useState([]);
  const [studs, setStuds] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [breedings, setBreedings] = useState([]);
  const [depositRequests, setDepositRequests] = useState([]);

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

  const [updateForm, setUpdateForm] = useState({
    title: "",
    tag: "Announcement",
    description: "",
    imageFile: null,
    buttonText: "Learn More",
    redirectPath: "/whats-new",
    active: true,
    featured: false,
  });

  const [breedingForm, setBreedingForm] = useState({
    title: "",
    imageFile: null,
    sire: "",
    sireImageFile: null,
    dam: "",
    damImageFile: null,
    expectedDate: "",
    status: "Upcoming",
    description: "",
    active: true,
    featured: false,
  });

  useEffect(() => {
    setIsLoggedIn(getSavedAdminSession());
    fetchMessages();
    fetchPuppies();
    fetchStuds();
    fetchReviews();
    fetchUpdates();
    fetchBreedings();
    fetchDepositRequests();
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

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("Reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setReviews(data || []);
  };

  const fetchUpdates = async () => {
    const { data, error } = await supabase
      .from("WhatsNew")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setUpdates(data || []);
  };

  const fetchBreedings = async () => {
    const { data, error } = await supabase
      .from("UpcomingBreedings")
      .select("*")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (!error) setBreedings(data || []);
  };

  const fetchDepositRequests = async () => {
    const { data, error } = await supabase
      .from("DepositRequests")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setDepositRequests(data || []);
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

    if (!ADMIN_PASSWORD) {
      alert("Admin password is not set. Add VITE_ADMIN_PASSWORD to your .env file and restart the site.");
      return;
    }

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(
        ADMIN_SESSION_KEY,
        JSON.stringify({ expiresAt: Date.now() + ADMIN_SESSION_LENGTH_MS })
      );
      setIsLoggedIn(true);
      setPassword("");
    } else {
      alert("Incorrect password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
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

  const approveReview = async (id, approved) => {
    const { error } = await supabase
      .from("Reviews")
      .update({ approved })
      .eq("id", id);

    if (error) {
      alert(`Review update failed: ${error.message}`);
      return;
    }

    fetchReviews();
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    const { error } = await supabase.from("Reviews").delete().eq("id", id);

    if (error) {
      alert(`Review delete failed: ${error.message}`);
      return;
    }

    fetchReviews();
  };

  const addUpdate = async (e) => {
    e.preventDefault();

    const imageUrl = await uploadFile(updateForm.imageFile, "whats-new");

    const { error } = await supabase.from("WhatsNew").insert([
      {
        title: updateForm.title,
        tag: updateForm.tag,
        description: updateForm.description,
        image_url: imageUrl,
        button_text: updateForm.buttonText,
        redirect_path: updateForm.redirectPath,
        active: updateForm.active,
        featured: updateForm.featured,
      },
    ]);

    if (error) {
      alert(`Failed to add update: ${error.message}`);
      return;
    }

    alert("What's New update added successfully!");

    setUpdateForm({
      title: "",
      tag: "Announcement",
      description: "",
      imageFile: null,
      buttonText: "Learn More",
      redirectPath: "/whats-new",
      active: true,
      featured: false,
    });

    fetchUpdates();
  };

  const updateWhatsNew = async (id, field, value) => {
    const { error } = await supabase
      .from("WhatsNew")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      alert(`Update failed: ${error.message}`);
      return;
    }

    fetchUpdates();
  };

  const updateWhatsNewImage = async (id, file) => {
    const imageUrl = await uploadFile(file, "whats-new");
    if (!imageUrl) return;

    await updateWhatsNew(id, "image_url", imageUrl);
  };

  const deleteWhatsNew = async (id) => {
    if (!window.confirm("Delete this update?")) return;

    const { error } = await supabase.from("WhatsNew").delete().eq("id", id);

    if (error) {
      alert(`Delete failed: ${error.message}`);
      return;
    }

    fetchUpdates();
  };

  const addBreeding = async (e) => {
    e.preventDefault();

    const imageUrl = await uploadFile(
      breedingForm.imageFile,
      "upcoming-breedings/main"
    );

    const sireImageUrl = await uploadFile(
      breedingForm.sireImageFile,
      "upcoming-breedings/sire"
    );

    const damImageUrl = await uploadFile(
      breedingForm.damImageFile,
      "upcoming-breedings/dam"
    );

    const { error } = await supabase.from("UpcomingBreedings").insert([
      {
        title: breedingForm.title,
        image_url: imageUrl,
        sire: breedingForm.sire,
        sire_image_url: sireImageUrl,
        dam: breedingForm.dam,
        dam_image_url: damImageUrl,
        expected_date: breedingForm.expectedDate,
        status: breedingForm.status,
        description: breedingForm.description,
        active: breedingForm.active,
        featured: breedingForm.featured,
      },
    ]);

    if (error) {
      alert(`Failed to add upcoming breeding: ${error.message}`);
      return;
    }

    alert("Upcoming breeding added successfully!");

    setBreedingForm({
      title: "",
      imageFile: null,
      sire: "",
      sireImageFile: null,
      dam: "",
      damImageFile: null,
      expectedDate: "",
      status: "Upcoming",
      description: "",
      active: true,
      featured: false,
    });

    fetchBreedings();
    fetchDepositRequests();
  };

  const updateBreeding = async (id, field, value) => {
    const { error } = await supabase
      .from("UpcomingBreedings")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      alert(`Update failed: ${error.message}`);
      return;
    }

    fetchBreedings();
    fetchDepositRequests();
  };

  const updateBreedingImage = async (id, file) => {
    const imageUrl = await uploadFile(file, "upcoming-breedings/main");
    if (!imageUrl) return;

    await updateBreeding(id, "image_url", imageUrl);
  };

  const updateBreedingSireImage = async (id, file) => {
    const imageUrl = await uploadFile(file, "upcoming-breedings/sire");
    if (!imageUrl) return;

    await updateBreeding(id, "sire_image_url", imageUrl);
  };

  const updateBreedingDamImage = async (id, file) => {
    const imageUrl = await uploadFile(file, "upcoming-breedings/dam");
    if (!imageUrl) return;

    await updateBreeding(id, "dam_image_url", imageUrl);
  };

  const deleteBreeding = async (id) => {
    if (!window.confirm("Delete this upcoming breeding?")) return;

    const { error } = await supabase
      .from("UpcomingBreedings")
      .delete()
      .eq("id", id);

    if (error) {
      alert(`Delete failed: ${error.message}`);
      return;
    }

    fetchBreedings();
    fetchDepositRequests();
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

    const pedigreeUrl = await uploadFile(
      studForm.pedigreeFile,
      "studs/pedigrees"
    );

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

  const updateDepositStatus = async (id, status) => {
    const { error } = await supabase
      .from("DepositRequests")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert(`Deposit status update failed: ${error.message}`);
      return;
    }

    fetchDepositRequests();
  };

  const deleteDepositRequest = async (id) => {
    if (!window.confirm("Delete this deposit request?")) return;

    const { error } = await supabase
      .from("DepositRequests")
      .delete()
      .eq("id", id);

    if (error) {
      alert(`Deposit request delete failed: ${error.message}`);
      return;
    }

    fetchDepositRequests();
  };

  const createEmailLink = (email, subject, body) => {
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getInquiryEmailBody = (name, originalMessage) => {
    return `Hi ${name},

Thank you for reaching out to Seibab Kennel.

I received your inquiry and wanted to follow up with you. Before moving forward, I would like to learn a little more about your home, experience with dogs, and what you are looking for so we can make sure this is the right fit.

I will send over a few questions shortly. In the meantime, feel free to reply with anything else you would like me to know.

Original inquiry:
${originalMessage || "No message provided"}

Thank you,
Seibab Kennel`;
  };

  const getDepositEmailBody = (request) => {
    return `Hi ${request.name},

Thank you for submitting a deposit request with Seibab Kennel.

I received your request and wanted to follow up before moving forward with deposit/payment details.

Deposit request details:
Interested in: ${request.interested_in || "Not provided"}
Interest type: ${request.interest_type || "Not provided"}
Deposit type: ${request.deposit_type || "Not provided"}
Phone: ${request.phone || "Not provided"}

Before we move forward, I may ask a few buyer questions to make sure this is a good fit and to confirm the next steps.

Thank you,
Seibab Kennel`;
  };

  const getReviewEmailBody = (review) => {
    return `Hi ${review.name},

Thank you for taking the time to leave a review for Seibab Kennel. I appreciate your feedback and support.

Thank you,
Seibab Kennel`;
  };

  if (!isLoggedIn) {
    return (
      <main className="admin-login-page">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <p className="eyebrow">Admin Login</p>
          <h1>Seibab Kennel Admin</h1>
          <p>
            Manage messages, puppies, studs, reviews, updates, upcoming breedings, deposit requests, and website
            information.
          </p>

          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Log In</button>
          <small>Admin sessions expire after 8 hours. Set the password in your .env file.</small>
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
          <h3>Reviews</h3>
          <p>{reviews.length}</p>
        </div>

        <div>
          <h3>Updates</h3>
          <p>{updates.length}</p>
        </div>

        <div>
          <h3>Breedings</h3>
          <p>{breedings.length}</p>
        </div>

        <div>
          <h3>Deposits</h3>
          <p>{depositRequests.length}</p>
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
          className={activeTab === "updates" ? "active" : ""}
          onClick={() => setActiveTab("updates")}
        >
          What&apos;s New
        </button>

        <button
          className={activeTab === "breedings" ? "active" : ""}
          onClick={() => setActiveTab("breedings")}
        >
          Upcoming Breedings
        </button>

        <button
          className={activeTab === "deposits" ? "active" : ""}
          onClick={() => setActiveTab("deposits")}
        >
          Deposit Requests
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

        <button
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
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
                    href={createEmailLink(
                      msg.email,
                      "Seibab Kennel Inquiry Follow-Up",
                      getInquiryEmailBody(msg.name, msg.message)
                    )}
                  >
                    Email Customer
                  </a>

                  <button onClick={() => updateMessageStatus(msg.id, "New")}>
                    Mark New
                  </button>

                  <button
                    onClick={() => updateMessageStatus(msg.id, "In Progress")}
                  >
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

      {activeTab === "updates" && (
        <section className="admin-panel">
          <h2>Manage What&apos;s New</h2>

          <form className="admin-form" onSubmit={addUpdate}>
            <input
              placeholder="Update title"
              value={updateForm.title}
              onChange={(e) =>
                setUpdateForm({ ...updateForm, title: e.target.value })
              }
              required
            />

            <select
              value={updateForm.tag}
              onChange={(e) =>
                setUpdateForm({ ...updateForm, tag: e.target.value })
              }
            >
              <option>Announcement</option>
              <option>New Puppy</option>
              <option>New Stud</option>
              <option>Breed News</option>
              <option>Upcoming Litter</option>
              <option>Event</option>
              <option>Important Update</option>
            </select>

            <textarea
              placeholder="Description"
              value={updateForm.description}
              onChange={(e) =>
                setUpdateForm({ ...updateForm, description: e.target.value })
              }
              required
            />

            <label className="admin-file-label">Optional Update Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setUpdateForm({ ...updateForm, imageFile: e.target.files[0] })
              }
            />

            <input
              placeholder="Button text"
              value={updateForm.buttonText}
              onChange={(e) =>
                setUpdateForm({ ...updateForm, buttonText: e.target.value })
              }
            />

            <select
              value={updateForm.redirectPath}
              onChange={(e) =>
                setUpdateForm({ ...updateForm, redirectPath: e.target.value })
              }
            >
              <option value="/whats-new">What&apos;s New Page</option>
              <option value="/available-puppies">Available Puppies</option>
              <option value="/studs">Studs</option>
              <option value="/contact">Contact</option>
              <option value="/about">About</option>
            </select>

            <div className="admin-check-row">
              <label>
                <input
                  type="checkbox"
                  checked={updateForm.active}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, active: e.target.checked })
                  }
                />
                Active
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={updateForm.featured}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, featured: e.target.checked })
                  }
                />
                Featured
              </label>
            </div>

            <button type="submit">Add Update</button>
          </form>

          {updates.length === 0 ? (
            <div className="empty-box">
              <h3>No updates yet</h3>
              <p>What&apos;s New posts will appear here.</p>
            </div>
          ) : (
            updates.map((item) => (
              <article className="admin-card edit-card" key={item.id}>
                {item.image_url && (
                  <img
                    className="admin-preview-img"
                    src={item.image_url}
                    alt={item.title}
                  />
                )}

                <label className="admin-file-label">Change Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    updateWhatsNewImage(item.id, e.target.files[0])
                  }
                />

                <input
                  value={item.title || ""}
                  onChange={(e) =>
                    updateWhatsNew(item.id, "title", e.target.value)
                  }
                />

                <select
                  value={item.tag || "Announcement"}
                  onChange={(e) =>
                    updateWhatsNew(item.id, "tag", e.target.value)
                  }
                >
                  <option>Announcement</option>
                  <option>New Puppy</option>
                  <option>New Stud</option>
                  <option>Breed News</option>
                  <option>Upcoming Litter</option>
                  <option>Event</option>
                  <option>Important Update</option>
                </select>

                <textarea
                  value={item.description || ""}
                  onChange={(e) =>
                    updateWhatsNew(item.id, "description", e.target.value)
                  }
                />

                <input
                  value={item.button_text || ""}
                  onChange={(e) =>
                    updateWhatsNew(item.id, "button_text", e.target.value)
                  }
                />

                <select
                  value={item.redirect_path || "/whats-new"}
                  onChange={(e) =>
                    updateWhatsNew(item.id, "redirect_path", e.target.value)
                  }
                >
                  <option value="/whats-new">What&apos;s New Page</option>
                  <option value="/available-puppies">Available Puppies</option>
                  <option value="/studs">Studs</option>
                  <option value="/contact">Contact</option>
                  <option value="/about">About</option>
                </select>

                <div className="admin-check-row">
                  <label>
                    <input
                      type="checkbox"
                      checked={!!item.active}
                      onChange={(e) =>
                        updateWhatsNew(item.id, "active", e.target.checked)
                      }
                    />
                    Active
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={!!item.featured}
                      onChange={(e) =>
                        updateWhatsNew(item.id, "featured", e.target.checked)
                      }
                    />
                    Featured
                  </label>
                </div>

                <button
                  className="danger"
                  onClick={() => deleteWhatsNew(item.id)}
                >
                  Delete Update
                </button>
              </article>
            ))
          )}
        </section>
      )}


      {activeTab === "breedings" && (
        <section className="admin-panel">
          <h2>Manage Upcoming Breedings</h2>

          <form className="admin-form" onSubmit={addBreeding}>
            <input
              placeholder="Breeding title, example: King x Luna Summer Litter"
              value={breedingForm.title}
              onChange={(e) =>
                setBreedingForm({ ...breedingForm, title: e.target.value })
              }
              required
            />

            <label className="admin-file-label">Optional Breeding Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setBreedingForm({
                  ...breedingForm,
                  imageFile: e.target.files[0],
                })
              }
            />

            <input
              placeholder="Sire / Male"
              value={breedingForm.sire}
              onChange={(e) =>
                setBreedingForm({ ...breedingForm, sire: e.target.value })
              }
            />

            <label className="admin-file-label">Sire / Male Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setBreedingForm({
                  ...breedingForm,
                  sireImageFile: e.target.files[0],
                })
              }
            />

            <input
              placeholder="Dam / Female"
              value={breedingForm.dam}
              onChange={(e) =>
                setBreedingForm({ ...breedingForm, dam: e.target.value })
              }
            />

            <label className="admin-file-label">Dam / Female Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setBreedingForm({
                  ...breedingForm,
                  damImageFile: e.target.files[0],
                })
              }
            />

            <input
              placeholder="Expected date, example: Summer 2026 or July 2026"
              value={breedingForm.expectedDate}
              onChange={(e) =>
                setBreedingForm({
                  ...breedingForm,
                  expectedDate: e.target.value,
                })
              }
            />

            <select
              value={breedingForm.status}
              onChange={(e) =>
                setBreedingForm({ ...breedingForm, status: e.target.value })
              }
            >
              <option>Upcoming</option>
              <option>Confirmed</option>
              <option>Pregnancy Confirmed</option>
              <option>Born</option>
              <option>Waitlist Open</option>
              <option>Closed</option>
            </select>

            <textarea
              placeholder="Describe this upcoming breeding, expected colors, structure, temperament, or waitlist details."
              value={breedingForm.description}
              onChange={(e) =>
                setBreedingForm({
                  ...breedingForm,
                  description: e.target.value,
                })
              }
              required
            />

            <div className="admin-check-row">
              <label>
                <input
                  type="checkbox"
                  checked={breedingForm.active}
                  onChange={(e) =>
                    setBreedingForm({
                      ...breedingForm,
                      active: e.target.checked,
                    })
                  }
                />
                Active
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={breedingForm.featured}
                  onChange={(e) =>
                    setBreedingForm({
                      ...breedingForm,
                      featured: e.target.checked,
                    })
                  }
                />
                Featured
              </label>
            </div>

            <button type="submit">Add Upcoming Breeding</button>
          </form>

          {breedings.length === 0 ? (
            <div className="empty-box">
              <h3>No upcoming breedings yet</h3>
              <p>Upcoming breeding posts will appear here.</p>
            </div>
          ) : (
            breedings.map((breeding) => (
              <article className="admin-card edit-card" key={breeding.id}>
                {breeding.image_url && (
                  <img
                    className="admin-preview-img"
                    src={breeding.image_url}
                    alt={breeding.title}
                  />
                )}

                <label className="admin-file-label">Change Main Breeding Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    updateBreedingImage(breeding.id, e.target.files[0])
                  }
                />

                <div className="admin-gallery-section">
                  <h4>Sire and Dam Pictures</h4>

                  <div className="admin-gallery-grid">
                    <div className="admin-gallery-item">
                      {breeding.sire_image_url && (
                        <img src={breeding.sire_image_url} alt={breeding.sire || "Sire"} />
                      )}
                      <label className="admin-file-label">Change Sire Picture</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          updateBreedingSireImage(
                            breeding.id,
                            e.target.files[0]
                          )
                        }
                      />
                    </div>

                    <div className="admin-gallery-item">
                      {breeding.dam_image_url && (
                        <img src={breeding.dam_image_url} alt={breeding.dam || "Dam"} />
                      )}
                      <label className="admin-file-label">Change Dam Picture</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          updateBreedingDamImage(
                            breeding.id,
                            e.target.files[0]
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <input
                  value={breeding.title || ""}
                  onChange={(e) =>
                    updateBreeding(breeding.id, "title", e.target.value)
                  }
                />

                <input
                  value={breeding.sire || ""}
                  placeholder="Sire / Male"
                  onChange={(e) =>
                    updateBreeding(breeding.id, "sire", e.target.value)
                  }
                />

                <input
                  value={breeding.dam || ""}
                  placeholder="Dam / Female"
                  onChange={(e) =>
                    updateBreeding(breeding.id, "dam", e.target.value)
                  }
                />

                <input
                  value={breeding.expected_date || ""}
                  placeholder="Expected date"
                  onChange={(e) =>
                    updateBreeding(
                      breeding.id,
                      "expected_date",
                      e.target.value
                    )
                  }
                />

                <select
                  value={breeding.status || "Upcoming"}
                  onChange={(e) =>
                    updateBreeding(breeding.id, "status", e.target.value)
                  }
                >
                  <option>Upcoming</option>
                  <option>Confirmed</option>
                  <option>Pregnancy Confirmed</option>
                  <option>Born</option>
                  <option>Waitlist Open</option>
                  <option>Closed</option>
                </select>

                <textarea
                  value={breeding.description || ""}
                  onChange={(e) =>
                    updateBreeding(
                      breeding.id,
                      "description",
                      e.target.value
                    )
                  }
                />

                <div className="admin-check-row">
                  <label>
                    <input
                      type="checkbox"
                      checked={!!breeding.active}
                      onChange={(e) =>
                        updateBreeding(
                          breeding.id,
                          "active",
                          e.target.checked
                        )
                      }
                    />
                    Active
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={!!breeding.featured}
                      onChange={(e) =>
                        updateBreeding(
                          breeding.id,
                          "featured",
                          e.target.checked
                        )
                      }
                    />
                    Featured
                  </label>
                </div>

                <button
                  className="danger"
                  onClick={() => deleteBreeding(breeding.id)}
                >
                  Delete Upcoming Breeding
                </button>
              </article>
            ))
          )}
        </section>
      )}


      {activeTab === "deposits" && (
        <section className="admin-panel">
          <h2>Deposit Requests</h2>

          {depositRequests.length === 0 ? (
            <div className="empty-box">
              <h3>No deposit requests yet</h3>
              <p>Buyer deposit requests will appear here.</p>
            </div>
          ) : (
            depositRequests.map((request) => (
              <article className="admin-card" key={request.id}>
                <div className="card-top">
                  <div>
                    <h3>{request.name}</h3>
                    <p>{request.email}</p>
                    <p>{request.phone}</p>
                    <small>{new Date(request.created_at).toLocaleString()}</small>
                  </div>

                  <span className="status-pill">{request.status}</span>
                </div>

                <div className="message-box">
                  <p>
                    <strong>Interested In:</strong> {request.interested_in}
                  </p>
                  <p>
                    <strong>Interest Type:</strong> {request.interest_type}
                  </p>
                  <p>
                    <strong>Deposit Type:</strong> {request.deposit_type}
                  </p>
                  <p>
                    <strong>Message:</strong>
                  </p>
                  <p>{request.message}</p>
                </div>

                <div className="action-row">
                  <a
                    className="email-customer-button"
                    href={createEmailLink(
                      request.email,
                      "Seibab Kennel Deposit Request Follow-Up",
                      getDepositEmailBody(request)
                    )}
                  >
                    Email Customer
                  </a>

                  <button
                    onClick={() => updateDepositStatus(request.id, "New")}
                  >
                    Mark New
                  </button>

                  <button
                    onClick={() => updateDepositStatus(request.id, "Contacted")}
                  >
                    Contacted
                  </button>

                  <button
                    onClick={() =>
                      updateDepositStatus(request.id, "Pending Payment")
                    }
                  >
                    Pending Payment
                  </button>

                  <button
                    onClick={() =>
                      updateDepositStatus(request.id, "Deposit Received")
                    }
                  >
                    Deposit Received
                  </button>

                  <button
                    onClick={() => updateDepositStatus(request.id, "Closed")}
                  >
                    Closed
                  </button>

                  <button
                    className="danger"
                    onClick={() => deleteDepositRequest(request.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      )}

      {activeTab === "reviews" && (
        <section className="admin-panel">
          <h2>Customer Reviews</h2>

          {reviews.length === 0 ? (
            <div className="empty-box">
              <h3>No reviews yet</h3>
              <p>Customer reviews and feedback will appear here.</p>
            </div>
          ) : (
            reviews.map((review) => (
              <article className="admin-card" key={review.id}>
                <div className="card-top">
                  <div>
                    <h3>{review.name}</h3>
                    <p>{review.email}</p>
                    <small>{new Date(review.created_at).toLocaleString()}</small>
                  </div>

                  <span className="status-pill">
                    {review.rating} Star{review.rating > 1 ? "s" : ""}
                  </span>
                </div>

                {review.image_url && (
                  <img
                    className="admin-preview-img"
                    src={review.image_url}
                    alt={review.name}
                  />
                )}

                <div className="message-box">{review.review}</div>

                <p>
                  <strong>Status:</strong>{" "}
                  {review.approved ? "Featured on website" : "Admin only"}
                </p>

                <div className="action-row">
                  <a
                    className="email-customer-button"
                    href={createEmailLink(
                      review.email,
                      "Thank You From Seibab Kennel",
                      getReviewEmailBody(review)
                    )}
                  >
                    Email Customer
                  </a>

                  {review.rating === 5 && (
                    <>
                      <button onClick={() => approveReview(review.id, true)}>
                        Feature Review
                      </button>

                      <button onClick={() => approveReview(review.id, false)}>
                        Hide Review
                      </button>
                    </>
                  )}

                  <button
                    className="danger"
                    onClick={() => deleteReview(review.id)}
                  >
                    Delete Review
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
              Extra Gallery Images: hold Command ⌘ and click multiple photos
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
                <img
                  className="admin-preview-img"
                  src={p.image_url}
                  alt={p.name}
                />
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
                <img
                  className="admin-preview-img"
                  src={s.image_url}
                  alt={s.name}
                />
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