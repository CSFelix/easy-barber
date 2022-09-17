import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    // validation
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed!' });
    }

    // process
    const { email, password } = req.body;

    // checking if the email exists in the database
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'Email not found!' });
    }

    // if the email exists, we gotta check out if the password
    // is correct
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match!' });
    }

    // if the email exists and the password is correct
    // we gotta make the authentication
    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },

      // { payload, applications_text, configs }
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn, // token expires in 7 days
      }),
    });
  }
}

export default new SessionController();
