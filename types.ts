
/** Location of rides */
export interface RideLocation {
	/** Location's name, for example, "Thuisadres" */
	locationName?: string;
	/** Adress, formatted as "City, Somestreet 12B" */
	address: string;
	/** Date string for estimated time of pick-up */
	atTime: string;
}

/** Ride-specific */
export interface RideMeta {
	/** Ride latitude */
	lat?: string | null;
	/** Ride longitude */
	lon?: string | null;
	/** License plate */
	licensePlate?: string | null;
	/** Driver's name */
	driverName?: string | null;
}

export type States = "planned" | "underway" | "picked-up" | "done" | "unknown" | string;

/** Individual ride */
export class Ride {
	id?: string;
	from: RideLocation;
	to: RideLocation;
	/** Status string, for example, "Still has to be driven" */
	statusString: number;
	/** State */
	state: States;
	/** Type this later */
	info: any;
	/** meta */
	meta?: RideMeta;
}
