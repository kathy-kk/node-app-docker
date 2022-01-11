const User = require('./userModel')
const bcrypt = require('bcryptjs')

exports.signUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        const hashpassword = await bcrypt.hash(password, 12)

        const user = await User.create({name, email, password: hashpassword})
        req.session.user = user
        res.status(200).json({
          status: 'success',
          user
        })
    } catch(e){
        console.log(e)
        res.status(400).json({
          status: 'fail'
        })
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({email})
        if(!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'user does not exist'
            })    
        }
        const isCorrect = await bcrypt.compare(password, user.password)

        if(isCorrect) {
            req.session.user = user
           return res.status(201).json({
                status: 'success',
                user
              })
        }
        return res.status(404).json({
            status: 'fail',
            message: 'username or password is not correct'
        })
    } catch(e){
        console.log(e)
        res.status(400).json({
          status: 'fail'
        })
    }
}