import { GoogleGenAI, Type } from "@google/genai";
import { AspectRatio, AjustadoraOutput, Essencia, ContentSuggestion } from "../types";
import { contentSuggestions } from "../constants";

// ATENÇÃO: A chave da API foi inserida diretamente no código para facilitar a implantação.
// Em um aplicativo real, esta é uma PRÁTICA INSEGURA. O ideal é configurar a chave
// como uma "Environment Variable" no painel da Vercel para garantir a segurança.
const API_KEY = "AIzaSyBp072L5oJlcbCUZXRK-QPuuLFSPVyZFXM";


/**
 * Suggests a creative prompt for image generation using the Gemini API.
 * 
 * @param aspectRatio The desired aspect ratio for the image.
 * @param hasReferenceImage Whether the user has provided a reference image.
 * @returns A promise that resolves with the suggested prompt string.
 */
export const suggestImagePrompt = async (aspectRatio: AspectRatio, hasReferenceImage: boolean): Promise<string> => {
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
    Você é LucresIA, uma mentora expert em marketing digital para o nicho de estética, alinhada ao método Elevare Flow Prime. Sua tarefa é criar um planejamento de postagens estratégico e equilibrado para preencher os dias vazios de um calendário.

    **Diretrizes Estratégicas:**
    1.  **Distribuição de Pilares:** Siga a proporção: 40% Autoridade, 30% Vendas, 20% Prova Social, 10% Lifestyle.
    2.  **Inteligência de Séries:** Identifique oportunidades para criar séries de conteúdo. Se sugerir um post "Parte 1", planeje as continuações para dias futuros na mesma requisição.
    3.  **Consciência Sazonal:** Inclua temas relevantes para a estética de acordo com o mês atual (ex: cuidados pós-verão, preparação para o inverno).
    4.  **Briefing Completo:** Para cada dia, forneça um briefing completo, não apenas uma ideia.

    **Contexto:**
    - Dias a preencher: ${emptyDays.join(', ')}
    - Essência da Marca da usuária:
    \`\`\`json
    ${essenciaContext}
    \`\`\`

    **Instrução de Saída:**
    Responda APENAS com um objeto JSON onde as chaves são os números dos dias e os valores são objetos de sugestão. Cada sugestão DEVE conter TODOS os seguintes campos:
    - \`topic\`: O assunto central do post (ex: "Benefícios da drenagem linfática").
    - \`title\`: Um título/gancho chamativo para o post.
    - \`cta\`: Uma chamada para ação (CTA) clara e alinhada ao objetivo.
    - \`format\`: O formato recomendado ('Carrossel', 'Vídeo', 'Reels', 'Antes/Depois', 'Educativo', 'Story').
    - \`funnelStage\`: A etapa do funil de cliente ('Descoberta', 'Consideração', 'Decisão').
    - \`salesTrigger\`: O principal gatilho de venda a ser usado ('Prova Social', 'Urgência', 'Autoridade', 'Técnica', 'Valor').
    - \`category\`: A categoria do pilar de conteúdo ('Autoridade', 'Vendas', 'Prova Social', 'Lifestyle').
    - \`prompt\`: Um prompt detalhado para a LucresIA gerar o conteúdo completo posteriormente.
    - \`isSeries\`: (Opcional) Um objeto \`{ name: "Nome da Série", day: 1 }\` se o post fizer parte de uma série.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });

    const suggestionsByDay = JSON.parse(response.text);
    
    const suggestionsWithIds: { [day: number]: ContentSuggestion } = {};
    for (const day in suggestionsByDay) {
        if (Object.prototype.hasOwnProperty.call(suggestionsByDay, day)) {
            suggestionsWithIds[parseInt(day, 10)] = {
                ...suggestionsByDay[day],
                id: `sugg_${Date.now()}_${day}`,
                day: parseInt(day, 10),
            };
        }
    }
    return suggestionsWithIds;

  } catch (error) {
    console.error("Error generating monthly calendar suggestions with Gemini API:", error);
    const fallbackSuggestions: { [day: number]: ContentSuggestion } = {};
    emptyDays.forEach(day => {
        const randomSuggestion = contentSuggestions[Math.floor(Math.random() * contentSuggestions.length)];
        fallbackSuggestions[day] = { 
            ...(randomSuggestion as any), 
            id: `sugg_fallback_${day}`,
            day: day,
            topic: randomSuggestion.title,
            cta: 'Saiba Mais',
            format: 'Carrossel',
            funnelStage: 'Consideração',
            salesTrigger: 'Autoridade',
         };
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