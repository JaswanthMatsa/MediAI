const OTC_MEDICINES = [
  {
    name: 'Acetaminophen / Paracetamol',
    brandName: 'Tylenol / Calpol',
    uses: 'Pain reliever and fever reducer for headache, muscle aches, sore throat, toothache, and fever.',
    dosage: 'Adults: 325mg to 650mg every 4 to 6 hours as needed. Do not exceed 4,000mg per 24 hours.',
    warnings: 'Liver warning: Extreme liver damage may occur if you take more than 4,000 mg in 24 hours or consume 3+ alcoholic drinks daily.',
    sideEffects: 'Nausea, allergic skin reaction, rash (rare).',
    ingredients: ['Acetaminophen'],
    manufacturer: 'McNeil Consumer Healthcare',
    isOTC: true
  },
  {
    name: 'Ibuprofen',
    brandName: 'Advil / Motrin',
    uses: 'Nonsteroidal anti-inflammatory drug (NSAID) for relief of body aches, joint pain, dental pain, fever, and inflammation.',
    dosage: 'Adults: 200mg to 400mg every 4 to 6 hours with food. Maximum 1,200mg/day OTC limit.',
    warnings: 'Stomach bleeding hazard: May increase risk of severe stomach bleeding if taken for prolonged periods or with stomach ulcer history.',
    sideEffects: 'Stomach upset, heartburn, mild nausea, dizziness.',
    ingredients: ['Ibuprofen'],
    manufacturer: 'Pfizer Consumer Healthcare',
    isOTC: true
  },
  {
    name: 'Cetirizine Hydrochloride',
    brandName: 'Zyrtec',
    uses: 'Relief of sneezing, runny nose, itchy watery eyes, and itchy throat or nose caused by hay fever or upper respiratory allergies.',
    dosage: 'Adults and children 6+ years: One 10mg tablet once daily.',
    warnings: 'Drowsiness warning: May cause drowsiness. Exercise caution driving or operating machinery.',
    sideEffects: 'Mild drowsiness, dry mouth, tiredness.',
    ingredients: ['Cetirizine HCl'],
    manufacturer: 'Johnson & Johnson Consumer Inc.',
    isOTC: true
  },
  {
    name: 'Dextromethorphan HBr & Guaifenesin',
    brandName: 'Benylin / Robitussin / Mucinex',
    uses: 'Helps loosen mucus and thin bronchial secretions to make coughs more productive and suppress dry, tickly coughs.',
    dosage: 'Adults: 10ml to 20ml every 4 hours or as directed on package label.',
    warnings: 'Do not use if you are taking a prescription MAOI or within 2 weeks of stopping MAOI drug.',
    sideEffects: 'Dizziness, drowsiness, nausea.',
    ingredients: ['Dextromethorphan HBr', 'Guaifenesin'],
    manufacturer: 'Reckitt Benckiser Group',
    isOTC: true
  },
  {
    name: 'Calcium Carbonate Antacid',
    brandName: 'Tums / Rennie',
    uses: 'Relief of heartburn, acid indigestion, sour stomach, and upset stomach associated with acid.',
    dosage: 'Chew 2 to 4 tablets as symptoms occur, up to maximum 10 tablets daily.',
    warnings: 'Do not take for symptoms that persist for more than 2 weeks unless advised by a physician.',
    sideEffects: 'Constipation, gas, bloating.',
    ingredients: ['Calcium Carbonate'],
    manufacturer: 'GSK Consumer Healthcare',
    isOTC: true
  },
  {
    name: 'Oral Rehydration Salts (ORS)',
    brandName: 'Pedialyte / Electral',
    uses: 'Prevents and treats dehydration caused by diarrhea, vomiting, fever, or excessive sweating.',
    dosage: 'Dissolve packet in 1 liter of clean drinking water. Drink small frequent sips.',
    warnings: 'Use reconstituted solution within 24 hours. Do not boil prepared solution.',
    sideEffects: 'None when diluted properly.',
    ingredients: ['Sodium Chloride', 'Potassium Chloride', 'Sodium Citrate', 'Dextrose'],
    manufacturer: 'WHO Recommended Formulation',
    isOTC: true
  }
];

async function searchMedicines(query) {
  if (!query || query.trim() === '') {
    return OTC_MEDICINES;
  }

  const cleanQuery = query.trim().toLowerCase();

  const filtered = OTC_MEDICINES.filter(m =>
    m.name.toLowerCase().includes(cleanQuery) ||
    m.brandName.toLowerCase().includes(cleanQuery) ||
    m.uses.toLowerCase().includes(cleanQuery) ||
    m.ingredients.some(i => i.toLowerCase().includes(cleanQuery))
  );

  return filtered.length > 0 ? filtered : OTC_MEDICINES;
}

module.exports = { searchMedicines, OTC_MEDICINES };
