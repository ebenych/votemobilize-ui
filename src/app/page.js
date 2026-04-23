"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [contacts, setContacts] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [data, setData] = useState({ campaigns: [] });

  const API = "https://api.votemobilize.ng"; // change later when live

  async function loadDashboard() {
    const res = await fetch(`${API}/dashboard`);
    const json = await res.json();
    setData(json);
  }

  async function addContacts() {
    await fetch(`${API}/add-contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numbers: contacts }),
    });
    alert("Contacts added");
    loadDashboard();
  }

  async function createCampaign() {
    await fetch(`${API}/create-campaign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });
    alert("Campaign created");
    loadDashboard();
  }

  async function sendCampaign(id) {
    await fetch(`${API}/send-campaign/${id}`, {
      method: "POST",
    });
    alert("Campaign started");
    loadDashboard();
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-3xl mb-6 text-green-500">VoteMobilize NG</h1>

      <div className="grid grid-cols-3 gap-4">

        {/* CONTACTS */}
        <div className="bg-gray-900 p-4 rounded">
          <h3>Add Contacts</h3>
          <textarea
            className="w-full p-2 text-black"
            rows="5"
            value={contacts}
            onChange={(e) => setContacts(e.target.value)}
          />
          <button onClick={addContacts} className="bg-green-500 w-full mt-2 p-2">
            Upload
          </button>
        </div>

        {/* CREATE CAMPAIGN */}
        <div className="bg-gray-900 p-4 rounded">
          <h3>Create Campaign</h3>
          <input
            className="w-full p-2 text-black"
            placeholder="Campaign name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            className="w-full p-2 text-black mt-2"
            rows="4"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={createCampaign} className="bg-green-500 w-full mt-2 p-2">
            Create
          </button>
        </div>

        {/* STATS */}
        <div className="bg-gray-900 p-4 rounded">
          <h3>Stats</h3>
          <p>Total Contacts: {data.totalContacts}</p>
          <p>Total Campaigns: {data.totalCampaigns}</p>
        </div>

      </div>

      {/* CAMPAIGNS */}
      <div className="mt-6">
        <h2>Campaigns</h2>

        {data.campaigns.map((c) => {
          const percent = c.total ? Math.round((c.sent / c.total) * 100) : 0;

          return (
            <div key={c.id} className="bg-gray-900 p-4 mt-3 rounded">
              <b>{c.name}</b>
              <p>Status: {c.status}</p>
              <p>{c.sent}/{c.total}</p>

              <div className="w-full bg-gray-700 h-2 mt-2">
                <div
                  className="bg-green-500 h-2"
                  style={{ width: percent + "%" }}
                ></div>
              </div>

              <button
                onClick={() => sendCampaign(c.id)}
                className="bg-green-500 mt-2 p-2"
              >
                Send Campaign
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
