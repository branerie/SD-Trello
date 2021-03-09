import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import UserContext from '../contexts/UserContext'
import getCookie from './cookie'

async function useUpdateUserLastTeam(teamId) {
    const token = getCookie('x-auth-token')
    const history = useHistory()
    const userContext = useContext(UserContext)

    if (teamId === userContext.user.lastTeamSelected) return

    const response = await fetch(`/api/user/${userContext.user.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            lastTeamSelected: teamId
        })
    })

    if (!response.ok) {
        history.push('/error')
      }

    const user = {...userContext.user}
    user.lastTeamSelected = teamId
    userContext.setUser({
        ...user
    })

}

export default useUpdateUserLastTeam
