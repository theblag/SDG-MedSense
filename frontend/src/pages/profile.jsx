import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { User, Mail, Edit, Check, X } from 'lucide-react';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const userDocRef = doc(database, "Users", user.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
            setNewUsername(docSnap.data().username || '');
          }
          setLoading(false);
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setError("Failed to load profile data");
          setLoading(false);
        }
      }
    };
    fetchUserProfile();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!newUsername.trim()) {
      setError("Username cannot be empty");
      return;
    }

    try {
      // Update in Firestore
      const userDocRef = doc(database, "Users", user.uid);
      await updateDoc(userDocRef, {
        username: newUsername.trim()
      });

      // Update in Auth (optional)
      await updateProfile(auth.currentUser, {
        displayName: newUsername.trim()
      });

      // Refresh profile data
      const updatedDoc = await getDoc(userDocRef);
      setUserProfile(updatedDoc.data());
      
      setEditMode(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center p-8 bg-slate-900/50 rounded-xl border border-slate-700 max-w-md">
          <User className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Sign In Required</h3>
          <p className="text-slate-400 mb-6">Please sign in to view your profile.</p>
          <button 
            onClick={() => window.location.href = '/signin'}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-violet-600 transition-all duration-200"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="sec2bg">
        <div className="w-[95vw] md:w-[90vw] max-w-4xl mx-auto py-10 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400">
                Profile
              </span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto px-4">
              Manage your account information and preferences
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 md:p-8 hover:border-slate-600 transition-all duration-300 max-w-2xl mx-auto"
          >
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              
              {editMode ? (
                <div className="flex items-center gap-3 w-full max-w-xs">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                    maxLength={30}
                  />
                  <button
                    onClick={handleUpdateProfile}
                    className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setNewUsername(userProfile.username || '');
                    }}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-white">
                    {userProfile?.username || 'Anonymous'}
                  </h2>
                  <button
                    onClick={() => setEditMode(true)}
                    className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 hover:text-cyan-400 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-medium text-slate-400">Email Address</h3>
                </div>
                <p className="text-white ml-8">{user?.email || 'Not available'}</p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h3 className="text-sm font-medium text-slate-400 mb-2">Account Created</h3>
                <p className="text-white">
                  {user?.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Unknown date'}
                </p>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-3 bg-red-500/20 text-red-400 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-3 bg-green-500/20 text-green-400 rounded-lg text-sm"
              >
                {success}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;