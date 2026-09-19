const aiProfileImage = 'images/Villagante.jpg';
const aiSessionStorageKey = 'kousei_ai_current_session';
const aiHistoryStorageKey = 'kousei_ai_session_history';
const USE_GEMINI_BACKEND = true;
let aiSessionId = localStorage.getItem(aiSessionStorageKey) || `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
let aiSessionMessages = [];
let aiSessionTitle = 'New AI conversation';
let aiSessionReady = false;
let aiAvailability = 'online';
const aiResponseCursors = {};
let lastAiResponse = '';
localStorage.setItem(aiSessionStorageKey, aiSessionId);

const resumeKnowledge = {
  name: 'Christian Arbado Villagante',
  age: 'Christian Arbado Villagante is 21 years old.',
  role: 'Graphic and Web Designer',
  education: 'Christian Arbado Villagante is a fourth-year Bachelor of Science in Information Technology student at Philippine Christian University in Manila, currently in his first semester. He expects to graduate in 2027.',
  summary: 'Christian Arbado Villagante is a 21-year-old fourth-year Information Technology student, Graphic and Web Designer, video editor, and content creator.',
  skills: 'His technical skills include HTML5, CSS3, JavaScript, Python, SQL, and MySQL. His creative tools include Adobe Premiere Pro, DaVinci Resolve, CapCut, and Adobe Photoshop. He also works with Microsoft Word, Excel, and PDF tools.',
  projects: 'The projects listed in Christian\'s resume are: Functionable Website Portfolio, Online Book Store Web Application, and Multimedia Asset Optimization & Technical Workflow Project. His uploaded portfolio may also contain additional Major Projects and Minor Projects managed through the Projects section.',
  experience: 'His experience includes frontend web development and design, database and web application development, and digital media asset optimization. He focuses on clean code, responsive UI/UX, cross-browser compatibility, and organized technical workflows.',
  awards: "Christian has earned Outstanding Dean's List recognition for his first, second, and third years, plus an Outstanding Performance in Object Oriented Programming certificate.",
  contact: 'You can contact Christian at kouseilarscii@gmail.com. You can also use the Contact Me tab to send a message, or use the social links in the footer.',
  interests: 'Christian enjoys art, making videos for fun, video editing, graphic design, photo manipulation, frontend development, application design, databases, and playing Genshin Impact.',
  determination: 'Christian is a determined and talented person, especially in the arts and video creation. He enjoys making videos for fun, learning creative tools, building practical projects, and continuing even when work is challenging.',
  personality: 'Christian describes himself as a good, quiet, and shy person. He is not always comfortable in large groups, but he is determined, friendly, and fun to be with once people get to know him.',
  lifeRole: 'Christian’s biggest role in life is to keep growing as a kind, determined, and creative person while developing his skills as an IT student, web designer, video editor, and content creator.',
  advisor: 'Christian’s reference and academic advisor is John Joshua E. Mendoza, MIT, Program Head of the Bachelor of Science in Information Technology at Philippine Christian University. The resume lists his phone as 09544713059 and email as John.mendoza@pcu.edu.ph.',
  resumeProjects: 'Christian’s resume lists three projects under Projects & Academic Experience: Functionable Website Portfolio; Online Book Store Web Application; and Multimedia Asset Optimization & Technical Workflow Project. The Projects tab can also contain other uploaded Major and Minor Projects.',
  resumeProjectDetails: {
    first: 'The first resume project is Functionable Website Portfolio. It is an interactive frontend website built with HTML5, CSS3, and JavaScript, focused on clean structure, responsive UI/UX, cross-browser compatibility, and fast rendering.',
    second: 'The second resume project is Online Book Store Web Application. It is a database-driven e-commerce platform for browsing, filtering, and purchasing books, using Visual Studio with SQL/MySQL for inventory, authors, categories, and mock cart checkout logic.',
    third: 'The third resume project is Multimedia Asset Optimization & Technical Workflow Project. It covers digital media processing, file compression, rendering, cross-platform compatibility, video editing, graphic design, asset deployment, and balancing resolution, bitrate, and delivery speed.'
  }
};

const profileAnswerLibrary = {
  currentJobTitle: [
    'Christian is currently positioned as a Graphic and Web Designer, with his portfolio and academic work rooted in frontend development, design, and digital media.',
    'In practical terms, Christian works as a creative technology professional: he is an IT student, web designer, and digital creator who combines design with technical problem-solving.',
    'Christian’s current professional profile is best described as a Graphic and Web Designer with experience in web development, UI design, and media production.'
  ],
  elevatorPitch: [
    'Christian is a fourth-year IT student and creative designer who blends frontend development, graphic design, and video editing to build responsive digital experiences and practical project solutions.',
    'He is a detail-oriented technology student who brings together design thinking, coding, and creative media to deliver clean, user-focused work with strong presentation and problem-solving skills.',
    'Christian combines technical skill with artistic vision: he develops websites, designs visual experiences, edits videos, and builds projects that balance usability, creativity, and functionality.'
  ],
  goals: [
    'Christian’s professional goals center on growing as a web designer and developer, expanding his technical depth, and building a portfolio that reflects strong real-world execution and creative problem-solving.',
    'He wants to keep improving in frontend development, digital design, and multimedia production while gaining more experience in professional and collaborative environments.',
    'His long-term direction is to develop into a versatile IT professional who can contribute across design, development, and digital content workflows.'
  ],
  location: [
    'Based on his profile, Christian is located in Manila, Philippines, and his academic background is tied to Philippine Christian University in Manila.',
    'He is based in Manila, Philippines, and most of his education and portfolio work are connected to that local context.',
    'Christian’s portfolio indicates a Manila-based profile, with his studies and creative work centered in the Philippine capital.'
  ],
  relocation: [
    'The portfolio does not state a strict relocation restriction, but it suggests that Christian is open to opportunities where his skills and growth can be applied meaningfully.',
    'There is no clear indication that he is unwilling to relocate. His profile points more toward flexibility and readiness for work that matches his goals and skill set.',
    'His details suggest he is open to professional opportunities that align with his background, especially in digital, design, and IT-focused roles.'
  ],
  workType: [
    'The portfolio does not specify a rigid preference, but Christian appears well suited for roles that allow him to contribute through design, frontend work, programming, and creative problem solving.',
    'His background fits well with full-time and project-based opportunities, especially in digital product, web, or multimedia work, though the exact preference is not stated outright.',
    'He seems most comfortable in environments where technical work, creativity, and structured execution come together, which makes remote or hybrid formats very plausible.'
  ],
  availability: [
    'The portfolio does not give a highly formal interview schedule, but Christian appears ready to engage in professional conversations and opportunities that fit his academic and career stage.',
    'He appears available for discussions, project collaboration, and career opportunities, although specific scheduling details are not explicitly published on the profile.',
    'Christian seems approachable for interviews and opportunities, especially when the role is aligned with web design, IT, and creative digital work.'
  ],
  resumePdf: [
    'The portfolio includes a Resume section, so the easiest way to view his résumé is through the Resume tab on this website if the PDF is linked there.',
    'If a downloadable PDF is available, it would typically be accessed from the Resume section or the portfolio’s contact and summary area.',
    'The best place to check for his full résumé is the Resume page, where his academic and project details are organized for viewing and download.'
  ],
  contactMethods: [
    'The strongest direct contact method is Christian’s email, kouseilarscii@gmail.com. The site also includes a Contact Me form and social links for a more direct professional outreach path.',
    'He can be reached through his email and via the Contact Me tab on this portfolio. Those are the clearest and most professional routes for communication.',
    'For direct contact, email is the best option, and the portfolio also provides a contact form and social links for easier follow-up.'
  ],
  workEnvironment: [
    'Christian’s skill set suits remote and hybrid collaboration very well, especially because his work is digital, design-focused, and project-based. On-site work is also possible when needed.',
    'His profile suggests comfort with remote or hybrid work, with the possibility of on-site work depending on the role and environment.',
    'The strongest fit is remote or hybrid work, since his experience is rooted in digital tools, online portfolios, and tech-driven creative projects.'
  ],
  industries: [
    'Christian’s most relevant experience is in web design, frontend development, digital media, graphic design, content creation, and student-driven IT project work.',
    'His background fits best in digital, creative, and technology-focused industries, including web development, design, multimedia, and application work.',
    'He is strongest in digital-first environments where design, programming, media, and project execution overlap.'
  ],
  topSkills: [
    'Christian’s top strengths are frontend development, graphic design, digital media production, and practical problem-solving through web and creative tools.',
    'His most notable skills include HTML, CSS, JavaScript, UI design, databases, and video editing, which make him versatile across technical and creative tasks.',
    'He stands out in web design and development, visual design, and multimedia workflows, with a strong balance between technical execution and creative presentation.'
  ],
  tools: [
    'Christian works with HTML5, CSS3, JavaScript, Python, SQL, and MySQL, and he also uses design and editing software such as Photoshop, Premiere Pro, DaVinci Resolve, and CapCut.',
    'His toolkit includes frontend technologies, database tools, and digital creative software. He is comfortable with both coding environments and design production workflows.',
    'He uses a combination of development tools and creative software, including Microsoft Office tools, design apps, and video editing platforms.'
  ],
  certifications: [
    'The resume highlights academic recognition rather than formal licenses. Christian has Dean’s List recognition and an Outstanding Performance in Object Oriented Programming certificate.',
    'There is no major professional license listed, but his academic record includes notable recognition and a certificate in Object Oriented Programming.',
    'His profile shows strong academic achievement, especially through Dean’s List distinctions and an OOP performance certificate.'
  ],
  softSkills: [
    'Christian brings a thoughtful mix of creativity, determination, organization, quiet confidence, and a willingness to learn. He is especially strong when combining technical accuracy with visual polish.',
    'He is described as a friendly, thoughtful, and determined person with good problem-solving instincts and a calm, hardworking approach to tasks.',
    'His strongest interpersonal qualities include discipline, adaptability, creativity, and a collaborative spirit that works well in team-based and project-driven environments.'
  ],
  leadership: [
    'Christian has experience managing his own project work and navigating technical responsibilities, though the profile does not list a formal leadership title. He demonstrates initiative and ownership in project execution.',
    'The portfolio suggests he can take responsibility for design and development tasks, and his project work indicates self-management, but not a formal management role on the résumé.',
    'He is certainly capable of taking ownership of work and moving projects forward, even if the portfolio does not highlight a formal people-management title.'
  ],
  languages: [
    'His portfolio suggests strong communication in English and Filipino/Tagalog-based settings, but it does not explicitly list multiple foreign languages as fluent skills.',
    'The clearest language context is English proficiency alongside Filipino communication, which is typical for his academic and portfolio environment.',
    'Based on his work and profile, he is comfortable communicating in English and is likely well adapted to Filipino-language professional settings as well.'
  ],
  learning: [
    'Christian stays current by combining schoolwork, self-driven projects, and hands-on experimentation with design, coding, and editing tools. He also learns through practical portfolio building and continuous iteration.',
    'He appears to keep up with trends through project-based learning, creative practice, and exposure to modern frontend and multimedia tools.',
    'His learning style is practical and hands-on: he improves by building projects, solving real design and coding problems, and refining his technical and creative workflow.'
  ],
  agile: [
    'Christian’s workflow suggests adaptability and iterative learning, which fits well with fast-paced and agile environments where projects evolve quickly and collaboration matters.',
    'He is likely comfortable in dynamic environments because his work is organized around experimentation, design refinement, and project iteration.',
    'His project-based background points to someone who can work with deadlines, shifting priorities, and ongoing improvement cycles.'
  ],
  productivity: [
    'Christian uses standard productivity workflows alongside design and development tools, including Microsoft Office software, creative suites, and structured project execution habits.',
    'He tends to organize work through practical documentation, digital design tools, and project planning while balancing creative and technical tasks.',
    'His productivity style is likely structured and hands-on: he combines technical tools with a clear project mindset and consistent execution.'
  ],
  educationLevel: [
    'Christian’s highest level of formal education is currently a Bachelor of Science in Information Technology at Philippine Christian University, with expected graduation in 2027.',
    'He is pursuing a BS in Information Technology and is currently in his fourth year, first semester, with graduation expected in 2027.',
    'His academic path is still in progress, and the strongest educational milestone is his ongoing IT degree at Philippine Christian University.'
  ],
  recentRole: [
    'Christian’s most recent working context is primarily academic and project-based rather than a long formal corporate role, with strong emphasis on web design, digital media, and technical project development.',
    'His recent experience is best described as a blend of IT student work, design and development projects, and digital content creation rather than a single traditional office job title.',
    'He has been building experience through school projects, freelance-style creative work, and portfolio-driven development, which aligns with his growth as a designer and developer.'
  ],
  responsibilities: [
    'His recent responsibilities include frontend development, UI/UX-oriented design, project planning, media editing, and building digital solutions that demonstrate both technical and creative capability.',
    'He has worked on academic and portfolio-based tasks involving design, front-end implementation, database-backed applications, and visual content creation.',
    'His practical responsibilities revolve around creating clean digital experiences, managing project workflows, and producing work that reflects strong presentation and technical discipline.'
  ],
  yearsExperience: [
    'Christian has developed experience through academic, creative, and project-based work, which gives him a solid practical foundation even though his résumé does not emphasize a large corporate tenure.',
    'His experience is meaningful and hands-on, especially in design, frontend work, and multimedia production, even if it is not yet framed as a long corporate career history.',
    'He has accumulated solid project-based experience in the areas relevant to his field, with a strong emphasis on real portfolio work and applied learning.'
  ],
  clientFacing: [
    'There is no clear indication that Christian has held a formal client-facing or customer support job, but his portfolio and communication style suggest that he can present work clearly and work effectively with others.',
    'His résumé does not explicitly list client-facing support roles. Most of his experience appears to be project-based, technical, and design-oriented.',
    'He seems more aligned with technical and creative work than with direct customer support or a purely service-based role.'
  ],
  milestone: [
    'A major milestone in Christian’s academic and project journey is the consistent recognition of his work through Dean’s List distinction and his successful completion of substantial portfolio and IT-related projects.',
    'One of his strongest milestones is the combination of academic achievement and practical project execution, showing that he can build real solutions while maintaining strong academic performance.',
    'His project portfolio and academic achievements stand out as major milestones because they reflect both technical capability and creative consistency.'
  ],
  crossFunctional: [
    'Christian’s work naturally touches multiple disciplines, including design, development, database work, and media production, which means he is comfortable working across connected tasks and project layers.',
    'He is likely comfortable working with cross-functional project demands because his portfolio spans design, development, and digital content, which requires coordination across different skill sets.',
    'His background suggests alignment with interdisciplinary teams, particularly where code, design, and presentation all matter.'
  ],
  companyTypes: [
    'Christian’s experience is best described as academic, creative, and project-based rather than tied to a long list of corporate employers. His work is rooted in digital and technical environments.',
    'The profile suggests a mix of student-driven, creative, and technology-focused work instead of a traditional corporate career path.',
    'He has primarily built experience through academic and digital portfolio settings, which is common for emerging IT and design professionals.'
  ],
  deadlines: [
    'Christian appears to handle deadlines by staying organized, structured, and focused on practical outcomes. His project-based work reflects a disciplined and goal-oriented approach.',
    'He seems well suited to deadline-driven environments because his work is centered on organized execution, design refinement, and technical delivery.',
    'His approach combines responsibility, structure, and creativity, which makes him a good fit for high-pressure situations that still require polish and quality.'
  ],
  references: [
    'The profile includes an academic advisor and references framework, which suggests Christian can provide relevant references when needed, especially through academic or professional channels.',
    'He appears prepared to provide professional references, particularly through his academic advisor and institutional connections.',
    'The resume and profile indicate that references and academic validation are part of his professional foundation.'
  ],
  favoritePart: [
    'Christian’s favorite part of his profession is likely the creative problem-solving itself: building polished digital experiences that merge design with technical functionality.',
    'What he seems to enjoy most is turning concepts into usable, visually strong work that combines creativity and technology in a practical way.',
    'He appears to value the part of the work where ideas become tangible, useful, and visually compelling digital products.'
  ],
  impressiveProject: [
    'One of the most impressive projects in Christian’s profile is the Functionable Website Portfolio, followed by the Online Book Store Web Application and the Multimedia Asset Optimization project, which show both design and technical range.',
    'The strongest project showcase is likely the combination of his portfolio and web application work, because it demonstrates frontend design, database logic, and creative execution.',
    'His project set is strongest when viewed as a whole, as it covers website development, digital business logic, and multimedia workflow optimization.'
  ],
  complexProblem: [
    'Christian’s portfolio suggests he is good at translating broad ideas into workable websites and digital systems, especially when the challenge requires both technical structure and design clarity.',
    'He deals with practical problems by breaking them into clear requirements, organizing the workflow, and building solutions that balance usability with execution quality.',
    'A solid example of his problem-solving is the way he approaches portfolio and application projects: he combines design thinking with technical structure to translate a challenge into a usable product.'
  ],
  portfolioTools: [
    'The portfolio reflects a working mix of HTML5, CSS3, JavaScript, design tools, and media editing software, which highlights how Christian builds visually polished and technically sound work.',
    'He uses a blend of coding tools and creative software to build his portfolio, from frontend implementation to photo, video, and asset editing workflows.',
    'His project design process is rooted in standard web technologies plus design and media tools that support both quality and efficiency.'
  ],
  efficiency: [
    'The portfolio suggests his work could improve efficiency by reducing manual effort, simplifying workflows, and bringing stronger design and structure into digital projects.',
    'He is aligned with efficiency-minded work because he focuses on clean code, responsive design, and multimedia optimization, all of which support stronger project output.',
    'His work is especially relevant to efficiency improvements when it comes to streamlined digital experiences, better asset management, and practical web workflows.'
  ],
  projectProcess: [
    'Christian’s process usually begins with understanding the goal, organizing the structure, and then building the design and technical layers in a clear, iterative way.',
    'He tends to approach new work by mapping purpose, building the interface and logic, and refining the project until it feels polished and practical.',
    'His process is practical and structured: define the need, design the flow, develop the solution, and refine it for clarity, usability, and quality.'
  ],
  openSource: [
    'The profile does not explicitly highlight open-source contributions, but his work clearly reflects a development mindset and a willingness to share quality work through portfolio and public project showcases.',
    'His portfolio shows a strong builder mentality, even if the exact open-source contribution details are not listed in the profile.',
    'Christian appears more focused on portfolio-driven and academic contribution than on formal open-source publishing.'
  ],
  proudestProject: [
    'Christian is likely proudest of the portfolio and project work that best shows both his design and technical growth, especially the projects that combine front-end skill, backend logic, and visual presentation.',
    'The project he is most proud of would likely be the one that demonstrates the strongest mix of technical capability and creativity, especially his web and multimedia work.',
    'His most meaningful work seems to be the projects that show how he can turn ideas into polished digital experiences with structure, design, and real functionality.'
  ],
  faithValues: [
    'Christian’s faith and values seem to shape a grounded, disciplined, and respectful approach to work. He appears to value growth, integrity, and doing work with sincerity and quality.',
    'His values appear to support diligence, humility, and responsibility, which fit well with creative and technical work that requires both care and consistency.',
    'The profile suggests that Christian approaches work with principle, respect, and a strong personal standard, which helps him stay focused on quality and improvement.'
  ],
  integrity: [
    'Christian demonstrates integrity by being deliberate, organized, and honest in how he develops his work. He seems to value effort, professionalism, and responsible execution.',
    'His work ethic suggests a careful and accountable approach, especially in project development and academic performance.',
    'He appears to be someone who takes ownership seriously, treats work with respect, and values quality over shortcuts.'
  ],
  cultureFit: [
    'Christian likely thrives in a company culture that values growth, learning, teamwork, creativity, and a calm but high-performing environment.',
    'He appears to fit best in settings where thoughtful work, professional respect, and innovation are valued alongside collaboration and continuous improvement.',
    'He is most comfortable in teams that are supportive, goal-oriented, and open to both design and technical creativity.'
  ],
  volunteer: [
    'The portfolio does not prominently list volunteer work, but his values and academic focus suggest a willingness to contribute in a practical, service-minded way when the opportunity arises.',
    'There is no major volunteer entry highlighted in the profile, but the general tone of his work points to a person who values usefulness and contribution.',
    'Christian’s profile emphasizes growth and commitment more than formal service records, but it still reflects a reflective and values-driven mindset.'
  ],
  conflict: [
    'Christian seems to handle differing opinions with maturity by staying respectful, listening carefully, and focusing on solutions rather than friction.',
    'His profile suggests a calm and thoughtful response to conflict, especially when grounded in professionalism and mutual respect.',
    'He appears to value constructive communication, which is a good fit for teams where ideas and perspectives need to be balanced respectfully.'
  ],
  servantLeadership: [
    'For Christian, servant leadership seems to mean supporting others through helpful work, thoughtful collaboration, and a willingness to contribute where the team needs strength, not just attention to personal credit.',
    'It likely means leading through service, quality, and humility rather than ego—helping others succeed while doing strong work yourself.',
    'His profile suggests a leader who supports progress, builds with care, and values useful contribution over self-promotion.'
  ],
  balance: [
    'Christian seems to balance professional excellence with personal values by staying disciplined, reflective, and grounded in what matters most to him: growth, quality, and meaningful work.',
    'He appears to carry strong personal values into his work, which helps him produce quality results without losing his sense of purpose or integrity.',
    'His balance seems to come from combining serious effort with creative expression and a thoughtful, values-driven mindset.'
  ],
  motivation: [
    'Christian was motivated to pursue this path by a combination of creative interest, practical problem-solving, and the desire to build meaningful digital work that merges design and technology.',
    'His route into this field is likely shaped by an interest in both art and technical creation, especially the way design and coding can produce useful, visible results.',
    'He seems to be driven by the chance to create things that are useful, attractive, and technically solid.'
  ],
  hobbies: [
    'Christian enjoys art, video editing, graphic design, and creative media work. He also finds interest in games and digital entertainment, which fits his creative and visual side.',
    'His outside-work interests include art, making videos for fun, digital design, and creative experimentation, alongside his technical learning.',
    'He is someone who enjoys both creative expression and technology, with a natural tendency toward design, media, and project-based exploration.'
  ],
  professionalGroups: [
    'The profile does not clearly list local professional associations or memberships, but Christian’s academic and project-focused work suggests a strong interest in continued learning and professional growth.',
    'There is no major association listed in the current profile, but his work indicates an active and development-minded mindset.',
    'He appears more focused on growing through coursework, projects, and portfolio work than on listing formal group memberships.'
  ],
  funFact: [
    'A fun fact about Christian is that he blends technical ability with creative strength, so his work is not only functional but also visually expressive and media-savvy.',
    'He is the kind of person who can move comfortably between code, design, and storytelling, which makes his work feel both polished and personal.',
    'One interesting thing about him is that his creative interests and technical background work together so naturally that his projects feel both practical and expressive.'
  ],
  resources: [
    'Christian likely enjoys learning through practical resources such as design tutorials, technical documentation, project building, and media workflow guidance that help him improve both creatively and technically.',
    'His interests suggest he benefits from hands-on design tutorials, coding resources, and digital creativity content that supports ongoing growth.',
    'He seems to learn through direct experience, project work, and real-world exploration rather than only through formal study.'
  ],
  profiles: [
    'You can usually find Christian’s LinkedIn and GitHub details through the portfolio’s contact and project sections, depending on what links are currently published.',
    'The best place to search for his LinkedIn and GitHub is the portfolio’s social or contact area, where professional links are often shared.',
    'If the links are available, they are usually listed in the portfolio’s social section or profile contact area.'
  ]
};

const profileQuestionMatchers = [
  { key: 'currentJobTitle', regex: /(current job title|profession|what is christian.*job|what do you do|job title|professional title|what is his profession|what kind of work does he do|what is he professionally)/i },
  { key: 'elevatorPitch', regex: /(elevator pitch|30 second pitch|short pitch|quick intro|introduce christian|brief profile|tell me about christian in 30 seconds|can you pitch christian)/i },
  { key: 'goals', regex: /(professional goals|career goals|future goals|where does he want to go|what are his goals|what is he aiming for|what are his long term goals|how does he plan to grow)/i },
  { key: 'location', regex: /(where is christian.*located|where is he located|location|city|country|based in|currently located|residence|where does he live|where is he based)/i },
  { key: 'relocation', regex: /(relocation|open to relocate|willing to move|move to another city|can he relocate|can he move|open to moving|willing to relocate)/i },
  { key: 'workType', regex: /(full time|part time|contract|freelance|temporary|work type|job type|employment type|is he looking for|looking for work|what type of role|what kind of role)/i },
  { key: 'availability', regex: /(availability|interview|schedule an interview|when can i interview him|when is he available|available for meeting|available for interview|can i set up a meeting)/i },
  { key: 'resumePdf', regex: /(resume pdf|full resume|download resume|resume in pdf|pdf format|cv pdf|download his resume|where can i download)/i },
  { key: 'contactMethods', regex: /(contact him directly|get in touch|best way to contact|how to reach him|reach christian|contact details|message him|how can i get in touch|contact information)/i },
  { key: 'workEnvironment', regex: /(remote|hybrid|on site|onsite|work environment|work setup|office setup|remote work|hybrid work)/i },
  { key: 'industries', regex: /(industry|industries|most experience in|field|what industries|what sectors|which industries)/i },
  { key: 'topSkills', regex: /(top three technical skills|top skills|strongest skills|best skills|main technical skills|what are his strongest skills|what is he best at|what are his top skills)/i },
  { key: 'tools', regex: /(programming languages|software|tools|tech stack|what tools does he use|what software|what technology|what programs does he use|what languages does he use)/i },
  { key: 'certifications', regex: /(certifications|licenses|license|certificates|professional certification|credentials)/i },
  { key: 'softSkills', regex: /(soft skills|interpersonal strengths|teamwork skills|strengths|personality traits|what makes him a great teammate|what kind of teammate is he)/i },
  { key: 'leadership', regex: /(managing projects|leading projects|project manager|lead projects|manage team|team lead|leadership|lead a team|project leadership)/i },
  { key: 'languages', regex: /(languages does christian speak|speak fluently|what languages|what language|fluent in|language skills)/i },
  { key: 'learning', regex: /(stay up to date|latest trends|new trends|how does he stay current|keep up with trends|learn new things|trends in his field)/i },
  { key: 'agile', regex: /(agile|fast paced|fast-paced|dynamic environment|high energy|deadline driven|iterative workflow|sprints|project cycles)/i },
  { key: 'productivity', regex: /(daily organization|productivity|organize tasks|tools for productivity|how does he stay organized|organization tools|daily workflow)/i },
  { key: 'educationLevel', regex: /(highest level of education|formal education|what is his education|what is his highest education|degree|highest degree|what school did he attend|what level of education)/i },
  { key: 'recentRole', regex: /(most recent job role|recent role|latest role|recent position|what was his last job|what is his most recent position|what does his recent work involve|what is his current role)/i },
  { key: 'responsibilities', regex: /(primary responsibilities|duties|responsibilities in his last position|what did he do in his last job|what are his responsibilities|what were his roles)/i },
  { key: 'yearsExperience', regex: /(years of experience|total years|how many years|professional experience|experience level|how much experience)/i },
  { key: 'clientFacing', regex: /(client facing|customer support|client support|customer service|support role|service role|clients)/i },
  { key: 'milestone', regex: /(major milestone|achievement|biggest achievement|career milestone|notable achievement|important milestone)/i },
  { key: 'crossFunctional', regex: /(cross functional|international teams|global teams|multi disciplinary|different departments|cross team|team coordination)/i },
  { key: 'companyTypes', regex: /(types of companies|what kind of companies|past employers|where has he worked|companies he worked for|organization type|company background)/i },
  { key: 'deadlines', regex: /(tight deadlines|high pressure|deadline pressure|stressful situations|work under pressure|handle deadlines|deadline management)/i },
  { key: 'references', regex: /(references|testimonials|professional references|can he provide references|recommendation|letters of recommendation|testimonials upon request)/i },
  { key: 'favoritePart', regex: /(favorite part|what does he enjoy most|favorite thing about his profession|what does he love most|what does he like best)/i },
  { key: 'impressiveProject', regex: /(most impressive project|favorite project|best project|showcase project|resume project|featured project|most impressive portfolio work)/i },
  { key: 'complexProblem', regex: /(complex problem|problem he solved|challenge he solved|difficult problem|problem solving|how did he resolve|issue he fixed)/i },
  { key: 'portfolioTools', regex: /(tools or technologies used to build portfolio|portfolio technologies|what software did he use for his portfolio|what tools in the portfolio|portfolio development tools)/i },
  { key: 'efficiency', regex: /(cost savings|increased efficiency|improved efficiency|save money|save time|cost reduction|efficiency gains)/i },
  { key: 'projectProcess', regex: /(project process|starting a new project|how does he start a project|process from scratch|project workflow|how he begins a project)/i },
  { key: 'openSource', regex: /(open source|community initiatives|community work|contributed to open source|github contributions|community service)/i },
  { key: 'proudestProject', regex: /(project he is most proud of|most proud project|proudest work|project he is proud of|what project makes him proud)/i },
  { key: 'faithValues', regex: /(faith and values|how faith shapes his work|values and work|religion|beliefs|faith values|how does faith influence him)/i },
  { key: 'integrity', regex: /(integrity|ethics|ethical|honesty|trust|fairness|how does he demonstrate integrity|moral values)/i },
  { key: 'cultureFit', regex: /(company culture|work culture|culture fit|what kind of company culture|best environment|kind of workplace|culture he thrives in)/i },
  { key: 'volunteer', regex: /(volunteer|community service|service work|charity|giving back|community involvement)/i },
  { key: 'conflict', regex: /(workplace conflict|differing opinions|handle conflict|disagree|disagreement|conflict resolution|differences of opinion)/i },
  { key: 'servantLeadership', regex: /(servant leadership|service leadership|leadership style|what does servant leadership mean|how does he lead)/i },
  { key: 'balance', regex: /(balance professional excellence with personal values|balance work and values|values and excellence|work life values|professional values)/i },
  { key: 'motivation', regex: /(what motivated christian to pursue this career|motivation|why did he choose this path|what inspired him|career path motivation)/i },
  { key: 'hobbies', regex: /(hobbies|interests outside work|what are his hobbies|what does he like outside work|what does he enjoy outside work|free time activities|personal interests)/i },
  { key: 'professionalGroups', regex: /(professional associations|associations|groups|clubs|industry associations|professional groups|local groups)/i },
  { key: 'funFact', regex: /(fun fact|interesting fact|something not on resume|fun fact about christian|unexpected fact|unexpected detail)/i },
  { key: 'resources', regex: /(books|podcasts|resources|what does he read|what does he listen to|favorite books|podcasts|resources he enjoys|what content does he like)/i },
  { key: 'profiles', regex: /(linkedin|github|social profile|where can i find his linkedin|where can i find his github|where is his github|where is his linkedin)/i }
];

function pickProfileResponse(key) {
  const items = profileAnswerLibrary[key];
  if (!items || !items.length) return '';
  const index = (aiResponseCursors[key] || 0) % items.length;
  aiResponseCursors[key] = (aiResponseCursors[key] || 0) + 1;
  return items[index];
}

function getProfileQuestionAnswer(query) {
  const lowerQuery = normalizeAiText(query || '').toLowerCase();
  const match = profileQuestionMatchers.find(item => item.regex.test(lowerQuery));
  if (!match) return null;
  return { answer: pickProfileResponse(match.key), intentKey: match.key };
}

const aiIntents = [
  { key: 'greeting', terms: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'kamusta', 'how are you'], answer: 'Hello! I am Kousei AI. Ask me about Christian\'s resume, skills, education, projects, awards, or contact details.' },
  { key: 'help', terms: ['what can i ask', 'what should i ask', 'possible questions', 'question examples', 'what do you know', 'tell me everything', 'show me topics', 'qwords', 'keywords'], answer: 'You can ask me who Christian is, what he is good at, what technologies he knows, what he studied, where he studied, what projects he built, what experience he has, what awards he earned, what tools he uses, what he is interested in, how to contact him, or where to find each portfolio section.' },
  { key: 'identity', terms: ['who is christian', 'who is this person', 'who are you', 'about christian', 'tell me about christian', 'introduce christian', 'give me his profile', 'give me his bio', 'what kind of person is he', 'describe him'], answer: resumeKnowledge.summary },
  { key: 'name', terms: ['what is his name', 'what is he called', 'full name', 'real name', 'christian name', 'what his name', 'what his naem', 'name of the person'], answer: resumeKnowledge.name },
  { key: 'age', terms: ['how old is he', 'what age is he', 'his age', 'age of christian', 'how many years old', 'what is his current age'], answer: resumeKnowledge.age },
  { key: 'education', terms: ['education', 'educational background', 'school', 'study', 'studies', 'studying', 'college', 'university', 'degree', 'course', 'major', 'program', 'what did he study', 'what is he studying', 'where did he study', 'where does he study', 'what school is he in', 'when will he graduate', 'graduation', 'student'], answer: resumeKnowledge.education },
  { key: 'yearLevel', terms: ['what year is he', 'what year level', 'year level', 'fourth year', '4th year', 'first semester', 'which year in college', 'college year', 'current semester', 'is he fourth year'], answer: resumeKnowledge.education },
  { key: 'skills', terms: ['skill', 'skills', 'technology', 'technologies', 'tech stack', 'programming', 'programming language', 'coding language', 'software', 'tools', 'what can he do', 'what does he know', 'what does he know about', 'what is he good at', 'what is he great at', 'what is he great of', 'what is he best at', 'what are his strengths', 'what are his strongest skills', 'what are his strong points', 'what is his talent', 'what is he talented in', 'what are his abilities', 'what is his expertise', 'what is his specialization', 'what is he proficient in', 'what is he qualified for', 'what is he capable of', 'what can he build', 'what can he create', 'what does he specialize in'], answer: resumeKnowledge.skills },
  { key: 'projects', terms: ['project', 'projects', 'portfolio projects', 'portfolio work', 'what has he built', 'what did he build', 'what did he create', 'what has he created', 'what websites did he make', 'what applications did he make', 'bookstore', 'book store', 'online store', 'e commerce', 'website', 'websites', 'application', 'applications', 'app', 'apps', 'database project', 'school project', 'academic project', 'major project', 'minor project'], answer: resumeKnowledge.projects },
  { key: 'resumeProjects', terms: ['projects in resume', 'projects on resume', 'resume projects', 'what projects are listed', 'what projects are in his cv', 'name of his projects', 'names of projects', 'three projects', 'other projects beside calculator', 'projects besides calculator', 'what are the two other projects', 'what are his project names'], answer: resumeKnowledge.resumeProjects },
  { key: 'advisor', terms: ['advisor', 'adviser', 'professor', 'prof', 'teacher', 'instructor', 'reference', 'referee', 'program head', 'who is his professor', 'who is his adviser', 'who can recommend him', 'who is john joshua'], answer: resumeKnowledge.advisor },
  { key: 'personality', terms: ['personality', 'personal character', 'what kind of person', 'is he shy', 'is he quiet', 'is he friendly', 'is he a good person', 'how would he describe himself', 'what is he like socially'], answer: resumeKnowledge.personality },
  { key: 'determination', terms: ['determination', 'determined', 'motivation', 'what motivates him', 'what drives him', 'biggest role in life', 'purpose in life', 'life role', 'what does he live for', 'what is important to him'], answer: resumeKnowledge.determination },
  { key: 'interests', terms: ['interest', 'interests', 'what does he like', 'what is he interested in', 'what does he enjoy', 'passion', 'passions', 'hobby', 'hobbies', 'creative interests', 'favorite field', 'art', 'genshin', 'making videos for fun'], answer: resumeKnowledge.interests },
  { key: 'youtube', terms: ['youtube', 'youtube channel', 'channel', 'channel name', 'channel statistics', 'subscribers', 'subscriber count', 'channel views', 'video count', 'uploads', 'uploaded videos', 'latest video', 'newest video', 'most popular video', 'top video', 'best video', 'video likes', 'video comments', 'youtube content', 'youtube uploads', 'what does he upload', 'what videos does he make', 'what is his channel about'], answer: 'Christian’s YouTube channel is KouseiLarsCII. I can check the live channel statistics and loaded video information when the YouTube data is available.' },
  { key: 'projectData', terms: ['uploaded project', 'uploaded projects', 'major uploaded project', 'minor uploaded project', 'major project details', 'minor project details', 'project title', 'project description', 'project category', 'github project', 'github repository', 'live demo project', 'which projects were uploaded', 'what did he upload', 'what projects are in the manager'], answer: 'I can check the uploaded projects and separate them into Major Projects and Minor Projects.' },
  { key: 'experience', terms: ['experience', 'work experience', 'professional experience', 'work', 'career', 'developer', 'designer', 'background', 'frontend', 'front end', 'backend', 'back end', 'database', 'media', 'video editing experience', 'web development experience', 'what has he done', 'what work has he done', 'what kind of work does he do', 'what role does he have', 'what is his role'], answer: resumeKnowledge.experience },
  { key: 'awards', terms: ['award', 'awards', 'dean', 'deans list', 'deans lister', 'certificate', 'certificates', 'achievement', 'achievements', 'recognition', 'honor', 'honors', 'academic award', 'what awards did he get', 'what did he accomplish'], answer: resumeKnowledge.awards },
  { key: 'contact', terms: ['contact', 'contact information', 'email', 'e mail', 'phone', 'phone number', 'mobile', 'reach him', 'reach out', 'send a message', 'message him', 'how can i contact him', 'how do i contact him', 'how can i reach him', 'hire him', 'work with him', 'collaborate', 'collaboration'], answer: resumeKnowledge.contact },
  { key: 'interests', terms: ['interest', 'interests', 'what does he like', 'what is he interested in', 'what does he enjoy', 'passion', 'passions', 'hobby', 'hobbies', 'creative interests', 'favorite field'], answer: resumeKnowledge.interests },
  { key: 'navigation', terms: ['website sections', 'navigation bar', 'navigation menu', 'how do i navigate', 'where can i see the videos', 'where can i see the friends', 'where can i see the timeline', 'where can i see the resume', 'where can i see the contact page', 'which tab has the projects'], answer: 'Use the navigation bar to explore Home, Videos, Projects, Friends, Live Timeline, AI Chatbox, Resume, and Contact Me.' },
  { key: 'thanks', terms: ['thank', 'thanks', 'thx', 'appreciate', 'many thanks'], answer: 'You are welcome! I am here whenever you want to explore Christian\'s portfolio.' }
];

const generatedQuestionPatterns = {
  identity: {
    topics: ['Christian', 'this person', 'the creator', 'the developer', 'the designer', 'the student'],
    templates: ['who is {topic}', 'tell me about {topic}', 'what should i know about {topic}', 'can you describe {topic}', 'give me information about {topic}', 'what kind of person is {topic}', 'what is {topic} like', 'can you introduce {topic}', 'give me a short profile of {topic}', 'what is the background of {topic}']
  },
  education: {
    topics: ['education', 'school', 'degree', 'course', 'studies', 'university', 'college', 'academic background', 'IT program', 'graduation'],
    templates: ['what is his {topic}', 'tell me about his {topic}', 'where is his {topic}', 'what do i know about his {topic}', 'can you explain his {topic}', 'what are the details of his {topic}', 'does he have {topic}', 'what kind of {topic} does he have', 'how is his {topic}', 'give me information about his {topic}', 'what did he study for his {topic}', 'is he studying {topic}', 'what questions can i ask about his {topic}']
  },
  skills: {
    topics: ['skills', 'abilities', 'strengths', 'talents', 'expertise', 'technologies', 'programming', 'software', 'tools', 'technical skills', 'creative skills', 'specialization'],
    templates: ['what are his {topic}', 'tell me about his {topic}', 'what is he good at in {topic}', 'what is he great at in {topic}', 'what is he best at in {topic}', 'what can he do with {topic}', 'what does he know about {topic}', 'does he have {topic}', 'what kind of {topic} does he have', 'which {topic} does he have', 'how strong is he in {topic}', 'is he experienced with {topic}', 'is he proficient in {topic}', 'what are his strongest {topic}', 'what is his main {topic}', 'what is he capable of with {topic}', 'what does he specialize in regarding {topic}', 'can he work with {topic}', 'does he use {topic}', 'what {topic} does he use', 'what can he create using {topic}', 'what does he excel at in {topic}']
  },
  projects: {
    topics: ['projects', 'portfolio', 'websites', 'applications', 'bookstore', 'online store', 'database work', 'academic projects', 'software projects'],
    templates: ['what are his {topic}', 'tell me about his {topic}', 'what {topic} has he built', 'what {topic} did he create', 'what {topic} did he make', 'which {topic} are in his portfolio', 'can you describe his {topic}', 'what kind of {topic} does he have', 'has he built any {topic}', 'what is his best {topic}', 'where can i see his {topic}', 'what did he develop for his {topic}', 'what are the details of his {topic}', 'can you explain the {topic}', 'what {topic} show his abilities']
  },
  experience: {
    topics: ['experience', 'work experience', 'professional background', 'web development', 'frontend development', 'backend development', 'database work', 'design work', 'video editing'],
    templates: ['what is his {topic}', 'tell me about his {topic}', 'what kind of {topic} does he have', 'where did he get his {topic}', 'what has he done in {topic}', 'what work has he done in {topic}', 'what roles has he had in {topic}', 'is he experienced in {topic}', 'how much {topic} does he have', 'what does he do in {topic}', 'can you describe his {topic}', 'what are his responsibilities in {topic}', 'what did he learn from {topic}', 'what does his {topic} include']
  },
  awards: {
    topics: ['awards', 'achievements', 'certificates', 'Dean list recognition', 'academic honors', 'accomplishments', 'recognition'],
    templates: ['what are his {topic}', 'tell me about his {topic}', 'what {topic} did he earn', 'which {topic} has he received', 'does he have any {topic}', 'what did he accomplish with his {topic}', 'what academic {topic} does he have', 'can you list his {topic}', 'when did he receive his {topic}', 'what recognition is included in his {topic}']
  },
  contact: {
    topics: ['contact information', 'email', 'phone number', 'contact details', 'message', 'collaboration', 'hiring', 'social links'],
    templates: ['how can i use his {topic}', 'how do i find his {topic}', 'where is his {topic}', 'what is his {topic}', 'how can i reach him through {topic}', 'can i contact him through {topic}', 'how do i send a {topic}', 'how can i ask about {topic}', 'is he available for {topic}', 'how can i work with him through {topic}', 'where can i see his {topic}']
  },
  interests: {
    topics: ['interests', 'passions', 'creative interests', 'hobbies', 'favorite fields', 'things he enjoys'],
    templates: ['what are his {topic}', 'tell me about his {topic}', 'what is he interested in', 'what does he enjoy', 'what does he like doing', 'what creative work does he like', 'what subjects interest him', 'what are his favorite areas', 'what motivates his creative work', 'what does he care about']
  }
};

const extendedQuestionPatterns = {
  identity: {
    topics: ['Christian', 'Christian Villagante', 'the portfolio owner', 'the IT student', 'the web designer', 'the content creator', 'the applicant', 'the person behind this portfolio'],
    templates: ['could you tell me who {topic} is', 'i want to know who {topic} is', 'please describe {topic}', 'what should i know about {topic}', 'what information do you have about {topic}', 'can you summarize {topic}', 'give me an overview of {topic}', 'what is important to know about {topic}', 'what does {topic} do', 'what is {topic} known for', 'what type of professional is {topic}', 'what is the profile of {topic}', 'can you explain the background of {topic}', 'what makes {topic} interesting', 'how would you introduce {topic}', 'what is the short bio of {topic}', 'tell me everything about {topic}', 'who exactly is {topic}', 'what kind of creator is {topic}', 'what kind of developer is {topic}', 'what kind of designer is {topic}', 'what is {topic} currently doing', 'what field is {topic} in', 'what is {topic} studying', 'what does the portfolio say about {topic}', 'what can you tell me about the person named {topic}', 'give me a professional summary of {topic}', 'what is {topic} background', 'what is {topic} profile', 'what does {topic} specialize in']
  },
  education: {
    topics: ['education', 'academic background', 'school', 'university', 'college', 'degree', 'course', 'IT course', 'IT degree', 'studies', 'student status', 'graduation', 'Philippine Christian University'],
    templates: ['can you tell me about his {topic}', 'please explain his {topic}', 'what details are available about his {topic}', 'where can i learn about his {topic}', 'what does his {topic} include', 'what is the latest information about his {topic}', 'how would you describe his {topic}', 'what is his current {topic}', 'what was his {topic}', 'what will happen with his {topic}', 'when did his {topic} begin', 'when is his {topic} expected', 'is his {topic} related to information technology', 'what subject is connected to his {topic}', 'what program is part of his {topic}', 'what university is connected to his {topic}', 'what degree is part of his {topic}', 'what year is he in for his {topic}', 'is he still studying for his {topic}', 'what can you say about his {topic}', 'give me a summary of his {topic}', 'give me more information on his {topic}', 'what questions can i ask regarding his {topic}', 'how far is he in his {topic}', 'what career is his {topic} preparing him for', 'what skills is his {topic} helping him build', 'what is his field of study', 'what is his academic program', 'where is he enrolled', 'when is he expected to graduate', 'is he an undergraduate student', 'what university does he attend']
  },
  skills: {
    topics: ['skills', 'abilities', 'strengths', 'talents', 'expertise', 'technologies', 'programming', 'programming languages', 'software', 'tools', 'technical abilities', 'creative abilities', 'web skills', 'database skills', 'design skills', 'editing skills'],
    templates: ['can you list his {topic}', 'please list his {topic}', 'what are all of his {topic}', 'which {topic} does he have', 'what {topic} does he bring', 'what {topic} can he offer', 'what {topic} has he developed', 'what {topic} has he practiced', 'what {topic} does he use', 'what {topic} is he learning', 'what {topic} does he know', 'what {topic} is he strongest in', 'what {topic} are useful in his work', 'what {topic} are shown in his resume', 'what {topic} are shown in his portfolio', 'how would you rate his {topic}', 'how would you describe his {topic}', 'what are the main parts of his {topic}', 'what are the best examples of his {topic}', 'what are his most useful {topic}', 'what are his professional {topic}', 'what are his personal {topic}', 'what are his practical {topic}', 'what {topic} does he have for web development', 'what {topic} does he have for design', 'what {topic} does he have for databases', 'what {topic} does he have for multimedia', 'what {topic} does he have for programming', 'what {topic} can he use on a project', 'what {topic} can he demonstrate', 'what {topic} would he use at work', 'what {topic} should an employer know', 'what {topic} make him qualified', 'what {topic} make him capable', 'what {topic} show his strengths', 'what {topic} show his experience', 'what {topic} does he excel in', 'what {topic} does he perform well in', 'what {topic} is he familiar with', 'what {topic} has he worked with', 'does he know any {topic}', 'does he use any {topic}', 'can he work with {topic}', 'can he build with {topic}', 'can he design with {topic}', 'can he edit with {topic}', 'can he program with {topic}', 'can he manage {topic}', 'can he create using {topic}', 'what should i ask about his {topic}', 'tell me more about his {topic}']
  },
  projects: {
    topics: ['projects', 'portfolio projects', 'websites', 'web applications', 'software applications', 'online bookstore', 'database project', 'academic projects', 'major projects', 'minor projects', 'digital media projects', 'portfolio work'],
    templates: ['can you list his {topic}', 'what are all of his {topic}', 'which {topic} has he made', 'which {topic} has he built', 'which {topic} has he developed', 'which {topic} has he created', 'what {topic} are shown online', 'what {topic} are in his portfolio', 'what {topic} demonstrate his skills', 'what {topic} demonstrate his experience', 'what is included in his {topic}', 'what is the purpose of his {topic}', 'what problem does his {topic} solve', 'what technologies are used in his {topic}', 'what tools were used for his {topic}', 'what database is related to his {topic}', 'what design work is in his {topic}', 'what can i learn from his {topic}', 'how did he approach his {topic}', 'how did he organize his {topic}', 'how did he build his {topic}', 'how did he design his {topic}', 'how did he develop his {topic}', 'what is his most important {topic}', 'what is his best known {topic}', 'can you explain his {topic}', 'can you summarize his {topic}', 'tell me more about his {topic}', 'where can i view his {topic}', 'where are his {topic} displayed', 'which {topic} are major', 'which {topic} are minor', 'what kind of {topic} has he worked on', 'has he done any {topic}', 'has he completed any {topic}', 'does he have any {topic}', 'what did he make for school', 'what did he make for his portfolio', 'what did he build with a database', 'what did he build for online shopping', 'what did he create for media', 'what website did he develop', 'what application did he develop', 'what database application did he create', 'what bookstore application did he build', 'what software work has he done', 'what portfolio work has he completed', 'what project shows his frontend skills', 'what project shows his backend skills', 'what project shows his design skills', 'what project shows his media skills', 'what project should i view first']
  },
  experience: {
    topics: ['experience', 'work experience', 'professional experience', 'web development experience', 'frontend experience', 'backend experience', 'database experience', 'design experience', 'video editing experience', 'technical background', 'professional background'],
    templates: ['can you describe his {topic}', 'what does his {topic} include', 'what kind of {topic} does he have', 'where does his {topic} come from', 'what has he done in his {topic}', 'what work is part of his {topic}', 'what responsibilities are part of his {topic}', 'what roles are part of his {topic}', 'what tools did he use in his {topic}', 'what skills did he use in his {topic}', 'what did he learn from his {topic}', 'what did he build during his {topic}', 'what did he design during his {topic}', 'what did he develop during his {topic}', 'what did he manage during his {topic}', 'is he experienced in {topic}', 'does he have experience with {topic}', 'how much {topic} does he have', 'what is the strongest part of his {topic}', 'what is the focus of his {topic}', 'what is the scope of his {topic}', 'what examples show his {topic}', 'what projects show his {topic}', 'how does his {topic} help him', 'how does his {topic} relate to his skills', 'what kind of role could use his {topic}', 'what professional work has he done', 'what practical work has he done', 'what development work has he done', 'what design work has he done', 'what database work has he done', 'what media work has he done', 'what is his developer experience', 'what is his designer experience', 'what is his technical experience', 'what is his creative experience', 'what is his application experience', 'what is his website experience', 'what should an employer know about his experience']
  },
  awards: {
    topics: ['awards', 'achievements', 'certificates', 'Dean list recognition', 'academic honors', 'accomplishments', 'recognition', 'qualifications'],
    templates: ['can you list his {topic}', 'what are all of his {topic}', 'what {topic} has he earned', 'what {topic} has he received', 'what {topic} has he achieved', 'when did he receive his {topic}', 'when did he earn his {topic}', 'what school recognition does he have', 'what academic {topic} does he have', 'what honors are in his resume', 'what accomplishments are in his resume', 'what certificates are in his resume', 'can you explain his {topic}', 'can you summarize his {topic}', 'what do his {topic} say about him', 'how do his {topic} show his ability', 'which {topic} are most important', 'does he have academic {topic}', 'does he have professional {topic}', 'what recognition did he get as a student']
  },
  contact: {
    topics: ['contact information', 'email address', 'phone number', 'contact details', 'message', 'collaboration', 'hiring', 'social media', 'social links'],
    templates: ['can you give me his {topic}', 'where can i find his {topic}', 'how can i use his {topic}', 'how can i reach him using his {topic}', 'how can i contact him using his {topic}', 'can i send him a {topic}', 'can i ask him about a {topic}', 'how do i request a {topic}', 'how do i start a {topic}', 'is he open to {topic}', 'is he available for {topic}', 'can i work with him through {topic}', 'what is the best way to use his {topic}', 'where are his {topic} listed', 'how do i find the {topic} section', 'what should i include in a {topic}', 'how can an employer start a {topic}', 'how can a client start a {topic}', 'how can a collaborator start a {topic}', 'can i hire him through his {topic}']
  },
  interests: {
    topics: ['interests', 'passions', 'creative interests', 'hobbies', 'favorite fields', 'things he enjoys', 'areas he likes'],
    templates: ['can you list his {topic}', 'what are all of his {topic}', 'what is he interested in', 'what does he enjoy doing', 'what does he like working on', 'what creative work does he enjoy', 'what fields attract him', 'what subjects does he like', 'what motivates his {topic}', 'how do his {topic} relate to his work', 'what does he care about professionally', 'what does he like learning', 'what does he like creating', 'what does he like designing', 'what does he like editing', 'what does he like programming', 'what are his creative strengths', 'what areas would he like to work in', 'what topics could i discuss with him', 'what are his personal interests']
  }
};

const broadQuestionOpeners = [
  'can you explain',
  'please tell me about',
  'i want to know about',
  'could you give details about',
  'what should i know about',
  'tell me more about',
  'give me an overview of',
  'can you describe',
  'what information is available about',
  'help me understand',
  'what can you say about',
  'i would like information about'
];

const broadQuestionEndings = [
  '',
  ' in his resume',
  ' in his portfolio',
  ' for Christian',
  ' as part of his background',
  ' and how it relates to his work',
  ' including examples',
  ' in simple words'
];

const activityQuestionOpeners = [
  'what does he do',
  'what does Christian do',
  'what work does he do',
  'what does he do for work',
  'what does he do professionally',
  'what does he do in his career',
  'what kind of work does he do',
  'what does he actually do',
  'what does he mainly do',
  'what does he do as a developer',
  'what does he do as a designer',
  'what does he do with technology',
  'what does he do with databases',
  'what does he do with websites',
  'what does he do with video editing',
  'what does he do in frontend development',
  'what does he do in backend development',
  'what does he do in graphic design',
  'what does he do in digital media',
  'what does he do for clients',
  'what does he do at school',
  'what is he doing',
  'what is he working on',
  'what is his work',
  'what is his role'
];

const activityQuestionContexts = [
  'web development',
  'frontend development',
  'backend development',
  'database management',
  'application development',
  'graphic design',
  'photo manipulation',
  'video editing',
  'digital media',
  'content creation',
  'UI UX design',
  'portfolio development'
];

const activityQuestionQualifiers = [
  '', ' exactly', ' generally', ' every day', ' in his work', ' in his portfolio',
  ' in his projects', ' in his field', ' as an IT student', ' as a web designer',
  ' as a video editor', ' as a developer', ' in practical terms', ' in simple words',
  ' professionally', ' technically', ' creatively', ' for his career', ' for employers',
  ' for a project', ' with his skills', ' with his education', ' with his experience',
  ' in the future', ' on this website', ' according to his resume',
  ' according to his portfolio', ' that makes him qualified', ' that shows his abilities',
  ' that relates to his skills'
];

const liveDataQuestionTopics = {
  youtube: [
    'YouTube channel', 'channel name', 'channel statistics', 'subscribers', 'subscriber count',
    'channel views', 'video count', 'uploaded videos', 'latest video', 'newest upload',
    'most popular video', 'top video', 'video views', 'video likes', 'video comments'
  ],
  projectData: [
    'uploaded projects', 'major projects', 'minor projects', 'project titles', 'project descriptions',
    'project categories', 'GitHub repositories', 'live demos', 'major project uploads',
    'minor project uploads', 'projects in the manager', 'published projects', 'portfolio uploads', 'project gallery'
  ]
};

const liveDataQuestionOpeners = [
  'what is', 'what are', 'who has', 'which are', 'which one is', 'can you show',
  'can you list', 'please list', 'tell me about', 'give me details about', 'give me information about',
  'where can i find', 'how many', 'how can i view', 'what information is available',
  'what details are shown', 'what can you tell me about', 'which details belong to',
  'can you check', 'please check'
];

const liveDataQuestionEndings = [
  '', ' right now', ' on this website', ' in the live data', ' from the API', ' from YouTube',
  ' from Firestore', ' in the portfolio', ' in the dashboard', ' in the uploaded data',
  ' according to the channel', ' according to the project manager', ' for Christian',
  ' for KouseiLarsCII', ' in simple words', ' with examples', ' with the latest information',
  ' including names', ' including numbers', ' including titles', ' including descriptions',
  ' including categories', ' including views', ' including likes', ' including comments',
  ' including links', ' that are available', ' that were uploaded', ' that are published',
  ' that are currently visible'
];

const personalQuestionTopics = {
  name: { answerKey: 'name', topics: ['name', 'full name', 'real name', 'Christian\'s name', 'the person\'s name', 'his identity'], stems: ['what is his', 'what is he', 'tell me his', 'can you tell me his', 'please give me his', 'i want to know his', 'do you know his', 'who is the person named', 'how do you spell his', 'what does the resume say his', 'what name is shown for'], endings: ['', ' exactly', ' please', ' in the resume', ' in the portfolio', ' according to his cv', ' even with wrong grammar', ' if i spell it wrong', ' for the full version', ' for the official version'] },
  age: { answerKey: 'age', topics: ['age', 'current age', 'years old', 'birth age', 'how old he is'], stems: ['what is his', 'how old is he', 'what age is he', 'can you tell me his', 'do you know his', 'i want to know his', 'tell me how old', 'how many years old is'], endings: ['', ' now', ' today', ' currently', ' according to the profile', ' according to the resume', ' in simple words', ' if someone asks', ' please', ' exactly'] },
  yearLevel: { answerKey: 'education', topics: ['college year', 'year level', 'school year', 'semester', 'current year', 'student year', 'academic level'], stems: ['what is his', 'which is his current', 'what year is he in for', 'is he in fourth', 'is he already in his fourth', 'what semester is he in for', 'how far is he in his', 'can you tell me his current', 'where is he in his'], endings: ['', ' now', ' currently', ' in college', ' at university', ' this semester', ' first semester', ' according to the resume', ' with correct grammar', ' even if i ask badly'] },
  advisor: { answerKey: 'advisor', topics: ['advisor', 'adviser', 'professor', 'teacher', 'reference', 'academic reference', 'program head', 'supervisor', 'recommender'], stems: ['who is his', 'what is the name of his', 'can you name his', 'tell me about his', 'who can be his', 'who is listed as his', 'who is the professor or', 'who is the person in his', 'what reference is shown for his', 'who advises him as an'], endings: ['', ' at school', ' in the resume', ' in the references', ' for IT', ' for his program', ' according to his cv', ' with contact details', ' if i spell advisor wrong', ' please'] },
  personality: { answerKey: 'personality', topics: ['personality', 'character', 'attitude', 'social personality', 'personal qualities', 'behavior', 'nature', 'temperament'], stems: ['what is his', 'how is his', 'what kind of', 'how would you describe his', 'is he a', 'is he generally', 'can you explain his', 'tell me about his', 'what does he say about his', 'what is he like in terms of'], endings: ['', ' as a person', ' with other people', ' socially', ' according to his own description', ' in simple words', ' if he is shy', ' if he is quiet', ' if he is friendly', ' despite being quiet'] },
  determination: { answerKey: 'determination', topics: ['determination', 'motivation', 'drive', 'purpose', 'biggest role in life', 'life purpose', 'ambition', 'what drives him'], stems: ['what is his', 'what gives him', 'what makes him', 'what motivates', 'what drives', 'what is important to', 'what does he value as his', 'what is the biggest', 'why is he determined about', 'can you explain his'], endings: ['', ' in life', ' in art', ' in making videos', ' in school', ' in his career', ' according to his profile', ' as a creator', ' as a student', ' even when work is difficult'] },
  interests: { answerKey: 'interests', topics: ['interests', 'hobbies', 'passions', 'creative interests', 'things he enjoys', 'fun activities', 'art interests', 'Genshin Impact', 'video making for fun'], stems: ['what are his', 'what does he like', 'what does he enjoy', 'what is he interested in', 'what does he do for fun', 'what are his favorite', 'what creative things does he', 'does he enjoy', 'does he like playing', 'can you tell me about his'], endings: ['', ' outside school', ' in his free time', ' for fun', ' creatively', ' according to his profile', ' like Genshin', ' including video editing', ' including art', ' even if grammar is wrong'] },
  resumeProjects: { answerKey: 'resumeProjects', topics: ['resume projects', 'projects in his cv', 'project names', 'projects listed in the resume', 'three projects', 'projects besides the calculator', 'the other two projects', 'academic projects', 'portfolio projects in the resume'], stems: ['what are his', 'what is the name of his', 'can you list his', 'tell me about his', 'which are the', 'what other', 'what are the two other', 'what projects did he include in his', 'what project names appear in his', 'show me his'], endings: ['', ' exactly', ' according to the resume', ' with the project names', ' besides calculators', ' apart from the calculator', ' including the other two', ' for an interview', ' if i misspell project', ' in simple words'] },
  about: { answerKey: 'summary', topics: ['about him', 'his background', 'his story', 'his profile', 'what he is about', 'the about me section', 'his personal summary'], stems: ['what is he about', 'what is his', 'tell me about', 'can you explain', 'who is he and what is he about', 'what should i know about', 'give me the', 'what does the resume say about', 'what does his about me say about', 'describe'], endings: ['', ' in the resume', ' in the portfolio', ' in simple words', ' as a person', ' as a student', ' as a designer', ' as a creator', ' with correct grammar', ' even if i ask wrongly'] }
};

function addPersonalQuestionCombinations() {
  Object.values(personalQuestionTopics).forEach(topicSet => {
    const intent = aiIntents.find(item => item.key === topicSet.answerKey) || aiIntents.find(item => item.key === 'identity');
    if (!intent) return;
    const combinations = topicSet.topics.flatMap(topic => topicSet.stems.flatMap(stem => topicSet.endings.map(ending => `${stem} ${topic}${ending}`)));
    intent.terms = [...new Set([...intent.terms, ...combinations])];
  });
}

function addLiveDataQuestionCombinations() {
  Object.entries(liveDataQuestionTopics).forEach(([intentKey, topics]) => {
    const intent = aiIntents.find(item => item.key === intentKey);
    if (!intent) return;
    const combinations = topics.flatMap(topic => liveDataQuestionOpeners.flatMap(opener => liveDataQuestionEndings.map(ending => `${opener} his ${topic}${ending}`)));
    intent.terms = [...new Set([...intent.terms, ...combinations])];
  });
}

function getLiveYoutubeAnswer(query) {
  if (/project|major|minor|github|repository|demo/.test(query)) return null;
  const youtubeSignal = /youtube|channel|subscriber|video|upload|views|likes|comments/.test(query);
  if (!youtubeSignal) return null;

  const videos = typeof rawVideos !== 'undefined' ? rawVideos : [];
  const subscriberText = document.getElementById('subCount')?.innerText || 'Subscriber data is still loading.';
  const viewText = document.getElementById('viewCount')?.innerText || 'View data is still loading.';
  const videoCountText = document.getElementById('videoCount')?.innerText || `${videos.length} loaded videos`;

  if (/latest|newest|recent|most recent/.test(query)) {
    const latest = [...videos].sort((first, second) => second.pubDate - first.pubDate)[0];
    return latest ? `The latest loaded upload is “${latest.title}”. It has ${latest.views.toLocaleString()} views, ${latest.likes.toLocaleString()} likes, and ${latest.commentsCount.toLocaleString()} comments.` : 'The latest YouTube video data is still loading.';
  }

  if (/popular|top|best|most viewed|highest/.test(query)) {
    const popular = [...videos].sort((first, second) => second.views - first.views)[0];
    return popular ? `The most-viewed loaded video is “${popular.title}” with ${popular.views.toLocaleString()} views, ${popular.likes.toLocaleString()} likes, and ${popular.commentsCount.toLocaleString()} comments.` : 'Popular video data is still loading.';
  }

  if (/title|names|list|uploads|uploaded videos|videos does he make/.test(query) && videos.length) {
    const titles = videos.slice(0, 5).map((video, index) => `${index + 1}. ${video.title}`).join('\n');
    return `Here are some loaded KouseiLarsCII uploads:\n${titles}`;
  }

  if (/subscriber|views|statistics|stats|how many|count/.test(query)) {
    return `KouseiLarsCII currently shows ${subscriberText}, ${viewText}, and ${videoCountText}. These values come from the loaded YouTube channel data.`;
  }

  return 'The YouTube channel is KouseiLarsCII. I can answer questions about its subscribers, views, video count, uploads, latest video, popular video, likes, comments, and channel content.';
}

function getLiveProjectAnswer(query) {
  const projectSignal = /project|portfolio|major|minor|uploaded|published|github|repository|demo|category|description|title|manager/.test(query);
  if (!projectSignal || typeof cachedProjects === 'undefined' || !cachedProjects.length) return null;

  const category = /minor/.test(query) ? 'minor' : /major/.test(query) ? 'major' : null;
  const projects = cachedProjects.filter(project => !category || (project.category || 'major').toLowerCase() === category);
  if (!projects.length) return `There are no ${category || ''} uploaded projects available in the live project data yet.`.replace('  ', ' ');

  if (/title|name|list|which|what are|show|how many/.test(query)) {
    const projectList = projects.slice(0, 8).map((project, index) => `${index + 1}. ${project.title} (${project.category || 'major'})`).join('\n');
    return `Here are the loaded ${category || 'portfolio'} projects:\n${projectList}`;
  }

  const project = projects[0];
  if (/description|details|explain|about/.test(query)) {
    return `The project “${project.title}” is described as: ${project.description || 'No description is available yet.'}`;
  }

  return `I found ${projects.length} loaded ${category || 'portfolio'} project${projects.length === 1 ? '' : 's'}. The first one is “${project.title}”.`;
}

function addActivityQuestionCombinations() {
  const experienceIntent = aiIntents.find(intent => intent.key === 'experience');
  if (!experienceIntent) return;

  const activityTerms = activityQuestionOpeners.flatMap(opener => [
    opener,
    ...activityQuestionContexts.flatMap(context => activityQuestionQualifiers.map(qualifier => `${opener} in ${context}${qualifier}`))
  ]);
  experienceIntent.terms = [...new Set([...experienceIntent.terms, ...activityTerms])];
}

function addBroadQuestionCombinations() {
  const expandableIntentKeys = new Set(['education', 'skills', 'projects', 'experience', 'awards', 'contact', 'interests']);
  aiIntents.forEach(intent => {
    if (!expandableIntentKeys.has(intent.key)) return;
    const patternSet = extendedQuestionPatterns[intent.key];
    const combinations = patternSet.topics.flatMap(topic => broadQuestionOpeners.flatMap(opener => broadQuestionEndings.map(ending => `${opener} ${topic}${ending}`)));
    intent.terms = [...new Set([...intent.terms, ...combinations])];
  });
}

function addGeneratedQuestionPatterns() {
  aiIntents.forEach(intent => {
    const patternSet = generatedQuestionPatterns[intent.key];
    const extendedSet = extendedQuestionPatterns[intent.key];
    const patternSets = [patternSet, extendedSet].filter(Boolean);
    if (!patternSets.length) return;

    const generatedTerms = patternSets.flatMap(set => set.topics.flatMap(topic => set.templates.map(template => template.replace('{topic}', topic))));
    intent.terms = [...new Set([...intent.terms, ...generatedTerms])];
  });
}

addGeneratedQuestionPatterns();
addBroadQuestionCombinations();
addActivityQuestionCombinations();
addLiveDataQuestionCombinations();
addPersonalQuestionCombinations();

const typoMap = {
  skil: 'skill', skils: 'skills', skilses: 'skills', projct: 'project', projcts: 'projects', prject: 'project', proejct: 'project', porfolio: 'portfolio', portfoloi: 'portfolio', websiite: 'website', websiites: 'websites', bulit: 'built', bult: 'built',
  educaton: 'education', eduction: 'education', experince: 'experience', experiance: 'experience',
  contat: 'contact', contct: 'contact', emal: 'email', adress: 'address', abot: 'about',
  christan: 'christian', chrisitan: 'christian', desiner: 'designer', develper: 'developer',
  progrming: 'programming', javscript: 'javascript', pythn: 'python', databse: 'database',
  awrd: 'award', cerificate: 'certificate', resum: 'resume', phon: 'phone',
  qulification: 'qualification', qulified: 'qualified', achievment: 'achievement',
  tecnology: 'technology', techonology: 'technology', developement: 'development',
  responsve: 'responsive', desgin: 'design', creatve: 'creative', collab: 'collaborate',
  collboration: 'collaboration', hireing: 'hire', intersted: 'interest', studing: 'study',
  determinination: 'determination', determinaton: 'determination', persnality: 'personality',
  proffesor: 'professor', profesr: 'professor', advsior: 'advisor', advisr: 'advisor',
  calcultor: 'calculator', calculatr: 'calculator', calulator: 'calculator'
};

const synonymMap = {
  abilities: 'skills', ability: 'skills', capability: 'skills', capabilities: 'skills', strengths: 'skills',
  strong: 'skills', talented: 'skills', talent: 'skills', expertise: 'skills', specialty: 'skills',
  specializations: 'skills', websites: 'website', knowhow: 'skills', stack: 'technology', tech: 'technology', coding: 'programming',
  academics: 'education', background: 'experience', career: 'experience', history: 'experience',
  creations: 'projects', apps: 'application', accomplishments: 'awards',
  prizes: 'awards', certificates: 'certificate', qualifications: 'education',
  connect: 'contact', reachout: 'contact', hire: 'contact', availability: 'contact',
  bio: 'identity', profile: 'identity', passions: 'interests', hobbies: 'interests'
};

const ignoredWords = new Set(['a', 'an', 'the', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'can', 'could', 'would', 'will', 'you', 'he', 'his', 'him', 'i', 'me', 'my', 'about', 'please', 'tell', 'show', 'give', 'what', 'which', 'where', 'how', 'why', 'when', 'and', 'or', 'to', 'of', 'for', 'in', 'on', 'with']);

let lastAiIntentKey = null;

function normalizeAiText(value) {
  return value
    .toLowerCase()
    .replace(/what\s+(?:is|are)\s+(?:he|christian)\s+(?:great|good|best)\s+(?:of|at|in)\s+what/g, 'what are his strengths')
    .replace(/what\s+(?:he|christian)\s+(?:great|good|best)\s+(?:of|at|in)/g, 'what are his strengths')
    .replace(/what\s+does\s+(?:he|christian)\s+know/g, 'what are his skills')
    .replace(/what\s+is\s+his\s+strongest\s+point/g, 'what are his strengths')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(word => typoMap[word] || synonymMap[word] || word)
    .join(' ');
}

function stemWord(word) {
  if (word.length > 6 && word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.length > 5 && word.endsWith('ing')) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith('ed')) return word.slice(0, -2);
  if (word.length > 4 && word.endsWith('es')) return word.slice(0, -2);
  if (word.length > 4 && word.endsWith('s')) return word.slice(0, -1);
  return word;
}

function getAiTokens(value) {
  return normalizeAiText(value)
    .split(' ')
    .map(stemWord)
    .filter(word => word.length > 1 && !ignoredWords.has(word));
}

function containsAiPhrase(query, phrase) {
  const queryWords = normalizeAiText(query).split(' ');
  const phraseWords = normalizeAiText(phrase).split(' ');
  if (phraseWords.length > queryWords.length) return false;
  return phraseWords.every((word, index) => queryWords[index] === word)
    || queryWords.some((_, index) => phraseWords.every((word, phraseIndex) => queryWords[index + phraseIndex] === word));
}

function levenshteinDistance(first, second) {
  const row = Array.from({ length: second.length + 1 }, (_, index) => index);
  for (let firstIndex = 1; firstIndex <= first.length; firstIndex += 1) {
    let diagonal = row[0];
    row[0] = firstIndex;
    for (let secondIndex = 1; secondIndex <= second.length; secondIndex += 1) {
      const previous = row[secondIndex];
      row[secondIndex] = first[firstIndex - 1] === second[secondIndex - 1]
        ? diagonal
        : Math.min(row[secondIndex] + 1, row[secondIndex - 1] + 1, diagonal + 1);
      diagonal = previous;
    }
  }
  return row[second.length];
}

function intentScore(query, intent) {
  const normalizedQuery = normalizeAiText(query);
  const queryWords = getAiTokens(normalizedQuery);
  const score = intent.terms.reduce((bestScore, term) => {
    const normalizedTerm = normalizeAiText(term);
    if (containsAiPhrase(normalizedQuery, normalizedTerm)) return Math.max(bestScore, 1);
    const termWords = getAiTokens(normalizedTerm);
    const matchedWords = termWords.filter(termWord => queryWords.some(queryWord => {
      if (queryWord === termWord) return true;
      if (queryWord.length < 4 || termWord.length < 4) return false;
      return levenshteinDistance(queryWord, termWord) <= (termWord.length > 6 ? 2 : 1);
    }));
    const coverageScore = termWords.length ? matchedWords.length / termWords.length : 0;
    const queryCoverage = queryWords.length ? matchedWords.length / queryWords.length : 0;
    return Math.max(bestScore, coverageScore * 0.86 + queryCoverage * 0.14);
  }, 0);

  const canonicalBoosts = {
    education: ['education', 'university', 'school', 'degree', 'study'],
    projects: ['project', 'portfolio', 'bookstore', 'application'],
    skills: ['skill', 'technology', 'programming', 'software', 'strength'],
    experience: ['experience', 'developer', 'designer', 'frontend', 'backend'],
    awards: ['award', 'certificate', 'achievement'],
    contact: ['contact', 'email', 'phone', 'reach'],
    interests: ['interest', 'passion', 'hobby']
  };
  const boostTerms = canonicalBoosts[intent.key] || [];
  const explicitBoost = boostTerms.some(term => getAiTokens(normalizedQuery).includes(term)) ? 0.2 : 0;
  return Math.min(1, score + explicitBoost);
}

function getPersonalFactAnswer(query) {
  if (/\b(name|naem|called|spell)\b/.test(query) && !/channel|project|advisor/.test(query)) return resumeKnowledge.name;
  if (/\b(age|old|years old)\b/.test(query)) return resumeKnowledge.age;
  if (/\b(what year|year level|fourth year|4th year|semester|college year|student year)\b/.test(query)) return resumeKnowledge.education;
  if (/\b(advisor|adviser|professor|prof|teacher|instructor|reference|program head|supervisor)\b/.test(query)) return resumeKnowledge.advisor;
  if (/\b(personality|character|quiet|shy|good person|social)\b/.test(query)) return resumeKnowledge.personality;
  if (/\b(biggest role|life role|purpose in life|what drives|motivation|determination|determined)\b/.test(query)) return `${resumeKnowledge.lifeRole} ${resumeKnowledge.determination}`;
  if (/\b(genshin|art|artistic|artistry|artist|for fun|hobbies|hobby|interests|passion|enjoy)\b/.test(query)) return resumeKnowledge.interests;
  if (/\b(what is he about|what is his background|about me|about him|his story|personal summary)\b/.test(query)) return resumeKnowledge.summary;
  if (/\b(first|1st|one)\b.*\b(project|resume)\b|\b(project|resume)\b.*\b(first|1st|one)\b/.test(query)) return resumeKnowledge.resumeProjectDetails.first;
  if (/\b(second|2nd|two)\b.*\b(project|resume)\b|\b(project|resume)\b.*\b(second|2nd|two)\b/.test(query)) return resumeKnowledge.resumeProjectDetails.second;
  if (/\b(third|3rd|three)\b.*\b(project|resume)\b|\b(project|resume)\b.*\b(third|3rd|three)\b/.test(query)) return resumeKnowledge.resumeProjectDetails.third;
  if (/\b(resume projects|projects in (his )?(resume|cv)|project names|three projects|besides (the )?calculator|other two projects|projects listed)\b/.test(query)) return resumeKnowledge.resumeProjects;
  if (/\b(project|projects)\b.*\b(in|on|from)\b.*\b(resume|cv)\b.*\b(detail|information|about)\b/.test(query)) return resumeKnowledge.resumeProjects;
  if (/\b(why|how)\b.*\b(great|good|strong|excellent)\b.*\b(youtube|video|editing|edit)/.test(query)) {
    return 'He is strong at YouTube video creation and editing because he combines creative art skills with practical editing tools and a good understanding of visual storytelling. He uses Premiere Pro, DaVinci Resolve, CapCut, Photoshop, and related multimedia workflows.';
  }
  if (/\b(great|good|best|excellent|proficient|capable)\b.*\b(html|css|javascript|video|editing|youtube|design)/.test(query) || /\b(html|css|javascript|video editing|editing)\b.*\b(great|good|best|excellent|proficient|capable)/.test(query)) {
    return 'Yes. Christian is strong at HTML and frontend work, and he is also talented in video editing and creative production. He has practical experience using HTML5, CSS3, JavaScript, Adobe Premiere Pro, DaVinci Resolve, CapCut, and Photoshop.';
  }
  return null;
}

const aiResponseOpeners = {
  greeting: ['Hello! I am Kousei AI.', 'Hi there! Kousei AI here.', 'Welcome! I can help with Christian\'s portfolio.', 'Good to see you. I\'m Kousei AI.'],
  help: ['Sure.', 'Here are the main topics I can cover:', 'I can help with Christian\'s portfolio.', 'Try asking me about Christian\'s'],
  identity: ['Here is a quick profile of Christian:', 'In short:', 'Christian\'s profile is:', 'A concise summary is:'],
  default: ['Here\'s the answer:', 'Here\'s what I found:', 'In short:', 'Quick answer:']
};

const strongestSkillAnswerLibrary = [
  'If I had to pick one, Christian is strongest in building polished, responsive websites and styling them with a clean, professional look. His best skill is frontend development and visual design, where HTML, CSS, and JavaScript come together to create strong user experiences.',
  'Christian’s standout strength is frontend web design and development. He is especially good at building and styling websites so they look modern, organized, and easy to use.',
  'If I had to choose one thing, Christian is best at creating and styling websites. He is strongest in frontend work: layout, visual design, and interactive web experiences that balance usability and aesthetics.'
];

const humanConversationAnswerLibrary = {
  standout: [
    'What makes Christian stand out is that he combines technical skill with creative thinking. He does not just build a website; he shapes the look, feel, and usability of it in a way that feels polished and professional.',
    'Christian stands out because he bridges design and development. He can create visually strong work while still thinking about structure, code quality, and the real user experience.',
    'He stands out in the way he mixes creativity with practical execution. His work is not only functional, but also well presented, thoughtful, and easy to use.'
  ],
  hireWhy: [
    'I would consider Christian for a role because he brings a strong mix of design awareness, front-end ability, and willingness to learn. He has the kind of profile that fits creative digital work and practical web development.',
    'Christian is a good hire because he is developing real skills in web design, frontend development, and digital media. He is also someone who seems serious about improvement and project quality.',
    'He is worth considering because he already shows a useful combination of technical ability, creative thinking, and initiative in building portfolio work.'
  ],
  special: [
    'Christian’s specialty is frontend web development and design, especially the part where code meets visual style. That is where he seems strongest and most naturally capable.',
    'His specialty is creating good-looking, functional websites with strong visual structure and clean implementation. That combination is a major strength.',
    'His main specialty seems to be frontend and creative digital work: websites, interface design, and visual execution that feels professional and user-friendly.'
  ],
  summary: [
    'Christian is a creative IT student and web designer who combines coding, visual design, and digital media to build polished work and practical projects.',
    'He is a young creative developer with a solid mix of technical skills, design sense, and media production experience, which makes him versatile in digital work.',
    'Christian is a thoughtful, creative, and technical student who can work across design, frontend development, and multimedia projects.'
  ],
  value: [
    'Christian brings value by combining technical execution with visual quality. He can help build digital work that looks good, works well, and feels thoughtfully designed.',
    'His value is in the balance he brings between design and development. He understands how a project should look and how it should function, which is a strong combination.',
    'He adds value through clean design thinking, practical coding ability, and the ability to turn ideas into polished digital experiences.'
  ],
  teammate: [
    'Christian would make a good teammate because he is thoughtful, calm, and focused on producing good work. He seems like someone who can contribute well without being difficult to work with.',
    'As a teammate, Christian seems reliable, respectful, and willing to learn. He brings a balance of creativity and discipline that can help a team move forward.',
    'He comes across as someone who is collaborative, serious about his work, and comfortable contributing in both creative and technical tasks.'
  ],
  fit: [
    'He is a strong fit for a company that values creativity, learning, digital work, and people who can handle both design and technical tasks with care.',
    'Christian fits well in environments that value growth, quality, and creative problem-solving, especially in web, design, or digital product work.',
    'He fits best in teams that appreciate initiative, creativity, and a hands-on mindset, especially where design and development meet.'
  ],
  interview: [
    'If I were answering in an interview, I would say Christian is a creative and driven student who brings together frontend development, design, and multimedia work with a strong willingness to keep improving.',
    'In an interview, I would describe him as someone who is technically capable, visually aware, and motivated to build meaningful digital work with quality and consistency.',
    'He would be described as a thoughtful, adaptable, and growth-minded person who combines technical skill with a creative eye and a strong work ethic.'
  ],
  plainEnglish: [
    'In plain English, Christian is a creative tech person who knows how to build websites, make them look good, and turn ideas into polished digital work.',
    'Simply put, Christian is someone who can design and build things for the web, and he is especially strong when the work needs both style and function.',
    'In simple terms, Christian is a young designer-developer who blends visual design, frontend work, and media creation in a practical way.'
  ],
  advantage: [
    'Christian’s biggest advantage is that he has both creative and technical thinking. He can design something well and also build it in a way that actually works.',
    'His biggest advantage is the balance between design and development. That makes him useful in projects where both style and function matter.',
    'His strongest advantage is versatility. He can move between visual work, frontend development, and digital production without losing focus.'
  ],
  promising: [
    'Christian looks promising because he is building real skills through actual projects, not just coursework. His portfolio shows initiative, creativity, and growth.',
    'He seems promising because he is already combining learning, creativity, and practical project work in a way that shows strong potential for the future.',
    'He is promising because his work shows real effort, creative thinking, and a clear direction in digital design and development.'
  ],
  pitch: [
    'If I were pitching Christian in one breath, I would say he is a creative IT student who blends design, frontend development, and multimedia skills to create polished digital work that is both functional and visually strong.',
    'My pitch for Christian is simple: he is a growing designer-developer who understands both the technical side and the creative side of a project, which makes him useful in modern digital work.',
    'I would pitch Christian as a creative and capable digital talent who can contribute to web design, frontend development, and visual storytelling with a strong willingness to learn and improve.'
  ],
  shortAnswer: [
    'Short answer: Christian is a creative designer-developer who builds polished websites and digital projects with strong design and technical skills.',
    'In one sentence: Christian is a creative, driven IT student who mixes frontend development, visual design, and multimedia work to create strong digital results.',
    'Quick answer: Christian is a designer and developer with a good balance of creativity, coding, and problem-solving.'
  ],
  personality: [
    'Christian comes across as thoughtful, quiet, determined, and creative. He is not loud, but he is serious about his work and has a calm, focused energy.',
    'He seems like a person who is shy at first but genuinely friendly, disciplined, and motivated once he starts working on something meaningful.',
    'Christian feels like a thoughtful, humble, and growth-minded person who values quality, effort, and continuous learning.'
  ],
  future: [
    'Christian’s future looks strong because he is already building relevant experience in design, frontend work, and multimedia production. He has room to grow quickly if he keeps improving and building real projects.',
    'His future potential is good because he is combining education, creativity, and practical portfolio work in a way that points toward strong long-term growth.',
    'I see strong potential in Christian because he is still developing, but his current direction already shows a clear blend of design, development, and digital media capability.'
  ],
  edge: [
    'Christian’s edge is that he understands both the technical side and the visual side of a project. That is a big advantage in web and digital work.',
    'His edge is versatility. He can move between design, frontend implementation, and media editing without losing quality or direction.',
    'What gives him an edge is his balance of creativity and execution. He is not just thinking in code; he is also thinking about the user experience and visual outcome.'
  ],
  workStyle: [
    'Christian’s work style seems organized, practical, and detail-focused. He appears to value clean execution, good presentation, and thoughtful results.',
    'He seems to work in a structured, hands-on way where quality matters. He likes to build things with care and keep refining the work until it feels polished.',
    'His work style feels creative but disciplined. He is likely the kind of person who plans clearly, executes well, and improves based on what the project needs.'
  ],
  recommend: [
    'I would recommend Christian if the role needs someone who is creative, practical, and eager to grow in digital design and development. He has a strong base for that kind of work.',
    'Yes, I would recommend him for digital and design-oriented work because he shows initiative, technical curiosity, and a good visual sense.',
    'He is worth recommending for creative tech roles, especially where design, frontend development, and media production all matter.'
  ],
  roleFit: [
    'Christian fits roles where design, web, and digital creativity matter most. He would likely do well in frontend, UI-oriented, creative tech, or digital media-focused positions.',
    'He seems best suited for roles that combine design and development, such as frontend design, web development, digital content, and creative digital projects.',
    'The best fits for Christian are jobs that combine visual thinking with technical implementation, especially in web and digital product work.'
  ],
  worthIt: [
    'Yes, Christian is worth considering. He brings a useful mix of creativity, technical skill, and growth potential that makes him a promising candidate in digital work.',
    'He is worth it for roles that value potential, visual thinking, and project-based digital skills. He is still growing, but the foundation is already solid.',
    'He is worth considering, especially if the company wants someone who can help with design and development in a modern digital environment.'
  ],
  simpleDescription: [
    'Christian is a creative student who builds websites, works on digital designs, and creates media content with both technical and artistic skills.',
    'He is a young designer and developer who blends coding with creativity and builds projects that look good and work well.',
    'Christian is basically a creative tech person who can design, develop, and produce digital content in a practical and polished way.'
  ],
  trust: [
    'I would trust Christian to contribute seriously in a creative digital role because he appears thoughtful, disciplined, and motivated by quality work.',
    'He gives the impression of someone who takes his work seriously and is willing to improve, which makes him trustworthy in project-based environments.',
    'Christian seems like the kind of person who would handle responsibility with care, especially in creative and technical tasks where attention to detail matters.'
  ]
};

const aiAnswerVariants = {
  identity: [
    resumeKnowledge.summary,
    `${resumeKnowledge.name} is studying Information Technology while building experience as a graphic and web designer, video editor, and content creator.`,
    `Christian combines technical and creative work: he develops frontend projects, works with databases, creates visual designs, and edits video content.`
  ],
  education: [
    resumeKnowledge.education,
    `Christian is currently completing a Bachelor of Science in Information Technology at Philippine Christian University in Manila. He is in his fourth year, first semester, and expects to graduate in 2027.`,
    `His academic path is Information Technology at Philippine Christian University. The profile lists him as a fourth-year student in the first semester, with graduation expected in 2027.`
  ],
  skills: [
    resumeKnowledge.skills,
    `Christian works across both development and creative production. His technical toolkit includes HTML5, CSS3, JavaScript, Python, SQL, and MySQL, while his creative tools include Premiere Pro, DaVinci Resolve, CapCut, and Photoshop.`,
    `For web and database work, he uses HTML5, CSS3, JavaScript, Python, SQL, and MySQL. For design and media, he uses Adobe Premiere Pro, DaVinci Resolve, CapCut, Photoshop, and common Microsoft document tools.`
  ],
  projects: [
    resumeKnowledge.projects,
    `The portfolio connects Christian's work to three areas: a responsive website portfolio, an online bookstore application backed by SQL/MySQL, and multimedia asset optimization involving editing, rendering, and delivery workflows.`,
    `His featured work shows a mix of frontend design, database application development, and digital media production. The Projects section may also include additional Major and Minor Projects uploaded through the project manager.`
  ],
  experience: [
    resumeKnowledge.experience,
    `Christian's experience brings together frontend development, web and database applications, graphic design, and video editing. He pays attention to responsive UI/UX, cross-browser behavior, clean code, and practical media workflows.`,
    `His background is multidisciplinary: he builds and designs web experiences, works with application data, and optimizes digital media. That combination lets him approach projects from both a technical and visual perspective.`
  ],
  awards: [
    resumeKnowledge.awards,
    `Academically, Christian has been recognized on the Outstanding Dean's List in his first, second, and third years. He also received an Outstanding Performance in Object Oriented Programming certificate.`,
    `The listed achievements are consistent academic recognition across three years, together with an Outstanding Performance in Object Oriented Programming certificate.`
  ],
  contact: [
    resumeKnowledge.contact,
    `The direct way to reach Christian is kouseilarscii@gmail.com. You can also use Contact Me on this website or the social links in the footer for another route.`,
    `For a message, collaboration, or hiring inquiry, use the Contact Me tab. Christian's profile also lists kouseilarscii@gmail.com as his email address.`
  ],
  interests: [
    resumeKnowledge.interests,
    `Christian's interests sit at the intersection of art and technology. He enjoys graphic design, photo manipulation, video editing, frontend development, application design, databases, and making videos for fun.`,
    `Outside his technical studies, Christian enjoys creative work such as art, design, and video creation. He is also interested in frontend development, databases, and playing Genshin Impact.`
  ],
  navigation: [
    'Use the navigation bar to explore Home, Videos, Projects, Friends, Live Timeline, AI Chatbox, Resume, and Contact Me.',
    'You can browse Home, Videos, Projects, Friends, Live Timeline, AI Chatbox, Resume, and Contact Me from the main navigation.',
    'For a guided tour, start with Home, then open Videos or Projects for his work, Resume for background details, and Contact Me to reach him.'
  ],
  thanks: [
    'You are welcome! I am here whenever you want to explore Christian\'s portfolio.',
    'Glad I could help. You can ask about another part of Christian\'s work whenever you like.',
    'You are welcome. Try asking about his projects, skills, education, or creative interests next.'
  ]
};

function varyAiResponse(answer, intentKey = 'default') {
  if (!answer) return answer;
  const openers = aiResponseOpeners[intentKey] || aiResponseOpeners.default;
  let cursor = aiResponseCursors[intentKey] || 0;
  let opener = openers[cursor % openers.length];
  const answerOptions = aiAnswerVariants[intentKey];
  const variedAnswer = answerOptions ? answerOptions[cursor % answerOptions.length] : answer;
  aiResponseCursors[intentKey] = cursor + 1;

  if (openers.length > 1 && `${opener} ${variedAnswer}` === lastAiResponse) {
    opener = openers[(cursor + 1) % openers.length];
    aiResponseCursors[intentKey] += 1;
  }

  const response = intentKey === 'greeting'
    ? opener
    : `${opener} ${variedAnswer}`.replace(/\s+/g, ' ').trim();

  lastAiResponse = response;
  return response;
}

function getStrongestSkillAnswer(query) {
  const explicitStrongestSignals = /(?:number\s*one|#1|top\s*1|pick\s+one|just\s+pick\s+one|one\s+thing|strongest\s+area|strongest\s+skill|best\s+skill|best\s+at|most\s+(?:skilled|capable|talented)|what\s+is\s+his\s+(?:best|strongest|top|number\s*1|#1)\s*(?:skill|strength|thing|area)|which\s+(?:skill|strength|thing|area)\s+is\s+(?:his\s+)?(?:best|strongest|top|number\s*one|#1)|what\s+(?:is|are)\s+(?:his|christian's)\s+(?:best|strongest|top|number\s*one|#1)\s*(?:skill|strength|thing|area)|what\s+is\s+his\s+main\s+(?:skill|strength)|what\s+is\s+his\s+most\s+important\s+(?:skill|strength)|what\s+is\s+his\s+number\s*(?:1|one)\s*(?:skill|strength|thing)|what\s+is\s+his\s+top\s+(?:skill|strength)|what\s+is\s+christian\s+best\s+at|what\s+is\s+christian\s+strongest\s+at|which\s+is\s+his\s+best\s+skill|which\s+is\s+his\s+strongest\s+skill)/i;

  if (!explicitStrongestSignals.test(query)) {
    return null;
  }

  const answer = strongestSkillAnswerLibrary[(aiResponseCursors.strongestSkill || 0) % strongestSkillAnswerLibrary.length];
  aiResponseCursors.strongestSkill = (aiResponseCursors.strongestSkill || 0) + 1;
  return answer;
}

function getHumanConversationAnswer(query) {
  const lower = normalizeAiText(query || '').toLowerCase();
  const patterns = [
    { check: /(stand out|why should i choose|why should i hire|what makes him special|what makes christian stand out|what makes him different|why him|why should i hire him)/, key: 'standout' },
    { check: /(hire him|should i hire|worth hiring|good hire|why hire|why should i consider him|why choose him)/, key: 'hireWhy' },
    { check: /(specialty|specialize|specialised|main skill|main strength|biggest strength|specialization|what is his specialty|what is he known for)/, key: 'special' },
    { check: /(summarize christian|summary|give me a short summary|short description|quick summary|describe him in one sentence|simple summary)/, key: 'summary' },
    { check: /(value|what value|what can he bring|what can he offer|what does he bring to the table|what does he offer|what is his value)/, key: 'value' },
    { check: /(good teammate|teammate|team player|work with him|how is he as a teammate|what kind of teammate is he)/, key: 'teammate' },
    { check: /(good fit|best fit|fit for|company fit|what kind of company|what kind of workplace|would he fit|is he a good fit)/, key: 'fit' },
    { check: /(interview answer|interview question|how would you describe him in an interview|what would you say in an interview|describe him in an interview|interview style)/, key: 'interview' },
    { check: /(plain english|simple english|simple terms|in simple words|plain and simple|explain in simple terms|in plain language)/, key: 'plainEnglish' },
    { check: /(biggest advantage|greatest advantage|what is his biggest advantage|what is his advantage|why is he strong|his biggest strength|main advantage|main benefit)/, key: 'advantage' },
    { check: /(promising|potential|good potential|why is he promising|what makes him promising|looks promising|strong potential)/, key: 'promising' },
    { check: /(pitch him|pitch christian|how would you pitch him|how would you sell him|sell him|how to present him|present him|what is his elevator pitch|elevator pitch)/, key: 'pitch' },
    { check: /(one sentence|short answer|quick answer|in one line|brief answer|very short answer|few words|one line|short version|simple answer)/, key: 'shortAnswer' },
    { check: /(what kind of person is he|what is he like personally|what is his personality|what is his vibe|what is he like as a person|how would you describe his personality|what kind of guy is he)/, key: 'personality' },
    { check: /(future|future potential|what can he become|where is he headed|how far can he go|what is his potential|what is his growth|best future|long term potential)/, key: 'future' },
    { check: /(what makes him good|what makes him strong|what are his strengths|what is his edge|what is his advantage over others|why is he good|what is his superpower|what makes him stand out)/, key: 'edge' },
    { check: /(work style|what is his work style|work ethic|how does he work|how does he think|how does he operate|how does he do his work|what style does he have)/, key: 'workStyle' },
    { check: /(recommend him|would you recommend him|recommend christian|worth it|is he worth it|worth considering|good candidate|good investment|good choice)/, key: 'recommend' },
    { check: /(what job fits him|what role fits him|which role suits him|which job suits him|best role for him|best fit role|what kind of job does he fit|what type of role should he target)/, key: 'roleFit' },
    { check: /(worth it|is he worth it|good for the team|good fit for the team|would he be worth hiring|bad decision|good opportunity|great addition)/, key: 'worthIt' },
    { check: /(give me a simple description|describe him simply|tell me in simple words|describe christian simply|give me a plain description|say it simply)/, key: 'simpleDescription' },
    { check: /(would you trust him|can i trust him|would you trust christian|reliable|dependable|can he be trusted|can he handle responsibility)/, key: 'trust' },
    { check: /(good for a team|good in a team|does he work well in a team|can he work with others|does he collaborate|how does he collaborate|team spirit|teamwork attitude)/, key: 'teammate' },
    { check: /(what is his strongest point|strongest point|biggest talent|best quality|favorite quality|what is his best trait|best trait|best quality)/, key: 'edge' },
    { check: /(how would you describe him in 3 words|describe him in 3 words|3 word description|describe in 3 words|in three words)/, key: 'shortAnswer' },
    { check: /(what makes him different from others|why are you recommending him|why is he different|what sets him apart|what sets christian apart|what makes him unique)/, key: 'standout' },
    { check: /(why is he interesting|why should i pay attention to him|why should i look at him|what is interesting about him|what is special about him|why is he impressive)/, key: 'standout' },
    { check: /(what is he like at work|what is he like in a workplace|what is his office vibe|his work vibe|what is he like professionally|professional vibe)/, key: 'personality' },
    { check: /(is he a good asset|is he a valuable asset|asset to the company|valuable addition|good addition|good asset)/, key: 'value' },
    { check: /(why would a company want him|why would an employer want him|why would they hire him|why would they choose him|what does a company get from him)/, key: 'hireWhy' },
    { check: /(how would you talk about him in an interview|what would you say in a job interview|what would you say in an interview for him|interview pitch)/, key: 'interview' },
    { check: /(high potential|strong potential|real potential|great potential|promising talent|emerging talent|future talent)/, key: 'promising' },
    { check: /(good at website|good at websites|good at web design|good at frontend|good at frontend development|good at html|good at css|good at javascript)/, key: 'special' },
    { check: /(what are his top qualities|top qualities|best qualities|great qualities|what qualities make him good|qualities that stand out)/, key: 'edge' },
    { check: /(how would you describe him to a client|how would you describe him to an employer|describe him to a recruiter|how would you sell him to a recruiter)/, key: 'pitch' }
  ];

  const match = patterns.find(item => item.check.test(lower));
  if (!match) return null;

  const items = humanConversationAnswerLibrary[match.key] || [];
  if (!items.length) return null;
  const answer = items[(aiResponseCursors[match.key] || 0) % items.length];
  aiResponseCursors[match.key] = (aiResponseCursors[match.key] || 0) + 1;
  return answer;
}

function getCombinedAiAnswer(query) {
  const topicSignals = [
    ['education', /education|school|university|degree|study|student/],
    ['skills', /skill|technology|programming|software|tool|ability/],
    ['projects', /project|portfolio|website|application|bookstore/],
    ['experience', /experience|career|developer|designer|frontend|backend|database/],
    ['awards', /award|certificate|achievement|recognition|honor/],
    ['contact', /contact|email|phone|reach|hire|collaborat/],
    ['interests', /interest|hobby|passion|enjoy|art|genshin/]
  ];
  const requestedTopics = topicSignals.filter(([, signal]) => signal.test(query)).map(([key]) => key);
  const asksForMultiple = /\b(and|also|as well|plus|both|each|all)\b|,/.test(query);
  if (!asksForMultiple || requestedTopics.length < 2) return null;

  const answers = requestedTopics.slice(0, 3).map(key => {
    const intent = aiIntents.find(item => item.key === key);
    const options = aiAnswerVariants[key];
    return options?.[(aiResponseCursors[key] || 0) % options.length] || intent?.answer;
  }).filter(Boolean);
  return answers.length > 1 ? { answer: answers.join('\n\n'), intentKey: requestedTopics[0] } : null;
}

function getBotResponse(input) {
  const normalizedQuery = normalizeAiText(input);
  const queryTokens = getAiTokens(normalizedQuery);
  const followUp = /\b(more|detail|details|explain|elaborate|that|this|it|also|else)\b/.test(normalizedQuery);

  if (/\b(how about|what about)\b.*\b(resume|cv|academic experience)\b/.test(normalizedQuery)
    || (/\b(in the resume|on the resume|resume version|cv version|academic experience)\b/.test(normalizedQuery)
      && ['projectData', 'projects', 'resumeProjects'].includes(lastAiIntentKey))) {
    lastAiIntentKey = 'resumeProjects';
    return varyAiResponse(resumeKnowledge.resumeProjects, 'resumeProjects');
  }

  const profileAnswer = getProfileQuestionAnswer(input);
  if (profileAnswer && profileAnswer.answer) {
    lastAiIntentKey = profileAnswer.intentKey;
    return varyAiResponse(profileAnswer.answer, profileAnswer.intentKey);
  }

  const personalFactAnswer = getPersonalFactAnswer(normalizedQuery);
  if (personalFactAnswer) {
    if (/project|resume|cv|calculator/.test(normalizedQuery)) lastAiIntentKey = 'resumeProjects';
    else if (/advisor|professor|reference|teacher/.test(normalizedQuery)) lastAiIntentKey = 'advisor';
    else if (/personality|quiet|shy/.test(normalizedQuery)) lastAiIntentKey = 'personality';
    else if (/determination|motivation|role in life|drives/.test(normalizedQuery)) lastAiIntentKey = 'determination';
    else if (/art|genshin|hobby|interest|enjoy/.test(normalizedQuery)) lastAiIntentKey = 'interests';
    else lastAiIntentKey = 'identity';
    return varyAiResponse(personalFactAnswer, lastAiIntentKey);
  }

  const strongestSkillAnswer = getStrongestSkillAnswer(normalizedQuery);
  if (strongestSkillAnswer) {
    lastAiIntentKey = 'skills';
    return `${strongestSkillAnswer}`;
  }

  const conversationalAnswer = getHumanConversationAnswer(input);
  if (conversationalAnswer) {
    lastAiIntentKey = 'skills';
    return `${conversationalAnswer}`;
  }

  const combinedAnswer = getCombinedAiAnswer(normalizedQuery);
  if (combinedAnswer) {
    lastAiIntentKey = combinedAnswer.intentKey;
    return varyAiResponse(combinedAnswer.answer);
  }

  if (/\b(project|projects)\b/.test(normalizedQuery) && /\b(resume|cv|academic experience)\b/.test(normalizedQuery)) {
    lastAiIntentKey = 'resumeProjects';
    return varyAiResponse(resumeKnowledge.resumeProjects, 'resumeProjects');
  }

  const liveYoutubeAnswer = getLiveYoutubeAnswer(normalizedQuery);
  if (liveYoutubeAnswer) {
    lastAiIntentKey = 'youtube';
    return varyAiResponse(liveYoutubeAnswer, 'youtube');
  }

  const liveProjectAnswer = getLiveProjectAnswer(normalizedQuery);
  if (liveProjectAnswer) {
    lastAiIntentKey = 'projectData';
    return varyAiResponse(liveProjectAnswer, 'projectData');
  }

  if (/\b(?:what\s+(?:is|does|the)\s+)?(?:he|christian)\s+(?:really\s+)?good\s+at\b|\bwhat\s+does\s+he\s+really\s+good\s+at\b|\bwhat\s+is\s+he\s+good\s+at\b|\bwhat\s+is\s+christian\s+good\s+at\b/.test(normalizedQuery)) {
    lastAiIntentKey = 'skills';
    return varyAiResponse('Christian is strong at frontend web design and development, and he also works well with digital design, media editing, and project-based creative work. His main technical foundation includes HTML, CSS, JavaScript, SQL, and design tools such as Photoshop and Premiere Pro.', 'skills');
  }

  if (/\b(good|great|best|strong|strongest|talent|talented|excellent|proficient|capable)\b/.test(normalizedQuery)) {
    lastAiIntentKey = 'skills';
    return varyAiResponse(resumeKnowledge.skills, 'skills');
  }

  if (/\bwhat\s+(?:does|did)\s+(?:he|christian)\s+(?:do|work|have)\b|\bwhat\s+he\s+do\b|\bwhat\s+is\s+his\s+role\b|\bwhat\s+is\s+he\s+doing\b|\bwhat\s+kind\s+of\s+work\s+does\s+he\s+do\b/.test(normalizedQuery)) {
    lastAiIntentKey = 'experience';
    return varyAiResponse(resumeKnowledge.experience, 'experience');
  }

  if (queryTokens.includes('project') && !queryTokens.some(token => ['skill', 'technology', 'programming', 'software'].includes(token))) {
    lastAiIntentKey = 'projects';
    return varyAiResponse(resumeKnowledge.projects, 'projects');
  }

  if (queryTokens.some(token => ['bookstore', 'application', 'portfolio'].includes(token)) && !queryTokens.some(token => ['skill', 'technology', 'programming', 'software'].includes(token))) {
    lastAiIntentKey = 'projects';
    return varyAiResponse(resumeKnowledge.projects, 'projects');
  }

  if ((queryTokens.includes('website') || queryTokens.includes('websites')) && queryTokens.some(token => ['build', 'built', 'create', 'created', 'make', 'made'].includes(token))) {
    lastAiIntentKey = 'projects';
    return varyAiResponse(resumeKnowledge.projects, 'projects');
  }

  if (queryTokens.some(token => ['education', 'school', 'university', 'degree', 'study', 'academic'].includes(token))) {
    lastAiIntentKey = 'education';
    return varyAiResponse(resumeKnowledge.education, 'education');
  }

  if (queryTokens.some(token => ['contact', 'email', 'phone', 'reach', 'collaborate'].includes(token)) && !queryTokens.some(token => ['skill', 'project', 'education', 'study'].includes(token))) {
    lastAiIntentKey = 'contact';
    return varyAiResponse(resumeKnowledge.contact, 'contact');
  }

  const helpRequestPattern = /(what\s+(?:questions?|topics?)\s+(?:can|could|should)\s+i\s+(?:ask|ask\s+you)|what\s+(?:can|could|should)\s+i\s+ask\s+(?:you|this\s+bot)|what\s+do\s+you\s+know|what\s+can\s+you\s+answer|possible\s+questions?|question\s+examples?|show\s+me\s+topics?|give\s+me\s+examples\s+of\s+questions?|suggest\s+questions?|qword|keyword)/i;
  if (helpRequestPattern.test(normalizedQuery)) {
    lastAiIntentKey = 'help';
    return varyAiResponse(aiIntents.find(intent => intent.key === 'help').answer, 'help');
  }

  if (followUp && lastAiIntentKey && getAiTokens(normalizedQuery).length <= 2) {
    const previousIntent = aiIntents.find(intent => intent.key === lastAiIntentKey);
    if (previousIntent) return varyAiResponse(`I can expand on that: ${previousIntent.answer}`, lastAiIntentKey);
  }

  const rankedIntents = aiIntents
    .map(intent => ({ intent, score: intentScore(normalizedQuery, intent) }))
    .sort((first, second) => second.score - first.score);
  const asksForHelpTopics = /what can i ask|what should i ask|possible question|question example|what do you know|show me topic|qword|keyword/.test(normalizedQuery);
  const strongMatches = rankedIntents
    .filter(match => match.score >= 0.42 && (match.intent.key !== 'help' || asksForHelpTopics))
    .slice(0, 2);
  const bestMatch = strongMatches[0] || rankedIntents[0];

  if (followUp && lastAiIntentKey) {
    const previousIntent = aiIntents.find(intent => intent.key === lastAiIntentKey);
    if (previousIntent && !strongMatches.length) return `Here is more about that: ${previousIntent.answer}`;
  }

  if (bestMatch && bestMatch.score >= 0.42) {
    lastAiIntentKey = bestMatch.intent.key;
    return varyAiResponse(bestMatch.intent.answer, bestMatch.intent.key);
  }
  if (normalizedQuery.includes('resume') || normalizedQuery.includes('cv')) {
    lastAiIntentKey = 'identity';
    return `${resumeKnowledge.summary} ${resumeKnowledge.experience} You can open the Resume tab for the complete CV.`;
  }
  if (followUp && lastAiIntentKey) {
    const previousIntent = aiIntents.find(intent => intent.key === lastAiIntentKey);
    if (previousIntent) return varyAiResponse(`I can expand on that: ${previousIntent.answer}`, lastAiIntentKey);
  }
  return varyAiResponse('I can help with Christian\'s education, skills, projects, experience, awards, interests, contact information, and portfolio navigation. Try asking about one topic or combine topics, such as his skills and projects.', 'help');
}

function getCurrentTime() {
  return new Intl.DateTimeFormat([], { hour: 'numeric', minute: '2-digit' }).format(new Date());
}

async function callGeminiResponse(userQuery) {
  if (!USE_GEMINI_BACKEND) return null;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userQuery })
    });

    if (!response.ok) {
      throw new Error(`Backend request failed: ${response.status}`);
    }

    const data = await response.json();
    return data?.reply || null;
  } catch (error) {
    console.warn('Gemini backend fallback failed:', error);
    return null;
  }
}

function shouldUseGeminiFallback(query, localReply) {
  if (!USE_GEMINI_BACKEND) return false;
  if (!query || !localReply) return false;

  const normalizedQuery = normalizeAiText(query).toLowerCase();
  const genericFallback = /(?:what can i ask|what should i ask|what do you know|how are you|hello|hi|hey|who are you|can you help|help me)/i.test(normalizedQuery);
  const humanStylePrompt = /(?:what is he good at|what is christian good at|what is he really good at|what does he do best|what is his strongest skill|what is his number one skill|what is his top strength|why should i hire him|what makes him stand out|what is his value|how would you describe him in an interview|what is he like as a person|what makes him special|what should i know about christian|tell me about christian)/i.test(normalizedQuery);
  const localIsGeneric = /I can help with Christian's education, skills, projects, experience, awards, interests, contact information, and portfolio navigation/i.test(localReply);

  return Boolean((humanStylePrompt || genericFallback) && localIsGeneric);
}

async function getPreferredAiReply(query) {
  if (!query || !query.trim()) return 'Please type a question to start the chat.';

  const geminiReply = await callGeminiResponse(query);
  if (geminiReply) return geminiReply;

  const liveDataReply = getLiveYoutubeAnswer(query) || getLiveProjectAnswer(query);
  if (liveDataReply) return liveDataReply;

  return getBotResponse(query);
}

function appendMessage(message, type, targetId = 'aiChatMessages') {
  const messagesContainer = document.getElementById(targetId);
  if (!messagesContainer) return;
  const row = document.createElement('div');
  row.className = `ai-message-row ${type}-row`;

  if (type === 'bot') {
    const avatar = document.createElement('img');
    avatar.className = 'message-avatar';
    avatar.src = aiProfileImage;
    avatar.alt = 'Kousei AI';
    row.appendChild(avatar);
  }

  const bubble = document.createElement('div');
  bubble.className = `ai-message ${type}`;
  if (type === 'bot') {
    const author = document.createElement('span');
    author.className = 'message-author';
    author.textContent = 'Kousei AI';
    bubble.appendChild(author);
  }
  bubble.appendChild(document.createTextNode(message));
  const time = document.createElement('span');
  time.className = 'message-time';
  time.textContent = getCurrentTime();
  bubble.appendChild(time);
  row.appendChild(bubble);
  messagesContainer.appendChild(row);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  const createdAt = new Date().toISOString();
  aiSessionMessages.push({ message, type, createdAt });
  saveAiChatSession();
}

function showTypingIndicator(targetId = 'aiChatMessages') {
  const messagesContainer = document.getElementById(targetId);
  if (!messagesContainer) return;
  const row = document.createElement('div');
  row.className = 'ai-message-row bot-row';
  row.id = `${targetId}TypingIndicator`;
  row.innerHTML = `<img src="${aiProfileImage}" alt="Kousei AI" class="message-avatar"><div class="ai-message bot ai-typing"><span></span><span></span><span></span></div>`;
  messagesContainer.appendChild(row);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator(targetId = 'aiChatMessages') {
  document.getElementById(`${targetId}TypingIndicator`)?.remove();
}

function sendAiMessage(inputId = 'aiChatInput', targetId = 'aiChatMessages') {
  const inputField = document.getElementById(inputId);
  if (!inputField) return;
  if (aiAvailability !== 'online') {
    appendMessage('AI chat is currently offline. Please try again later.', 'bot', targetId);
    inputField.value = '';
    return;
  }
  const query = inputField.value.trim();
  if (!query) return;

  appendMessage(query, 'user', targetId);
  if (aiSessionTitle === 'New AI conversation') aiSessionTitle = query.slice(0, 72);
  inputField.value = '';
  inputField.focus();
  showTypingIndicator(targetId);

  window.setTimeout(async () => {
    removeTypingIndicator(targetId);

    const botReply = await getPreferredAiReply(query);
    appendMessage(botReply, 'bot', targetId);
  }, 450);
}

function askAiPrompt(prompt, inputId = 'aiChatInput', targetId = 'aiChatMessages') {
  const inputField = document.getElementById(inputId);
  if (!inputField) return;
  inputField.value = prompt;
  sendAiMessage(inputId, targetId);
}

function formatAiDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? 'Unknown date' : new Intl.DateTimeFormat([], { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function getAiSessionRef(id = aiSessionId) {
  return typeof db !== 'undefined' ? db.collection('ai_chat_sessions').doc(id) : null;
}

function saveAiChatSession() {
  const ref = getAiSessionRef();
  if (!ref || !aiSessionMessages.length) return;
  const hasUserMessage = aiSessionMessages.some(item => item.type === 'user' && item.message.trim());
  const ids = JSON.parse(localStorage.getItem(aiHistoryStorageKey) || '[]');

  if (!hasUserMessage) {
    ref.delete().catch(error => console.warn('Empty AI chat session could not be removed:', error));
    localStorage.setItem(aiHistoryStorageKey, JSON.stringify(ids.filter(id => id !== aiSessionId)));
    return;
  }

  const payload = {
    sessionId: aiSessionId,
    title: aiSessionTitle,
    messages: aiSessionMessages,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    createdAt: aiSessionMessages[0].createdAt
  };
  ref.set(payload, { merge: true }).catch(error => console.warn('AI chat history could not be saved:', error));
  if (!ids.includes(aiSessionId)) {
    ids.unshift(aiSessionId);
    localStorage.setItem(aiHistoryStorageKey, JSON.stringify(ids.slice(0, 40)));
  }
}

function clearAiChatMessages() {
  const container = document.getElementById('aiChatMessages');
  if (!container) return;
  container.innerHTML = '';
  aiSessionMessages = [];
  aiSessionTitle = 'New AI conversation';
  lastAiIntentKey = null;
}

function startNewAiChat() {
  saveAiChatSession();
  clearAiChatMessages();
  aiSessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem(aiSessionStorageKey, aiSessionId);
  aiSessionMessages = [];
  aiSessionTitle = 'New AI conversation';
  appendMessage('Hello! I am Kousei AI. What would you like to know about Christian?', 'bot');
  saveAiChatSession();
}

async function loadAiChatSession(id) {
  const ref = getAiSessionRef(id);
  if (!ref) return;
  const snapshot = await ref.get();
  if (!snapshot.exists) return;
  const data = snapshot.data();
  aiSessionId = id;
  localStorage.setItem(aiSessionStorageKey, id);
  aiSessionTitle = data.title || 'Restored AI conversation';
  aiSessionMessages = [];
  const container = document.getElementById('aiChatMessages');
  if (!container) return;
  container.innerHTML = '';
  (data.messages || []).forEach(item => {
    appendRestoredMessage(item.message, item.type, item.createdAt);
  });
  aiSessionReady = true;
  toggleAiChatHistory(false);
}

function appendRestoredMessage(message, type, createdAt) {
  const container = document.getElementById('aiChatMessages');
  const row = document.createElement('div');
  row.className = `ai-message-row ${type}-row`;
  if (type === 'bot') {
    const avatar = document.createElement('img');
    avatar.className = 'message-avatar'; avatar.src = aiProfileImage; avatar.alt = 'Kousei AI'; row.appendChild(avatar);
  }
  const bubble = document.createElement('div');
  bubble.className = `ai-message ${type}`;
  if (type === 'bot') {
    const author = document.createElement('span'); author.className = 'message-author'; author.textContent = 'Kousei AI'; bubble.appendChild(author);
  }
  bubble.appendChild(document.createTextNode(message));
  const time = document.createElement('span'); time.className = 'message-time'; time.textContent = formatAiDate(createdAt); bubble.appendChild(time);
  row.appendChild(bubble); container.appendChild(row);
  aiSessionMessages.push({ message, type, createdAt });
  container.scrollTop = container.scrollHeight;
}

async function toggleAiChatHistory(force) {
  const panel = document.getElementById('aiChatHistory');
  const list = document.getElementById('aiChatHistoryList');
  if (!panel || !list) return;
  const shouldOpen = typeof force === 'boolean' ? force : panel.hidden;
  panel.hidden = !shouldOpen;
  if (!shouldOpen) return;
  list.innerHTML = '<p>Loading history…</p>';
  const ids = JSON.parse(localStorage.getItem(aiHistoryStorageKey) || '[]');
  const sessions = [];
  for (const id of ids) {
    try {
      const ref = getAiSessionRef(id);
      const snap = await ref?.get();
      if (!snap?.exists) continue;
      const data = snap.data();
      if (!(data.messages || []).some(item => item.type === 'user' && item.message?.trim())) {
        await ref.delete();
        continue;
      }
      sessions.push({ id, ...data });
    } catch (error) { console.warn(error); }
  }
  list.innerHTML = sessions.length ? sessions.map(session => `<div class="ai-history-item" onclick="loadAiChatSession('${session.id}')"><strong>${escapeAiText(session.title || 'AI conversation')}</strong><span>${formatAiDate(session.updatedAt?.toDate ? session.updatedAt.toDate() : session.updatedAt || session.createdAt)}</span></div>`).join('') : '<p>No saved conversations yet.</p>';
}

function escapeAiText(value) { return String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }

function openFloatingAiChat() {
  const panel = document.getElementById('floatingAiPanel');
  if (!panel) return;
  panel.hidden = false;
  positionFloatingAiPanel();
  renderFloatingAiMessages();
  document.getElementById('floatingAiInput')?.focus();
}

function updateAiAvailabilityUI() {
  document.querySelectorAll('.ai-online-dot').forEach(dot => {
    dot.classList.toggle('ai-status-online', aiAvailability === 'online');
    dot.classList.toggle('ai-status-offline', aiAvailability !== 'online');
  });
  document.querySelectorAll('[data-ai-availability]').forEach(element => {
    element.textContent = aiAvailability === 'online' ? 'Online · AI chat assistant' : 'Offline · AI chat unavailable';
    element.classList.toggle('ai-status-online', aiAvailability === 'online');
    element.classList.toggle('ai-status-offline', aiAvailability !== 'online');
  });
  document.querySelectorAll('[data-ai-chat-input], #aiChatInput, #floatingAiInput').forEach(input => {
    input.disabled = aiAvailability !== 'online';
    input.placeholder = aiAvailability === 'online' ? 'Ask Kousei AI...' : 'AI chat is offline';
  });
  document.querySelectorAll('[data-ai-send], .ai-send-btn, .floating-ai-panel-input button').forEach(button => { button.disabled = aiAvailability !== 'online'; });
}

function initAiAvailabilityListener() {
  if (typeof db === 'undefined') return;
  db.collection('site_control').doc('ai_status').onSnapshot(snapshot => {
    aiAvailability = snapshot.exists && snapshot.data().status === 'offline' ? 'offline' : 'online';
    updateAiAvailabilityUI();
  }, error => console.warn('AI availability status could not load:', error));
}

function closeFloatingAiChat() {
  const panel = document.getElementById('floatingAiPanel');
  if (panel) panel.hidden = true;
}

function renderFloatingAiMessages() {
  const container = document.getElementById('floatingAiMessages');
  if (!container) return;
  container.innerHTML = '';
  const messages = aiSessionMessages.length ? aiSessionMessages : [{ message: 'Hello! Ask me anything about Christian.', type: 'bot', createdAt: new Date().toISOString() }];
  messages.forEach(item => appendRestoredMessageTo(item.message, item.type, item.createdAt, 'floatingAiMessages'));
}

function appendRestoredMessageTo(message, type, createdAt, targetId) {
  const container = document.getElementById(targetId);
  if (!container) return;
  const row = document.createElement('div');
  row.className = `ai-message-row ${type}-row`;
  if (type === 'bot') {
    const avatar = document.createElement('img');
    avatar.className = 'message-avatar'; avatar.src = aiProfileImage; avatar.alt = 'Kousei AI'; row.appendChild(avatar);
  }
  const bubble = document.createElement('div');
  bubble.className = `ai-message ${type}`;
  if (type === 'bot') {
    const author = document.createElement('span'); author.className = 'message-author'; author.textContent = 'Kousei AI'; bubble.appendChild(author);
  }
  bubble.appendChild(document.createTextNode(message));
  const time = document.createElement('span'); time.className = 'message-time'; time.textContent = formatAiDate(createdAt); bubble.appendChild(time);
  row.appendChild(bubble); container.appendChild(row);
  container.scrollTop = container.scrollHeight;
}

function sendFloatingAiMessage() {
  sendAiMessage('floatingAiInput', 'floatingAiMessages');
}

function startFloatingNewAiChat() {
  startNewAiChat();
  renderFloatingAiMessages();
}

async function toggleFloatingAiHistory(force) {
  const panel = document.getElementById('floatingAiHistory');
  const list = document.getElementById('floatingAiHistoryList');
  if (!panel || !list) return;
  const shouldOpen = typeof force === 'boolean' ? force : panel.hidden;
  panel.hidden = !shouldOpen;
  if (!shouldOpen) return;

  list.innerHTML = '<p>Loading history...</p>';
  const ids = JSON.parse(localStorage.getItem(aiHistoryStorageKey) || '[]');
  const sessions = [];
  for (const id of ids) {
    try {
      const ref = getAiSessionRef(id);
      const snapshot = await ref?.get();
      if (!snapshot?.exists) continue;
      const data = snapshot.data();
      if (!(data.messages || []).some(item => item.type === 'user' && item.message?.trim())) continue;
      sessions.push({ id, ...data });
    } catch (error) {
      console.warn('Mini AI history could not load:', error);
    }
  }

  list.innerHTML = sessions.length
    ? sessions.map(session => `<button type="button" class="floating-ai-history-item" onclick="loadFloatingAiChatSession('${escapeAiText(session.id)}')"><strong>${escapeAiText(session.title || 'AI conversation')}</strong><span>${formatAiDate(session.updatedAt?.toDate ? session.updatedAt.toDate() : session.updatedAt || session.createdAt)}</span></button>`).join('')
    : '<p>No saved conversations yet.</p>';
}

async function loadFloatingAiChatSession(id) {
  const ref = getAiSessionRef(id);
  if (!ref) return;
  try {
    const snapshot = await ref.get();
    if (!snapshot.exists) return;
    const data = snapshot.data();
    aiSessionId = id;
    localStorage.setItem(aiSessionStorageKey, id);
    aiSessionTitle = data.title || 'Restored AI conversation';
    aiSessionMessages = data.messages || [];
    renderFloatingAiMessages();
    toggleFloatingAiHistory(false);
  } catch (error) {
    console.warn('Mini AI conversation could not load:', error);
  }
}

function openFullAiChatPage() {
  const navItem = [...document.querySelectorAll('.nav-item')].find(item => item.textContent.trim() === 'AI Chatbox');
  if (navItem) navItem.click();
  closeFloatingAiChat();
}

let miniVideoWarningTimer;
let miniVideoOpening = false;

function showMiniVideoWarning() {
  const warning = document.getElementById('miniVideoWarning');
  if (!warning) return;

  clearTimeout(miniVideoWarningTimer);
  warning.classList.add('is-visible');
  warning.setAttribute('aria-hidden', 'false');
  miniVideoWarningTimer = setTimeout(() => {
    warning.classList.remove('is-visible');
    warning.setAttribute('aria-hidden', 'true');
  }, 2600);
}

function openExistingMiniVideo() {
  const videoModal = document.getElementById('videoModal');
  if (miniVideoOpening || (typeof isMinimized !== 'undefined' && isMinimized)) {
    showMiniVideoWarning();
    return;
  }
  if (videoModal?.classList.contains('minimized-state')) {
    showMiniVideoWarning();
    return;
  }

  const drawer = document.getElementById('settingsDrawer');
  if (drawer?.classList.contains('open') && typeof toggleSettingsDrawer === 'function') toggleSettingsDrawer();
  const videos = typeof rawVideos !== 'undefined' ? rawVideos : [];
  const selectedVideo = typeof currentModalIndex !== 'undefined' && currentModalIndex >= 0
    ? videos[currentModalIndex]
    : null;
  const index = selectedVideo ? currentModalIndex : 0;
  if (!videos[index] || typeof openVideoModal !== 'function') return;
  miniVideoOpening = true;
  openVideoModal(index);
  requestAnimationFrame(() => {
    toggleMinimizeVideo();
    miniVideoOpening = false;
  });
}

function positionFloatingAiPanel() {
  const launcher = document.getElementById('floatingAiLauncher');
  const panel = document.getElementById('floatingAiPanel');
  if (!launcher || !panel || panel.hidden) return;

  const launcherRect = launcher.getBoundingClientRect();
  const gap = 12;
  const panelWidth = panel.offsetWidth;
  const panelHeight = panel.offsetHeight;
  const left = Math.max(8, Math.min(window.innerWidth - panelWidth - 8, launcherRect.left + launcherRect.width - panelWidth));
  const canFitAbove = launcherRect.top >= panelHeight + gap;
  const top = canFitAbove
    ? launcherRect.top - panelHeight - gap
    : Math.min(window.innerHeight - panelHeight - 8, launcherRect.bottom + gap);

  panel.style.left = `${left}px`;
  panel.style.top = `${Math.max(8, top)}px`;
  panel.style.right = 'auto';
  panel.style.bottom = 'auto';
}

function moveFloatingAiPanel(left, top) {
  const panel = document.getElementById('floatingAiPanel');
  const launcher = document.getElementById('floatingAiLauncher');
  if (!panel || !launcher) return;
  const panelLeft = Math.max(8, Math.min(window.innerWidth - panel.offsetWidth - 8, left));
  const panelTop = Math.max(8, Math.min(window.innerHeight - panel.offsetHeight - 8, top));
  panel.style.left = `${panelLeft}px`;
  panel.style.top = `${panelTop}px`;
  panel.style.right = 'auto';
  panel.style.bottom = 'auto';

  const launcherLeft = Math.max(8, Math.min(window.innerWidth - launcher.offsetWidth - 8, panelLeft + panel.offsetWidth - launcher.offsetWidth));
  const launcherTop = panelTop + panel.offsetHeight + 12 <= window.innerHeight - launcher.offsetHeight - 8
    ? panelTop + panel.offsetHeight + 12
    : Math.max(8, panelTop - launcher.offsetHeight - 12);
  launcher.style.left = `${launcherLeft}px`;
  launcher.style.top = `${launcherTop}px`;
  launcher.style.right = 'auto';
  launcher.style.bottom = 'auto';
}

function initFloatingAiAssistant() {
  const launcher = document.getElementById('floatingAiLauncher');
  if (!launcher) return;
  const update = () => document.body.classList.toggle('ai-page-active', !!document.querySelector('#page-aichatbox.active-page'));
  new MutationObserver(update).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
  update();
  let dragging = false, offsetX = 0, offsetY = 0;
  launcher.addEventListener('pointerdown', event => { dragging = true; offsetX = event.clientX - launcher.getBoundingClientRect().left; offsetY = event.clientY - launcher.getBoundingClientRect().top; launcher.setPointerCapture(event.pointerId); });
  launcher.addEventListener('pointermove', event => { if (!dragging) return; launcher.style.left = `${Math.max(8, Math.min(window.innerWidth - launcher.offsetWidth - 8, event.clientX - offsetX))}px`; launcher.style.top = `${Math.max(8, Math.min(window.innerHeight - launcher.offsetHeight - 8, event.clientY - offsetY))}px`; launcher.style.right = 'auto'; launcher.style.bottom = 'auto'; });
  launcher.addEventListener('pointermove', () => { if (dragging) positionFloatingAiPanel(); });
  launcher.addEventListener('pointerup', () => { dragging = false; });
  const panel = document.getElementById('floatingAiPanel');
  if (panel) {
    let panelDragging = false;
    let panelOffsetX = 0;
    let panelOffsetY = 0;
    panel.addEventListener('pointerdown', event => {
      if (event.target.closest('button, input, textarea, select, a')) return;
      const rect = panel.getBoundingClientRect();
      panelDragging = true;
      panelOffsetX = event.clientX - rect.left;
      panelOffsetY = event.clientY - rect.top;
      panel.setPointerCapture(event.pointerId);
      panel.classList.add('is-dragging');
    });
    panel.addEventListener('pointermove', event => {
      if (!panelDragging) return;
      moveFloatingAiPanel(event.clientX - panelOffsetX, event.clientY - panelOffsetY);
    });
    const stopPanelDragging = () => {
      panelDragging = false;
      panel.classList.remove('is-dragging');
    };
    panel.addEventListener('pointerup', stopPanelDragging);
    panel.addEventListener('pointercancel', stopPanelDragging);
  }
  window.addEventListener('resize', positionFloatingAiPanel);
}

function initAiChatPersistence() {
  if (!document.getElementById('aiChatMessages')) return;
  initAiAvailabilityListener();
  initFloatingAiAssistant();
  const sessionRef = getAiSessionRef();
  if (sessionRef) sessionRef.get().then(snapshot => {
    if (!snapshot.exists) return;
    const messages = snapshot.data().messages || [];
    if (!messages.some(item => item.type === 'user' && item.message?.trim())) {
      sessionRef.delete().catch(() => {});
      localStorage.setItem(aiHistoryStorageKey, JSON.stringify(JSON.parse(localStorage.getItem(aiHistoryStorageKey) || '[]').filter(id => id !== aiSessionId)));
      return;
    }
    loadAiChatSession(aiSessionId);
  }).catch(() => {});
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAiChatPersistence); else initAiChatPersistence();
