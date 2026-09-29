export default {
  meta: {
    title: 'Visitimlaline — Premium adventures in Timlaline',
    description:
      'Small-group experiences through Timlaline’s caves, coast and golden-hour landscapes, Morocco.',
  },

  nav: {
    experiences: 'Experiences',
    packs: 'Packs',
    book: 'Book now',
    login: 'Team area',
    language: 'Language',
    bookings: 'Bookings',
    notifications: 'Notifications',
    checkIn: 'Check-in',
  },

  common: {
    from: 'From',
    perPerson: '/ person',
    minutes: 'min',
    product: 'Product',
    viewDetails: 'View details',
  },

  home: {
    eyebrow: 'Timlaline · Morocco',
    title: 'Where the Atlantic meets adventure.',
    subtitle:
      'Thoughtful, guide-led experiences through Timlaline’s caves, coast and golden-hour landscapes.',
    ctaExperiences: 'Explore experiences',
    ctaPacks: 'View packs',
    categoryEyebrow: 'By terrain',
    paceEyebrow: 'Choose your pace',
    paceTitle: 'What do you want to experience?',
    storyEyebrow: 'Made for the curious',
    storyTitle: 'One place. Many ways to feel it.',
    storyText:
      'Ride the coastal tracks, enter the caves, linger for sunset or share the Moroccan table. Book a single experience or move through Timlaline with a pack.',
    storyCta: 'Check availability',
    packEyebrow: 'Curated combinations',
    packTitle: 'Go further with a pack.',
  },

  experiences: {
    eyebrow: 'All experiences',
    title: 'Find your Timlaline.',
    lead:
      'Small-group experiences designed around the coast, the landscape and the rhythm of the day.',
    all: 'All',
    empty: 'No experience in this category.',
  },

  activity: {
    included: 'What’s included',
    goodToKnow: 'Good to know',
    itinerary: 'Your experience',
    gallery: 'Gallery',
    relatedTitle: 'You may also like',
    checkAvailability: 'Check availability',
    backToExperiences: 'All experiences',
  },

  packs: {
    eyebrow: 'Curated combinations',
    title: 'More Timlaline, together.',
    lead:
      'Real bookable combinations designed to make a full morning, afternoon or day of the coast.',
    choose: 'Book this pack',
  },

  booking: {
    eyebrow: 'Book an experience',
    title: 'Start your adventure.',
    typeLabel: 'What do you want to book?',
    typeActivity: 'An experience',
    typePack: 'A pack',
    chooseActivity: 'Choose an experience',
    choosePack: 'Choose a pack',
    date: 'Date',
    dateHint: 'Choose an upcoming date',
    guests: 'Number of travellers',
    guestsHint: 'Up to 8 travellers per booking',
    slot: 'Available time',
    slotLoading: 'Checking availability…',
    slotEmpty: 'No time slot available on that day.',
    slotRemaining: '{count} place(s) left',
    slotFull: 'Full',
    detailsTitle: 'Your details',
    fullName: 'Full name',
    email: 'Email',
    phone: 'Phone (WhatsApp)',
    phoneHint: 'We only call if we really need to',
    summary: 'Summary',
    summaryActivity: 'Experience',
    summaryPack: 'Pack',
    total: 'Estimated total',
    paymentNote: 'Payment is made on site, on arrival.',
    submit: 'Confirm booking',
    submitting: 'Sending…',
    successTitle: 'Booking confirmed.',
    successText:
      'Show the reference and access code below when you arrive.',
    anotherBooking: 'Make another booking',
    errorNetwork: 'Connection failed. Check your network.',
    errorGeneric: 'The booking failed. Please try again.',
    errorFull: 'This time slot is full.',
    errorDuplicate: 'An identical booking already exists.',
  },

  field: {
    activity: 'Choose an experience or a pack.',
    customerName: 'Full name is required.',
    email: 'Invalid email address.',
    phone: 'Phone number is required.',
    date: 'Invalid date (use YYYY-MM-DD).',
    time: 'Invalid time slot.',
    guests: 'The number of travellers must be between 1 and 8.',
    both: 'Choose either an experience or a pack.',
  },

  ticket: {
    eyebrow: 'My ticket',
    title: 'Find your booking.',
    lead:
      'Enter the reference and the access code you received when booking.',
    reference: 'Booking reference',
    code: 'Access code',
    lookup: 'Show my ticket',
    looking: 'Searching…',
    invalid: 'Wrong reference or access code.',
    checkInHint: 'Show this code or the QR at the entrance.',
    qrAlt: 'Check-in QR code for booking {reference}',
    print: 'Print / save as PDF',
    newBooking: 'New booking',
  },

  login: {
    title: 'Team area',
    lead: 'Sign in to manage bookings and arrivals.',
    email: 'Email',
    password: 'Password',
    submit: 'Sign in',
    submitting: 'Signing in…',
    invalid: 'Wrong email or password.',
    inactive: 'This account is disabled.',
    failed: 'Sign-in failed. Please try again.',
  },

  backoffice: {
    welcome: 'Hello, {name}',
    signOut: 'Sign out',
  },

  adminBookings: {
    title: 'Bookings',
    lead: 'Every booking, filterable by status and by product.',
    filters: 'Filters',
    status: 'Status',
    product: 'Product',
    allStatuses: 'All statuses',
    allProducts: 'All products',
    clear: 'Clear filters',
    reference: 'Reference',
    customer: 'Customer',
    when: 'Date',
    guests: 'Guests',
    total: 'Total',
    actions: 'Actions',
    arrivedAt: 'Checked in at',
    empty: 'No booking for these filters.',
    selectBooking:
      'Select a row to see its details and act on the booking.',
    detail: 'Booking details',
    maskedCode: 'Access code hidden for security',
    cancel: 'Cancel booking',
    cancelConfirm: 'Cancel this booking?',
    cancelDone: 'Booking cancelled.',
    cancelError: 'The booking could not be cancelled.',
    rescheduleTitle: 'New date and time',
    newDate: 'New date',
    newTime: 'New time',
    save: 'Save',
    rescheduleDone: 'Booking rescheduled.',
    rescheduleError: 'The booking could not be rescheduled.',
    locked: 'Closed booking: this action is unavailable.',
  },

  notifications: {
    title: 'Notifications',
    lead: 'Arrival alerts generated by check-ins.',
    all: 'All',
    unread: 'Unread',
    read: 'Read',
    markRead: 'Mark as read',
    markUnread: 'Mark as unread',
    empty: 'No notification.',
    createdAt: 'Received on {time}',
  },

  checkIn: {
    title: 'Guest arrival',
    lead:
      'Enter the guest’s booking reference and access code to record their arrival.',
    submit: 'Record arrival',
    submitting: 'Recording…',
    success: 'Arrival recorded.',
    already:
      'This booking is closed: already checked in or cancelled.',
    notFound: 'Booking not found.',
    failed: 'Could not record the arrival.',
    scanStart: 'Scan the ticket QR',
    scanStop: 'Stop scanning',
    scanHint:
      'Point the camera at the QR on the guest’s ticket, or type the code below.',
    badQr:
      'That QR is not a Visitimlaline ticket. Type the reference and access code instead.',
    cameraError:
      'The camera is unavailable here. Type the reference and access code instead.',
  },

  status: {
    notPaidYet: 'Not paid yet',
    arrived: 'Arrived',
    cancelled: 'Cancelled',
    unknown: 'Unknown',
  },

  category: {
    quad: 'Quad',
    sunset: 'Sunset',
    cave: 'Cave',
    local: 'Local culture',
  },

  footer: {
    tagline: 'Timlaline, Morocco · Premium coastal adventures',
    rights: 'All rights reserved.',
  },

  errors: {
    generic: 'Something went wrong.',
    network: 'Connection failed.',
    retry: 'Try again',
    backHome: 'Back to home',
  },

  notFound: {
    title: 'Page not found',
    text: 'This page does not exist or has been moved.',
  },
};
