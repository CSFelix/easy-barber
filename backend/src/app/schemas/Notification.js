/*
  File used to create a collection into MongoDB.

  For each new Cllection, we gotta create a neew 'schema' file.
*/
import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(

  // 'columns', doc fields
  {
    content: {
      type: String,
      required: true,
    },

    user: {
      type: Number,
      required: true,
    },

    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  // adding 'created_at' and 'updated_at' for each schema
  { timestamps: true }
);

export default mongoose.model('Notification', NotificationSchema);
