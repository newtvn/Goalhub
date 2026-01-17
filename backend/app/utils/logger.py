import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(levelname)s [%(asctime)s] - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logger = logging.getLogger("goalhub")


def log_payment_event(event: str, data: dict):
    """
    Structured logging for payment events.

    Args:
        event: Description of the payment event (e.g., "STK_PUSH_INITIATED", "CALLBACK_RECEIVED")
        data: Dictionary containing relevant payment data
    """
    logger.info(f"💳 {event}: {data}")
