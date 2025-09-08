const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Language = require('../models/Language');
const Lesson = require('../models/Lesson');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/contritok', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Language.deleteMany({});
    await Lesson.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@contritok.com',
      password: adminPassword,
      role: 'admin'
    });
    console.log('Created admin user');

    // Create sample regular user
    const userPassword = await bcrypt.hash('user123', 12);
    const sampleUser = await User.create({
      name: 'John Doe',
      email: 'user@contritok.com',
      password: userPassword,
      role: 'user'
    });
    console.log('Created sample user');

    // Create languages
    const languages = [
      {
        name: 'Duala',
        code: 'DUA',
        region: 'Littoral',
        description: 'Coastal Bantu language spoken by the Duala people around Douala',
        family: 'Niger-Congo',
        speakers: 87700,
        difficulty: 'Beginner',
        flag: '🇨🇲',
        metadata: {
          culturalNotes: 'The Duala people are known for their rich maritime culture and historical role in trade along the Cameroon coast.',
          writingSystem: 'Latin script',
          phoneticNotes: 'Tonal language with high and low tones affecting word meaning',
          grammarNotes: 'Features noun class system typical of Bantu languages with subject-verb-object word order'
        },
        stats: {
          totalLessons: 0,
          totalWords: 0,
          enrolledUsers: 0
        }
      },
      {
        name: 'Bamileke',
        code: 'BAM',
        region: 'West',
        description: 'Grassfields language spoken by the Bamileke people in western Cameroon',
        family: 'Niger-Congo',
        speakers: 300000,
        difficulty: 'Intermediate',
        flag: '🇨🇲',
        metadata: {
          culturalNotes: 'Known for their complex chieftaincy system, artistic traditions, and entrepreneurial spirit.',
          writingSystem: 'Latin script',
          phoneticNotes: 'Complex tonal system with multiple tone levels and tone sandhi rules',
          grammarNotes: 'Rich verbal morphology with extensive use of serial verb constructions'
        },
        stats: {
          totalLessons: 0,
          totalWords: 0,
          enrolledUsers: 0
        }
      },
      {
        name: 'Fulfulde',
        code: 'FUL',
        region: 'North',
        description: 'Atlantic language spoken by the Fulani people in northern Cameroon',
        family: 'Niger-Congo',
        speakers: 1000000,
        difficulty: 'Advanced',
        flag: '🇨🇲',
        metadata: {
          culturalNotes: 'Pastoral people known for cattle herding and Islamic scholarship traditions.',
          writingSystem: 'Latin script and Arabic script (Ajami)',
          phoneticNotes: 'Non-tonal language with complex consonant system including ejectives',
          grammarNotes: 'Noun class system with over 20 classes and complex verbal inflection'
        },
        stats: {
          totalLessons: 0,
          totalWords: 0,
          enrolledUsers: 0
        }
      },
      {
        name: 'Ewondo',
        code: 'EWO',
        region: 'Centre',
        description: 'Bantu language spoken by the Ewondo people in central Cameroon',
        family: 'Niger-Congo',
        speakers: 577700,
        difficulty: 'Beginner',
        flag: '🇨🇲',
        metadata: {
          culturalNotes: 'Traditional hunters and farmers with rich oral traditions and storytelling.',
          writingSystem: 'Latin script',
          phoneticNotes: 'Tonal language with high, mid, and low tones',
          grammarNotes: 'Bantu noun class system with agglutinative verbal morphology'
        },
        stats: {
          totalLessons: 0,
          totalWords: 0,
          enrolledUsers: 0
        }
      }
    ];

    const createdLanguages = await Language.insertMany(languages);
    console.log(`Created ${createdLanguages.length} languages`);

    // Create lessons for Duala
    const dualaLanguage = createdLanguages.find(lang => lang.name === 'Duala');
    const dualaLessons = [
      {
        title: 'Basic Greetings',
        description: 'Learn essential greetings and polite expressions in Duala',
        language: dualaLanguage._id,
        level: 1,
        order: 1,
        difficulty: 'Beginner',
        estimatedDuration: 10,
        words: [
          {
            english: 'Hello',
            translation: 'Mbolo',
            pronunciation: 'mm-BOH-loh',
            partOfSpeech: 'interjection',
            example: {
              native: 'Mbolo, na ndé o kala?',
              english: 'Hello, how are you?'
            },
            difficulty: 'easy'
          },
          {
            english: 'Good morning',
            translation: 'Mbolo ma gonya',
            pronunciation: 'mm-BOH-loh mah GOH-nyah',
            partOfSpeech: 'phrase',
            example: {
              native: 'Mbolo ma gonya, tata',
              english: 'Good morning, father'
            },
            difficulty: 'easy'
          },
          {
            english: 'Good evening',
            translation: 'Mbolo ma muèndè',
            pronunciation: 'mm-BOH-loh mah moo-EN-deh',
            partOfSpeech: 'phrase',
            example: {
              native: 'Mbolo ma muèndè, mama',
              english: 'Good evening, mother'
            },
            difficulty: 'easy'
          },
          {
            english: 'Goodbye',
            translation: 'Kèlè',
            pronunciation: 'KEH-leh',
            partOfSpeech: 'interjection',
            example: {
              native: 'Kèlè, na bôna ngoso',
              english: 'Goodbye, see you tomorrow'
            },
            difficulty: 'easy'
          },
          {
            english: 'Thank you',
            translation: 'Matonya',
            pronunciation: 'mah-TOH-nyah',
            partOfSpeech: 'phrase',
            example: {
              native: 'Matonya mingi',
              english: 'Thank you very much'
            },
            difficulty: 'easy'
          },
          {
            english: 'Please',
            translation: 'Ndolo',
            pronunciation: 'nn-DOH-loh',
            partOfSpeech: 'adverb',
            example: {
              native: 'Ndolo, pèsè mba wèlè',
              english: 'Please, give me water'
            },
            difficulty: 'easy'
          },
          {
            english: 'Excuse me',
            translation: 'Pardong',
            pronunciation: 'par-DONG',
            partOfSpeech: 'phrase',
            example: {
              native: 'Pardong, o si ndé?',
              english: 'Excuse me, where are you going?'
            },
            difficulty: 'medium'
          },
          {
            english: 'How are you?',
            translation: 'Na ndé o kala?',
            pronunciation: 'nah nn-DEH oh KAH-lah',
            partOfSpeech: 'phrase',
            example: {
              native: 'Mbolo, na ndé o kala?',
              english: 'Hello, how are you?'
            },
            difficulty: 'medium'
          }
        ],
        content: {
          introduction: 'Welcome to your first Duala lesson! Greetings are essential in Duala culture and show respect and politeness.',
          culturalContext: 'In Duala culture, proper greetings are very important. Always greet elders first and use appropriate titles.',
          grammarNotes: 'Duala greetings often include time-specific expressions. "Ma gonya" means morning, "ma muèndè" means evening.',
          tips: [
            'Practice the tonal patterns - Duala is a tonal language',
            'Pay attention to the pronunciation guides',
            'Use greetings in context with family titles like "tata" (father) and "mama" (mother)'
          ]
        },
        createdBy: adminUser._id,
        isActive: true,
        isLocked: false
      },
      {
        title: 'Family Members',
        description: 'Learn words for family relationships and kinship terms',
        language: dualaLanguage._id,
        level: 1,
        order: 2,
        difficulty: 'Beginner',
        estimatedDuration: 15,
        words: [
          {
            english: 'Father',
            translation: 'Tata',
            pronunciation: 'TAH-tah',
            partOfSpeech: 'noun',
            example: {
              native: 'Tata wam a kala ndé?',
              english: 'Where is my father?'
            },
            difficulty: 'easy'
          },
          {
            english: 'Mother',
            translation: 'Mama',
            pronunciation: 'MAH-mah',
            partOfSpeech: 'noun',
            example: {
              native: 'Mama wam a lam bèlè',
              english: 'My mother is cooking food'
            },
            difficulty: 'easy'
          },
          {
            english: 'Child',
            translation: 'Muna',
            pronunciation: 'MU-nah',
            partOfSpeech: 'noun',
            example: {
              native: 'Muna muèndè a kèndè sukulu',
              english: 'The child goes to school'
            },
            difficulty: 'easy'
          },
          {
            english: 'Brother',
            translation: 'Koko',
            pronunciation: 'KOH-koh',
            partOfSpeech: 'noun',
            example: {
              native: 'Koko wam a si Douala',
              english: 'My brother went to Douala'
            },
            difficulty: 'easy'
          },
          {
            english: 'Sister',
            translation: 'Nkinda',
            pronunciation: 'nn-KIN-dah',
            partOfSpeech: 'noun',
            example: {
              native: 'Nkinda wam a bèlè mingi',
              english: 'My sister is very beautiful'
            },
            difficulty: 'easy'
          },
          {
            english: 'Grandfather',
            translation: 'Tata mukulu',
            pronunciation: 'TAH-tah mu-KU-lu',
            partOfSpeech: 'noun',
            example: {
              native: 'Tata mukulu a tènè masano',
              english: 'Grandfather tells stories'
            },
            difficulty: 'medium'
          }
        ],
        content: {
          introduction: 'Family is central to Duala culture. Learn the important kinship terms.',
          culturalContext: 'Respect for elders is paramount. Family titles are used even for non-relatives as signs of respect.',
          grammarNotes: 'Family terms can be modified with possessive pronouns: "wam" (my), "wao" (his/her).',
          tips: [
            'Practice with possessive pronouns',
            'Remember that respect terms extend beyond blood family',
            'Age and gender distinctions are important in family terms'
          ]
        },
        createdBy: adminUser._id,
        isActive: true,
        isLocked: false
      },
      {
        title: 'Numbers 1-10',
        description: 'Learn to count from one to ten in Duala',
        language: dualaLanguage._id,
        level: 1,
        order: 3,
        difficulty: 'Beginner',
        estimatedDuration: 12,
        words: [
          {
            english: 'One',
            translation: 'Dina',
            pronunciation: 'DEE-nah',
            partOfSpeech: 'noun',
            example: {
              native: 'Na bèlè dina',
              english: 'I want one'
            },
            difficulty: 'easy'
          },
          {
            english: 'Two',
            translation: 'Bèbè',
            pronunciation: 'BEH-beh',
            partOfSpeech: 'noun',
            example: {
              native: 'Bèbè ba muna',
              english: 'Two children'
            },
            difficulty: 'easy'
          },
          {
            english: 'Three',
            translation: 'Bèlalo',
            pronunciation: 'beh-LAH-loh',
            partOfSpeech: 'noun',
            example: {
              native: 'Bèlalo ba ndabo',
              english: 'Three houses'
            },
            difficulty: 'easy'
          },
          {
            english: 'Four',
            translation: 'Bènè',
            pronunciation: 'BEH-neh',
            partOfSpeech: 'noun',
            example: {
              native: 'Bènè ba sanja',
              english: 'Four weeks'
            },
            difficulty: 'easy'
          },
          {
            english: 'Five',
            translation: 'Bètanu',
            pronunciation: 'beh-TAH-nu',
            partOfSpeech: 'noun',
            example: {
              native: 'Bètanu ba mbèngè',
              english: 'Five coins'
            },
            difficulty: 'medium'
          }
        ],
        content: {
          introduction: 'Numbers are essential for daily communication. Master counting in Duala.',
          culturalContext: 'Numbers are used in traditional counting systems and market transactions.',
          grammarNotes: 'Duala numbers agree with noun classes. "Ba" is used for plural human nouns.',
          tips: [
            'Practice counting objects around you',
            'Notice the noun class agreements',
            'Use numbers in practical contexts like shopping'
          ]
        },
        createdBy: adminUser._id,
        isActive: true,
        isLocked: false
      }
    ];

    const createdLessons = await Lesson.insertMany(dualaLessons);
    console.log(`Created ${createdLessons.length} lessons for Duala`);

    // Update language stats
    await Language.findByIdAndUpdate(dualaLanguage._id, {
      $set: {
        'stats.totalLessons': createdLessons.length,
        'stats.totalWords': createdLessons.reduce((sum, lesson) => sum + lesson.words.length, 0)
      }
    });

    console.log('Database seeded successfully!');
    console.log('\n=== Login Credentials ===');
    console.log('Admin: admin@contritok.com / admin123');
    console.log('User: user@contritok.com / user123');
    console.log('========================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();
