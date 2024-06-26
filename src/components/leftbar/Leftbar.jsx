import "./Leftbar.scss"
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Market from "../../assets/3.png";
import Watch from "../../assets/4.png";
import Memories from "../../assets/5.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";
import Tutorials from "../../assets/11.png";
import Courses from "../../assets/12.png";
import Fund from "../../assets/13.png";
import { AuthContext } from "../../context/authContext";
import { useContext, useState, useEffect } from "react";
import { userRequest } from "../../axios";

const Leftbar = () => {

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
    // console.log(currentUser);
    const [currUser, setCurrUser] = useState(currentUser);
    useEffect(() => {
        // const { currentUser } = useContext(AuthContext);
        // setCurrUser(currentUser);
        setCurrUser({ ...currentUser }, currentUser);
        console.log(currentUser);

    }, [currentUser])

    //console.log(currUser);
    return (
        <div className="leftbar">
            <div className="container">
                <div className="menu">
                    <div className="user">
                        {User && <img src={User.profilePic} alt="" />}
                        {User && <span>{User.name}</span>}
                    </div>
                    <div className="item">
                        <img src={Friends} alt="" />
                        <span>Friends</span>
                    </div>
                    <div className="item">
                        <img src={Groups} alt="" />
                        <span>Groups</span>
                    </div>
                    <div className="item">
                        <img src={Market} alt="" />
                        <span>Marketplace</span>
                    </div>
                    <div className="item">
                        <img src={Watch} alt="" />
                        <span>Watch</span>
                    </div>
                    <div className="item">
                        <img src={Memories} alt="" />
                        <span>Memories</span>
                    </div>
                </div>
                <hr />
                <div className="menu">
                    <span>Your shortcuts</span>
                    <div className="item">
                        <img src={Events} alt="" />
                        <span>Events</span>
                    </div>
                    <div className="item">
                        <img src={Gaming} alt="" />
                        <span>Gaming</span>
                    </div>
                    <div className="item">
                        <img src={Gallery} alt="" />
                        <span>Gallery</span>
                    </div>
                    <div className="item">
                        <img src={Videos} alt="" />
                        <span>Videos</span>
                    </div>
                    <div className="item">
                        <img src={Messages} alt="" />
                        <span>Messages</span>
                    </div>
                </div>
                <hr />
                <div className="menu">
                    <span>Other</span>
                    <div className="item">
                        <img src={Fund} alt="" />
                        <span>Fund</span>
                    </div>
                    <div className="item">
                        <img src={Tutorials} alt="" />
                        <span>Tutorials</span>
                    </div>
                    <div className="item">
                        <img src={Courses} alt="" />
                        <span>Courses</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Leftbar