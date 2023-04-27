let state = {
    name: "",
    email: "",
    school: "",
    groupID: "",
    uid: Date.now()
};

db.onDataUpdated('', data => {

    clearElements("#app");

    const groupData = data["group-data"];
    const capacity = data.capacity;
    groupData.forEach(info => {
        let isFull = false;

        if (info.members) {
            isFull = Object.keys(info.members).length >= capacity ? true : false;
        }

        card(info, capacity, isFull).render("#app");
    });
});

// db.set("group-data", groupDataInit);

function submit(groupName) {
    if (state.name.length > 1 && state.email.length > 1 && state.school.length > 1) {
        db.set(`group-data/${state.groupID}/members/${state.uid}`, state, () => {
            // const isConfirmed = confirm(`Are you sure you want to join ${groupName}? You cannot change your group after submission.`);
            clearElements("#form");
            document.querySelector(".form-container").classList.add("hide");
            
            window.open(`./success.html?uid=${state.uid}&gid=${state.groupID}`, "_blank");

        });
    } else {
        alert("All the fields are required.")
    }
}






/**
 * 
 * @param {*} data single group data
 */
function card(data, capacity, isFull) {

    const style = isFull ? {
        display: "none"
    } : {
        display: "block"
    }

    let seatRemain = capacity;

    if (data.members) {
        seatRemain = capacity - Object.keys(data.members).length;
    }


    return new JDom({
        type: "div",
        attr: {
            className: "group-card",
        },
        children: [{
            type: "h3",
            content: data.name,
            attr: {
                className: "card-title"
            }
        }, {
            type: "p",
            content: data.description
        }, {
            type: "h3",
            content: isFull ? "This group is full." : `Opend slots: ${seatRemain} / ${capacity}`,
            attr: {
                className: "group-status"
            }
        }, {
            type: "button",
            content: "Join",
            attr: {
                style: style,
                className: "btn btn-join"
            },
            events: {
                click: (e) => {
                    
                    state = {
                        name: "",
                        email: "",
                        school: "",
                        groupID: "",
                        uid: Date.now()
                    };

                    clearElements("#form");
                    setState("groupID", data.id);
                    signUpForm(data, submit).render("#form");
                    document.querySelector(".form-container").classList.remove("hide");
                    
                }
            }
        }]
    })
}


function signUpForm(data, callback) {

    return new JDom({
        type: "form",
        attr: {
            className: "sign-up-form"
        },
        children: [{
                type: "div",
                children: [{
                    type: "h3",
                    content: data.name
                }, {
                    type: "br"
                }]
            },
            {
                type: "div",
                children: [
                    input("Full Name: ", "input", "name", setState),
                    input("Email: ", "input", "email", setState),
                    input("School: ", "input", "school", setState)
                ]
            }, {
                type: "button",
                content: "Cancel",
                attr: {
                    className: "btn btn-cancel"
                },
                events: {
                    click: (e) => {
                        e.preventDefault();
                        console.log("cencel button");
                        clearElements("#form");
                        document.querySelector(".form-container").classList.add("hide");
                    }
                }
            }, {
                type: "button",
                content: "Submit",
                attr: {
                    className: "btn btn-signup"
                },
                events: {
                    click: (e) => {
                        e.preventDefault();
                        callback(data.name);
                    }
                }
            }
        ]
    });
}

function setState(key, value) {
    state[key] = value;
}

function isSigned(email) {

}