const router = require("express").Router();
const {init, showList, showDetails} = require ("../controller/blogController.js");

router.get("/", init);
router.get("/", showList);
router.get("/:id", showDetails);

module.exports = router;