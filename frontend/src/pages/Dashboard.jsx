import { AuthContext } from "../context/Auth"
import { useContext } from "react"

export default function Dashboard() {
  const Auth = useContext(AuthContext)

  return (
    <div>
      <h1>Welcome to Dashboard, {Auth.userAuth.firstName}!</h1>
    </div>
  )
}