
import { useState } from "react";
import "./Update.scss"
import { authRequest, userRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";


const Update = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    username: user.username,
    email: user.email,
    password: user.password,
    name: user.name,
    city: user.city,
    website: user.website,
  });
  const upload = async (file) => {
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
  };
  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (user) => {
      return userRequest.put("/user", user);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const handleclick = async (e) => {
    e.preventDefault();
    let coverUrl;
    let profileUrl;

    profileUrl = profile ? await upload(profile) : user.profilePic;
    coverUrl = cover ? await upload(cover) : user.coverPic;
    console.log(profileUrl);
    console.log(coverUrl);
    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
    mutation.isSuccess && window.location.reload()
    setOpenUpdate(false);
  };
  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form>
          <div className="files">
            {/* Cover Picture */}
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    cover
                      ? URL.createObjectURL(cover)
                      : "/upload/" + user.coverPic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="cover"
              style={{ display: "none" }}
              onChange={(e) => setCover(e.target.files[0])}
            />

            {/* Profile Picture */}
            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    profile
                      ? URL.createObjectURL(profile)
                      : "/upload/" + user.profilePic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={(e) => setProfile(e.target.files[0])}
            />
          </div>

          {/* Other input fields */}
          <label>Email</label>
          <input
            type="text"
            value={texts.email}
            name="email"
            onChange={handleChange}
          />
          {/* ... other input fields ... */}
          <label>Name</label>
          <input
            type="text"
            value={texts.name}
            name="name"
            onChange={handleChange}
          />
          <label>City</label>
          <input
            type="text"
            value={texts.city}
            name="city"
            onChange={handleChange}
          />
          <label>Website</label>
          <input
            type="text"
            value={texts.website}
            name="website"
            onChange={handleChange}
          />

          {/* Update button */}
          <button onClick={handleclick}>Update</button>
        </form>

        {/* Close button */}
        <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
      </div>
    </div>
  );
};

export default Update;