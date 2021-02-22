const presence = new Presence({ clientId: "802246778010730548" }),
  SelectorMap: { [index: string]: string } = {
    Red: "div#sbettors1 > span.redtext > strong",
    Blue: "div#sbettors2 > span.bluetext > strong",
    estatus: "div#status > span#betstatus",
    tmode: "span#tournament-note",
    emode: "div#footer-alert",
    betRed: "span#lastbet.dynamic-view > span.redtext",
    betBlue: "span#lastbet.dynamic-view > span.bluetext",
    prize: "span#lastbet.dynamic-view > span.greentext",
    oddsRed: "span#lastbet.dynamic-view > span.redtext:nth-last-child(2)",
    oddsBlue: "span#lastbet.dynamic-view > span.bluetext:nth-last-child(1)",
    betsView: "span#lastbet.dynamic-view",
    balance: "span#balance.dollar"
  };

let fightersCheck: string,
  browsingStamp = Math.floor(Date.now() / 1000);

function getText(selector: string) {
  if (
    document.querySelector(selector) !== null &&
    document.querySelector(selector) !== undefined
  )
    return document.querySelector(selector).textContent;
  else return null;
}

function getModeImageKey(): string[] {
  if (
    getText(SelectorMap["tmode"]) !== null ||
    getText(SelectorMap["emode"]).includes("bracket!") ||
    getText(SelectorMap["emode"]).includes("FINAL")
  ) {
    return ["trofeo", "Tournament Mode"];
  } else if (
    getText(SelectorMap["emode"]).includes("exhibition") ||
    getText(SelectorMap["emode"]).includes("Exhibition")
  ) {
    return ["saltgirl", "Exhibition Mode"];
  } else {
    return ["salero", "Matchmaking Mode"];
  }
}

function getFighters(): string {
  if (
    getText(SelectorMap["Red"]) !== null &&
    getText(SelectorMap["Blue"]) !== null
  )
    return getText(SelectorMap["Red"]) + " VS " + getText(SelectorMap["Blue"]);
  else return "Loading Fighters...";
}

function getBalance(): string {
  if (
    getText(SelectorMap["balance"]) !== null
  )
    return "Balance: " + "$" + getText(SelectorMap["balance"]);
  else return "Loading Balance...";
}

function isBetOpen(): boolean {
  return getText(SelectorMap["estatus"]).includes("OPEN!");
}

function getBetStatus(): string {
  if (!isBetOpen()) {
    if (!getText(SelectorMap["estatus"]).includes("Payouts")) {
      if (getText(SelectorMap["betsView"]).includes("|")) {
        if (getText(SelectorMap["betRed"]).includes("$"))
          return ((+getText(SelectorMap["betRed"]).replace("$","") < 1000) ? getText(SelectorMap["betRed"]) : "$" + abbrNum(+getText(SelectorMap["betRed"]).replace("$",""),1)) +
            "(Red)→" +
            ((+getText(SelectorMap["prize"]).replace("+$","") < 1000) ? getText(SelectorMap["prize"]) : "+$" + abbrNum(+getText(SelectorMap["prize"]).replace("+$",""),1)) +
            "|" +
            getText(SelectorMap["oddsRed"]) +
            ":" +
            getText(SelectorMap["oddsBlue"]);
        else
          return ((+getText(SelectorMap["betBlue"]).replace("$","") < 1000) ? getText(SelectorMap["betBlue"]) : "$" + abbrNum(+getText(SelectorMap["betBlue"]).replace("$",""),1)) +
            "(Blue)→" +
            ((+getText(SelectorMap["prize"]).replace("+$","") < 1000) ? getText(SelectorMap["prize"]) : "+$" + abbrNum(+getText(SelectorMap["prize"]).replace("+$",""),1)) +
            "|" +
            getText(SelectorMap["oddsRed"]) +
            ":" +
            getText(SelectorMap["oddsBlue"]);
      } else {
        if (
          getText(SelectorMap["oddsRed"]) !== null &&
          getText(SelectorMap["oddsBlue"]) !== null
        )
          return "Odds: " +
            getText(SelectorMap["oddsRed"]) +
            ":" +
            getText(SelectorMap["oddsBlue"]);
        else return  "Loading...";
      }
    } else {
      if (getText(SelectorMap["estatus"]) !== null) {
        if(getText(SelectorMap["estatus"]).split("wins!")[0].length <= 32)
          return getText(SelectorMap["estatus"]).split("wins!")[0] + "wins!";
        else
          return getText(SelectorMap["estatus"]).replace(".","").split(" ").splice(-2).join(" ") + " wins!";
      }
      else return  "Loading...";
    }
  } else {
    if (getText(SelectorMap["estatus"]) !== null)
      return  getText(SelectorMap["estatus"]);
    else return  "Loading...";
  }
}

function abbrNum(number : number, decPlaces : number) : string {
  let abbr:number,letter:string;
  decPlaces = Math.pow(10,decPlaces);
  const abbrev = [ "k", "m", "b", "t" ];
  for (let i=abbrev.length-1; i>=0; i--) {
    const size = Math.pow(10,(i+1)*3);
    if(size <= number) {
      number = Math.round(number*decPlaces/size)/decPlaces;
      if((number == 1000) && (i < abbrev.length - 1)) {
        number = 1;
        i++;
      }
      letter = abbrev[i];
      abbr = number;
      break;
    }
  }
  return String(abbr) + letter;
}

presence.on("UpdateData", async () => {
  const balance = await presence.getSetting("balance"),
    presenceData: PresenceData = {
      largeImageKey: "salty"
    };
  if (
    document.location.pathname == "/" ||
    document.location.pathname == "/index"
  ) {
    const mode = getModeImageKey();
    presenceData.smallImageKey = mode[0];
    presenceData.smallImageText = mode[1];

    if (fightersCheck !== getFighters()) {
      presenceData.details = getFighters();
      fightersCheck = getFighters();
    } else {
      presenceData.details = getFighters() + "‎";
      fightersCheck = getFighters() + "‎";
    }

    (isBetOpen()) ? browsingStamp = Math.floor(Date.now() / 1000) : presenceData.startTimestamp = browsingStamp;

    presenceData.state = mode[1];
    if(balance && ! getBalance().includes("$0"))
      presenceData.buttons = [
        { label: getBetStatus(),
          url: "https://www.saltybet.com"
        },
        { label: getBalance(),
          url: "https://www.saltybet.com"
        }
      ];
    else
      presenceData.buttons = [
        { label: getBetStatus(),
          url: "https://www.saltybet.com"
        },
        { label: "Visit SaltyBet.com",
          url: "https://www.saltybet.com"
        }
      ];
  } else if (document.location.pathname == "/authenticate") {
    presenceData.details = "Signing in...";
    delete presenceData.startTimestamp;
  } else if (document.location.pathname == "/bank") {
    presenceData.details = "Checking Bank";
    delete presenceData.startTimestamp;
  } else {
    presenceData.details = null;
  }

  if (presenceData.details == null) {
    presence.setTrayTitle();
    presence.setActivity();
  } else {
    presence.setActivity(presenceData);
  }
});
