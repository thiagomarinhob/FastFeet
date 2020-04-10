import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveryCompletedController {
    async index(req, res) {
        const existDeli = await Deliveryman.findByPk(req.params.id);

        if (!existDeli) {
            return res.status(400).json({ error: 'Entregador não encontrado' });
        }

        const response = await Delivery.findAll({
            where: {
                deliveryman_id: req.params.id,
                [Op.not]: [{ end_date: null }],
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
                    model: File,
                    as: 'signature',
                    attributes: ['url'],
                },
            ],
        });

        return res.json(response);
    }
}

export default new DeliveryCompletedController();
