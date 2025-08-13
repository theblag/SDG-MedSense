import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '@/components/navbar';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  orderBy, 
  query, 
  onSnapshot,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { database, auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  Heart, 
  HeartHandshake, 
  MessageCircle, 
  TrendingUp, 
  Clock, 
  User, 
  Plus, 
  X,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Users,
  Award,
  Filter
} from 'lucide-react';

const Community = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [sortBy, setSortBy] = useState('trending');
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
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      }
    };
    fetchUserProfile();
  }, [user]);
  useEffect(() => {
    const postsRef = collection(database, "healthPosts");
    let q;
    
    switch (sortBy) {
      case 'newest':
        q = query(postsRef, orderBy('createdAt', 'desc'));
        break;
      case 'oldest':
        q = query(postsRef, orderBy('createdAt', 'asc'));
        break;
      default:
        q = query(postsRef, orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const upvotes = data.upvotes || [];
        const downvotes = data.downvotes || [];
        const score = upvotes.length - downvotes.length;
        
        postsData.push({
          id: doc.id,
          ...data,
          score,
          upvoteCount: upvotes.length,
          downvoteCount: downvotes.length
        });
      });
      if (sortBy === 'trending') {
        postsData.sort((a, b) => b.score - a.score);
      }

      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [sortBy]);
  const handleSubmitPost = async () => {
    if (!newPost.trim() || !user || !userProfile) return;

    try {
      const postsRef = collection(database, "healthPosts");
      await addDoc(postsRef, {
        content: newPost.trim(),
        authorId: user.uid,
        authorName: userProfile.username || 'Anonymous',
        authorEmail: user.email,
        createdAt: serverTimestamp(),
        upvotes: [],
        downvotes: [],
        comments: []
      });

      setNewPost('');
      setShowPostModal(false);
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };
  const handleVote = async (postId, voteType) => {
    if (!user) return;

    try {
      const postRef = doc(database, "healthPosts", postId);
      const post = posts.find(p => p.id === postId);
      
      const hasUpvoted = post.upvotes?.includes(user.uid);
      const hasDownvoted = post.downvotes?.includes(user.uid);

      if (voteType === 'upvote') {
        if (hasUpvoted) {
          await updateDoc(postRef, {
            upvotes: arrayRemove(user.uid)
          });
        } else {
          const updates = { upvotes: arrayUnion(user.uid) };
          if (hasDownvoted) {
            updates.downvotes = arrayRemove(user.uid);
          }
          await updateDoc(postRef, updates);
        }
      } else {
        if (hasDownvoted) {
          await updateDoc(postRef, {
            downvotes: arrayRemove(user.uid)
          });
        } else {
          const updates = { downvotes: arrayUnion(user.uid) };
          if (hasUpvoted) {
            updates.upvotes = arrayRemove(user.uid);
          }
          await updateDoc(postRef, updates);
        }
      }
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    const now = new Date();
    const postTime = timestamp.toDate();
    const diffInMinutes = Math.floor((now - postTime) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-black">
            <div className="navbar fixed top-[1rem] left-1/2 -translate-x-1/2 z-50 ">
            <NavBar />
      </div>
      <div className="sec2bg">
        <div className="w-[95vw] md:w-[90vw] max-w-6xl mx-auto py-10 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Health{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400">
                Community
              </span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto px-4">
              Share health tips, experiences, and learn from our community of health enthusiasts
            </p>
            <div className="flex justify-center gap-8 mt-8 text-sm">
              <div className="flex items-center gap-2 text-cyan-400">
                <Users size={18} />
                <span>Active Community</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <Heart size={18} />
                <span>Health Tips</span>
              </div>
              <div className="flex items-center gap-2 text-violet-400">
                <Award size={18} />
                <span>Expert Advice</span>
              </div>
            </div>
          </motion.div>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="trending">🔥 Trending</option>
                <option value="newest">🕐 Newest</option>
                <option value="oldest">📅 Oldest</option>
              </select>
            </div>
            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPostModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-violet-600 transition-all duration-200"
              >
                <Plus size={18} />
                Share Health Tip
              </motion.button>
            )}
          </div>
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
                <p className="text-slate-400 mt-4">Loading community posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <Sparkles className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-2">No posts yet!</p>
                <p className="text-slate-500">Be the first to share a health tip with the community.</p>
              </div>
            ) : (
              <AnimatePresence>
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{post.authorName}</p>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Clock size={14} />
                            {formatTimeAgo(post.createdAt)}
                          </div>
                        </div>
                      </div>
                      {post.score > 0 && (
                        <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-sm">
                          <TrendingUp size={14} />
                          +{post.score}
                        </div>
                      )}
                    </div>
                    <div className="mb-6">
                      <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleVote(post.id, 'upvote')}
                        disabled={!user}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                          user && post.upvotes?.includes(user.uid)
                            ? 'bg-green-500/20 text-green-400'
                            : 'hover:bg-slate-800 text-slate-400 hover:text-green-400'
                        }`}
                      >
                        <ThumbsUp size={16} />
                        <span>{post.upvoteCount}</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleVote(post.id, 'downvote')}
                        disabled={!user}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                          user && post.downvotes?.includes(user.uid)
                            ? 'bg-red-500/20 text-red-400'
                            : 'hover:bg-slate-800 text-slate-400 hover:text-red-400'
                        }`}
                      >
                        <ThumbsDown size={16} />
                        <span>{post.downvoteCount}</span>
                      </motion.button>
                      <div className="flex items-center gap-2 px-3 py-2 text-slate-400">
                        <MessageCircle size={16} />
                        <span>0</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-12 p-8 bg-slate-900/50 rounded-xl border border-slate-700"
            >
              <HeartHandshake className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Join Our Health Community</h3>
              <p className="text-slate-400 mb-6">Sign in to share your health tips and vote on posts from other community members.</p>
              <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-violet-600 transition-all duration-200">
                Sign In to Participate
              </button>
            </motion.div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {showPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Share Health Tip</h3>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your health tip, experience, or advice with the community..."
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 resize-none"
                />
                <p className="text-sm text-slate-500 mt-2">
                  {newPost.length}/500 characters
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPostModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPost}
                  disabled={!newPost.trim() || newPost.length > 500}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-lg hover:from-cyan-600 hover:to-violet-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;