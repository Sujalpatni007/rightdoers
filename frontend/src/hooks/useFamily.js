/**
 * HI AI-APP.COM - Family Hook
 * React hook for fetching and managing Family dashboard data
 */

import { useState, useEffect, useCallback } from 'react';
import { familyAPI } from '@/services/api';

export function useFamily(userId) {
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFamily = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await familyAPI.getByUserId(userId);
      setFamily(data);
    } catch (err) {
      console.error('Failed to fetch family:', err);
      setError(err.response?.data?.detail || 'Failed to load family data');
      setFamily(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFamily();
  }, [fetchFamily]);

  const updateFamily = async (updates) => {
    if (!family?.id) return;

    try {
      const updated = await familyAPI.update(family.id, updates);
      setFamily(updated);
      return updated;
    } catch (err) {
      console.error('Failed to update family:', err);
      throw err;
    }
  };

  const createFamily = async (familyData) => {
    try {
      const created = await familyAPI.create(familyData);
      setFamily(created);
      return created;
    } catch (err) {
      console.error('Failed to create family:', err);
      throw err;
    }
  };

  const addMember = async (memberData) => {
    if (!family?.id) return;

    try {
      const updated = await familyAPI.addMember(family.id, memberData);
      setFamily(updated);
      return updated;
    } catch (err) {
      console.error('Failed to add family member:', err);
      throw err;
    }
  };

  return {
    family,
    loading,
    error,
    refetch: fetchFamily,
    updateFamily,
    createFamily,
    addMember,
  };
}

export function useFamilyById(familyId) {
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFamily = useCallback(async () => {
    if (!familyId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await familyAPI.getById(familyId);
      setFamily(data);
    } catch (err) {
      console.error('Failed to fetch family:', err);
      setError(err.response?.data?.detail || 'Failed to load family data');
      setFamily(null);
    } finally {
      setLoading(false);
    }
  }, [familyId]);

  useEffect(() => {
    fetchFamily();
  }, [fetchFamily]);

  return {
    family,
    loading,
    error,
    refetch: fetchFamily,
  };
}

export default useFamily;
