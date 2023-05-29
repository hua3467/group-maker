const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let projectID = urlParams.get("id");

let state = {};

if (projectID === null) {
    projectID = Date.now();
    state = {
        eventName: "",
        eventDescription: '',
        eventImage: '',
        eventVideo: '',
        capacity: '',
        document:'',
        year: new Date().getFullYear(),
    };
    document.querySelector("#eventTitle").innerHTML = "Create a Event";
    eventEdit(state).render("#eventEditContaner");
} else {
    db.read(projectID, data => {
        state = {
            eventName: data.page_title,
            eventDescription: data.description,
            eventImage: data.image,
            eventVideo: data.video_url,
            capacity: data.capacity,
            document: data.doc,
            year: data.year
        };
        console.log(data);
        document.querySelector("#eventTitle").innerHTML = data.page_title;
        eventEdit(data).render("#eventEditContaner");

        new JDom({
            type: "button",
            content: "Delete this Event",
            events: {
                click: () => {
                    deleteEvent(projectID);
                }
            }
        }).render("nav")

    });

}





function eventEdit(eventInfo) {
    clearElements("#eventEditContaner");

    return new JDom({
        type: "div",
        attr: {
            className: "event-edit"
        }, 
        children: [
            {
                type: "h4",
                content: `Event Edit`,
                attr: {
                    style: {
                        margin: "16px 0"
                    }
                }
            },
            input("Event Name: ", "text", "eventName", setState, eventInfo.page_title),
            input("Capacity per Group: ", "number", "capacity", setState, eventInfo.capacity),
            input("Event Description: ", "textarea", "eventDescription", setState, eventInfo.description), 
            input("Attached Document: ", "text", "document", setState, eventInfo.doc),
            input("Event Image: ", "text", "eventImage", setState, eventInfo.image),
            imageUpload(eventInfo.image),
            input("Event Video (YouTube Video Only): ", "text", "eventVideo", setState, eventInfo.video_url),

            
            {
                type: "button",
                content: "Cancel",
                attr: {
                    className: "btn btn-cancel"
                },
                events: {
                    click: (e) => {
                        e.preventDefault();
                        const isConfirmed = confirm("Are you sure you want to cancel? All the information will not be saved.");
                        if(isConfirmed) {
                            db.remove(projectID, () => {
                                console.log("Cancelled.");
                                window.open(`./home.html`, "_self");
                            });
                        }
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
                        state.eventImage = document.querySelector("#eventImage").value;
                        db.set(`${projectID}/page_title`, state.eventName);
                        db.set(`${projectID}/description`, state.eventDescription);
                        db.set(`${projectID}/image`, state.eventImage);
                        db.set(`${projectID}/video_url`, state.eventVideo);
                        db.set(`${projectID}/capacity`, state.capacity);
                        db.set(`${projectID}/doc`, state.document);
                        db.set(`${projectID}/year`, state.year);
                        console.log(state);
                        alert("Your changes are saved.");
                    }
                }
            }
        ]
    })
}

function deleteEvent(id){
    const isConfirmed = confirm("Are you sure you want to delete this event? All the data will be permanently removed.");
    if (isConfirmed) {
        db.remove(id, () => {
            alert("The event has been removed. You can close this window.");
        });
    }
}




