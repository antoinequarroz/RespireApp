export const HEALTH_TIMELINE = [
  { minutes: 20, key: 'blood_pressure', labelFr: 'Ta tension artérielle se normalise' },
  { hours: 8, key: 'carbon_monoxide', labelFr: 'Le CO dans ton sang diminue de moitié' },
  { hours: 24, key: 'heart_attack', labelFr: "Risque d'infarctus déjà réduit" },
  { hours: 48, key: 'smell_taste', labelFr: 'Goût et odorat commencent à revenir' },
  { weeks: 2, key: 'circulation', labelFr: 'Circulation sanguine améliorée' },
  { months: 1, key: 'lungs', labelFr: 'Poumons : cils régénérés, moins de toux' },
  { months: 3, key: 'fertility', labelFr: 'Fertilité améliorée' },
  { months: 9, key: 'breathing', labelFr: 'Respiration nettement plus facile' },
  { years: 1, key: 'heart_disease', labelFr: 'Risque de maladie coronaire divisé par 2' },
  { years: 5, key: 'stroke', labelFr: "Risque d'AVC identique à un non-fumeur" },
  { years: 10, key: 'lung_cancer', labelFr: 'Risque de cancer du poumon divisé par 2' },
  { years: 15, key: 'heart_normal', labelFr: 'Risque cardiaque identique à un non-fumeur' },
] as const;
