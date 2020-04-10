import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class DeliveryIdProblem {
    async index(req, res) {
        const response = await DeliveryProblem.findAll({
            where: {
                delivery_id: req.params.id,
            },
        });

        return res.json(response);
    }

    async store(req, res) {
        const { id } = req.params;

        const existDelivery = await Delivery.findByPk(id);

        if (!existDelivery) {
            return res.status(400).json({ error: 'Encomenda não encontrada' });
        }

        const response = await DeliveryProblem.create({
            delivery_id: id,
            description: req.body.description,
        });

        return res.json(response);
    }

    async delete(req, res) {
        const { id } = req.params;

        const exictProblem = await DeliveryProblem.findByPk(id);

        if (!exictProblem) {
            return res.status(400).json({ error: 'Problema não encontrado' });
        }

        const delivery = await Delivery.findByPk(req.body.delivery_id);

        if (!delivery) {
            return res.status(400).json({ error: 'Encomenda não encontrado' });
        }

        await delivery.destroy(id);

        return res.status(204).send();
    }
}

export default new DeliveryIdProblem();
