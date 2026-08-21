export interface DutyInfo {
  parent: 'mamma' | 'papa';
  parentNameIt: string;
  parentNameEn: string;
  avatarImg?: string;
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
  avatarImg?: string;
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

export interface ExtraActivity {
  time: string;
  icon: string;
  titleIt: string;
  titleEn: string;
  managedByIt: string;
  managedByEn: string;
  notesIt?: string;
  notesEn?: string;
  location?: string;
  hasActivity: boolean;
}

export interface DayScheduleBlocks {
  morning: TimeSlot[];
  lunch: TimeSlot;
  afternoon: TimeSlot[];
  extra: ExtraActivity;
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
  blocks: DayScheduleBlocks;
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
  avatarImg: string;
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
    avatarImg: '/avatars/avatar_riccardo.png',
    notesIt: 'Il Papà porta al mattino. Uscita ore 12:30!',
    notesEn: 'Dad handles morning drop-off. Early dismissal at 12:30!',
    afternoonCareIt: '🏠 Pomeriggio con Silvana!',
    afternoonCareEn: '🏠 Afternoon with Silvana!'
  },
  thursday: {
    parent: 'papa',
    parentNameIt: '🟡 Papà (Riccardo)',
    parentNameEn: '🟡 Dad (Riccardo)',
    avatarImg: '/avatars/avatar_riccardo.png',
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
  avatarImg: '/avatars/avatar_ale.png',
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
      blocks: {
        morning: [
          { time: '08:30 – 10:05', type: 'lesson', subjectIt: 'Deutsch (Doppia ora)', subjectEn: 'German (Double period)', teacher: 'M. Biehl', location: 'Classroom P3', notesIt: 'Lehrplan 21 Hören & Schreiben', notesEn: 'Lehrplan 21 Listening & Writing' },
          { time: '10:05 – 10:50', type: 'break', subjectIt: '☕ Ricreazione Mattino & Snack', subjectEn: '☕ Morning Break & Snack', notesIt: 'Pausa nel cortile', notesEn: 'Playground snack & fresh air' },
          { time: '10:50 – 11:35', type: 'lesson', subjectIt: 'Mathematik', subjectEn: 'Maths', teacher: 'M. Biehl', location: 'Classroom P3', notesIt: 'Number & Algebra', notesEn: 'Number & Algebra' },
          { time: '11:40 – 12:25', type: 'lesson', subjectIt: 'Art History', subjectEn: 'Art History', teacher: 'Mrs Schmid', location: 'Art Studio', notesIt: 'Studio colori e forme', notesEn: 'Colors & shapes study' }
        ],
        lunch: {
          time: '12:25 – 13:50',
          type: 'lunch',
          subjectIt: '🍽️ Pranzo & Mensa a Scuola',
          subjectEn: '🍽️ School Lunch & Play',
          notesIt: 'Mensa scolastica e ricreazione sorvegliata',
          notesEn: 'Supervised school lunch & recess'
        },
        afternoon: [
          { time: '13:50 – 15:35', type: 'lesson', subjectIt: 'French (Doppia ora)', subjectEn: 'French (Double period)', teacher: 'Mme Conde', location: 'Lang Lab', notesIt: 'Les Loustics', notesEn: 'Les Loustics program' },
          { time: '15:35 – 15:55', type: 'dismissal', subjectIt: 'Homework Period & Uscita (15:55)', subjectEn: 'Homework Period & Dismissal (15:55)', teacher: 'M. Biehl', notesIt: 'Compiti del giorno in tedesco', notesEn: 'Daily homework in German' }
        ],
        extra: {
          time: '17:30',
          icon: '🏃',
          titleIt: 'Rientro con Mamma',
          titleEn: 'Evening with Mum',
          managedByIt: 'Mamma (Kate)',
          managedByEn: 'Mum (Kate)',
          notesIt: 'Rientro a casa serale con Kate',
          notesEn: 'Evening home routine with Kate',
          hasActivity: false
        }
      }
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
      blocks: {
        morning: [
          { time: '08:30 – 10:05', type: 'lesson', subjectIt: 'Mathematik (Doppia ora)', subjectEn: 'Maths (Double period)', teacher: 'M. Biehl', location: 'Classroom P3', notesIt: 'Geometria & Calcolo', notesEn: 'Geometry & Calculation' },
          { time: '10:05 – 10:50', type: 'break', subjectIt: '☕ Ricreazione Mattino & Snack', subjectEn: '☕ Morning Break & Snack', notesIt: 'Pausa ricreazione', notesEn: 'Recess & snack' },
          { time: '10:50 – 12:25', type: 'lesson', subjectIt: 'Deutsch (Doppia ora)', subjectEn: 'German (Double period)', teacher: 'M. Biehl', location: 'Classroom P3', notesIt: 'Grammatica e ortografia', notesEn: 'Grammar and spelling' }
        ],
        lunch: {
          time: '12:25 – 13:50',
          type: 'lunch',
          subjectIt: '🍽️ Pranzo & Mensa a Scuola',
          subjectEn: '🍽️ School Lunch & Play',
          notesIt: 'Sorvegliata da Mr Dannie',
          notesEn: 'Supervised by Mr Dannie'
        },
        afternoon: [
          { time: '13:50 – 15:35', type: 'lesson', subjectIt: 'Enquiry (DE/EN)', subjectEn: 'Enquiry (DE/EN)', teacher: 'Biehl / Keates', location: 'Classroom P3', notesIt: 'Scienze, Energy & Zurich City', notesEn: 'Science, Energy & Zurich City' },
          { time: '15:35 – 15:55', type: 'dismissal', subjectIt: 'Homework Period & Uscita (15:55)', subjectEn: 'Homework Period & Dismissal (15:55)', teacher: 'M. Biehl', notesIt: 'Studio guidato', notesEn: 'Guided study' }
        ],
        extra: {
          time: '16:30',
          icon: '🏠',
          titleIt: 'Rientro autonomo a casa (16:30)',
          titleEn: 'Kids come home (16:30)',
          managedByIt: 'Mamma a casa',
          managedByEn: 'Kate home to manage',
          notesIt: 'I bimbi tornano a casa verso le 16:30',
          notesEn: 'Kids arrive home around 16:30',
          hasActivity: true
        }
      }
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
          icon: '👨‍👦',
          categoryLabelIt: 'Pranzo Papino',
          categoryLabelEn: 'Lunch with Dad',
          target: 'parent',
          urgent: true,
          textIt: 'Uscita ore 12:30: Pranzo speciale a casa con Papino (Riccardo)!',
          textEn: 'Pick-up at 12:30: Special lunch at home with Dad (Riccardo)!'
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
      blocks: {
        morning: [
          { time: '08:30 – 09:15', type: 'lesson', subjectIt: 'Deutsch', subjectEn: 'German', teacher: 'M. Biehl', location: 'Classroom P3', notesIt: 'Lettura e dialogo', notesEn: 'Reading and dialogue' },
          { time: '09:20 – 10:05', type: 'lesson', subjectIt: 'Mathematik', subjectEn: 'Maths', teacher: 'M. Biehl', location: 'Classroom P3', notesIt: 'Wochenplan check', notesEn: 'Wochenplan progress check' },
          { time: '10:05 – 10:50', type: 'break', subjectIt: '☕ Ricreazione Mattino & Snack', subjectEn: '☕ Morning Break & Snack', notesIt: 'Pausa ricreazione', notesEn: 'Recess & snack' },
          { time: '10:50 – 11:35', type: 'lesson', subjectIt: 'Enquiry', subjectEn: 'Enquiry', teacher: 'D. Keates', location: 'Classroom P3', notesIt: 'Roman Times & Ecosystems', notesEn: 'Roman Times & Ecosystems' },
          { time: '11:40 – 12:25', type: 'lesson', subjectIt: 'Music (Tedesco)', subjectEn: 'Music (German)', teacher: 'Music Staff', location: 'Music Room', notesIt: 'Canto ed espressione musicale', notesEn: 'Singing & musical expression' }
        ],
        lunch: {
          time: '12:30',
          type: 'lunch',
          isSpecial: true,
          avatarImg: '/avatars/avatar_riccardo.png',
          subjectIt: '🏠 12:30 PRANZO A CASA CON PAPINO! 👨‍👦‍👦',
          subjectEn: '🏠 12:30 LUNCH AT HOME WITH DAD! 👨‍👦‍👦',
          notesIt: 'Uscita anticipata ore 12:30. Si pranza tutti insieme a casa!',
          notesEn: 'Early finish 12:30. Family lunch at home with Dad!'
        },
        afternoon: [
          {
            time: '13:50 – 15:55',
            type: 'afternoon_home',
            isSpecial: true,
            avatarImg: '/avatars/avatar_silvana.png',
            subjectIt: '🏠 Pomeriggio con Silvana',
            subjectEn: '🏠 Afternoon with Silvana',
            notesIt: 'Pomeriggio tranquillo e compiti con Tata Silvana',
            notesEn: 'Afternoon homework & play with Silvana'
          }
        ],
        extra: {
          time: '16:10 – 17:25',
          icon: '🎭',
          titleIt: 'Ale Drama Club (16:10–17:25)',
          titleEn: 'Ale Drama Club (16:10–17:25)',
          location: 'Simply Theatre Studios Zurigo',
          managedByIt: 'Silvana / Papà',
          managedByEn: 'Silvana / Dad',
          notesIt: 'Corso di recitazione e teatro in inglese a Zurigo',
          notesEn: 'English theatre & drama acting studio in Zurich',
          hasActivity: true
        }
      }
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
      blocks: {
        morning: [
          { time: '08:30 – 09:15', type: 'lesson', subjectIt: 'French', subjectEn: 'French', teacher: 'Mme Conde', location: 'Lang Lab', notesIt: 'Conversazione & vocaboli', notesEn: 'Conversation & vocabulary' },
          { time: '09:20 – 10:05', type: 'lesson', subjectIt: 'Maths / Mathematik', subjectEn: 'Maths / Mathematik', teacher: 'Keates / Biehl', location: 'Classroom P3', notesIt: 'Gruppi bilingue', notesEn: 'Bilingual ability groups' },
          { time: '10:05 – 10:50', type: 'break', subjectIt: '☕ Ricreazione Mattino & Snack', subjectEn: '☕ Morning Break & Snack', notesIt: 'Pausa ricreazione', notesEn: 'Recess & snack' },
          { time: '10:50 – 12:25', type: 'lesson', subjectIt: 'English / Deutsch', subjectEn: 'English / German', teacher: 'Keates / Biehl', location: 'Classroom P3', notesIt: 'UK Curriculum English', notesEn: 'UK Curriculum English' }
        ],
        lunch: {
          time: '12:25 – 13:50',
          type: 'lunch',
          subjectIt: '🍽️ Pranzo & Mensa a Scuola',
          subjectEn: '🍽️ School Lunch & Play',
          notesIt: 'Mensa e ricreazione sorvegliata',
          notesEn: 'Supervised lunch & recess'
        },
        afternoon: [
          { time: '13:50 – 15:35', type: 'lesson', subjectIt: 'Enquiry & Music (EN)', subjectEn: 'Enquiry & Music (EN)', teacher: 'D. Keates', location: 'Classroom P3', notesIt: 'Progetti pratici in inglese', notesEn: 'Hands-on projects in English' },
          { time: '15:35 – 15:55', type: 'dismissal', subjectIt: 'Homework Period (EN) & Uscita (15:55)', subjectEn: 'Homework Period (EN) & Dismissal (15:55)', teacher: 'D. Keates', notesIt: 'Grammar & spelling check', notesEn: 'Grammar & spelling check' }
        ],
        extra: {
          time: '18:30',
          icon: '🏫',
          titleIt: 'Ritiro Tandem ore 18:30',
          titleEn: 'Tandem Collect at 18:30',
          managedByIt: 'Papà (Riccardo)',
          managedByEn: 'Dad (Riccardo)',
          notesIt: 'Papà ritira i bimbi al Tandem alle 18:30',
          notesEn: 'Dad collects kids from Tandem at 18:30',
          hasActivity: true
        }
      }
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
      blocks: {
        morning: [
          { time: '08:30 – 10:05', type: 'lesson', subjectIt: 'English (Doppia ora)', subjectEn: 'English (Double period)', teacher: 'D. Keates', location: 'Classroom P3', notesIt: 'Writing samples & reading', notesEn: 'Writing samples & reading' },
          { time: '10:10 – 11:35', type: 'lesson', subjectIt: 'SPORT / PE (Turnhalle Kartaus)', subjectEn: 'SPORT / PE (Turnhalle Kartaus)', teacher: 'Coach', location: 'Turnhalle Kartaus', notesIt: '👟 Kit ginnastica e scarpe pulite', notesEn: '👟 PE kit and clean gym shoes' },
          { time: '11:40 – 12:25', type: 'lesson', subjectIt: 'English', subjectEn: 'English', teacher: 'D. Keates', location: 'Classroom P3', notesIt: 'Comprehension & Collins book', notesEn: 'Comprehension & Collins book' }
        ],
        lunch: {
          time: '12:25 – 13:50',
          type: 'lunch',
          subjectIt: '🍽️ Pranzo & Mensa a Scuola',
          subjectEn: '🍽️ School Lunch & Play',
          notesIt: 'Mensa e ricreazione',
          notesEn: 'Supervised lunch & recess'
        },
        afternoon: [
          { time: '13:50 – 15:35', type: 'lesson', subjectIt: 'ART (Tessile & Cucito)', subjectEn: 'ART (Textile & Sewing)', teacher: 'Mrs Schmid', location: 'Art Studio', notesIt: '🎨 Paint shirt obbligatoria', notesEn: '🎨 Paint shirt required' },
          { time: '15:35 – 15:55', type: 'dismissal', subjectIt: 'Consegna Wochenplan & Uscita (15:55)', subjectEn: 'Hand in Wochenplan & Dismissal (15:55)', teacher: 'M. Biehl', notesIt: '⏰ Verifica finale schede di matematica', notesEn: '⏰ Final check and submission of math sheets' }
        ],
        extra: {
          time: '16:00',
          icon: '🎉',
          titleIt: 'Inizio Weekend!',
          titleEn: 'Weekend Start!',
          managedByIt: 'Famiglia',
          managedByEn: 'Family',
          notesIt: 'Relax e tempo libero in famiglia',
          notesEn: 'Relax and weekend family time',
          hasActivity: false
        }
      }
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
  avatarImg: '/avatars/avatar_sebi.png',
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
        }
      ],
      blocks: {
        morning: [
          { time: '08:30 – 10:05', type: 'lesson', subjectIt: 'Phonics & Early English', subjectEn: 'Phonics & Early English', teacher: 'Ms Rayment', location: 'Classroom P1', notesIt: 'Letters, sounds & vocabulary', notesEn: 'Letters, sounds & vocabulary' },
          { time: '10:05 – 10:50', type: 'break', subjectIt: '☕ Ricreazione Mattino & Snack', subjectEn: '☕ Morning Break & Snack', notesIt: 'Pausa nel cortile', notesEn: 'Playground snack & fresh air' },
          { time: '10:50 – 11:35', type: 'lesson', subjectIt: 'Deutsch Frühförderung', subjectEn: 'Early German Immersion', teacher: 'Ms Faux', location: 'Classroom P1', notesIt: 'Spielen & Sprechen', notesEn: 'Play & Speak' },
          { time: '11:40 – 12:25', type: 'lesson', subjectIt: 'Early Maths & Numbers', subjectEn: 'Early Maths & Numbers', teacher: 'Ms Rayment', location: 'Classroom P1', notesIt: 'Counting & basic shapes', notesEn: 'Counting & basic shapes' }
        ],
        lunch: {
          time: '12:25 – 13:50',
          type: 'lunch',
          subjectIt: '🍽️ Pranzo & Mensa a Scuola',
          subjectEn: '🍽️ School Lunch & Play',
          notesIt: 'Mensa e gioco all aperto',
          notesEn: 'Supervised lunch & outdoor play'
        },
        afternoon: [
          { time: '13:50 – 15:35', type: 'lesson', subjectIt: 'Topic & Storytime', subjectEn: 'Topic & Storytime', teacher: 'Team P1', location: 'Classroom P1', notesIt: 'Racconti illustrati & scoperta', notesEn: 'Picture books & discovery' },
          { time: '15:35 – 15:55', type: 'dismissal', subjectIt: 'Wrap-up & Uscita (15:55)', subjectEn: 'Wrap-up & Dismissal (15:55)', teacher: 'Team P1', notesIt: 'Preparazione per le attività serali', notesEn: 'Getting ready for evening activities' }
        ],
        extra: {
          time: '17:30 – 18:30',
          icon: '🎹',
          titleIt: 'Corso Strong (17:30) + Pianoforte (18:30)',
          titleEn: 'Strong Finish (17:30) + Piano (18:30)',
          managedByIt: 'Mamma (Kate)',
          managedByEn: 'Mum (Kate)',
          notesIt: 'Corso Strong alle 17:30 e poi lezione di pianoforte fino alle 18:30 con Kate',
          notesEn: 'Strong class at 17:30 and piano lesson finishing at 18:30 with Kate',
          hasActivity: true
        }
      }
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
      blocks: {
        morning: [
          { time: '08:30 – 10:05', type: 'lesson', subjectIt: 'Early Maths & Logic', subjectEn: 'Early Maths & Logic', teacher: 'Ms Rayment', location: 'Classroom P1', notesIt: 'Giochi di logica e numeri', notesEn: 'Logic games & number bonds' },
          { time: '10:05 – 10:50', type: 'break', subjectIt: '☕ Ricreazione Mattino & Snack', subjectEn: '☕ Morning Break & Snack', notesIt: 'Pausa ricreazione', notesEn: 'Recess & snack' },
          { time: '10:50 – 12:25', type: 'lesson', subjectIt: 'Deutsch & Singen', subjectEn: 'German & Singing', teacher: 'Ms Faux', location: 'Classroom P1', notesIt: 'Canzoni e parole in tedesco', notesEn: 'German songs and vocabulary' }
        ],
        lunch: {
          time: '12:25 – 13:50',
          type: 'lunch',
          subjectIt: '🍽️ Pranzo & Mensa a Scuola',
          subjectEn: '🍽️ School Lunch & Play',
          notesIt: 'Mensa e gioco all aperto',
          notesEn: 'Supervised lunch & outdoor play'
        },
        afternoon: [
          { time: '13:50 – 15:35', type: 'lesson', subjectIt: 'Discovery & Nature', subjectEn: 'Discovery & Nature', teacher: 'Team P1', location: 'Classroom / Garden', notesIt: 'Esplorazione all aperto', notesEn: 'Outdoor nature exploration' },
          { time: '15:35 – 15:55', type: 'dismissal', subjectIt: 'Story Listening & Uscita (15:55)', subjectEn: 'Story Listening & Dismissal (15:55)', teacher: 'Ms Rayment', notesIt: 'Rientro a casa', notesEn: 'Going home' }
        ],
        extra: {
          time: '16:30',
          icon: '🏠',
          titleIt: 'Rientro a casa (16:30)',
          titleEn: 'Kids come home (16:30)',
          managedByIt: 'Mamma a casa',
          managedByEn: 'Kate home to manage',
          notesIt: 'I bimbi sono a casa alle 16:30',
          notesEn: 'Kids are home by 16:30',
          hasActivity: true
        }
      }
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
          icon: '👨‍👦',
          categoryLabelIt: 'Pranzo Papino',
          categoryLabelEn: 'Lunch with Dad',
          target: 'parent',
          urgent: true,
          textIt: 'Uscita ore 12:30: Pranzo speciale a casa con Papino (Riccardo)!',
          textEn: 'Pick-up at 12:30: Special lunch at home with Dad (Riccardo)!'
        }
      ],
      blocks: {
        morning: [
          { time: '08:30 – 09:15', type: 'lesson', subjectIt: 'Deutsch & Geschichten', subjectEn: 'German & Stories', teacher: 'Ms Faux', location: 'Classroom P1', notesIt: 'Storie in tedesco', notesEn: 'German stories' },
          { time: '09:20 – 10:05', type: 'lesson', subjectIt: 'English Phonics', subjectEn: 'English Phonics', teacher: 'Ms Rayment', location: 'Classroom P1', notesIt: 'Suoni e lettere', notesEn: 'Sounds & blending letters' },
          { time: '10:05 – 10:50', type: 'break', subjectIt: '☕ Ricreazione Mattino & Snack', subjectEn: '☕ Morning Break & Snack', notesIt: 'Pausa ricreazione', notesEn: 'Recess & snack' },
          { time: '10:50 – 11:35', type: 'lesson', subjectIt: 'Movement & Rhythm', subjectEn: 'Movement & Rhythm', teacher: 'Team P1', location: 'Gym', notesIt: 'Movimento e coordinazione', notesEn: 'Movement & coordination' },
          { time: '11:40 – 12:25', type: 'lesson', subjectIt: 'Singing & Music', subjectEn: 'Singing & Music', teacher: 'Music Staff', location: 'Music Room', notesIt: 'Musica per i più piccoli', notesEn: 'Music and nursery rhymes' }
        ],
        lunch: {
          time: '12:30',
          type: 'lunch',
          isSpecial: true,
          avatarImg: '/avatars/avatar_riccardo.png',
          subjectIt: '🏠 12:30 PRANZO A CASA CON PAPINO! 👨‍👦‍👦',
          subjectEn: '🏠 12:30 LUNCH AT HOME WITH DAD! 👨‍👦‍👦',
          notesIt: 'Uscita anticipata ore 12:30. Si pranza tutti insieme a casa!',
          notesEn: 'Early finish 12:30. Family lunch at home with Dad!'
        },
        afternoon: [
          {
            time: '13:50 – 15:55',
            type: 'afternoon_home',
            isSpecial: true,
            avatarImg: '/avatars/avatar_silvana.png',
            subjectIt: '🏠 Pomeriggio a Casa con Silvana & Giochi',
            subjectEn: '🏠 Afternoon at Home with Silvana',
            notesIt: 'Pomeriggio tranquillo e giochi educativi a casa',
            notesEn: 'Afternoon play & activities with Silvana'
          }
        ],
        extra: {
          time: '16:00',
          icon: '🎨',
          titleIt: 'Pomeriggio Giochi con Silvana & Ale',
          titleEn: 'Playtime at home with Silvana & Ale',
          managedByIt: 'Silvana',
          managedByEn: 'Silvana',
          notesIt: 'Disegno, puzzle e storie a casa',
          notesEn: 'Drawing, puzzles and stories at home',
          hasActivity: true
        }
      }
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
      blocks: {
        morning: [
          { time: '08:30 – 09:15', type: 'lesson', subjectIt: 'SPORT & Movement P1', subjectEn: 'SPORT & Movement P1', teacher: 'Coach', location: 'Turnhalle', notesIt: '👟 Scarpe da ginnastica', notesEn: '👟 Gym shoes required' },
          { time: '09:20 – 10:05', type: 'lesson', subjectIt: 'English Phonics', subjectEn: 'English Phonics', teacher: 'Ms Rayment', location: 'Classroom P1', notesIt: 'Lettura guidata', notesEn: 'Guided reading' },
          { time: '10:05 – 10:50', type: 'break', subjectIt: '☕ Ricreazione Mattino & Snack', subjectEn: '☕ Morning Break & Snack', notesIt: 'Pausa ricreazione', notesEn: 'Recess & snack' },
          { time: '10:50 – 12:25', type: 'lesson', subjectIt: 'Deutsch Spiele', subjectEn: 'German Games', teacher: 'Ms Faux', location: 'Classroom P1', notesIt: 'Attività bilingue', notesEn: 'Bilingual games & vocabulary' }
        ],
        lunch: {
          time: '12:25 – 13:50',
          type: 'lunch',
          subjectIt: '🍽️ Pranzo & Mensa a Scuola',
          subjectEn: '🍽️ School Lunch & Play',
          notesIt: 'Mensa e ricreazione',
          notesEn: 'Supervised lunch & recess'
        },
        afternoon: [
          { time: '13:50 – 15:35', type: 'lesson', subjectIt: 'Arts & Craft', subjectEn: 'Arts & Crafts', teacher: 'Team P1', location: 'Art Corner', notesIt: 'Disegno e manipolazione', notesEn: 'Drawing & tactile crafts' },
          { time: '15:35 – 15:55', type: 'dismissal', subjectIt: 'Daily Review & Uscita (15:55)', subjectEn: 'Daily Review & Dismissal (15:55)', teacher: 'Team P1', notesIt: 'Chiusura giornata', notesEn: 'End of day reflection' }
        ],
        extra: {
          time: '18:30',
          icon: '🏫',
          titleIt: 'Ritiro Tandem ore 18:30',
          titleEn: 'Tandem Collect at 18:30',
          managedByIt: 'Papà (Riccardo)',
          managedByEn: 'Dad (Riccardo)',
          notesIt: 'Papà ritira i bimbi al Tandem alle 18:30',
          notesEn: 'Dad collects kids from Tandem at 18:30',
          hasActivity: true
        }
      }
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
          textIt: 'Svuotare e ripulire zainetto per il weekend!',
          textEn: 'Empty backpack for weekend!'
        }
      ],
      blocks: {
        morning: [
          { time: '08:30 – 10:05', type: 'lesson', subjectIt: 'Deutsch & Kreatives', subjectEn: 'German & Creative Play', teacher: 'Ms Faux', location: 'Classroom P1', notesIt: 'Attività creative in tedesco', notesEn: 'Creative activities in German' },
          { time: '10:05 – 10:50', type: 'break', subjectIt: '☕ Ricreazione Mattino & Snack', subjectEn: '☕ Morning Break & Snack', notesIt: 'Pausa ricreazione', notesEn: 'Recess & snack' },
          { time: '10:50 – 11:35', type: 'lesson', subjectIt: 'English Storytelling', subjectEn: 'English Storytelling', teacher: 'Ms Rayment', location: 'Cozy Corner', notesIt: 'Storie & filastrocche', notesEn: 'Stories & rhymes' },
          { time: '11:40 – 12:25', type: 'lesson', subjectIt: 'Early Math Games', subjectEn: 'Early Math Games', teacher: 'Ms Rayment', location: 'Classroom P1', notesIt: 'Giochi di gruppo con numeri', notesEn: 'Math group games' }
        ],
        lunch: {
          time: '12:25 – 13:50',
          type: 'lunch',
          subjectIt: '🍽️ Pranzo & Mensa a Scuola',
          subjectEn: '🍽️ School Lunch & Play',
          notesIt: 'Mensa e ricreazione',
          notesEn: 'Supervised lunch & recess'
        },
        afternoon: [
          { time: '13:50 – 15:35', type: 'lesson', subjectIt: 'Free Play & Construction', subjectEn: 'Free Play & Construction', teacher: 'Team P1', location: 'Play Area', notesIt: 'Costruzioni e creatività', notesEn: 'Building blocks & creativity' },
          { time: '15:35 – 15:55', type: 'dismissal', subjectIt: 'Weekend Circle & Uscita (15:55)', subjectEn: 'Weekend Circle & Dismissal (15:55)', teacher: 'Team P1', notesIt: 'Preparazione per il weekend', notesEn: 'Getting ready for weekend' }
        ],
        extra: {
          time: 'Sabato Pom',
          icon: '🐴',
          titleIt: 'SABATO: Cavallo (Equitazione)',
          titleEn: 'SATURDAY: Horse Riding',
          managedByIt: 'Famiglia',
          managedByEn: 'Family',
          notesIt: 'Lezione di equitazione / cavallo al sabato pomeriggio!',
          notesEn: 'Saturday afternoon horse riding lesson!',
          hasActivity: true
        }
      }
    }
  }
};
