import {Lore} from '../../../lib/data/lore';
import {BadRequestError, NotFoundError} from '../../../lib/errors';

export async function get(req, res) {
  var result = await Lore.get(req.params.id.toLowerCase());
  if (result) {
    res.status(200).send(result.text);
  }
  else {
    throw new NotFoundError()
  }
};
