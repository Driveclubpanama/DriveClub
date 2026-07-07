-- Permite rechazar un Reel desde el admin sin borrarlo (si se borrara,
-- el cron lo volvería a traer de Instagram en la siguiente corrida).
alter type reel_status add value if not exists 'rejected';
