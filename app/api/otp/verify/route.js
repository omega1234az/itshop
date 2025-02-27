import twilio from 'twilio'


const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN=process.env.TWILIO_AUTH_TOKEN
const TWILIO_SERVICE_SID =process.env.TWILIO_SERVICE_SID
// Twilio Client
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
const VERIFY_SERVICE_SID = TWILIO_SERVICE_SID

export async function POST(request) {
    try {
        const body = await request.json()
        let { phone, otp } = body

        if (!phone.startsWith('+')) {
          if (phone.startsWith('0')) {
            phone = '+66' + phone.slice(1)
          } else {
            return new Response(JSON.stringify({ message: 'หมายเลขโทรศัพท์ไม่ถูกต้อง' }), { status: 400 })
          }
        }

        const verificationCheck = await twilioClient.verify.services(VERIFY_SERVICE_SID)
          .verificationChecks
          .create({ to: phone, code: otp })

        if (verificationCheck.status !== 'approved') {
          return new Response(JSON.stringify({ message: 'OTP ไม่ถูกต้อง' }), { status: 400 })
        }

        return new Response(JSON.stringify({ message: 'OTP ถูกต้อง', success: true }), { status: 200 })
      } catch (error) {
        console.error('Error in OTP verification:', error)
        return new Response(JSON.stringify({ message: 'เกิดข้อผิดพลาดในการยืนยัน OTP' }), { status: 500 })
      }
}