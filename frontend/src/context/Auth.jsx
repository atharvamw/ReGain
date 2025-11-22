import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider(props)
{
    const [userAuth, setUserAuth] = useState({firstName: null, lastName: null});

    async function login(email, password)
    {
        try
        {
            const result = await fetch("https://api.regain.pp.ua/login", {
                method: "post",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({email, password}),
                credentials: "include"
            })
            
            const data = await result.json()

            console.log(data)

            if(data.status == "success")
            {
                setUserAuth({firstName: data.firstName, lastName: data.lastName})
            }
            else
            {
                console.log("Could not Login in! " + data);
            }

        }
        catch(error)
        {
            console.log("Couldnt Log in: " + error)
        }
    }

    async function logout()
    {
        await fetch("https://api.regain.pp.ua/logout", {
            method: "post",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        })

        setUserAuth({firstName: null, lastName: null})
        return true
    }

    async function authenticate()
    {
        const result = await fetch("https://api.regain.pp.ua/auth",{
            method: "get",
            credentials: "include"
        })
        const data = await result.json()

        if(data.authentication === "success")
        {
            setUserAuth({firstName: data.firstName, lastName: data.lastName})
            return true
        }
        else
        {
            setUserAuth({firstName: null, lastName: null})
            return false
        }
    }

    async function register(email, pass, firstName, lastName)
    {
        try
        {
            const result = await fetch("https://api.regain.pp.ua/register", {
                method: "post",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password, firstName, lastName})
            })

            const data = await result.json()
            if(result.status==="success")
                return data
            else
                return data
            
        }
        catch(err)
        {
            return {"status": "failed", "message": err.toString()}
        }
    }

    return(<AuthContext.Provider value={{userAuth, login, logout, register, authenticate}}>
        {props.children}
    </AuthContext.Provider>)
}