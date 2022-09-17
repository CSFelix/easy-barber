import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    // validations
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed!' });
    }

    // as far the Email Column is unique,
    // wee gotta check out if there is any
    // users with the email reigstered already
    const userExists = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    // return message if the email already exists
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    // validations
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),

      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed!' });
    }

    // process
    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    // if the user is changing its email
    // we gotta check out if the new email
    // doesn't exist already
    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      // return message if the email already exists
      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    // if the user is trying to change its password
    // we gotta check out if the old password is correct
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match!' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
