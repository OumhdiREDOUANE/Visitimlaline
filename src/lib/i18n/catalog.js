const catalog = {
  fr: {
    activities: {
      'quad-adventure': { title: 'Aventure en quad', description: 'Explorez les paysages de Timlaline au guidon d’un quad.' },
      'sandboarding-dunes': { title: 'Sandboard dans les dunes', description: 'Dévalez les dunes côtières dorées de Timlaline face à l’océan Atlantique.' },
      'camel-ride-tour': { title: 'Expérience caravane à dos de chameau', description: 'Suivez l’ancien sentier côtier lors d’une paisible balade entre dunes et falaises de Timlaline.' },
      'cave-discovery': { title: 'Découverte des grottes', description: 'Découvrez les grottes naturelles et le patrimoine du littoral de Timlaline.' },
      'sunset-experience': { title: 'Expérience coucher de soleil', description: 'Vivez un coucher de soleil mémorable entre l’Atlantique et les paysages désertiques.' },
      'local-experience': { title: 'Expérience locale', description: 'Partagez un moment marocain chaleureux autour du thé, de la cuisine et des rencontres.' },
    },
    packs: {
      'the-adventurer': { title: 'Pack Ride Ultime', description: 'Quad, sandboard et découverte des grottes pour une aventure complète à Timlaline.' },
      'the-sunset': { title: 'Pack Évasion Désert', description: 'Une caravane à dos de chameau, du sandboard et un thé au coucher du soleil.' },
      'the-complete-experience': { title: 'Pack Trio Sauvage', description: 'L’aventure complète de Timlaline entre quad, chameau, grottes et coucher de soleil.' },
    },
  },
  en: {
    activities: {
      'quad-adventure': { title: 'Quad Adventure', description: 'Explore the Timlaline landscape on an exciting quad adventure.' },
      'sandboarding-dunes': { title: 'Sandboarding in the Dunes', description: 'Carve down the golden coastal dunes of Timlaline facing the Atlantic Ocean.' },
      'camel-ride-tour': { title: 'Camel Caravan Experience', description: 'Follow the ancient coastal trail on a peaceful camel trek across the dunes and cliffs of Timlaline.' },
      'cave-discovery': { title: 'Cave Discovery', description: 'Discover natural cave landscapes and learn more about the local environment.' },
      'sunset-experience': { title: 'Sunset Experience', description: 'Enjoy a memorable sunset experience surrounded by the Atlantic and desert landscape.' },
      'local-experience': { title: 'Local Experience', description: 'Share a warm Moroccan local experience with tea, food and authentic human interaction.' },
    },
    packs: {
      'the-adventurer': { title: 'The Ultimate Ride Pack', description: 'Quad, sandboarding and cave discovery for a complete Timlaline adventure.' },
      'the-sunset': { title: 'Desert Escape Pack', description: 'A camel caravan, sandboarding and sunset tea across the Timlaline dunes.' },
      'the-complete-experience': { title: 'The Wild Trio Pack', description: 'The complete Timlaline adventure combining quad, camel, cave and sunset experiences.' },
    },
  },
};

export function getCatalogTranslation(locale, type, slug) {
  return catalog[locale]?.[type]?.[slug] ?? null;
}
