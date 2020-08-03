// Import scrapers
  // Import .env variables
import { config } from "dotenv";
config();

// Import fs
import * as fs from "fs";

// Import scraper
import scrapers from "./index";

// Create instance of scraper
const MunckhofInstance = new scrapers.Munckhof({
	username: process.env.TAXI_USERNAME,
	password: process.env.TAXI_PASSWORD
});


// This is an async wrapper we'll use to test our scraper
async function main() {
	// Refresh token
	await MunckhofInstance.updateToken();
	let data = await MunckhofInstance.getRawData();
	
	if(!fs.existsSync("data/")) fs.mkdirSync("data");
	fs.writeFileSync(`data/${new Date().toISOString()}.json`, JSON.stringify(data, null, "\t"));
}
// Call the testing mobile!
main();