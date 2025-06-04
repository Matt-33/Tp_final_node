import { db } from "../db/index";
import { reservations } from "../shemas";
import { eq } from "drizzle-orm";

type ReservationInsert = typeof reservations.$inferInsert;
type ReservationUpdate = Partial<Omit<ReservationInsert, "id" | "createdAt">>;

export const reservationsModel = {
	create: (reservation: ReservationInsert) => {
		return db
			.insert(reservations)
			.values(reservation)
			.returning()
			.execute();
	},

	getById: (id: string) => {
		return db.query.reservations.findFirst({
			where: eq(reservations.id, id),
		});
	},

	getAll: () => {
		return db.query.reservations.findMany();
	},

	update: (id: string, data: ReservationUpdate) => {
		return db
			.update(reservations)
			.set(data)
			.where(eq(reservations.id, id))
			.execute();
	},

	delete: (id: string) => {
		return db.delete(reservations).where(eq(reservations.id, id)).execute();
	},
};
