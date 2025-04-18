import bcrypt from 'bcrypt';
import jwt from '../jwt.js';
import User from '../models/User.js';
import i18next from '../i18n.js';

const userService = {
    async  register(firstName, lastName, email, password, rePassword) {
        const existingUser = await User.findOne({ email }).select('email');
        if (existingUser) {
            throw new Error(i18next.t('emailAlreadyRegistered'));
        }
    
        if (password !== rePassword) {
            throw new Error(i18next.t('passwordMismatch'));
        }
    
        const newUser = await User.create({ firstName, lastName, email, password });
    
        return generateResponse(newUser);
    },
    async login(email, password) {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error(i18next.t('invalidEmailOrPassword'));
        }
    
        return generateResponse(user);
    },
    async updateUser(userId, updateData) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error(i18next.t('userNotFound'));
        }
    
        const updatedFields = {};
    
        if (updateData.firstName) {
            updatedFields.firstName = updateData.firstName;
        }
    
        if (updateData.lastName) {
            updatedFields.lastName = updateData.lastName;
        }
    
        if (typeof updateData.score === 'number') {
            updatedFields.score = user.score + updateData.score;
        }
    
        if (Array.isArray(updateData.answers)) {
            user.answers.push(...updateData.answers);
            updatedFields.answers = user.answers;
        }
    
        const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });
    
        return updatedUser;
    }
};

async function generateResponse(user) {
    const { _id, firstName, lastName, email, score, role } = user;
    const token = await jwt.sign({ _id, firstName, lastName, email, score, role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return { _id, firstName, lastName, email, score, accessToken: token, role };
}

export default userService;
