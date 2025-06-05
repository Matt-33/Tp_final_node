import { db } from "../db/index";
import { reservations } from "../shemas";
import { eq, and, gte, lte } from "drizzle-orm";

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

	getByRestaurantId: (restaurantId: string) => {
		return db.query.reservations.findMany({
			where: eq(reservations.restaurantId, restaurantId),
			with: {
				user: true,
				table: true,
			},
			orderBy: (reservations, { desc }) => [desc(reservations.reservationDate)],
		});
	},

	getByUserId: (userId: string) => {
		return db.query.reservations.findMany({
			where: eq(reservations.userId, userId),
			with: {
				restaurant: true,
				table: true,
			},
			orderBy: (reservations, { desc }) => [desc(reservations.reservationDate)],
		});
	},

	getByRestaurantAndDate: (restaurantId: string, date: Date) => {
		const startDate = new Date(date);
		startDate.setHours(0, 0, 0, 0);

		const endDate = new Date(date);
		endDate.setHours(23, 59, 59, 999);

		return db.query.reservations.findMany({
			where: and(
				eq(reservations.restaurantId, restaurantId),
				gte(reservations.reservationDate, startDate),
				lte(reservations.reservationDate, endDate)
			),
			with: {
				user: true,
				table: true,
			},
			orderBy: (reservations, { asc }) => [asc(reservations.reservationDate)],
		});
	},

	getUpcomingByRestaurant: (restaurantId: string) => {
		const now = new Date();

		return db.query.reservations.findMany({
			where: and(
				eq(reservations.restaurantId, restaurantId),
				gte(reservations.reservationDate, now)
			),
			with: {
				user: true,
				table: true,
			},
			orderBy: (reservations, { asc }) => [asc(reservations.reservationDate)],
		});
	},
};
