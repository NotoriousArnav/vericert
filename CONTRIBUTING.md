# Contributing to VeriCert

First off, thank you for considering a contribution to VeriCert! It's people like you that make VeriCert such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs if possible**
- **Include your environment details** (OS, Node.js version, pnpm version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and the expected new behavior**
- **Explain why this enhancement would be useful**

### Pull Requests

- Fill in the required template
- Follow the TypeScript/Node.js styleguides
- Document new code with comments
- End all files with a newline
- Make sure tests pass: `pnpm test`
- Update documentation as needed

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)

### Installation

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/vericert.git
   cd vericert
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```

### Running the Development Server

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Generate coverage report
pnpm test:coverage
```

### Type Checking

```bash
pnpm type-check
```

### Building for Production

```bash
pnpm build
pnpm start
```

## Styleguides

### Git Commit Messages

- Use the present tense ("add feature" not "added feature")
- Use the imperative mood ("move cursor to..." not "moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Consider using conventional commits:
  - `feat: add new feature`
  - `fix: resolve bug in JWT verification`
  - `docs: update README`
  - `test: add tests for certificate card`
  - `refactor: improve error handling`

### TypeScript Styleguide

- Use `const` instead of `let` or `var`
- Use clear and descriptive variable names
- Add JSDoc comments for public functions
- Ensure no TypeScript errors: `pnpm type-check`

### React Component Styleguide

- Use functional components with hooks
- Name components in PascalCase
- Place components in the `components/` directory
- Use proper prop typing with TypeScript interfaces
- Add "use client" directive if using client-side features

### Documentation Styleguide

- Use Markdown with GitHub-flavored syntax
- Include code examples where helpful
- Keep documentation up-to-date with code changes
- Be clear and concise

## Project Structure

```
vericert/
├── __tests__/          # Test files
├── app/                # Next.js app directory
│   ├── api/           # API routes
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Home page
│   └── globals.css    # Global styles
├── components/         # React components
│   └── ui/            # shadcn UI components
├── lib/               # Utility functions and libraries
├── public/            # Static assets
├── scripts/           # Utility scripts
├── jest.config.ts     # Jest configuration
├── next.config.ts     # Next.js configuration
├── tsconfig.json      # TypeScript configuration
└── README.md          # Project documentation
```

## Testing

All contributions should include tests. Here's how to write tests:

### Unit Tests

Create test files in `__tests__/` mirroring the source structure:

```typescript
// lib/myFunction.test.ts
import { myFunction } from "@/lib/myFunction";

describe("myFunction", () => {
  it("should do something", () => {
    expect(myFunction()).toBe(true);
  });
});
```

### API Route Tests

```typescript
// __tests__/api/endpoint.test.ts
import { POST } from "@/app/api/endpoint/route";

describe("POST /api/endpoint", () => {
  it("should handle valid request", async () => {
    const request = new NextRequest("...", { method: "POST", body: "..." });
    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});
```

## Additional Notes

### Issue and Pull Request Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested

### Community

- Join our community at [BroCode Tech Community](https://brocode-tech.netlify.app)
- Check out [Event Horizon](https://events.neopanda.tech/) for community events
- Read community blogs on [Bromine](https://bromine.vercel.app/)

## License

By contributing to VeriCert, you agree that your contributions will be licensed under its MIT License.

## Recognition

Contributors will be recognized in:
- The project's README
- Release notes
- GitHub contributor list

Thank you for contributing to VeriCert! 🎉
