import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import {
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { authRequest, postRequest, userRequest } from "../../axios";
import axios from "axios";
const Share = () => {

  const { currentUser } = useContext(AuthContext);
  const [User, setPostUser] = useState(null);

    useEffect(() => {
      if (currentUser.id) {
        getUser();
      }
    }, [currentUser.id]);
  
    const getUser = async () => {
      try {
        const res = await userRequest.get("/user/find/" + currentUser.id);
        setPostUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");


  const upload = async () => {
    const formData = new FormData();
    console.log(file);
    formData.append("file", file);
    formData.append("upload_preset", "TheSocialEdge");
    console.log([...formData.entries()]);
    console.log(formData);
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dbm2pouet/image/upload",
        formData
      );
      console.log(response.data.url);
      return response.data.url;
      // return response; // Return the response after successful upload
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error; // Throw the error to handle it in the calling function
    }
  }

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (newPost) => {
      return postRequest.post("/posts", newPost);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const handleclick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    console.log(imgUrl);
    mutation.mutate({
      description: desc,
      image: imgUrl
    });
    setDesc("");
    setFile(null);
    // try {
    //   await mutation.mutateAsync({
    //     desc,
    //     img: imgUrl,
    //   });
    //   // Reset form state
    //   setDesc("");
    //   setFile(null);
    // } catch (error) {
    //   console.error("Error sharing post:", error);
    //   // Handle error, show a user-friendly message, or log the error
    // }
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
          {User && <img src={User.profilePic} alt="" />}
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.name}?`} onChange={e => setDesc(e.target.value)} value={desc}
            />
          </div>
          <div className="right">
            {file && <img className="file" alt="" src={URL.createObjectURL(file)} />}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])} />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleclick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;