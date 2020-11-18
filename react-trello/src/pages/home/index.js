import React, { useContext } from "react"
import LinkComponent from "../../components/link"
import Title from "../../components/title"
import UserContext from "../../Context"

const Home = () => {
  const context = useContext(UserContext)

  return (
    <div>
      <Title title='Home' />
      {
        context.user.loggedIn ? null : <div>
          <LinkComponent
            href='/login'
            title='Log In'
          />
          <LinkComponent
            href='/sign-up'
            title='Sign Up'
          />
        </div>
      }
      {
        context.user.loggedIn ? <LinkComponent
        href='/projects'
        title='Projects'
      /> : null
    }
    </div>
  )
}

export default Home