import React, { PropsWithChildren, createContext, useState } from "react";

interface IGlobalContext {
    user: any,
    loading: boolean,
    setUser: (user: any) => void,
}
const GlobalContext = createContext<IGlobalContext>({
    user: null,
    loading: false,
    setUser: () => { }
});

export const GlobalContextProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    return (
        <GlobalContext.Provider value={{ user, setUser, loading }}>
            {children}
        </GlobalContext.Provider>
    )
}