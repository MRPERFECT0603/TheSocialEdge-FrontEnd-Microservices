import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FavoriteBorderOutlined as FavoriteBorderOutlinedIcon, FavoriteOutlined as FavoriteOutlinedIcon, TextsmsOutlined as TextsmsOutlinedIcon, ShareOutlined as ShareOutlinedIcon, MoreHoriz as MoreHorizIcon } from "@mui/icons-material";
import Comments from "../comments/Comments";
import { likeRequest, postRequest, userRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import "./Post.scss";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [postUser, setPostUser] = useState(null);

  useEffect(() => {
    if (post.userId) {
      getUser();
    }
  }, [post.userId]);

  const getUser = async () => {
    try {
      const res = await userRequest.get("/user/find/" + post.userId);
      setPostUser(res.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const { isPending, error, data } = useQuery({
    queryKey: ['likes', post._id],
    queryFn: () => likeRequest.get("/likes?postId=" + post._id).then(res => res.data),

  });

  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: (isliked) => {
      if (isliked) return likeRequest.delete("/likes?postId=" + post._id);
      return likeRequest.post("/likes?postId=" + post._id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (postId) => postRequest.delete("/posts/" + postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleLike = () => {
    if (post && post.like) {
      const isLiked = post.like.includes(currentUser.id);
      likeMutation.mutate(isLiked);
    }
  };

  const handleDelete = () => {
    const postId = post._id;
    console.log(postId);
    deleteMutation.mutate(postId);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          {postUser && (
            <div className="userInfo">
              <img src={postUser.profilePic} alt="" />
              <div className="details">
                <Link
                  to={`/profile/${postUser.userId}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span className="name">{postUser.name}</span>
                </Link>
                <span className="date">{moment(post.createdAt).fromNow()}</span>
              </div>
            </div>
          )}
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <button onClick={handleDelete}>Delete</button>
          )}
        </div>
        <div className="content">
          <p>{post.description}</p>
          <img src={post.image} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {post.like.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon style={{ color: "red" }} onClick={handleLike} />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {post.like.length || 0} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {post.comment.length || 0}  Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments post={post} />}
      </div>
    </div>
  );
};

export default Post;
