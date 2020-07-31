// Import scrapers
  // Import .env variables
import { config } from "dotenv";
config();

// Import scraper
import Munckhof from "./index"; 

// Create instance of scraper
const MunckhofInstance = new Munckhof({
	username: process.env.TAXI_USERNAME,
	password: process.env.TAXI_PASSWORD
});


// This is an async wrapper we'll use to test our scraper
async function main() {
	// Refresh token
	await MunckhofInstance.updateToken();
	let rides = await MunckhofInstance.getRides();
	console.log(rides);
}
// Call the testing mobile!
main();