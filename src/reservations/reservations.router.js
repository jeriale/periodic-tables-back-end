/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/asyncErrorBoundary");

router.route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);

router.route("/:reservationId")
    .get(controller.read)
    .delete(controller.destroy)
    .all(methodNotAllowed);

router.route("/:reservationId/edit")
    .delete(controller.destroy)
    .put(controller.update)
    .all(methodNotAllowed);

router.route("/:reservationId/status")
    .put(controller.finish)
    .all(methodNotAllowed);

module.exports = router;
