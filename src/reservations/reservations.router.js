/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/asyncErrorBoundary");

router.route("/")
    .get(controller.listByDate)
    .post(controller.create)
    .all(methodNotAllowed);

router.route("/:reservationId")
    .get(controller.read)
    .delete(controller.destroy)
    .all(methodNotAllowed);

router.route("/:reservationId/edit")
    .put(controller.update)
    .all(methodNotAllowed);

module.exports = router;
