import { Op } from 'sequelize';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Signature from '../models/Signature';

export default {
    async index(req, res) {
        const existDeli = await Deliveryman.findByPk(req.params.id);

        if (!existDeli) {
            return res.status(400).json({ error: 'Entregador não encontrado' });
        }

        const response = await Order.findAll({
            where: {
                deliveryman_id: req.params.id,
                end_date: { [Op.not]: null },
            },
            order: ['end_date'],
            attributes: ['product', 'start_date', 'end_date'],
            include: [
                {
                    model: Recipient,
                    as: 'recipient',
                    attributes: ['name', 'state'],
                },
                {
                    model: Signature,
                    as: 'signature',
                    attributes: ['url'],
                },
            ],
        });

        return res.json(response);
    },
};
