const User = require("../models/user");



exports.getProfile = async (req, res) => {

    try {

        const userId = req.user._id;

        const user =  await User.findById(userId).populate(`userType`);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: `User not found`
            })
        };

        return res.status(200).json({
            success: true,
            profile: {
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                address: user.address,
                profileImage: user.profileImage,
                dob: user.dob,
                gender: user.gender,
                role: user.userType?.role
            }
        });
    } catch (error) {

        console.log("GET PROFILE ERROR:", error);

        return res.status(500).Json({
            success: false,
            message: "Failed to fetch profile"
        });
    }
}