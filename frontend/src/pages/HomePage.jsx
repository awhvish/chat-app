import { useAuthStore } from "../store/useAuthStore"

const HomePage = () => {
  const {authUser} = useAuthStore();
  const handleClick = () => {
    console.log(authUser)
  }
  return (
    <div>
      <button type="submit" onClick={handleClick}>click me</button>
      hihi
    </div>
  )
}

export default HomePage
