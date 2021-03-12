import { useContext } from 'react'
import UserContext from '../contexts/UserContext'
import useUserServices from '../services/useUserServices'

async function useUpdateUserLastTeam(teamId) {
    const userContext = useContext(UserContext)
    const { updateUser } = useUserServices()

    if (teamId === userContext.user.lastTeamSelected) return

    await updateUser(userContext.user.id,userContext.user.username, teamId)    

    const user = {...userContext.user}
    user.lastTeamSelected = teamId
    userContext.setUser({
        ...user
    })

}

export default useUpdateUserLastTeam
