import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Signature from '../models/Signature';

export default {
    async store(req, res) {
        const { signature_id } = req.body;

        const existDeli = await Deliveryman.findByPk(req.params.id);

        if (!existDeli) {
            return res.status(400).json({ error: 'Entregador não encontrado' });
        }

        const existOrder = await Order.findOne({
            where: {
                id: req.params.orderId,
                end_date: null,
            },
        });

        if (!existOrder) {
            return res.status(400).json({ error: 'Encomenda não encontrada!' });
        }

        const existSign = await Signature.findByPk(signature_id);

        if (!existSign) {
            return res.status(400).json({ error: 'Assinatura não enontrada!' });
        }

        await existOrder.update(req.body);

        return res.json(existOrder);
    },
};
