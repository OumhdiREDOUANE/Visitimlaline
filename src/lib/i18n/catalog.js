const catalog = {
  fr: {
    activities: {
      'quad-adventure': {
        title: 'Aventure en quad',
        description: 'Explorez les paysages de Timlaline au guidon d’un quad.',
        inclusions: ['Quad', 'Équipement de sécurité', 'Guide local'],
        good_to_know: [
          'Arrivez 15 minutes à l’avance',
          'Tenue confortable recommandée',
          'Un permis peut être demandé selon le véhicule',
        ],
        itinerary: [
          ['Accueil', 'Rencontrez votre guide et recevez les consignes de sécurité'],
          ['Départ', 'Commencez l’aventure en quad à travers les paysages'],
          ['Aventure', 'Explorez le parcours et profitez des panoramas'],
          ['Retour', 'Revenez au point de départ'],
        ],
      },
      'sandboarding-dunes': {
        title: 'Sandboard dans les dunes',
        description: 'Dévalez les dunes côtières dorées de Timlaline face à l’océan Atlantique.',
        inclusions: ['Sandboard professionnel et fart', 'Guide des dunes et initiation', 'Eau fraîche et thé marocain'],
        good_to_know: [
          'Convient aux débutants comme aux amateurs de sensations',
          'Pieds nus ou baskets légères recommandés sur le sable',
          'La plus belle lumière est en fin d’après-midi',
        ],
        itinerary: [
          ['Rendez-vous', 'Accueil à la base du canyon de Timlaline'],
          ['Ascension', 'Courte marche panoramique jusqu’au sommet de la dune principale'],
          ['Glisse', 'Apprenez l’équilibre et glissez sur les dunes'],
          ['Pause thé', 'Détendez-vous avec un thé à la menthe face à l’océan'],
        ],
      },
      'camel-ride-tour': {
        title: 'Expérience caravane à dos de chameau',
        description: 'Suivez l’ancien sentier côtier lors d’une paisible balade entre dunes et falaises de Timlaline.',
        inclusions: ['Trek guidé à dos de chameau', 'Pause photo avec foulard nomade traditionnel', 'Thé marocain à la menthe'],
        good_to_know: [
          'Adapté aux familles (les enfants peuvent monter à deux)',
          'Pantalon long et crème solaire recommandés',
          'Arrivez 15 minutes avant le départ',
        ],
        itinerary: [
          ['Bienvenue', 'Rencontrez les chameliers et votre doux dromadaire'],
          ['Sentier côtier', 'Suivez la crête où les dunes rencontrent l’Atlantique'],
          ['Pause photo', 'Arrêtez-vous sur la crête la plus haute pour des panoramas'],
          ['Retour', 'Revenez au camp pour un thé à la menthe traditionnel'],
        ],
      },
      'cave-discovery': {
        title: 'Découverte des grottes',
        description: 'Découvrez les grottes naturelles et le patrimoine du littoral de Timlaline.',
        inclusions: ['Guide local', 'Briefing de sécurité', 'Exploration des grottes'],
        good_to_know: ['Portez des chaussures confortables', 'Certains passages peuvent être irréguliers', 'Suivez les consignes du guide'],
        itinerary: [
          ['Briefing', 'Introduction et consignes de sécurité'],
          ['Marche', 'Suivez le sentier vers les grottes'],
          ['Découverte', 'Explorez l’environnement des grottes'],
          ['Retour', 'Revenez avec votre guide'],
        ],
      },
      'sunset-experience': {
        title: 'Expérience coucher de soleil',
        description: 'Vivez un coucher de soleil mémorable entre l’Atlantique et les paysages désertiques.',
        inclusions: ['Observation du coucher de soleil', 'Guide local', 'Thé marocain'],
        good_to_know: ['L’heure du coucher varie selon la date', 'Prévoyez une veste légère', 'Arrivez avant le départ'],
        itinerary: [
          ['Arrivée', 'Retrouvez l’équipe locale'],
          ['Marche', 'Rejoignez le point de vue'],
          ['Coucher de soleil', 'Profitez de la lumière et du paysage'],
          ['Retour', 'Revenez au point de rendez-vous'],
        ],
      },
      'local-experience': {
        title: 'Expérience locale',
        description: 'Partagez un moment marocain chaleureux autour du thé, de la cuisine et des rencontres.',
        inclusions: ['Thé marocain', 'Cuisine locale', 'Hôte local'],
        good_to_know: ['Indiquez vos restrictions alimentaires', 'Respectez les coutumes locales', 'L’expérience peut varier selon l’hôte'],
        itinerary: [
          ['Bienvenue', 'Rencontrez votre hôte local'],
          ['Thé', 'Savourez un thé marocain traditionnel'],
          ['Cuisine', 'Découvrez les spécialités locales'],
          ['Échange', 'Partagez un moment authentique'],
        ],
      },
    },
    packs: {
      'the-adventurer': {
        title: 'Pack Ride Ultime',
        description: 'Quad, sandboard et découverte des grottes pour une aventure complète à Timlaline.',
        includes: ['Aventure en quad', 'Sandboard dans les dunes', 'Découverte des grottes'],
      },
      'the-sunset': {
        title: 'Pack Évasion Désert',
        description: 'Une caravane à dos de chameau, du sandboard et un thé au coucher du soleil.',
        includes: ['Expérience caravane à dos de chameau', 'Sandboard dans les dunes', 'Coucher de soleil et thé'],
      },
      'the-complete-experience': {
        title: 'Pack Trio Sauvage',
        description: 'L’aventure complète de Timlaline entre quad, chameau, grottes et coucher de soleil.',
        includes: ['Aventure en quad', 'Expérience caravane à dos de chameau', 'Découverte des grottes', 'Coucher de soleil et thé'],
      },
    },
  },
  en: {
    activities: {
      'quad-adventure': {
        title: 'Quad Adventure',
        description: 'Explore the Timlaline landscape on an exciting quad adventure.',
        inclusions: ['Quad bike', 'Safety equipment', 'Local guide'],
        good_to_know: ['Arrive 15 minutes early', 'Comfortable clothes recommended', 'Driver licence may be required depending on the vehicle'],
        itinerary: [['Welcome', 'Meet your guide and receive the safety briefing'], ['Departure', 'Start the quad adventure through the landscape'], ['Adventure', 'Explore the route and enjoy the scenery'], ['Return', 'Return to the starting point']],
      },
      'sandboarding-dunes': {
        title: 'Sandboarding in the Dunes',
        description: 'Carve down the golden coastal dunes of Timlaline facing the Atlantic Ocean.',
        inclusions: ['Pro sandboard & wax', 'Dune guide & instruction', 'Cold water & Moroccan tea'],
        good_to_know: ['Suitable for beginners and thrill-seekers', 'Barefoot or light sneakers recommended on the sand', 'Best golden light in the late afternoon'],
        itinerary: [['Meetup', 'Welcome at the Timlaline canyon base'], ['Climb', 'Short scenic walk to the top of the main dune'], ['Ride', 'Learn balance techniques and glide down the dunes'], ['Tea Break', 'Relax with Moroccan mint tea overlooking the ocean']],
      },
      'camel-ride-tour': {
        title: 'Camel Caravan Experience',
        description: 'Follow the ancient coastal trail on a peaceful camel trek across the dunes and cliffs of Timlaline.',
        inclusions: ['Guided camel trek', 'Traditional nomad scarf photo stop', 'Moroccan mint tea'],
        good_to_know: ['Family friendly (kids can ride tandem)', 'Long pants and sunscreen recommended', 'Arrive 15 minutes before departure'],
        itinerary: [['Welcome', 'Meet the camel handlers and your gentle dromedary'], ['Coastal Trail', 'Ride along the ridge where sand dunes meet the Atlantic'], ['Photo Stop', 'Pause on the highest crest for panoramic photos'], ['Return', 'Head back to camp for traditional mint tea']],
      },
      'cave-discovery': {
        title: 'Cave Discovery',
        description: 'Discover natural cave landscapes and learn more about the local environment.',
        inclusions: ['Local guide', 'Safety briefing', 'Cave exploration'],
        good_to_know: ['Wear comfortable shoes', 'Some areas may be uneven', 'Follow the guide instructions'],
        itinerary: [['Briefing', 'Introduction and safety instructions'], ['Walk', 'Follow the route toward the cave'], ['Discovery', 'Explore the cave area'], ['Return', 'Return with the guide']],
      },
      'sunset-experience': {
        title: 'Sunset Experience',
        description: 'Enjoy a memorable sunset experience surrounded by the Atlantic and desert landscape.',
        inclusions: ['Sunset viewing', 'Local guide', 'Moroccan tea'],
        good_to_know: ['Sunset time varies by date', 'Bring a light jacket', 'Please arrive before departure'],
        itinerary: [['Arrival', 'Meet the local team'], ['Walk', 'Move to the sunset viewpoint'], ['Sunset', 'Enjoy the sunset and landscape'], ['Return', 'Return to the meeting point']],
      },
      'local-experience': {
        title: 'Local Experience',
        description: 'Share a warm Moroccan local experience with tea, food and authentic human interaction.',
        inclusions: ['Moroccan tea', 'Local food', 'Local host'],
        good_to_know: ['Tell us about dietary restrictions', 'Respect local customs', 'The experience may vary depending on the host'],
        itinerary: [['Welcome', 'Meet your local host'], ['Tea', 'Enjoy traditional Moroccan tea'], ['Food', 'Discover local food'], ['Conversation', 'Share the local experience']],
      },
    },
    packs: {
      'the-adventurer': { title: 'The Ultimate Ride Pack', description: 'Quad, sandboarding and cave discovery for a complete Timlaline adventure.', includes: ['Quad Adventure', 'Sandboarding in the Dunes', 'Cave Discovery'] },
      'the-sunset': { title: 'Desert Escape Pack', description: 'A camel caravan, sandboarding and sunset tea across the Timlaline dunes.', includes: ['Camel Caravan Experience', 'Sandboarding in the Dunes', 'Sunset Experience & Tea'] },
      'the-complete-experience': { title: 'The Wild Trio Pack', description: 'The complete Timlaline adventure combining quad, camel, cave and sunset experiences.', includes: ['Quad Adventure', 'Camel Caravan Experience', 'Cave Discovery', 'Sunset Experience & Tea'] },
    },
  },
};

export function getCatalogTranslation(locale, type, slug) {
  return catalog[locale]?.[type]?.[slug] ?? null;
}
