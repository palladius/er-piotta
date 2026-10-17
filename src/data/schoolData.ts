export interface DutyInfo {
  parent: 'mamma' | 'papa';
  parentNameIt: string;
  parentNameEn: string;
  avatarImg?: string;
  notesIt: string;
  notesEn: string;
  afternoonCareIt?: string;
  afternoonCareEn?: string;
  afternoonCareAvatar?: string;
}

export interface TimeSlot {
  time: string;
  startTime: string;
  endTime: string;
  type: 'lesson' | 'lunch' | 'dismissal' | 'afternoon_home';
  icon: string;
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

export interface EveningActivity {
  time: string;
  startTime: string;
  endTime: string;
  icon: string;
  titleIt: string;
  titleEn: string;
  notesIt?: string;
  notesEn?: string;
  hasActivity: boolean;
  avatarImg?: string;
}

export interface DayScheduleBlocks {
  morning: TimeSlot[];
  lunch: TimeSlot;
  afternoon: TimeSlot[];
  extra: ExtraActivity;
  evening: EveningActivity;
}

export interface WeekendItem {
  dayKey: 'saturday' | 'sunday';
  dayNameIt: string;
  dayNameEn: string;
  emoji: string;
  time: string;
  titleIt: string;
  titleEn: string;
  notesIt: string;
  notesEn: string;
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
  weekend: WeekendItem[];
}

export const PARENT_DUTIES: Record<string, DutyInfo> = {
  monday: {
    parent: 'mamma',
    parentNameIt: '🟣 Mamma (Kate)',
    parentNameEn: '🟣 Mum (Kate)',
    notesIt: 'La Mamma porta a scuola e gestisce il rientro e le attività (Strong & Piano)',
    notesEn: 'Mum handles morning drop-off, pick-up and activities (Strong & Piano)'
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
    afternoonCareIt: '🏠 Silvana: 13:30–19:00',
    afternoonCareEn: '🏠 Silvana: 13:30–19:00',
    afternoonCareAvatar: '/avatars/avatar_silvana.png'
  },
  thursday: {
    parent: 'papa',
    parentNameIt: '🟡 Papà (Riccardo)',
    parentNameEn: '🟡 Dad (Riccardo)',
    avatarImg: '/avatars/avatar_riccardo.png',
    notesIt: 'Il Papà porta a scuola e ritira al Tandem alle 18:30',
    notesEn: 'Dad handles morning drop-off & collects from Tandem at 18:30'
  },
  friday: {
    parent: 'mamma',
    parentNameIt: '🟣 Mamma (Kate)',
    parentNameEn: '🟣 Mum (Kate)',
    notesIt: 'La Mamma porta a scuola e gestisce il rientro e nuoto di Sebi (18:00)',
    notesEn: 'Mum handles morning drop-off, pick-up and Sebi swimming (18:00)'
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
  avatarImg: '/avatars/avatar_ale_school.jpg',
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
          textEn: 'Plan week Maths worksheets (Wochenplan)'
        }
      ],
      blocks: {
        morning: [
          { time: '08:30 – 10:05', startTime: '08:30', endTime: '10:05', type: 'lesson', icon: '🇩🇪', subjectIt: 'Tedesco (Doppia ora)', subjectEn: 'German (Double period)', teacher: 'M. Biehl', location: 'Aula P3', notesIt: 'Lehrplan 21 Hören & Schreiben', notesEn: 'Lehrplan 21 Listening & Writing' },
          { time: '10:50 – 11:35', startTime: '10:50', endTime: '11:35', type: 'lesson', icon: '🔢', subjectIt: 'Matematica', subjectEn: 'Maths', teacher: 'M. Biehl', location: 'Aula P3', notesIt: 'Number & Algebra', notesEn: 'Number & Algebra' },
          { time: '11:40 – 12:25', startTime: '11:40', endTime: '12:25', type: 'lesson', icon: '🎨', subjectIt: 'Storia dell\'Arte', subjectEn: 'Art History', teacher: 'Mrs Schmid', location: 'Art Studio', notesIt: 'Studio colori e forme', notesEn: 'Colors & shapes study' }
        ],
        lunch: {
          time: '12:25 – 13:50',
          startTime: '12:25',
          endTime: '13:50',
          type: 'lunch',
          icon: '🍽️',
          subjectIt: 'Mensa & Gioco a Scuola',
          subjectEn: 'School Lunch & Play',
          notesIt: 'Mensa scolastica e ricreazione sorvegliata',
          notesEn: 'Supervised school lunch & recess'
        },
        afternoon: [
          { time: '13:50 – 15:35', startTime: '13:50', endTime: '15:35', type: 'lesson', icon: '🇫🇷', subjectIt: 'Francese (Doppia ora)', subjectEn: 'French (Double period)', teacher: 'Mme Conde', location: 'Lang Lab', notesIt: 'Les Loustics', notesEn: 'Les Loustics program' },
          { time: '15:35 – 15:55', startTime: '15:35', endTime: '15:55', type: 'dismissal', icon: '📝', subjectIt: 'Compiti & Uscita (15:55)', subjectEn: 'Homework & Dismissal (15:55)', teacher: 'M. Biehl', location: 'Aula P3', notesIt: 'Compiti del giorno in tedesco', notesEn: 'Daily homework in German' }
        ],
        extra: {
          time: '16:00 – 17:30',
          icon: '💪',
          titleIt: 'Corso STRONG (16:00–17:30)',
          titleEn: 'STRONG Class (4:00–5:30pm)',
          managedByIt: 'Mamma (Kate)',
          managedByEn: 'Mum (Kate)',
          notesIt: 'Alessandro fa il corso STRONG dalle 16:00 alle 17:30 gestito da Kate',
          notesEn: 'Alessandro has STRONG class from 4:00pm to 5:30pm with Kate',
          hasActivity: true
        },
        evening: {
          time: '19:00',
          startTime: '19:00',
          endTime: '20:00',
          icon: '✨',
          titleIt: 'Cena & Relax',
          titleEn: 'Dinner & Relax',
          notesIt: 'Serata tranquilla in famiglia',
          notesEn: 'Quiet evening with family',
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
          { time: '08:30 – 10:05', startTime: '08:30', endTime: '10:05', type: 'lesson', icon: '🔢', subjectIt: 'Matematica (Doppia ora)', subjectEn: 'Maths (Double period)', teacher: 'M. Biehl', location: 'Aula P3', notesIt: 'Geometria & Calcolo', notesEn: 'Geometry & Calculation' },
          { time: '10:50 – 12:25', startTime: '10:50', endTime: '12:25', type: 'lesson', icon: '🇩🇪', subjectIt: 'Tedesco (Doppia ora)', subjectEn: 'German (Double period)', teacher: 'M. Biehl', location: 'Aula P3', notesIt: 'Grammatica e ortografia', notesEn: 'Grammar and spelling' }
        ],
        lunch: {
          time: '12:25 – 13:50',
          startTime: '12:25',
          endTime: '13:50',
          type: 'lunch',
          icon: '🍽️',
          subjectIt: 'Mensa & Gioco a Scuola',
          subjectEn: 'School Lunch & Play',
          notesIt: 'Sorvegliata da Mr Dannie',
          notesEn: 'Supervised by Mr Dannie'
        },
        afternoon: [
          { time: '13:50 – 15:35', startTime: '13:50', endTime: '15:35', type: 'lesson', icon: '🔬', subjectIt: 'Scienze / Enquiry (DE/EN)', subjectEn: 'Enquiry & Science (DE/EN)', teacher: 'Biehl / Keates', location: 'Aula P3', notesIt: 'Scienze, Energy & Zurich City', notesEn: 'Science, Energy & Zurich City' },
          { time: '15:35 – 15:55', startTime: '15:35', endTime: '15:55', type: 'dismissal', icon: '📝', subjectIt: 'Compiti & Uscita (15:55)', subjectEn: 'Homework & Dismissal (15:55)', teacher: 'M. Biehl', location: 'Aula P3', notesIt: 'Studio guidato', notesEn: 'Guided study' }
        ],
        extra: {
          time: '16:30',
          icon: '🏠',
          titleIt: 'Rientro autonomo a casa (16:30)',
          titleEn: 'Kids come home (4:30pm)',
          managedByIt: 'Mamma a casa',
          managedByEn: 'Kate home to manage',
          notesIt: 'I bimbi tornano a casa verso le 16:30',
          notesEn: 'Kids arrive home around 4:30pm',
          hasActivity: true
        },
        evening: {
          time: '19:00',
          startTime: '19:00',
          endTime: '20:00',
          icon: '✨',
          titleIt: 'Cena & Relax',
          titleEn: 'Dinner & Relax',
          notesIt: 'Serata tranquilla in famiglia',
          notesEn: 'Quiet evening with family',
          hasActivity: false
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
          when: 'morning',
          icon: '🇫🇷',
          categoryLabelIt: 'Compiti Francese',
          categoryLabelEn: 'French Homework',
          target: 'both',
          urgent: true,
          textIt: 'Compiti Francese con Papino',
          textEn: 'French homework with Dad'
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
          { time: '08:30 – 09:15', startTime: '08:30', endTime: '09:15', type: 'lesson', icon: '🇩🇪', subjectIt: 'Tedesco', subjectEn: 'German', teacher: 'M. Biehl', location: 'Aula P3', notesIt: 'Lettura e dialogo', notesEn: 'Reading and dialogue' },
          { time: '09:20 – 10:05', startTime: '09:20', endTime: '10:05', type: 'lesson', icon: '🔢', subjectIt: 'Matematica', subjectEn: 'Maths', teacher: 'M. Biehl', location: 'Aula P3', notesIt: 'Wochenplan check', notesEn: 'Wochenplan progress check' },
          { time: '10:50 – 11:35', startTime: '10:50', endTime: '11:35', type: 'lesson', icon: '🔬', subjectIt: 'Scienze / Enquiry', subjectEn: 'Enquiry', teacher: 'D. Keates', location: 'Aula P3', notesIt: 'Roman Times & Ecosystems', notesEn: 'Roman Times & Ecosystems' },
          { time: '11:40 – 12:25', startTime: '11:40', endTime: '12:25', type: 'lesson', icon: '🎵', subjectIt: 'Musica (Tedesco)', subjectEn: 'Music (German)', teacher: 'Music Staff', location: 'Music Room', notesIt: 'Canto ed espressione musicale', notesEn: 'Singing & musical expression' }
        ],
        lunch: {
          time: '12:30',
          startTime: '12:30',
          endTime: '13:30',
          type: 'lunch',
          isSpecial: true,
          icon: '👨‍👦',
          avatarImg: '/avatars/avatar_riccardo.png',
          subjectIt: '12:30 PRANZO A CASA CON PAPINO! 👨‍👦‍👦',
          subjectEn: '12:30 LUNCH AT HOME WITH DAD! 👨‍👦‍👦',
          notesIt: 'Uscita anticipata ore 12:30. Si pranza tutti insieme a casa!',
          notesEn: 'Early finish 12:30. Family lunch at home with Dad!'
        },
        afternoon: [
          {
            time: '13:30 – 19:00',
            startTime: '13:30',
            endTime: '19:00',
            type: 'afternoon_home',
            isSpecial: true,
            icon: '🏠',
            avatarImg: '/avatars/avatar_silvana.png',
            subjectIt: 'Silvana a Casa · 🎭 16:10 Drama Club',
            subjectEn: 'Silvana at Home · 🎭 4:10pm Drama Club',
            notesIt: 'Silvana gestisce il pomeriggio e porta Ale al Drama Club (16:10–17:25 Simply Theatre Studios Zurigo)',
            notesEn: 'Silvana manages the afternoon and takes Ale to Drama Club (4:10–5:25pm Simply Theatre Studios Zurich)'
          }
        ],
        extra: {
          time: '16:10 – 17:25',
          icon: '🎭',
          titleIt: 'Drama Club (Incluso con Silvana)',
          titleEn: 'Drama Club (Managed by Silvana)',
          location: 'Simply Theatre Studios Zurigo',
          managedByIt: 'Silvana / Papà',
          managedByEn: 'Silvana / Dad',
          notesIt: 'Corso di recitazione e teatro in inglese a Zurigo (16:10–17:25)',
          notesEn: 'English theatre & drama acting studio in Zurich (4:10–5:25pm)',
          hasActivity: false
        },
        evening: {
          time: '19:00 – 20:00',
          startTime: '19:00',
          endTime: '20:00',
          icon: '🇫🇷',
          avatarImg: '/avatars/avatar_riccardo.png',
          titleIt: '🇫🇷 Compiti Francese con Papino',
          titleEn: '🇫🇷 French Homework with Dad',
          notesIt: 'Les Loustics & conversazione francese insieme a Riccardo',
          notesEn: 'Les Loustics & French conversation practice together with Riccardo',
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
          textIt: 'Sacca sport domani (kit Kartaus)',
          textEn: 'Sport bag tomorrow (Kartaus kit)'
        },
        {
          type: 'homework',
          when: 'evening_before',
          icon: '🌙',
          categoryLabelIt: 'Compiti (Sera Prima)',
          categoryLabelEn: 'Homework (Night Before)',
          target: 'child',
          urgent: true,
          textIt: 'Chiudere Wochenplan matematica',
          textEn: 'Finish Maths Wochenplan'
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
          { time: '08:30 – 09:15', startTime: '08:30', endTime: '09:15', type: 'lesson', icon: '🇫🇷', subjectIt: 'Francese', subjectEn: 'French', teacher: 'Mme Conde', location: 'Lang Lab', notesIt: 'Conversazione & vocaboli', notesEn: 'Conversation & vocabulary' },
          { time: '09:20 – 10:05', startTime: '09:20', endTime: '10:05', type: 'lesson', icon: '🔢', subjectIt: 'Matematica', subjectEn: 'Maths', teacher: 'Keates / Biehl', location: 'Aula P3', notesIt: 'Gruppi bilingue', notesEn: 'Bilingual ability groups' },
          { time: '10:50 – 12:25', startTime: '10:50', endTime: '12:25', type: 'lesson', icon: '🇬🇧', subjectIt: 'Inglese / Tedesco (Doppia ora)', subjectEn: 'English / German (Double period)', teacher: 'Keates / Biehl', location: 'Aula P3', notesIt: 'UK Curriculum English', notesEn: 'UK Curriculum English' }
        ],
        lunch: {
          time: '12:25 – 13:50',
          startTime: '12:25',
          endTime: '13:50',
          type: 'lunch',
          icon: '🍽️',
          subjectIt: 'Mensa & Gioco a Scuola',
          subjectEn: 'School Lunch & Play',
          notesIt: 'Mensa e ricreazione sorvegliata',
          notesEn: 'Supervised lunch & recess'
        },
        afternoon: [
          { time: '13:50 – 15:35', startTime: '13:50', endTime: '15:35', type: 'lesson', icon: '🔬', subjectIt: 'Scienze & Musica (EN)', subjectEn: 'Enquiry & Music (EN)', teacher: 'D. Keates', location: 'Aula P3', notesIt: 'Progetti pratici in inglese', notesEn: 'Hands-on projects in English' },
          { time: '15:35 – 15:55', startTime: '15:35', endTime: '15:55', type: 'dismissal', icon: '📝', subjectIt: 'Compiti & Uscita (15:55)', subjectEn: 'Homework & Dismissal (15:55)', teacher: 'D. Keates', location: 'Aula P3', notesIt: 'Grammar & spelling check', notesEn: 'Grammar & spelling check' }
        ],
        extra: {
          time: '18:30',
          icon: '🏫',
          titleIt: 'Ritiro Tandem ore 18:30',
          titleEn: 'Tandem Collect at 6:30pm',
          managedByIt: 'Papà (Riccardo)',
          managedByEn: 'Dad (Riccardo)',
          notesIt: 'Papà ritira i bimbi al Tandem alle 18:30',
          notesEn: 'Dad collects kids from Tandem at 6:30pm',
          hasActivity: true
        },
        evening: {
          time: '19:00',
          startTime: '19:00',
          endTime: '20:00',
          icon: '✨',
          titleIt: 'Cena & Relax',
          titleEn: 'Dinner & Relax',
          notesIt: 'Serata tranquilla in famiglia',
          notesEn: 'Quiet evening with family',
          hasActivity: false
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
          textIt: 'Sacca sport & scarpe (Kartaus)',
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
          textIt: 'Consegna Wochenplan matematica',
          textEn: 'HAND IN MATHS WOCHENPLAN to Mr Marvin!'
        }
      ],
      blocks: {
        morning: [
          { time: '08:30 – 10:05', startTime: '08:30', endTime: '10:05', type: 'lesson', icon: '🇬🇧', subjectIt: 'Inglese (Doppia ora)', subjectEn: 'English (Double period)', teacher: 'D. Keates', location: 'Aula P3', notesIt: 'Writing samples & reading', notesEn: 'Writing samples & reading' },
          { time: '10:10 – 11:35', startTime: '10:10', endTime: '11:35', type: 'lesson', icon: '🏃', subjectIt: 'Sport / PE (Turnhalle Kartaus)', subjectEn: 'Sport / PE (Turnhalle Kartaus)', teacher: 'Coach', location: 'Turnhalle Kartaus', notesIt: '👟 Kit ginnastica e scarpe pulite', notesEn: '👟 PE kit and clean gym shoes' },
          { time: '11:40 – 12:25', startTime: '11:40', endTime: '12:25', type: 'lesson', icon: '🇬🇧', subjectIt: 'Inglese', subjectEn: 'English', teacher: 'D. Keates', location: 'Aula P3', notesIt: 'Comprehension & Collins book', notesEn: 'Comprehension & Collins book' }
        ],
        lunch: {
          time: '12:25 – 13:50',
          startTime: '12:25',
          endTime: '13:50',
          type: 'lunch',
          icon: '🍽️',
          subjectIt: 'Mensa & Gioco a Scuola',
          subjectEn: 'School Lunch & Play',
          notesIt: 'Mensa e ricreazione',
          notesEn: 'Supervised lunch & recess'
        },
        afternoon: [
          { time: '13:50 – 15:35', startTime: '13:50', endTime: '15:35', type: 'lesson', icon: '🎨', subjectIt: 'Arte (Tessile & Cucito)', subjectEn: 'Art (Textile & Sewing)', teacher: 'Mrs Schmid', location: 'Art Studio', notesIt: '🎨 Paint shirt obbligatoria', notesEn: '🎨 Paint shirt required' },
          { time: '15:35 – 15:55', startTime: '15:35', endTime: '15:55', type: 'dismissal', icon: '⏰', subjectIt: 'Consegna Wochenplan & Uscita', subjectEn: 'Hand in Wochenplan & Dismissal', teacher: 'M. Biehl', location: 'Aula P3', notesIt: '⏰ Verifica finale schede di matematica', notesEn: '⏰ Final check and submission of math sheets' }
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
        },
        evening: {
          time: '19:00',
          startTime: '19:00',
          endTime: '20:00',
          icon: '✨',
          titleIt: 'Cena & Relax',
          titleEn: 'Dinner & Relax',
          notesIt: 'Venerdì sera in famiglia',
          notesEn: 'Friday evening with family',
          hasActivity: false
        }
      }
    }
  },
  weekend: [
    {
      dayKey: 'saturday',
      dayNameIt: 'Sabato (Cavallo Sebi)',
      dayNameEn: 'Saturday (Sebi Horse Riding)',
      emoji: '🐴',
      time: '14:00 – 16:00',
      titleIt: 'Sebi a Cavallo (Equitazione Kolbenhof)',
      titleEn: 'Sebi Horse Riding (Kolbenhof)',
      notesIt: 'Pomeriggio al maneggio Kolbenhof per la lezione di equitazione di Sebi',
      notesEn: 'Afternoon at Kolbenhof riding school for Sebi\'s horse riding lesson'
    },
    {
      dayKey: 'sunday',
      dayNameIt: 'Domenica (Pianoforte)',
      dayNameEn: 'Sunday (Piano Practice)',
      emoji: '🎹🌊',
      time: '19:00 – 20:00 (Sera)',
      titleIt: '🎹 Compiti di Pianoforte con Papino',
      titleEn: '🎹 Piano Practice with Dad',
      notesIt: 'Gite in famiglia di giorno · Ore 19:00: Esercizi e ripasso di Pianoforte con Papino prima di lunedì',
      notesEn: 'Family day trips · 7:00pm: Piano practice with Dad before Monday lesson'
    }
  ]
};

export const SEBASTIAN_DATA: ChildData = {
  id: 'sebi',
  name: 'Sebastian Carlesso',
  nickname: 'Sebi',
  gradeIt: 'Primary 1 (Tandem IMS)',
  gradeEn: 'Primary 1 (Tandem IMS)',
  classTeacher: 'Frau Xenia Faux (DE) & Ms Gaby Rayment (EN)',
  avatarEmoji: '🧒',
  avatarBg: 'bg-gradient-to-br from-emerald-500 to-teal-700',
  avatarImg: '/avatars/avatar_sebi_school.jpg',
  pdfUrl: '/docs/Primary-1-Schedule-Tandem.pdf',
  pdfLabelIt: 'Scarica PDF Orario Ufficiale Primary 1 (1° Semestre)',
  pdfLabelEn: 'Download Official Primary 1 PDF (1st Semester Timetable)',
  days: {
    monday: {
      dayKey: 'monday',
      dayNameIt: 'Lunedì (Francese & Tedesco)',
      dayNameEn: 'Monday (French & German)',
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
          textIt: 'Astuccio completo e cartellina P1',
          textEn: 'Check P1 folder & pencil case'
        },
        {
          type: 'backpack',
          when: 'morning',
          icon: '🇫🇷',
          categoryLabelIt: 'Zaino (Mattina)',
          categoryLabelEn: 'Bag (Morning)',
          target: 'parent',
          textIt: 'Quaderno / materiale di Francese (Doppia ora al mattino)',
          textEn: 'French material (Double period in the morning)'
        }
      ],
      blocks: {
        morning: [
          { time: '08:30 – 10:05', startTime: '08:30', endTime: '10:05', type: 'lesson', icon: '🇫🇷', subjectIt: 'Francese (Doppia ora)', subjectEn: 'French (Double period)', teacher: 'Mme Conde', location: 'Lang Lab', notesIt: 'Immersion & vocaboli francesi', notesEn: 'French immersion & vocabulary' },
          { time: '10:50 – 12:25', startTime: '10:50', endTime: '12:25', type: 'lesson', icon: '🇩🇪', subjectIt: 'Tedesco (Doppia ora)', subjectEn: 'German (Double period)', teacher: 'Frau Faux', location: 'Aula P1', notesIt: 'Lehrplan 21 Deutsch', notesEn: 'German curriculum Lehrplan 21' }
        ],
        lunch: {
          time: '12:30 – 13:45',
          startTime: '12:30',
          endTime: '13:45',
          type: 'lunch',
          icon: '🍽️',
          subjectIt: 'Mensa & Gioco all\'Aperto',
          subjectEn: 'School Lunch & Outdoor Play',
          notesIt: 'Mensa scolastica e ricreazione sorvegliata',
          notesEn: 'Supervised school lunch & outdoor recess'
        },
        afternoon: [
          { time: '13:50 – 14:30', startTime: '13:50', endTime: '14:30', type: 'lesson', icon: '🔢', subjectIt: 'Matematica', subjectEn: 'Maths', teacher: 'Frau Faux / Ms Rayment', location: 'Aula P1', notesIt: 'Numeri e conteggio', notesEn: 'Numbers & counting' },
          { time: '14:50 – 15:35', startTime: '14:50', endTime: '15:35', type: 'lesson', icon: '🌿', subjectIt: 'Natur und Technik (Scienze)', subjectEn: 'Science & Nature (Natur & Technik)', teacher: 'Frau Faux', location: 'Aula P1', notesIt: 'Scienze naturali e scoperta del mondo', notesEn: 'Nature, science & discovery' },
          { time: '15:35 – 15:55', startTime: '15:35', endTime: '15:55', type: 'dismissal', icon: '🎒', subjectIt: 'Compiti & Uscita (15:55)', subjectEn: 'Homework & Dismissal (15:55)', teacher: 'Team P1', location: 'Aula P1', notesIt: 'Uscita 15:55 / Preparazione Strong & Piano', notesEn: '15:55 dismissal / Ready for Strong & Piano' }
        ],
        extra: {
          time: '16:00 – 18:30',
          icon: '💪🎹',
          titleIt: 'STRONG (17:30) + Pianoforte (18:30)',
          titleEn: 'STRONG (5:30pm) + Piano (6:30pm)',
          managedByIt: 'Mamma (Kate)',
          managedByEn: 'Mum (Kate)',
          notesIt: 'Corso Strong fino alle 17:30 e poi lezione di Pianoforte (solo Sebi) fino alle 18:30 con Kate',
          notesEn: 'STRONG class until 5:30pm then Piano lesson (Sebi only) until 6:30pm with Kate',
          hasActivity: true
        },
        evening: {
          time: '19:00',
          startTime: '19:00',
          endTime: '20:00',
          icon: '✨',
          titleIt: 'Cena & Relax',
          titleEn: 'Dinner & Relax',
          notesIt: 'Serata tranquilla a casa dopo il pianoforte',
          notesEn: 'Quiet evening at home after piano',
          hasActivity: false
        }
      }
    },
    tuesday: {
      dayKey: 'tuesday',
      dayNameIt: 'Martedì (Matematica & Enquiry)',
      dayNameEn: 'Tuesday (Maths & Enquiry)',
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
        }
      ],
      blocks: {
        morning: [
          { time: '08:30 – 10:05', startTime: '08:30', endTime: '10:05', type: 'lesson', icon: '🇩🇪🇬🇧', subjectIt: 'Tedesco / Inglese (Doppia ora)', subjectEn: 'German / English (Double period)', teacher: 'Frau Faux / Ms Rayment', location: 'Aula P1', notesIt: 'Lingue e fonetica bilingue', notesEn: 'Bilingual language immersion' },
          { time: '10:50 – 12:25', startTime: '10:50', endTime: '12:25', type: 'lesson', icon: '🔢', subjectIt: 'Matematica (Doppia ora)', subjectEn: 'Maths (Double period)', teacher: 'Frau Faux / Ms Rayment', location: 'Aula P1', notesIt: 'Matematica bilingue (Mathe/Maths)', notesEn: 'Bilingual math concepts & shapes' }
        ],
        lunch: {
          time: '12:30 – 13:45',
          startTime: '12:30',
          endTime: '13:45',
          type: 'lunch',
          icon: '🍽️',
          subjectIt: 'Mensa & Gioco all\'Aperto',
          subjectEn: 'School Lunch & Outdoor Play',
          notesIt: 'Mensa e ricreazione sorvegliata',
          notesEn: 'Supervised lunch & outdoor play'
        },
        afternoon: [
          { time: '13:50 – 15:35', startTime: '13:50', endTime: '15:35', type: 'lesson', icon: '🔬', subjectIt: 'Enquiry / Scienze (Doppia ora)', subjectEn: 'Enquiry / Science (Double period)', teacher: 'Team P1', location: 'Aula P1', notesIt: 'Progetti pratici ed esplorazione Enquiry', notesEn: 'Hands-on enquiry discovery projects' },
          { time: '15:35 – 15:55', startTime: '15:35', endTime: '15:55', type: 'dismissal', icon: '🎒', subjectIt: 'Compiti & Uscita (15:55)', subjectEn: 'Homework & Dismissal (15:55)', teacher: 'Team P1', location: 'Aula P1', notesIt: 'Rientro a casa ore 15:55', notesEn: 'Going home at 15:55' }
        ],
        extra: {
          time: '16:30',
          icon: '🏠',
          titleIt: 'Rientro a casa (16:30)',
          titleEn: 'Kids come home (4:30pm)',
          managedByIt: 'Mamma a casa',
          managedByEn: 'Kate home to manage',
          notesIt: 'I bimbi sono a casa alle 16:30',
          notesEn: 'Kids are home by 4:30pm',
          hasActivity: true
        },
        evening: {
          time: '19:00',
          startTime: '19:00',
          endTime: '20:00',
          icon: '✨',
          titleIt: 'Cena & Relax',
          titleEn: 'Dinner & Relax',
          notesIt: 'Serata tranquilla in famiglia',
          notesEn: 'Quiet evening with family',
          hasActivity: false
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
          textIt: 'Scambio libro di lettura settimanale P1 in biblioteca',
          textEn: 'Weekly P1 reading book exchange at school library'
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
          { time: '08:30 – 10:05', startTime: '08:30', endTime: '10:05', type: 'lesson', icon: '🇩🇪🇬🇧', subjectIt: 'Tedesco / Inglese (Doppia ora)', subjectEn: 'German / English (Double period)', teacher: 'Frau Faux / Ms Rayment', location: 'Aula P1', notesIt: 'Lettura & fonetica bilingue', notesEn: 'Reading & bilingual phonics' },
          { time: '10:50 – 11:35', startTime: '10:50', endTime: '11:35', type: 'lesson', icon: '🔢', subjectIt: 'Matematica', subjectEn: 'Maths', teacher: 'Frau Faux / Ms Rayment', location: 'Aula P1', notesIt: 'Mathe / Maths P1', notesEn: 'Maths concepts' },
          { time: '11:40 – 12:25', startTime: '11:40', endTime: '12:25', type: 'lesson', icon: '🔬', subjectIt: 'Enquiry / Scienze', subjectEn: 'Enquiry / Science', teacher: 'Team P1', location: 'Aula P1', notesIt: 'Unità tematica Enquiry', notesEn: 'Enquiry thematic unit' }
        ],
        lunch: {
          time: '12:30',
          startTime: '12:30',
          endTime: '13:30',
          type: 'lunch',
          isSpecial: true,
          icon: '👨‍👦',
          avatarImg: '/avatars/avatar_riccardo.png',
          subjectIt: '12:30 PRANZO A CASA CON PAPINO! 👨‍👦‍👦',
          subjectEn: '12:30 LUNCH AT HOME WITH DAD! 👨‍👦‍👦',
          notesIt: 'Uscita anticipata ore 12:30. Si pranza tutti insieme a casa!',
          notesEn: 'Early finish 12:30. Family lunch at home with Dad!'
        },
        afternoon: [
          {
            time: '13:30 – 19:00',
            startTime: '13:30',
            endTime: '19:00',
            type: 'afternoon_home',
            isSpecial: true,
            icon: '🏠',
            avatarImg: '/avatars/avatar_silvana.png',
            subjectIt: 'Silvana a Casa (13:30–19:00)',
            subjectEn: 'Silvana at Home (13:30–19:00)',
            notesIt: 'Tata Silvana gestisce il pomeriggio a casa e giochi (a scuola: opzione French Club/German Booster Club per iscritti 13:45-16:00)',
            notesEn: 'Nanny Silvana manages afternoon at home & play (optional school booster club 1:45-4:00pm)'
          }
        ],
        extra: {
          time: '16:00',
          icon: '🎨',
          titleIt: 'Pomeriggio Giochi (Incluso con Silvana)',
          titleEn: 'Playtime at home (Managed by Silvana)',
          managedByIt: 'Silvana',
          managedByEn: 'Silvana',
          notesIt: 'Disegno, puzzle e storie a casa con Tata Silvana',
          notesEn: 'Drawing, puzzles and stories at home with Silvana',
          hasActivity: false
        },
        evening: {
          time: '19:00',
          startTime: '19:00',
          endTime: '20:00',
          icon: '✨',
          titleIt: 'Cena & Giochi',
          titleEn: 'Dinner & Play',
          notesIt: 'Serata tranquilla a casa con Papino e Mamma',
          notesEn: 'Quiet evening at home with Dad & Mum',
          hasActivity: false
        }
      }
    },
    thursday: {
      dayKey: 'thursday',
      dayNameIt: 'Giovedì (Musica & Arte)',
      dayNameEn: 'Thursday (Music & Art History)',
      emoji: '🔵',
      dropOff: '08:15 – 08:30',
      pickUpIt: '15:55',
      pickUpEn: '15:55',
      duty: PARENT_DUTIES.thursday,
      checklist: [
        {
          type: 'backpack',
          when: 'morning',
          icon: '🎨',
          categoryLabelIt: 'Zaino (Mattina)',
          categoryLabelEn: 'Bag (Morning)',
          target: 'parent',
          textIt: 'Astuccio completo per Art History & Musica',
          textEn: 'Check pencil case for Art History & Music'
        }
      ],
      blocks: {
        morning: [
          { time: '08:30 – 10:05', startTime: '08:30', endTime: '10:05', type: 'lesson', icon: '🇩🇪🇬🇧', subjectIt: 'Tedesco / Inglese (Doppia ora)', subjectEn: 'German / English (Double period)', teacher: 'Frau Faux / Ms Rayment', location: 'Aula P1', notesIt: 'Linguaggio e comunicazione bilingue', notesEn: 'Bilingual language and communication' },
          { time: '10:50 – 11:35', startTime: '10:50', endTime: '11:35', type: 'lesson', icon: '🔢', subjectIt: 'Matematica', subjectEn: 'Maths', teacher: 'Frau Faux / Ms Rayment', location: 'Aula P1', notesIt: 'Matematica e logica', notesEn: 'Maths and logic' },
          { time: '11:40 – 12:25', startTime: '11:40', endTime: '12:25', type: 'lesson', icon: '🎵', subjectIt: 'Musica', subjectEn: 'Music', teacher: 'Music Staff', location: 'Music Room', notesIt: 'Canto ed espressione musicale', notesEn: 'Singing & musical expression' }
        ],
        lunch: {
          time: '12:30 – 13:45',
          startTime: '12:30',
          endTime: '13:45',
          type: 'lunch',
          icon: '🍽️',
          subjectIt: 'Mensa & Gioco all\'Aperto',
          subjectEn: 'School Lunch & Outdoor Play',
          notesIt: 'Mensa e ricreazione sorvegliata',
          notesEn: 'Supervised lunch & recess'
        },
        afternoon: [
          { time: '13:50 – 14:30', startTime: '13:50', endTime: '14:30', type: 'lesson', icon: '🔬', subjectIt: 'Enquiry / Scienze', subjectEn: 'Enquiry / Science', teacher: 'Team P1', location: 'Aula P1', notesIt: 'Progetto tematico Enquiry', notesEn: 'Thematic enquiry project' },
          { time: '14:50 – 15:35', startTime: '14:50', endTime: '15:35', type: 'lesson', icon: '🎨', subjectIt: 'Storia dell\'Arte (Art History)', subjectEn: 'Art History', teacher: 'Mrs Schmid', location: 'Art Studio', notesIt: 'Colori, forme ed esplorazione artistica', notesEn: 'Colors, shapes & art history' },
          { time: '15:35 – 15:55', startTime: '15:35', endTime: '15:55', type: 'dismissal', icon: '📝', subjectIt: 'Compiti & Uscita (15:55)', subjectEn: 'Homework & Dismissal (15:55)', teacher: 'Team P1', location: 'Aula P1', notesIt: 'Uscita ore 15:55', notesEn: '15:55 dismissal' }
        ],
        extra: {
          time: '18:30',
          icon: '🏫',
          titleIt: 'Ritiro Tandem ore 18:30',
          titleEn: 'Tandem Collect at 6:30pm',
          managedByIt: 'Papà (Riccardo)',
          managedByEn: 'Dad (Riccardo)',
          notesIt: 'Papà ritira i bimbi al Tandem alle 18:30',
          notesEn: 'Dad collects kids from Tandem at 6:30pm',
          hasActivity: true
        },
        evening: {
          time: '19:00',
          startTime: '19:00',
          endTime: '20:00',
          icon: '✨',
          titleIt: 'Cena & Relax',
          titleEn: 'Dinner & Relax',
          notesIt: 'Serata tranquilla in famiglia',
          notesEn: 'Quiet evening with family',
          hasActivity: false
        }
      }
    },
    friday: {
      dayKey: 'friday',
      dayNameIt: 'Venerdì (Sport Kartaus & Arte)',
      dayNameEn: 'Friday (Kartaus PE & Art)',
      emoji: '🟣',
      dropOff: '08:15 – 08:30',
      pickUpIt: '15:55',
      pickUpEn: '15:55',
      duty: PARENT_DUTIES.friday,
      checklist: [
        {
          type: 'backpack',
          when: 'morning',
          icon: '🏃',
          categoryLabelIt: 'Zaino (Mattina)',
          categoryLabelEn: 'Bag (Morning)',
          target: 'parent',
          urgent: true,
          textIt: 'SACCA SPORT & SCARPE PULITE per Turnhalle Kartaus (11:10–12:00)',
          textEn: 'BRING SPORT BAG & CLEAN GYM SHOES for Turnhalle Kartaus (11:10–12:00)'
        },
        {
          type: 'backpack',
          when: 'morning',
          icon: '🎨',
          categoryLabelIt: 'Zaino (Mattina)',
          categoryLabelEn: 'Bag (Morning)',
          target: 'parent',
          urgent: true,
          textIt: 'Paint shirt / Grembiule per arte del mattino',
          textEn: 'Paint shirt / apron for morning art'
        },
        {
          type: 'backpack',
          when: 'morning',
          icon: '🏊',
          categoryLabelIt: 'Sacca Nuoto',
          categoryLabelEn: 'Swimming Bag',
          target: 'parent',
          urgent: true,
          textIt: 'Sacca nuoto per stasera (18:00–18:30)',
          textEn: 'PREPARE SWIMMING BAG FOR TONIGHT (6:00–6:30pm)'
        }
      ],
      blocks: {
        morning: [
          { time: '08:30 – 10:05', startTime: '08:30', endTime: '10:05', type: 'lesson', icon: '🇬🇧🎨', subjectIt: 'Inglese & Arte (Doppia ora)', subjectEn: 'English & Art (Double period)', teacher: 'Ms Rayment / Mrs Schmid', location: 'Aula P1 / Art Studio', notesIt: 'Creatività, disegno & lingua inglese', notesEn: 'Creativity, art & English language' },
          { time: '10:50 – 12:25', startTime: '10:50', endTime: '12:25', type: 'lesson', icon: '🏃', subjectIt: 'Sport / PE (Turnhalle Kartaus 11:10–12:00)', subjectEn: 'Sport / PE (Turnhalle Kartaus 11:10–12:00)', teacher: 'Coach', location: 'Turnhalle Kartaus', notesIt: '👟 Lezione di Sport 11:10–12:00 presso la palestra Turnhalle Kartaus', notesEn: '👟 PE class 11:10–12:00 at Turnhalle Kartaus gym' }
        ],
        lunch: {
          time: '12:30 – 13:45',
          startTime: '12:30',
          endTime: '13:45',
          type: 'lunch',
          icon: '🍽️',
          subjectIt: 'Mensa & Gioco all\'Aperto',
          subjectEn: 'School Lunch & Outdoor Play',
          notesIt: 'Mensa e ricreazione sorvegliata',
          notesEn: 'Supervised lunch & outdoor play'
        },
        afternoon: [
          { time: '13:50 – 15:35', startTime: '13:50', endTime: '15:35', type: 'lesson', icon: '🔬', subjectIt: 'Enquiry / Scienze (Doppia ora)', subjectEn: 'Enquiry / Science (Double period)', teacher: 'Team P1', location: 'Aula P1', notesIt: 'Attività pratiche Enquiry', notesEn: 'Hands-on enquiry activities' },
          { time: '15:35 – 15:55', startTime: '15:35', endTime: '15:55', type: 'dismissal', icon: '👋', subjectIt: 'Compiti & Uscita (15:55)', subjectEn: 'Homework & Dismissal (15:55)', teacher: 'Team P1', location: 'Aula P1', notesIt: 'Uscita 15:55 / Preparazione per il nuoto serale', notesEn: '15:55 dismissal / Ready for evening swimming' }
        ],
        extra: {
          time: '18:00 – 18:30',
          icon: '🏊',
          titleIt: 'Nuoto Sebi (18:00–18:30)',
          titleEn: 'Sebi Swimming (6:00–6:30pm)',
          managedByIt: 'Mamma (Kate)',
          managedByEn: 'Mum (Kate)',
          notesIt: 'Lezione di nuoto di Sebastian dalle 18:00 alle 18:30 con Kate',
          notesEn: 'Sebastian swimming lesson from 6:00pm to 6:30pm with Kate',
          hasActivity: true
        },
        evening: {
          time: '19:00',
          startTime: '19:00',
          endTime: '20:00',
          icon: '✨',
          titleIt: 'Cena & Relax',
          titleEn: 'Dinner & Relax',
          notesIt: 'Venerdì sera in famiglia dopo il nuoto',
          notesEn: 'Friday evening with family after swimming',
          hasActivity: false
        }
      }
    }
  },
  weekend: [
    {
      dayKey: 'saturday',
      dayNameIt: 'Sabato (Cavallo Sebi)',
      dayNameEn: 'Saturday (Sebi Horse Riding)',
      emoji: '🐴',
      time: '14:00 – 16:00',
      titleIt: '🐴 Lezione di Cavallo al Kolbenhof',
      titleEn: '🐴 Horse Riding Lesson at Kolbenhof',
      notesIt: 'Lezione di equitazione di Sebastian al sabato pomeriggio!',
      notesEn: 'Sebastian\'s horse riding lesson on Saturday afternoon!'
    },
    {
      dayKey: 'sunday',
      dayNameIt: 'Domenica (Pianoforte)',
      dayNameEn: 'Sunday (Piano Practice)',
      emoji: '🎹🌊',
      time: '19:00 – 20:00 (Sera)',
      titleIt: '🎹 Esercizi di Pianoforte con Papino',
      titleEn: '🎹 Piano Practice with Dad',
      notesIt: 'Gite diurne · Ore 19:00: Esercizi di Pianoforte con Papino per preparare la lezione di lunedì',
      notesEn: 'Day trips · 7:00pm: Piano practice with Dad to prepare for Monday lesson'
    }
  ]
};
