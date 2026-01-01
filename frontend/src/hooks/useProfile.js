/**
 * HI AI-APP.COM - Profile Hook
 * React hook for fetching and managing Doers Profile data
 */

import { useState, useEffect, useCallback } from 'react';
import { profileAPI } from '@/services/api';

export function useProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await profileAPI.getByUserId(userId);
      setProfile(data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError(err.response?.data?.detail || 'Failed to load profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates) => {
    if (!profile?.id) return;

    try {
      const updated = await profileAPI.update(profile.id, updates);
      setProfile(updated);
      return updated;
    } catch (err) {
      console.error('Failed to update profile:', err);
      throw err;
    }
  };

  const createProfile = async (profileData) => {
    try {
      const created = await profileAPI.create(profileData);
      setProfile(created);
      return created;
    } catch (err) {
      console.error('Failed to create profile:', err);
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
    createProfile,
  };
}

export function useProfileById(profileId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!profileId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await profileAPI.getById(profileId);
      setProfile(data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError(err.response?.data?.detail || 'Failed to load profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
}

export default useProfile;
