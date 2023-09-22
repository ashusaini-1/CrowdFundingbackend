const Comment = require("../models/commentModel");

module.exports.addComment = async (req, res) => {
  const { comment, campaignId } = req.body; // Assuming campaignId is provided in the request body

  try {
    const userComment = await Comment.create({
      comment,
      Campaign: campaignId, // Associate the comment with the campaign ID
    });

    res.status(201).json({
      success: true,
      userComment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Comment creation failed" });
  }
};

exports.addReplyToComment = async (req, res) => {
  try {
    const { commentId, replyText, userId } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const newReply = {
      user: userId, // The user who posted the reply
      replyText,
    };

    comment.replies.push(newReply);
    await comment.save();

    res.status(201).json({ success: true, comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Reply creation failed" });
  }
};

module.exports.viewComment = async (req, res) => {
  const comments = await Comment.find(req.params.campaignId);

  res.status(200).json({
    success: true,
    comments,
  });
};
