let state = {
    name: "",
    email: "",
    school: "",
    groupID: "",
    uid: Date.now()
};

const imagePlaceHolder = "https://sodaa360.com/wp-content/uploads/image_hosting/14/2023/04/pexels-photo-1103970.jpeg";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const eventId = urlParams.get("id");


db.onDataUpdated(eventId, data => {

    console.log(data);
    clearElements("#videContainer")
    clearElements("#app");

    if (data === null) {

    } else {

    }

    document.querySelector("#description").innerHTML = data.description;
    document.querySelector("#eventTitle").innerHTML = data.page_title;

    const docLink = document.querySelector("#docURL");

    if (data.doc) {
        docLink.href = data.doc;
    } else {
        docLink.classList.add("hide");
    }

    // new JDom({
    //     type: "video",
    //     attr: {
    //         src: data.video_url,
    //         controls: true,
    //         id: "introVideo"
    //     }
    // }).render("#videContainer");

    embedYouTubeVideo(data.video_url);
    const groupData = data["group-data"];

    console.log(groupData);

    if (typeof groupData !== "undefined") {
        
        const capacity = data.capacity;

        Object.values(groupData).forEach(info => {
            let isFull = false;

            if (info.members) {
                isFull = Object.keys(info.members).length >= capacity ? true : false;
            }

            card(info, capacity, isFull).render("#app");
        });

    } else {

        emptyContent("No groups have been created yet.").render("#app");

    }

    
});

// db.set("group-data", groupDataInit);

function submit(groupName) {
    if (state.name.length > 1 && state.email.length > 1 && state.school.length > 1) {
        db.set(`${eventId}/group-data/${state.groupID}/members/${state.uid}`, state, () => {
            // const isConfirmed = confirm(`Are you sure you want to join ${groupName}? You cannot change your group after submission.`);
            clearElements("#form");
            document.querySelector(".form-container").classList.add("hide");
            
            window.open(`./success.html?uid=${state.uid}&gid=${state.groupID}&eid=${eventId}`, "_blank");

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

    let image = null;
    if (data.image) {
        image = {
            type: "img",
            attr: {
                src: data.image,
                style: {
                    width: "100%"
                }
            }
        }
    }

    return new JDom({
        type: "div",
        attr: {
            className: "group-card",
        },
        children: [
            image,
            {
            type: "h3",
            content: data.name,
            attr: {
                className: "card-title"
            }
        }, {
            type: "p",
            content: data.description,
            attr: {
                className: "card-description"
            }
        }, {
            type: "h3",
            content: isFull ? "This group is full." : `Open Slots: ${seatRemain} / ${capacity}`,
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


function embedYouTubeVideo(url) {
    const baseUrl = "https://www.youtube.com/embed/";
    const videoId = YouTubeGetID(url);
    
    const embedHTML = `<iframe width="1280" height="720" src=${baseUrl + videoId} title="Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    <p>Watch the video on a new tab: <a href=${url} target="_blank">${url}</a></p>`
    document.querySelector("#videContainer").innerHTML = embedHTML;
}

function YouTubeGetID(url){
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
 }

function setState(key, value) {
    state[key] = value;
}

function isSigned(email) {

}