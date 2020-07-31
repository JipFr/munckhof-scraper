
// Import modules
import fetch from "node-fetch";

// Import types
import { Ride, RideLocation, States } from "./types";

/** The API ride data */
interface ApiRide {
    Oid: string; // Ride ID
    PersoonOid: string; // Person's ID. also found in `session.session.PersonOid`
    AanvangDatumTijd: string; // Date string
    AanvangRelatieNaam: string; // Name for starting location of ride
    AanvangPlaats: string; // City of ride start
    AanvangStraat: string; // String of start address
    EindDatumTijd: string; // Date string
    EindRelatieNaam: string; // Name of end place
    EindPlaats: string; // City of end result
    EindStraat: string; // End result
    Status: number; // Status number
    StatusWeergave: string; // String showing the state, can be used in UI.
}

/** 
 * New location interface after stripping it for conversion 
 * It essentially inherits ApiRide, check that out for type defs
 */
interface NewLocation {
	RelatieNaam: string;
	DatumTijd: string;
	Plaats: string;
	Straat: string;
}

/** Options to be passed into Munckhof class */
interface MunckhofOptions {
	username: string;
	password: string;
}

/** A session with Munckhof */
interface MunckhofSession {
	/** A Munckhof token. I believe this can be used as a Bearer */
	Token: string;
	/** Personal ID */
	PersoonOid: string;
	/** Whether a password change should be forces */
	ForcePsswordChange: boolean;
}

class RideConverter extends Ride {

	constructor(current: ApiRide) {
		super();
		this.id = current.Oid;
		this.from = this.toLocation(current, "Aanvang");
		this.to = this.toLocation(current, "Eind");
		this.state = this.getState(current.StatusWeergave);
	}

	private getState(apiState: string): States {
		switch(apiState) {
			case "Moet nog verreden worden":
				return "planned";
			default:
				console.log(apiState);
				return "unknown";
		}
	}

	/** Extract location variables from ride */
	private toLocation(ride: ApiRide, key: "Aanvang" | "Eind" = "Aanvang") {
		
		// @ts-ignore TypeScript has not yet implemented fromEntries
		let locationValues: NewLocation = Object.fromEntries (
			Object.entries(ride)
		  .filter(keyValue => keyValue[0].startsWith(key))
		  .map(keyValue => [keyValue[0].slice(key.length), keyValue[1]] )	
		);

		let locationObject = {
			locationName: locationValues.RelatieNaam,
			address: `${locationValues.Plaats}, ${locationValues.Straat}`,
			atTime: locationValues.DatumTijd
		};

		return locationObject;
	}

}

class Munckhof {

	// URLs
	protected APIROOT: string;
	protected LOGINURL: string;
	protected RIDESURL: string;

	// Authentication
	private username: string;
	private password: string;
	private session: MunckhofSession;

	constructor(options: MunckhofOptions) {

		// Set default values
		options = {
			username: null,
			password: null,
			...options
		};

		if(!options.username || !options.password) throw this.Error("Missing username or password for Munckhof instance");

		// Store username and passwords
		this.username = options.username;
		this.password = options.password;

		// Munckhof API urls
		this.APIROOT = `https://mmapi.munckhof.nl/api`
		this.LOGINURL = `${this.APIROOT}/Login`;
		this.RIDESURL = `${this.APIROOT}/DagPlanningRitOpdracht`;

	}

	/** Update token field, thus refreshing the session */
	public async updateToken() {

		// POST to login endpoint
		let loginRes = await fetch(this.LOGINURL, {
			method: "POST",
			headers: {
				...this.headers(),
				"content-type": "application/json"
			},
			body: JSON.stringify({
				"Password": this.password,
				"Username": this.username,
				"Vervoerder": "Munckhof",
				"Taal": 0
			})
		});
		
		// Munckhof actually provides proper HTTP errors.
		// Thank fuck.
		if(!loginRes.ok) throw this.Error(`HTTP ${loginRes.status}: ${loginRes.statusText}`);
		
		let loginData = await loginRes.json();
		this.session = loginData;

	}

	/** Get scheduled */
	public async getRides() {
		// Request relevant data
		let rideRes = await fetch(this.RIDESURL, {
			method: "GET",
			headers: this.headers()
		});
		
		// Error handling
		if(!rideRes.ok) throw this.Error(`HTTP ${rideRes.status}: ${rideRes.statusText}`);

		// Get ride data
		let rideData: ApiRide[] = await rideRes.json();
		return rideData.map(ride => new RideConverter(ride));
	}



	// PRIVATE METHODS

	/** Generate headers for each request */
	private headers() {
		let headers = {
			"User-Agent": "Munckhof.MobileApp/30.2",
			"accept-language": "en-gb"
		};
		if(this?.session?.Token) headers["Authorization"] = `Bearer ${this.session.Token}`;
		return headers;
	}
	/**
	 * Generate error class
	 * @param error A message describing the error
	 */
	private Error(error: string) {
		return new Error(`Munckhof error: ${error}`);
	}
}

export default Munckhof;