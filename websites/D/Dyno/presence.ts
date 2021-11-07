const presence = new Presence({
    clientId: "633801594541965334"
  }),
  browsingStamp = Math.floor(Date.now() / 1000);
let title: HTMLElement;

presence.on("UpdateData", async () => {
  const presenceData: PresenceData = {
    largeImageKey: "dyno"
  };

  if (document.location.hostname === "dyno.gg") {
    presenceData.startTimestamp = browsingStamp;
    if (document.location.pathname.includes("/bot")) {
      presenceData.details = "Reading about the bot";
      presenceData.smallImageKey = "reading";
    } else if (document.location.pathname.includes("/account"))
      presenceData.details = "Viewing their account";
    else if (document.location.pathname.includes("/manage/")) {
      presenceData.details = "Managing the settings of";
      title = document.querySelector(
        "#dashboard-mount > div > div.column.nav-sidebar > aside > div.guild-header > h3 > div > div"
      );
      presenceData.state = `server: ${title.innerText}`;
      presenceData.smallImageKey = "writing";
    } else if (document.location.pathname.includes("/servers")) {
      presenceData.details = "Browsing through the";
      presenceData.state = "server listings";
    } else if (document.location.pathname.includes("/commands"))
      presenceData.details = "Viewing all the commands";
    else if (document.location.pathname.includes("faq")) {
      presenceData.details = "Reading the FAQ";
      presenceData.smallImageKey = "reading";
    } else if (document.location.pathname.includes("/status"))
      presenceData.details = "Viewing the status";
<<<<<<< HEAD
    } else if (document.location.pathname.includes("/premium")) {
=======
    else if (document.location.pathname.includes("/upgrade"))
>>>>>>> 8e0cbceebb65f81e45bd14131815c3860fc13354
      presenceData.details = "Viewing Dyno Premium Plans";
  }

  if (!presenceData.details) {
    presence.setTrayTitle();
    presence.setActivity();
  } else presence.setActivity(presenceData);
});
