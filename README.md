# CloudPrep Buddy ☁️

### Understand cloud. Practise with purpose.

**CloudPrep Buddy** is an independent, beginner-friendly AZ-900 learning companion designed to help learners understand cloud computing, practise original assessment questions and identify the topics they need to revise.

Built for the **Vibe Coding Hackathon: AZ-900 Exam Prep Edition**, this project turns a learner's own exam preparation journey into a practical tool that can help the next learner succeed.

<p align="center">
  <a href="https://cloudprep-buddy-az90-942c.bolt.host/">
    <strong>🚀 Try CloudPrep Buddy — Live Demo</strong>
  </a>
</p>

## 📌 Table of Contents

- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Technology Stack](#-technology-stack)
- [Question Bank and Learning Content](#-question-bank-and-learning-content)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Data Storage and Privacy](#-data-storage-and-privacy)
- [Limitations and Future Improvements](#-limitations-and-future-improvements)
- [Official Learning Resources](#-official-learning-resources)
- [Hackathon Alignment](#-hackathon-alignment)
- [Disclaimer](#-disclaimer)

## 🎯 The Problem

Preparing for a cloud certification can be challenging, especially for beginners encountering unfamiliar terminology and abstract technical concepts for the first time.

Learners may practise multiple-choice questions without understanding why an answer is correct, struggle to distinguish similar cloud services or find it difficult to identify the subjects they need to revisit.

Learning resources can also feel disconnected from everyday experiences, making some cloud concepts harder to understand and remember.

CloudPrep Buddy addresses these challenges by bringing practice, explanations, concept revision and progress tracking together in one accessible learning experience.

## 💡 The Solution

CloudPrep Buddy is a responsive web application designed around four connected learning areas:

1. **Home:** Provides an overview of learning activity and shortcuts to practice and revision.
2. **Practice:** Offers original AZ-900-style questions with immediate feedback and explanations.
3. **Learn:** Presents cloud concepts in accessible language, with relatable African real-world analogies and exam tips.
4. **Progress:** Helps learners review their practice performance and identify subjects that may need further study.

The aim is not simply to help learners select the right answer. It is to help them understand the concept behind it.

## ✨ Features

### 🏠 Home Dashboard

- Quick access to practice sessions and learning materials.
- An overview of practice performance and learning activity.
- Topic-level progress indicators based on recorded activity.
- Recommendations to revisit topics where sufficient practice data is available.

### 📝 Smart Practice and Assessment

- Original multiple-choice questions organised by AZ-900 topic.
- Topic and difficulty selection.
- Multiple practice-session lengths.
- Immediate feedback after submitting an answer.
- Explanations of correct answers and feedback on answer choices.
- Memory tips and relatable real-world examples.
- Quiz results showing the learner's score and accuracy.
- The ability to retry incorrectly answered questions.

### 📚 Learn: Concept Library

- Searchable cloud learning concepts.
- Filtering by the three broad AZ-900 skill domains.
- Beginner-friendly definitions and explanations.
- African real-world analogies that connect abstract concepts to familiar situations.
- Commonly confused concepts and distinctions.
- Exam-focused revision tips.
- Bookmarking to build a personal collection of concepts to revisit.
- A Concept Coach offering curated, offline-friendly explanations.

### 📊 Progress and Readiness Tracking

- Recorded practice attempts and answer accuracy.
- Performance information organised by topic.
- Review of incorrectly answered questions.
- Recommendations for further revision.
- A practice-readiness indicator based on recorded performance and minimum-data requirements.
- A progress-reset option with confirmation.

The readiness indicator is an educational aid, not an official AZ-900 score or a guarantee of passing the certification exam.

### 🎨 User Experience

- Responsive interface for different screen sizes.
- Warm cream, sage green and muted orange visual palette.
- Light and dark themes.
- Clear navigation and accessible interactive controls.
- Browser-based persistence for preferences, bookmarks and practice history.

## ⚙️ How It Works

CloudPrep Buddy follows a frontend-only architecture.

1. Learners navigate the interface to select a learning activity.
2. The practice engine presents questions from the local question bank.
3. Submitted answers are evaluated against the stored correct answers.
4. Explanations and revision tips support understanding of the underlying concepts.
5. Practice attempts are recorded in the browser.
6. The Progress dashboard derives its metrics and recommendations from the saved activity.

The concept library uses prepared educational content rather than a live generative AI service. This allows the learning explanations to be available without requiring an external AI API key.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| TypeScript | Typed application logic and data structures |
| Vite | Development server and production build tooling |
| Tailwind CSS | Utility-based styling and responsive layouts |
| Lucide React | Interface icons |
| Browser localStorage | Local persistence of learning activity and preferences |
| Bolt.new | AI-assisted development and deployment |

The application is designed to run without a required external database, authentication provider or paid AI service.

## 📖 Question Bank and Learning Content

The application includes an original practice question bank designed around three broad AZ-900 skill domains.

| Skill domain | Original questions |
|---|---:|
| Describe cloud concepts | 8 |
| Describe Azure architecture and services | 12 |
| Describe Azure management and governance | 10 |
| **Total** | **30** |

The Learn library contains additional prepared concept explanations organised by topic.

Educational content covers foundational subjects such as:

- Cloud computing and cloud deployment models.
- Consumption-based pricing and cloud benefits.
- Azure regions, availability zones and resource organisation.
- Compute, networking and storage services.
- Identity, authentication and cloud security.
- Cost management and governance.
- Azure monitoring and management tools.

Questions are written for learning and practice, rather than copied from actual certification examinations.

The published AZ-900 skills outline should be consulted for the current examination scope.

## 🚀 Getting Started

### Prerequisites

To run the project locally, you will need:

- [Node.js](https://nodejs.org/) with npm.
- [Git](https://git-scm.com/) to clone the repository.
- A code editor, such as [Visual Studio Code](https://code.visualstudio.com/).

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/llavvy-design/cloudprep-buddy-az900.git
```

**2. Navigate into the project directory**

```bash
cd cloudprep-buddy-az900
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

Vite will display a local address in the terminal. Open that address in your browser to use the application.

### Production Build

To create a production build, run:

```bash
npm run build
```

The generated production files are placed in the `dist` directory when the build completes successfully.

The repository's `package.json` is the source of truth for the available commands. If the scripts differ from those shown above, follow the scripts defined in that file.

## 📁 Project Structure

The application is organised around reusable UI components, dedicated pages and structured learning data.

```text
cloudprep-buddy-az900/
├── public/
├── src/
│   ├── components/
│   ├── data/
│   │   ├── concepts.ts
│   │   ├── curriculum.ts
│   │   └── questions.ts
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── PracticePage.tsx
│   │   ├── LearnPage.tsx
│   │   └── ProgressPage.tsx
│   ├── App.tsx
│   └── types.ts
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

This is a representative view of the main application files. Individual configuration files and additional components may also be present in the repository.

## 🔐 Data Storage and Privacy

CloudPrep Buddy stores its learning history, bookmarks and theme preference locally in the browser.

- No account is required for the core learning experience.
- The application does not require a dedicated database for its current features.
- Learning progress is associated with the browser and device being used.
- Clearing the browser's site data may erase locally stored progress.
- Progress does not automatically synchronise between devices or browsers.

The application does not require learners to submit passwords or other personal credentials to use its core features.

## 🔭 Limitations and Future Improvements

CloudPrep Buddy is an educational MVP. Possible future improvements include:

- Spaced-repetition flashcards for difficult concepts.
- Personalised study plans based on exam dates and available study time.
- Optional AI-powered explanations through a securely configured model integration.
- Additional language options, including Swahili.
- Exportable revision summaries and practice reports.
- Optional account-based synchronisation across devices.
- Broader learning paths for other entry-level technology certifications.

These are possible future extensions, not claims about features already implemented.

## 📘 Official Learning Resources

Learners should use official Microsoft Learn material alongside this application.

- [AZ-900: Microsoft Azure Fundamentals — Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900)
- [Describe cloud concepts](https://learn.microsoft.com/en-us/training/paths/describe-cloud-concepts/)
- [Microsoft Learn](https://learn.microsoft.com/en-us/training/)

Always consult the current official study guide for the latest examination skills and terminology.

## 🏆 Hackathon Alignment

**Event:** Vibe Coding Hackathon: AZ-900 Exam Prep Edition

**Theme:** Building Smarter Exam Prep Tools from Our Own Learning Journey.

CloudPrep Buddy primarily addresses:

- **Practice & Assessment — Smart Quiz Builder:** Original practice questions, feedback and explanations.
- **Progress — Readiness Tracker:** Performance tracking and topic-level revision guidance.
- **Learning Support:** A curated concept library with accessible explanations and practical analogies.

The project explores how AI-assisted development can help turn a learner's real study challenges into a useful educational tool.

## ⚠️ Disclaimer

CloudPrep Buddy is an independent, unofficial learning project. It is not affiliated with or endorsed by Microsoft.

The practice questions are original educational material and are not real Microsoft certification examination questions. The readiness indicator is not an official certification result and cannot guarantee examination success.

Microsoft, Azure and AZ-900 are referenced solely to identify the subject matter and relevant learning resources. All Microsoft trademarks belong to their respective owners.

---

**Built with curiosity, code and a desire to help the next learner succeed☁️💚**

[Try CloudPrep Buddy](https://cloudprep-buddy-az90-942c.bolt.host/) · [View the GitHub Repository](https://github.com/llavvy-design/cloudprep-buddy-az900)
