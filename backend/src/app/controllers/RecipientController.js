import * as Yup from 'yup';
import Recipient from '../models/Recipient';

export default {
    async index(req, res) {
        const response = await Recipient.findAll();

        if (response) {
            return res.json(response);
        }

        return res.status(400).json({ error: 'Lista Vazia' });
    },
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            street: Yup.string().required(),
            number: Yup.string().required(),
            complement: Yup.string(),
            state: Yup.string().required(),
            city: Yup.string().required(),
            zip_code: Yup.string().required().length(8),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status().json({ error: 'Falha na Validação' });
        }

        const recipient = await Recipient.findOne({
            where: {
                name: req.body.name,
                street: req.body.street,
                number: req.body.number,
                city: req.body.city,
            },
        });

        if (recipient) {
            return res
                .status(400)
                .json({ error: 'Destinatário já cadastrado' });
        }

        const response = await Recipient.create(req.body);

        return res.json(response);
    },

    async update(req, res) {
        req.body.id = req.params.id;

        const schema = Yup.object().shape({
            id: Yup.number().required(),
            name: Yup.string(),
            street: Yup.string(),
            number: Yup.string(),
            complement: Yup.string(),
            state: Yup.string(),
            city: Yup.string(),
            zip_code: Yup.string().length(8),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Falha na Validação' });
        }

        const recipient = await Recipient.findByPk(req.params.id);

        if (recipient) {
            const {
                name,
                street,
                number,
                complement,
                state,
                city,
                zip_code,
            } = await recipient.update(req.body);
            return res.json({
                name,
                street,
                number,
                complement,
                state,
                city,
                zip_code,
            });
        }

        return res.status(400).json({ error: 'Destinatário não encontrado' });
    },
};
