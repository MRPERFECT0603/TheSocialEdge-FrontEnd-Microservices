import { postRequest } from "../../axios";
import Post from "../post/Post";
import "./Posts.scss";
import { useQuery } from '@tanstack/react-query'

const Posts = ({ userId }) => {
  //TEMPORARY
  // const posts = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     userId: 1,
  //     profilePic:
  //       "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //     desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  //     img: "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //   },
  //   {
  //     id: 2,
  //     name: "Jane Doe",
  //     userId: 2,
  //     profilePic:
  //       "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //     desc: "Tenetur iste voluptates dolorem rem commodi voluptate pariatur, voluptatum, laboriosam consequatur enim nostrum cumque! Maiores a nam non adipisci minima modi tempore.",
  //   },
  // ];
  const { isPending, error, data } = useQuery({
    queryKey: ['posts'], queryFn: () =>

      postRequest.get("/posts?userId=" + userId).then(res => {
        return res.data;
      })

  });

  console.log(data);

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message
  if (!Array.isArray(data) || data.length === 0) return 'No posts found.'

  // Sort the data array in descending order based on createdAt
  const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));



  return (
    <div className="posts">
      {sortedData.map((post) => (
        <Post post={post} key={post._id} />
      ))}
    </div>
  )
};

export default Posts;