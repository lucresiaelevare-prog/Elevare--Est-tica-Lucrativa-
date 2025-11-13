
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { PautaOutput, ContentEvaluationOutput, ResultsAnalysisOutput, RealtimeSuggestion, CompetitorAnalysisOutput } from "../types";

const API_KEY = process.env.API_KEY;

export const LUCRESIA_SYSTEM_PROMPT = `
⚜️ SISTEMA CENTRAL: ELEVARE FLOW PRIME™ — IA MENTORATIVA ESTÉTICA

Você é a inteligência central do aplicativo ELEVARE FLOW PRIME™, criada por Carine Marques.
Sua função é unir **criação estética inteligente** e **mentoria em tempo real**, guiando a usuária a pensar, sentir e vender com propósito.

---

🎯 OBJETIVO GERAL:
Gerar conteúdo estético persuasivo (seguindo o método 3F: Fluir–Fixar–Fechar) e, em seguida, fornecer análise mentorativa com notas e explicações curtas que ensinem o raciocínio por trás da sugestão.

---

🧠 ETAPA 1 — CRIAÇÃO (MODO FLOW PRIME)

1️⃣ Receba o comando do usuário (exemplo: “crie um post sobre criomodelagem para mulheres que têm vergonha do corpo”).  
2️⃣ Gere o conteúdo completo aplicando o framework:

- **Fluir (Sensação):** abertura emocional + microdor + verbo sensorial  
- **Fixar (Significado):** conexão, empatia, história curta  
- **Fechar (Solução):** clareza, prova, CTA leve  

👉 **Formato base de saída (se não especificado):**
- Título (gancho)
- Corpo do texto (3 blocos curtos)
- CTA final
- Hashtags (opcional)
- [Inclua “Mentoria Rápida 🧠” ao final com um insight breve sobre a estratégia usada]

Exemplo:
Fluir → “Você evita o espelho desde o verão passado?”
Fixar → “A culpa não é sua — ninguém te ensinou a cuidar do corpo sem culpa.”
Fechar → “Com o protocolo Flow Sculpt™, sua confiança volta a aparecer no reflexo.”

Mentoria Rápida 🧠: Essa sequência ativa empatia antes da venda — o cérebro compra quando se sente compreendido.

---

🎓 ETAPA 2 — ANÁLISE (MODO MENTOR)

Após gerar o texto, execute uma autoanálise e devolva o feedback mentorativo:

🎯 **Ajuste Sugerido:** aponte um ponto que pode melhorar (ex.: “início muito racional”, “CTA tímido”).  
💬 **Explicação Mentorativa:** ensine o motivo emocional ou estrutural (“o instinto reage à emoção antes da lógica”).  
🧠 **Mentoria Rápida:** resumo em 1 linha do aprendizado.  
📊 **Notas:**
- Clareza (0–100)
- Conexão (0–100)
- Conversão (0–100)

---

📈 ETAPA 3 — EVOLUÇÃO E XP

Atribua uma classificação simbólica conforme as notas médias:

| Nível | Faixa de XP | Significado Mentorativo |
|--------|--------------|-------------------------|
| 🌱 Iniciante do Flow | 0–60 | Está aprendendo clareza; precisa de mais contraste emocional. |
| 🌿 Criadora Consciente | 61–80 | Já transmite empatia; deve aprimorar ritmo e CTA. |
| 🌺 Estrategista Sensorial | 81–95 | Entende emoção e estrutura; precisa refinar consistência. |
| 👑 Mentora Fluente | 96–100 | Clareza estética e narrativa elevadas — pronta para escalar. |

Inclua a linha final:
> “Seu nível atual é {{nível}} — continue aplicando o método e observe o Flow da sua comunicação.”

---

💎 ESTILO DE LINGUAGEM:

- Voz: autoridade compassiva, feminina e segura.  
- Frases curtas, pausadas e visuais.  
- Nunca soe como “robô explicativo”.  
- Misture ciência e leveza: emoção + lógica estética.  
- Evite adjetivos vazios; prefira analogias visuais.  
- O tom deve parecer **uma mentora humana elegante, não uma IA.**

---

🪞 PALAVRAS-CHAVE DO FLOW PRIME:
clareza • empatia • espelho • transformação • confiança • naturalidade • leveza • propósito • estética consciente

---

🧩 PADRÃO DE SAÍDA FINAL (para integração no app):
`;


export const startLucresiaChat = (): Chat => {
    if (!API_KEY) {
      throw new Error("API_KEY environment variable not set.");
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: LUCRESIA_SYSTEM_PROMPT,
        },
    });
    return chat;
};

export const sendLucresiaMessage = async (message: string, currentChat: Chat): Promise<string> => {
    try {
        const response = await currentChat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending message to Gemini API:", error);
        return "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.";
    }
};

export const generatePautaContent = async (theme: string, toneOfVoice: string): Promise<PautaOutput> => {
    if (!API_KEY) {
      throw new Error("API_KEY environment variable not set.");
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const prompt = `
        Você é a IA do método Elevare Flow Prime™. Sua tarefa é gerar um pacote de conteúdo completo com base em um tema e um tom de voz. Aplique o framework 3F (Fluir, Fixar, Fechar) e os princípios do seu sistema em todas as criações.

        Tom de Voz a ser utilizado: ${toneOfVoice}
        Lembre-se das características deste tom de voz:
        - Vendas Premium: Aspiracional, exclusivo, confiante, focado em valor, elegante.
        - Acolhedora Clínica: Empático, seguro, focado na jornada, pessoal, cuidadoso.
        - Científica Didática: Claro, objetivo, com autoridade, educacional, transparente.

        Tema do Conteúdo: "${theme}"

        Gere os seguintes materiais, seguindo estritamente as diretrizes do tom de voz e do sistema Elevare Flow Prime™. Inclua uma "Mentoria Rápida 🧠" para a legenda do Instagram.

        Responda APENAS com um objeto JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        carrossel: {
                            type: Type.ARRAY,
                            description: "Um array de 8 strings. Cada string é o título curto para um slide de carrossel do Instagram seguindo a estrutura AISV.",
                            items: { type: Type.STRING }
                        },
                        legenda: {
                            type: Type.STRING,
                            description: "Uma string contendo uma legenda curta e impactante para o post do Instagram (máximo 2.000 caracteres)."
                        },
                        reels: {
                            type: Type.STRING,
                            description: "Uma string contendo um roteiro detalhado para um Reel de até 45 segundos, com indicações de cenas e tempos."
                        },
                        googleMeuNegocio: {
                            type: Type.STRING,
                            description: "Uma string contendo um post otimizado para o Google Meu Negócio."
                        },
                        whatsapp: {
                            type: Type.STRING,
                            description: "Uma string contendo uma mensagem curta e natural para ser enviada via WhatsApp."
                        },
                        email: {
                            type: Type.OBJECT,
                            description: "Um objeto com duas chaves: assunto e corpo.",
                            properties: {
                                assunto: { type: Type.STRING, description: "Uma string para a linha de assunto." },
                                corpo: { type: Type.STRING, description: "Uma string para o corpo do e-mail." }
                            },
                            required: ['assunto', 'corpo']
                        },
                        mentoriaRapida: {
                            type: Type.STRING,
                            description: "Uma explicação curta e estratégica ('Mentoria Rápida 🧠') sobre a legenda gerada."
                        }
                    },
                     required: ['carrossel', 'legenda', 'reels', 'googleMeuNegocio', 'whatsapp', 'email', 'mentoriaRapida']
                }
            }
        });
        
        return JSON.parse(response.text) as PautaOutput;

    } catch (error) {
        console.error("Error generating pauta content:", error);
        throw new Error("Não foi possível gerar o conteúdo. Verifique o tema e tente novamente.");
    }
};

export const evaluateAndOptimizeContent = async (content: string): Promise<ContentEvaluationOutput> => {
    if (!API_KEY) {
      throw new Error("API_KEY environment variable not set.");
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const prompt = `
        Você é a IA do método Elevare Flow Prime™. Sua tarefa é avaliar um conteúdo de marketing e otimizá-lo.

        **Conteúdo para Análise:**
        "${content}"

        **Instruções de Saída:**
        Siga as regras do "FEEDBACK AUTOMÁTICO" e "MODO MENTOR" do seu sistema.
        1.  **Avalie o texto** com base nos 3 critérios: Clareza, Conexão e Conversão.
        2.  **Atribua uma nota** de 0 a 100 para cada critério.
        3.  **Forneça um feedback** curto e direto sobre como melhorar cada critério.
        4.  **Reescreva uma versão otimizada** do texto, aplicando o framework 3F (Fluir, Fixar, Fechar).
        5.  **Adicione uma "Mentoria Rápida 🧠"** explicando uma escolha estratégica na versão otimizada.
        
        Responda APENAS com um objeto JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        notas: {
                            type: Type.OBJECT,
                            description: "Notas de 0 a 100 para cada critério.",
                            properties: {
                                clareza: { type: Type.INTEGER },
                                conexao: { type: Type.INTEGER },
                                conversao: { type: Type.INTEGER }
                            },
                            required: ['clareza', 'conexao', 'conversao']
                        },
                        feedback: {
                            type: Type.OBJECT,
                            description: "Feedback sobre como melhorar cada critério.",
                            properties: {
                                clareza: { type: Type.STRING },
                                conexao: { type: Type.STRING },
                                conversao: { type: Type.STRING }
                            },
                             required: ['clareza', 'conexao', 'conversao']
                        },
                        versaoOtimizada: {
                            type: Type.STRING,
                            description: "A versão otimizada e reescrita do conteúdo."
                        },
                        mentoriaRapida: {
                            type: Type.STRING,
                            description: "Uma explicação curta e estratégica sobre a otimização."
                        }
                    },
                     required: ['notas', 'feedback', 'versaoOtimizada', 'mentoriaRapida']
                }
            }
        });
        
        return JSON.parse(response.text) as ContentEvaluationOutput;

    } catch (error) {
        console.error("Error evaluating content:", error);
        throw new Error("Não foi possível analisar o conteúdo. Verifique o texto e tente novamente.");
    }
};

export const analyzeResults = async (results: string): Promise<ResultsAnalysisOutput> => {
    if (!API_KEY) {
      throw new Error("API_KEY environment variable not set.");
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const prompt = `
        Você é LucresIA, uma mentora expert em análise de dados de marketing para o nicho de estética. Sua tarefa é analisar métricas de engajamento, extrair insights práticos e fornecer recomendações estratégicas.

        Analise os resultados abaixo e extraia exatamente 5 insights acionáveis. Depois, escreva exatamente 3 recomendações claras e diretas para melhorar a próxima rodada de conteúdo.

        Resultados:
        ---
        ${results}
        ---

        Responda APENAS com um objeto JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        insights: {
                            type: Type.ARRAY,
                            description: "Uma lista de exatamente 5 strings, cada uma contendo um insight acionável baseado nos dados.",
                            items: { type: Type.STRING }
                        },
                        recommendations: {
                            type: Type.ARRAY,
                            description: "Uma lista de exatamente 3 strings, cada uma contendo uma recomendação estratégica para o futuro.",
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["insights", "recommendations"]
                }
            }
        });

        return JSON.parse(response.text) as ResultsAnalysisOutput;

    } catch (error) {
        console.error("Error analyzing results:", error);
        throw new Error("Não foi possível analisar os resultados. Verifique os dados e tente novamente.");
    }
};

export const getRealtimeSuggestion = async (text: string): Promise<RealtimeSuggestion | null> => {
    if (!API_KEY) {
      throw new Error("API_KEY environment variable not set.");
    }
    // Simple heuristic to avoid calling API for very short texts
    if (text.trim().split(' ').length < 10) {
        return null;
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const prompt = `
        Você é a IA do método Elevare Flow Prime™, atuando como uma co-piloto de escrita.
        Analise o seguinte texto em tempo real e, se encontrar uma oportunidade clara de melhoria, forneça uma sugestão.

        Texto para Análise:
        ---
        ${text}
        ---

        Se o texto estiver bom ou muito curto para uma análise significativa, retorne null.
        Caso contrário, retorne um objeto JSON com uma sugestão de melhoria e uma breve razão para a sugestão, focando nos princípios do Elevare Flow Prime (Clareza, Conexão, Conversão).

        Responda APENAS com um objeto JSON no formato { "suggestion": "texto sugerido...", "reason": "motivo da sugestão..." } ou a string "null".
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const responseText = response.text.trim();
        if (responseText === 'null' || !responseText.startsWith('{')) {
            return null;
        }
        return JSON.parse(responseText) as RealtimeSuggestion;

    } catch (error) {
        console.error("Error getting realtime suggestion:", error);
        return null; // Return null on error to not interrupt the user flow
    }
};

export const analyzeUserStyle = async (currentEssenciaFieldContent: string, allUserContent: string): Promise<string> => {
    if (!API_KEY) {
      throw new Error("API_KEY environment variable not set.");
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const prompt = `
        Você é a IA do método Elevare Flow Prime™. Sua tarefa é analisar todo o conteúdo já criado por uma usuária para refinar um campo da "Essência da Marca" dela.
        Você age como um co-piloto que aprende o estilo da usuária.

        Conteúdo Atual do Campo da Essência:
        ---
        ${currentEssenciaFieldContent}
        ---

        Histórico de Conteúdo da Usuária (posts e projetos):
        ---
        ${allUserContent.substring(0, 4000)}
        ---

        Com base no histórico de conteúdo, analise o estilo de escrita, os temas recorrentes e as palavras-chave mais usadas pela usuária.
        Então, reescreva o "Conteúdo Atual do Campo da Essência" para que ele reflita de forma mais autêntica e precisa o estilo da usuária que você observou.
        
        Retorne APENAS o texto refinado para o campo da Essência.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error analyzing user style:", error);
        throw new Error("Não foi possível analisar o estilo. Tente novamente.");
    }
};

// This function simulates on-device processing by calling the cloud API.
// In a real implementation with Pomelli, this would run locally for privacy.
export const analyzeConfidentialText = async (confidentialText: string): Promise<ResultsAnalysisOutput> => {
    if (!API_KEY) {
      throw new Error("API_KEY environment variable not set.");
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const prompt = `
        Você é LucresIA, uma mentora expert em análise de dados de marketing para o nicho de estética. Sua tarefa é analisar um texto confidencial (como conversas de WhatsApp) para extrair as principais dores, desejos e objeções dos clientes. A análise é privada.

        Analise o texto confidencial abaixo e extraia exatamente 5 insights acionáveis sobre os clientes. Depois, escreva exatamente 3 recomendações de conteúdo com base nesses insights.

        Texto Confidencial:
        ---
        ${confidentialText}
        ---

        Responda APENAS com um objeto JSON no formato { "insights": [...], "recommendations": [...] }.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        insights: {
                            type: Type.ARRAY,
                            description: "Uma lista de exatamente 5 strings, cada uma contendo um insight sobre as dores, desejos ou objeções dos clientes.",
                            items: { type: Type.STRING }
                        },
                        recommendations: {
                            type: Type.ARRAY,
                            description: "Uma lista de exatamente 3 strings, cada uma contendo uma recomendação de conteúdo baseada nos insights.",
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["insights", "recommendations"]
                }
            }
        });

        return JSON.parse(response.text) as ResultsAnalysisOutput;

    } catch (error) {
        console.error("Error analyzing confidential text:", error);
        throw new Error("Não foi possível analisar o texto. Verifique os dados e tente novamente.");
    }
};

export const analyzeCompetitors = async (profiles: string[]): Promise<CompetitorAnalysisOutput> => {
    if (!API_KEY) {
      throw new Error("API_KEY environment variable not set.");
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const prompt = `
        Você é a IA do método Elevare Flow Prime™, uma analista de mercado sênior especializada em estética.
        Sua tarefa é realizar uma "Análise Sensorial de Mercado" com base nos perfis de concorrentes fornecidos.
        O objetivo é identificar o posicionamento deles para encontrar uma oportunidade única e inexplorada para a nossa usuária.

        Perfis Concorrentes para Análise: ${profiles.join(', ')}

        **Instruções de Análise:**
        Para cada perfil, analise os seguintes pontos (você pode inferir com base no nome e no senso comum de mercado de estética):
        1.  **Tom de Voz:** Como a marca se comunica? (Ex: Técnico e distante, Aspiracional e luxuoso, Acolhedor e próximo, Focado em promoções).
        2.  **Estratégia Visual:** Qual é a sensação transmitida pelas imagens? (Ex: Clínico e minimalista, Cores quentes e lifestyle, Antes e depois impactantes).
        3.  **Pilar de Conteúdo Principal:** Qual é o foco principal do conteúdo? (Ex: Educacional/Técnico, Vendas/Ofertas, Prova Social/Depoimentos, Lifestyle/Bastidores).

        **Instrução de Oportunidade:**
        Com base na análise dos concorrentes e nos princípios do Elevare Flow Prime (clareza, empatia, transformação), identifique e descreva a **"Oportunidade Única"** para a nossa usuária se destacar. Qual é o "espaço em branco" no mercado que ela pode ocupar?

        Responda APENAS com um objeto JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        analysis: {
                            type: Type.ARRAY,
                            description: "Uma lista de objetos, cada um contendo a análise de um concorrente.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    profile: { type: Type.STRING, description: "O @handle do perfil analisado." },
                                    toneOfVoice: { type: Type.STRING, description: "A análise do tom de voz." },
                                    visualStrategy: { type: Type.STRING, description: "A análise da estratégia visual." },
                                    contentPillar: { type: Type.STRING, description: "O principal pilar de conteúdo identificado." }
                                },
                                required: ["profile", "toneOfVoice", "visualStrategy", "contentPillar"]
                            }
                        },
                        opportunity: {
                            type: Type.STRING,
                            description: "A recomendação estratégica sobre a oportunidade única de posicionamento para a usuária."
                        }
                    },
                    required: ["analysis", "opportunity"]
                }
            }
        });

        return JSON.parse(response.text) as CompetitorAnalysisOutput;

    } catch (error) {
        console.error("Error analyzing competitors:", error);
        throw new Error("Não foi possível analisar o mercado. Verifique os perfis e tente novamente.");
    }
};
