const sendOtpEmail = async (email, otp) => {
  try {
    // طباعة OTP في Terminal فقط
    console.log(`\n${'='.repeat(50)}`);
    console.log(`📧 OTP for: ${email}`);
    //console.log(`🔐 Code: ${otp}`);
    //console.log(`⏰ Expires in: 10 minutes`);
    console.log(`${'='.repeat(50)}\n`);

    // محاولة الإرسال (لكن لو فشل ما يؤثر)
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      await sgMail.send({
        to: email,
        from: 'aboelhagagahmed3@gmail.com',
        subject: '🔐 كود التحقق - مكتبتي',
        html: `
          <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #11141c; padding: 40px 20px; text-align: center;">
            <div style="max-width: 500px; margin: 0 auto; background-color: #1c2030; border-radius: 12px; padding: 40px 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
              <h1 style="color: #635bff; margin-top: 0; font-size: 28px;">مكتبتي</h1>
              <h2 style="color: #ffffff; font-size: 20px; font-weight: normal; margin-bottom: 30px;">مرحباً بك في منصة مكتبتي</h2>
              <p style="color: #a0aabf; font-size: 16px; line-height: 1.5;">لقد طلبت كود التحقق لتسجيل الدخول إلى حسابك. يرجى استخدام الكود التالي:</p>
              
              <div style="background-color: #11141c; padding: 20px; border-radius: 8px; margin: 30px 0; border: 1px solid #635bff;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #ffffff;">${otp}</span>
              </div>
              
              <p style="color: #a0aabf; font-size: 14px;">هذا الكود صالح لمدة <b>10 دقائق</b> فقط. يرجى عدم مشاركته مع أي شخص.</p>
              
              <hr style="border: none; border-top: 1px solid #2a2f45; margin: 40px 0 20px 0;">
              <p style="color: #677189; font-size: 12px; margin: 0;">© 2026 مكتبتي - جميع الحقوق محفوظة.</p>
            </div>
          </div>
        `
      });
      console.log('✅ Email sent via SendGrid');
    } catch (emailError) {
      console.log('⚠️ SendGrid failed, but OTP logged above ☝️');
    }

  } catch (error) {
    console.error('Error:', error);
  }
};

const sendPasswordResetEmail = async (email, otp) => {
  try {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`📧 Password Reset for: ${email}`);
    // console.log(`🔑 Code: ${otp}`);
    // console.log(`⏰ Expires in: 10 minutes`);
    console.log(`${'='.repeat(50)}\n`);

    // محاولة الإرسال (لكن لو فشل ما يؤثر)
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      await sgMail.send({
        to: email,
        from: 'aboelhagagahmed3@gmail.com',
        subject: '🔑 إعادة تعيين كلمة المرور - مكتبتي',
        html: `
          <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #11141c; padding: 40px 20px; text-align: center;">
            <div style="max-width: 500px; margin: 0 auto; background-color: #1c2030; border-radius: 12px; padding: 40px 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
              <h1 style="color: #635bff; margin-top: 0; font-size: 28px;">مكتبتي</h1>
              <h2 style="color: #ffffff; font-size: 20px; font-weight: normal; margin-bottom: 30px;">إعادة تعيين كلمة المرور</h2>
              <p style="color: #a0aabf; font-size: 16px; line-height: 1.5;">لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك. استخدم الكود التالي للمتابعة:</p>
              
              <div style="background-color: #11141c; padding: 20px; border-radius: 8px; margin: 30px 0; border: 1px solid #635bff;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #ffffff;">${otp}</span>
              </div>
              
              <p style="color: #a0aabf; font-size: 14px;">هذا الكود صالح لمدة <b>10 دقائق</b> فقط. إذا لم تقم بهذا الطلب، يمكنك تجاهل هذه الرسالة.</p>
              
              <hr style="border: none; border-top: 1px solid #2a2f45; margin: 40px 0 20px 0;">
              <p style="color: #677189; font-size: 12px; margin: 0;">© 2026 مكتبتي - جميع الحقوق محفوظة.</p>
            </div>
          </div>
        `
      });
      console.log('✅ Email sent via SendGrid');
    } catch (emailError) {
      console.log('⚠️ SendGrid failed, but OTP logged above ☝️');
    }

  } catch (error) {
    console.error('Error:', error);
  }
};

module.exports = {
  sendOtpEmail,
  sendPasswordResetEmail
};