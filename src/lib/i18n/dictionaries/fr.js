export default {
  meta: {
    title: 'Visitimlaline — Aventures premium à Timlaline',
    description:
      'Expériences en petit groupe dans les grottes, sur la côte et au coucher du soleil de Timlaline, Maroc.',
  },

  nav: {
    experiences: 'Expériences',
    packs: 'Packs',
    book: 'Réserver',
    login: 'Espace équipe',
    language: 'Langue',
    bookings: 'Réservations',
    notifications: 'Notifications',
    checkIn: 'Arrivées',
  },

  common: {
    from: 'À partir de',
    perPerson: '/ personne',
    minutes: 'min',
    product: 'Produit',
    viewDetails: 'Voir le détail',
  },

  home: {
    eyebrow: 'Timlaline · Maroc',
    title: 'Là où l’Atlantique rencontre l’aventure.',
    subtitle:
      'Des expériences guidées, choisies avec soin, à travers les grottes, la côte et les paysages dorés de Timlaline.',
    ctaExperiences: 'Découvrir les expériences',
    ctaPacks: 'Voir les packs',
    categoryEyebrow: 'Par terrain',
    paceEyebrow: 'Choisissez votre rythme',
    paceTitle: 'Que voulez-vous vivre ?',
    storyEyebrow: 'Pour les curieux',
    storyTitle: 'Un lieu. Mille façons de le ressentir.',
    storyText:
      'Parcourez les pistes côtières, entrez dans les grottes, attendez le coucher du soleil ou partagez la table marocaine. Réservez une expérience à la fois ou avancez dans Timlaline avec un pack.',
    storyCta: 'Voir les disponibilités',
    packEyebrow: 'Combinés sur mesure',
    packTitle: 'Allez plus loin avec un pack.',
  },

  experiences: {
    eyebrow: 'Toutes les expériences',
    title: 'Trouvez votre Timlaline.',
    lead:
      'Des expériences en petit groupe pensées autour de la côte, du paysage et du rythme de la journée.',
    all: 'Toutes',
    empty: 'Aucune expérience dans cette catégorie.',
  },

  activity: {
    included: 'Ce qui est inclus',
    goodToKnow: 'Bon à savoir',
    itinerary: 'Votre expérience',
    gallery: 'Galerie',
    relatedTitle: 'Vous aimerez aussi',
    checkAvailability: 'Voir les disponibilités',
    backToExperiences: 'Toutes les expériences',
  },

  packs: {
    eyebrow: 'Combinés',
    title: 'Plus de Timlaline, ensemble.',
    lead:
      'De vrais combinés réservables pour occuper une matinée, un après-midi ou une journée entière sur la côte.',
    choose: 'Réserver ce pack',
  },

  booking: {
    eyebrow: 'Réserver',
    title: 'Commencez votre aventure.',
    typeLabel: 'Que voulez-vous réserver ?',
    typeActivity: 'Une expérience',
    typePack: 'Un pack',
    chooseActivity: 'Choisissez une expérience',
    choosePack: 'Choisissez un pack',
    date: 'Date',
    dateHint: 'Choisissez une date à venir',
    guests: 'Nombre de voyageurs',
    guestsHint: '8 voyageurs maximum par réservation',
    slot: 'Créneau disponible',
    slotLoading: 'Vérification des disponibilités…',
    slotEmpty: 'Aucun créneau disponible ce jour-là.',
    slotRemaining: '{count} place(s) restante(s)',
    slotFull: 'Complet',
    detailsTitle: 'Vos coordonnées',
    fullName: 'Nom complet',
    email: 'E-mail',
    phone: 'Téléphone (WhatsApp)',
    phoneHint: 'Nous vous appelons uniquement si nécessaire',
    summary: 'Récapitulatif',
    summaryActivity: 'Expérience',
    summaryPack: 'Pack',
    total: 'Total estimé',
    paymentNote: 'Le paiement se fait sur place, à l’arrivée.',
    submit: 'Confirmer la réservation',
    submitting: 'Envoi…',
    successTitle: 'Réservation enregistrée.',
    successText:
      'Présentez la référence et le code d’accès écrits ci-dessous à l’arrivée.',
    anotherBooking: 'Faire une autre réservation',
    errorNetwork: 'Connexion impossible. Vérifiez votre réseau.',
    errorGeneric: 'La réservation a échoué. Réessayez.',
    errorFull: 'Ce créneau est complet.',
    errorDuplicate: 'Une réservation identique existe déjà.',
  },

  field: {
    activity: 'Choisissez une expérience ou un pack.',
    customerName: 'Le nom complet est requis.',
    email: 'E-mail invalide.',
    phone: 'Le téléphone est requis.',
    date: 'Date invalide (format AAAA-MM-JJ).',
    time: 'Créneau invalide.',
    guests: 'Le nombre de voyageurs doit être compris entre 1 et 8.',
    both: 'Choisissez soit une expérience, soit un pack.',
  },

  ticket: {
    eyebrow: 'Mon billet',
    title: 'Retrouvez votre réservation.',
    lead:
      'Saisissez la référence et le code d’accès reçu lors de la réservation.',
    reference: 'Référence de réservation',
    code: 'Code d’accès',
    lookup: 'Afficher mon billet',
    looking: 'Recherche…',
    invalid: 'Référence ou code d’accès incorrect.',
    checkInHint:
      'Présentez ce code ou le QR à l’entrée.',
    qrAlt: 'QR de check-in pour la réservation {reference}',
    print: 'Imprimer / enregistrer en PDF',
    newBooking: 'Nouvelle réservation',
  },

  login: {
    title: 'Espace équipe',
    lead: 'Connectez-vous pour gérer les réservations et les arrivées.',
    email: 'E-mail',
    password: 'Mot de passe',
    submit: 'Se connecter',
    submitting: 'Connexion…',
    invalid: 'E-mail ou mot de passe incorrect.',
    inactive: 'Ce compte est désactivé.',
    failed: 'Connexion impossible. Réessayez.',
  },

  backoffice: {
    welcome: 'Bonjour, {name}',
    signOut: 'Déconnexion',
  },

  adminBookings: {
    title: 'Réservations',
    lead: 'Toutes les réservations, filtrables par statut et par produit.',
    filters: 'Filtres',
    status: 'Statut',
    product: 'Produit',
    allStatuses: 'Tous les statuts',
    allProducts: 'Tous les produits',
    clear: 'Effacer les filtres',
    reference: 'Référence',
    customer: 'Client',
    when: 'Date',
    guests: 'Voyageurs',
    total: 'Total',
    actions: 'Actions',
    arrivedAt: 'Arrivée',
    empty: 'Aucune réservation pour ces filtres.',
    selectBooking:
      'Sélectionnez une ligne pour voir le détail et agir sur la réservation.',
    detail: 'Détail de la réservation',
    maskedCode: 'Code d’accès masqué par sécurité',
    cancel: 'Annuler la réservation',
    cancelConfirm: 'Annuler cette réservation ?',
    cancelDone: 'Réservation annulée.',
    cancelError: 'Annulation impossible.',
    rescheduleTitle: 'Nouvelle date et heure',
    newDate: 'Nouvelle date',
    newTime: 'Nouveau créneau',
    save: 'Enregistrer',
    rescheduleDone: 'Réservation reprogrammée.',
    rescheduleError: 'Reprogrammation impossible.',
    locked: 'Réservation close : action indisponible.',
  },

  notifications: {
    title: 'Notifications',
    lead: 'Alertes d’arrivée générées par les check-ins.',
    all: 'Toutes',
    unread: 'Non lues',
    read: 'Lues',
    markRead: 'Marquer comme lue',
    markUnread: 'Marquer comme non lue',
    empty: 'Aucune notification.',
    createdAt: 'Reçue le {time}',
  },

  checkIn: {
    title: 'Arrivée client',
    lead:
      'Saisissez la référence et le code d’accès du client pour enregistrer son arrivée.',
    submit: 'Enregistrer l’arrivée',
    submitting: 'Enregistrement…',
    success: 'Arrivée enregistrée.',
    already:
      'Cette réservation est close : déjà enregistrée ou annulée.',
    notFound: 'Réservation introuvable.',
    failed: 'Enregistrement impossible.',
    scanStart: 'Scanner le QR du billet',
    scanStop: 'Arrêter le scan',
    scanHint:
      'Pointez la caméra sur le QR du billet du client, ou saisissez le code ci-dessous.',
    badQr:
      'Ce QR n’est pas un billet Visitimlaline. Saisissez plutôt la référence et le code d’accès.',
    cameraError:
      'Caméra indisponible ici. Saisissez plutôt la référence et le code d’accès.',
  },

  status: {
    notPaidYet: 'À payer sur place',
    arrived: 'Arrivé',
    cancelled: 'Annulée',
    unknown: 'Inconnu',
  },

  category: {
    quad: 'Quad',
    sunset: 'Coucher de soleil',
    cave: 'Grotte',
    local: 'Culture locale',
  },

  footer: {
    tagline: 'Timlaline, Maroc · Aventures côtières premium',
    rights: 'Tous droits réservés.',
  },

  errors: {
    generic: 'Une erreur est survenue.',
    network: 'Connexion impossible.',
    retry: 'Réessayer',
    backHome: 'Retour à l’accueil',
  },

  notFound: {
    title: 'Page introuvable',
    text: 'Cette page n’existe pas ou a été déplacée.',
  },
};
