import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const Profile: React.FC = () => {
  const { user, loading } = useAuth();

  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // 🟢 Fetch avatar URL from 'profiles' table on load
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching avatar:', error.message);
      } else if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    };

    fetchAvatar();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('Please select an image to upload.');
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to avatars bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = publicUrlData.publicUrl;

      // Update in profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(publicUrl);
      alert('Avatar updated successfully!');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  // Fallback profile data
  const defaultUserProfile = {
    name: 'Guest User',
    email: 'guest@scholarmate.com',
    memberSince: 'N/A',
    lastLogin: 'N/A',
    learningGoals: 'Log in to set your learning goals!',
    preferredTopics: ['General Knowledge'],
    achievements: ['No achievements yet. Log in to start!'],
  };

  // Profile details
  const currentUserProfile = user
    ? {
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Authenticated User',
        email: user.email || 'N/A',
        memberSince: user.created_at
          ? new Date(user.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'N/A',
        lastLogin: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        learningGoals: 'Master Data Structures and Algorithms, Learn Machine Learning.',
        preferredTopics: ['Computer Science', 'Mathematics', 'Physics'],
        achievements: [
          'Completed "React Fundamentals" Quiz',
          'Scored 95% on "Algorithms Basics" Mock Test',
          'Created 3 Learning Modules',
        ],
      }
    : defaultUserProfile;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-[var(--color-background-secondary)] rounded-2xl shadow-lg fade-in">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-text-accent)]"></div>
        <p className="ml-4 text-xl text-[var(--color-text-secondary)]">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-background-secondary)] p-8 rounded-2xl shadow-lg fade-in max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-[var(--color-text-primary)] text-center">My Profile</h1>

      <div className="flex flex-col items-center mb-8">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover mb-4 border border-[var(--color-border)]"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-[var(--color-background-primary)] flex items-center justify-center mb-4 border border-[var(--color-border)] text-gray-500">
            No Photo
          </div>
        )}

        <label className="bg-[var(--color-button-primary-bg)] hover:bg-[var(--color-button-primary-hover)] text-white font-semibold py-2 px-4 rounded-full text-sm cursor-pointer transition-all duration-300 shadow focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)] focus:ring-offset-2">
          {uploading ? 'Uploading...' : 'Upload Photo'}
          <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
        </label>

        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mt-4">{currentUserProfile.name}</h2>
        <p className="text-md text-[var(--color-text-secondary)]">{currentUserProfile.email}</p>
      </div>

      <div className="space-y-6">
        <div className="bg-[var(--color-background-primary)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">Account Information</h3>
          <p className="text-[var(--color-text-secondary)] mb-2">
            <span className="font-medium text-[var(--color-text-primary)]">Member Since:</span> {currentUserProfile.memberSince}
          </p>
          <p className="text-[var(--color-text-secondary)]">
            <span className="font-medium text-[var(--color-text-primary)]">Last Login:</span> {currentUserProfile.lastLogin}
          </p>
        </div>

        <div className="bg-[var(--color-background-primary)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">Learning Goals</h3>
          <p className="text-[var(--color-text-secondary)]">{currentUserProfile.learningGoals}</p>
        </div>

        <div className="bg-[var(--color-background-primary)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">Preferred Topics</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {currentUserProfile.preferredTopics.map((topic, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: 'var(--color-progress-blue-bg)', color: 'var(--color-progress-blue-text)' }}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[var(--color-background-primary)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">Achievements</h3>
          <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-2">
            {currentUserProfile.achievements.map((achievement, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 text-[var(--color-feature-icon-2)]">&#x2022;</span>
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
