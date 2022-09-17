/*
  Controllers are all roles that the 'models/tables' take
in the application.

  By rule, Controller MUST HAVE 5 FUNCTIONS AT MAXIMUUM:

    \ index  : returns a single register of a table in the database
    \ list   : lists all registers of a table in the database (we can use pagination)
    \ create : creates a register in the database
    \ update : updates a register in the database
    \ delete : deletes a register in the database

  PS.: Controllers are like DAO Classes' Functions in Java
*/
import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';

import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';

import Notification from '../schemas/Notification';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const appointments_per_page = 15;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, cancelled_at: null },
      order: ['date'],
      limit: appointments_per_page,
      offset: appointments_per_page * (page - 1),
      attributes: ['id', 'date', 'past', 'cancellable'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],

          // getting provider's avatar
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    /*
     **************
     * Validation *
     **************
     */
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Failed!' });
    }

    /*
     ***********
     * Process *
     ***********
     */
    const { provider_id, date } = req.body;

    // checking if provider_id is really a provider
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only schedule appointments with providers!' });
    }

    // checking if the user is not trying to
    // schedule an appointment to itself
    if (provider_id === req.userId) {
      return res
        .status(401)
        .json({ error: 'You can not create an appointment to yourself!' });
    }

    // checking if the date is not from the past
    // transforming the string date into date object (considering just the hour)
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted!' });
    }

    // checking if the date time is not scheduled already
    // it's considering a whole hour, like 16:00 - 17:00
    const checkDateAvailability = await Appointment.findOne({
      where: {
        provider_id,
        cancelled_at: null,
        date: hourStart,
      },
    });

    if (checkDateAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment Date is not Available!' });
    }

    // storing appointment into the database
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    /*
     ****************
     * Notification *
     * **************
     */

    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "MMMM dd'th, at' H:mm'h'"
      // MMMM >> month by extense
      // dd >> day with two digits
      // H >> hour
      // mm >> minutes with two digits
      // '' >> don't format what's within it
    );

    await Notification.create({
      content: `New appointment of ${user.name} to ${formattedDate}`,
      user: provider_id,
      // read: false,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    /*
     * *************
     * Validations *
     * *************
     */
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          atttributes: ['name'],
        },
      ],
    });

    // checking out if the user is not trying to call off
    // an appointment that is not theirs
    if (req.userId !== appointment.user_id) {
      return res.status(401).json({
        error: 'You do not have permission to call off this appointment!',
      });
    }

    // cheecking if the calling off is at least two
    // hours before the appointment
    //
    // new Date() >> Now
    const dateWithSub = subHours(appointment.date, 2); // removing two hours from the appointment

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only call off appointments 2 hours in advance!', // 'advance' means 'adiantado'!!
      });
    }

    /*
     ***********
     * Process *
     ***********
     */
    appointment.cancelled_at = new Date();

    await appointment.save();

    // sending email
    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
