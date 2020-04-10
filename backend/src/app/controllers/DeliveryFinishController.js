import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliveryFinish {
    async store(req, res) {
        const { signature_id } = req.body;

        const existDeli = await Deliveryman.findByPk(req.params.id);

        if (!existDeli) {
            return res.status(400).json({ error: 'Entregador não encontrado' });
        }

        const existDelivery = await Delivery.findOne({
            where: {
                id: req.params.deliveryId,
                end_date: null,
            },
        });

        if (!existDelivery) {
            return res.status(400).json({ error: 'Encomenda não encontrada!' });
        }

        const existSign = await File.findByPk(signature_id);

        if (!existSign) {
            return res.status(400).json({ error: 'Assinatura não enontrada!' });
        }

        await existDelivery.update(req.body);

        return res.json(existDelivery);
    }
}
export default new DeliveryFinish();
