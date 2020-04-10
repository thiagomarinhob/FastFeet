import * as Yup from 'yup';

import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

export default {
    async index(req, res) {
        const response = await Order.findAll();

        if (!response) {
            return res.status(400).json({ error: 'Lista Vazia' });
        }

        return res.json(response);
    },
    async store(req, res) {
        const schema = Yup.object().shape({
            recipient_id: Yup.number().required(),
            deliveryman_id: Yup.number().required(),
            product: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Falha na validação' });
        }

        const { recipient_id, deliveryman_id } = req.body;

        const checkRecipient = await Recipient.findByPk(recipient_id);

        if (!checkRecipient) {
            return res
                .status(400)
                .json({ error: 'Destinatário não encontrado' });
        }

        const checkDeliveryman = await Deliveryman.findByPk(deliveryman_id);

        if (!checkDeliveryman) {
            return res
                .status(400)
                .json({ error: 'Entregador não encontrado!' });
        }

        const { product } = await Order.create(req.body);

        return res.json({
            recipient_id,
            deliveryman_id,
            product,
        });
    },
    async update(req, res) {
        req.body.id = req.params.id;

        const schema = Yup.object().shape({
            id: Yup.number().required(),
            recipient_id: Yup.number(),
            deliveryman_id: Yup.number(),
            product: Yup.string(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Falha na validação' });
        }

        const existOrder = await Order.findByPk(req.params.id);

        if (!existOrder) {
            return res.status(400).json({ error: 'Encomenda não encontrada!' });
        }

        const response = await existOrder.update(req.body);

        return res.json(response);
    },
    async delete(req, res) {
        const schema = Yup.object().shape({
            id: Yup.number().required(),
        });

        if (!(await schema.isValid(req.params))) {
            return res.status(400).json({ error: 'Falha na Validação' });
        }

        const existOrder = await Order.findByPk(req.params.id);

        if (!existOrder) {
            return res.status(400).json({ error: 'Encomenda nã encontrada!' });
        }

        await existOrder.destroy(req.params.id);

        return res.status(204).send();
    },
};
