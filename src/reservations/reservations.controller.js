const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const { DateTime, Settings } = require("luxon");

/**
 * Set the current time zone that the restaurant resides.
 */
Settings.defaultZoneName = "America/New_York";

/**
 * Lists all reservations by date query parameter.
 */
async function listByDate(req, res) {
  const { date } = req.query;
  res.json({ data: await service.listReservations(date) });
}

/**
 * Reads a specific reservation by `reservation_id`
 */
function read(req, res) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

/**
 * Creates a new reservation after validation.
 */
async function create(req, res) {
  const data = res.locals.reservation;
  const response = await service.createReservation(data);
  res.status(201).json({ data: response[0] });
}

/**
 * Updates an existing reservation.
 */
async function update(req, res) {
  const { data } = req.body;
  const { reservationId } = req.params;
  res.json({ data: await service.updateReservation(data, reservationId) });
}

/**
 * Updates an existing reservation.
 */
async function destroy(req, res) {
  const { reservationId } = req.params;
  res.json({ data: await service.deleteReservation(reservationId) });
}

// MIDDLEWARE FUNCTIONS

/**
 * Verifies that a `:/reservationId` is present.
 */
function hasReservationIdParameter(req, res, next) {
  const { reservationId } = req.params;
  if (!reservationId) {
    return next({
      status: 404,
      message: `The following 'reservation_id' could not be found: ${reservationId}`
    });
  }
  res.locals.reservationId = reservationId;
  next();
}

/**
 * Verifies that a `reservation_id` exists.
 */
async function reservationExists(req, res, next) {
  const { reservationId } = res.locals;
  const reservation = await service.getReservationById(reservationId);
  if (!reservation) {
    return next({
      status: 404,
      message: `The following reservation could not be found: ${reservationId}.`
    });
  }
  res.locals.reservation = reservation;
  next();
}


/**
 * Verifies all of the properties are present in the `formData` from the `ReservationForm` component.
 */
function propertiesArePresent(req, res, next) {
  const { data } = req.body;
  if (!data) {
    return next({
      status: 400,
      message: "A 'reservation' is required."
    });
  }
  if (!data.first_name) {
    return next({
      status: 400,
      message: "A 'first_name' is required."
    });
  }
  if (!data.last_name) {
    return next({
      status: 400,
      message: "A 'last_name' is required."
    });
  }
  if (!data.mobile_number) {
    return next({
      status: 400,
      message: "A 'mobile_number' is required."
    });
  }
  if (!data.reservation_date) {
    return next({
      status: 400,
      message: "A 'reservation_date' is required."
    });
  }
  if (!data.reservation_time) {
    return next({
      status: 400,
      message: "A 'reservation_time' is required."
    });
  }
  if (!data.people) {
    return next({
      status: 400,
      message: "A 'people' value is required."
    });
  }
  res.locals.reservation = data;
  next();
}

/**
 * Verifies that the `reservation_date` is in a valid format.
 */
function hasValidDate(req, res, next) {
  const { reservation_date } = res.locals.reservation;
  if (!DateTime.fromISO(reservation_date).isValid) {
    return next ({
      status: 400,
      message: "A valid 'reservation_date' must be provided."
    });
  }
  next();
}

/**
 * Verifies that the `reservation_date` is not in the past.
 */
function dateHasNotPassed(req, res, next) {
  const { reservation_date } = res.locals.reservation;
  if (reservation_date < DateTime.local().toISODate()) {
    return next({
      status: 400,
      message: "The 'reservation_date' must be in the future."
    });
  }
  next();
}

/**
 * Verifies that the `reservation_date` does not fall on a Tuesday.
 */
function dateIsNotOnTuesday(req, res, next) {
  const { reservation_date } = res.locals.reservation;
  if (DateTime.fromISO(reservation_date).toFormat("EEEE") === "Tuesday") {
    return next({
      status: 400,
      message: "The restaurant is closed on Tuesdays."
    });
  }
  next();
}

/**
 * Verifies that the `reservation_time` is in a valid format.
 */
function hasValidTime(req, res, next) {
  const { reservation_time } = res.locals.reservation;
  if (!DateTime.fromISO(reservation_time).isValid) {
    return next({
      status: 400,
      message: "A valid 'reservation_time' is required."
    });
  }
  next();
}

/**
 * If `reservation_date` is today, verify that the `reservation_time` is not in the past.
 */
function timeIsAfterCurrentTime(req, res, next) {
  const { reservation_date, reservation_time } = res.locals.reservation;

  const currentDate = DateTime.local().toISODate();
  const reservedDate = DateTime.fromISO(reservation_date).toISODate();
  
  const currentTime = DateTime.local().toISOTime();
  const reservedTime = DateTime.fromISO(reservation_time).toISOTime();

  if (reservedDate > currentDate) {
    return next();
  }

  if (reservedDate === currentDate && reservedTime < currentTime) {
    const currentTimeDisplay = DateTime.fromISO(currentTime).toFormat("t");
    return next({
      status: 400,
      message: `Reservation must be made after ${currentTimeDisplay}.`
    });
  }
  next();
}

/**
 * Verifies that the `people` value is of type `Number`.
 */
function numberOfPeopleIsNumber(req, res, next) {
  const { people } = res.locals.reservation;
  if (typeof people !== "number" && people > 0) {
    return next({
      status: 400,
      message: "The 'people' value must be a number."
    });
  }
  next();
}

/**
 * Verifies that the `reservation_time` falls within the restaurant being open and within one hour of the restaurant closing.
 */
function timeIsWhileOpen(req, res, next) {
  const { reservation_time } = res.locals.reservation;
  const reservationTime = DateTime.fromISO(reservation_time);
  const restaurantOpen = DateTime.fromObject({ hour: 10, minute: 30 });
  const restaurantClosed = DateTime.fromObject({ hour: 21, minutes: 30 });
  if (reservationTime < restaurantOpen) {
    return next({
      status: 400,
      message: "The restaurant does not open until 10:30AM."
    });
  }
  if (reservationTime > restaurantClosed) {
    return next({
      status: 400,
      message: "The restaurant closes at 10:30PM. Please make a reservation an hour before closing time."
    });
  }
  next();
}

module.exports = {
  listByDate: asyncErrorBoundary(listByDate),
  read: [
    hasReservationIdParameter,
    asyncErrorBoundary(reservationExists),
    read
  ],
  create: [
    propertiesArePresent,
    hasValidDate,
    dateHasNotPassed,
    dateIsNotOnTuesday,
    hasValidTime,
    timeIsAfterCurrentTime,
    timeIsWhileOpen,
    numberOfPeopleIsNumber,
    asyncErrorBoundary(create)
  ],
  update: [
    propertiesArePresent,
    hasValidDate,
    dateHasNotPassed,
    dateIsNotOnTuesday,
    hasValidTime,
    timeIsAfterCurrentTime,
    timeIsWhileOpen,
    numberOfPeopleIsNumber,
    asyncErrorBoundary(update)
  ],
  destroy: [
    hasReservationIdParameter,
    asyncErrorBoundary(reservationExists),
    destroy
  ]
};
