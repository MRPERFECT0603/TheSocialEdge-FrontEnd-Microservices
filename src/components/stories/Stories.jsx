import { useContext, useEffect, useState } from "react";
import "./Stories.scss"
import { AuthContext } from "../../context/authContext"

import story1 from "../../assets/story1.jpg";
import story2 from "../../assets/story2.jpg";
import story3 from "../../assets/story3.jpg";
import story4 from "../../assets/story4.jpg";
import story5 from "../../assets/story5.jpg";
import story6 from "../../assets/story6.jpg";
import { userRequest } from "../../axios";


const Stories = () => {

  const { currentUser } = useContext(AuthContext)

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

  //TEMPORARY
  const stories = [
    {
      id: 1,
      name: "Bhavya",
      img: story2,
    },
    {
      id: 2,
      name: "Vivek",
      img: story1,
    },
    {
      id: 3,
      name: "Anmol",
      img: story6,
    },
    {
      id: 4,
      name: "Ansh",
      img: story5,
    },
  ];
  return (
    <div className="stories">
      <div className="story">
        {User && <img src={User.profilePic} alt="" />}
        {User && <span>{User.name}</span>}

        <button>+</button>
      </div>
      {stories.map(story => (
        <div className="story" key={story.id}>
          <img src={story.img} alt="" />
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  )
}

export default Stories