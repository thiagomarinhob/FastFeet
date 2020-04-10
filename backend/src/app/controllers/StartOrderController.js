import { startOfHour, parseISO, isBefore, isAfter } from 'date-fns';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

export default {
    async store(req, res) {
        const { start_date } = req.body;

        const existDeli = await Deliveryman.findByPk(req.params.id);

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

        const existOrder = await Order.findOne({
            where: {
                id: req.params.orderId,
                start_date: null,
            },
        });

        if (!existOrder) {
            return res.status(401).json({ error: 'Encomenda não encontrada!' });
        }

        await existOrder.update(req.body);

        return res.json(existOrder);
    },
};
