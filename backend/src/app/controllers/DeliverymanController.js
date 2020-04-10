import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';

export default {
    async index(req, res) {
        const response = await Deliveryman.findAll();

        if (response) {
            return res.json(response);
        }

        return res.status(400).json({ error: 'Lista vazia' });
    },

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            avatar_id: Yup.number(),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Falha na Validação' });
        }

        const deliExist = await Deliveryman.findOne({
            where: { email: req.body.email },
        });

        if (deliExist) {
            return res.status(400).json({ error: 'Entregador já cadastrado!' });
        }

        const response = await Deliveryman.create(req.body);

        return res.json(response);
    },

    async update(req, res) {
        req.body.id = req.params.id;
        const schema = Yup.object().shape({
            id: Yup.number(),
            name: Yup.string(),
            email: Yup.string().email(),
            avatar_id: Yup.number(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Falha na Validação' });
        }

        const deliExist = await Deliveryman.findByPk(req.params.id);

        if (!deliExist) {
            return res
                .status(400)
                .json({ error: 'Entregador não encontrando!' });
        }

        const response = await deliExist.update(req.body);

        return res.json(response);
    },

    async delete(req, res) {
        const schema = Yup.object().shape({
            id: Yup.number().required(),
        });

        if (!(await schema.isValid(req.params))) {
            return res.status(400).json({ error: 'Falha na Validação' });
        }

        const deliExist = await Deliveryman.findByPk(req.params.id);

        if (!deliExist) {
            return res
                .status(400)
                .json({ error: 'Entregador não encontrando!' });
        }

        await deliExist.destroy(req.params.id);

        return res.status(204).send();
    },
};
