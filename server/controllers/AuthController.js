const Couple = require('../models/Couple');
const User = require('../models/User');
const Report = require('../models/Report');
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendMail');
const crypto = require('crypto');
const getStringUntilCharacter = require('../utils/getStringUntilCharacter');
const deleteImage = require('../utils/deleteImage');

// Refresh token => Cấp mới access token
// Access token => Xác thực user, phần quyền user
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({
            success: false,
            message: `Missing inputs`
        })
    const findUser = await User.findOne({ email: email })
    if (!findUser) throw new Error('Account not found. Please try again')

    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        // Tách password và role ra khỏi response 
        const { password, role, refreshToken, ...userData } = response.toObject()
        // Tạo access token
        const accessToken = generateAccessToken(response._id, role)
        // Tạo refresh token
        const newRefreshToken = generateRefreshToken(response._id)
        // Save refresh token into database
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true }) //new:true -- trả về data sau khi update
        // Lưu refresh token vào cookie 
        res.cookie('refreshsToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }) //số mili giây trong 7 ngày
        return res.status(200).json({
            success: true,
            accessToken,
            findUser
        })
    } else {
        throw new Error(`Wrong email or password`)
    }
})

const register = asyncHandler(async (req, res) => {
    let { email, password, name, username
        // ,gender, dob, phone 
    } = req.body;
    if (!email || !password)
        return res.status(400).json({
            success: false,
            message: `Missing inputs`
        })
    const userByEmail = await User.findOne({ email })
    if (userByEmail) throw new Error(`Email has existed!`)
    // const userByPhone = await User.findOne({ phone })
    // if (userByPhone) throw new Error(`Phone has existed!`)
    const userByUsername = await User.findOne({ username })
    if (userByUsername) throw new Error(`Username ${userByUsername.username} has existed`)
    if (!username.trim() && !name.trim()) {
        username = getStringUntilCharacter(email, '@')
        name = getStringUntilCharacter(email, '@')
    }
    if (!username.trim()) {
        username = getStringUntilCharacter(email, '@')
    }
    const newUser = {
        email, password, name, username
        // , gender, dob, phone 
    }
    const registerToken = crypto.createHash('sha256').update(crypto.randomBytes(32).toString('hex')).digest('hex')
    res.cookie('dataRegister', { ...newUser, registerToken }, { httpOnly: true, maxAge: 15 * 60 * 1000 });
    const html = `Please click the link below to verify your account. This link will expire after 15 minutes. 
                    <a href=${process.env.URL_SERVER}/api/auth/final-register/${registerToken}>Click here</a>`
    await sendEmail({ email, html, subject: 'Final Registration for Love Diary account' })
    return res.json({
        success: true,
        message: 'Please check your email to verify your account'
    })
})

const finalRegister = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    const { registerToken } = req.params
    if (!cookie || cookie?.dataRegister?.registerToken !== registerToken) {
        res.clearCookie('dataRegister')
        return res.redirect(`${process.env.URL_CLIENT}/finalregister/failed`)
    }
    const userByEmail = await User.findOne({ email: cookie?.dataRegister.email })
    if (userByEmail) return res.redirect(`${process.env.URL_CLIENT}/finalregister/failed`)

    const newUser = await User.create({
        email: cookie?.dataRegister?.email,
        password: cookie?.dataRegister?.password,
        name: cookie?.dataRegister?.name,
        username: cookie?.dataRegister?.username,
    })

    const currentTime = new Date();
    if (newUser) {
        const newTmpCouple = await Couple.create({
            createdUser: newUser._id,
            startLoveDate: currentTime,
            isConnected: false,
            userNameCouple: cookie?.dataRegister?.username,
            isHidden: false,
        })
        res.clearCookie('dataRegister')
        if (newTmpCouple) {
            return res.redirect(`${process.env.URL_CLIENT}/finalregister/success`)
        } else {
            await User.findOneAndDelete({ email: cookie?.dataRegister.email })
            return res.redirect(`${process.env.URL_CLIENT}/finalregister/failed`)
        }
    } else {
        return res.redirect(`${process.env.URL_CLIENT}/finalregister/failed`)
    }
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const { _id } = req.user

    const user = await User.findById(_id).select('-refreshToken -password').populate('followings', 'avatarCouple userNameCouple nameCouple')
    return res.status(200).json({
        success: user ? true : false,
        result: user ? user : 'User not found'
    })
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    // Lấy token từ cookie
    const cookie = req.cookies
    // Check có token hay không
    if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookies')
    // Check token có hợp lệ không
    const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findOne({ _id: result._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken({ _id: response._id, role: response.role }) : 'Refresh token not matched'
    })
})

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookie')
    // Xóa refresh token ở db 
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    // Xóa refresh token ở cookie trình duyệt 
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        message: 'Log out is done'
    })
})

// Client gửi email 
// Server check email hợp lệ hay không => gửi mail + link (kèm theo token thay đổi password)
// Client check mail => click link 
// Client gửi API kèm token 
// Server check token giống với token server gửi mail hay không
// Change password

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) throw new Error('Missing email')
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')
    const resetToken = user.createPasswordChangedToken()
    await user.save()

    const html = `Please click on the link below to change your password. This link will expire after 15 minutes. 
                    <a href=${process.env.URL_CLIENT}/resetpassword/${resetToken}>Click here</a>`
    const data = {
        email,
        html,
        subject: 'Forgot your password'
    }
    const result = await sendEmail(data)
    return res.status(200).json({
        success: result.response?.includes('OK') ? true : false,
        message: result.response?.includes('OK') ? 'Please check your email and follow the instructions' : 'An error occurred, please try again later!!!'
    })
})

const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Missing inputs')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        message: user ? 'Updated password' : 'Something went wrong'
    })
})

const getAllUsers = asyncHandler(async (req, res) => {
    const response = await User.find({ role: 16 }).select('isBlocked reports avatar name username email gender address')
    return res.status(200).json({
        success: response ? true : false,
        result: response
    })
})

const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.user  //id lấy từ token của user
    if (!_id) throw new Error(`Missing inputs`)
    const response = await User.findByIdAndDelete(_id)
    return res.status(200).json({
        success: response ? true : false,
        deletedUser: response ? `User with email ${response.email} deleted` : 'Delete user failed'
    })
})

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    let { avatarUser, username, name, phone, gender, dob, horoscope, address, facebookLink, tiktokLink, instagramLink, avatarname } = req.body
    const infoUser = await User.findById(_id)
    // if (infoUser) {
    if (typeof avatarUser !== 'String') {
        const array = []
        array.push(avatarname)
        deleteImage(array)
        avatarUser = req.file?.path
        avatarname = req.file?.filename
    }

    if (!name) name = username

    const updateInfoUser = await User.findByIdAndUpdate(_id, { avatar: avatarUser, username, name, phone, gender, dob, horoscope, address, facebookLink, tiktokLink, instagramLink, avatarname }, { new: true }).select('-refreshToken -password -role')
    return res.status(200).json({
        success: updateInfoUser ? true : false,
        updatedUser: updateInfoUser ? updateInfoUser : 'Update profile failed'
    })
    // } else {
    //     return res.status(400).json({
    //         success: false,
    //         result: 'Can not find user'
    //     })
    // }
})
const banUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error(`Missing inputs`)

    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Update failed'
    })
})

const searchUser = asyncHandler(async (req, res) => {
    const { email } = req.query
    const users = await User.find({ $or: [{ email: { $regex: email } }, { username: { $regex: email } }] }).limit(5)
    return res.status(200).json({
        success: users ? true : false,
        result: users
    })
})

const reportAccount = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { userId } = req.params
    const user = await User.findById(userId)
    if (!user) return res.status(400).json({
        success: false,
        result: 'User not found'
    })

    const alreadyReported = user?.reports?.find(report => report.toString() === _id)
    if (alreadyReported) return res.status(400).json({
        success: false,
        result: 'You are already reported this user'
    })
    const addReport = await User.findByIdAndUpdate(userId, { $push: { reports: _id } }, { new: true })
    return res.status(200).json({
        success: addReport ? true : false,
        result: addReport ? addReport : 'Can not report this user'
    })
})

const changePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { oldPassword, newPassword } = req.body
    if (oldPassword === newPassword) return res.status(400).json({
        success: false,
        result: 'New password must be different from your current password'
    })
    const user = await User.findById(_id)
    if (!user) return res.status(404).json({ success: false, result: 'Can not find user' })
    const checkPassword = await user.isCorrectPassword(oldPassword)
    if (!checkPassword) return res.status(404).json({ success: false, result: 'Wrong password' })
    user.password = newPassword
    await user.save()
    return res.status(200).json({ success: true, result: 'Change password successfully' })
})

const reportProblem = asyncHandler(async (req, res) => {
    const { content } = req.body
    const { _id } = req.user

    if (!content) return res.status(404).json({ success: false, result: 'Detail is not empty' })
    if (req.file) {
        image = req.file.path
        imagename = req.file.filename
        const newReport = await Report.create({ content, image, imagename, useSend: _id })

        return res.status(200).json({
            success: newReport ? true : false,
            result: newReport ? newReport : 'Can not report problem'
        })
    } else {
        const newReport = await Report.create({ content, useSend: _id })
        return res.status(200).json({
            success: newReport ? true : false,
            result: newReport ? newReport : 'Can not report problem'
        })
    }
})

// const getUserByEmail = asyncHandler(async(req, res)=>{
//     const {email} = req.params 
//     const user = await User.findOne({email: email})
//     return res.status(200).json({
//         success: user ? true : false,
//         result: user ? user : 'Can not find user'
//     })
// })


module.exports = {
    login,
    register,
    finalRegister,
    getCurrentUser,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getAllUsers,
    deleteUser,
    updateUser,
    banUserByAdmin,
    searchUser,
    reportAccount,
    changePassword,
    reportProblem,
};