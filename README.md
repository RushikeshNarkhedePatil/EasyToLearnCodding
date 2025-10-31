# EasyToLearnCodding

EasyToLearnCodding is an Angular-based learning portal that combines lessons, quizzes, blog content, and media resources to help students practice coding concepts interactively. The project demonstrates a full user flow from registration and authentication to content consumption, quiz attempts, and admin-driven content creation.

## Features

- **Authentication & Roles** – Email/password login and registration with local storage persistence. Admins gain access to authoring tools, while regular users focus on learning content.
- **Dashboard** – Personalized dashboard with role-aware actions, content filters (videos, images, links), quick media previews, and quiz history.
- **Quiz Engine** – Quiz player modeled after classic multiple-choice exams with timers, review mode, scoring summaries, and attempt logging.
- **Blog Experience** – CodeWithHarry-inspired blog landing page featuring search, “new” badges, responsive cards, and detail pages that render both narrative text and syntax-highlight-ready code blocks.
- **Rich Blog Editor** – Admins can compose posts with multiple text paragraphs and language-tagged code snippets, reorder/remove sections, and preview-friendly formatting.
- **Content Uploads** – Simulated upload flow for videos and images, including publish/draft state handling for admins.
- **Responsive UI** – Angular Material and custom styles provide consistent theming, typography, and mobile friendliness across modules.

## Tech Stack

- **Framework**: Angular 12
- **Language**: TypeScript
- **UI Toolkit**: Angular Material (toolbar, cards, form fields, buttons, lists, toggle groups, etc.)
- **State & Storage**: Local storage management via a centralized `AuthService`
- **Styling**: SCSS/CSS with responsive layout utilities

## Getting Started

### Prerequisites

- Node.js (>= 14.x recommended)
- npm (ships with Node)

### Installation

```bash
git clone https://github.com/RushikeshNarkhedePatil/EasyToLearnCodding.git
cd EasyToLearnCodding
npm install
```

### Development Server

```bash
npm start
```

The app runs at `http://localhost:4200/` with live reload enabled.

### Production Build

```bash
npm run build
```

Build artifacts are generated in `dist/`. You can deploy the contents of `dist/EasyToLearnCodding/` to any static hosting service (Netlify, Firebase Hosting, etc.).

## Project Structure

```
src/
├─ app/
│  ├─ about/                 # Static about page content
│  ├─ blog/                  # Blog listing inspired by CodeWithHarry
│  ├─ blog-detail/           # Blog article renderer for text + code sections
│  ├─ blog-editor/           # Admin editor for text blocks and code snippets
│  ├─ dashboard/             # Authenticated dashboard with content filters
│  ├─ guards/                # Route guards (AuthGuard)
│  ├─ home/                  # Landing page
│  ├─ login/, register/      # Auth forms
│  ├─ quiz/                  # Quiz player with review mode and timer
│  ├─ quiz-admin/            # Admin quiz builder
│  ├─ services/auth.service.ts
│  └─ upload/                # Media upload simulator
├─ assets/                   # Static images and profile assets
└─ styles.css                # Global styles
```

## Usage Notes

- Default credentials are seeded for quick testing:
  - Admin: `admin@easytocode.com / admin123`
  - User: `user@easytocode.com / user123`
- Quiz attempts, blog posts, and media are stored in browser `localStorage`; clearing storage resets the data.
- Build warnings mention CSS budget overages (e.g., blog/dashboard styles) and bundle size; adjust `angular.json` budgets if needed for production.

## Scripts

- `npm start` – Run dev server.
- `npm run build` – Compile for production.
- `npm run lint` – (Add ESLint or Angular CLI linting when configured.)
- `npm test` – Execute unit tests via Karma/Jasmine (default Angular setup).

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`.
3. Commit your changes: `git commit -m "feat: add new feature"`.
4. Push to the branch: `git push origin feature/my-feature`.
5. Open a pull request describing your changes.

## License

This project is released under the MIT License. See [LICENSE](LICENSE) if available or adapt to your organization’s licensing requirements.

---

Happy coding! Feel free to open issues or discussions for enhancements, bug reports, or new learning ideas.
