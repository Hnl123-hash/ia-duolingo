
export const fetchQuestions = async (topic, level, quantity) => {
    try {
        // Reverted to simple prompt as requested by user
        let prompt = `Gerar Quiz. Tópico: ${topic}. Nível: ${level}. Quantidade: ${quantity}`;

        if (level === 'A1') {
            prompt += " Para cada pergunta, inclua a tradução em português entre parênteses logo após a pergunta em inglês.";
        }

        const response = await fetch('https://prosecutable-anastasia-nonnationalistically.ngrok-free.dev/api/v1/prediction/d5e11f34-3419-41e7-904d-7e3272c7cf8e', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true"
            },
            body: JSON.stringify({ "question": prompt })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return parseResponse(data);
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
};

const parseResponse = (data) => {
    try {
        // The questions are inside data.text, wrapped in markdown code blocks
        let text = data.text;

        // Remove markdown code block wrappers if present
        if (text.startsWith('```json')) {
            text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (text.startsWith('```')) {
            text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        const parsedData = JSON.parse(text);
        return parsedData;
    } catch (error) {
        console.error("Error parsing response:", error);
        throw new Error("Failed to parse API response");
    }
};

export const fetchLearningContent = async (topic, level, type) => {
    try {
        // Updated prompt to generate practice questions/flashcards as requested
        let prompt = `Gerar perguntas de fixação de inglês. Tópico: ${topic}. Nível: ${level}. Foco: ${type}. Retorne um JSON com uma lista de itens, onde cada item tem 'pergunta' (a questão), 'resposta' (a resposta correta) e 'explicacao' (breve explicação).`;

        if (type === 'Teoria') {
            prompt = `Gerar resumos de regras gramaticais de inglês em português. Tópico: ${topic}. Retorne um JSON com uma lista de itens. Para cada item: 'pergunta' deve ser a explicação da regra em português. 'alternativas' deve ser uma lista de 3 frases em inglês, onde apenas uma aplica corretamente a regra (marque com 'isCorreto': true). 'explicacao' deve explicar por que a frase escolhida está correta.`;
        } else if (level === 'A1') {
            prompt += " Para cada pergunta, inclua a tradução em português entre parênteses.";
        }

        const response = await fetch('https://prosecutable-anastasia-nonnationalistically.ngrok-free.dev/api/v1/prediction/d5e11f34-3419-41e7-904d-7e3272c7cf8e', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true"
            },
            body: JSON.stringify({ "question": prompt })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return parseResponse(data);
    } catch (error) {
        console.error("Error fetching learning content:", error);
        throw error;
    }
};
