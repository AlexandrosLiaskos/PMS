"use client";

"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ... (rest of the component)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFileName(event.target.files[0].name);
    } else {
      setSelectedFileName(null);
    }
  };

  useEffect(() => {
    async function fetchProfile() {
      if (status === "authenticated") {
        // Initialize userProfile with session data if available
        if (session?.user) {
          setUserProfile({
            id: "", // ID will be updated by API call
            name: session.user.name || null,
            email: session.user.email || '',
            image: session.user.image || null,
          });
        }

        try {
          const response = await fetch("/api/profile");
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          const data = await response.json();
          // Update userProfile with fetched data, merging with existing session data
          setUserProfile((prev) => ({
            ...prev, // Keep existing session data if not overwritten by API
            ...data, // API data takes precedence
          }));
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          }
          // If API fails, and we have session data, keep displaying session data
          if (!session?.user) { // Only set userProfile to null if no session data either
            setUserProfile(null);
          }
        } finally {
          setLoading(false);
        }
      } else if (status === "unauthenticated") {
        setLoading(false);
        setError("Please log in to view your profile.");
      }
    }

    fetchProfile();
  }, [status, session]);

  const handleAvatarUpload = async () => {
    if (!fileInputRef.current?.files?.length) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setError(null);

    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setUserProfile((prev) => (prev ? { ...prev, image: data.imageUrl } : null));
      update(); // Update the session to reflect the new avatar
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold">Loading profile...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold text-red-500">Error: {error}</h1>
      </main>
    );
  }

  if (!userProfile) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold">No profile data found.</h1>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center">
          <div className="relative group mb-4">
            <Avatar className="h-24 w-24 cursor-pointer transition-all duration-300 group-hover:opacity-75">
              <AvatarImage src={userProfile.image ?? ""} />
              <AvatarFallback>{userProfile.name?.charAt(0) || userProfile.email.charAt(0)}</AvatarFallback>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              Change
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">{userProfile.name || userProfile.email}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">{userProfile.email}</p>

          {selectedFileName && (
            <div className="flex flex-col items-center gap-2 mb-4">
              <p className="text-sm text-muted-foreground">Selected: {selectedFileName}</p>
              <Button onClick={handleAvatarUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Avatar"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}