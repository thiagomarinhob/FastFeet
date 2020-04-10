import * as Yup from 'yup';
import Mail from '../../lib/Mail';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

class DeliveryController {
    async index(req, res) {
        const response = await Delivery.findAll();

        if (!response) {
            return res.status(400).json({ error: 'Lista Vazia' });
        }

        return res.json(response);
    }

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

        const { product } = await Delivery.create(req.body);

        await Mail.sendMail({
            to: `${checkDeliveryman.name} <${checkDeliveryman.email}>`,
            subject: `Nova Encomenda Cadastrada!`,
            text: 'Você tem uma nova encomenda',
        });

        return res.json({
            recipient_id,
            deliveryman_id,
            product,
        });
    }

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

        const existDelivery = await Delivery.findByPk(req.params.id);

        if (!existDelivery) {
            return res.status(400).json({ error: 'Encomenda não encontrada!' });
        }

        const response = await existDelivery.update(req.body);

        return res.json(response);
    }

    async delete(req, res) {
        const schema = Yup.object().shape({
            id: Yup.number().required(),
        });

        if (!(await schema.isValid(req.params))) {
            return res.status(400).json({ error: 'Falha na Validação' });
        }

        const existDelivery = await Delivery.findByPk(req.params.id);

        if (!existDelivery) {
            return res.status(400).json({ error: 'Encomenda nã encontrada!' });
        }

        await existDelivery.destroy(req.params.id);

        return res.status(204).send();
    }
}

export default new DeliveryController();
