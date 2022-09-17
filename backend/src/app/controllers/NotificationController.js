import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    /*
     ***************
     * Validations *
     ***************
     */
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Only providers can load Notifications!' });
    }

    /*
     ***********
     * Process *
     ***********
     */
    const notificationsLimit = 20;

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(notificationsLimit);

    return res.json(notifications);
  }

  async update(req, res) {
    // const notification = await Notification.findById(req.params.id);

    const notification = await Notification.findByIdAndUpdate(
      req.params.id, // id filter
      { read: true }, // fileds to update
      { new: true } // returns the notification after the update
    );
    return res.json(notification);
  }
}

export default new NotificationController();
