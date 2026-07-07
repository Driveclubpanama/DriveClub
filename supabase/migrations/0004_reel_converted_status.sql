-- Permite convertir un Reel en un artículo de Revista sin que
-- siga apareciendo en Noticias Rápidas ni en el panel de pendientes.
alter type reel_status add value if not exists 'converted';
