"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const [fullname, setFullname] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedFullname = localStorage.getItem("fullname");
    if (storedFullname) setFullname(storedFullname);
  }, []);

  // Centralized function to make protected API calls
  async function protectedFetch(url: string, options: RequestInit = {}) {
    let accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (!accessToken || !refreshToken) {
      throw new Error("Missing tokens. Please log in again.");
    }

    const fetchWithToken = async (token: string) => {
      const res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          ...(options.headers || {}),
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Unauthorized");
      }

      return res.json();
    };

    try {
      // Try request with current access token
      return await fetchWithToken(accessToken);
    } catch (err: any) {
      if (err.message.includes("token expired") || err.message.includes("Unauthorized")) {
        // Try refreshing tokens
        try {
          const refreshRes = await fetch("http://localhost:8080/refresh", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${refreshToken}`,
            },
          });

          if (!refreshRes.ok) {
            const data = await refreshRes.json().catch(() => ({}));
            if (data.error === "relogin") {
              // Redirect to login page if refresh token expired
              localStorage.clear();
              router.push("/");
              return;
            }
            throw new Error(data.error || "Failed to refresh token");
          }

          const refreshData = await refreshRes.json();
          localStorage.setItem("access_token", refreshData.access_token);
          localStorage.setItem("refresh_token", refreshData.refresh_token);

          // Retry the original request with new access token
          return await fetchWithToken(refreshData.access_token);
        } catch (refreshErr: any) {
          throw new Error(refreshErr.message);
        }
      } else {
        throw err;
      }
    }
  }

  async function fetchUsers() {
    setError(null);
    try {
      const data = await protectedFetch("http://localhost:8080/users");
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Welcome, {fullname}!</h1>

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={fetchUsers}
      >
        Click to display all users (Protected Route)
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {users?.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold text-lg mb-2">Users:</h2>
          <ul className="list-disc pl-5">
            {users.map((user: any) => (
              <li key={user.user_id}>{user.fullname} ({user.username})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
