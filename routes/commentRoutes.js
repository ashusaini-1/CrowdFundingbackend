const express = require("express");
const router = express.Router();
const { addComment, viewComment,addReplyToComment } = require("../controller/commentController");
const { isAuthenticatedUser } = require("../middleware/auth");
router.route("/add/comment/:id").post(isAuthenticatedUser,addComment);
router.route("/view/comment/:id").get(viewComment);

router.route("/comment/reply").post(addReplyToComment);
module.exports = router;
