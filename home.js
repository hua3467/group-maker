new JDom({
    type: "button",
    content: "Create a New Event",
    attr: {
      className: "btn"
    },
    events: {
        click: e => {

          window.open(`./event.html`, "_self");

        }
    }
}).render("nav");

db.read("", (data) => {

  for (key in data) {
    new JDom({
      type: "div",
      attr: {
        style: {
          display: "block",
          margin: "20px 0px"
        }
      }
      ,
      children: [
        {
          type: "a",
          content: data[key].page_title,
          attr: {
            href: `./index.html?id=${key}`,
            target: "_blank",
            style: {
              marginRight: "16px",
              fontSize: "1.3em",
              fontWeight: "bold"
            },
          },
        }, {
          type: "p",
          content: `${data[key].year ? data[key].year : ''}`
        },{
          type: "a",
          content: "Manage Groups",
          attr: {
            href: `./manage.html?id=${key}`,
            target: "_blank",
            style: {
              marginRight: "16px",
              fontSize: "0.9em"
            },
          },
        },
        {
          type: "a",
          content: "Edit Event",
          attr: {
            href: `./event.html?id=${key}`,
            target: "_blank",
            style: {
              marginRight: "16px",
              fontSize: "0.9em"
            },
          },
        },
      ],
    }).render("#app")
  }
  
});

var INIT_DATA = {
    "capacity": 12,
    "date": "21",
    "description": "Start to add your description.",
    "doc": "https://ndusbpos-my.sharepoint.com/:w:/g/personal/zhenhua_yang_1_ndus_edu/EQi0rr2Aze1DtvNCL-PsGgoBHZL9ADDbmhxFso0svF-vhA?rtime=psq1wCxJ20g",
    "group-data": [
        {
            "capacity": 15,
            "description": "Start to add your description",
            "id": 1,
            "image": "https://res.cloudinary.com/dop0mlakv/image/upload/v1682955577/public_upload/dtsq77rzlf2oso3bcakl.jpg",
            "memberCount": 0,
            "members": {},
            "name": "The Name of Your First Group"
        }
    ],
    "id": 2022,
    "image": "https://res.cloudinary.com/dop0mlakv/image/upload/v1682778512/public_upload/udl1o7jhxdljmquplzhk.jpg",
    "month": "4",
    "page_title": "Add an event name",
    "video_url": "https://res.cloudinary.com/dop0mlakv/video/upload/v1683041851/public_upload/tl4cjuzd7lxsl1rqmjkx.mp4",
    "year": new Date().getFullYear()
}