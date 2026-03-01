export interface Milestone {
  id: string;
  age: string;
  ageLabel: string;
  description: string;
  colorClass: string;
  image: string;
  questions: string[];
  tips: string[];
}

export const milestones: Milestone[] = [
  {
    id: "2-months",
    age: "2 Months",
    ageLabel: "2 mo",
    description: "Check about the developmental milestones that most babies do by two months of age.",
    colorClass: "bg-pastel-peach",
    image: "/2mo.png",
    questions: [
      // Social / Emotional
      "Does your baby calm down when you speak to them or pick them up?",
      "Does your baby look at your face when you are close or talking to them?",
      "Does your baby seem happy to see you when you walk up to them?",
      "Does your baby smile when you talk to or smile at them?",

      // Language / Communication
      "Does your baby make sounds other than crying?",
      "Does your baby react to loud sounds (for example, by startling or turning their head)?",

      // Cognitive
      "Does your baby watch you as you move around?",
      "Does your baby look at a toy or object for several seconds?",

      // Movement / Physical Development
      "When placed on their tummy, does your baby hold their head up?",
      "Does your baby move both arms and both legs?",
      "Does your baby briefly open their hands?"
    ],
    tips: [
      "Talk, read, and sing to your baby",
      "Give your baby tummy time every day",
      "Respond to your baby's sounds with words"
    ]
  },

  {
    id: "4-months",
    age: "4 Months",
    ageLabel: "4 mo",
    description: "Check about the developmental milestones that most babies do by four months of age.",
    colorClass: "bg-pastel-mint",
    image: "/4mo.png",
    questions: [
      // Social / Emotional
      "Does your baby smile on their own to get your attention?",
      "Does your baby chuckle (not a full laugh) when you try to make them laugh?",
      "Does your baby look at you, move, or make sounds to get or keep your attention?",

      // Language / Communication
      "Does your baby make cooing sounds like “oooo” or “aahh”?",
      "Does your baby make sounds back when you talk to them?",
      "Does your baby turn their head toward the sound of your voice?",

      // Cognitive
      "When hungry, does your baby open their mouth when they see the breast or bottle?",
      "Does your baby look at their hands with interest?",

      // Movement / Physical Development
      "When you hold your baby, do they keep their head steady without support?",
      "Does your baby hold a toy when you place it in their hand?",
      "Does your baby use their arm to swing at toys?",
      "Does your baby bring their hands to their mouth?",
      "When placed on their tummy, does your baby push up onto their elbows or forearms?"
    ],
    tips: [
      "Provide safe toys for your baby to explore",
      "Copy your baby's sounds and encourage conversation",
      "Let your baby look in a mirror"
    ]
  },
  {
    id: "6-months",
    age: "6 Months",
    ageLabel: "6 mo",
    description: "Check about the developmental milestones that most babies do by six months of age.",
    colorClass: "bg-pastel-lavender",
    image: "/6mo.png",
    questions: [
      // Social / Emotional
      "Does your baby recognize and respond to familiar people?",
      "Does your baby like to look at themselves in a mirror?",
      "Does your baby laugh out loud?",

      // Language / Communication
      "Does your baby take turns making sounds with you?",
      "Does your baby blow “raspberries” (stick out their tongue and blow)?",
      "Does your baby make squealing noises?",

      // Cognitive
      "Does your baby put toys or other safe objects in their mouth to explore them?",
      "Does your baby reach out to grab a toy they want?",
      "Does your baby close their lips to show they do not want more food?",

      // Movement / Physical Development
      "Can your baby roll from their tummy onto their back?",
      "When on their tummy, does your baby push up with straight arms?",
      "When sitting, does your baby lean on their hands to support themselves?"
    ],
    tips: [
      "Play on the floor with your baby every day",
      "Read books together",
      "Name things when your baby looks at them"
    ]
  },
  {
    id: "9-months",
    age: "9 Months",
    ageLabel: "9 mo",
    description: "Check about the developmental milestones that most babies do by nine months of age.",
    colorClass: "bg-pastel-sky",
    image: "/9mo.png",
    questions: [
      // Social / Emotional
      "Is your baby shy, clingy, or fearful around strangers?",
      "Does your baby show different facial expressions such as happy, sad, angry, or surprised?",
      "Does your baby look when you call their name?",
      "Does your baby react when you leave (for example, by looking, reaching for you, or crying)?",
      "Does your baby smile or laugh when you play peek-a-boo?",

      // Language / Communication
      "Does your baby make many different sounds like “mamamama” or “bababababa”?",
      "Does your baby lift their arms up to be picked up?",

      // Cognitive
      "Does your baby look for objects when they are dropped out of sight, such as a toy or spoon?",
      "Does your baby bang two objects together?",

      // Movement / Physical Development
      "Can your baby get into a sitting position by themselves?",
      "Does your baby move objects from one hand to the other?",
      "Does your baby use their fingers to rake food toward themselves?",
      "Can your baby sit without support?"
    ],
    tips: [
      "Play peek-a-boo and other games",
      "Point to things and name them",
      "Let your baby explore safe spaces"
    ]
  },
  {
    id: "1-year",
    age: "1 Year",
    ageLabel: "1 yr",
    description: "Check about the developmental milestones that most babies do by one year of age.",
    colorClass: "bg-pastel-lemon",
    image: "/1yr.png",
    questions: [
      // Social / Emotional
      "Does your baby play simple games with you, such as pat-a-cake?",

      // Language / Communication
      "Does your baby wave “bye-bye”?",
      "Does your baby call a parent “mama,” “dada,” or another special name?",
      "Does your baby understand the word “no” (for example, by pausing or stopping briefly when you say it)?",

      // Cognitive
      "Does your baby put objects into a container, such as placing a block into a cup?",
      "Does your baby look for things they see you hide, like a toy under a blanket?",

      // Movement / Physical Development
      "Does your baby pull up to a standing position?",
      "Does your baby walk while holding on to furniture?",
      "Can your baby drink from a cup without a lid while you hold it?",
      "Does your baby pick up small objects using their thumb and pointer finger?"
    ],
    tips: [
      "Teach your child to wave goodbye and point",
      "Practice naming body parts",
      "Sing songs with actions"
    ]
  },
  {
    id: "15-months",
    age: "15 Months",
    ageLabel: "15 mo",
    description: "Check about the developmental milestones that most babies do by fifteen months of age.",
    colorClass: "bg-pastel-rose",
    image: "/15mo.png",
    questions: [
      // Social / Emotional
      "Does your child copy other children while playing, such as taking toys out of a container when another child does?",
      "Does your child show you an object they like?",
      "Does your child clap when excited?",
      "Does your child hug a stuffed doll or another toy?",
      "Does your child show affection, such as hugging, cuddling, or kissing you?",

      // Language / Communication
      "Does your child try to say one or two words besides “mama” or “dada,” such as “ba” for ball or “da” for dog?",
      "When you name a familiar object, does your child look at it?",
      "Does your child follow simple directions given with both words and gestures (for example, giving you a toy when you hold out your hand and say, “Give me the toy”)?",
      "Does your child point to ask for something or to get help?",

      // Cognitive
      "Does your child try to use objects the right way, such as a phone, cup, or book?",
      "Does your child stack at least two small objects, like blocks?",

      // Movement / Physical Development
      "Does your child take a few steps on their own?",
      "Does your child use their fingers to feed themselves some food?"
    ],
    tips: [
      "Let your child help with dressing",
      "Teach new words by naming things",
      "Give your child safe places to walk"
    ]
  },
  {
    id: "18-months",
    age: "18 Months",
    ageLabel: "18 mo",
    description: "Check about the developmental milestones that most babies do by eighteen months of age.",
    colorClass: "bg-pastel-coral",
    image: "/18mo.png",
    questions: [
      // Social / Emotional
      "Does your child move away from you but look back to make sure you are nearby?",
      "Does your child point to show you something interesting?",
      "Does your child put their hands out for you to wash them?",
      "Does your child look at a few pages in a book with you?",
      "Does your child help you dress them, such as pushing an arm through a sleeve or lifting a foot?",

      // Language / Communication
      "Does your child try to say three or more words besides “mama” or “dada”?",
      "Does your child follow simple one-step directions without gestures, such as giving you a toy when you say, “Give it to me”?",

      // Cognitive
      "Does your child copy you doing chores, like sweeping with a broom?",
      "Does your child play with toys in a simple way, such as pushing a toy car?",

      // Movement / Physical Development
      "Does your child walk without holding on to anyone or anything?",
      "Does your child scribble with a crayon or pencil?",
      "Can your child drink from a cup without a lid, even if some spills?",
      "Does your child feed themselves using their fingers?",
      "Does your child try to use a spoon?",
      "Can your child climb on and off a couch or chair without help?"
    ],
    tips: [
      "Encourage pretend play",
      "Let your child help with simple chores",
      "Read together every day"
    ]
  },
  {
    id: "2-years",
    age: "2 Years",
    ageLabel: "2 yrs",
    description: "Check about the developmental milestones that most babies do by two years of age.",
    colorClass: "bg-pastel-mint",
    image: "/2yr.png",
    questions: [
      "When someone nearby is crying or upset, does your child notice and react (for example, stops playing, looks at them, or looks concerned)?",
      "In a new or unfamiliar situation, does your child look at you to see how you react before responding?",
      "When you ask your child to find something in a book (for example, 'Where is the dog?'), does your child point to the correct picture?",
      "Does your child put two words together when speaking (for example, 'more milk,' 'mommy go')?",
      "When asked, can your child point to at least two body parts, such as nose, eyes, ears, or tummy?",
      "Does your child use different gestures besides waving or pointing, such as blowing a kiss, nodding yes, or shaking their head no?",
      "Can your child hold one object in one hand while using the other hand, like holding a cup and taking the lid off?",
      "Does your child try to use buttons, switches, or knobs on toys or household objects?",
      "Does your child play with more than one toy at the same time, such as holding a toy spoon while putting toy food on a plate?",
      "Can your child kick a ball forward?",
      "Does your child run on their own, not just walk fast?",
      "Can your child walk up a few stairs (not crawl or climb), with or without holding someone's hand?",
      "Does your child feed themselves using a spoon, even if some food spills?"
    ],
    tips: [
      "Encourage your child to play with other children",
      "Help your child learn new words by reading together",
      "Let your child help with simple tasks like putting toys away"
    ]
  },
  {
    id: "30-months",
    age: "30 Months",
    ageLabel: "2.5 yrs",
    description: "Check about the developmental milestones that most babies do by thirty months of age.",
    colorClass: "bg-pastel-lavender",
    image: "/30mo.png",
    questions: [
      // Social / Emotional
      "Does your child play next to other children and sometimes play with them?",
      "Does your child show you what they can do by saying things like, “Look at me!”?",
      "Does your child follow simple routines when told, such as helping to pick up toys when you say, “It’s clean-up time”?",

      // Language / Communication
      "Does your child say about 50 different words?",
      "Does your child say two or more words together, including an action word, such as “Doggie run”?",
      "When you point to pictures in a book and ask, “What is this?”, does your child name them?",
      "Does your child use words like “I,” “me,” or “we”?",

      // Cognitive
      "Does your child use objects to pretend, such as feeding a block to a doll as if it were food?",
      "Does your child show simple problem-solving skills, like standing on a small stool to reach something?",
      "Does your child follow two-step instructions, such as “Put the toy down and close the door”?",
      "Does your child show they know at least one color, like pointing to a red crayon when you ask which one is red?",

      // Movement / Physical Development
      "Does your child use their hands to twist objects, such as turning doorknobs or unscrewing lids?",
      "Does your child take off some clothing by themselves, like loose pants or an open jacket?",
      "Does your child jump off the ground with both feet?",
      "Does your child turn book pages one at a time when you read together?"
    ],
    tips: [
      "Arrange playdates with other children",
      "Ask your child questions about books",
      "Encourage imagination and pretend play"
    ]
  },
  {
    id: "3-years",
    age: "3 Years",
    ageLabel: "3 yrs",
    description: "Check about the developmental milestones that most babies do by three years of age.",
    colorClass: "bg-pastel-peach",
    image: "/3yr.png",
    questions: [
      // Social / Emotional
      "When you leave, does your child calm down within about 10 minutes, such as at childcare drop-off?",
      "Does your child notice other children and join them to play?",

      // Language / Communication
      "Does your child talk with you in conversation using at least two back-and-forth exchanges?",
      "Does your child ask questions like “who,” “what,” “where,” or “why”?",
      "When looking at a picture or book, does your child say what action is happening, such as “running” or “eating”?",
      "When asked, can your child say their first name?",
      "Does your child talk clearly enough for other people to understand most of the time?",

      // Cognitive
      "When you show them how, can your child draw a circle?",
      "Does your child avoid touching hot objects, like a stove, when you warn them?",

      // Movement / Physical Development
      "Does your child string items together, such as large beads or macaroni?",
      "Does your child put on some clothes by themselves, like loose pants or a jacket?",
      "Does your child use a fork?"
    ],
    tips: [
      "Play make-believe with your child",
      "Talk about feelings",
      "Set consistent limits and routines"
    ]
  },
  {
    id: "4-years",
    age: "4 Years",
    ageLabel: "4 yrs",
    description: "Check about the developmental milestones that most babies do by four years of age.",
    colorClass: "bg-pastel-sky",
    image: "/4yr.png",
    questions: [
      // Social / Emotional
      "Does your child pretend to be something else during play, such as a teacher, superhero, or animal?",
      "If no children are around, does your child ask to go play with other children?",
      "Does your child comfort others who are hurt or sad, such as hugging a crying friend?",
      "Does your child avoid danger, like not jumping from high places at the playground?",
      "Does your child like to help with tasks or activities?",
      "Does your child change their behavior based on where they are, such as a library, place of worship, or playground?",

      // Language / Communication
      "Does your child say sentences with four or more words?",
      "Does your child say some words from a song, story, or nursery rhyme?",
      "Does your child talk about at least one thing that happened during their day?",
      "Does your child answer simple questions like “What is a coat for?” or “What is a crayon for?”?",

      // Cognitive
      "Can your child name a few colors of objects?",
      "Does your child tell what comes next in a well-known story?",
      "Can your child draw a person with three or more body parts?",

      // Movement / Physical Development
      "Does your child catch a large ball most of the time?",
      "Can your child serve themselves food or pour water with adult supervision?",
      "Does your child unbutton some buttons?",
      "Does your child hold a crayon or pencil between their fingers and thumb, rather than in a fist?"
    ],
    tips: [
      "Encourage creative play",
      "Let your child make choices",
      "Help your child learn to solve problems"
    ]
  },
  {
    id: "5-years",
    age: "5 Years",
    ageLabel: "5 yrs",
    description: "Check about the developmental milestones that most babies do by five years of age.",
    colorClass: "bg-pastel-sage",
    image: "/5yr.png",
    questions: [
      // Social / Emotional
      "Does your child follow rules or take turns when playing games with other children?",
      "Does your child sing, dance, or act for you?",
      "Does your child do simple chores at home, such as matching socks or clearing the table?",

      // Language / Communication
      "Can your child tell a story they heard or made up that includes at least two events?",
      "After you read or tell a story, does your child answer simple questions about it?",
      "Does your child keep a conversation going with more than three back-and-forth exchanges?",
      "Does your child use or recognize simple rhymes, such as bat–cat or ball–tall?",

      // Cognitive
      "Can your child count to 10?",
      "When you point to numbers between 1 and 5, can your child name some of them?",
      "Does your child use words about time, such as “yesterday,” “tomorrow,” “morning,” or “night”?",
      "Can your child pay attention for 5 to 10 minutes during activities like story time or arts and crafts (not including screen time)?",
      "Does your child write some letters in their name?",
      "When you point to letters, can your child name some of them?",

      // Movement / Physical Development
      "Does your child button some buttons?",
      "Can your child hop on one foot?"
    ],
    tips: [
      "Encourage your child to play with others",
      "Talk about school and what they're learning",
      "Let your child help solve simple problems"
    ]
  }
];

export const tableOfContents = milestones.map(m => ({
  id: m.id,
  label: `Milestones by ${m.age}`
}));
