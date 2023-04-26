
let state = {
    groupName: "",
    groupDescription: ""
}

const memberCard = (memberData, key) => {
    return new JDom({
        type: "div",
        attr: {
            className: "member-card"
        },
        children: [
            {
                type: "button",
                content: "delete",
                attr: {
                    className: "btn-delete"
                },
                events: {
                    click: () => {
                        let isConfirmed = confirm(`Are you sure you want to remove ${memberData.name}?`);

                        if (isConfirmed) {
                            db.remove(`group-data/${memberData.groupID}/members/${key}`, () => {
                                console.log("removed");
                            });
                        }
                        
                    }
                }
            },
            {
                type: "h3",
                content: memberData.name
            },{
                type: "p",
                content: memberData.school
            }, {
                type: "p",
                content: memberData.email
            }
        ]
    });
}

const groupEdit = (info) => {
    clearElements("#groupEditContaner");
    return new JDom({
        type: "div",
        attr: {
            className: "group-edit"
        }, 
        children: [
            input("Group Name: ", "input", "groupName", setState, info.name),
            input("Description: ", "textarea", "groupDescription", setState, info.description), 
            {
                type: "button",
                content: "Cancel",
                attr: {
                    className: "btn btn-cancel"
                },
                events: {
                    click: (e) => {
                        e.preventDefault();
                        clearElements("#groupEditContaner");
                    }
                }
            },
            {
                type: "button",
                content: "Save",
                attr: {
                    className: "btn"
                },
                events: {
                    click: e => {
                        e.preventDefault();
                        db.set(`group-data/${info.id}/name`, state.groupName);
                        db.set(`group-data/${info.id}/description`, state.groupDescription);
                        clearElements("#groupEditContaner");
                        console.log(state);
                    }
                }
            }
        ]
    })
}

const groupCard = (groupInfo) => {

    const members = [];

    if (groupInfo.members) {

        for(key in groupInfo.members){
            members.push(memberCard(groupInfo.members[key], key));
        }
    }

    return new JDom({
        type: "div",
        attr: {
            className: "group-section"
        },
        children: [{
            type: "div",
            attr: {
                className: "group-info"
            },
            children: [
                {
                    type: "h2",
                    content: groupInfo.name,
                    attr: {
                        className: "group-title"
                    }
                }, {
                    type: "button",
                    content: "Edit Group",
                    attr: {
                        className: " btn-edit-group"
                    },
                    events: {
                        click: e => {
                            setState("groupName", groupInfo.name);
                            setState("groupDescription", groupInfo.description);
                            groupEdit(groupInfo).render("#groupEditContaner");
                            window.scrollTo(0, 0);
                        }
                    }
                }, {
                    type: "p",
                    content: groupInfo.description
                },
            ]
        },
             {
                type: "div",
                attr: {
                    className: "member-list"
                },  
                children: members
            }
        ]
    });
}



db.onDataUpdated("", data => {
    console.log(data);

    const signUpData = data["group-data"];

    clearElements("#app");

    Object.values(signUpData).forEach(info => {
        groupCard(info).render("#app");
    });
});

function setState(key, value){
    state[key] = value;
}