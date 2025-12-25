export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Método não permitido", { status: 405 });
  }

  const body = await req.json();

  const {
    respostas,
    observacoes,
    diasPlano
  } = body;

  const prompt = `
Você é um especialista em comportamento humano.

Com base nas respostas abaixo, faça:
1. Diagnóstico profundo e individual
2. Explicação clara da personalidade
3. Pontos fortes e fracos
4. Plano diário EXTREMAMENTE detalhado de ${diasPlano} dias
5. Plano deve variar dia a dia
6. Considerar fielmente as observações pessoais

RESPOSTAS:
${JSON.stringify(respostas)}

OBSERVAÇÕES:
${observacoes}

REGRAS:
- Nada genérico
- Nada repetido
- Rotina com horários
- Ajustar domingo se citado
- Evolução progressiva
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })
  });

  const data = await response.json();

  return new Response(
    JSON.stringify({ resultado: data.choices[0].message.content }),
    { headers: { "Content-Type": "application/json" } }
  );
};
