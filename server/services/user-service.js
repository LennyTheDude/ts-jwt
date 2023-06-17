// const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const User = require('../models').User;

class UserService {
    async signup(email, password) {
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            throw ApiError.BadRequest('User with this email address already exists.')
        }
        const hashPwd = await bcrypt.hash(password, 3)
        const activationLink = uuid.v4()
        
        const user = await User.create({email, password: hashPwd, activationLink})
        mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
        
        const userDto = new UserDto(user)

        const tokens = tokenService.generateTokens({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        
        return {
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink) {
        const user = await User.findOne({ where: { activationLink } })
        if (!user) {
            throw ApiError.BadRequest('Incorrect activation link')
        }

        user.isActivated = true
        await user.save()
    }

    async login(email, password) {
        const existingUser = await User.findOne({where: {email}});
        console.log('????????????????????????????????????????', existingUser);

        if (!existingUser) {
            throw ApiError.BadRequest('User not found')
        }
        
        const correctPwd = await bcrypt.compare(password, existingUser.password)
        
        if (!correctPwd) {
            throw ApiError.BadRequest('Incorrect password')
        }

        const userDto = new UserDto(existingUser)

        const tokens = tokenService.generateTokens({...userDto})

        await tokenService.saveToken(existingUser.id, tokens.refreshToken)
        
        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const existingToken = await tokenService.findToken(refreshToken)

        if (!userData || !existingToken) {
            throw ApiError.UnauthorizedError();
        }

        const user = await User.findByPk(userData.id);
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!: ', user);
        const userDto = new UserDto(user)


        const tokens = tokenService.generateTokens({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        
        return {
            ...tokens,
            user: userDto
        }
    }

    async getAllUsers() {
        const users = await User.findAll();
        return users;
    }

}

module.exports = new UserService();
