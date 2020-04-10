import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
    async index(req, res) {
        const response = await Recipient.findAll();

        if (!response) {
            return res.status(400).json({ error: 'Lista Vazia' });
        }
        return res.json(response);
    }

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

        const {
            name,
            number,
            complement,
            street,
            state,
            city,
            zip_code,
        } = req.body;

        const recipient = await Recipient.findOne({
            where: {
                name,
                street,
                number,
                city,
            },
        });

        if (recipient) {
            return res
                .status(400)
                .json({ error: 'Destinatário já cadastrado' });
        }

        const response = await Recipient.create({
            name,
            number,
            complement,
            street,
            state,
            city,
            zip_code,
        });

        return res.json(response);
    }

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

        if (!recipient) {
            return res
                .status(400)
                .json({ error: 'Destinatário não encontrado' });
        }

        const response = await recipient.update(req.body);

        return res.json(response);
    }
}

export default new RecipientController();
