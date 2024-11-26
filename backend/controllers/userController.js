import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
// import razorpay from 'razorpay'

// api to register userr
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' });

        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'enter a valid email' });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: 'enter a strong password' });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// api to login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })

        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// api to get users profile information
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')
        res.json({ success: true, userData })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// api to update user profile information
const updateProfile = async (req, res) => {
    try {

        const { userId, name, phone, address, dob, gender, age, bloodGroup, medicalHistory, allergies, medications, familyHistory } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender || !age || !bloodGroup) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender, age, bloodGroup, medicalHistory, allergies, medications, familyHistory })

        if (imageFile) {
            // upload image to cloadinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: "Profile updated successfully" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// api to book appointment
const bookAppoinment = async (req, res) => {
    try {

        const { userId, docId, slotDate, slotTime, sessionType } = req.body

        const docData = await doctorModel.findById(docId).select('-password');

        if (!docData.available) {
            return res.json({ success: false, message: "Doctor is not available" });
        }

        let slots_booked = docData.slots_booked

        // Checking for slot availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "Slot not available" })
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')
        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            sessionType,
            slotDate,
            slotTime,
            date: Date.now(),
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // Save new slot data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: "Appointment booked successfully" })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// api to get user's appointments for my appointment page
const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// api to cancel the appointment
const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized Action' })
        }

        // remove appointment from user's appointment list
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctors slots

        const { docId, slotDate, slotTime } = appointmentData
        const doctorData = await doctorModel.findById(docId)
        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        res.json({ success: true, message: 'Appointment Cancelled' })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// const razorpayInstance = new razorpay({
//     key_id: 'evccwniuweiunw',
//     key_secret: 'iewdiwduiwejdewc'
// })

// api to make online payment using razorpay
// const paymentRazorpay = async (req, res) => {
//     try {

//         const { appointmentId } = req.body
//         const appointmentData = await appointmentModel.findById(appointmentId)

//         if (!appointmentData || appointmentData.cancelled) {
//             return res.json({ success: false, message: 'Invalid appointment' })
//         }

//         // Creating options for payment
//         const options = {
//             amount: appointmentData.amount * 100, // amount in the smallest currency unit
//             currency: process.env.CURRENCY,
//             receipt: appointmentId,
//         }

//         // Creating a payment
//         const order = await razorpayInstance.orders.create(options)

//         res.json({ success: true, order })

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message })
//     }

// }

// backend/controllers/userController.js

const appointmentPaid = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unable to Pay' })
        }

        // remove appointment from user's appointment list
        await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })

        res.json({ success: true, message: 'Payment Successful' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



export { registerUser, loginUser, getProfile, updateProfile, bookAppoinment, listAppointment, cancelAppointment, appointmentPaid }