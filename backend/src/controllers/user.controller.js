import {asyncHandler} from " ../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req, res) => {
    // res.status(200).json({
    //     message: "ok"
    // })


    //get userr details from frontend
    //validation - not empty
    //check if user alredy exist
    //check for images, check for avater
    //upload them
    //create user obj - create entry in db
    // remove password and refresh token field ffrom response
    //check for user creation 
    // return res


    const {username, email, fullname, password} = req.body
    console.log("email: ", email);

    if(
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "all fields are required")
    }

    const existedUserr = User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUserr){
        throw new ApiError(409, "User with email or userrname already exist");
    }

    const avaterLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avaterLocalPath){
        throw new ApiError(400, "Avater file is required")
    }

    const avater = await uploadOnCloudinary(avaterLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avater file is required")
    }

    const user = await User.create({
        fullname,
        avatar: avater.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refeshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "something went wrong in registering user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )
})

export {registerUser}