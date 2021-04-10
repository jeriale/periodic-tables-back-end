const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * Lists all tables by `all`, `free` or `occupied` status.
 */
async function list(req, res) {
  const { status = "free" } = req.query;
  if (status === "all") {
    res.json({ data: await service.listAllTables() });
  }
  if (status === "occupied") {
    res.json({ data: await service.listOccupiedTables() });
  }
  if (status === "free") {
    res.json({ data: await service.listFreeTables() });
  }
}

/**
 * Gets a table by `table_id` after validation.
 */
function read(req, res) {
  const { table } = res.locals;
  res.json({ data: table });
}

/**
 * Creates a new table after validation.
 */
async function create(req, res) {
  const { table } = res.locals;
  const response = await service.createTable(table);
  res.status(201).json({ data: response[0] });
}

/**
 * Updates an existing table by `table_id`.
 */
async function update(req, res) {
  const { table } = res.locals;
  res.json({ data: await service.updateTable(table) });
}

/**
 * Changes the status of a table by assigning a `reservation_id`.
 */
async function assign(req, res) {
  const { table, reservationId } = res.locals;
  res.json({ data: await service.assignReservation(reservationId, table.table_id) });
}

/**
 * Changes the status of a table by assigning a `reservation_id`.
 */
async function dismiss(req, res) {
  const { table } = res.locals;
  const { reservation_id } = req.body.data;
  res.json({ data: await service.dismissTable(table.table_id, reservation_id) });
}

/**
 * Changes the status of a table by assigning a `reservation_id`.
 */
async function destroy(req, res) {
  const { tableId } = req.params;
  res.json({ data: await service.deleteTable(tableId) });
}

// MIDDLEWARE

/**
 * Verifies the presence of a `reservation_id`.
 */
 function hasReservationId(req, res, next) {
  const { reservation_id } = req.body.data;
  if (!reservation_id) {
    return next({
      status: 400,
      message: "A 'reservation_id' is required."
    });
  }
  res.locals.reservationId = reservation_id;
  next();
}

/**
 * Verifies the presence of a `/:tableId` parameter.
 */
function hasTableIdParameter(req, res, next) {
  const { tableId } = req.params;
  if (!tableId) {
    return next({
      status: 400,
      message: "A '/:tableId' is required."
    });
  }
  res.locals.tableId = tableId;
  next();
}

/**
 * Verifies that a `table_id` exists.
 */
async function tableExists(req, res, next) {
  const { tableId } = req.params;
  const table = await service.getTableById(tableId);
  if (!table) {
    return next({
      status: 404,
      message: `The following 'table_id' could not be found: ${tableId}`
    });
  }
  res.locals.table = table;
  next();
}

/**
 * Verifies that a `reservation_id` exists.
 */
async function reservationExists(req, res, next) {
  const { reservationId } = res.locals;
  const reservation = await service.getReservationSize(reservationId);
  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation '${reservationId}' does not exist.`
    });
  }
  res.locals.reservation = reservation;
  next();
}

/**
 * Verifies all of the properties are present in the `formData` from the `TableForm` component.
 */
function propertiesArePresent(req, res, next) {
  const { data } = req.body;
  if (!data) {
    return next({
      status: 400,
      message: "A 'table' is required."
    });
  }
  
  if (!data.table_name) {
    return next({
      status: 400,
      message: "A 'table_name' is required."
    });
  }

  if (!data.capacity) {
    return next({
      status: 400,
      message: "A 'capacity' is required."
    });
  }
  res.locals.table = data;
  next();
}

/**
 * Verifies that `table_name` is at least `2` characters in length.
 */
function tableNameIsProperLength(req, res, next) {
  const { table } = res.locals;
  if (table.table_name.length < 2) {
    return next({
      status: 400,
      message: "A 'table_name' must be at least 2 characters long."
    });
  }
  next();
}

/**
 * Verifies that the table is not occupied by checking for a `reservation_id` value of `!null`.
 */
function tableIsNotOccupied(req, res, next) {
  const { table } = res.locals;
  if (table.reservation_id) {
    return next({
      status: 400,
      message: "The table is currently occupied. Please make another selection."
    });
  }
  next();
}

/**
 * Verifies that the table `capacity` can support the number of `people` in the reservation.
 */
function tableHasSufficientCapacity(req, res, next) {
  const { table, reservation } = res.locals;
  if (reservation.people > table.capacity) {
    return next({
      status: 400,
      message: "The selected table capacity cannot support the number of people in the reservation."
    });
  }
  next();
}

function tableIsOccupied(req, res, next) {
  const { table } = res.locals;
  if (!table.reservation_id) {
    return next({
      status: 400,
      message: "The selected table is not occupied."
    });
  }
  next();
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [
    hasTableIdParameter,
    asyncErrorBoundary(tableExists),
    read
  ],
  create: [
    propertiesArePresent,
    tableNameIsProperLength,
    asyncErrorBoundary(create)
  ],
  update: [
    hasTableIdParameter,
    asyncErrorBoundary(tableExists),
    propertiesArePresent,
    tableNameIsProperLength,
    asyncErrorBoundary(update)
  ],
  assign: [
    hasReservationId,
    hasTableIdParameter,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    tableIsNotOccupied,
    tableHasSufficientCapacity,
    asyncErrorBoundary(assign)
  ],
  dismiss: [
    hasTableIdParameter,
    asyncErrorBoundary(tableExists),
    tableIsOccupied,
    asyncErrorBoundary(dismiss)
  ],
  destroy: [
    asyncErrorBoundary(tableExists),
    tableIsNotOccupied,
    destroy
  ]
};
