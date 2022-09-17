/*
  This file is used to create the functions that will manage
the queues in Redis
*/
import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    // name of each job type
    return 'CancellationMail';
  }

  async handle({ data }) {
    // processing the queues and the jos
    const { appointment } = data;

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Calling Off Appointment',
      template: 'cancellation',

      // variables used into the template
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "MMMM dd'th, at' H:mm'h'"
        ),
      },
    });
  }
}

export default new CancellationMail();
