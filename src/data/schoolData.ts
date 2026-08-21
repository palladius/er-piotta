export interface DutyInfo {
  parent: 'mamma' | 'papa';
  parentNameIt: string;
  parentNameEn: string;
  notesIt: string;
  notesEn: string;
  afternoonCareIt?: string;
  afternoonCareEn?: string;
}

export interface TimeSlot {
  time: string;
  type: 'lesson' | 'break' | 'lunch' | 'dismissal' | 'afternoon_home';
  subjectIt: string;
  subjectEn: string;
  teacher?: string;
  location?: string;
  notesIt?: string;
  notesEn?: string;
  isSpecial?: boolean;
}

export interface ChecklistItem {
  type: 'backpack' | 'homework' | 'deadline';
  when: 'morning' | 'evening_before' | 'in_class';
  icon: string;
  categoryLabelIt: string;
  categoryLabelEn: string;
  textIt: string;
  textEn: string;
  target: 'parent' | 'child' | 'both';
  urgent?: boolean;
}

export interface DaySchedule {
  dayKey: string;
  dayNameIt: string;
  dayNameEn: string;
  emoji: string;
  dropOff: string;
  pickUpIt: string;
  pickUpEn: string;
  duty: DutyInfo;
  checklist: ChecklistItem[];
  schedule: TimeSlot[];
}

export interface ChildData {
  id: 'ale' | 'sebi';
  name: string;
  nickname: string;
  gradeIt: string;
  gradeEn: string;
  classTeacher: string;
  avatarEmoji: string;
  avatarBg: string;
  avatarImg?: string;
  pdfUrl: string;
  pdfLabelIt: string;
  pdfLabelEn: string;
  days: Record<string, DaySchedule>;
}

export const PARENT_DUTIES: Record<string, DutyInfo> = {
  monday: {
    parent: 'mamma',
    parentNameIt: '🟣 Mamma (Kate)',
    parentNameEn: '🟣 Mum (Kate)',
    notesIt: 'La Mamma porta a scuola e gestisce il rientro',
    notesEn: 'Mum handles morning drop-off & afternoon pick-up'
  },
  tuesday: {
    parent: 'mamma',
    parentNameIt: '🟣 Mamma (Kate)',
    parentNameEn: '🟣 Mum (Kate)',
    notesIt: 'La Mamma porta a scuola e gestisce il rientro',
    notesEn: 'Mum handles morning drop-off & afternoon pick-up'
  },
  wednesday: {
    parent: 'papa',
    parentNameIt: '🟡 Papà (Riccardo)',
    parentNameEn: '🟡 Dad (Riccardo)',
    notesIt: 'Il Papà porta al mattino. Uscita ore 12:30!',
    notesEn: 'Dad handles morning drop-off. Early dismissal at 12:30!',
    afternoonCareIt: '🏠 Pomeriggio con Silvana!',
    afternoonCareEn: '🏠 Afternoon with Silvana!'
  },
  thursday: {
    parent: 'papa',
    parentNameIt: '🟡 Papà (Riccardo)',
    parentNameEn: '🟡 Dad (Riccardo)',
    notesIt: 'Il Papà porta a scuola e gestisce il rientro',
    notesEn: 'Dad handles morning drop-off & afternoon pick-up'
  },
  friday: {
    parent: 'mamma',
    parentNameIt: '🟣 Mamma (Kate)',
    parentNameEn: '🟣 Mum (Kate)',
    notesIt: 'La Mamma porta a scuola e gestisce il rientro',
    notesEn: 'Mum handles morning drop-off & afternoon pick-up'
  }
};

export const ALESSANDRO_DATA: ChildData = {
  id: 'ale',
  name: 'Alessandro Carlesso',
  nickname: 'Ale',
  gradeIt: 'Primary 3 (Tandem IMS)',
  gradeEn: 'Primary 3 (Tandem IMS)',
  classTeacher: 'Herr Marvin Biehl (DE) & Mr Dannie Keates (EN)',
  avatarEmoji: '👦',
  avatarBg: 'bg-gradient-to-br from-blue-500 to-indigo-700',
  avatarImg: '/avatars/avatar_ale_circle_transparent.png',
  pdfUrl: '/docs/Primary-3-Info-Evening-Tandem.pdf',
  pdfLabelIt: 'Scarica PDF Ufficiale Primary 3 (Info Evening & Orari)',
  pdfLabelEn: 'Download Official Primary 3 PDF (Info Evening & Schedule)',
  days: {
    monday: {
      dayKey: 'monday',
      dayNameIt: 'Lunedì',
      dayNameEn: 'Monday',
      emoji: '🟡',
      dropOff: '08:15 – 08:30',
      pickUpIt: '15:55',
      pickUpEn: '15:55',
      duty: PARENT_DUTIES.monday,
      checklist: [
        {
          type: 'backpack',
          when: 'morning',
          icon: '🎒',
          categoryLabelIt: 'Zaino (Mattina)',
          categoryLabelEn: 'Bag (Morning)',
          target: 'parent',
          textIt: 'Astuccio completo (almeno 2 matite, gomma, temperino)',
          textEn: 'Complete pencil case (at least 2 pencils, eraser, sharpener)'
        },
        {
          type: 'backpack',
          when: 'morning',
          icon: '🇫🇷',
          categoryLabelIt: 'Zaino (Mattina)',
          categoryLabelEn: 'Bag (Morning)',
          target: 'parent',
          textIt: 'Quaderno di Francese (Les Loustics)',
          textEn: 'French notebook (Les Loustics)'
        },
        {
          type: 'homework',
          when: 'evening_before',
          icon: '🌙',
          categoryLabelIt: 'Compiti (Sera Prima)',
          categoryLabelEn: 'Homework (Night Before)',
          target: 'child',
          textIt: 'Organizzare schede Wochenplan di Matematica della settimana',
          textEn: 'Plan week math worksheets (Wochenplan)'
        }
      ],
      schedule: [
        { time: '08:30 – 10:05', type: 'lesson', subjectIt: 'Deutsch (Doppia ora)', subjectEn: 'German (Double period)', teacher: 'M. Biehl', location: 'Classroom P3', notesIt: 'Lehrplan 21 Hören & Schreiben', notesEn: 'Lehrplan 21 Listening & Writing' },
        { time: '10:05 – 10:50', type: 'break', subjectIt: '☕ Ricreazione Mattino & Snack', subjectEn: '☕ Morning Break & Snack', notesIt: 'Pausa nel cortile della scuola', notesEn: 'Playground snack & fresh air' },
        { time: '10:50 – 11:35', type: 'lesson', subjectIt: 'Mathematik', subjectEn: 'Maths', teacher: 'M. Biehl', location: 'Classroom P3', notesIt: 'Number & Algebra', notesEn: 'Number & Algebra' },
        { time: '11:40 – 12:25', type: 'lesson', subjectIt: 'Art History', subjectEn: 'Art History', teacher: 'Mrs Schmid', location: 'Art Studio', notesIt: 'Studio colori e forme', notesEn: 'Colors & shapes study' },
        { time: '12:25 – 13:50', type: 'lunch', subjectIt: '🍽️ Pranzo & Mensa a Scuola', subjectEn: '🍽️ School Lunch & Play', notesIt: 'Mensa scolastica sorvegliata', notesEn: 'Supervised lunch & recess' },
        { time: '13:50 – 15:35', type: 'lesson', subjectIt: 'French (Doppia ora)', subjectEn: 'French (Double period)', teacher: 'Mme Conde', location: 'Lang Lab', notesIt: 'Les Loustics', notesEn: 'Les Loustics program' },
        { time: '15:35 – 15:55', type: 'dismissal', subjectIt: 'Homework Period & Uscita (15:55)', subjectEn: 'Homework Period & Dismissal (15:55)', teacher: 'M. Biehl', notesIt: 'Compiti del giorno in tedesco', notesEn: 'Daily homework in German' }
      ]
    },
    tuesday: {
      dayKey: 'tuesday',
      dayNameIt: 'Martedì',
      dayNameEn: 'Tuesday',
      emoji: '🔴',
      dropOff: '08:15 – 08:30',
      pickUpIt: '15:55',
      pickUpEn: '15:55',
      duty: PARENT_DUTIES.tuesday,
      checklist: [
        {
          type: 'backpack',
          when: 'morning',
          icon: '🍎',
          categoryLabelIt: 'Zaino (Mattina)',
          categoryLabelEn: 'Bag (Morning)',
          target: 'parent',
          textIt: 'Merenda sana per la ricreazione + bottiglietta',
          textEn: 'Healthy snack for morning recess + water bottle'
        },
        {
          type: 'homework',
          when: 'evening_before',
          icon: '🌙',
          categoryLabelIt: 'Compiti (Sera Prima)',
          categoryLabelEn: 'Homework (Night Before)',
          target: 'child',
          textIt: 'Avanzamento 15-20 min schede Wochenplan di Matematica',
          textEn: 'Work 15-20 mins on Maths Wochenplan sheets'
        }
      ],
      schedule: [
        { time: '08:30 – 10:05', type: 'lesson', subjectIt: 'Mathematik (Doppia ora)', subjectEn: 'Maths (Double period)', teacher: 'M. Biehl', location: 'Classroom P3', notesIt: 'Geometria & Calcolo', notesEn: 'Geometry & Calculation' },
        { time: '10:05 – 10:50', type: 'break', subjectIt: '☕ Ricreazione Mattino & Snack', subjectEn: '☕ Morning Break & Snack', notesIt: 'Pausa ricreazione', notesEn: 'Recess & snack' },
        { time: '10:50 – 12:25', type: 'lesson', subjectIt: 'Deutsch (Doppia ora)', subjectEn: 'German (Double period)', teacher: 'M. Biehl', location: 'Classroom P3', notesIt: 'Grammatica e ortografia', notesEn: 'Grammar and spelling' },
        { time: '12:25 – 13:50', type: 'lunch', subjectIt: '🍽️ Pranzo & Mensa a Scuola', subjectEn: '🍽️ School Lunch & Play', notesIt: 'Sorvegliata da Dannie', notesEn: 'Supervised by Dannie' },
        { time: '13:50 – 15:35', type: 'lesson', subjectIt: 'Enquiry (DE/EN)', subjectEn: 'Enquiry (DE/EN)', teacher: 'Biehl / Keates', location: 'Classroom P3', notesIt: 'Scienze, Energy & Zurich City', notesEn: 'Science, Energy & Zurich City' },
        { time: '15:35 – 15:55', type: 'dismissal', subjectIt: 'Homework Period & Uscita (15:55)', subjectEn: 'Homework Period & Dismissal (15:55)', teacher: 'M. Biehl', notesIt: 'Studio guidato', notesEn: 'Guided study' }
      ]
    },
    wednesday: {
      dayKey: 'wednesday',
      dayNameIt: 'Mercoledì (Mezza Giornata)',
      dayNameEn: 'Wednesday (Half Day)',
      emoji: '🟢',
      dropOff: '08:15 – 08:30',
      pickUpIt: '12:30 (Uscita anticipata!)',
      pickUpEn: '12:30 (Early finish!)',
      duty: PARENT_DUTIES.wednesday,
      checklist: [
        {
          type: 'backpack',
          when: 'morning',
          icon: '📚',
          categoryLabelIt: 'Zaino (Mattina)',
          categoryLabelEn: 'Bag (Morning)',
          target: 'parent',
          urgent: true,
          textIt: 'Infilare nello zaino il libro di lettura da scambiare in biblioteca',
          textEn: 'Pack weekly reading book to exchange at school library'
        },
        {
          type: 'backpack',
          when: 'morning',
          icon: '🏠',
          categoryLabelIt: 'Pomeriggio',
          categoryLabelEn: 'Afternoon',
          target: 'parent',
          urgent: true,
          textIt: 'Uscita ore 12:30: Pranzo con Papà & Pomeriggio con Silvana!',
          textEn: 'Pick-up at 12:30: Lunch with Dad & Afternoon with Silvana!'
        },
        {
          type: 'homework',
          when: 'evening_before',
          icon: '🌙',
          categoryLabelIt: 'Compiti (Sera Prima)',
          categoryLabelEn: 'Homework (Night Before)',
          target: 'child',
          textIt: 'Lettura 15 min libro inglese & controllo Wochenplan',
          textEn: '15 mins English reading & check Wochenplan progress'
        }
      ],
      schedule: [
        { time: '08:30 – 09:15', type: 'lesson', subjectIt: 'Deutsch', subjectEn: 'German', teacher: 'M. Biehl', location: 'Classroom P3', notesIt: 'Lettura e dialogo', notesEn: 'Reading and dialogue' },
        { time: '09:20 – 10:05', type: 'lesson', subjectIt: 'Mathematik', subjectEn: 'Maths', teacher: 'M. Biehl', location: 'Classroom P3', notesIt: 'Wochenplan check', notesEn: 'Wochenplan progress check' },
        { time: '10:05 – 10:50', type: 'break', subjectIt: '☕ Ricreazione Mattino & Snack', subjectEn: '☕ Morning Break & Snack', notesIt: 'Pausa ricreazione', notesEn: 'Recess & snack' },
        { time: '10:50 – 11:35', type: 'lesson', subjectIt: 'Enquiry', subjectEn: 'Enquiry', teacher: 'D. Keates', location: 'Classroom P3', notesIt: 'Roman Times & Ecosystems', notesEn: 'Roman Times & Ecosystems' },
        { time: '11:40 – 12:25', type: 'lesson', subjectIt: 'Music (Tedesco)', subjectEn: 'Music (German)', teacher: 'Music Staff', location: 'Music Room', notesIt: 'Canto ed espressione musicale', notesEn: 'Singing & musical expression' },
        { time: '12:30', type: 'lunch', isSpecial: true, subjectIt: '🏠 12:30 USCITA ANTICIPATA & PRANZO A CASA CON PAPÀ! 👨‍👦‍👦', subjectEn: '🏠 12:30 EARLY FINISH & LUNCH AT HOME WITH DAD! 👨‍👦‍👦', notesIt: 'Nessuna mensa a scuola. Si pranza tutti a casa!', notesEn: 'No school lunch. Family lunch at home!' },
        { time: '13:50 – 15:55', type: 'afternoon_home', isSpecial: true, subjectIt: '🏠 Pomeriggio a Casa con Silvana & Relax', subjectEn: '🏠 Afternoon at Home with Silvana', notesIt: '16:10–17:25: Ale Drama Club (Simply Theatre Studios Zurigo)', notesEn: '16:10–17:25: Ale Drama Club (Simply Theatre Studios Zurich)' }
      ]
    },
    thursday: {
      dayKey: 'thursday',
      dayNameIt: 'Giovedì',
      dayNameEn: 'Thursday',
      emoji: '🔵',
      dropOff: '08:15 – 08:30',
      pickUpIt: '15:55',
      pickUpEn: '15:55',
      duty: PARENT_DUTIES.thursday,
      checklist: [
        {
          type: 'backpack',
          when: 'evening_before',
          icon: '🎒',
          categoryLabelIt: 'Zaino (Sera Prima)',
          categoryLabelEn: 'Bag (Night Before)',
          target: 'parent',
          urgent: true,
          textIt: 'PREPARARE SACCA SPORT PER DOMANI (Scarpe pulite & kit Kartaus)',
          textEn: 'PREPARE SPORT BAG FOR TOMORROW (Clean trainers & Kartaus kit)'
        },
        {
          type: 'homework',
          when: 'evening_before',
          icon: '🌙',
          categoryLabelIt: 'Compiti (Sera Prima)',
          categoryLabelEn: 'Homework (Night Before)',
          target: 'child',
          urgent: true,
          textIt: 'CHIUDERE TUTTO IL WOCHENPLAN DI MATEMATICA (Consegna domani!)',
          textEn: 'FINISH MATHS WOCHENPLAN (Due tomorrow morning!)'
        },
        {
          type: 'homework',
          when: 'evening_before',
          icon: '📖',
          categoryLabelIt: 'Compiti (Sera Prima)',
          categoryLabelEn: 'Homework (Night Before)',
          target: 'child',
          textIt: 'Lettura libro Fantastic Mr Fox (Roald Dahl)',
          textEn: 'Reading Fantastic Mr Fox book (Roald Dahl)'
        }
      ],
      schedule: [
        { time: '08:30 – 09:15', type: 'lesson', subjectIt: 'French', subjectEn: 'French', teacher: 'Mme Conde', location: 'Lang Lab', notesIt: 'Conversazione & vocaboli', notesEn: 'Conversation & vocabulary' },
        { time: '09:20 – 10:05', type: 'lesson', subjectIt: 'Maths / Mathematik', subjectEn: 'Maths / Mathematik', teacher: 'Keates / Biehl', location: 'Classroom P3', notesIt: 'Gruppi bilingue', notesEn: 'Bilingual ability groups' },
        { time: '10:05 – 10:50', type: 'break', subjectIt: '☕ Ricreazione Mattino & Snack', subjectEn: '☕ Morning Break & Snack', notesIt: 'Pausa ricreazione', notesEn: 'Recess & snack' },
        { time: '10:50 – 12:25', type: 'lesson', subjectIt: 'English / Deutsch', subjectEn: 'English / German', teacher: 'Keates / Biehl', location: 'Classroom P3', notesIt: 'UK Curriculum English', notesEn: 'UK Curriculum English' },
        { time: '12:25 – 13:50', type: 'lunch', subjectIt: '🍽️ Pranzo & Mensa a Scuola', subjectEn: '🍽️ School Lunch & Play', notesIt: 'Mensa e ricreazione', notesEn: 'Supervised lunch & recess' },
        { time: '13:50 – 15:35', type: 'lesson', subjectIt: 'Enquiry & Music (EN)', subjectEn: 'Enquiry & Music (EN)', teacher: 'D. Keates', location: 'Classroom P3', notesIt: 'Progetti pratici in inglese', notesEn: 'Hands-on projects in English' },
        { time: '15:35 – 15:55', type: 'dismissal', subjectIt: 'Homework Period (EN) & Uscita (15:55)', subjectEn: 'Homework Period (EN) & Dismissal (15:55)', teacher: 'D. Keates', notesIt: 'Grammar & spelling check', notesEn: 'Grammar & spelling check' }
      ]
    },
    friday: {
      dayKey: 'friday',
      dayNameIt: 'Venerdì (Sport & Arte)',
      dayNameEn: 'Friday (PE & Art)',
      emoji: '🟣',
      dropOff: '08:15 – 08:30',
      pickUpIt: '15:55',
      pickUpEn: '15:55',
      duty: PARENT_DUTIES.friday,
      checklist: [
        {
          type: 'backpack',
          when: 'morning',
          icon: '🎒',
          categoryLabelIt: 'Zaino (Mattina)',
          categoryLabelEn: 'Bag (Morning)',
          target: 'parent',
          urgent: true,
          textIt: 'PORTARE SACCA SPORT & SCARPE DA GINNASTICA (Palestra Kartaus)',
          textEn: 'BRING SPORT BAG & CLEAN GYM SHOES (Kartaus Gym)'
        },
        {
          type: 'backpack',
          when: 'morning',
          icon: '🎨',
          categoryLabelIt: 'Zaino (Mattina)',
          categoryLabelEn: 'Bag (Morning)',
          target: 'parent',
          urgent: true,
          textIt: 'PAINT SHIRT / Grembiule da pittura per arte tessile',
          textEn: 'PAINT SHIRT / Apron for textile art class'
        },
        {
          type: 'deadline',
          when: 'in_class',
          icon: '⏰',
          categoryLabelIt: 'Consegna a Scuola (Figlio)',
          categoryLabelEn: 'Due Today (Child)',
          target: 'child',
          urgent: true,
          textIt: 'CONSEGNA TASSATIVA WOCHENPLAN DI MATEMATICA al maestro Marvin!',
          textEn: 'HAND IN MATHS WOCHENPLAN to Mr Marvin!'
        }
      ],
      schedule: [
        { time: '08:30 – 10:05', type: 'lesson', subjectIt: 'English (Doppia ora)', subjectEn: 'English (Double period)', teacher: 'D. Keates', location: 'Classroom P3', notesIt: 'Writing samples & reading', notesEn: 'Writing samples & reading' },
        { time: '10:10 – 11:35', type: 'lesson', subjectIt: 'SPORT / PE (Turnhalle Kartaus)', subjectEn: 'SPORT / PE (Turnhalle Kartaus)', teacher: 'Coach', location: 'Turnhalle Kartaus', notesIt: '👟 Kit ginnastica e scarpe pulite', notesEn: '👟 PE kit and clean gym shoes' },
        { time: '11:40 – 12:25', type: 'lesson', subjectIt: 'English', subjectEn: 'English', teacher: 'D. Keates', location: 'Classroom P3', notesIt: 'Comprehension & Collins book', notesEn: 'Comprehension & Collins book' },
        { time: '12:25 – 13:50', type: 'lunch', subjectIt: '🍽️ Pranzo & Mensa a Scuola', subjectEn: '🍽️ School Lunch & Play', notesIt: 'Mensa e ricreazione', notesEn: 'Supervised lunch & recess' },
        { time: '13:50 – 15:35', type: 'lesson', subjectIt: 'ART (Tessile & Cucito)', subjectEn: 'ART (Textile & Sewing)', teacher: 'Mrs Schmid', location: 'Art Studio', notesIt: '🎨 Paint shirt obbligatoria', notesEn: '🎨 Paint shirt required' },
        { time: '15:35 – 15:55', type: 'dismissal', subjectIt: 'Consegna Wochenplan & Uscita (15:55)', subjectEn: 'Hand in Wochenplan & Dismissal (15:55)', teacher: 'M. Biehl', notesIt: '⏰ Verifica finale schede di matematica', notesEn: '⏰ Final check and submission of math sheets' }
      ]
    }
  }
};

export const SEBASTIAN_DATA: ChildData = {
  id: 'sebi',
  name: 'Sebastian Carlesso',
  nickname: 'Sebi',
  gradeIt: 'Primary 1 (Tandem IMS)',
  gradeEn: 'Primary 1 (Tandem IMS)',
  classTeacher: 'Ms Faux & Ms Rayment',
  avatarEmoji: '🧒',
  avatarBg: 'bg-gradient-to-br from-emerald-500 to-teal-700',
  avatarImg: '/avatars/avatar_sebi_circle_transparent.png',
  pdfUrl: '/docs/Primary-1-Attendance-Tandem.pdf',
  pdfLabelIt: 'Scarica Documento Ufficiale Primary 1 (Attendance & Info)',
  pdfLabelEn: 'Download Official Primary 1 Document (Attendance & Info)',
  days: {
    monday: {
      dayKey: 'monday',
      dayNameIt: 'Lunedì',
      dayNameEn: 'Monday',
      emoji: '🟡',
      dropOff: '08:15 – 08:30',
      pickUpIt: '15:55',
      pickUpEn: '15:55',
      duty: PARENT_DUTIES.monday,
      checklist: [
        {
          type: 'backpack',
          when: 'morning',
          icon: '🎒',
          categoryLabelIt: 'Zaino (Mattina)',
          categoryLabelEn: 'Bag (Morning)',
          target: 'parent',
          textIt: 'Controllo cartellina P1 & astuccio colori',
          textEn: 'Check P1 folder & coloring pencils'
        },
        {
          type: 'backpack',
          when: 'morning',
          icon: '📖',
          categoryLabelIt: 'Zaino (Mattina)',
          categoryLabelEn: 'Bag (Morning)',
          target: 'parent',
          textIt: 'Libretto di lettura fonetica nello zaino',
          textEn: 'Phonics reading booklet in bag'
        },
        {
          type: 'deadline',
          when: 'in_class',
          icon: '🎹',
          categoryLabelIt: 'Extra Pomeriggio (Kate)',
          categoryLabelEn: 'Afternoon Extra (Kate)',
          target: 'child',
          textIt: '17:30 Corso Strong + Lezione di Pianoforte (finisce 18:30 con Kate)',
          textEn: '17:30 Strong + Piano Lesson (finishes 18:30 with Kate)'
        }
      ],
      schedule: [
        { time: '08:30 – 10:05', type: 'lesson', subjectIt: 'Phonics & Early English', subjectEn: 'Phonics & Early English', teacher: 'Ms Rayment', location: 'Classroom P1', notesIt: 'Letters, sounds & vocabulary', notesEn: 'Letters, sounds & vocabulary' },
        { time: '10:05 – 10:50', type: 'break', subjectIt: '☕ Ricreazione Mattino & Snack', subjectEn: '☕ Morning Break & Snack', notesIt: 'Pausa nel cortile', notesEn: 'Playground snack & fresh air' },
        { time: '10:50 – 11:35', type: 'lesson', subjectIt: 'Deutsch Frühförderung', subjectEn: 'Early German Immersion', teacher: 'Ms Faux', location: 'Classroom P1', notesIt: 'Spielen & Sprechen', notesEn: 'Play & Speak' },
        { time: '11:40 – 12:25', type: 'lesson', subjectIt: 'Early Maths & Numbers', subjectEn: 'Early Maths & Numbers', teacher: 'Ms Rayment', location: 'Classroom P1', notesIt: 'Counting & basic shapes', notesEn: 'Counting & basic shapes' },
        { time: '12:25 – 13:50', type: 'lunch', subjectIt: '🍽️ Pranzo & Mensa a Scuola', subjectEn: '🍽️ School Lunch & Play', notesIt: 'Mensa e gioco all aperto', notesEn: 'Supervised lunch & outdoor play' },
        { time: '13:50 – 15:35', type: 'lesson', subjectIt: 'Topic & Storytime', subjectEn: 'Topic & Storytime', teacher: 'Team P1', location: 'Classroom P1', notesIt: 'Racconti illustrati & scoperta', notesEn: 'Picture books & discovery' },
        { time: '15:35 – 15:55', type: 'dismissal', subjectIt: 'Wrap-up & Uscita (15:55)', subjectEn: 'Wrap-up & Dismissal (15:55)', teacher: 'Team P1', notesIt: '17:30 Strong & 18:30 Piano con Kate', notesEn: '17:30 Strong & 18:30 Piano with Kate' }
      ]
    },
    tuesday: {
      dayKey: 'tuesday',
      dayNameIt: 'Martedì',
      dayNameEn: 'Tuesday',
      emoji: '🔴',
      dropOff: '08:15 – 08:30',
      pickUpIt: '15:55',
      pickUpEn: '15:55',
      duty: PARENT_DUTIES.tuesday,
      checklist: [
        {
          type: 'backpack',
          when: 'morning',
          icon: '🍎',
          categoryLabelIt: 'Zaino (Mattina)',
          categoryLabelEn: 'Bag (Morning)',
          target: 'parent',
          textIt: 'Snack sano per la ricreazione + borraccia',
          textEn: 'Healthy snack for recess + water bottle'
        },
        {
          type: 'homework',
          when: 'evening_before',
          icon: '🌙',
          categoryLabelIt: 'Compiti (Sera Prima)',
          categoryLabelEn: 'Homework (Night Before)',
          target: 'child',
          textIt: 'Ripasso giocoso forme e numeri P1 con mamma/papà',
          textEn: 'Playful review of shapes & numbers with mum/dad'
        }
      ],
      schedule: [
        { time: '08:30 – 10:05', type: 'lesson', subjectIt: 'Early Maths & Logic', subjectEn: 'Early Maths & Logic', teacher: 'Ms Rayment', location: 'Classroom P1', notesIt: 'Giochi di logica e numeri', notesEn: 'Logic games & number bonds' },
        { time: '10:05 – 10:50', type: 'break', subjectIt: '☕ Ricreazione Mattino & Snack', subjectEn: '☕ Morning Break & Snack', notesIt: 'Pausa ricreazione', notesEn: 'Recess & snack' },
        { time: '10:50 – 12:25', type: 'lesson', subjectIt: 'Deutsch & Singen', subjectEn: 'German & Singing', teacher: 'Ms Faux', location: 'Classroom P1', notesIt: 'Canzoni e parole in tedesco', notesEn: 'German songs and vocabulary' },
        { time: '12:25 – 13:50', type: 'lunch', subjectIt: '🍽️ Pranzo & Mensa a Scuola', subjectEn: '🍽️ School Lunch & Play', notesIt: 'Mensa e gioco all aperto', notesEn: 'Supervised lunch & outdoor play' },
        { time: '13:50 – 15:35', type: 'lesson', subjectIt: 'Discovery & Nature', subjectEn: 'Discovery & Nature', teacher: 'Team P1', location: 'Classroom / Garden', notesIt: 'Esplorazione all aperto', notesEn: 'Outdoor nature exploration' },
        { time: '15:35 – 15:55', type: 'dismissal', subjectIt: 'Story Listening & Uscita (15:55)', subjectEn: 'Story Listening & Dismissal (15:55)', teacher: 'Ms Rayment', notesIt: 'Rientro a casa', notesEn: 'Going home' }
      ]
    },
    wednesday: {
      dayKey: 'wednesday',
      dayNameIt: 'Mercoledì (Mezza Giornata)',
      dayNameEn: 'Wednesday (Half Day)',
      emoji: '🟢',
      dropOff: '08:15 – 08:30',
      pickUpIt: '12:30 (Uscita anticipata!)',
      pickUpEn: '12:30 (Early finish!)',
      duty: PARENT_DUTIES.wednesday,
      checklist: [
        {
          type: 'backpack',
          when: 'morning',
          icon: '📚',
          categoryLabelIt: 'Zaino (Mattina)',
          categoryLabelEn: 'Bag (Morning)',
          target: 'parent',
          urgent: true,
          textIt: 'SCAMBIO LIBRO DI LETTURA SETTIMANALE P1',
          textEn: 'WEEKLY P1 READING BOOK EXCHANGE'
        },
        {
          type: 'backpack',
          when: 'morning',
          icon: '🏠',
          categoryLabelIt: 'Pomeriggio',
          categoryLabelEn: 'Afternoon',
          target: 'parent',
          urgent: true,
          textIt: 'Uscita ore 12:30: Pranzo con Papà & Pomeriggio con Silvana a casa!',
          textEn: 'Pick-up at 12:30: Lunch with Dad & Afternoon with Silvana at home!'
        }
      ],
      schedule: [
        { time: '08:30 – 09:15', type: 'lesson', subjectIt: 'Deutsch & Geschichten', subjectEn: 'German & Stories', teacher: 'Ms Faux', location: 'Classroom P1', notesIt: 'Storie in tedesco', notesEn: 'German stories' },
        { time: '09:20 – 10:05', type: 'lesson', subjectIt: 'English Phonics', subjectEn: 'English Phonics', teacher: 'Ms Rayment', location: 'Classroom P1', notesIt: 'Suoni e lettere', notesEn: 'Sounds & blending letters' },
        { time: '10:05 – 10:50', type: 'break', subjectIt: '☕ Ricreazione Mattino & Snack', subjectEn: '☕ Morning Break & Snack', notesIt: 'Pausa ricreazione', notesEn: 'Recess & snack' },
        { time: '10:50 – 11:35', type: 'lesson', subjectIt: 'Movement & Rhythm', subjectEn: 'Movement & Rhythm', teacher: 'Team P1', location: 'Gym', notesIt: 'Movimento e coordinazione', notesEn: 'Movement & coordination' },
        { time: '11:40 – 12:25', type: 'lesson', subjectIt: 'Singing & Music', subjectEn: 'Singing & Music', teacher: 'Music Staff', location: 'Music Room', notesIt: 'Musica per i più piccoli', notesEn: 'Music and nursery rhymes' },
        { time: '12:30', type: 'lunch', isSpecial: true, subjectIt: '🏠 12:30 USCITA ANTICIPATA & PRANZO A CASA CON PAPÀ! 👨‍👦‍👦', subjectEn: '🏠 12:30 EARLY FINISH & LUNCH AT HOME WITH DAD! 👨‍👦‍👦', notesIt: 'Nessuna mensa a scuola. Si pranza tutti a casa!', notesEn: 'No school lunch. Family lunch at home!' },
        { time: '13:50 – 15:55', type: 'afternoon_home', isSpecial: true, subjectIt: '🏠 Pomeriggio a Casa con Silvana & Giochi', subjectEn: '🏠 Afternoon at Home with Silvana', notesIt: 'Pomeriggio tranquillo e giochi educativi', notesEn: 'Afternoon play & activities with Silvana' }
      ]
    },
    thursday: {
      dayKey: 'thursday',
      dayNameIt: 'Giovedì (Sport P1)',
      dayNameEn: 'Thursday (PE Day P1)',
      emoji: '🔵',
      dropOff: '08:15 – 08:30',
      pickUpIt: '15:55',
      pickUpEn: '15:55',
      duty: PARENT_DUTIES.thursday,
      checklist: [
        {
          type: 'backpack',
          when: 'morning',
          icon: '🎒',
          categoryLabelIt: 'Zaino (Mattina)',
          categoryLabelEn: 'Bag (Morning)',
          target: 'parent',
          urgent: true,
          textIt: 'PORTARE KIT SPORT P1 (Scarpe ginnastica comode)',
          textEn: 'BRING P1 PE KIT (Comfortable gym shoes)'
        },
        {
          type: 'backpack',
          when: 'morning',
          icon: '🎨',
          categoryLabelIt: 'Zaino (Mattina)',
          categoryLabelEn: 'Bag (Morning)',
          target: 'parent',
          textIt: 'Verificare grembiulino pittura nell armadietto',
          textEn: 'Check paint apron is in the cubby'
        }
      ],
      schedule: [
        { time: '08:30 – 09:15', type: 'lesson', subjectIt: 'SPORT & Movement P1', subjectEn: 'SPORT & Movement P1', teacher: 'Coach', location: 'Turnhalle', notesIt: '👟 Scarpe da ginnastica', notesEn: '👟 Gym shoes required' },
        { time: '09:20 – 10:05', type: 'lesson', subjectIt: 'English Phonics', subjectEn: 'English Phonics', teacher: 'Ms Rayment', location: 'Classroom P1', notesIt: 'Lettura guidata', notesEn: 'Guided reading' },
        { time: '10:05 – 10:50', type: 'break', subjectIt: '☕ Ricreazione Mattino & Snack', subjectEn: '☕ Morning Break & Snack', notesIt: 'Pausa ricreazione', notesEn: 'Recess & snack' },
        { time: '10:50 – 12:25', type: 'lesson', subjectIt: 'Deutsch Spiele', subjectEn: 'German Games', teacher: 'Ms Faux', location: 'Classroom P1', notesIt: 'Attività bilingue', notesEn: 'Bilingual games & vocabulary' },
        { time: '12:25 – 13:50', type: 'lunch', subjectIt: '🍽️ Pranzo & Mensa a Scuola', subjectEn: '🍽️ School Lunch & Play', notesIt: 'Mensa e ricreazione', notesEn: 'Supervised lunch & recess' },
        { time: '13:50 – 15:35', type: 'lesson', subjectIt: 'Arts & Craft', subjectEn: 'Arts & Crafts', teacher: 'Team P1', location: 'Art Corner', notesIt: 'Disegno e manipolazione', notesEn: 'Drawing & tactile crafts' },
        { time: '15:35 – 15:55', type: 'dismissal', subjectIt: 'Daily Review & Uscita (15:55)', subjectEn: 'Daily Review & Dismissal (15:55)', teacher: 'Team P1', notesIt: 'Chiusura giornata', notesEn: 'End of day reflection' }
      ]
    },
    friday: {
      dayKey: 'friday',
      dayNameIt: 'Venerdì (Craft & Weekend)',
      dayNameEn: 'Friday (Craft & Weekend)',
      emoji: '🟣',
      dropOff: '08:15 – 08:30',
      pickUpIt: '15:55',
      pickUpEn: '15:55',
      duty: PARENT_DUTIES.friday,
      checklist: [
        {
          type: 'backpack',
          when: 'morning',
          icon: '🎨',
          categoryLabelIt: 'Zaino (Mattina)',
          categoryLabelEn: 'Bag (Morning)',
          target: 'parent',
          urgent: true,
          textIt: 'Grembiulino per pittura & lavoretti',
          textEn: 'Painting apron for messy crafts'
        },
        {
          type: 'backpack',
          when: 'morning',
          icon: '🧸',
          categoryLabelIt: 'Zaino (Mattina)',
          categoryLabelEn: 'Bag (Morning)',
          target: 'parent',
          textIt: 'Show & Tell (se concordato con le maestre)',
          textEn: 'Show & Tell toy (if scheduled)'
        },
        {
          type: 'backpack',
          when: 'morning',
          icon: '🎒',
          categoryLabelIt: 'Weekend',
          categoryLabelEn: 'Weekend',
          target: 'parent',
          textIt: 'Svuotare e ripulire zainetto per il weekend! (Sabato Cavallo!)',
          textEn: 'Empty backpack for weekend! (Saturday Horse Riding!)'
        }
      ],
      schedule: [
        { time: '08:30 – 10:05', type: 'lesson', subjectIt: 'Deutsch & Kreatives', subjectEn: 'German & Creative Play', teacher: 'Ms Faux', location: 'Classroom P1', notesIt: 'Attività creative in tedesco', notesEn: 'Creative activities in German' },
        { time: '10:05 – 10:50', type: 'break', subjectIt: '☕ Ricreazione Mattino & Snack', subjectEn: '☕ Morning Break & Snack', notesIt: 'Pausa ricreazione', notesEn: 'Recess & snack' },
        { time: '10:50 – 11:35', type: 'lesson', subjectIt: 'English Storytelling', subjectEn: 'English Storytelling', teacher: 'Ms Rayment', location: 'Cozy Corner', notesIt: 'Storie & filastrocche', notesEn: 'Stories & rhymes' },
        { time: '11:40 – 12:25', type: 'lesson', subjectIt: 'Early Math Games', subjectEn: 'Early Math Games', teacher: 'Ms Rayment', location: 'Classroom P1', notesIt: 'Giochi di gruppo con numeri', notesEn: 'Math group games' },
        { time: '12:25 – 13:50', type: 'lunch', subjectIt: '🍽️ Pranzo & Mensa a Scuola', subjectEn: '🍽️ School Lunch & Play', notesIt: 'Mensa e ricreazione', notesEn: 'Supervised lunch & recess' },
        { time: '13:50 – 15:35', type: 'lesson', subjectIt: 'Free Play & Construction', subjectEn: 'Free Play & Construction', teacher: 'Team P1', location: 'Play Area', notesIt: 'Costruzioni e creatività', notesEn: 'Building blocks & creativity' },
        { time: '15:35 – 15:55', type: 'dismissal', subjectIt: 'Weekend Circle & Uscita (15:55)', subjectEn: 'Weekend Circle & Dismissal (15:55)', teacher: 'Team P1', notesIt: 'Sabato pomeriggio: 🐴 Cavallo / Horse riding!', notesEn: 'Saturday afternoon: 🐴 Horse riding!' }
      ]
    }
  }
};
