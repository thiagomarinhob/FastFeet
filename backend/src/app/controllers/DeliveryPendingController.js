import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class DeliveryPendingController {
    async index(req, res) {
        const existDeli = await Deliveryman.findByPk(req.params.id);

        if (!existDeli) {
            return res.status(400).json({ error: 'Entregador não encontrado' });
        }

        const response = await Delivery.findAll({
            where: {
                deliveryman_id: req.params.id,
                end_date: null,
                canceled_at: null,
            },
            order: ['start_date'],
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
    }
}

export default new DeliveryPendingController();
