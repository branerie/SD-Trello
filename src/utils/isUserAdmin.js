const isUserAdmin = (id, members) => {
    const member = members.find(m => m.memberId._id === id)

    if (!member) {
        return false
    }

    return member.admin
}

export default isUserAdmin
