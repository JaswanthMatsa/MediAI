const axios = require('axios');
const { EMERGENCY_KEYWORDS } = require('../constants/healthConstants');

const SYSTEM_PROMPT = `
You are MediAI Health Assistant.
Follow these mandatory safety rules strictly:
1. NEVER diagnose specific diseases or medical conditions definitively.
2. NEVER prescribe antibiotics, controlled substances, or prescription-only medications.
3. ONLY suggest common Over-The-Counter (OTC) remedies with appropriate warnings.
4. Structure your response into these exact clean sections:
   - Possible Cause
   - Suggested OTC Medicines
   - Home Care
   - See a Doctor If
   - Emergency Level (🟢 Low, 🟡 Moderate, 🟠 High, 🔴 Emergency)
5. Format cleanly using simple Markdown.
`;

function detectEmergency(message) {
  const lower = message.toLowerCase();
  return EMERGENCY_KEYWORDS.some(kw => lower.includes(kw));
}

function generateFallbackResponse(userMessage, openFdaMedicines = []) {
  const lower = userMessage.toLowerCase();
  const isEmergency = detectEmergency(userMessage);

  if (isEmergency) {
    return {
      severity: 'emergency',
      urgencyBadge: '🔴 Emergency',
      safetyNotice: 'EMERGENCY ALERT: Immediate medical attention required.',
      response: `**Possible Cause**
Severe or acute medical event requiring urgent evaluation.

────────────────────

**Suggested OTC Medicines**
• None (Do not attempt self-medication during emergencies)

────────────────────

**Home Care**
• Rest in a safe position
• Stay calm and wait for emergency responders

────────────────────

**See a Doctor If**
• Seek immediate emergency medical care or visit the nearest ER right now.

────────────────────

**Emergency Level**
🔴 Emergency`,
      recommendedMedicines: [],
      symptomsExtracted: ['Severe Emergency Symptoms']
    };
  }

  let symptomsExtracted = [];
  let suggestedOTC = [];
  let urgencyBadge = '🟢 Low';
  let severity = 'mild';

  if (lower.includes('fever') || lower.includes('temperature')) {
    symptomsExtracted.push('Fever / Body Warmth');
    suggestedOTC.push({
      name: 'Paracetamol / Acetaminophen (OTC)',
      purpose: 'Helps reduce fever and relieve mild pain.',
      warnings: 'Check liver warning. Do not exceed 4000mg/day.'
    });
    urgencyBadge = '🟡 Moderate';
    severity = 'moderate';
  }

  if (lower.includes('cough') || lower.includes('throat')) {
    symptomsExtracted.push('Cough / Throat Irritation');
    suggestedOTC.push({
      name: 'Dextromethorphan Cough Lozenges (OTC)',
      purpose: 'Soothes throat tickle and suppresses cough.',
      warnings: 'Stay hydrated with warm fluids.'
    });
  }

  if (lower.includes('cold') || lower.includes('runny nose') || lower.includes('congestion')) {
    symptomsExtracted.push('Nasal Congestion');
    suggestedOTC.push({
      name: 'Cetirizine / Saline Nasal Spray (OTC)',
      purpose: 'Relieves sneezing and nasal congestion.',
      warnings: 'May cause mild drowsiness.'
    });
  }

  if (lower.includes('headache') || lower.includes('body pain')) {
    symptomsExtracted.push('Headache / Body Pain');
    suggestedOTC.push({
      name: 'Ibuprofen (OTC)',
      purpose: 'NSAID pain reliever and anti-inflammatory.',
      warnings: 'Take with food to prevent stomach upset.'
    });
  }

  if (lower.includes('acidity') || lower.includes('stomach') || lower.includes('heartburn')) {
    symptomsExtracted.push('Stomach Discomfort');
    suggestedOTC.push({
      name: 'Antacid (Calcium Carbonate OTC)',
      purpose: 'Neutralizes excess stomach acid.',
      warnings: 'Do not use for more than 14 days without doctor advice.'
    });
  }

  if (suggestedOTC.length === 0) {
    symptomsExtracted.push('General Symptoms');
    suggestedOTC.push({
      name: 'Oral Rehydration Salts (ORS) / Multivitamin',
      purpose: 'Maintains hydration and fluid balance.',
      warnings: 'Consult a doctor if symptoms persist.'
    });
  }

  // Add OpenFDA items if passed
  if (openFdaMedicines && openFdaMedicines.length > 0) {
    openFdaMedicines.slice(0, 2).forEach(med => {
      suggestedOTC.push({
        name: `${med.brandName || med.name} (FDA OTC)`,
        purpose: med.uses || 'Symptom relief',
        warnings: med.warnings || 'Follow packaging instructions.'
      });
    });
  }

  const responseText = `**Possible Cause**
${symptomsExtracted.join(', ')} (Common viral or environmental response).

────────────────────

**Suggested OTC Medicines**
${suggestedOTC.map(m => `• **${m.name}**: ${m.purpose}`).join('\n')}

────────────────────

**Home Care**
• Drink plenty of fluids (water, warm herbal tea, electrolyte fluids)
• Ensure adequate rest and avoid physical strain
• Monitor body temperature over the next 24-48 hours

────────────────────

**See a Doctor If**
• Symptoms persist for more than 3 days
• Fever exceeds 102°F (38.9°C)
• You develop difficulty breathing or severe pain

────────────────────

**Emergency Level**
${urgencyBadge}`;

  return {
    severity,
    urgencyBadge,
    safetyNotice: 'General OTC guidance provided. Non-diagnostic.',
    response: responseText,
    recommendedMedicines: suggestedOTC,
    symptomsExtracted
  };
}

async function analyzeSymptomsWithAI(userMessage, openFdaMedicines = []) {
  const isEmergency = detectEmergency(userMessage);
  if (isEmergency) {
    return generateFallbackResponse(userMessage, openFdaMedicines);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return generateFallbackResponse(userMessage, openFdaMedicines);
  }

  try {
    const prompt = `${SYSTEM_PROMPT}\nUser Query: "${userMessage}"\nRespond in structured sections.`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }]
    }, { timeout: 8000 });

    const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (aiText) {
      const fallbackData = generateFallbackResponse(userMessage, openFdaMedicines);
      return {
        severity: fallbackData.severity,
        urgencyBadge: fallbackData.urgencyBadge,
        safetyNotice: 'AI-generated health guidance with OTC safety rules.',
        response: aiText,
        recommendedMedicines: fallbackData.recommendedMedicines,
        symptomsExtracted: fallbackData.symptomsExtracted
      };
    }
  } catch (error) {
    console.warn('[Gemini AI Call Error]', error.message);
  }

  return generateFallbackResponse(userMessage, openFdaMedicines);
}

module.exports = { analyzeSymptomsWithAI, detectEmergency };
