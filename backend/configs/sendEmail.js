import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, user, movie, date, time, seats }) => {
  const html = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
      <div style="background-color: #F84565; color: white; padding: 20px 30px;">
        <h2 style="margin: 0;">🎟️ QuickShow Booking Confirmed!</h2>
      </div>
      
      <div style="padding: 30px;">
        <p style="font-size: 16px;">Hi <strong>${user}</strong>,</p>
        <p style="font-size: 16px;">Your booking for <strong style="color: #F84565;">"${movie}"</strong> is <span style="color: green;">confirmed</span> ✅</p>

        <table style="width: 100%; margin-top: 25px; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; font-weight: 600;">🎬 Movie:</td>
            <td style="padding: 10px 0;">${movie}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 600;">📅 Date:</td>
            <td style="padding: 10px 0;">${date}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 600;">🕒 Time:</td>
            <td style="padding: 10px 0;">${time}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 600;">💺 Seats:</td>
            <td style="padding: 10px 0;">${seats}</td>
          </tr>
        </table>

        <div style="margin-top: 30px; padding: 20px; background-color: #fef0f2; border-left: 5px solid #F84565;">
          <p style="margin: 0; font-size: 15px;">Please arrive at the theater 15 minutes early and show this confirmation at the entrance.</p>
        </div>

        <p style="margin-top: 25px; font-size: 16px;">Enjoy your movie night! 🍿</p>

        <p style="margin-top: 40px; font-size: 14px; color: #777;">— The QuickShow Team</p>
      </div>

      <div style="background-color: #f9f9f9; text-align: center; padding: 15px; font-size: 12px; color: #999;">
        Need help? Email us at <a href="mailto:quickshow.booking@gmail.com" style="color: #F84565;">quickshow.booking@gmail.com</a>
      </div>
    </div>
  </div>`;

  const res = await resend.emails.send({
    from: 'QuickShow <booking@quickshow.com>',
    to,
    subject: `Your Ticket for "${movie}" is Confirmed!`,
    html
  });

  if (res.error) throw new Error(res.error.message);
  return res;
};
