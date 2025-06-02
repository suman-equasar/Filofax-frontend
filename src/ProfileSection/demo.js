// Get user details from Redux store
const userDetails =
  useSelector((state) => state.user.userDetails) || state.user.User;
// Initialize dispatch
const dispatch = useDispatch();

// Use the data from Redux to initialize the profile
useEffect(() => {
  console.log(`User Details from redux :`, userDetails);
  console.log("User email :", userDetails?.email);

  if (userDetails) {
    setProfileData({
      name: userDetails.name || "",
      email: userDetails.email || "",
      welcomeMessage: userDetails.welcomeMessage || "Welcome to my profile",
      dateFormat: userDetails.dateFormat || "YYYY/MM/DD",
      timeFormat: userDetails.timeFormat || "12h",
      timezone: userDetails.timezone || "India",
      profileImage: userDetails.profileImage || null,
    });

    // If there's a profile image from Redux, update the preview
    if (userDetails.profileImage) {
      setPreviewImage(userDetails.profileImage);
    }
  }
}, [userDetails]);
