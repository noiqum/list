"use client";
import { User } from '@/types';
import React, { createContext, useState, useContext, ReactNode } from 'react';



interface UserContextType {
    user: User | null;
    setStoreUser: (user: User) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);


    const setStoreUser = (user: User) => {
        setUser(user)
    }

    return (
        <UserContext.Provider value={{ user, setStoreUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}