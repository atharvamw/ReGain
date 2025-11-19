import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider(props)
{
    const [userAuth, setUserAuth] = useState({"user": null});

    async function login(user, pass)
    {
        try
        {
            const result = await fetch("https://api.regain.pp.ua/login", {
                method: "post",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({email, password})
            })

            const data = await result.json()

            
        }
    }
}