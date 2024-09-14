import { FiX } from "react-icons/fi";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string | null;
  onSignOut: () => void;
  onUpdateName: (newName: string) => Promise<void>;
}

export default function SettingsModal({ isOpen, onClose, username, onSignOut, onUpdateName }: SettingsModalProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const [newName, setNewName] = useState(username || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCreateAccount = () => {
    router.push("/auth");
    onClose();
  };

  const handleSignOut = () => {
    onSignOut();
    onClose();
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleEditName = () => {
    setIsEditing(true);
  };

  const handleSaveName = async () => {
    if (newName.trim() === username) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdateName(newName.trim());
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update name:", error);
      // Optionally, show an error message to the user
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg p-10 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Profile Settings</h2>
          <button aria-label="Close" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX className="text-3xl" />
          </button>
        </div>
        <div className="space-y-8">
          {username ? (
            <>
              <div className="space-y-4">
                {isEditing ? (
                  <div className="flex flex-col space-y-4">
                    <input
                      aria-label="Edit Name"
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="border-2 border-gray-300 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={isUpdating}
                      placeholder="Enter your new name"
                    />
                    <div className="flex space-x-4">
                      <button
                        onClick={handleSaveName}
                        className="flex-grow text-white bg-black rounded-md px-4 py-2 transition-colors text-lg hover:bg-gray-800"
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-grow text-black bg-gray-200 rounded-md px-4 py-2 transition-colors text-lg hover:bg-gray-300"
                        disabled={isUpdating}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-xl">Hi, {username}!</p>
                    <button
                      onClick={handleEditName}
                      className="text-white bg-black rounded-md px-4 py-2 transition-colors text-lg hover:bg-gray-800"
                    >
                      Edit Name
                    </button>
                  </div>
                )}
                <p className="text-base text-gray-500">Your progress is being saved.</p>
              </div>
              
            </>
          ) : (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Create an Account</h3>
              <p className="text-base text-gray-600">Sign up to save your progress and access more features.</p>
              <button
                onClick={handleCreateAccount}
                className="w-full bg-black text-white py-3 px-6 rounded-md text-lg hover:bg-gray-800 transition-colors"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
        {username && (
          <div className="mt-10 pt-6 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white py-2 px-4 text-base rounded-md hover:bg-red-500 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}