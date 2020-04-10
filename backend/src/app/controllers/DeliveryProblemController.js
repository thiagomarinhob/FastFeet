import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class DeliverProblemController {
    async index(req, res) {
        const response = await DeliveryProblem.findAll();

        const deliveries = await response.map(async (deliveryP) => {
            const delivery = await Delivery.findByPk(deliveryP.delivery_id);

            return delivery;
        });

        return res.json(deliveries);
    }
}

export default new DeliverProblemController();
