import { startOfHour, parseISO, isBefore, isAfter } from 'date-fns';
import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class DeliveryStartController {
    async store(req, res) {
        const schema = Yup.object().shape({
            start_date: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Falha na validação' });
        }

        const { start_date } = req.body;

        const delimanId = req.params.id;
        const { deliveryId } = req.params;

        const existDeli = await Deliveryman.findByPk(delimanId);

        if (!existDeli) {
            return res.status(400).json({ error: 'Entregador não encontrado' });
        }

        const hourStart = startOfHour(parseISO(start_date));

        if (
            isBefore(hourStart, startOfHour(new Date().setHours('08'))) &&
            isAfter(hourStart, startOfHour(new Date().setHours('18')))
        ) {
            return res
                .status(401)
                .json({ error: 'Horário de Retirada não permitido!' });
        }

        const existDelivery = await Delivery.findOne({
            where: {
                id: deliveryId,
                start_date: null,
            },
        });

        if (!existDelivery) {
            return res.status(401).json({ error: 'Encomenda não encontrada!' });
        }

        await existDelivery.update(req.body);

        return res.json(existDelivery);
    }
}

export default new DeliveryStartController();
