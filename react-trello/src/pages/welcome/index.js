import React from "react"
import LinkComponent from "../../components/link"
import Title from "../../components/title"

const WelcomePage = () => {

  return (
    <div>
      <Title title='Home' />

          <LinkComponent
            href='/login'
            title='Log In'
          />
          <LinkComponent
            href='/sign-up'
            title='Sign Up'
          />

    </div>
  )
}

export default WelcomePage