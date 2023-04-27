const urlParams = getUrlParams(["uid", "gid"]);

const memberCard = (memberData) => {
    return new JDom({
        type: "div",
        attr: {
            className: "member-card"
        },
        children: [
            {
                type: "button",
                content: "Remove",
                attr: {
                    className: "btn-delete no-print"
                },
                events: {
                    click: () => {
                        let isConfirmed = confirm(`Are you sure you want to remove ${memberData.name}?`);

                        if (isConfirmed) {
                            db.remove(`group-data/${memberData.groupID}/members/${memberData.uid}`, () => {
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

const groupCard = (groupInfo) => {

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
                    type: "p",
                    content: "You joined the group of"
                },
                {
                    type: "h2",
                    content: groupInfo.name,
                    attr: {
                        className: "group-title"
                    }
                }, {
                    type: "p",
                    content: "To change your information, please remove your informatin and join the group again."
                },
            ]
        }
        ]
    });
}

db.read(`group-data/${urlParams.gid}`, data => {
    groupCard(data).render("#group");
});

db.onDataUpdated(`group-data/${urlParams.gid}/members/${urlParams.uid}`, data => {
    console.log(data);
    if(data) {
        memberCard(data).render("#app");
    }
});

