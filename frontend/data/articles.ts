export interface Article {
  id: string;
  title: string;
  summary: string;
  content?: string;
  imageUrl: string;
  sourceUrl: string;
  sourceName: string;
  category: string;
  readTime: string;
  publishedDate: string;
}

export const articles: Article[] = [
  {
    id: "what-is-asd",
    title: "What is Autism Spectrum Disorder (ASD)?",
    summary:
      "Autism Spectrum Disorder (ASD) is a developmental condition that affects how people perceive and interact with the world around them. It's called a 'spectrum' because it affects individuals differently and to varying degrees. Some people with autism may need significant support in their daily lives, while others may need less support and, in some cases, live entirely independently. ASD is characterized by differences in social communication, sensory processing, and patterns of behavior or interests. Early identification and understanding can make a significant difference in supporting individuals with autism to reach their full potential. Research shows that with the right support and understanding, people with autism can lead fulfilling, meaningful lives.",
    content: `

Why Autism Is Called a Spectrum?

## Some individuals with autism may require significant daily support, while others live independently and thrive in academic or professional environments. Strengths and challenges differ widely from person to person.

Common Characteristics

- Differences in social communication and interaction
- Repetitive behaviors or focused interests
- Sensory sensitivities to sounds, textures, lights, or smells
- A strong preference for routines and predictability


Importance of Early Understanding

## Early identification and understanding allow families to access appropriate support services sooner. Research shows that early intervention can greatly improve communication skills, learning, and emotional regulation. Living with Autism with acceptance, support, and strength-based approaches, individuals with autism can lead meaningful, fulfilling lives and contribute uniquely to their communities.
    `,
    imageUrl:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop",
    sourceUrl: "https://www.cdc.gov/autism/",
    sourceName: "CDC - Centers for Disease Control and Prevention",
    category: "Understanding ASD",
    readTime: "5 min read",
    publishedDate: "January 15, 2026",
  },

  {
    id: "early-signs",
    title: "Early Signs of Autism in Children",
    summary:
      "Recognizing the early signs of autism in children can help families seek guidance, screening, and support at the right time. Early awareness allows parents and caregivers to better understand developmental differences and take steps that support communication, learning, and emotional growth during critical stages of childhood.",
    content: `

Why Early Signs Matter?

## Early identification of autism allows children to receive support during key developmental periods, improving long-term outcomes.


Social Communication Signs

- Limited eye contact
- Delayed speech or language development
- Not responding to their name
- Difficulty sharing interests or emotions

Behavioral Indicators

- Engage in repetitive movements
- Show strong attachment to routines
- Become distressed by small changes

When to Seek Professional Advice

## If concerns arise, consulting a pediatrician or developmental specialist is recommended. Screening does not provide a diagnosis but helps determine whether further evaluation is needed. Early support empowers families to understand their child’s needs and nurture their strengths in a compassionate, informed way.
    `,
    imageUrl:
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop",
    sourceUrl: "https://www.autismspeaks.org/signs-autism",
    sourceName: "Autism Speaks",
    category: "Early Detection",
    readTime: "4 min read",
    publishedDate: "January 10, 2026",
  },

  {
    id: "supporting-your-child",
    title: "Supporting Your Child with Autism at Home",
    summary:
      "If your child has autism spectrum disorder, or if you suspect that they do, it may be confusing to know what you can do to help them. First, it is important to know that autism is a spectrum. (This is why it is often now referred to as autism spectrum disorder, or ASD, rather than autism). This means that some children might have symptoms that are not even noticeable to many other people. Other children might have more visible challenges. Just like no two people are alike, no two people with autism are alike. And, as with any child, it is important to parent your own, unique child according to their individual needs. These will be different for every child with autism, just as they are different for every child. Even so, there are some common challenges that children with autism can face. For example, many children with autism have trouble managing social interactions, such as engaging in the give-and-take of conversation or making eye contact. Many children with autism may also engage in repetitive behaviours, like lining their shoes up in a row or rocking back and forth.",
    content: `

The first step to supporting your child: understanding autism
- As a parent, one of the most important things you can do to support a child with autism is to understand more about it. This includes knowing that autism is a spectrum, and that symptoms may look different in different children. Autism is a lifelong condition. By getting the support that they need, as early as possible, individuals with autism can learn how to cope and live fulfilling, rewarding lives. 

Know your child's rights
- One of the best ways to support a child with autism is to understand what rights they have. Like every child, a child with autism has the right to safety, security, a quality education, and to getting the support they need to achieve the best physical and mental health possible. These rights are enshrined in international law, including the Convention on the Rights of the Child and Convention on the Rights of Persons with Disabilities.

How to get your child the support that they need
- One of the first things you can do to help your child is to get them specialized help. This might include early intervention programmes and additional support for your child's learning. Research on children with autism has found that, when they are enrolled in these kinds of interventions, they go on to fare much better than children who are not, or who are enrolled later. For example, children in early intervention programmes experience reduced autism symptoms and develop better communication skills than children who are not in such programmes.

Look after yourself
- Being a parent can be stressful and tiring. Being a parent to a child with autism can feel especially so, whether because of your child's challenges or because of having to spend time and energy getting them the support that they need.

Remember, your child with autism is still a child
- Above all, it may be most important to remember that, while a child with autism will have specific needs, they are a child. This means that they do best in safe, secure, predictable surroundings and from nurturing, responsive care. And, like any child, they need unconditional love and acceptance in order to thrive.
    `,
    imageUrl:
      "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&auto=format&fit=crop",
    sourceUrl: "https://www.autism.org/",
    sourceName: "Autism Research Institute",
    category: "Family Support",
    readTime: "8 min read",
    publishedDate: "January 8, 2026",
  },

  {
    id: "therapy-options",
    title: "Therapy and Intervention Options for ASD",
    summary: "Every child or adult with autism has unique strengths and challenges, so there is no one size fits all approach to autism treatment and intervention. Many people with autism have additional medical conditions such as sleep disturbance, seizures and gastrointestinal (GI) distress. Addressing these conditions can improve attention, learning and related behaviors. Many people also benefit from therapies for communication, social skills, or motor challenges, or to learn other skills like feeding or self-care. Each autism intervention or treatment plan should be tailored to address the person's specific needs. A person’s treatment plan can include behavioral interventions, other therapies, medicines or a combination of these.", 
    content: `

Understanding Therapy Options
- There is no single therapy that works for everyone with autism. Support is most effective when tailored to individual needs.

Common Therapies
- Speech and language therapy
- Occupational therapy
- Behavioral interventions such as ABA
- Social skills training

Choosing the Right Support
- Therapy plans should consider strengths, challenges, family goals, and cultural values.

Long-Term Benefits
- Consistent intervention can improve independence, emotional regulation, and overall quality of life.

Treating associated medical conditions
## A number of medical and mental-health issues frequently accompany autism spectrum disorder. These include:
- Epilepsy
- Gastrointestinal problems
- Feeding
- Sleep disturbances
- Attention-deficit/hyperactivity disorder
- Anxiety
- Depression
- Obsessive compulsive disorder
    `,
    imageUrl:
      "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&auto=format&fit=crop",
    sourceUrl:
      "https://www.nimh.nih.gov/health/topics/autism-spectrum-disorders-asd",
    sourceName: "National Institute of Mental Health",
    category: "Treatment",
    readTime: "7 min read",
    publishedDate: "January 5, 2026",
  },

  {
    id: "sensory-processing",
    title: "Understanding Sensory Processing in Autism",
    summary:
      "Sensory processing is how people feel and react to information received from their senses. Autistic people can be much more or less sensitive to sensory experiences than non-autistic people. You may seek out, avoid or become overwhelmed by sounds, lights, smells, tastes and textures, or face challenges with other senses.",
    content: `
What Is Sensory Processing?
## Sensory processing is how your brain interprets information received from your senses (this information is known as ‘sensory input’). This process is how you feel and react to things in your environment and sensations in your body. The five main senses are: 
- sight          (sensory inputs: light; colour; pattern) 
- hearing     (sensory input: sound) 
- smell         (sensory input: odour/scent) 
- taste         (sensory input: flavour) 
- touch        (sensory inputs: texture; pressure; heat/cold). 

Common Sensory Differences
## Individuals with autism may be:
- Over-sensitive to noise or textures
- Under-responsive to pain or temperature
- Seeking sensory input through movement or pressure

Types of sensory processing difference 
- Hyper-sensitivity – this means you are much more sensitive than other people. You may avoid or become irritated or distressed by too much sensory input. Too much input can lead to ‘sensory overload’. You may also enjoy your sensitivity to favourite sensory inputs. 
- Hypo-sensitivity – this means you are much less sensitive than other people. You may not notice sensory inputs and may become bored, frustrated or distressed by too little sensory input. You may seek out more intense sensory experiences in order to get more input. 

Sensory processing differences in autistic people
- Exactly how many autistic people experience sensory processing differences is not known. Research suggests it is between 53% (just over half) and 95% (almost all). People often describe sensory processing differences as ‘sensory issues’ or, for hyper-sensitivity, as ‘sensory sensitivity’. 

Creating Sensory-Friendly Environments
- Adjustments like reducing noise, offering sensory breaks, and respecting preferences can greatly improve comfort and participation.

Examples of challenging sensory environments
## Shopping centres 
- be very crowded and hot 
- have bright, fluorescent lighting 
- be visually chaotic, with different branding and displays from each shop 
- play loud music, often clashing music from many different shops 
- have busy food halls with many different smells 
- be difficult to navigate, for example to find the exit or the toilets. 
    `,
    imageUrl: "/landing.jpg",
    sourceUrl: "https://www.autism.org.uk/advice-and-guidance/about-autism/sensory-processing",
    sourceName: "National Autistic Society",
    category: "Sensory",
    readTime: "10 min read",
    publishedDate: "January 3, 2026",
  },

  {
    id: "levels-of-autism",
    title: "Severity levels for autism spectrum disorder",
    summary: "In 2013, the American Psychiatric Association (APA) released the fifth edition of the Diagnostic and Statistical Manual of Mental Disorders (DSM-5), the handbook used to diagnose of mental disorders, including autism. The DSM-5 introduced three ASD levels of severity: level 1 (“requiring support”), level 2 (“requiring substantial support”), and level 3 (“requiring very substantial support”). The full-text of the DSM-5 severity levels for autism spectrum disorder (ASD) is provided below with permission from the APA.",  
    content: `

Level 1 autism: “Requiring support”

Social communication
- Without supports in place, deficits in social communication cause noticeable impairments. Difficulty initiating social interactions, and clear examples of atypical or unsuccessful response to social overtures of others. May appear to have decreased interest in social interactions. For example, a person who is able to speak in full sentences and engages in communication but whose to- and-fro conversation with others fails, and whose attempts to make friends are odd and typically unsuccessful.

Restricted, repetitive behaviors
- Inflexibility of behavior causes significant interference with functioning in one or more contexts. Difficulty switching between activities. Problems of organization and planning hamper independence.
  
Level 2 autism: “Requiring substantial support”

Social communication
- Marked deficits in verbal and nonverbal social communication skills; social impairments apparent even with supports in place; limited initiation of social interactions; and reduced or abnormal responses to social overtures from others. For example, a person who speaks simple sentences, whose interaction is limited to narrow special interests, and how has markedly odd nonverbal communication.

Restricted, repetitive behaviors
- Inflexibility of behavior, difficulty coping with change, or other restricted/repetitive behaviors appear frequently enough to be obvious to the casual observer and interfere with functioning in a variety of contexts. Distress and/or difficulty changing focus or action.

Level 3 autism: “Requiring very substantial support"

Social communication
- Severe deficits in verbal and nonverbal social communication skills cause severe impairments in functioning, very limited initiation of social interactions, and minimal response to social overtures from others. For example, a person with few words of intelligible speech who rarely initiates interaction and, when he or she does, makes unusual approaches to meet needs only and responds to only very direct social approaches

Restricted, repetitive behaviors
- Inflexibility of behavior, extreme difficulty coping with change, or other restricted/repetitive behaviors markedly interfere with functioning in all spheres. Great distress/difficulty changing focus or action.
  `,
    imageUrl: "/children-circle.jpg",
    sourceUrl: "https://www.autismspeaks.org/levels-of-autism",
    sourceName: "Autism Speaks",
    category: "Levels of ASD",
    readTime: "8 min read",
    publishedDate: "January 15, 2026",
  },


  {
    id: "level-1",
    title: "ASD Level 1: Requiring Support",
    summary: "Autism Spectrum Disorder (ASD) is a broad condition with different levels of support needs. Level 1 Autism Spectrum Disorder, sometimes referred to as high-functioning autism or formerly known as Asperger’s syndrome, is the mildest form of ASD. However, “mild” does not mean it has no impact. People with Level 1 autism often have unique strengths but may still require specific types of support to thrive in school, work, and social situations.",
    content: `
What is Level 1 Autism Spectrum Disorder?
- According to the DSM-5 (Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition), autism is categorized into three levels based on the amount of support required. Level 1 autism means a person requires support but is generally able to manage daily activities with minimal assistance. Individuals with Level 1 autism typically have average to above-average intelligence and strong language skills, but they may face difficulties with social communication and may display restricted or repetitive behaviors. With the right intervention including therapies such as Applied Behavior Analysis (ABA) many can develop skills that help them navigate challenges more effectively.

Early Signs of Level 1 Autism
## Recognizing autism level 1 symptoms early can make a big difference in accessing the right support. While every person is different, common early indicators may include:

- Difficulty starting or maintaining conversations
- Trouble understanding social cues, such as tone of voice or facial expressions
- A tendency to talk at length about specific interests
- Preference for routines and distress when routines are disrupted
- Strong focus on particular hobbies or topics
- Sensory sensitivities, such as being overwhelmed by loud noises or certain textures
## For children, signs may appear in preschool or earlier, while for adults, these traits may have been present since childhood but were never formally identified.

What Does Level 1 Autism Look Like in Daily Life?
## People with Level 1 autism can live independently, attend mainstream schools, and work in a variety of professions. However, they may:

- Feel socially isolated or misunderstood
- Find group work or unstructured social interactions challenging
- Experience anxiety in new or unpredictable situations
- Have difficulty adapting to change
- Excel in areas that require attention to detail but struggle with multitasking
- The social differences may be subtle to outsiders, which is why Level 1 autism can sometimes be overlooked or misunderstood.

Challenges Faced by Individuals with Level 1 Autism
## Even though Level 1 autism is considered “mild,” the challenges are real and can impact quality of life without proper support.

1. Social Communication Barriers
- Understanding sarcasm, metaphors, or implied meanings can be hard. This can sometimes lead to misunderstandings or feelings of exclusion. You might also like to read Social Skills Groups in ABA Therapy.

2. Sensory Processing Differences
- Bright lights, loud sounds, or certain textures can cause discomfort, leading to avoidance of certain environments.

3. Rigid Thinking Patterns
- A strong preference for routines and resistance to change can make unexpected transitions stressful.

4. Emotional Regulation Difficulties
- Managing frustration, anxiety, or sensory overload may require learned coping strategies.
    `,
    imageUrl:"https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop",
    sourceUrl: "https://abcachieve.com/understanding-level-1-autism/",
    sourceName: "Autism Spectrum Disorder Level 1 Support",
    category: "ASD Levels",
    readTime: "5 min read",
    publishedDate: "January 20, 2026",
  },

  {
    id: "level-2",
    title: "ASD Level 2: Requiring Substantial Support",
    summary: "Level 2 Autism, as defined in the Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition (DSM-5), signifies that children experience substantial challenges in social communication and display repetitive or restrictive behaviors. These challenges demonstrably affect their ability to function in various aspects of daily life, requiring ongoing support. Unlike Level 3, where children require very substantial support, Level 2 indicates that these children can often function better with the right support systems in place.",
    content: `
Signs of Level 2 Autism
- As we have mentioned above, autism Level 2 is a moderate level of autism. Children with Level 2 autism often experience difficulties in the following areas:

Social Communication
- Children may struggle to initiate or maintain social interactions, often having difficulty initiating conversations or understanding social cues such as body language. Although they attempt communication, both verbal and nonverbal communication might be limited or awkward, causing difficulties engaging with peers and understanding social dynamics. Specifically, they may have trouble with: The child's ability to understand and respond to social cues will be noticeably affected, impacting their ability to build and maintain relationships. This can affect their participation in various social settings and activities, such as birthday parties or family gatherings. For example, they may struggle to understand and participate in the social dynamics of a holiday celebration like Christmas, misinterpreting interactions or feeling overwhelmed by the sensory aspects of gift-giving.

Repetitive and Restrictive Behaviors
- Children may exhibit restrictive or repetitive behaviors. These could range from lining up toys to an intense focus on specific topics or routines. They may also demonstrate difficulties with flexibility and adapting to changes. This can cause distress and disrupt various aspects of their daily life.

How Is Level 2 Autism Diagnosed?
## The autism diagnosis process involves a multi-faceted approach conducted by healthcare providers experienced in diagnosing mental disorders and developmental disorders:
- Developmental history: A comprehensive review of the child's developmental history is obtained from parents or caregivers.
- Behavioral observation: Professionals observe the child's behavior in various settings, to assess communication, social interaction, and play.
- Standardized assessments: Standardized tests help assess the child's cognitive abilities, language skills, adaptive behaviors, and social skills. These scores help determine the level of support required.
- Review of medical history: Relevant information from medical records helps rule out other conditions that might explain the observed symptoms.

How Level 2 Autism Impacts Daily Life
## Level 2 autism can impact various aspects of a child's daily life:
- Social interaction: Children might struggle to build and maintain friendships, which can lead to feelings of isolation.
- Communication: Difficulties communicating needs and thoughts can lead to frustration and misunderstandings.
- School: Difficulties with social interaction, communication, and following instructions might affect their ability to participate in class and complete assignments.
- Home: Repetitive behaviors and difficulties with transitions can sometimes make daily routines challenging and may impact the child's overall well-being.
- Emotional regulation: The challenges managing emotions can lead to significant distress and emotional outbursts.

`,
    imageUrl: "/asd2.jpg",
    sourceUrl: "https://riseupforautism.com/blog/what-is-level-2-autism",
    sourceName: "National Institute of Mental Health",
    category: "ASD Levels",
    readTime: "10 min read",
    publishedDate: "January 20, 2026",
  },

  {
    id: "level-3",
    title: "ASD Level 3: Requiring Very Substantial Support",
    summary:
      "ASD Level 3 involves significant communication and behavioral challenges requiring intensive support.",
    content: `
What Is Level 3 Autism?
## Level 3 autism is the most severe classification of Autism Spectrum Disorder (ASD) as defined by the Diagnostic and Statistical Manual of Mental Disorders, 5th Edition (DSM-5). While it is sometimes described as the most severe of autism levels, it is more accurate to say it indicates that the individual requires very substantial support in their daily life due to significant challenges in communication, social interaction, and behaviors. Recent CDC data suggests that approximately 26.7% of children with Autism Spectrum Disorder (ASD) exhibit "profound autism," aligning with the characteristics of level 3 autism. This signifies that roughly 1 in 4 children diagnosed with autism falls within this category of significant severity.

The Main Symptoms of Level 3 Autism

## What Is Level 3 Autism?
- Level 3 autism is the most severe classification of Autism Spectrum Disorder (ASD) as defined by the Diagnostic and Statistical Manual of Mental Disorders, 5th Edition (DSM-5). While it is sometimes described as the most severe of autism levels, it is more accurate to say it indicates that the individual requires very substantial support in their daily life due to significant challenges in communication, social interaction, and behaviors. Recent CDC data suggests that approximately 26.7% of children with Autism Spectrum Disorder (ASD) exhibit "profound autism," aligning with the characteristics of level 3 autism. This signifies that roughly 1 in 4 children diagnosed with autism falls within this category of significant severity.

The Main Symptoms of Level 3 Autism

## Communication Challenges
- Children may experience extreme difficulty communicating effectively and interacting socially. They might struggle to initiate or sustain meaningful interactions or have significant difficulty understanding or using nonverbal communication, such as gestures or facial expressions. Verbal communication might be very limited or absent, and nonverbal communication may also be severely impaired, causing significant distress during social interactions. This can affect their ability to make and maintain relationships. Many children at this level may require alternative communication methods, such as sign language or picture exchange systems.

## Restrictive and Repetitive Behaviors
- These children often show repetitive behaviors and restricted interests. These may include repeating sounds or words, lining up objects, engaging in repetitive motor movements, or fixating on specific subjects to an extreme degree.

## Extreme Difficulty Coping
- Many children with level 3 autism have extreme difficulty coping with changes in routine or unexpected events, leading to significant distress; therefore, establishing clear visual schedules and providing advance warning of changes are often beneficial strategies.

## Sensory Challenges
- Sensory sensitivities are frequent, making ordinary experiences like sounds, sights, smells, tastes, and textures overly stimulating or overwhelming. This heightened sensitivity can affect many aspects of daily life.

## Significant Support Needs
- Children at this level often need very substantial support to function in different settings, such as school and home. This support may include specialized therapies like ABA therapy. Children with stage 3 autism often benefit from consistent behavioral interventions and support services.

How Is Level 3 Autism Diagnosed?
## A diagnosis of level 3 autism, like all ASD diagnoses, involves a thorough assessment by qualified healthcare professionals. This typically includes:
- Developmental history: A detailed review of the child's developmental history from birth to the present.
- Observation of behavior: Observing the child's behavior in various settings, such as home and school.
- Parent/caregiver interview: A comprehensive interview with parents or caregivers to gather information about the child's symptoms and developmental history.
- Standardized assessments: Use of standardized assessments to evaluate the child's communication, social interaction, and adaptive behavior skills.

How Stage 3 Autism Impacts Daily Life
## Level 3 autism significantly impacts a child’s daily life, affecting various aspects of their functioning:
- Communication: Difficulties communicating needs and desires can lead to frustration, meltdowns, and challenges in building relationships.
- Social interactions: Navigating social situations is often challenging, resulting in social isolation and limited peer interaction.
- Learning and education: Specialized educational support and adapted learning approaches are often necessary.
- Self-care: Challenges with self-care tasks may require assistance and adapted techniques.
- Behavior: Challenging behaviors can impact the child's safety and well-being as well as the family's quality of life.
- Sensory overload: Everyday sensory experiences can be overwhelming, causing anxiety or distress.

`,
    imageUrl: "/asd1.jpg",
    sourceUrl: "https://riseupforautism.com/blog/what-is-level-3-autism",
    sourceName: "Rise Up for Autism",
    category: "ASD Levels",
    readTime: "12 min read",
    publishedDate: "January 20, 2026",
  },
];

