const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const projectID = urlParams.get("id");

let state = {};

db.read(projectID, data => {
    state = {
        eventName: data.page_title,
        eventDescription: data.description,
        eventImage: data.image,
        eventVideo: data.video_url,
        capacity: data.capacity,
        document: data.doc
    };
    console.log(data);
    document.querySelector("#eventTitle").innerHTML = data.page_title;
    eventEdit(data).render("#eventEditContaner");
});



const eventEdit = (eventInfo) => {
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
            input("Event Video: ", "text", "eventVideo", setState, eventInfo.video_url),

            
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
                        console.log(state);
                    }
                }
            }
        ]
    })
}






