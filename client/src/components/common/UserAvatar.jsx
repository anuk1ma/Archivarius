import { useState } from "react";

export default function UserAvatar({ user, size = "md" }) {
  const [hasError, setHasError] = useState(false);
  const name = user?.name || "User";
  const initial = name.trim().charAt(0).toUpperCase() || "U";
  const showImage = user?.avatar_url && !hasError;

  return (
    <div className={`user-avatar user-avatar--${size}`}>
      {showImage ? (
        <img src={user.avatar_url} alt={name} onError={() => setHasError(true)} />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}
