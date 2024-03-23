const resend = require("resend");

exports.sendEmail = async function (
  email,
  subject,
  message,
  res,
  resetURL,
  isOrderConfirmation = false,
  orderData = null
) {
  const resendAPI = new resend.Resend("re_eUe2pxZX_EQ1bz1EKWkNgsHAjdRxLxzLp");
  try {
    const { data, error } = await resendAPI.emails.send({
      from: "PAY A WRITER <onboarding@resend.dev>",
      to: ["mainahmwangi12@gmail.com"],
      subject,
      html: `<p>${message}</p>`,
      attachments: [],
    });

    if (error) {
      throw new Error(error.message);
    }

    if (isOrderConfirmation == false) {
      res.status(200).json({
        status: "success",
        message: `A confirmation reset email has been sent to - ${email}`,
        resetURL,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: `An Order confirmation  email has been sent to - ${email}`,
        data: orderData,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: `Something went wrong when sending an email ${error}`,
    });
  }
};
