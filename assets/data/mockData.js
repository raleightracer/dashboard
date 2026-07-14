/**
 * mockData.js
 * Central data store for the School Management System prototype.
 *
 * Authentication contract:
 *   Each user record MUST have a unique `username` field.
 *   auth.js authenticates solely by matching { username, password }.
 *   The `role` field drives all RBAC decisions downstream.
 *
 * Credential reference (demo):
 *   admin123   / admin123   → executive
 *   enroll123  / enroll123  → enrollment
 *   proc123    / proc123    → procurement
 *   hr123      / hr123      → hr
 *   teacher.ana / teach123  → teacher (t01)
 *   teacher.ben / teach456  → teacher (t02)
 */

const MOCK_DATA = Object.freeze({

  /* ─────────────────────────────────────────────
   * USERS
   * username: the value the user types at login.
   * id:       internal key linking to role-specific data (e.g. teachers map).
   * ───────────────────────────────────────────── */
  users: [
    { id: 'u01', username: 'admin123',   password: 'admin123',  name: 'Maria Santos', role: 'executive',   avatar: 'MS' },
    { id: 'u02', username: 'enroll123',  password: 'enroll123', name: 'Carlo Reyes',  role: 'enrollment',  avatar: 'CR' },
    { id: 'u03', username: 'proc123',    password: 'proc123',   name: 'Diana Cruz',   role: 'procurement', avatar: 'DC' },
    { id: 'u04', username: 'hr123',      password: 'hr123',     name: 'Jose Lim',     role: 'hr',          avatar: 'JL' },
    { id: 't01', username: 'teacher.ana',password: 'teach123',  name: 'Teacher Ana',  role: 'teacher',     avatar: 'TA' },
    { id: 't02', username: 'teacher.ben',password: 'teach456',  name: 'Teacher Ben',  role: 'teacher',     avatar: 'TB' },
  ],

  /* ─────────────────────────────────────────────
   * ENROLLMENT MODULE
   * ───────────────────────────────────────────── */
  enrollments: [
    { id: 'e01', studentName: 'Lily Tan',    age: 4, parentName: 'Jenny Tan',  contact: '09171234567', status: 'Pending',  appliedDate: '2025-06-01', program: 'Full Day'  },
    { id: 'e02', studentName: 'Marco Vega',  age: 3, parentName: 'Ramon Vega', contact: '09181234567', status: 'Approved', appliedDate: '2025-05-28', program: 'Half Day'  },
    { id: 'e03', studentName: 'Chloe Park',  age: 5, parentName: 'Susan Park', contact: '09191234567', status: 'Rejected', appliedDate: '2025-05-20', program: 'Full Day'  },
    { id: 'e04', studentName: 'Ryan Buan',   age: 4, parentName: 'Kris Buan',  contact: '09201234567', status: 'Pending',  appliedDate: '2025-06-05', program: 'Full Day'  },
    { id: 'e05', studentName: 'Sofia Ramos', age: 3, parentName: 'Lea Ramos',  contact: '09251234567', status: 'Approved', appliedDate: '2025-05-15', program: 'Half Day'  },
    { id: 'e06', studentName: 'James Ong',   age: 5, parentName: 'Peter Ong',  contact: '09261234567', status: 'Approved', appliedDate: '2025-05-10', program: 'Full Day'  },
  ],

  /* multi-location enrollment model */
  enrollmentAreas: [
    {
      id: 'area1',
      name: 'Area 1',
      branchName: 'Bright Minds - North Bay, California',
      classrooms: [
        { id: 'a1-infant-a', name: 'Infant Room A', type: 'Infant', minMonths: 0, maxMonths: 24, capacity: 12 },
        { id: 'a1-toddler-a', name: 'Toddler Room A', type: 'Toddler', minMonths: 24, maxMonths: 36, capacity: 14 },
      ],
      teachers: [
        { id: 'a1-t01', userId: 't01', name: 'Teacher Ana', classroomIds: ['a1-infant-a'] },
        { id: 'a1-t02', userId: null, name: 'Matthew Rivera', classroomIds: ['a1-toddler-a'] },
      ],
      students: [
        {
          id: 'a1-s01',
          firstName: 'Emma',
          lastName: 'Johnson',
          dob: '2025-09-18',
          classroomId: 'a1-infant-a',
          enrollmentStatus: 'Approved',
          photo: 'https://i.pravatar.cc/80?img=5',
          nickname: 'Em',
          address: { street: '125 Ocean View Dr', city: 'Vallejo', state: 'CA', zipCode: '94590' },
          allergies: 'Eggs',
          medications: 'None',
          medicalConditions: 'Mild eczema',
          firstDayOfSchool: '2026-01-15',
          comments: 'Admin: needs diaper cream mid-day.',
          guardian: {
            relation: 'Mother',
            fullName: 'Rachel Johnson',
            contactNumber: '(707) 555-0141',
            email: 'r.johnson@example.com',
            homeAddress: '125 Ocean View Dr, Vallejo, CA 94590',
          },
        },
        {
          id: 'a1-s02',
          firstName: 'Noah',
          lastName: 'Martinez',
          dob: '2024-10-03',
          classroomId: 'a1-infant-a',
          enrollmentStatus: 'Approved',
          photo: 'https://i.pravatar.cc/80?img=11',
          nickname: '',
          address: { street: '68 Redwood St', city: 'Napa', state: 'CA', zipCode: '94558' },
          allergies: 'None',
          medications: 'Vitamin D drops',
          medicalConditions: 'None',
          firstDayOfSchool: '2025-04-12',
          comments: '',
          guardian: {
            relation: 'Father',
            fullName: 'Carlos Martinez',
            contactNumber: '(707) 555-0173',
            email: 'c.martinez@example.com',
            homeAddress: '68 Redwood St, Napa, CA 94558',
          },
        },
        {
          id: 'a1-s03',
          firstName: 'Ava',
          lastName: 'Lee',
          dob: '2024-02-10',
          classroomId: 'a1-toddler-a',
          enrollmentStatus: 'Pending',
          photo: 'https://i.pravatar.cc/80?img=32',
          nickname: 'Avie',
          address: { street: '412 Willow Ln', city: 'Fairfield', state: 'CA', zipCode: '94533' },
          allergies: 'Peanuts',
          medications: 'EpiPen (stored onsite)',
          medicalConditions: 'Food allergy',
          firstDayOfSchool: '2026-08-01',
          comments: 'Admin only: pending medical form signature.',
          guardian: {
            relation: 'Mother',
            fullName: 'Janelle Lee',
            contactNumber: '(707) 555-0168',
            email: 'j.lee@example.com',
            homeAddress: '412 Willow Ln, Fairfield, CA 94533',
          },
        },
        {
          id: 'a1-s04',
          firstName: 'Luca',
          lastName: 'Garcia',
          dob: '2023-10-21',
          classroomId: 'a1-toddler-a',
          enrollmentStatus: 'Rejected',
          photo: 'https://i.pravatar.cc/80?img=15',
          nickname: '',
          address: { street: '91 Skyline Ct', city: 'American Canyon', state: 'CA', zipCode: '94503' },
          allergies: 'None',
          medications: 'None',
          medicalConditions: 'None',
          firstDayOfSchool: '2025-11-04',
          comments: 'Rejected due to missing immunization records.',
          guardian: {
            relation: 'Father',
            fullName: 'Diego Garcia',
            contactNumber: '(707) 555-0102',
            email: 'd.garcia@example.com',
            homeAddress: '91 Skyline Ct, American Canyon, CA 94503',
          },
        },
      ],
      scheduledTransfers: [
        {
          id: 'a1-tr-01',
          studentId: 'a1-s01',
          fromClassroomId: 'a1-infant-a',
          toClassroomId: 'a1-toddler-a',
          effectiveDate: '2027-09-18',
          reason: 'Age-based transition at 24 months',
          completedOn: null,
        },
      ],
      inquiries: [
        {
          id: 'a1-inq-01',
          familyName: 'Bennett',
          preferredClassType: 'Toddler',
          inquiryDate: '2026-07-10',
        },
      ],
    },
    {
      id: 'area2',
      name: 'Area 2',
      branchName: 'Bright Minds - South Bay, California',
      classrooms: [
        { id: 'a2-infant-a', name: 'Infant Room A', type: 'Infant', minMonths: 0, maxMonths: 24, capacity: 10 },
        { id: 'a2-toddler-a', name: 'Toddler Room A', type: 'Toddler', minMonths: 24, maxMonths: 36, capacity: 12 },
      ],
      teachers: [
        { id: 'a2-t01', userId: null, name: 'Olivia Kim', classroomIds: ['a2-infant-a'] },
        { id: 'a2-t02', userId: 't02', name: 'Teacher Ben', classroomIds: ['a2-toddler-a'] },
      ],
      students: [
        {
          id: 'a2-s01',
          firstName: 'Mila',
          lastName: 'Nguyen',
          dob: '2025-01-07',
          classroomId: 'a2-infant-a',
          enrollmentStatus: 'Approved',
          photo: 'https://i.pravatar.cc/80?img=48',
          nickname: 'Mimi',
          address: { street: '223 Harbor Blvd', city: 'San Jose', state: 'CA', zipCode: '95112' },
          allergies: 'Dairy',
          medications: 'None',
          medicalConditions: 'Lactose intolerance',
          firstDayOfSchool: '2025-08-20',
          comments: '',
          guardian: {
            relation: 'Mother',
            fullName: 'Anh Nguyen',
            contactNumber: '(408) 555-0114',
            email: 'anh.nguyen@example.com',
            homeAddress: '223 Harbor Blvd, San Jose, CA 95112',
          },
        },
        {
          id: 'a2-s02',
          firstName: 'Ethan',
          lastName: 'Wright',
          dob: '2023-12-19',
          classroomId: 'a2-toddler-a',
          enrollmentStatus: 'Approved',
          photo: 'https://i.pravatar.cc/80?img=22',
          nickname: '',
          address: { street: '77 Olive St', city: 'Santa Clara', state: 'CA', zipCode: '95050' },
          allergies: 'None',
          medications: 'None',
          medicalConditions: 'None',
          firstDayOfSchool: '2025-03-03',
          comments: '',
          guardian: {
            relation: 'Father',
            fullName: 'Jordan Wright',
            contactNumber: '(408) 555-0198',
            email: 'j.wright@example.com',
            homeAddress: '77 Olive St, Santa Clara, CA 95050',
          },
        },
        {
          id: 'a2-s03',
          firstName: 'Sofia',
          lastName: 'Baker',
          dob: '2024-05-28',
          classroomId: 'a2-toddler-a',
          enrollmentStatus: 'Pending',
          photo: 'https://i.pravatar.cc/80?img=45',
          nickname: '',
          address: { street: '403 Maple Ave', city: 'Milpitas', state: 'CA', zipCode: '95035' },
          allergies: 'Tree nuts',
          medications: 'None',
          medicalConditions: 'None',
          firstDayOfSchool: '2026-09-01',
          comments: 'Awaiting final placement.',
          guardian: {
            relation: 'Mother',
            fullName: 'Andrea Baker',
            contactNumber: '(408) 555-0130',
            email: 'a.baker@example.com',
            homeAddress: '403 Maple Ave, Milpitas, CA 95035',
          },
        },
      ],
      scheduledTransfers: [
        {
          id: 'a2-tr-01',
          studentId: 'a2-s01',
          fromClassroomId: 'a2-infant-a',
          toClassroomId: 'a2-toddler-a',
          effectiveDate: '2027-01-07',
          reason: 'Age-based transition at 24 months',
          completedOn: null,
        },
      ],
      inquiries: [
        {
          id: 'a2-inq-01',
          familyName: 'Coleman',
          preferredClassType: 'Infant',
          inquiryDate: '2026-07-12',
        },
      ],
    },
  ],

  /* ─────────────────────────────────────────────
   * PROCUREMENT MODULE
   * ───────────────────────────────────────────── */
  purchaseRequests: [
    { id: 'p01', item: 'Art Supplies Set',    qty: 10, cost: 2500, status: 'Pending',  requestedBy: 'Teacher Ana',  date: '2025-06-10', category: 'Classroom'  },
    { id: 'p02', item: 'Office Chair',        qty: 2,  cost: 8000, status: 'Approved', requestedBy: 'Jose Lim',     date: '2025-06-08', category: 'Furniture'  },
    { id: 'p03', item: 'Printer Ink (Black)', qty: 5,  cost: 1250, status: 'Pending',  requestedBy: 'Maria Santos', date: '2025-06-12', category: 'Supplies'   },
    { id: 'p04', item: 'Whiteboard Markers',  qty: 20, cost: 600,  status: 'Rejected', requestedBy: 'Teacher Ben',  date: '2025-06-03', category: 'Classroom'  },
    { id: 'p05', item: 'Disinfectant Spray',  qty: 12, cost: 1800, status: 'Approved', requestedBy: 'Diana Cruz',   date: '2025-06-01', category: 'Sanitation' },
    { id: 'p06', item: 'Construction Paper',  qty: 50, cost: 750,  status: 'Pending',  requestedBy: 'Teacher Ana',  date: '2025-06-14', category: 'Classroom'  },
  ],

  /* ─────────────────────────────────────────────
   * HR MODULE
   * ───────────────────────────────────────────── */
  employees: [
    { id: 'emp01', name: 'Maria Santos',     department: 'Administration', role: 'Executive Assistant',   startDate: '2020-01-15', status: 'Active',   email: 'm.santos@brightminds.edu'  },
    { id: 'emp02', name: 'Carlo Reyes',      department: 'Enrollment',     role: 'Enrollment Specialist', startDate: '2021-03-01', status: 'Active',   email: 'c.reyes@brightminds.edu'   },
    { id: 'emp03', name: 'Diana Cruz',       department: 'Procurement',    role: 'Procurement Officer',   startDate: '2022-07-10', status: 'Active',   email: 'd.cruz@brightminds.edu'    },
    { id: 'emp04', name: 'Jose Lim',         department: 'HR',             role: 'HR Staff',              startDate: '2019-11-20', status: 'Active',   email: 'j.lim@brightminds.edu'     },
    { id: 'emp05', name: 'Teacher Ana',      department: 'Daycare',        role: 'Lead Teacher',          startDate: '2021-06-01', status: 'Active',   email: 't.ana@brightminds.edu'     },
    { id: 'emp06', name: 'Teacher Ben',      department: 'Daycare',        role: 'Assistant Teacher',     startDate: '2023-02-14', status: 'Active',   email: 't.ben@brightminds.edu'     },
    { id: 'emp07', name: 'Grace Villanueva', department: 'Daycare',        role: 'Classroom Aide',        startDate: '2024-01-08', status: 'Active',   email: 'g.villanueva@brightminds.edu' },
    { id: 'emp08', name: 'Rico Mendoza',     department: 'Facilities',     role: 'Maintenance Staff',     startDate: '2018-05-22', status: 'On Leave', email: 'r.mendoza@brightminds.edu' },
  ],

  /* ─────────────────────────────────────────────
   * TEACHER-SPECIFIC DATA
   * Keyed by user `id` — same id that lives on the session object.
   * ───────────────────────────────────────────── */
  teachers: {
    t01: {
      fullName:   'Ana Gabriela Reyes',
      classroom:  'Sunflower Room',
      gradeLevel: 'Nursery (Ages 3–4)',
      students: [
        { id: 's01', name: 'Lily Tan',   age: 4, parentName: 'Jenny Tan',  parentContact: '09171234567', notes: 'Allergic to peanuts'  },
        { id: 's02', name: 'Ryan Buan',  age: 4, parentName: 'Kris Buan',  parentContact: '09201234567', notes: ''                     },
        { id: 's03', name: 'Mia Lopez',  age: 3, parentName: 'Tony Lopez', parentContact: '09221234567', notes: 'Early pickup Fridays'  },
        { id: 's04', name: 'Pia Santos', age: 4, parentName: 'Jun Santos', parentContact: '09241234567', notes: 'Requires hearing aid'  },
      ],
      curriculum: [
        { day: 'Monday',    time: '8:00–9:00 AM', activity: 'Colors & Shapes Recognition', objective: 'Identify 5 primary colors and basic shapes', type: 'Cognitive' },
        { day: 'Tuesday',   time: '8:00–9:00 AM', activity: 'Storytime & Comprehension',   objective: 'Listen to and retell a short story',          type: 'Language'  },
        { day: 'Wednesday', time: '8:00–9:00 AM', activity: 'Arts & Crafts (Collage)',     objective: 'Develop fine motor skills through cutting',   type: 'Creative'  },
        { day: 'Thursday',  time: '8:00–9:00 AM', activity: 'Outdoor Play & Gross Motor',  objective: 'Improve coordination and balance',            type: 'Physical'  },
        { day: 'Friday',    time: '8:00–9:00 AM', activity: 'Music & Movement',            objective: 'Follow rhythmic patterns with the body',      type: 'Social'    },
      ],
      certifications: [
        { name: 'First Aid & CPR',           issuer: 'Philippine Red Cross', issued: '2023-12-01', expiry: '2027-12-31', status: 'Valid'   },
        { name: 'Early Childhood Education', issuer: 'DepEd Accredited',    issued: '2021-06-01', expiry: '2027-06-01', status: 'Valid'   },
        { name: 'Child Safety Training',     issuer: 'DSWD',                issued: '2022-11-01', expiry: '2024-11-30', status: 'Expired' },
        { name: 'Positive Discipline',       issuer: 'UNICEF Philippines',  issued: '2023-03-15', expiry: '2027-03-15', status: 'Valid'   },
      ],
    },
    t02: {
      fullName:   'Benjamin Cruz Navarro',
      classroom:  'Rainbow Room',
      gradeLevel: 'Kinder Prep (Ages 4–5)',
      students: [
        { id: 's06', name: 'Marco Vega',  age: 3, parentName: 'Ramon Vega',  parentContact: '09181234567', notes: ''                          },
        { id: 's07', name: 'Chloe Park',  age: 5, parentName: 'Susan Park',  parentContact: '09191234567', notes: 'Advanced reader'           },
        { id: 's08', name: 'Noah Reyes',  age: 4, parentName: 'Cara Reyes',  parentContact: '09291234567', notes: ''                          },
        { id: 's09', name: 'Ella Torres', age: 3, parentName: 'Mike Torres', parentContact: '09301234567', notes: 'Speech therapy Wednesdays' },
      ],
      curriculum: [
        { day: 'Monday',    time: '8:00–9:00 AM', activity: 'Number Sense (1–10)',          objective: 'Count objects and match quantities',      type: 'Cognitive' },
        { day: 'Tuesday',   time: '8:00–9:00 AM', activity: 'Phonics & Letter Sounds',      objective: 'Recognize A–E letter sounds and forms',   type: 'Language'  },
        { day: 'Wednesday', time: '8:00–9:00 AM', activity: 'Science Exploration (Plants)', objective: 'Observe a seed germination activity',     type: 'Science'   },
        { day: 'Thursday',  time: '8:00–9:00 AM', activity: 'Dramatic Play / Role Playing', objective: 'Practice cooperative social scenarios',   type: 'Social'    },
        { day: 'Friday',    time: '8:00–9:00 AM', activity: 'Free Drawing & Expression',    objective: 'Express ideas through visual art',        type: 'Creative'  },
      ],
      certifications: [
        { name: 'First Aid & CPR',         issuer: 'Philippine Red Cross', issued: '2024-03-01', expiry: '2027-03-15', status: 'Valid'   },
        { name: 'Special Needs Inclusion', issuer: 'SPED Foundation PH',  issued: '2023-08-01', expiry: '2027-08-01', status: 'Valid'   },
        { name: 'Child Nutrition',         issuer: 'DOH Philippines',      issued: '2022-05-10', expiry: '2024-05-10', status: 'Expired' },
      ],
    },
  },

  /* ─────────────────────────────────────────────
   * EXECUTIVE SUMMARY STATS
   * ───────────────────────────────────────────── */
  executiveSummary: {
    totalEmployees:           8,
    monthlyBudgetUsed:    45000,
    monthlyBudgetTotal:  100000,
    departmentHeadcount: [
      { dept: 'Administration', count: 1 },
      { dept: 'Enrollment',     count: 1 },
      { dept: 'Procurement',    count: 1 },
      { dept: 'HR',             count: 1 },
      { dept: 'Daycare',        count: 3 },
      { dept: 'Facilities',     count: 1 },
    ],
  },
});
