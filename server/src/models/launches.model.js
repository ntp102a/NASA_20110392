const launches = new Map();
const launchesDatabase = require("./launches.mongo");
let latestFlightNumber = 100;
const axios = require("axios");
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log("Downloading launches data...");
  const respone = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customer: 1,
          },
        },
      ],
    },
  });
  if (respone.status !== 200) {
    console.log("Problems downloading");
    throw new Error("Launch data download failed");
  }
  const launchDocs = respone.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });
  }

  const launch = {
    flightNumber: launchDoc["flight_number"],
    mission: launchDoc["name"],
    rocket: launchDoc["rocket"]["name"],
    launchDate: launchDoc["date_local"],
    customer,
    upcoming: launchDoc["upcoming"],
    success: launchDoc["success"],
  };

  console.log(`${launch.flightNumber} ${launch.mission}`);

  await saveLaunch(launch);
}

async function saveLaunch(launch) {
  await launchesDatabase.findByIdAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

const launche = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customer: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(launche.flightNumber, launche);

async function existsLaunchWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}

async function getLastestFlightNumber() {
  const lastestLaunch = await launchesDatabase.findOne().sort("-flightNumber");
  if (!lastestLaunch) {
    return latestFlightNumber;
  }
  return lastestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
  return await launchesDatabase
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function scheduleNewLaunch() {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }
  const newFlightNumber = (await getLastestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero to Mastery", "Nasa"],
    flightNumber: newFlightNumber,
  });
  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.modifiedCount === 1;
}

module.exports = {
  loadLaunchData,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
