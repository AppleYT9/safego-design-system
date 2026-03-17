from twilio.rest import Client
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class NotificationService:
    def __init__(self):
        self.client = None
        if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
            try:
                self.client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            except Exception as e:
                logger.error(f"Failed to initialize Twilio client: {e}")

    def send_sos_sms(self, to_number: str, user_name: str, location_url: str):
        """Sends an SOS SMS alert to a trusted contact."""
        if not self.client:
            logger.warning("Twilio client not initialized. SMS not sent.")
            return False

        try:
            message_body = f"EMERGENCY: {user_name} has triggered an SOS alert! View live location: {location_url}"
            message = self.client.messages.create(
                body=message_body,
                from_=settings.TWILIO_PHONE_NUMBER,
                to=to_number
            )
            logger.info(f"SOS SMS sent to {to_number}. SID: {message.sid}")
            return True
        except Exception as e:
            logger.error(f"Error sending SOS SMS to {to_number}: {e}")
            return False

    def trigger_sos_call(self, to_number: str, user_name: str):
        """Triggers an automated SOS phone call to a trusted contact."""
        if not self.client:
            logger.warning("Twilio client not initialized. Call not triggered.")
            return False

        try:
            # Twilio uses TwiML for call instructions
            twiml_content = f"<Response><Say voice='alice'>Emergency alert for {user_name}. An SOS signal has been triggered. Please check your messages for the location link.</Say></Response>"
            
            call = self.client.calls.create(
                twiml=twiml_content,
                from_=settings.TWILIO_PHONE_NUMBER,
                to=to_number
            )
            logger.info(f"SOS Call triggered to {to_number}. SID: {call.sid}")
            return True
        except Exception as e:
            logger.error(f"Error triggering SOS call to {to_number}: {e}")
            return False

notification_service = NotificationService()
