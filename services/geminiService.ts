

import { GoogleGenAI, Type } from "@google/genai";
import { AspectRatio, AjustadoraOutput, Essencia, ContentSuggestion } from "../types";
import { contentSuggestions } from "../constants";

// IMPORTANT: This API key is managed externally and should not be modified.
// It is assumed to be available in the execution environment.
const API_KEY = process.env.API_KEY;

/**
 * Suggests a creative prompt for image generation using the Gemini API.
 * 
 * @param aspectRatio The desired aspect ratio for the image.
 * @param hasReferenceImage Whether the user has provided a reference image.
 * @returns A promise that resolves with the suggested prompt string.
 */
export const suggestImagePrompt = async (aspectRatio: AspectRatio, hasReferenceImage: boolean): Promise<string> => {
    if (!API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const generationPrompt = `
            Você é um assistente criativo especializado em gerar prompts para modelos de IA de imagem. Sua tarefa é criar um comando (prompt) detalhado e inspirador em português.

            O tema principal é 'estética de luxo', 'clínicas de beleza', 'empreendedorismo feminino' e 'bem-estar'.

            **Requisitos:**
            1.  **Formato de Saída:** O prompt deve ser uma única frase ou parágrafo descritivo.
            2.  **Linguagem:** Use um vocabulário rico e evocativo.
            3.  **Detalhes:** Inclua detalhes sobre iluminação, paleta de cores, composição e atmosfera.
            4.  **Formato da Imagem:** A proporção da imagem será **${aspectRatio}**.

            **Contexto Adicional:**
            ${hasReferenceImage 
                ? "O usuário forneceu uma imagem de referência. O prompt deve sugerir uma variação criativa ou aprimoramento dessa imagem, mantendo o tema central." 
                : "O usuário não forneceu uma imagem de referência. Crie um prompt original do zero."}

            Gere o prompt criativo agora.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: generationPrompt,
        });
        
        return response.text.trim();

    } catch (error) {
        console.error("Error suggesting image prompt with Gemini API:", error);
        return "Não foi possível gerar uma sugestão. Tente novamente.";
    }
};

/**
 * Simulates executing a chain of mentors to generate a full content package.
 * @param theme The central theme for the content.
 * @returns A promise that resolves with a structured content package.
 */
export const executePilotoAutomatico = async (theme: string): Promise<AjustadoraOutput> => {
    console.log(`Executing Piloto Automático for theme: ${theme}`);
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Mocked response based on the theme
    const mockResponse: AjustadoraOutput = {
      instagram: [
        {
          variant: "A",
          text: `**Legenda para Carrossel com o tema "${theme}"**\n\nSlide 1: [Imagem de impacto]\n${theme}: Mais do que um procedimento, uma transformação.\n\nSlide 2: [Benefício 1]\nVocê sabia? Nosso método exclusivo não apenas trata, mas revitaliza de dentro para fora.\n\nSlide 3: [Prova Social]\nVeja o que nossas clientes dizem! Arraste para o lado para se inspirar.\n\n#Estetica #${theme.replace(/\s+/g, '')} #Cuidado #BelezaComProposito`,
          cta: "Comente 'EU QUERO' para receber uma condição especial.",
          how: ["Use imagens de alta qualidade.", "Faça uma pergunta no final da legenda.", "Responda todos os comentários."],
        },
      ],
      reel: [
        {
          variant: "A",
          text: `**Roteiro de Reel (30s) sobre "${theme}"**\n\n*   **0-3s (Hook):** Close em um detalhe do procedimento com a frase: "O segredo para resultados incríveis não é o que você pensa."\n*   **4-15s (Desenvolvimento):** Cenas rápidas mostrando a preparação, o ambiente acolhedor e um sorriso da cliente.\n*   **16-25s (Revelação):** Mostrar um resultado sutil e elegante. Texto na tela: "É sobre método, cuidado e tecnologia."\n*   **26-30s (CTA):** "Pronta para sua transformação? Agende sua avaliação no link da bio."`,
          cta: "Agende no link da bio",
          how: ["Use uma música em alta.", "Legendas curtas e dinâmicas.", "Adicione um sticker de enquete no story de divulgação."],
        },
      ],
      whatsapp: [
          {
              variant: 'A',
              text: `**Mensagem para lista de transmissão sobre "${theme}"**\n\nOlá! ✨ Tenho uma novidade especial para você que busca o melhor em cuidados estéticos. Estamos com uma oportunidade única relacionada a *${theme}*. Gostaria de saber mais sem compromisso?`,
              cta: "Responder 'QUERO SABER MAIS'",
              how: ["Segmente sua lista para clientes interessadas.", "Envie em um horário comercial.", "Prepare um script para a resposta."]
          }
      ]
    };

    return mockResponse;
};

export const generateMonthlySuggestions = async (essencias: Essencia[], emptyDays: number[]): Promise<{ [day: number]: ContentSuggestion }> => {
  if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  if (emptyDays.length === 0) {
    return {};
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const essenciaContext = JSON.stringify(
        essencias.map(e => ({
            [e.title]: e.fields.map(f => ({ [f.title]: f.content }))
        }))
    , null, 2);

    const prompt = `
    Você é LucresIA, uma mentora expert em marketing digital para o nicho de estética. Sua tarefa é criar um planejamento de postagens otimizado, estratégico e equilibrado para preencher os dias vazios de um calendário.

    O planejamento deve seguir a seguinte distribuição de pilares de conteúdo:
    - 40% Autoridade (dicas, informações técnicas simplificadas, "você sabia?", bastidores de estudos, passo a passo de procedimentos).
    - 30% Vendas (ofertas diretas, "últimas vagas", combos promocionais, apresentação de um serviço/protocolo com foco nos benefícios e transformação).
    - 20% Prova Social (depoimentos de clientes, antes e depois, print de elogios, repost de stories de clientes).
    - 10% Lifestyle (posts que conectam com o estilo de vida da cliente, frases motivacionais, comemorações, um pouco da sua rotina como empreendedora).

    Baseado na "Essência da Marca" fornecida e na distribuição estratégica acima, gere ${emptyDays.length} ideias de posts para preencher os seguintes dias do mês: ${emptyDays.join(', ')}.

    Essência da Marca:
    \`\`\`json
    ${essenciaContext}
    \`\`\`

    Distribua as categorias de forma variada ao longo dos dias para manter o feed dinâmico.

    Responda APENAS com um objeto JSON onde as chaves são os números dos dias e os valores são os objetos de sugestão. Cada sugestão deve conter 'title' (título chamativo), 'category' (uma das quatro: 'Autoridade', 'Vendas', 'Prova Social', 'Lifestyle'), e 'prompt' (um comando detalhado para a LucresIA gerar o conteúdo completo).
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {},
                additionalProperties: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: 'Um título chamativo e curto para a ideia de post.' },
                        category: { type: Type.STRING, enum: ['Autoridade', 'Vendas', 'Prova Social', 'Lifestyle'], description: 'A categoria estratégica do post.' },
                        prompt: { type: Type.STRING, description: 'Um prompt detalhado para ser usado no "Piloto Automático" para gerar o conteúdo completo.'}
                    },
                    required: ['title', 'category', 'prompt']
                }
            }
        }
    });

    const suggestionsByDay = JSON.parse(response.text);
    
    // Add IDs to each suggestion
    const suggestionsWithIds: { [day: number]: ContentSuggestion } = {};
    for (const day in suggestionsByDay) {
        if (Object.prototype.hasOwnProperty.call(suggestionsByDay, day)) {
            suggestionsWithIds[parseInt(day, 10)] = {
                ...suggestionsByDay[day],
                id: `sugg_${Date.now()}_${day}`
            };
        }
    }
    return suggestionsWithIds;

  } catch (error) {
    console.error("Error generating monthly calendar suggestions with Gemini API:", error);
    // Fallback logic
    const fallbackSuggestions: { [day: number]: ContentSuggestion } = {};
    emptyDays.forEach(day => {
        const randomSuggestion = contentSuggestions[Math.floor(Math.random() * contentSuggestions.length)];
        fallbackSuggestions[day] = { ...randomSuggestion, id: `sugg_fallback_${day}` } as ContentSuggestion;
    });
    return fallbackSuggestions;
  }
};

/**
 * Generates an image using the Gemini API.
 * 
 * @param prompt The creative prompt for the image.
 * @param aspectRatio The desired aspect ratio.
 * @returns A promise that resolves with the base64 encoded image string.
 */
export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
    if (!API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return base64ImageBytes;
        } else {
            throw new Error("Nenhuma imagem foi gerada.");
        }

    } catch (error) {
        console.error("Error generating image with Gemini API:", error);
        throw new Error("Não foi possível gerar a imagem. Por favor, tente novamente.");
    }
};
