const knex = require("../db/connection");

/**
 * Gets all reservations where `reservation_date` is equal to the `date` search query parameter.
 */
const listReservations = (date) =>
    knex("reservations")
        .select("*")
        .where({ "reservation_date": date })
        .orderBy("reservation_time");

/**
 * Gets all reservations where `reservation_date` is equal to the `date` search query parameter.
 */
const getReservationById = (reservationId) =>
    knex("reservations")
        .where({ "reservation_id": reservationId })
        .first();

/**
 * Inserts a new reservation.
 * @param data
 * The `formData` generated by the reservation form component.
 * @returns The newly created reservation record.
 */
const createReservation = (data) =>
    knex("reservations")
        .insert(data, "*");

const updateReservation = (data, reservationId) => 
    knex("reservations")
        .where({ "reservation_id": reservationId })
        .update({
            "first_name": data.first_name,
            "last_name": data.last_name,
            "mobile_number": data.mobile_number,
            "reservation_date": data.reservation_date,
            "reservation_time": data.reservation_time,
            "people": data.people
        });

const deleteReservation = (reservationId) =>
    knex("reservations")
        .where({ "reservation_id": reservationId })
        .del();

module.exports = {
    listReservations,
    getReservationById,
    createReservation,
    updateReservation,
    deleteReservation
}