import React, { useContext } from "react"
import LinkComponent from "../../components/link"
import PageLayout from "../../components/page-layout"
import Title from "../../components/title"
import UserContext from "../../Context"

const Home = () => {

  return (
      <PageLayout>
        <Title title='Home' />
      </PageLayout>
  )
}

export default Home