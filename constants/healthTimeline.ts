export const HEALTH_TIMELINE = [
  { minutes: 20, key: 'blood_pressure', labelFr: 'Ta tension arterielle se normalise' },
  { hours: 8, key: 'carbon_monoxide', labelFr: 'Le CO dans ton sang diminue de moitie' },
  { hours: 24, key: 'heart_attack', labelFr: "Risque d'infarctus deja reduit" },
  { hours: 48, key: 'smell_taste', labelFr: 'Gout et odorat commencent a revenir' },
  { weeks: 2, key: 'circulation', labelFr: 'Circulation sanguine amelioree' },
  { months: 1, key: 'lungs', labelFr: 'Poumons : cils regeneres, moins de toux' },
  { months: 3, key: 'fertility', labelFr: 'Fertilite amelioree' },
  { months: 9, key: 'breathing', labelFr: 'Respiration nettement plus facile' },
  { years: 1, key: 'heart_disease', labelFr: 'Risque de maladie coronaire divise par 2' },
  { years: 5, key: 'stroke', labelFr: "Risque d'AVC identique a un non-fumeur" },
  { years: 10, key: 'lung_cancer', labelFr: 'Risque de cancer du poumon divise par 2' },
  { years: 15, key: 'heart_normal', labelFr: 'Risque cardiaque identique a un non-fumeur' },
] as const;
