import React, { createContext, useCallback, useContext, useState } from 'react';
import { User, UpdateUserDto } from '../types/user';
import { getUser, updateUser, canUserPlay } from '../api/users';
import { useAuth } from './AuthContext';

interface UserContextProps {
  user: User | null;
  canPlay: boolean;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  removeUserGameCoin: () => Promise<void>;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  canPlay: false,
  isLoading: false,
  fetchUser: async () => {},
  removeUserGameCoin: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [canPlay, setCanPlay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();

  const fetchUser = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const [userData, playable] = await Promise.all([
        getUser(userId),
        canUserPlay(userId),
      ]);
      setUser(userData);
      setCanPlay(playable);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const removeUserGameCoin = useCallback(async () => {
    if (!user || !userId) return;
    try {
      const dto: UpdateUserDto = { gameCoins: user.gameCoins - 1 };
      const updated = await updateUser(userId, dto);
      setUser(updated);
      const playable = await canUserPlay(userId);
      setCanPlay(playable);
    } catch (error) {
      console.error('Error removing coin:', error);
    }
  }, [user, userId]);

  return (
    <UserContext.Provider value={{ user, canPlay, isLoading, fetchUser, removeUserGameCoin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
