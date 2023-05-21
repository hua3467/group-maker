let state = {
  groupName: "",
  groupDescription: "",
  groupImage: "",
  capacity: "",
  newGroupId: "",
  groupId: "",
}


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const eventId = urlParams.get("id");

let isNewGroup = false;


const memberCard = (memberData, key) => {

  return new JDom({
    type: "div",
    attr: {
      className: "member-card",
    },
    children: [
      {
        type: "button",
        content: "Remove",
        attr: {
          className: "btn-delete no-print",
          data_id: key,
          data_group: memberData.groupID,
        },
        events: {
          click: () => {
            let isConfirmed = confirm(
              `Are you sure you want to remove ${memberData.name}?`
            )

            if (isConfirmed) {
              db.remove(
                `${eventId}/group-data/${memberData.groupID}/members/${key}`,
                () => {
                  console.log("removed")
                }
              )
            }
          },
        },
      },
      {
        type: "h3",
        content: memberData.name,
      },
      {
        type: "p",
        content: memberData.school,
      },
      {
        type: "p",
        content: memberData.email,
      },
    ],
  })
}

const groupEdit = (info, groupId) => {

  clearElements("#groupEditContaner");

  return new JDom({
    type: "div",
    attr: {
      className: "group-edit",
    },
    children: [
      {
        type: "h4",
        content: `Edit Group "${info.name}"`,
        attr: {
          style: {
            margin: "16px 0",
          },
        },
      },
      input("Group Name: ", "input", "groupName", setState, info.name),
      input("Description: ", "textarea", "groupDescription", setState, info.description),
      input("Image Address: ", "input", "groupImage", setState, info.image),
      imageUpload(info.image),
      {
        type: "button",
        content: "Cancel",
        attr: {
          className: "btn btn-cancel",
        },
        events: {
          click: (e) => {
            e.preventDefault();
            clearElements("#groupEditContaner");
          },
        },
      },
      {
        type: "button",
        content: "Save",
        attr: {
          className: "btn",
        },
        events: {
          click: (e) => {

            e.preventDefault()
            state.image = document.querySelector("#groupImage").value;

            if(isNewGroup) {

              db.set(`${eventId}/group-data/${state.newGroupId}/name`, state.groupName);
              db.set(`${eventId}/group-data/${state.newGroupId}/description`, state.groupDescription);
              db.set(`${eventId}/group-data/${state.newGroupId}/image`, state.groupImage);
              db.set(`${eventId}/group-data/${state.newGroupId}/id`, state.newGroupId);
              isNewGroup = false;
              console.log("new group.");
            } else {
              console.log("update group.");
              console.log(info);
              db.set(`${eventId}/group-data/${groupId}/name`, state.groupName);
              db.set(`${eventId}/group-data/${groupId}/description`, state.groupDescription);
              db.set(`${eventId}/group-data/${groupId}/image`, state.groupImage);
              db.set(`${eventId}/group-data/${groupId}/id`, groupId);

            }
           
            clearElements("#groupEditContaner");

          },
        },
      },
    ],
  })
}

const groupCard = (groupInfo, groupId) => {
  const members = []

  if (groupInfo.members) {
    for (key in groupInfo.members) {
      members.push(memberCard(groupInfo.members[key], key))
    }
  }

  return new JDom({
    type: "div",
    attr: {
      className: "group-section",
    },
    children: [
      {
        type: "div",
        attr: {
          className: "group-info",
        },
        children: [
          {
            type: "h2",
            content: groupInfo.name,
            attr: {
              className: "group-title",
            },
          },
          {
            type: "button",
            content: "Delete Group",
            attr: {
              className: "no-print"
            },
            events: {
              click: e => {
                const isConfirmed = confirm("The group with its members will be permanantly deleted! Are you sure?");
                if (isConfirmed) {
                  db.remove(`${eventId}/group-data/${groupId}`);
                }
              }
            }
          },
          {
            type: "button",
            content: "Edit Group",
            attr: {
              className: "no-print btn-edit-group",
            },
            events: {
              click: (e) => {
                setState("groupName", groupInfo.name)
                setState("groupDescription", groupInfo.description)
                setState("groupImage", groupInfo.image)
                groupEdit(groupInfo, groupId).render("#groupEditContaner")
                window.scrollTo(0, 0)
              },
            },
          },
          {
            type: "p",
            content: groupInfo.description,
          },
          {
            type: "h3",
            content: `(${members.length} Participants)`,
            attr: {
              className: "group-size",
            },
          },
        ],
      },
      {
        type: "div",
        attr: {
          className: "member-list",
        },
        children: members,
      },
    ],
  })
}

db.onDataUpdated(eventId, (data) => {

  console.log(data);

  document.querySelector("#eventTitle").innerHTML = data.page_title;

  const signUpData = data["group-data"];

  clearElements("#app");

  new JDom({
    type: "a",
    content: "Sign-up Page",
    attr: {
      href: `./index.html?id=${eventId}`,
      target: "_blank",
    }
  }).render("#links");

  for(key in signUpData) {
    groupCard(signUpData[key], key).render("#app")
  }

  // Object.values(signUpData).forEach((info) => {
  //   groupCard(info).render("#app")
  // });
});

document.querySelector("#btnAddGroup").addEventListener("click", e => {
  state.newGroupId = Date.now();
  isNewGroup = true;

  groupEdit(state).render("#groupEditContaner");

});

document.querySelector("#btnEditEvent").addEventListener("click", () => {
  window.open(`./event.html?id=${eventId}`, "_blank");
});


document.querySelector("#btnPrint").addEventListener("click", (e) => {
  window.print()
});
