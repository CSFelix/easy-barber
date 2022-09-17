import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'], // all columns that I wanna return
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path'],
        },
      ], // returnin all Files columns and renaming the File array to 'avatar
    });

    return res.json(providers);
  }
}

export default new ProviderController();
