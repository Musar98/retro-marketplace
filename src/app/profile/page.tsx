"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { supabaseClient } from "@/lib/SupabaseClient";
import { useRouter } from "next/navigation";
import {
  containerStyle,
  inputStyle,
  removeButtonStyle,
  saveButtonStyle,
  subTitleStyle,
  titleStyle,
  uploadLabelStyle,
} from "@/app/profile/Styles";
import Loading from "@/components/Loading";

type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  settings: {
    email_visibility?: "public" | "private";
  };
};

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [emailVisibility, setEmailVisibility] = useState<"public" | "private">(
    "private",
  );
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
        error: userErr,
      } = await supabaseClient.auth.getUser();

      if (userErr || !user) {
        router.push("/auth");
        return;
      }

      setEmail(user.email ?? null);

      const { data: prof, error: profErr } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profErr) setError(profErr.message);
      else if (prof) {
        setProfile(prof as Profile);
        setUsername(prof.username ?? "");
        setEmailVisibility(prof.settings?.email_visibility ?? "private");
      }

      setLoading(false);
    })();
  }, [router]);

  const handleFileChange = (file: File) => {
    setAvatarFile(file);
    setRemoveAvatar(false);
  };

  const handleRemoveClick = () => {
    setAvatarFile(null);
    setRemoveAvatar(true);
  };

  const uploadAvatar = async (file: File, userId: string) => {
    const ext = file.name.split(".").pop();
    const fileName = `avatar.${ext}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabaseClient.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabaseClient.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const deleteAvatar = async (avatarUrl: string | null) => {
    if (!avatarUrl) return;

    try {
      const urlParts = avatarUrl.split("avatars/");
      if (urlParts.length < 2) {
        console.error("Invalid avatar URL format:", avatarUrl);
        return;
      }
      const filePath = urlParts[1];

      const { error } = await supabaseClient.storage
        .from("avatars")
        .remove([filePath]);

      if (error) {
        console.error("Failed to delete avatar:", error.message);
      } else {
        console.log("Avatar deleted successfully.");
      }
    } catch (err: any) {
      console.error("Error during avatar deletion:", err.message);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setError(null);
    setMessage(null);

    try {
      let avatarUrl = profile.avatar_url;

      if (removeAvatar) {
        if (profile.avatar_url) {
          await deleteAvatar(profile.avatar_url);
        }
        avatarUrl = null;
      }

      if (avatarFile) {
        if (profile.avatar_url) {
          await deleteAvatar(profile.avatar_url);
        }
        avatarUrl = await uploadAvatar(avatarFile, profile.id);
      }

      const newSettings = {
        ...profile.settings,
        email_visibility: emailVisibility,
      };

      const { error: updateErr } = await supabaseClient
        .from("profiles")
        .update({ username, settings: newSettings, avatar_url: avatarUrl })
        .eq("id", profile.id);

      if (updateErr) throw updateErr;

      setProfile({
        ...profile,
        username,
        settings: newSettings,
        avatar_url: avatarUrl,
      });

      setAvatarFile(null);
      setRemoveAvatar(false);
      setMessage("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    }
  };

  if (loading) {
    return <Loading loadingText={"Loading profile..."} />;
  }

  if (!profile) return <p style={{ color: "red" }}>No profile found.</p>;

  const avatarToShow = avatarFile
    ? URL.createObjectURL(avatarFile)
    : !removeAvatar
      ? profile.avatar_url
      : null;

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Your Profile</h1>

      <label style={uploadLabelStyle}>
        {avatarToShow ? (
          <>
            <Image
              src={avatarToShow}
              alt="avatar"
              width={100}
              height={100}
              style={{ borderRadius: "50%" }}
              unoptimized
            />
            <button
              type="button"
              onClick={handleRemoveClick}
              style={removeButtonStyle}
            >
              ✕
            </button>
          </>
        ) : (
          <span>Click to select profile image</span>
        )}
        {!avatarToShow && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files?.[0] && handleFileChange(e.target.files[0])
            }
            style={{ display: "none" }}
          />
        )}
      </label>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ color: "#cfcfcf", marginRight: "0.5rem" }}>
          Username:
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />
      </div>

      <p style={{ color: "#cfcfcf", marginBottom: "0.5rem" }}>
        <strong>Email:</strong>{" "}
        {email && emailVisibility === "public" ? email : "Hidden"}
      </p>

      <div style={{ marginTop: "1.5rem" }}>
        <h2 style={subTitleStyle}>Settings</h2>
        <label style={{ color: "#cfcfcf" }}>
          Email visibility:
          <select
            value={emailVisibility}
            onChange={(e) =>
              setEmailVisibility(e.target.value as "public" | "private")
            }
            style={inputStyle}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </label>
      </div>

      {message && (
        <p style={{ color: "#00ff00", marginTop: "1rem" }}>{message}</p>
      )}
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      <button onClick={handleSave} style={saveButtonStyle}>
        Save
      </button>
    </div>
  );
}
