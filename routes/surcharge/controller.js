const { Surcharge, Stay } = require('../../db/models');

exports.getChargesForStay = req =>
  Surcharge.fetchAll({ stayId: req.params.stayId });

exports.saveChargesForStay = async req => {
  const { charges, totalCharge } = req.body;
  // eslint-disable-next-line
  for (const charge of charges) {
    // eslint-disable-next-line
    await Surcharge.create(charge);
  }
  await Stay.update({ totalCharge }, { where: { id: req.params.stayId } });
  return Surcharge.findAll({ where: { stayId: req.params.stayId } });
};
