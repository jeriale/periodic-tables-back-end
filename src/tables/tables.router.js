/**
 * Defines the router for table resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/asyncErrorBoundary");
 
router.route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

router.route("/:tableId")
  .get(controller.read)
  .delete(controller.destroy)
  .all(methodNotAllowed);

router.route("/:tableId/edit")
  .put(controller.update)
  .all(methodNotAllowed);

router.route("/:tableId/seat")
  .delete(controller.dismiss)
  .put(controller.changeStatus)
  .all(methodNotAllowed);
 
 module.exports = router;