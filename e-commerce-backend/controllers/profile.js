const User = require("../models/user");



exports.getProfile = async (req, res) => {

    try {

        const userId = req.user._id;

        const user = await User.findById(userId).populate(`userType`);

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




exports.updateProfile = async (req, res) => {

    try {
        const { name, mobile, address, dob, gender } = req.body;
        const userId = req.user._id
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        };

        if (name) {
            user.name = name
        }


        if (mobile) {
            user.mobile = mobile
        }


        if (address) {
            user.address = address
        }


        if (dob) {
            user.dob = dob
        }


        if (gender) {
            user.gender = gender
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully !!"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Internal server error`
        })
    }
}