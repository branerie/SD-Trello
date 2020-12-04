import React, { useCallback, useEffect, useState, useContext } from 'react'
import { useParams, useHistory } from "react-router-dom"
// import Button from '../../components/button'
import PageLayout from '../../components/page-layout'
import { useSocket } from '../../contexts/SocketProvider'
import getCookie from '../../utils/cookie'
import styles from './index.module.css'
// import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import TableDndApp from '../../components/calendar-table'
import Loader from 'react-loader-spinner'
import ProjectContext from '../../contexts/ProjectContext'

export default function ProjectList() {
    const params = useParams()
    const history = useHistory()
    const [project, setProject] = useState(null)
    const [lists, setLists] = useState([])
    const [members, setMembers] = useState([])
    const socket = useSocket()
    const projectContext = useContext(ProjectContext)

    const projectUpdate = useCallback((project) => {

        setProject(project)

        const memberArr = []
        project.membersRoles.map(element => {
            return memberArr.push({ admin: element.admin, username: element.memberId.username })

        })
        setMembers(memberArr)
        setLists(project.lists)
    }, [])

    useEffect(() => {
        if (socket == null) return

        socket.on('project-updated', projectUpdate)

        return () => socket.off('project-updated')
    }, [socket, projectUpdate])

    const getData = useCallback(async () => {
        const id = params.projectid
        const token = getCookie("x-auth-token");

        const response = await fetch(`http://localhost:4000/api/projects/info/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            const data = await response.json()
            setProject(data)
            const memberArr = []
            data.membersRoles.map(element => {
                return memberArr.push({ admin: element.admin, username: element.memberId.username, id: element.memberId._id })

            })
            setMembers(memberArr)
            setLists(data.lists)
        }


    }, [params.projectid, history])

    useEffect(() => {
        getData()
        const pid = getCookie('pid')
        if (pid && pid !== projectContext.project) {
            projectContext.setProject(pid)
        }
    }, [])

    if (!project) {
        return (
            <PageLayout>
                <Loader
                    type="TailSpin"
                    color="#363338"
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                />
            </PageLayout>
        )
    }

    return (
        <PageLayout className={styles.conteiner}>
            <div className={styles.calendarPageContainer}>
                <div>
                    <div className={styles.calendarContainer}>
                        <TableDndApp project={project} />
                    </div>
                </div>
            </div>
        </PageLayout >
    )
}