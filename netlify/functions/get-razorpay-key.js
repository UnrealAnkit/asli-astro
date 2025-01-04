exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ RAZORPAY_KEY: process.env.RAZORPAY_KEY }),
  };
};
