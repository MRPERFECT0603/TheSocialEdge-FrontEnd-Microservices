
// //Temporary
// const comments = [
//   {
//     id: 1,
//     desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam",
//     name: "John Doe",
//     userId: 1,
//     profilePicture:
//       "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//   },
//   {
//     id: 2,
//     desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam",
//     name: "Jane Doe",
//     userId: 2,
//     profilePicture:
//       "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
//   },
// ];
import { useContext, useEffect, useState } from "react";
import "./Comments.scss";
import { AuthContext } from "../../context/authContext";
import { commentRequest, userRequest } from "../../axios";
import moment from "moment";
import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'

const Comments = ({ post }) => {
  const [postUser, setPostUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await userRequest.get("/user/find/" + post.userId);
        setPostUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (post.userId) {
      getUser();
    }
  }, [post.userId]);

  const { currentUser } = useContext(AuthContext);

  const [desc, setDesc] = useState("");

  const { isPending, error, data } = useQuery({
    queryKey: ['comments'], queryFn: () =>
      commentRequest.get("/comments?postId=" + post._id).then(res => {
        return res.data;
      })
  });

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (newComment) => {
      return commentRequest.post("/comments?postId=" + post._id , newComment);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })

  const handleclick = async (e) => {
    e.preventDefault();
    mutation.mutate({
      comment: desc
    });
    setDesc("");
  };

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div className="comments">
      <div className="write">
        <img src={postUser ? postUser.profilePic : ''} alt="" />
        <input type="text" placeholder="write a comment"
          value={desc}
          onChange={e => setDesc(e.target.value)} />
        <button onClick={handleclick}>Send</button>
      </div>
      {data.map((comment) => (
        <div className="comment" key={comment._id}>
          <img src={comment.userProfile} alt="" />
          <div className="commentinfo">
            <span>{comment.userName}</span>
            <p>{comment.comment}</p>
          </div>
          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
