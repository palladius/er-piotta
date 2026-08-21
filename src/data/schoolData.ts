export interface DutyInfo {
  parent: 'mamma' | 'papa';
  parentName: string;
  badgeColor: string;
  tagColor: string;
  notes: string;
  afternoonCare?: string;
}

export interface SubjectSlot {
  time: string;
  subject: string;
  teacher?: string;
  location?: string;
  notes?: string;
  badgeBg?: string;
}

export interface DaySchedule {
  dayKey: string;
  dayName: string;
  emoji: string;
  dropOff: string;
  pickUp: string;
  duty: DutyInfo;
  gearAndDeadlines: {
    icon: string;
    text: string;
    urgent?: boolean;
  }[];
  schedule: SubjectSlot[];
}

export interface ChildData {
  id: 'ale' | 'sebi';
  name: string;
  nickname: string;
  grade: string;
  classTeacher: string;
  avatarEmoji: string;
  avatarBg: string;
  borderColor: string;
  themeColor: string;
  quote: string;
  days: Record<string, DaySchedule>;
}

export const PARENT_DUTIES: Record<string, DutyInfo> = {
  monday: {
    parent: 'mamma',
    parentName: '🟣 Mamma (Kate)',
    badgeColor: 'bg-purple-600 text-white',
    tagColor: 'border-purple-300 bg-purple-50 text-purple-900',
    notes: 'La Mamma porta a scuola e gestisce il rientro'
  },
  tuesday: {
    parent: 'mamma',
    parentName: '🟣 Mamma (Kate)',
    badgeColor: 'bg-purple-600 text-white',
    tagColor: 'border-purple-300 bg-purple-50 text-purple-900',
    notes: 'La Mamma porta a scuola e gestisce il rientro'
  },
  wednesday: {
    parent: 'papa',
    parentName: '🟡 Papà (Riccardo)',
    badgeColor: 'bg-amber-500 text-slate-900 font-bold',
    tagColor: 'border-amber-300 bg-amber-50 text-amber-950',
    notes: 'Il Papà porta al mattino. Uscita ore 12:30!',
    afternoonCare: '🏠 Pomeriggio con Silvana!'
  },
  thursday: {
    parent: 'papa',
    parentName: '🟡 Papà (Riccardo)',
    badgeColor: 'bg-amber-500 text-slate-900 font-bold',
    tagColor: 'border-amber-300 bg-amber-50 text-amber-950',
    notes: 'Il Papà porta a scuola e gestisce il rientro'
  },
  friday: {
    parent: 'mamma',
    parentName: '🟣 Mamma (Kate)',
    badgeColor: 'bg-purple-600 text-white',
    tagColor: 'border-purple-300 bg-purple-50 text-purple-900',
    notes: 'La Mamma porta a scuola e gestisce il rientro'
  }
};

export const ALESSANDRO_DATA: ChildData = {
  id: 'ale',
  name: 'Alessandro Carlesso',
  nickname: 'Ale',
  grade: 'Primary 3 (Tandem IMS)',
  classTeacher: 'Herr Marvin Biehl (DE) & Mr Dannie Keates (EN)',
  avatarEmoji: '👦',
  avatarBg: 'bg-gradient-to-br from-blue-500 to-indigo-700',
  borderColor: 'border-blue-500',
  themeColor: 'indigo',
  quote: 'Matematica con Wochenplan & Sport al Kartaus!',
  days: {
    monday: {
      dayKey: 'monday',
      dayName: 'Lunedì',
      emoji: '🟡',
      dropOff: '08:15 – 08:30',
      pickUp: '15:55',
      duty: PARENT_DUTIES.monday,
      gearAndDeadlines: [
        { icon: '📐', text: 'Inizio Wochenplan di Matematica (ritirare schede in classe)' },
        { icon: '🇫🇷', text: 'Quaderno di Francese (Les Loustics)' },
        { icon: '✏️', text: 'Astuccio completo (almeno 2 matite, gomma, temperino)' }
      ],
      schedule: [
        { time: '08:30 – 10:05', subject: 'Deutsch (Doppia ora)', teacher: 'M. Biehl', location: 'Aula P3', notes: 'Lehrplan 21 Hören & Schreiben' },
        { time: '10:50 – 11:35', subject: 'Mathematik', teacher: 'M. Biehl', location: 'Aula P3', notes: 'Number & Algebra' },
        { time: '11:40 – 12:25', subject: 'Art History', teacher: 'Mrs Schmid', location: 'Art Studio', notes: 'Studio colori e forme' },
        { time: '13:50 – 15:35', subject: 'French (Doppia ora)', teacher: 'Mme Conde', location: 'Lang Lab', notes: 'Les Loustics' },
        { time: '15:35 – 15:55', subject: 'Homework Period', teacher: 'M. Biehl', location: 'Aula P3', notes: 'Compiti del giorno in tedesco' }
      ]
    },
    tuesday: {
      dayKey: 'tuesday',
      dayName: 'Martedì',
      emoji: '🔴',
      dropOff: '08:15 – 08:30',
      pickUp: '15:55',
      duty: PARENT_DUTIES.tuesday,
      gearAndDeadlines: [
        { icon: '🔢', text: 'Avanzamento Wochenplan di Matematica' },
        { icon: '🍽️', text: 'Mensa & Ricreazione sorvegliata da Dannie' }
      ],
      schedule: [
        { time: '08:30 – 10:05', subject: 'Mathematik (Doppia ora)', teacher: 'M. Biehl', location: 'Aula P3', notes: 'Geometria & Calcolo' },
        { time: '10:50 – 12:25', subject: 'Deutsch (Doppia ora)', teacher: 'M. Biehl', location: 'Aula P3', notes: 'Grammatica e ortografia' },
        { time: '13:50 – 15:35', subject: 'Enquiry (DE/EN)', teacher: 'Biehl / Keates', location: 'Aula P3', notes: 'Scienze, Energy & Zurich City' },
        { time: '15:35 – 15:55', subject: 'Homework Period', teacher: 'M. Biehl', location: 'Aula P3', notes: 'Studio guidato' }
      ]
    },
    wednesday: {
      dayKey: 'wednesday',
      dayName: 'Mercoledì (Mezza Giornata)',
      emoji: '🟢',
      dropOff: '08:15 – 08:30',
      pickUp: '12:30 (Uscita anticipata!)',
      duty: PARENT_DUTIES.wednesday,
      gearAndDeadlines: [
        { icon: '📚', text: 'Scambio libro di lettura settimanale / Biblioteca', urgent: true },
        { icon: '🏠', text: 'POMERIGGIO CON SILVANA dalle 12:30 a casa!', urgent: true }
      ],
      schedule: [
        { time: '08:30 – 09:15', subject: 'Deutsch', teacher: 'M. Biehl', location: 'Aula P3', notes: 'Lettura e dialogo' },
        { time: '09:20 – 10:05', subject: 'Mathematik', teacher: 'M. Biehl', location: 'Aula P3', notes: 'Wochenplan check' },
        { time: '10:50 – 11:35', subject: 'Enquiry', teacher: 'D. Keates', location: 'Aula P3', notes: 'Roman Times & Ecosystems' },
        { time: '11:40 – 12:25', subject: 'Music (Tedesco)', teacher: 'Music Staff', location: 'Music Room', notes: 'Canto ed espressione musicale' }
      ]
    },
    thursday: {
      dayKey: 'thursday',
      dayName: 'Giovedì',
      emoji: '🔵',
      dropOff: '08:15 – 08:30',
      pickUp: '15:55',
      duty: PARENT_DUTIES.thursday,
      gearAndDeadlines: [
        { icon: '👟', text: 'PREPARARE SACCA SPORT PER DOMANI (Palestra Kartaus)', urgent: true },
        { icon: '🎨', text: 'Verificare presenza grembiule pittura a scuola' },
        { icon: '📖', text: 'Lettura libro Fantastic Mr Fox (Roald Dahl)' }
      ],
      schedule: [
        { time: '08:30 – 09:15', subject: 'French', teacher: 'Mme Conde', location: 'Lang Lab', notes: 'Conversazione & vocaboli' },
        { time: '09:20 – 10:05', subject: 'Maths / Mathematik', teacher: 'Keates / Biehl', location: 'Aula P3', notes: 'Gruppi bilingue' },
        { time: '10:50 – 12:25', subject: 'English / Deutsch', teacher: 'Keates / Biehl', location: 'Aula P3', notes: 'UK Curriculum English' },
        { time: '13:50 – 15:35', subject: 'Enquiry & Music (EN)', teacher: 'D. Keates', location: 'Aula P3', notes: 'Progetti pratici in inglese' },
        { time: '15:35 – 15:55', subject: 'Homework Period (EN)', teacher: 'D. Keates', location: 'Aula P3', notes: 'Grammar & spelling check' }
      ]
    },
    friday: {
      dayKey: 'friday',
      dayName: 'Venerdì (Sport & Arte)',
      emoji: '🟣',
      dropOff: '08:15 – 08:30',
      pickUp: '15:55',
      duty: PARENT_DUTIES.friday,
      gearAndDeadlines: [
        { icon: '👟', text: 'PORTARE SACCA SPORT & SCARPE DA GINNASTICA (Palestra Kartaus)', urgent: true },
        { icon: '🎨', text: 'PAINT SHIRT / Grembiule da pittura per arte tessile (Lucy Sparrow)', urgent: true },
        { icon: '⏰', text: 'CONSEGNA TASSATIVA WOCHENPLAN DI MATEMATICA!', urgent: true }
      ],
      schedule: [
        { time: '08:30 – 10:05', subject: 'English (Doppia ora)', teacher: 'D. Keates', location: 'Aula P3', notes: 'Writing samples & reading' },
        { time: '10:10 – 11:35', subject: 'SPORT / PE (Turnhalle Kartaus)', teacher: 'Coach', location: 'Turnhalle Kartaus', notes: '👟 Kit ginnastica e scarpe pulite' },
        { time: '11:40 – 12:25', subject: 'English', teacher: 'D. Keates', location: 'Aula P3', notes: 'Comprehension & Collins book' },
        { time: '13:50 – 15:35', subject: 'ART (Tessile & Cucito)', teacher: 'Mrs Schmid', location: 'Art Studio', notes: '🎨 Paint shirt obbligatoria' },
        { time: '15:35 – 15:55', subject: 'Consegna Wochenplan', teacher: 'M. Biehl', location: 'Aula P3', notes: '⏰ Verifica finale schede di matematica' }
      ]
    }
  }
};

export const SEBASTIAN_DATA: ChildData = {
  id: 'sebi',
  name: 'Sebastian Carlesso',
  nickname: 'Sebi',
  grade: 'Primary 1 (Tandem IMS)',
  classTeacher: 'Ms Faux & Ms Rayment',
  avatarEmoji: '🧒',
  avatarBg: 'bg-gradient-to-br from-emerald-500 to-teal-700',
  borderColor: 'border-emerald-500',
  themeColor: 'emerald',
  quote: 'Primi passi, fonetica inglese, movimento e scoperte!',
  days: {
    monday: {
      dayKey: 'monday',
      dayName: 'Lunedì',
      emoji: '🟡',
      dropOff: '08:15 – 08:30',
      pickUp: '15:55',
      duty: PARENT_DUTIES.monday,
      gearAndDeadlines: [
        { icon: '🎒', text: 'Controllo cartellina P1 inizio settimana' },
        { icon: '📖', text: 'Libretto di lettura fonetica' },
        { icon: '✏️', text: 'Matite e colori P1' }
      ],
      schedule: [
        { time: '08:30 – 10:05', subject: 'Phonics & Early English', teacher: 'Ms Rayment', location: 'Aula P1', notes: 'Letters, sounds & vocabulary' },
        { time: '10:50 – 11:35', subject: 'Deutsch Frühförderung', teacher: 'Ms Faux', location: 'Aula P1', notes: 'Spielen & Sprechen' },
        { time: '11:40 – 12:25', subject: 'Early Maths & Numbers', teacher: 'Ms Rayment', location: 'Aula P1', notes: 'Counting & basic shapes' },
        { time: '13:50 – 15:35', subject: 'Topic & Storytime', teacher: 'Team P1', location: 'Aula P1', notes: 'Racconti illustrati & scoperta' },
        { time: '15:35 – 15:55', subject: 'Wrap-up & Pack', teacher: 'Team P1', location: 'Aula P1', notes: 'Sistemazione zainetti' }
      ]
    },
    tuesday: {
      dayKey: 'tuesday',
      dayName: 'Martedì',
      emoji: '🔴',
      dropOff: '08:15 – 08:30',
      pickUp: '15:55',
      duty: PARENT_DUTIES.tuesday,
      gearAndDeadlines: [
        { icon: '🔢', text: 'Schede numeri e forme da ripassare' },
        { icon: '🍎', text: 'Snack sano per la ricreazione' }
      ],
      schedule: [
        { time: '08:30 – 10:05', subject: 'Early Maths & Logic', teacher: 'Ms Rayment', location: 'Aula P1', notes: 'Giochi di logica e numeri' },
        { time: '10:50 – 12:25', subject: 'Deutsch & Singen', teacher: 'Ms Faux', location: 'Aula P1', notes: 'Canzoni e parole in tedesco' },
        { time: '13:50 – 15:35', subject: 'Discovery & Nature', teacher: 'Team P1', location: 'Aula / Giardino', notes: 'Esplorazione all aperto' },
        { time: '15:35 – 15:55', subject: 'Story Listening', teacher: 'Ms Rayment', location: 'Angolo Lettura', notes: 'Ascolto fiaba' }
      ]
    },
    wednesday: {
      dayKey: 'wednesday',
      dayName: 'Mercoledì (Mezza Giornata)',
      emoji: '🟢',
      dropOff: '08:15 – 08:30',
      pickUp: '12:30 (Uscita anticipata!)',
      duty: PARENT_DUTIES.wednesday,
      gearAndDeadlines: [
        { icon: '📚', text: 'SCAMBIO LIBRO DI LETTURA SETTIMANALE P1', urgent: true },
        { icon: '🏠', text: 'POMERIGGIO CON SILVANA dalle 12:30 a casa con Ale!', urgent: true }
      ],
      schedule: [
        { time: '08:30 – 09:15', subject: 'Deutsch & Geschichten', teacher: 'Ms Faux', location: 'Aula P1', notes: 'Storie in tedesco' },
        { time: '09:20 – 10:05', subject: 'English Phonics', teacher: 'Ms Rayment', location: 'Aula P1', notes: 'Suoni e lettere' },
        { time: '10:50 – 11:35', subject: 'Movement & Rhythm', teacher: 'Team P1', location: 'Palestra Piccola', notes: 'Movimento e coordinazione' },
        { time: '11:40 – 12:25', subject: 'Singing & Music', teacher: 'Music Staff', location: 'Music Room', notes: 'Musica per i più piccoli' }
      ]
    },
    thursday: {
      dayKey: 'thursday',
      dayName: 'Giovedì (Sport P1)',
      emoji: '🔵',
      dropOff: '08:15 – 08:30',
      pickUp: '15:55',
      duty: PARENT_DUTIES.thursday,
      gearAndDeadlines: [
        { icon: '👟', text: 'PORTARE KIT SPORT P1 (Scarpe ginnastica comode)', urgent: true },
        { icon: '🎨', text: 'Verificare grembiulino pittura nell armadietto' }
      ],
      schedule: [
        { time: '08:30 – 09:15', subject: 'SPORT & Movement P1', teacher: 'Coach', location: 'Turnhalle', notes: '👟 Scarpe da ginnastica' },
        { time: '09:20 – 10:05', subject: 'English Phonics', teacher: 'Ms Rayment', location: 'Aula P1', notes: 'Lettura guidata' },
        { time: '10:50 – 12:25', subject: 'Deutsch Spiele', teacher: 'Ms Faux', location: 'Aula P1', notes: 'Attività bilingue' },
        { time: '13:50 – 15:35', subject: 'Arts & Craft', teacher: 'Team P1', location: 'Art Corner', notes: 'Disegno e manipolazione' },
        { time: '15:35 – 15:55', subject: 'Daily Review', teacher: 'Team P1', location: 'Aula P1', notes: 'Chiusura giornata' }
      ]
    },
    friday: {
      dayKey: 'friday',
      dayName: 'Venerdì (Craft & Weekend)',
      emoji: '🟣',
      dropOff: '08:15 – 08:30',
      pickUp: '15:55',
      duty: PARENT_DUTIES.friday,
      gearAndDeadlines: [
        { icon: '🎨', text: 'Grembiulino per pittura & lavoretti', urgent: true },
        { icon: '🧸', text: 'Show & Tell (se concordato con le maestre)' },
        { icon: '🎒', text: 'Svuotare zaino per il weekend!' }
      ],
      schedule: [
        { time: '08:30 – 10:05', subject: 'Deutsch & Kreatives', teacher: 'Ms Faux', location: 'Aula P1', notes: 'Attività creative in tedesco' },
        { time: '10:50 – 11:35', subject: 'English Storytelling', teacher: 'Ms Rayment', location: 'Angolo Morbido', notes: 'Storie & filastrocche' },
        { time: '11:40 – 12:25', subject: 'Early Math Games', teacher: 'Ms Rayment', location: 'Aula P1', notes: 'Giochi di gruppo con numeri' },
        { time: '13:50 – 15:35', subject: 'Free Play & Construction', teacher: 'Team P1', location: 'Spazio Gioco', notes: 'Costruzioni e creatività' },
        { time: '15:35 – 15:55', subject: 'Weekend Circle', teacher: 'Team P1', location: 'Aula P1', notes: 'Saluto del venerdì' }
      ]
    }
  }
};

export const SCHOOL_EMERGENCIES = {
  officePhone: '043 500 10 30',
  busHotline: '043 500 10 99',
  email: 'zuerich@tandem-ims.ch',
  app: 'Piota Schools App (Er-Piotta)',
  location: 'Zürich Seefeld'
};
