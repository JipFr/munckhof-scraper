
/** Location of rides */
export interface RideLocation {
	/** Location's name, for example, "Thuisadres" */
	locationName?: string;
	/** Adress, formatted as "City, Somestreet 12B" */
	address: string;
	/** Date string for estimated time of pick-up */
	atTime: string;
}

export type States = "planned" | "underway" | "in-progress" | "done" | "unknown";

/** Individual ride */
export class Ride {
	id?: string;
	from: RideLocation;
	to: RideLocation;
	/** Status string, for example, "Still has to be driven" */
	statusString: number;
	/** State */
	state: States;
}
