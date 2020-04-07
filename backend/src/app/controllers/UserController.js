import User from '../models/User';

export default {
    async store(req, res) {
        const userExist = await User.findOne({
            where: { email: req.body.email },
        });

        if (userExist) {
            return res.status(400).json({ error: 'Usuário já cadastrado' });
        }

        const [id, name, email] = await User.create(req.bod);

        req.user_id = id;

        return res.json({
            id,
            name,
            email,
        });
    },
    async index(req, res) {
        const users = await User.findAll();

        return res.json(users);
    },
};
