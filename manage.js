let state = {
    groupName: "",
    groupDescription: "",
    groupImage: ""
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
                content: "Remove",
                attr: {
                    className: "btn-delete no-print"
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

const imageUpload = (imagePreviewUrl) => {
    let previewContainer =  {
        type: "div",
        attr: {
            id: "preview"
        }
    };
    if(imagePreviewUrl) {
        previewContainer =  {
            type: "div",
            attr: {
                id: "preview"
            },
            children: [{
                type: "img",
                attr: {
                    src: imagePreviewUrl,
                    style: {
                        width: "300px"
                    }
                }
                
            }]
        };
    }

    return {
        type: "div",
        attr: {
            className: "image-uploader"
        },
        children:[
            previewContainer,
            {
            type: "button",
            content: imagePreviewUrl ? "Change Image" : "Add Image",
            attr: {
                id: "upload_widget",
                className: "cloudinary-button"
            },
            events: {
                click: () => {
                    myWidget.open();
                }
            }
        }]
    };
}

const groupEdit = (info) => {
    clearElements("#groupEditContaner");

    return new JDom({
        type: "div",
        attr: {
            className: "group-edit"
        }, 
        children: [
            {
                type: "h4",
                content: `Edit Group "${info.name}"`,
                attr: {
                    style: {
                        margin: "16px 0"
                    }
                }
            },
            input("Group Name: ", "input", "groupName", setState, info.name),
            input("Description: ", "textarea", "groupDescription", setState, info.description), 
            input("Image Address: ", "input", "groupImage", setState, info.image),
            imageUpload(info.image),
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
                        state.groupImage = document.querySelector("#groupImage").value;
                        db.set(`group-data/${info.id}/name`, state.groupName);
                        db.set(`group-data/${info.id}/description`, state.groupDescription);
                        db.set(`group-data/${info.id}/image`, state.groupImage);
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
                        className: "no-print btn-edit-group"
                    },
                    events: {
                        click: e => {
                            setState("groupName", groupInfo.name);
                            setState("groupDescription", groupInfo.description);
                            setState("groupImage", groupInfo.groupImage);
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

var myWidget = cloudinary.createUploadWidget({
    cloudName: 'dop0mlakv',
    uploadPreset: 'dw5p6gbl'
}, (error, result) => {
    if (!error && result && result.event === "success") {
        console.log('Done! Here is the image info: ', result.info);

        clearElements("#preview");

        new JDom({
            type: "img",
            attr: {
                src: `https://res.cloudinary.com/dop0mlakv/image/upload/c_limit,h_360,w_420/${result.info.path}`,
            }
        }).render("#preview");

        setState("groupImage", result.info.secure_url);
        document.querySelector("#groupImage").value = result.info.secure_url;
        document.querySelector("#upload_widget").content = "Change Image";
    }
});

// document.getElementById("upload_widget").addEventListener("click", function () {
//     myWidget.open();
// }, false);

document.querySelector("#btnPrint").addEventListener("click", e => {
    window.print();
})

function setState(key, value){
    state[key] = value;
}
