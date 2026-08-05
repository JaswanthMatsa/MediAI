const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart attack', 'shortness of breath', 'can\'t breathe', 'difficulty breathing',
  'unconscious', 'fainted', 'heavy bleeding', 'stroke', 'paralysis', 'numbness on one side',
  'severe anaphylaxis', 'swollen throat', 'seizure', 'suicidal'
];

const EMERGENCY_CONTACTS = [
  { service: 'Universal Emergency Helpline', number: '911 / 112', type: 'Universal Emergency' },
  { service: 'Ambulance & Trauma Direct', number: '102 / 911', type: 'Medical Ambulance' },
  { service: 'Poison Control Center', number: '1-800-222-1222', type: 'Poison Emergency' },
  { service: 'Mental Health & Crisis Hotline', number: '988', type: 'Psychiatric / Crisis Care' }
];

module.exports = { EMERGENCY_KEYWORDS, EMERGENCY_CONTACTS };
