import "server-only";
import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("Falta ANTHROPIC_API_KEY en las variables de entorno.");
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

export interface TranslatedArticle {
  titleEn: string;
  bodyEn: string;
}

/**
 * Traduce título y cuerpo de un artículo de español a inglés usando Claude.
 * Mantiene tono editorial de revista de autos y nombres propios sin tocar.
 */
export async function translateArticle(
  titleEs: string,
  bodyEs: string
): Promise<TranslatedArticle> {
  const anthropic = getClient();

  const message = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 2048,
    system:
      "Eres un traductor editorial profesional ES->EN para una revista de autos y estilo de vida automotriz llamada DriveClub Panama. " +
      "Traduce manteniendo el tono periodístico, la voz de marca y el entusiasmo por los autos. " +
      "No traduzcas nombres propios, marcas, modelos de autos ni hashtags. " +
      "Responde ÚNICAMENTE con un objeto JSON válido con esta forma exacta: " +
      '{"titleEn": "...", "bodyEn": "..."}',
    messages: [
      {
        role: "user",
        content: `Título (ES): ${titleEs}\n\nCuerpo (ES): ${bodyEs}`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude no devolvió contenido de texto.");
  }

  const parsed = JSON.parse(extractJson(textBlock.text)) as TranslatedArticle;

  if (!parsed.titleEn || !parsed.bodyEn) {
    throw new Error("La respuesta de traducción de Claude no tiene el formato esperado.");
  }

  return parsed;
}

/** Claude a veces envuelve el JSON en texto o code fences; esto extrae el objeto. */
function extractJson(text: string): string {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("No se encontró un objeto JSON en la respuesta de Claude.");
  }
  return match[0];
}
