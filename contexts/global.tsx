import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/firebase";

interface IGlobalContext {
    user: User | null,
    setUser: (user: User | null) => void,
    loading: boolean;
}
const GlobalContext = createContext<IGlobalContext>({
    user: null,
    setUser: () => { },
    loading: true
});

export const GlobalContextProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setLoading(false)
            if (user) {
                setUser(user)
            } else {
                setUser(null)
            }
        })
    }, [])

    return (
        <GlobalContext.Provider value={{ user, setUser, loading }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext)