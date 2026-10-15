export interface SchoolTicket {
  id: string;
  title: string;
  description: string;
  targetKid: 'ale' | 'seby' | 'family';
  owner: 'riccardo' | 'kate' | 'unassigned';
  priority: 'urgent' | 'high' | 'normal';
  category: 'permessi' | 'eventi' | 'equipaggiamento' | 'biblioteca';
  dueDate: string;
  source: string;
  status: 'open' | 'claimed' | 'resolved';
}

export const INITIAL_TICKETS: SchoolTicket[] = [
  {
    id: 'tkt-001',
    title: 'Firma permesso per gita scolastica (Biblioteca di Seefeld)',
    description: 'Firmare il modulo cartaceo di autorizzazione per l\'uscita didattica a piedi alla biblioteca comunale di Seefeld e inserirlo nello zainetto di Sebi.',
    targetKid: 'seby',
    owner: 'riccardo',
    priority: 'urgent',
    category: 'permessi',
    dueDate: '24 Ottobre 2026',
    source: 'Circolare Piota App #149',
    status: 'claimed',
  },
  {
    id: 'tkt-002',
    title: 'Conferma Presenza: Christmas Breakfast (P1 & P3)',
    description: 'Coordinare chi partecipa alla colazione natalizia: Sebastian (P1) Mercoledì 9 Dicembre e Alessandro (P3) Giovedì 17 Dicembre (8:15 - 9:30).',
    targetKid: 'family',
    owner: 'kate',
    priority: 'high',
    category: 'eventi',
    dueDate: '1 Dicembre 2026',
    source: 'Alert Piota: Christmas Breakfast Events',
    status: 'claimed',
  },
  {
    id: 'tkt-003',
    title: 'Preparare stivali e K-Way per Forest Day (Bosco)',
    description: 'Verificare sacca del bosco per Alessandro: stivali impermeabili, pantaloni da fango e giacca antivento per la giornata all\'aperto.',
    targetKid: 'ale',
    owner: 'unassigned',
    priority: 'high',
    category: 'equipaggiamento',
    dueDate: '21 Ottobre 2026',
    source: 'Class Info Primary 3',
    status: 'open',
  },
  {
    id: 'tkt-004',
    title: 'Restituzione Libro Biblioteca Scolastica Tandem',
    description: 'Ricordarsi di rimettere nello zainetto il libro di lettura in inglese preso in prestito venerdì scorso dalla biblioteca di classe.',
    targetKid: 'seby',
    owner: 'riccardo',
    priority: 'normal',
    category: 'biblioteca',
    dueDate: 'Lunedì mattina',
    source: 'Class Routine P1',
    status: 'claimed',
  },
  {
    id: 'tkt-005',
    title: 'Kit Nuoto & Cuffia per Mercoledì',
    description: 'Controllare sacca nuoto: costume, cuffia Tandem, occhialini e telo microfibra.',
    targetKid: 'ale',
    owner: 'unassigned',
    priority: 'normal',
    category: 'equipaggiamento',
    dueDate: 'Mercoledì 08:00',
    source: 'Routine Settimanale',
    status: 'open',
  }
];

export const UPCOMING_EVENTS = [
  {
    id: 'evt-001',
    title: '🎄 Christmas Breakfast - Sebastian (P1)',
    date: 'Mercoledì 9 Dicembre 2026',
    time: '08:15 – 09:30',
    location: 'Tandem IMS Seefeld (Aula P1)',
    kid: 'seby',
    gcalStatus: 'Sincronizzato su Piota AI Cal',
  },
  {
    id: 'evt-002',
    title: '🎄 Christmas Breakfast - Alessandro (P3)',
    date: 'Giovedì 17 Dicembre 2026',
    time: '08:15 – 09:30',
    location: 'Tandem IMS Seefeld (Aula P3)',
    kid: 'ale',
    gcalStatus: 'Sincronizzato su Piota AI Cal',
  }
];
