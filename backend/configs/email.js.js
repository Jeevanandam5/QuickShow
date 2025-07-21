import emailjs from 'emailjs-com';

export const sendEmailJS = async ({ to_name, user_email, movie, date, time, seats }) => {
  return emailjs.send(
    process.env.EMAILJS_SERVICE_ID,
    process.env.EMAILJS_TEMPLATE_ID,
    {
      user: to_name,
      movie,
      date,
      time,
      seats,
      to_email: user_email
    },
    process.env.EMAILJS_PUBLIC_KEY
  );
};
