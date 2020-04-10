import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

export default {
    async index(req, res) {
        // const { page = 1 } = req.query;
        const existDeli = await Deliveryman.findByPk(req.params.id);

        if (!existDeli) {
            return res.status(400).json({ error: 'Entregador não encontrado' });
        }

        const response = await Order.findAll({
            where: {
                deliveryman_id: req.params.id,
                end_date: null,
                canceled_at: null,
            },
            order: ['start_date'],
            // limit: 10,
            // offset: (page - 1) * 10,
            attributes: ['product', 'start_date'],
            include: [
                {
                    model: Recipient,
                    as: 'recipient',
                    attributes: [
                        'name',
                        'street',
                        'number',
                        'complement',
                        'state',
                        'city',
                        'zip_code',
                    ],
                },
            ],
        });

        return res.json(response);
    },
};
