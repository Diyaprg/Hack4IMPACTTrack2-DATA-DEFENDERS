from telethon import TelegramClient, events
from core.config import settings, FRAUD_CHANNELS
from ingestion.pipeline import process
from loguru import logger
import asyncio

_client: TelegramClient = None


async def start_telegram_listener():
    global _client

    if not settings.TELEGRAM_API_ID or not settings.TELEGRAM_API_HASH:
        logger.warning("Telegram credentials not configured — scraper disabled")
        return

    try:
        _client = TelegramClient(
            settings.TELEGRAM_SESSION_NAME,
            int(settings.TELEGRAM_API_ID),
            settings.TELEGRAM_API_HASH,
        )

        await _client.start()
        logger.info("Telegram client connected")

        await _backfill_messages()

        @_client.on(events.NewMessage(chats=FRAUD_CHANNELS))
        async def handler(event):
            try:
                chat = await event.get_chat()
                channel_name = getattr(chat, "title", str(event.chat_id))
                await process(
                    raw_text=event.raw_text,
                    source="telegram",
                    channel_id=str(event.chat_id),
                    channel_name=channel_name,
                    media_type="text" if not event.media else "media",
                )
            except Exception as e:
                logger.error(f"Telegram handler error: {e}")

        logger.info(f"Listening to {len(FRAUD_CHANNELS)} Telegram channels")
        await _client.run_until_disconnected()

    except Exception as e:
        logger.error(f"Telegram scraper failed to start: {e}")


async def _backfill_messages(limit: int = 100):
    if not _client:
        return
    for channel_id in FRAUD_CHANNELS:
        try:
            async for message in _client.iter_messages(channel_id, limit=limit):
                if message.raw_text:
                    await process(
                        raw_text=message.raw_text,
                        source="telegram",
                        channel_id=str(channel_id),
                        media_type="text",
                    )
        except Exception as e:
            logger.warning(f"Backfill failed for channel {channel_id}: {e}")
    logger.info("Telegram backfill complete")


async def stop_telegram_listener():
    global _client
    if _client:
        await _client.disconnect()
        logger.info("Telegram client disconnected")
