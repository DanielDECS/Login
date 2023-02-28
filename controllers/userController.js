const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { loginValidate, registerValidate } = require('./validate')

const userController = {
    register: async function (rec, res) {

        const { error } = registerValidate(req.body)
        if (error) {return res.status(400).send(error) }


        const selectedUser = await User.findOne({ email: rec.body.email})
        if (selectedUser) return res.status(400).send('Email alredy exists')

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password)
        })

        try {
            const savedUser = await user.save()
            res.send(savedUser)
        }catch (error) {
            res.status(400).send(error)
        }
    },
    login: async function (req, res) {

        const { error } = loginValidate(req.body)
        if (error) {return res.status(400).send(error) }

        const selectedUser = await User.findOne({ email: rec.body.email})
        if (!selectedUser) return res.status(400).send('Email or password incorrect')

        const passwordAndUserMatch = bcrypt.compareSync(req.body.password, selectedUser.password)
        if (!passwordAndUserMatch) res.status(400).send('Email or password incorrect')

        const token = jwt.sign({_id: selectedUser._id, admin: selectedUser.admin}, process.env.TOKEN_SECRET)
        
        res.header('autorization-token', token)
        res.send('User logged')


    }
}

module.exports = userController