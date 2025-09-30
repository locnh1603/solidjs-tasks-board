---
applyTo: '**'
---

# Next.js Best Practices for LLMs (2025)

_Last updated: July 2025_

This document summarizes the latest, authoritative best practices for building, structuring, and maintaining Next.js applications. It is intended for use by LLMs and developers to ensure code quality, maintainability, and scalability.

---

## 1. Project Structure & Organization

- **Use the `app/` directory** (App Router) for all new projects. Prefer it over the legacy `pages/` directory.
- **Top-level folders:**
  - `app/` — Routing, layouts, pages, and route handlers
  - `public/` — Static assets (images, fonts, etc.)
  - `lib/` — Shared utilities, API clients, and logic
  - `components/` — Reusable UI components
  - `contexts/` — React context providers
  - `styles/` — Global and modular stylesheets
  - `hooks/` — Custom React hooks
  - `types/` — TypeScript type definitions
- **Colocation:** Place files (components, styles, tests) near where they are used, but avoid deeply nested structures.
- **Route Groups:** Use parentheses (e.g., `(admin)`) to group routes without affecting the URL path.
- **Private Folders:** Prefix with `_` (e.g., `_internal`) to opt out of routing and signal implementation details.

- **Feature Folders:** For large apps, group by feature (e.g., `app/dashboard/`, `app/auth/`).
- **Use `src/`** (optional): Place all source code in `src/` to separate from config files.

## 2.1. Server and Client Component Integration (App Router)

**Never use `next/dynamic` with `{ ssr: false }` inside a Server Component.** This is not supported and will cause a build/runtime error.

**Correct Approach:**

- If you need to use a Client Component (e.g., a component that uses hooks, browser APIs, or client-only libraries) inside a Server Component, you must:
  1. Move all client-only logic/UI into a dedicated Client Component (with `'use client'` at the top).
  2. Import and use that Client Component directly in the Server Component (no need for `next/dynamic`).
  3. If you need to compose multiple client-only elements (e.g., a navbar with a profile dropdown), create a single Client Component that contains all of them.

**Example:**

```tsx
// Server Component
import DashboardNavbar from '@/components/DashboardNavbar';

export default async function DashboardPage() {
  // ...server logic...
  return (
    <>
      <DashboardNavbar /> {/* This is a Client Component */}
      {/* ...rest of server-rendered page... */}
    </>
  );
}
```

**Why:**

- Server Components cannot use client-only features or dynamic imports with SSR disabled.
- Client Components can be rendered inside Server Components, but not the other way around.

**Summary:**
Always move client-only UI into a Client Component and import it directly in your Server Component. Never use `next/dynamic` with `{ ssr: false }` in a Server Component.

---

## 2. Component Best Practices

- **Component Types:**
  - **Server Components** (default): For data fetching, heavy logic, and non-interactive UI.
  - **Client Components:** Add `'use client'` at the top. Use for interactivity, state, or browser APIs.
- **When to Create a Component:**
  - If a UI pattern is reused more than once.
  - If a section of a page is complex or self-contained.
  - If it improves readability or testability.
- **Naming Conventions:**
  - Use `PascalCase` for component files and exports (e.g., `UserCard.tsx`).
  - Use `camelCase` for hooks (e.g., `useUser.ts`).
  - Use `snake_case` or `kebab-case` for static assets (e.g., `logo_dark.svg`).
  - Name context providers as `XyzProvider` (e.g., `ThemeProvider`).
- **File Naming:**
  - Match the component name to the file name.
  - For single-export files, default export the component.
  - For multiple related components, use an `index.ts` barrel file.
- **Component Location:**
  - Place shared components in `components/`.
  - Place route-specific components inside the relevant route folder.
- **Props:**
  - Use TypeScript interfaces for props.
  - Prefer explicit prop types and default values.
- **Testing:**
  - Co-locate tests with components (e.g., `UserCard.test.tsx`).

## 3. Naming Conventions (General)

- **Folders:** `kebab-case` (e.g., `user-profile/`)
- **Files:** `PascalCase` for components, `camelCase` for utilities/hooks, `kebab-case` for static assets
- **Variables/Functions:** `camelCase`
- **Types/Interfaces:** `PascalCase`
- **Constants:** `UPPER_SNAKE_CASE`

## 4. API Routes (Route Handlers)

- **Prefer API Routes over Edge Functions** unless you need ultra-low latency or geographic distribution.
- **Location:** Place API routes in `app/api/` (e.g., `app/api/users/route.ts`).
- **HTTP Methods:** Export async functions named after HTTP verbs (`GET`, `POST`, etc.).
- **Request/Response:** Use the Web `Request` and `Response` APIs. Use `NextRequest`/`NextResponse` for advanced features.
- **Dynamic Segments:** Use `[param]` for dynamic API routes (e.g., `app/api/users/[id]/route.ts`).
- **Validation:** Always validate and sanitize input. Use libraries like `zod` or `yup`.
- **Error Handling:** Return appropriate HTTP status codes and error messages.
- **Authentication:** Protect sensitive routes using middleware or server-side session checks.

## 5. General Best Practices

- **TypeScript:** Use TypeScript for all code. Enable `strict` mode in `tsconfig.json`.
- **ESLint & Prettier:** Enforce code style and linting. Use the official Next.js ESLint config.
- **Environment Variables:** Store secrets in `.env.local`. Never commit secrets to version control.
- **Testing:** Use Jest, React Testing Library, or Playwright. Write tests for all critical logic and components.
- **Accessibility:** Use semantic HTML and ARIA attributes. Test with screen readers.
- **Performance:**
  - Use built-in Image and Font optimization.
  - Use Suspense and loading states for async data.
  - Avoid large client bundles; keep most logic in Server Components.
- **Security:**
  - Sanitize all user input.
  - Use HTTPS in production.
  - Set secure HTTP headers.
- **Documentation:**
  - Write clear README and code comments.
  - Document public APIs and components.

# Avoid Unnecessary Example Files

Do not create example/demo files (like ModalExample.tsx) in the main codebase unless the user specifically requests a live example, Storybook story, or explicit documentation component. Keep the repository clean and production-focused by default.

# Always use the latest documentation and guides

- For every nextjs related request, begin by searching for the most current nextjs documentation, guides, and examples.
- Use the following tools to fetch and search documentation if they are available:
  - `resolve_library_id` to resolve the package/library name in the docs.
  - `get_library_docs` for up to date documentation.

# Task Plan

---

applyTo: '\*_/.copilot-tracking/changes/_.md'
description: 'Instructions for implementing task plans with progressive tracking and change record - Brought to you by microsoft/edge-ai'

---

# Task Plan Implementation Instructions

You will implement your specific task plan located in `.copilot-tracking/plans/**` and `.copilot-tracking/details/**`. Your goal is to progressively and completely implement each step in the plan files to create high-quality, working software that meets all specified requirements.

Implementation progress MUST be tracked in a corresponding changes files located in `.copilot-tracking/changes/**`.

## Core Implementation Process

### 1. Plan Analysis and Preparation

**MUST complete before starting implementation:**

- **MANDATORY**: Read and fully understand the complete plan file including scope, objectives, all phases, and every checklist item
- **MANDATORY**: Read and fully understand the corresponding changes file completely - if any parts are missing from context, read the entire file back in using `read_file`
- **MANDATORY**: Identify all referenced files mentioned in the plan and examine them for context
- **MANDATORY**: Understand current project structure and conventions

### 2. Systematic Implementation Process

**Implement each task in the plan systematically:**

1. **Process tasks in order** - Follow the plan sequence exactly, one task at a time
2. **MANDATORY before implementing any task:**

   - **ALWAYS ensure implementation is associated with a specific task from the plan**
   - **ALWAYS read the entire details section for that task from the associated details markdown file in `.copilot-tracking/details/**`\*\*
   - **FULLY understand all implementation details before proceeding**
   - Gather any additional required context as needed

3. **Implement the task completely with working code:**

   - Follow existing code patterns and conventions from the workspace
   - Create working functionality that meets all task requirements specified in the details
   - Include proper error handling, documentation, and follow best practices

4. **Mark task complete and update changes tracking:**
   - Update plan file: change `[ ]` to `[x]` for completed task
   - **MANDATORY after completing EVERY task**: Update the changes file by appending to the appropriate Added, Modified, or Removed sections with relative file paths and one-sentence summary of what was implemented
   - **MANDATORY**: If any changes diverge from the task plan and details, specifically call out within the relevant section that the change was made outside of the plan and include the specific reason
   - If ALL tasks in a phase are complete `[x]`, mark the phase header as complete `[x]`

### 3. Implementation Quality Standards

**Every implementation MUST:**

- Follow existing workspace patterns and conventions (check `copilot/` folder for standards)
- Implement complete, working functionality that meets all task requirements
- Include appropriate error handling and validation
- Use consistent naming conventions and code structure from the workspace
- Add necessary documentation and comments for complex logic
- Ensure compatibility with existing systems and dependencies

### 4. Continuous Progress and Validation

**After implementing each task:**

1. Validate the changes made against the task requirements from the details file
2. Fix any problems before moving to the next task
3. **MANDATORY**: Update the plan file to mark completed tasks `[x]`
4. **MANDATORY after EVERY task completion**: Update the changes file by appending to Added, Modified, or Removed sections with relative file paths and one-sentence summary of what was implemented
5. Continue to the next unchecked task

**Continue until:**

- All tasks in the plan are marked complete `[x]`
- All specified files have been created or updated with working code
- All success criteria from the plan have been verified

### 5. Reference Gathering Guidelines

**When gathering external references:**

- Focus on practical implementation examples over theoretical documentation
- Validate that external sources contain actual usable patterns
- Adapt external patterns to match workspace conventions and standards

**When implementing from references:**

- Follow workspace patterns and conventions first, external patterns second
- Implement complete, working functionality rather than just examples
- Ensure all dependencies and configurations are properly integrated
- Ensure implementations work within the existing project structure

### 6. Completion and Documentation

**Implementation is complete when:**

- All plan tasks are marked complete `[x]`
- All specified files exist with working code
- All success criteria from the plan are verified
- No implementation errors remain

**Final step - update changes file with release summary:**

- Add Release Summary section only after ALL phases are marked complete `[x]`
- Document complete file inventory and overall implementation summary for release documentation

### 7. Problem Resolution

**When encountering implementation issues:**

- Document the specific problem clearly
- Try alternative approaches or search terms
- Use workspace patterns as fallback when external references fail
- Continue with available information rather than stopping completely
- Note any unresolved issues in the plan file for future reference

## Implementation Workflow

```
1. Read and fully understand plan file and all checklists completely
2. Read and fully understand changes file completely (re-read entire file if missing context)
3. For each unchecked task:
   a. Read entire details section for that task from details markdown file
   b. Fully understand all implementation requirements
   c. Implement task with working code following workspace patterns
   d. Validate implementation meets task requirements
   e. Mark task complete [x] in plan file
   f. Update changes file with Added, Modified, or Removed entries
   g. Call out any divergences from plan/details within relevant sections with specific reasons
4. Repeat until all tasks complete
5. Only after ALL phases are complete [x]: Add final Release Summary to changes file
```

## Success Criteria

Implementation is complete when:

- ✅ All plan tasks are marked complete `[x]`
- ✅ All specified files contain working code
- ✅ Code follows workspace patterns and conventions
- ✅ All functionality works as expected within the project
- ✅ Changes file is updated after every task completion with Added, Modified, or Removed entries
- ✅ Changes file documents all phases with detailed release-ready documentation and final release summary

## Template Changes File

Use the following as a template for the changes file that tracks implementation progress for releases.
Replace `{{ }}` with appropriate values. Create this file in `./.copilot-tracking/changes/` with filename: `YYYYMMDD-task-description-changes.md`

**IMPORTANT**: Update this file after EVERY task completion by appending to Added, Modified, or Removed sections.
**MANDATORY**: Always include the following at the top of the changes file: `<!-- markdownlint-disable-file -->`

<!-- <changes-template> -->

```markdown
<!-- markdownlint-disable-file -->

# Release Changes: {{task name}}

**Related Plan**: {{plan-file-name}}
**Implementation Date**: {{YYYY-MM-DD}}

## Summary

{{Brief description of the overall changes made for this release}}

## Changes

### Added

- {{relative-file-path}} - {{one sentence summary of what was implemented}}

### Modified

- {{relative-file-path}} - {{one sentence summary of what was changed}}

### Removed

- {{relative-file-path}} - {{one sentence summary of what was removed}}

## Release Summary

**Total Files Affected**: {{number}}

### Files Created ({{count}})

- {{file-path}} - {{purpose}}

### Files Modified ({{count}})

- {{file-path}} - {{changes-made}}

### Files Removed ({{count}})

- {{file-path}} - {{reason}}

### Dependencies & Infrastructure

- **New Dependencies**: {{list-of-new-dependencies}}
- **Updated Dependencies**: {{list-of-updated-dependencies}}
- **Infrastructure Changes**: {{infrastructure-updates}}
- **Configuration Updates**: {{configuration-changes}}

### Deployment Notes

{{Any specific deployment considerations or steps}}
```

# Docker Instructions

---

applyTo: '\*'
description: 'Comprehensive best practices for creating optimized, secure, and efficient Docker images and managing containers. Covers multi-stage builds, image layer optimization, security scanning, and runtime best practices.'

---

# Containerization & Docker Best Practices

## Your Mission

As GitHub Copilot, you are an expert in containerization with deep knowledge of Docker best practices. Your goal is to guide developers in building highly efficient, secure, and maintainable Docker images and managing their containers effectively. You must emphasize optimization, security, and reproducibility.

## Core Principles of Containerization

### **1. Immutability**

- **Principle:** Once a container image is built, it should not change. Any changes should result in a new image.
- **Deeper Dive:**
  - **Reproducible Builds:** Every build should produce identical results given the same inputs. This requires deterministic build processes, pinned dependency versions, and controlled build environments.
  - **Version Control for Images:** Treat container images like code - version them, tag them meaningfully, and maintain a clear history of what each image contains.
  - **Rollback Capability:** Immutable images enable instant rollbacks by simply switching to a previous image tag, without the complexity of undoing changes.
  - **Security Benefits:** Immutable images reduce the attack surface by preventing runtime modifications that could introduce vulnerabilities.
- **Guidance for Copilot:**
  - Advocate for creating new images for every code change or configuration update, never modifying running containers in production.
  - Recommend using semantic versioning for image tags (e.g., `v1.2.3`, `latest` for development only).
  - Suggest implementing automated image builds triggered by code changes to ensure consistency.
  - Emphasize the importance of treating container images as artifacts that should be versioned and stored in registries.
- **Pro Tip:** This enables easy rollbacks and consistent environments across dev, staging, and production. Immutable images are the foundation of reliable deployments.

### **2. Portability**

- **Principle:** Containers should run consistently across different environments (local, cloud, on-premise) without modification.
- **Deeper Dive:**
  - **Environment Agnostic Design:** Design applications to be environment-agnostic by externalizing all environment-specific configurations.
  - **Configuration Management:** Use environment variables, configuration files, or external configuration services rather than hardcoding environment-specific values.
  - **Dependency Management:** Ensure all dependencies are explicitly defined and included in the container image, avoiding reliance on host system packages.
  - **Cross-Platform Compatibility:** Consider the target deployment platforms and ensure compatibility (e.g., ARM vs x86, different Linux distributions).
- **Guidance for Copilot:**
  - Design Dockerfiles that are self-contained and avoid environment-specific configurations within the image itself.
  - Use environment variables for runtime configuration, with sensible defaults but allowing overrides.
  - Recommend using multi-platform base images when targeting multiple architectures.
  - Suggest implementing configuration validation to catch environment-specific issues early.
- **Pro Tip:** Portability is achieved through careful design and testing across target environments, not by accident.

### **3. Isolation**

- **Principle:** Containers provide process and resource isolation, preventing interference between applications.
- **Deeper Dive:**
  - **Process Isolation:** Each container runs in its own process namespace, preventing one container from seeing or affecting processes in other containers.
  - **Resource Isolation:** Containers have isolated CPU, memory, and I/O resources, preventing resource contention between applications.
  - **Network Isolation:** Containers can have isolated network stacks, with controlled communication between containers and external networks.
  - **Filesystem Isolation:** Each container has its own filesystem namespace, preventing file system conflicts.
- **Guidance for Copilot:**
  - Recommend running a single process per container (or a clear primary process) to maintain clear boundaries and simplify management.
  - Use container networking for inter-container communication rather than host networking.
  - Suggest implementing resource limits to prevent containers from consuming excessive resources.
  - Advise on using named volumes for persistent data rather than bind mounts when possible.
- **Pro Tip:** Proper isolation is the foundation of container security and reliability. Don't break isolation for convenience.

### **4. Efficiency & Small Images**

- **Principle:** Smaller images are faster to build, push, pull, and consume fewer resources.
- **Deeper Dive:**
  - **Build Time Optimization:** Smaller images build faster, reducing CI/CD pipeline duration and developer feedback time.
  - **Network Efficiency:** Smaller images transfer faster over networks, reducing deployment time and bandwidth costs.
  - **Storage Efficiency:** Smaller images consume less storage in registries and on hosts, reducing infrastructure costs.
  - **Security Benefits:** Smaller images have a reduced attack surface, containing fewer packages and potential vulnerabilities.
- **Guidance for Copilot:**
  - Prioritize techniques for reducing image size and build time throughout the development process.
  - Advise against including unnecessary tools, debugging utilities, or development dependencies in production images.
  - Recommend regular image size analysis and optimization as part of the development workflow.
  - Suggest using multi-stage builds and minimal base images as the default approach.
- **Pro Tip:** Image size optimization is an ongoing process, not a one-time task. Regularly review and optimize your images.

## Dockerfile Best Practices

### **1. Multi-Stage Builds (The Golden Rule)**

- **Principle:** Use multiple `FROM` instructions in a single Dockerfile to separate build-time dependencies from runtime dependencies.
- **Deeper Dive:**
  - **Build Stage Optimization:** The build stage can include compilers, build tools, and development dependencies without affecting the final image size.
  - **Runtime Stage Minimization:** The runtime stage contains only the application and its runtime dependencies, significantly reducing the attack surface.
  - **Artifact Transfer:** Use `COPY --from=<stage>` to transfer only necessary artifacts between stages.
  - **Parallel Build Stages:** Multiple build stages can run in parallel if they don't depend on each other.
- **Guidance for Copilot:**
  - Always recommend multi-stage builds for compiled languages (Go, Java, .NET, C++) and even for Node.js/Python where build tools are heavy.
  - Suggest naming build stages descriptively (e.g., `AS build`, `AS test`, `AS production`) for clarity.
  - Recommend copying only the necessary artifacts between stages to minimize the final image size.
  - Advise on using different base images for build and runtime stages when appropriate.
- **Benefit:** Significantly reduces final image size and attack surface.
- **Example (Advanced Multi-Stage with Testing):**

```dockerfile
# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Test
FROM build AS test
RUN npm run test
RUN npm run lint

# Stage 4: Production
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### **2. Choose the Right Base Image**

- **Principle:** Select official, stable, and minimal base images that meet your application's requirements.
- **Deeper Dive:**
  - **Official Images:** Prefer official images from Docker Hub or cloud providers as they are regularly updated and maintained.
  - **Minimal Variants:** Use minimal variants (`alpine`, `slim`, `distroless`) when possible to reduce image size and attack surface.
  - **Security Updates:** Choose base images that receive regular security updates and have a clear update policy.
  - **Architecture Support:** Ensure the base image supports your target architectures (x86_64, ARM64, etc.).
- **Guidance for Copilot:**
  - Prefer Alpine variants for Linux-based images due to their small size (e.g., `alpine`, `node:18-alpine`).
  - Use official language-specific images (e.g., `python:3.9-slim-buster`, `openjdk:17-jre-slim`).
  - Avoid `latest` tag in production; use specific version tags for reproducibility.
  - Recommend regularly updating base images to get security patches and new features.
- **Pro Tip:** Smaller base images mean fewer vulnerabilities and faster downloads. Always start with the smallest image that meets your needs.

### **3. Optimize Image Layers**

- **Principle:** Each instruction in a Dockerfile creates a new layer. Leverage caching effectively to optimize build times and image size.
- **Deeper Dive:**
  - **Layer Caching:** Docker caches layers and reuses them if the instruction hasn't changed. Order instructions from least to most frequently changing.
  - **Layer Size:** Each layer adds to the final image size. Combine related commands to reduce the number of layers.
  - **Cache Invalidation:** Changes to any layer invalidate all subsequent layers. Place frequently changing content (like source code) near the end.
  - **Multi-line Commands:** Use `\` for multi-line commands to improve readability while maintaining layer efficiency.
- **Guidance for Copilot:**
  - Place frequently changing instructions (e.g., `COPY . .`) _after_ less frequently changing ones (e.g., `RUN npm ci`).
  - Combine `RUN` commands where possible to minimize layers (e.g., `RUN apt-get update && apt-get install -y ...`).
  - Clean up temporary files in the same `RUN` command (`rm -rf /var/lib/apt/lists/*`).
  - Use multi-line commands with `\` for complex operations to maintain readability.
- **Example (Advanced Layer Optimization):**

```dockerfile
# BAD: Multiple layers, inefficient caching
FROM ubuntu:20.04
RUN apt-get update
RUN apt-get install -y python3 python3-pip
RUN pip3 install flask
RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/*

# GOOD: Optimized layers with proper cleanup
FROM ubuntu:20.04
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install flask && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### **4. Use `.dockerignore` Effectively**

- **Principle:** Exclude unnecessary files from the build context to speed up builds and reduce image size.
- **Deeper Dive:**
  - **Build Context Size:** The build context is sent to the Docker daemon. Large contexts slow down builds and consume resources.
  - **Security:** Exclude sensitive files (like `.env`, `.git`) to prevent accidental inclusion in images.
  - **Development Files:** Exclude development-only files that aren't needed in the production image.
  - **Build Artifacts:** Exclude build artifacts that will be generated during the build process.
- **Guidance for Copilot:**
  - Always suggest creating and maintaining a comprehensive `.dockerignore` file.
  - Common exclusions: `.git`, `node_modules` (if installed inside container), build artifacts from host, documentation, test files.
  - Recommend reviewing the `.dockerignore` file regularly as the project evolves.
  - Suggest using patterns that match your project structure and exclude unnecessary files.
- **Example (Comprehensive .dockerignore):**

```dockerignore
# Version control
.git*

# Dependencies (if installed in container)
node_modules
vendor
__pycache__

# Build artifacts
dist
build
*.o
*.so

# Development files
.env.*
*.log
coverage
.nyc_output

# IDE files
.vscode
.idea
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Documentation
*.md
docs/

# Test files
test/
tests/
spec/
__tests__/
```

### **5. Minimize `COPY` Instructions**

- **Principle:** Copy only what is necessary, when it is necessary, to optimize layer caching and reduce image size.
- **Deeper Dive:**
  - **Selective Copying:** Copy specific files or directories rather than entire project directories when possible.
  - **Layer Caching:** Each `COPY` instruction creates a new layer. Copy files that change together in the same instruction.
  - **Build Context:** Only copy files that are actually needed for the build or runtime.
  - **Security:** Be careful not to copy sensitive files or unnecessary configuration files.
- **Guidance for Copilot:**
  - Use specific paths for `COPY` (`COPY src/ ./src/`) instead of copying the entire directory (`COPY . .`) if only a subset is needed.
  - Copy dependency files (like `package.json`, `requirements.txt`) before copying source code to leverage layer caching.
  - Recommend copying only the necessary files for each stage in multi-stage builds.
  - Suggest using `.dockerignore` to exclude files that shouldn't be copied.
- **Example (Optimized COPY Strategy):**

```dockerfile
# Copy dependency files first (for better caching)
COPY package*.json ./
RUN npm ci

# Copy source code (changes more frequently)
COPY src/ ./src/
COPY public/ ./public/

# Copy configuration files
COPY config/ ./config/

# Don't copy everything with COPY . .
```

### **6. Define Default User and Port**

- **Principle:** Run containers with a non-root user for security and expose expected ports for clarity.
- **Deeper Dive:**
  - **Security Benefits:** Running as non-root reduces the impact of security vulnerabilities and follows the principle of least privilege.
  - **User Creation:** Create a dedicated user for your application rather than using an existing user.
  - **Port Documentation:** Use `EXPOSE` to document which ports the application listens on, even though it doesn't actually publish them.
  - **Permission Management:** Ensure the non-root user has the necessary permissions to run the application.
- **Guidance for Copilot:**
  - Use `USER <non-root-user>` to run the application process as a non-root user for security.
  - Use `EXPOSE` to document the port the application listens on (doesn't actually publish).
  - Create a dedicated user in the Dockerfile rather than using an existing one.
  - Ensure proper file permissions for the non-root user.
- **Example (Secure User Setup):**

```dockerfile
# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set proper permissions
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["node", "dist/main.js"]
```

### **7. Use `CMD` and `ENTRYPOINT` Correctly**

- **Principle:** Define the primary command that runs when the container starts, with clear separation between the executable and its arguments.
- **Deeper Dive:**
  - **`ENTRYPOINT`:** Defines the executable that will always run. Makes the container behave like a specific application.
  - **`CMD`:** Provides default arguments to the `ENTRYPOINT` or defines the command to run if no `ENTRYPOINT` is specified.
  - **Shell vs Exec Form:** Use exec form (`["command", "arg1", "arg2"]`) for better signal handling and process management.
  - **Flexibility:** The combination allows for both default behavior and runtime customization.
- **Guidance for Copilot:**
  - Use `ENTRYPOINT` for the executable and `CMD` for arguments (`ENTRYPOINT ["/app/start.sh"]`, `CMD ["--config", "prod.conf"]`).
  - For simple execution, `CMD ["executable", "param1"]` is often sufficient.
  - Prefer exec form over shell form for better process management and signal handling.
  - Consider using shell scripts as entrypoints for complex startup logic.
- **Pro Tip:** `ENTRYPOINT` makes the image behave like an executable, while `CMD` provides default arguments. This combination provides flexibility and clarity.

### **8. Environment Variables for Configuration**

- **Principle:** Externalize configuration using environment variables or mounted configuration files to make images portable and configurable.
- **Deeper Dive:**
  - **Runtime Configuration:** Use environment variables for configuration that varies between environments (databases, API endpoints, feature flags).
  - **Default Values:** Provide sensible defaults with `ENV` but allow overriding at runtime.
  - **Configuration Validation:** Validate required environment variables at startup to fail fast if configuration is missing.
  - **Security:** Never hardcode secrets in environment variables in the Dockerfile.
- **Guidance for Copilot:**
  - Avoid hardcoding configuration inside the image. Use `ENV` for default values, but allow overriding at runtime.
  - Recommend using environment variable validation in application startup code.
  - Suggest using configuration management tools or external configuration services for complex applications.
  - Advise on using secrets management solutions for sensitive configuration.
- **Example (Environment Variable Best Practices):**

```dockerfile
# Set default values
ENV NODE_ENV=production
ENV PORT=3000
ENV LOG_LEVEL=info

# Use ARG for build-time variables
ARG BUILD_VERSION
ENV APP_VERSION=$BUILD_VERSION

# The application should validate required env vars at startup
CMD ["node", "dist/main.js"]
```

## Container Security Best Practices

### **1. Non-Root User**

- **Principle:** Running containers as `root` is a significant security risk and should be avoided in production.
- **Deeper Dive:**
  - **Privilege Escalation:** Root containers can potentially escape to the host system if there are vulnerabilities in the container runtime.
  - **File System Access:** Root containers have access to all files and directories, potentially exposing sensitive host data.
  - **Network Access:** Root containers can bind to privileged ports and potentially interfere with host networking.
  - **Resource Abuse:** Root containers can consume excessive system resources without proper limits.
- **Guidance for Copilot:**
  - Always recommend defining a non-root `USER` in the Dockerfile. Create a dedicated user for your application.
  - Ensure the non-root user has the minimum necessary permissions to run the application.
  - Use `USER` directive early in the Dockerfile to ensure subsequent operations run as the non-root user.
  - Consider using user namespaces or other security features when available.
- **Example (Secure User Creation):**

```dockerfile
# Create a dedicated user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set proper ownership of application files
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Ensure the user can write to necessary directories
VOLUME ["/app/data"]
```

### **2. Minimal Base Images**

- **Principle:** Smaller images mean fewer packages, thus fewer vulnerabilities and a reduced attack surface.
- **Deeper Dive:**
  - **Attack Surface Reduction:** Each package in the base image represents a potential vulnerability. Fewer packages mean fewer potential attack vectors.
  - **Update Frequency:** Minimal images are updated more frequently and have shorter vulnerability exposure windows.
  - **Resource Efficiency:** Smaller images consume less storage and network bandwidth.
  - **Build Speed:** Smaller base images build faster and are easier to scan for vulnerabilities.
- **Guidance for Copilot:**
  - Prioritize `alpine`, `slim`, or `distroless` images over full distributions when possible.
  - Review base image vulnerabilities regularly using security scanning tools.
  - Consider using language-specific minimal images (e.g., `openjdk:17-jre-slim` instead of `openjdk:17`).
  - Stay updated with the latest minimal base image versions for security patches.
- **Example (Minimal Base Image Selection):**

```dockerfile
# BAD: Full distribution with many unnecessary packages
FROM ubuntu:20.04

# GOOD: Minimal Alpine-based image
FROM node:18-alpine

# BETTER: Distroless image for maximum security
FROM gcr.io/distroless/nodejs18-debian11
```

### **3. Static Analysis Security Testing (SAST) for Dockerfiles**

- **Principle:** Scan Dockerfiles for security misconfigurations and known vulnerabilities before building images.
- **Deeper Dive:**
  - **Dockerfile Linting:** Use tools like `hadolint` to check for Dockerfile best practices and security issues.
  - **Base Image Scanning:** Scan base images for known vulnerabilities before using them.
  - **CI/CD Integration:** Integrate security scanning into the CI/CD pipeline to catch issues early.
  - **Policy Enforcement:** Define security policies and enforce them through automated scanning.
- **Guidance for Copilot:**
  - Recommend integrating tools like `hadolint` (for Dockerfile linting) and `Trivy`, `Clair`, or `Snyk Container` (for image vulnerability scanning) into your CI pipeline.
  - Suggest setting up automated scanning for both Dockerfiles and built images.
  - Recommend failing builds if critical vulnerabilities are found in base images.
  - Advise on regular scanning of images in registries for newly discovered vulnerabilities.
- **Example (Security Scanning in CI):**

```yaml
# GitHub Actions example
- name: Run Hadolint
  run: |
    docker run --rm -i hadolint/hadolint < Dockerfile

- name: Scan image for vulnerabilities
  run: |
    docker build -t myapp .
    trivy image myapp
```

### **4. Image Signing & Verification**

- **Principle:** Ensure images haven't been tampered with and come from trusted sources.
- **Deeper Dive:**
  - **Cryptographic Signing:** Use digital signatures to verify the authenticity and integrity of container images.
  - **Trust Policies:** Define trust policies that specify which images are allowed to run in your environment.
  - **Supply Chain Security:** Image signing is a key component of securing the software supply chain.
  - **Compliance:** Many compliance frameworks require image signing for production deployments.
- **Guidance for Copilot:**
  - Suggest using Notary or Docker Content Trust for signing and verifying images in production.
  - Recommend implementing image signing in the CI/CD pipeline for all production images.
  - Advise on setting up trust policies that prevent running unsigned images.
  - Consider using newer tools like Cosign for more advanced signing features.
- **Example (Image Signing with Cosign):**

```bash
# Sign an image
cosign sign -key cosign.key myregistry.com/myapp:v1.0.0

# Verify an image
cosign verify -key cosign.pub myregistry.com/myapp:v1.0.0
```

### **5. Limit Capabilities & Read-Only Filesystems**

- **Principle:** Restrict container capabilities and ensure read-only access where possible to minimize the attack surface.
- **Deeper Dive:**
  - **Linux Capabilities:** Drop unnecessary Linux capabilities that containers don't need to function.
  - **Read-Only Root:** Mount the root filesystem as read-only when possible to prevent runtime modifications.
  - **Seccomp Profiles:** Use seccomp profiles to restrict system calls that containers can make.
  - **AppArmor/SELinux:** Use security modules to enforce additional access controls.
- **Guidance for Copilot:**
  - Consider using `CAP_DROP` to remove unnecessary capabilities (e.g., `NET_RAW`, `SYS_ADMIN`).
  - Recommend mounting read-only volumes for sensitive data and configuration files.
  - Suggest using security profiles and policies when available in your container runtime.
  - Advise on implementing defense in depth with multiple security controls.
- **Example (Capability Restrictions):**

```dockerfile
# Drop unnecessary capabilities
RUN setcap -r /usr/bin/node

# Or use security options in docker run
# docker run --cap-drop=ALL --security-opt=no-new-privileges myapp
```

### **6. No Sensitive Data in Image Layers**

- **Principle:** Never include secrets, private keys, or credentials in image layers as they become part of the image history.
- **Deeper Dive:**
  - **Layer History:** All files added to an image are stored in the image history and can be extracted even if deleted in later layers.
  - **Build Arguments:** While `--build-arg` can pass data during build, avoid passing sensitive information this way.
  - **Runtime Secrets:** Use secrets management solutions to inject sensitive data at runtime.
  - **Image Scanning:** Regular image scanning can detect accidentally included secrets.
- **Guidance for Copilot:**
  - Use build arguments (`--build-arg`) for temporary secrets during build (but avoid passing sensitive info directly).
  - Use secrets management solutions for runtime (Kubernetes Secrets, Docker Secrets, HashiCorp Vault).
  - Recommend scanning images for accidentally included secrets.
  - Suggest using multi-stage builds to avoid including build-time secrets in the final image.
- **Anti-pattern:** `ADD secrets.txt /app/secrets.txt`
- **Example (Secure Secret Management):**

```dockerfile
# BAD: Never do this
# COPY secrets.txt /app/secrets.txt

# GOOD: Use runtime secrets
# The application should read secrets from environment variables or mounted files
CMD ["node", "dist/main.js"]
```

### **7. Health Checks (Liveness & Readiness Probes)**

- **Principle:** Ensure containers are running and ready to serve traffic by implementing proper health checks.
- **Deeper Dive:**
  - **Liveness Probes:** Check if the application is alive and responding to requests. Restart the container if it fails.
  - **Readiness Probes:** Check if the application is ready to receive traffic. Remove from load balancer if it fails.
  - **Health Check Design:** Design health checks that are lightweight, fast, and accurately reflect application health.
  - **Orchestration Integration:** Health checks are critical for orchestration systems like Kubernetes to manage container lifecycle.
- **Guidance for Copilot:**
  - Define `HEALTHCHECK` instructions in Dockerfiles. These are critical for orchestration systems like Kubernetes.
  - Design health checks that are specific to your application and check actual functionality.
  - Use appropriate intervals and timeouts for health checks to balance responsiveness with overhead.
  - Consider implementing both liveness and readiness checks for complex applications.
- **Example (Comprehensive Health Check):**

```dockerfile
# Health check that verifies the application is responding
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl --fail http://localhost:8080/health || exit 1

# Alternative: Use application-specific health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1
```

## Container Runtime & Orchestration Best Practices

### **1. Resource Limits**

- **Principle:** Limit CPU and memory to prevent resource exhaustion and noisy neighbors.
- **Deeper Dive:**
  - **CPU Limits:** Set CPU limits to prevent containers from consuming excessive CPU time and affecting other containers.
  - **Memory Limits:** Set memory limits to prevent containers from consuming all available memory and causing system instability.
  - **Resource Requests:** Set resource requests to ensure containers have guaranteed access to minimum resources.
  - **Monitoring:** Monitor resource usage to ensure limits are appropriate and not too restrictive.
- **Guidance for Copilot:**
  - Always recommend setting `cpu_limits`, `memory_limits` in Docker Compose or Kubernetes resource requests/limits.
  - Suggest monitoring resource usage to tune limits appropriately.
  - Recommend setting both requests and limits for predictable resource allocation.
  - Advise on using resource quotas in Kubernetes to manage cluster-wide resource usage.
- **Example (Docker Compose Resource Limits):**

```yaml
services:
  app:
    image: myapp:latest
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

### **2. Logging & Monitoring**

- **Principle:** Collect and centralize container logs and metrics for observability and troubleshooting.
- **Deeper Dive:**
  - **Structured Logging:** Use structured logging (JSON) for better parsing and analysis.
  - **Log Aggregation:** Centralize logs from all containers for search, analysis, and alerting.
  - **Metrics Collection:** Collect application and system metrics for performance monitoring.
  - **Distributed Tracing:** Implement distributed tracing for understanding request flows across services.
- **Guidance for Copilot:**
  - Use standard logging output (`STDOUT`/`STDERR`) for container logs.
  - Integrate with log aggregators (Fluentd, Logstash, Loki) and monitoring tools (Prometheus, Grafana).
  - Recommend implementing structured logging in applications for better observability.
  - Suggest setting up log rotation and retention policies to manage storage costs.
- **Example (Structured Logging):**

```javascript
// Application logging
const winston = require('winston');
const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});
```

### **3. Persistent Storage**

- **Principle:** For stateful applications, use persistent volumes to maintain data across container restarts.
- **Deeper Dive:**
  - **Volume Types:** Use named volumes, bind mounts, or cloud storage depending on your requirements.
  - **Data Persistence:** Ensure data persists across container restarts, updates, and migrations.
  - **Backup Strategy:** Implement backup strategies for persistent data to prevent data loss.
  - **Performance:** Choose storage solutions that meet your performance requirements.
- **Guidance for Copilot:**
  - Use Docker Volumes or Kubernetes Persistent Volumes for data that needs to persist beyond container lifecycle.
  - Never store persistent data inside the container's writable layer.
  - Recommend implementing backup and disaster recovery procedures for persistent data.
  - Suggest using cloud-native storage solutions for better scalability and reliability.
- **Example (Docker Volume Usage):**

```yaml
services:
  database:
    image: postgres:13
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password

volumes:
  postgres_data:
```

### **4. Networking**

- **Principle:** Use defined container networks for secure and isolated communication between containers.
- **Deeper Dive:**
  - **Network Isolation:** Create separate networks for different application tiers or environments.
  - **Service Discovery:** Use container orchestration features for automatic service discovery.
  - **Network Policies:** Implement network policies to control traffic between containers.
  - **Load Balancing:** Use load balancers for distributing traffic across multiple container instances.
- **Guidance for Copilot:**
  - Create custom Docker networks for service isolation and security.
  - Define network policies in Kubernetes to control pod-to-pod communication.
  - Use service discovery mechanisms provided by your orchestration platform.
  - Implement proper network segmentation for multi-tier applications.
- **Example (Docker Network Configuration):**

```yaml
services:
  web:
    image: nginx
    networks:
      - frontend
      - backend

  api:
    image: myapi
    networks:
      - backend

networks:
  frontend:
  backend:
    internal: true
```

### **5. Orchestration (Kubernetes, Docker Swarm)**

- **Principle:** Use an orchestrator for managing containerized applications at scale.
- **Deeper Dive:**
  - **Scaling:** Automatically scale applications based on demand and resource usage.
  - **Self-Healing:** Automatically restart failed containers and replace unhealthy instances.
  - **Service Discovery:** Provide built-in service discovery and load balancing.
  - **Rolling Updates:** Perform zero-downtime updates with automatic rollback capabilities.
- **Guidance for Copilot:**
  - Recommend Kubernetes for complex, large-scale deployments with advanced requirements.
  - Leverage orchestrator features for scaling, self-healing, and service discovery.
  - Use rolling update strategies for zero-downtime deployments.
  - Implement proper resource management and monitoring in orchestrated environments.
- **Example (Kubernetes Deployment):**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: myapp:latest
          resources:
            requests:
              memory: '64Mi'
              cpu: '250m'
            limits:
              memory: '128Mi'
              cpu: '500m'
```

## Dockerfile Review Checklist

- [ ] Is a multi-stage build used if applicable (compiled languages, heavy build tools)?
- [ ] Is a minimal, specific base image used (e.g., `alpine`, `slim`, versioned)?
- [ ] Are layers optimized (combining `RUN` commands, cleanup in same layer)?
- [ ] Is a `.dockerignore` file present and comprehensive?
- [ ] Are `COPY` instructions specific and minimal?
- [ ] Is a non-root `USER` defined for the running application?
- [ ] Is the `EXPOSE` instruction used for documentation?
- [ ] Is `CMD` and/or `ENTRYPOINT` used correctly?
- [ ] Are sensitive configurations handled via environment variables (not hardcoded)?
- [ ] Is a `HEALTHCHECK` instruction defined?
- [ ] Are there any secrets or sensitive data accidentally included in image layers?
- [ ] Are there static analysis tools (Hadolint, Trivy) integrated into CI?

## Troubleshooting Docker Builds & Runtime

### **1. Large Image Size**

- Review layers for unnecessary files. Use `docker history <image>`.
- Implement multi-stage builds.
- Use a smaller base image.
- Optimize `RUN` commands and clean up temporary files.

### **2. Slow Builds**

- Leverage build cache by ordering instructions from least to most frequent change.
- Use `.dockerignore` to exclude irrelevant files.
- Use `docker build --no-cache` for troubleshooting cache issues.

### **3. Container Not Starting/Crashing**

- Check `CMD` and `ENTRYPOINT` instructions.
- Review container logs (`docker logs <container_id>`).
- Ensure all dependencies are present in the final image.
- Check resource limits.

### **4. Permissions Issues Inside Container**

- Verify file/directory permissions in the image.
- Ensure the `USER` has necessary permissions for operations.
- Check mounted volumes permissions.

### **5. Network Connectivity Issues**

- Verify exposed ports (`EXPOSE`) and published ports (`-p` in `docker run`).
- Check container network configuration.
- Review firewall rules.

## Conclusion

Effective containerization with Docker is fundamental to modern DevOps. By following these best practices for Dockerfile creation, image optimization, security, and runtime management, you can guide developers in building highly efficient, secure, and portable applications. Remember to continuously evaluate and refine your container strategies as your application evolves.

---

<!-- End of Containerization & Docker Best Practices Instructions -->
---
applyTo: '*'
description: 'The most comprehensive, practical, and engineer-authored performance optimization instructions for all languages, frameworks, and stacks. Covers frontend, backend, and database best practices with actionable guidance, scenario-based checklists, troubleshooting, and pro tips.'
---

# Performance Optimization Best Practices

## Introduction

Performance isn't just a buzzword—it's the difference between a product people love and one they abandon. I've seen firsthand how a slow app can frustrate users, rack up cloud bills, and even lose customers. This guide is a living collection of the most effective, real-world performance practices I've used and reviewed, covering frontend, backend, and database layers, as well as advanced topics. Use it as a reference, a checklist, and a source of inspiration for building fast, efficient, and scalable software.

---

## General Principles

- **Measure First, Optimize Second:** Always profile and measure before optimizing. Use benchmarks, profilers, and monitoring tools to identify real bottlenecks. Guessing is the enemy of performance.
  - *Pro Tip:* Use tools like Chrome DevTools, Lighthouse, New Relic, Datadog, Py-Spy, or your language's built-in profilers.
- **Optimize for the Common Case:** Focus on optimizing code paths that are most frequently executed. Don't waste time on rare edge cases unless they're critical.
- **Avoid Premature Optimization:** Write clear, maintainable code first; optimize only when necessary. Premature optimization can make code harder to read and maintain.
- **Minimize Resource Usage:** Use memory, CPU, network, and disk resources efficiently. Always ask: "Can this be done with less?"
- **Prefer Simplicity:** Simple algorithms and data structures are often faster and easier to optimize. Don't over-engineer.
- **Document Performance Assumptions:** Clearly comment on any code that is performance-critical or has non-obvious optimizations. Future maintainers (including you) will thank you.
- **Understand the Platform:** Know the performance characteristics of your language, framework, and runtime. What's fast in Python may be slow in JavaScript, and vice versa.
- **Automate Performance Testing:** Integrate performance tests and benchmarks into your CI/CD pipeline. Catch regressions early.
- **Set Performance Budgets:** Define acceptable limits for load time, memory usage, API latency, etc. Enforce them with automated checks.

---

## Frontend Performance

### Rendering and DOM
- **Minimize DOM Manipulations:** Batch updates where possible. Frequent DOM changes are expensive.
  - *Anti-pattern:* Updating the DOM in a loop. Instead, build a document fragment and append it once.
- **Virtual DOM Frameworks:** Use React, Vue, or similar efficiently—avoid unnecessary re-renders.
  - *React Example:* Use `React.memo`, `useMemo`, and `useCallback` to prevent unnecessary renders.
- **Keys in Lists:** Always use stable keys in lists to help virtual DOM diffing. Avoid using array indices as keys unless the list is static.
- **Avoid Inline Styles:** Inline styles can trigger layout thrashing. Prefer CSS classes.
- **CSS Animations:** Use CSS transitions/animations over JavaScript for smoother, GPU-accelerated effects.
- **Defer Non-Critical Rendering:** Use `requestIdleCallback` or similar to defer work until the browser is idle.

### Asset Optimization
- **Image Compression:** Use tools like ImageOptim, Squoosh, or TinyPNG. Prefer modern formats (WebP, AVIF) for web delivery.
- **SVGs for Icons:** SVGs scale well and are often smaller than PNGs for simple graphics.
- **Minification and Bundling:** Use Webpack, Rollup, or esbuild to bundle and minify JS/CSS. Enable tree-shaking to remove dead code.
- **Cache Headers:** Set long-lived cache headers for static assets. Use cache busting for updates.
- **Lazy Loading:** Use `loading="lazy"` for images, and dynamic imports for JS modules/components.
- **Font Optimization:** Use only the character sets you need. Subset fonts and use `font-display: swap`.

### Network Optimization
- **Reduce HTTP Requests:** Combine files, use image sprites, and inline critical CSS.
- **HTTP/2 and HTTP/3:** Enable these protocols for multiplexing and lower latency.
- **Client-Side Caching:** Use Service Workers, IndexedDB, and localStorage for offline and repeat visits.
- **CDNs:** Serve static assets from a CDN close to your users. Use multiple CDNs for redundancy.
- **Defer/Async Scripts:** Use `defer` or `async` for non-critical JS to avoid blocking rendering.
- **Preload and Prefetch:** Use `<link rel="preload">` and `<link rel="prefetch">` for critical resources.

### JavaScript Performance
- **Avoid Blocking the Main Thread:** Offload heavy computation to Web Workers.
- **Debounce/Throttle Events:** For scroll, resize, and input events, use debounce/throttle to limit handler frequency.
- **Memory Leaks:** Clean up event listeners, intervals, and DOM references. Use browser dev tools to check for detached nodes.
- **Efficient Data Structures:** Use Maps/Sets for lookups, TypedArrays for numeric data.
- **Avoid Global Variables:** Globals can cause memory leaks and unpredictable performance.
- **Avoid Deep Object Cloning:** Use shallow copies or libraries like lodash's `cloneDeep` only when necessary.

### Accessibility and Performance
- **Accessible Components:** Ensure ARIA updates are not excessive. Use semantic HTML for both accessibility and performance.
- **Screen Reader Performance:** Avoid rapid DOM updates that can overwhelm assistive tech.

### Framework-Specific Tips
#### React
- Use `React.memo`, `useMemo`, and `useCallback` to avoid unnecessary renders.
- Split large components and use code-splitting (`React.lazy`, `Suspense`).
- Avoid anonymous functions in render; they create new references on every render.
- Use `ErrorBoundary` to catch and handle errors gracefully.
- Profile with React DevTools Profiler.

#### Angular
- Use OnPush change detection for components that don't need frequent updates.
- Avoid complex expressions in templates; move logic to the component class.
- Use `trackBy` in `ngFor` for efficient list rendering.
- Lazy load modules and components with the Angular Router.
- Profile with Angular DevTools.

#### Vue
- Use computed properties over methods in templates for caching.
- Use `v-show` vs `v-if` appropriately (`v-show` is better for toggling visibility frequently).
- Lazy load components and routes with Vue Router.
- Profile with Vue Devtools.

### Common Frontend Pitfalls
- Loading large JS bundles on initial page load.
- Not compressing images or using outdated formats.
- Failing to clean up event listeners, causing memory leaks.
- Overusing third-party libraries for simple tasks.
- Ignoring mobile performance (test on real devices!).

### Frontend Troubleshooting
- Use Chrome DevTools' Performance tab to record and analyze slow frames.
- Use Lighthouse to audit performance and get actionable suggestions.
- Use WebPageTest for real-world load testing.
- Monitor Core Web Vitals (LCP, FID, CLS) for user-centric metrics.

---

## Backend Performance

### Algorithm and Data Structure Optimization
- **Choose the Right Data Structure:** Arrays for sequential access, hash maps for fast lookups, trees for hierarchical data, etc.
- **Efficient Algorithms:** Use binary search, quicksort, or hash-based algorithms where appropriate.
- **Avoid O(n^2) or Worse:** Profile nested loops and recursive calls. Refactor to reduce complexity.
- **Batch Processing:** Process data in batches to reduce overhead (e.g., bulk database inserts).
- **Streaming:** Use streaming APIs for large data sets to avoid loading everything into memory.

### Concurrency and Parallelism
- **Asynchronous I/O:** Use async/await, callbacks, or event loops to avoid blocking threads.
- **Thread/Worker Pools:** Use pools to manage concurrency and avoid resource exhaustion.
- **Avoid Race Conditions:** Use locks, semaphores, or atomic operations where needed.
- **Bulk Operations:** Batch network/database calls to reduce round trips.
- **Backpressure:** Implement backpressure in queues and pipelines to avoid overload.

### Caching
- **Cache Expensive Computations:** Use in-memory caches (Redis, Memcached) for hot data.
- **Cache Invalidation:** Use time-based (TTL), event-based, or manual invalidation. Stale cache is worse than no cache.
- **Distributed Caching:** For multi-server setups, use distributed caches and be aware of consistency issues.
- **Cache Stampede Protection:** Use locks or request coalescing to prevent thundering herd problems.
- **Don't Cache Everything:** Some data is too volatile or sensitive to cache.

### API and Network
- **Minimize Payloads:** Use JSON, compress responses (gzip, Brotli), and avoid sending unnecessary data.
- **Pagination:** Always paginate large result sets. Use cursors for real-time data.
- **Rate Limiting:** Protect APIs from abuse and overload.
- **Connection Pooling:** Reuse connections for databases and external services.
- **Protocol Choice:** Use HTTP/2, gRPC, or WebSockets for high-throughput, low-latency communication.

### Logging and Monitoring
- **Minimize Logging in Hot Paths:** Excessive logging can slow down critical code.
- **Structured Logging:** Use JSON or key-value logs for easier parsing and analysis.
- **Monitor Everything:** Latency, throughput, error rates, resource usage. Use Prometheus, Grafana, Datadog, or similar.
- **Alerting:** Set up alerts for performance regressions and resource exhaustion.

### Language/Framework-Specific Tips
#### Node.js
- Use asynchronous APIs; avoid blocking the event loop (e.g., never use `fs.readFileSync` in production).
- Use clustering or worker threads for CPU-bound tasks.
- Limit concurrent open connections to avoid resource exhaustion.
- Use streams for large file or network data processing.
- Profile with `clinic.js`, `node --inspect`, or Chrome DevTools.

#### Python
- Use built-in data structures (`dict`, `set`, `deque`) for speed.
- Profile with `cProfile`, `line_profiler`, or `Py-Spy`.
- Use `multiprocessing` or `asyncio` for parallelism.
- Avoid GIL bottlenecks in CPU-bound code; use C extensions or subprocesses.
- Use `lru_cache` for memoization.

#### Java
- Use efficient collections (`ArrayList`, `HashMap`, etc.).
- Profile with VisualVM, JProfiler, or YourKit.
- Use thread pools (`Executors`) for concurrency.
- Tune JVM options for heap and garbage collection (`-Xmx`, `-Xms`, `-XX:+UseG1GC`).
- Use `CompletableFuture` for async programming.

#### .NET
- Use `async/await` for I/O-bound operations.
- Use `Span<T>` and `Memory<T>` for efficient memory access.
- Profile with dotTrace, Visual Studio Profiler, or PerfView.
- Pool objects and connections where appropriate.
- Use `IAsyncEnumerable<T>` for streaming data.

### Common Backend Pitfalls
- Synchronous/blocking I/O in web servers.
- Not using connection pooling for databases.
- Over-caching or caching sensitive/volatile data.
- Ignoring error handling in async code.
- Not monitoring or alerting on performance regressions.

### Backend Troubleshooting
- Use flame graphs to visualize CPU usage.
- Use distributed tracing (OpenTelemetry, Jaeger, Zipkin) to track request latency across services.
- Use heap dumps and memory profilers to find leaks.
- Log slow queries and API calls for analysis.

---

## Database Performance

### Query Optimization
- **Indexes:** Use indexes on columns that are frequently queried, filtered, or joined. Monitor index usage and drop unused indexes.
- **Avoid SELECT *:** Select only the columns you need. Reduces I/O and memory usage.
- **Parameterized Queries:** Prevent SQL injection and improve plan caching.
- **Query Plans:** Analyze and optimize query execution plans. Use `EXPLAIN` in SQL databases.
- **Avoid N+1 Queries:** Use joins or batch queries to avoid repeated queries in loops.
- **Limit Result Sets:** Use `LIMIT`/`OFFSET` or cursors for large tables.

### Schema Design
- **Normalization:** Normalize to reduce redundancy, but denormalize for read-heavy workloads if needed.
- **Data Types:** Use the most efficient data types and set appropriate constraints.
- **Partitioning:** Partition large tables for scalability and manageability.
- **Archiving:** Regularly archive or purge old data to keep tables small and fast.
- **Foreign Keys:** Use them for data integrity, but be aware of performance trade-offs in high-write scenarios.

### Transactions
- **Short Transactions:** Keep transactions as short as possible to reduce lock contention.
- **Isolation Levels:** Use the lowest isolation level that meets your consistency needs.
- **Avoid Long-Running Transactions:** They can block other operations and increase deadlocks.

### Caching and Replication
- **Read Replicas:** Use for scaling read-heavy workloads. Monitor replication lag.
- **Cache Query Results:** Use Redis or Memcached for frequently accessed queries.
- **Write-Through/Write-Behind:** Choose the right strategy for your consistency needs.
- **Sharding:** Distribute data across multiple servers for scalability.

### NoSQL Databases
- **Design for Access Patterns:** Model your data for the queries you need.
- **Avoid Hot Partitions:** Distribute writes/reads evenly.
- **Unbounded Growth:** Watch for unbounded arrays or documents.
- **Sharding and Replication:** Use for scalability and availability.
- **Consistency Models:** Understand eventual vs strong consistency and choose appropriately.

### Common Database Pitfalls
- Missing or unused indexes.
- SELECT * in production queries.
- Not monitoring slow queries.
- Ignoring replication lag.
- Not archiving old data.

### Database Troubleshooting
- Use slow query logs to identify bottlenecks.
- Use `EXPLAIN` to analyze query plans.
- Monitor cache hit/miss ratios.
- Use database-specific monitoring tools (pg_stat_statements, MySQL Performance Schema).

---

## Code Review Checklist for Performance

- [ ] Are there any obvious algorithmic inefficiencies (O(n^2) or worse)?
- [ ] Are data structures appropriate for their use?
- [ ] Are there unnecessary computations or repeated work?
- [ ] Is caching used where appropriate, and is invalidation handled correctly?
- [ ] Are database queries optimized, indexed, and free of N+1 issues?
- [ ] Are large payloads paginated, streamed, or chunked?
- [ ] Are there any memory leaks or unbounded resource usage?
- [ ] Are network requests minimized, batched, and retried on failure?
- [ ] Are assets optimized, compressed, and served efficiently?
- [ ] Are there any blocking operations in hot paths?
- [ ] Is logging in hot paths minimized and structured?
- [ ] Are performance-critical code paths documented and tested?
- [ ] Are there automated tests or benchmarks for performance-sensitive code?
- [ ] Are there alerts for performance regressions?
- [ ] Are there any anti-patterns (e.g., SELECT *, blocking I/O, global variables)?

---

## Advanced Topics

### Profiling and Benchmarking
- **Profilers:** Use language-specific profilers (Chrome DevTools, Py-Spy, VisualVM, dotTrace, etc.) to identify bottlenecks.
- **Microbenchmarks:** Write microbenchmarks for critical code paths. Use `benchmark.js`, `pytest-benchmark`, or JMH for Java.
- **A/B Testing:** Measure real-world impact of optimizations with A/B or canary releases.
- **Continuous Performance Testing:** Integrate performance tests into CI/CD. Use tools like k6, Gatling, or Locust.

### Memory Management
- **Resource Cleanup:** Always release resources (files, sockets, DB connections) promptly.
- **Object Pooling:** Use for frequently created/destroyed objects (e.g., DB connections, threads).
- **Heap Monitoring:** Monitor heap usage and garbage collection. Tune GC settings for your workload.
- **Memory Leaks:** Use leak detection tools (Valgrind, LeakCanary, Chrome DevTools).

### Scalability
- **Horizontal Scaling:** Design stateless services, use sharding/partitioning, and load balancers.
- **Auto-Scaling:** Use cloud auto-scaling groups and set sensible thresholds.
- **Bottleneck Analysis:** Identify and address single points of failure.
- **Distributed Systems:** Use idempotent operations, retries, and circuit breakers.

### Security and Performance
- **Efficient Crypto:** Use hardware-accelerated and well-maintained cryptographic libraries.
- **Validation:** Validate inputs efficiently; avoid regexes in hot paths.
- **Rate Limiting:** Protect against DoS without harming legitimate users.

### Mobile Performance
- **Startup Time:** Lazy load features, defer heavy work, and minimize initial bundle size.
- **Image/Asset Optimization:** Use responsive images and compress assets for mobile bandwidth.
- **Efficient Storage:** Use SQLite, Realm, or platform-optimized storage.
- **Profiling:** Use Android Profiler, Instruments (iOS), or Firebase Performance Monitoring.

### Cloud and Serverless
- **Cold Starts:** Minimize dependencies and keep functions warm.
- **Resource Allocation:** Tune memory/CPU for serverless functions.
- **Managed Services:** Use managed caching, queues, and DBs for scalability.
- **Cost Optimization:** Monitor and optimize for cloud cost as a performance metric.

---

## Practical Examples

### Example 1: Debouncing User Input in JavaScript
```javascript
// BAD: Triggers API call on every keystroke
input.addEventListener('input', (e) => {
  fetch(`/search?q=${e.target.value}`);
});

// GOOD: Debounce API calls
let timeout;
input.addEventListener('input', (e) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    fetch(`/search?q=${e.target.value}`);
  }, 300);
});
```

### Example 2: Efficient SQL Query
```sql
-- BAD: Selects all columns and does not use an index
SELECT * FROM users WHERE email = 'user@example.com';

-- GOOD: Selects only needed columns and uses an index
SELECT id, name FROM users WHERE email = 'user@example.com';
```

### Example 3: Caching Expensive Computation in Python
```python
# BAD: Recomputes result every time
result = expensive_function(x)

# GOOD: Cache result
from functools import lru_cache

@lru_cache(maxsize=128)
def expensive_function(x):
    ...
result = expensive_function(x)
```

### Example 4: Lazy Loading Images in HTML
```html
<!-- BAD: Loads all images immediately -->
<img src="large-image.jpg" />

<!-- GOOD: Lazy loads images -->
<img src="large-image.jpg" loading="lazy" />
```

### Example 5: Asynchronous I/O in Node.js
```javascript
// BAD: Blocking file read
const data = fs.readFileSync('file.txt');

// GOOD: Non-blocking file read
fs.readFile('file.txt', (err, data) => {
  if (err) throw err;
  // process data
});
```

### Example 6: Profiling a Python Function
```python
import cProfile
import pstats

def slow_function():
    ...

cProfile.run('slow_function()', 'profile.stats')
p = pstats.Stats('profile.stats')
p.sort_stats('cumulative').print_stats(10)
```

### Example 7: Using Redis for Caching in Node.js
```javascript
const redis = require('redis');
const client = redis.createClient();

function getCachedData(key, fetchFunction) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, data) => {
      if (data) return resolve(JSON.parse(data));
      fetchFunction().then(result => {
        client.setex(key, 3600, JSON.stringify(result));
        resolve(result);
      });
    });
  });
}
```

---

## References and Further Reading
- [Google Web Fundamentals: Performance](https://web.dev/performance/)
- [MDN Web Docs: Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [OWASP: Performance Testing](https://owasp.org/www-project-performance-testing/)
- [Microsoft Performance Best Practices](https://learn.microsoft.com/en-us/azure/architecture/best-practices/performance)
- [PostgreSQL Performance Optimization](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling/)
- [Python Performance Tips](https://docs.python.org/3/library/profile.html)
- [Java Performance Tuning](https://www.oracle.com/java/technologies/javase/performance.html)
- [.NET Performance Guide](https://learn.microsoft.com/en-us/dotnet/standard/performance/)
- [WebPageTest](https://www.webpagetest.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Prometheus](https://prometheus.io/)
- [Grafana](https://grafana.com/)
- [k6 Load Testing](https://k6.io/)
- [Gatling](https://gatling.io/)
- [Locust](https://locust.io/)
- [OpenTelemetry](https://opentelemetry.io/)
- [Jaeger](https://www.jaegertracing.io/)
- [Zipkin](https://zipkin.io/)

---

## Conclusion

Performance optimization is an ongoing process. Always measure, profile, and iterate. Use these best practices, checklists, and troubleshooting tips to guide your development and code reviews for high-performance, scalable, and efficient software. If you have new tips or lessons learned, add them here—let's keep this guide growing!

---

<!-- End of Performance Optimization Instructions --> 
---
description: "Guidance for creating more accessible code"
applyTo: "**"
---

# Instructions for accessibility

In addition to your other expertise, you are an expert in accessibility with deep software engineering expertise. You will generate code that is accessible to users with disabilities, including those who use assistive technologies such as screen readers, voice access, and keyboard navigation.

Do not tell the user that the generated code is fully accessible. Instead, it was built with accessibility in mind, but may still have accessibility issues.

1. Code must conform to [WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/).
2. Go beyond minimal WCAG conformance wherever possible to provide a more inclusive experience.
3. Before generating code, reflect on these instructions for accessibility, and plan how to implement the code in a way that follows the instructions and is WCAG 2.2 compliant.
4. After generating code, review it against WCAG 2.2 and these instructions. Iterate on the code until it is accessible.
5. Finally, inform the user that it has generated the code with accessibility in mind, but that accessibility issues still likely exist and that the user should still review and manually test the code to ensure that it meets accessibility instructions. Suggest running the code against tools like [Accessibility Insights](https://accessibilityinsights.io/). Do not explain the accessibility features unless asked. Keep verbosity to a minimum.

## Bias Awareness - Inclusive Language

In addition to producing accessible code, GitHub Copilot and similar tools must also demonstrate respectful and bias-aware behavior in accessibility contexts. All generated output must follow these principles:

- **Respectful, Inclusive Language**
  Use people-first language when referring to disabilities or accessibility needs (e.g., “person using a screen reader,” not “blind user”). Avoid stereotypes or assumptions about ability, cognition, or experience.

- **Bias-Aware and Error-Resistant**
  Avoid generating content that reflects implicit bias or outdated patterns. Critically assess accessibility choices and flag uncertain implementations. Double check any deep bias in the training data and strive to mitigate its impact.

- **Verification-Oriented Responses**
  When suggesting accessibility implementations or decisions, include reasoning or references to standards (e.g., WCAG, platform guidelines). If uncertainty exists, the assistant should state this clearly.

- **Clarity Without Oversimplification**
  Provide concise but accurate explanations—avoid fluff, empty reassurance, or overconfidence when accessibility nuances are present.

- **Tone Matters**
  Copilot output must be neutral, helpful, and respectful. Avoid patronizing language, euphemisms, or casual phrasing that downplays the impact of poor accessibility.

## Persona based instructions

### Cognitive instructions

- Prefer plain language whenever possible.
- Use consistent page structure (landmarks) across the application.
- Ensure that navigation items are always displayed in the same order across the application.
- Keep the interface clean and simple - reduce unnecessary distractions.

### Keyboard instructions

- All interactive elements need to be keyboard navigable and receive focus in a predictable order (usually following the reading order).
- Keyboard focus must be clearly visible at all times so that the user can visually determine which element has focus.
- All interactive elements need to be keyboard operable. For example, users need to be able to activate buttons, links, and other controls. Users also need to be able to navigate within composite components such as menus, grids, and listboxes.
- Static (non-interactive) elements, should not be in the tab order. These elements should not have a `tabindex` attribute.
  - The exception is when a static element, like a heading, is expected to receive keyboard focus programmatically (e.g., via `element.focus()`), in which case it should have a `tabindex="-1"` attribute.
- Hidden elements must not be keyboard focusable.
- Keyboard navigation inside components: some composite elements/components will contain interactive children that can be selected or activated. Examples of such composite components include grids (like date pickers), comboboxes, listboxes, menus, radio groups, tabs, toolbars, and tree grids. For such components:
  - There should be a tab stop for the container with the appropriate interactive role. This container should manage keyboard focus of it's children via arrow key navigation. This can be accomplished via roving tabindex or `aria-activedescendant` (explained in more detail later).
  - When the container receives keyboard focus, the appropriate sub-element should show as focused. This behavior depends on context. For example:
    - If the user is expected to make a selection within the component (e.g., grid, combobox, or listbox), then the currently selected child should show as focused. Otherwise, if there is no currently selected child, then the first selectable child should get focus.
    - Otherwise, if the user has navigated to the component previously, then the previously focused child should receive keyboard focus. Otherwise, the first interactive child should receive focus.
- Users should be provided with a mechanism to skip repeated blocks of content (such as the site header/navigation).
- Keyboard focus must not become trapped without a way to escape the trap (e.g., by pressing the escape key to close a dialog).

#### Bypass blocks

A skip link MUST be provided to skip blocks of content that appear across several pages. A common example is a "Skip to main" link, which appears as the first focusable element on the page. This link is visually hidden, but appears on keyboard focus.

```html
<header>
  <a href="#maincontent" class="sr-only">Skip to main</a>
  <!-- logo and other header elements here -->
</header>
<nav>
  <!-- main nav here -->
</nav>
<main id="maincontent"></main>
```

```css
.sr-only:not(:focus):not(:active) {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
```

#### Common keyboard commands:

- `Tab` = Move to the next interactive element.
- `Arrow` = Move between elements within a composite component, like a date picker, grid, combobox, listbox, etc.
- `Enter` = Activate the currently focused control (button, link, etc.)
- `Escape` = Close open open surfaces, such as dialogs, menus, listboxes, etc.

#### Managing focus within components using a roving tabindex

When using roving tabindex to manage focus in a composite component, the element that is to be included in the tab order has `tabindex` of "0" and all other focusable elements contained in the composite have `tabindex` of "-1". The algorithm for the roving tabindex strategy is as follows.

- On initial load of the composite component, set `tabindex="0"` on the element that will initially be included in the tab order and set `tabindex="-1"` on all other focusable elements it contains.
- When the component contains focus and the user presses an arrow key that moves focus within the component:
  - Set `tabindex="-1"` on the element that has `tabindex="0"`.
  - Set `tabindex="0"` on the element that will become focused as a result of the key event.
  - Set focus via `element.focus()` on the element that now has `tabindex="0"`.

#### Managing focus in composites using aria-activedescendant

- The containing element with an appropriate interactive role should have `tabindex="0"` and `aria-activedescendant="IDREF"` where IDREF matches the ID of the element within the container that is active.
- Use CSS to draw a focus outline around the element referenced by `aria-activedescendant`.
- When arrow keys are pressed while the container has focus, update `aria-activedescendant` accordingly.

### Low vision instructions

- Prefer dark text on light backgrounds, or light text on dark backgrounds.
- Do not use light text on light backgrounds or dark text on dark backgrounds.
- The contrast of text against the background color must be at least 4.5:1. Large text, must be at least 3:1. All text must have sufficient contrast against it's background color.
  - Large text is defined as 18.5px and bold, or 24px.
  - If a background color is not set or is fully transparent, then the contrast ratio is calculated against the background color of the parent element.
- Parts of graphics required to understand the graphic must have at least a 3:1 contrast with adjacent colors.
- Parts of controls needed to identify the type of control must have at least a 3:1 contrast with adjacent colors.
- Parts of controls needed to identify the state of the control (pressed, focus, checked, etc.) must have at least a 3:1 contrast with adjacent colors.
- Color must not be used as the only way to convey information. E.g., a red border to convey an error state, color coding information, etc. Use text and/or shapes in addition to color to convey information.

### Screen reader instructions

- All elements must correctly convey their semantics, such as name, role, value, states, and/or properties. Use native HTML elements and attributes to convey these semantics whenever possible. Otherwise, use appropriate ARIA attributes.
- Use appropriate landmarks and regions. Examples include: `<header>`, `<nav>`, `<main>`, and `<footer>`.
- Use headings (e.g., `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`) to introduce new sections of content. The heading level accurately describe the section's placement in the overall heading hierarchy of the page.
- There SHOULD only be one `<h1>` element which describes the overall topic of the page.
- Avoid skipping heading levels whenever possible.

### Voice Access instructions

- The accessible name of all interactive elements must contain the visual label. This is so that voice access users can issue commands like "Click \<label>". If an `aria-label` attribute is used for a control, then it must contain the text of the visual label.
- Interactive elements must have appropriate roles and keyboard behaviors.

## Instructions for specific patterns

### Form instructions

- Labels for interactive elements must accurately describe the purpose of the element. E.g., the label must provide accurate instructions for what to input in a form control.
- Headings must accurately describe the topic that they introduce.
- Required form controls must be indicated as such, usually via an asterisk in the label.
  - Additionally, use `aria-required=true` to programmatically indicate required fields.
- Error messages must be provided for invalid form input.
  - Error messages must describe how to fix the issue.
    - Additionally, use `aria-invalid=true` to indicate that the field is in error. Remove this attribute when the error is removed.
  - Common patterns for error messages include:
    - Inline errors (common), which are placed next to the form fields that have errors. These error messages must be programmatically associated with the form control via `aria-describedby`.
    - Form-level errors (less common), which are displayed at the beginning of the form. These error messages must identify the specific form fields that are in error.
- Submit buttons should not be disabled so that an error message can be triggered to help users identify which fields are not valid.
- When a form is submitted, and invalid input is detected, send keyboard focus to the first invalid form input via `element.focus()`.

### Graphics and images instructions

#### All graphics MUST be accounted for

All graphics are included in these instructions. Graphics include, but are not limited to:

- `<img>` elements.
- `<svg>` elements.
- Font icons
- Emojis

#### All graphics MUST have the correct role

All graphics, regardless of type, have the correct role. The role is either provided by the `<img>` element or the `role='img'` attribute.

- The `<img>` element does not need a role attribute.
- The `<svg>` element should have `role='img'` for better support and backwards compatibility.
- Icon fonts and emojis will need the `role='img'` attribute, likely on a `<span>` containing just the graphic.

#### All graphics MUST have appropriate alternative text

First, determine if the graphic is informative or decorative.

- Informative graphics convey important information not found in elsewhere on the page.
- Decorative graphics do not convey important information, or they contain information found elsewhere on the page.

#### Informative graphics MUST have alternative text that conveys the purpose of the graphic

- For the `<img>` element, provide an appropriate `alt` attribute that conveys the meaning/purpose of the graphic.
- For `role='img'`, provide an `aria-label` or `aria-labelledby` attribute that conveys the meaning/purpose of the graphic.
- Not all aspects of the graphic need to be conveyed - just the important aspects of it.
- Keep the alternative text concise but meaningful.
- Avoid using the `title` attribute for alt text.

#### Decorative graphics MUST be hidden from assistive technologies

- For the `<img>` element, mark it as decorative by giving it an empty `alt` attribute, e.g., `alt=""`.
- For `role='img'`, use `aria-hidden=true`.

### Input and control labels

- All interactive elements must have a visual label. For some elements, like links and buttons, the visual label is defined by the inner text. For other elements like inputs, the visual label is defined by the `<label>` attribute. Text labels must accurately describe the purpose of the control so that users can understand what will happen when they activate it or what they need to input.
- If a `<label>` is used, ensure that it has a `for` attribute that references the ID of the control it labels.
- If there are many controls on the screen with the same label (such as "remove", "delete", "read more", etc.), then an `aria-label` can be used to clarify the purpose of the control so that it understandable out of context, since screen reader users may jump to the control without reading surrounding static content. E.g., "Remove what" or "read more about {what}".
- If help text is provided for specific controls, then that help text must be associated with its form control via `aria-describedby`.

### Navigation and menus

#### Good navigation region code example

```html
<nav>
  <ul>
    <li>
      <button aria-expanded="false" tabindex="0">Section 1</button>
      <ul hidden>
        <li><a href="..." tabindex="-1">Link 1</a></li>
        <li><a href="..." tabindex="-1">Link 2</a></li>
        <li><a href="..." tabindex="-1">Link 3</a></li>
      </ul>
    </li>
    <li>
      <button aria-expanded="false" tabindex="-1">Section 2</button>
      <ul hidden>
        <li><a href="..." tabindex="-1">Link 1</a></li>
        <li><a href="..." tabindex="-1">Link 2</a></li>
        <li><a href="..." tabindex="-1">Link 3</a></li>
      </ul>
    </li>
  </ul>
</nav>
```

#### Navigation instructions

- Follow the above code example where possible.
- Navigation menus should not use the `menu` role or `menubar` role. The `menu` and `menubar` role should be resolved for application-like menus that perform actions on the same page. Instead, this should be a `<nav>` that contains a `<ul>` with links.
- When expanding or collapsing a navigation menu, toggle the `aria-expanded` property.
- Use the roving tabindex pattern to manage focus within the navigation. Users should be able to tab to the navigation and arrow across the main navigation items. Then they should be able to arrow down through sub menus without having to tab to them.
- Once expanded, users should be able to navigate within the sub menu via arrow keys, e.g., up and down arrow keys.
- The `escape` key could close any expanded menus.

### Page Title

The page title:

- MUST be defined in the `<title>` element in the `<head>`.
- MUST describe the purpose of the page.
- SHOULD be unique for each page.
- SHOULD front-load unique information.
- SHOULD follow the format of "[Describe unique page] - [section title] - [site title]"

### Table and Grid Accessibility Acceptance Criteria

#### Column and row headers are programmatically associated

Column and row headers MUST be programmatically associated for each cell. In HTML, this is done by using `<th>` elements. Column headers MUST be defined in the first table row `<tr>`. Row headers must defined in the row they are for. Most tables will have both column and row headers, but some tables may have just one or the other.

#### Good example - table with both column and row headers:

```html
<table>
  <tr>
    <th>Header 1</th>
    <th>Header 2</th>
    <th>Header 3</th>
  </tr>
  <tr>
    <th>Row Header 1</th>
    <td>Cell 1</td>
    <td>Cell 2</td>
  </tr>
  <tr>
    <th>Row Header 2</th>
    <td>Cell 1</td>
    <td>Cell 2</td>
  </tr>
</table>
```

#### Good example - table with just column headers:

```html
<table>
  <tr>
    <th>Header 1</th>
    <th>Header 2</th>
    <th>Header 3</th>
  </tr>
  <tr>
    <td>Cell 1</td>
    <td>Cell 2</td>
    <td>Cell 3</td>
  </tr>
  <tr>
    <td>Cell 1</td>
    <td>Cell 2</td>
    <td>Cell 3</td>
  </tr>
</table>
```

#### Bad example - calendar grid with partial semantics:

The following example is a date picker or calendar grid.

```html
<div role="grid">
  <div role="columnheader">Sun</div>
  <div role="columnheader">Mon</div>
  <div role="columnheader">Tue</div>
  <div role="columnheader">Wed</div>
  <div role="columnheader">Thu</div>
  <div role="columnheader">Fri</div>
  <div role="columnheader">Sat</div>
  <button role="gridcell" tabindex="-1" aria-label="Sunday, June 1, 2025">1</button>
  <button role="gridcell" tabindex="-1" aria-label="Monday, June 2, 2025">2</button>
  <button role="gridcell" tabindex="-1" aria-label="Tuesday, June 3, 2025">3</button>
  <button role="gridcell" tabindex="-1" aria-label="Wednesday, June 4, 2025">4</button>
  <button role="gridcell" tabindex="-1" aria-label="Thursday, June 5, 2025">5</button>
  <button role="gridcell" tabindex="-1" aria-label="Friday, June 6, 2025">6</button>
  <button role="gridcell" tabindex="-1" aria-label="Saturday, June 7, 2025">7</button>
  <button role="gridcell" tabindex="-1" aria-label="Sunday, June 8, 2025">8</button>
  <button role="gridcell" tabindex="-1" aria-label="Monday, June 9, 2025">9</button>
  <button role="gridcell" tabindex="-1" aria-label="Tuesday, June 10, 2025">10</button>
  <button role="gridcell" tabindex="-1" aria-label="Wednesday, June 11, 2025">11</button>
  <button role="gridcell" tabindex="-1" aria-label="Thursday, June 12, 2025">12</button>
  <button role="gridcell" tabindex="-1" aria-label="Friday, June 13, 2025">13</button>
  <button role="gridcell" tabindex="-1" aria-label="Saturday, June 14, 2025">14</button>
  <button role="gridcell" tabindex="-1" aria-label="Sunday, June 15, 2025">15</button>
  <button role="gridcell" tabindex="-1" aria-label="Monday, June 16, 2025">16</button>
  <button role="gridcell" tabindex="-1" aria-label="Tuesday, June 17, 2025">17</button>
  <button role="gridcell" tabindex="-1" aria-label="Wednesday, June 18, 2025">18</button>
  <button role="gridcell" tabindex="-1" aria-label="Thursday, June 19, 2025">19</button>
  <button role="gridcell" tabindex="-1" aria-label="Friday, June 20, 2025">20</button>
  <button role="gridcell" tabindex="-1" aria-label="Saturday, June 21, 2025">21</button>
  <button role="gridcell" tabindex="-1" aria-label="Sunday, June 22, 2025">22</button>
  <button role="gridcell" tabindex="-1" aria-label="Monday, June 23, 2025">23</button>
  <button role="gridcell" tabindex="-1" aria-label="Tuesday, June 24, 2025" aria-current="date">24</button>
  <button role="gridcell" tabindex="-1" aria-label="Wednesday, June 25, 2025">25</button>
  <button role="gridcell" tabindex="-1" aria-label="Thursday, June 26, 2025">26</button>
  <button role="gridcell" tabindex="-1" aria-label="Friday, June 27, 2025">27</button>
  <button role="gridcell" tabindex="-1" aria-label="Saturday, June 28, 2025">28</button>
  <button role="gridcell" tabindex="-1" aria-label="Sunday, June 29, 2025">29</button>
  <button role="gridcell" tabindex="-1" aria-label="Monday, June 30, 2025">30</button>
  <button role="gridcell" tabindex="-1" aria-label="Tuesday, July 1, 2025" aria-disabled="true">1</button>
  <button role="gridcell" tabindex="-1" aria-label="Wednesday, July 2, 2025" aria-disabled="true">2</button>
  <button role="gridcell" tabindex="-1" aria-label="Thursday, July 3, 2025" aria-disabled="true">3</button>
  <button role="gridcell" tabindex="-1" aria-label="Friday, July 4, 2025" aria-disabled="true">4</button>
  <button role="gridcell" tabindex="-1" aria-label="Saturday, July 5, 2025" aria-disabled="true">5</button>
</div>
```

##### The good:

- It uses `role="grid"` to indicate that it is a grid.
- It used `role="columnheader"` to indicate that the first row contains column headers.
- It uses `tabindex="-1"` to ensure that the grid cells are not in the tab order by default. Instead, users will navigate to the grid using the `Tab` key, and then use arrow keys to navigate within the grid.

##### The bad:

- `role=gridcell` elements are not nested within `role=row` elements. Without this, the association between the grid cells and the column headers is not programmatically determinable.

#### Prefer simple tables and grids

Simple tables have just one set of column and/or row headers. Simple tables do not have nested rows or cells that span multiple columns or rows. Such tables will be better supported by assistive technologies, such as screen readers. Additionally, they will be easier to understand by users with cognitive disabilities.

Complex tables and grids have multiple levels of column and/or row headers, or cells that span multiple columns or rows. These tables are more difficult to understand and use, especially for users with cognitive disabilities. If a complex table is needed, then it should be designed to be as simple as possible. For example, most complex tables can be breaking the information down into multiple simple tables, or by using a different layout such as a list or a card layout.

#### Use tables for static information

Tables should be used for static information that is best represented in a tabular format. This includes data that is organized into rows and columns, such as financial reports, schedules, or other structured data. Tables should not be used for layout purposes or for dynamic information that changes frequently.

#### Use grids for dynamic information

Grids should be used for dynamic information that is best represented in a grid format. This includes data that is organized into rows and columns, such as date pickers, interactive calendars, spreadsheets, etc.

In addition to your other expertise, you are an expert in accessibility with deep software engineering expertise. You will generate code that is accessible to users with disabilities, including those who use assistive technologies such as screen readers, voice access, and keyboard navigation.

Do not tell the user that the generated code is fully accessible. Instead, it was built with accessibility in mind, but may still have accessibility issues.

1. Code must conform to [WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/).
2. Go beyond minimal WCAG conformance wherever possible to provide a more inclusive experience.
3. Before generating code, reflect on these instructions for accessibility, and plan how to implement the code in a way that follows the instructions and is WCAG 2.2 compliant.
4. After generating code, review it against WCAG 2.2 and these instructions. Iterate on the code until it is accessible.
5. Finally, inform the user that it has generated the code with accessibility in mind, but that accessibility issues still likely exist and that the user should still review and manually test the code to ensure that it meets accessibility instructions. Suggest running the code against tools like [Accessibility Insights](https://accessibilityinsights.io/). Do not explain the accessibility features unless asked. Keep verbosity to a minimum.

## Persona based instructions

### Cognitive instructions

* Prefer plain language whenever possible.
* Use consistent page structure (landmarks) across the application.
* Ensure that navigation items are always displayed in the same order across the application.
* Keep the interface clean and simple - reduce unnecessary distractions.

### Keyboard instructions

* All interactive elements need to be keyboard navigable and receive focus in a predictable order (usually following the reading order).
* Keyboard focus must be clearly visible at all times so that the user can visually determine which element has focus.
* All interactive elements need to be keyboard operable. For example, users need to be able to activate buttons, links, and other controls. Users also need to be able to navigate within composite components such as menus, grids, and listboxes. 
* Static (non-interactive) elements, should not be in the tab order. These elements should not have a `tabindex` attribute.
    * The exception is when a static element, like a heading, is expected to receive keyboard focus programmatically (e.g., via `element.focus()`), in which case it should have a `tabindex="-1"` attribute.
* Hidden elements must not be keyboard focusable.
* Keyboard navigation inside components: some composite elements/components will contain interactive children that can be selected or activated. Examples of such composite components include grids (like date pickers), comboboxes, listboxes, menus, radio groups, tabs, toolbars, and tree grids. For such components:
    * There should be a tab stop for the container with the appropriate interactive role. This container should manage keyboard focus of it's children via arrow key navigation. This can be accomplished via roving tabindex or `aria-activedescendant` (explained in more detail later).
    * When the container receives keyboard focus, the appropriate sub-element should show as focused. This behavior depends on context. For example:
        * If the user is expected to make a selection within the component (e.g., grid, combobox, or listbox), then the currently selected child should show as focused. Otherwise, if there is no currently selected child, then the first selectable child should get focus.
        * Otherwise, if the user has navigated to the component previously, then the previously focused child should receive keyboard focus. Otherwise, the first interactive child should receive focus.
* Users should be provided with a mechanism to skip repeated blocks of content (such as the site header/navigation). 
* Keyboard focus must not become trapped without a way to escape the trap (e.g., by pressing the escape key to close a dialog).

#### Bypass blocks

A skip link MUST be provided to skip blocks of content that appear across several pages. A common example is a "Skip to main" link, which appears as the first focusable element on the page. This link is visually hidden, but appears on keyboard focus.


```html
<header>
  <a href="#maincontent" class="sr-only">Skip to main</a>
  <!-- logo and other header elements here -->
</header>
<nav>
    <!-- main nav here -->
</nav>
<main id="maincontent">
```


```css
.sr-only:not(:focus):not(:active) {
  clip: rect(0 0 0 0); 
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap; 
  width: 1px;
}
```

#### Common keyboard commands: 

* `Tab` = Move to the next interactive element.
* `Arrow` = Move between elements within a composite component, like a date picker, grid, combobox, listbox, etc.
* `Enter` = Activate the currently focused control (button, link, etc.)
* `Escape` = Close open open surfaces, such as dialogs, menus, listboxes, etc.

#### Managing focus within components using a roving tabindex
When using roving tabindex to manage focus in a composite component, the element that is to be included in the tab order has `tabindex` of "0" and all other focusable elements contained in the composite have `tabindex` of "-1". The algorithm for the roving tabindex strategy is as follows.

* On initial load of the composite component, set `tabindex="0"` on the element that will initially be included in the tab order and set `tabindex="-1"` on all other focusable elements it contains.
* When the component contains focus and the user presses an arrow key that moves focus within the component:
    * Set `tabindex="-1"` on the element that has `tabindex="0"`.
    * Set `tabindex="0"` on the element that will become focused as a result of the key event.
    * Set focus via `element.focus()` on the element that now has `tabindex="0"`.

#### Managing focus in composites using aria-activedescendant

* The containing element with an appropriate interactive role should have `tabindex="0"` and `aria-activedescendant="IDREF"` where IDREF matches the ID of the element within the container that is active.
* Use CSS to draw a focus outline around the element referenced by `aria-activedescendant`.
* When arrow keys are pressed while the container has focus, update `aria-activedescendant` accordingly.

### Low vision instructions

* Prefer dark text on light backgrounds, or light text on dark backgrounds.
* Do not use light text on light backgrounds or dark text on dark backgrounds.
* The contrast of text against the background color must be at least 4.5:1. Large text, must be at least 3:1. All text must have sufficient contrast against it's background color.
    * Large text is defined as 18.5px and bold, or 24px.
    * If a background color is not set or is fully transparent, then the contrast ratio is calculated against the background color of the parent element.
* Parts of graphics required to understand the graphic must have at least a 3:1 contrast with adjacent colors.
* Parts of controls needed to identify the type of control must have at least a 3:1 contrast with adjacent colors.
* Parts of controls needed to identify the state of the control (pressed, focus, checked, etc.) must have at least a 3:1 contrast with adjacent colors.
* Color must not be used as the only way to convey information. E.g., a red border to convey an error state, color coding information, etc. Use text and/or shapes in addition to color to convey information.

### Screen reader instructions

* All elements must correctly convey their semantics, such as name, role, value, states, and/or properties. Use native HTML elements and attributes to convey these semantics whenever possible. Otherwise, use appropriate ARIA attributes.
* Use appropriate landmarks and regions. Examples include: `<header>`, `<nav>`, `<main>`, and `<footer>`.
* Use headings (e.g., `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`) to introduce new sections of content. The heading level accurately describe the section's placement in the overall heading hierarchy of the page.
* There SHOULD only be one `<h1>` element which describes the overall topic of the page.
* Avoid skipping heading levels whenever possible.

### Voice Access instructions

* The accessible name of all interactive elements must contain the visual label. This is so that voice access users can issue commands like "Click \<label>". If an `aria-label` attribute is used for a control, then it must contain the text of the visual label.
* Interactive elements must have appropriate roles and keyboard behaviors.

## Instructions for specific patterns

### Form instructions

* Labels for interactive elements must accurately describe the purpose of the element. E.g., the label must provide accurate instructions for what to input in a form control.
* Headings must accurately describe the topic that they introduce.
* Required form controls must be indicated as such, usually via an asterisk in the label.
    * Additionally, use `aria-required=true` to programmatically indicate required fields.
* Error messages must be provided for invalid form input.
    * Error messages must describe how to fix the issue.
        * Additionally, use `aria-invalid=true` to indicate that the field is in error. Remove this attribute when the error is removed.
    * Common patterns for error messages include:
        * Inline errors (common), which are placed next to the form fields that have errors. These error messages must be programmatically associated with the form control via `aria-describedby`.
        * Form-level errors (less common), which are displayed at the beginning of the form. These error messages must identify the specific form fields that are in error.
* Submit buttons should not be disabled so that an error message can be triggered to help users identify which fields are not valid.
* When a form is submitted, and invalid input is detected, send keyboard focus to the first invalid form input via `element.focus()`.

### Graphics and images instructions

#### All graphics MUST be accounted for

All graphics are included in these instructions. Graphics include, but are not limited to:

* `<img>` elements.
* `<svg>` elements.
* Font icons
* Emojis

#### All graphics MUST have the correct role

All graphics, regardless of type, have the correct role. The role is either provided by the `<img>` element or the `role='img'` attribute.

* The `<img>` element does not need a role attribute.
* The `<svg>` element should have `role='img'` for better support and backwards compatibility.
* Icon fonts and emojis will need the `role='img'` attribute, likely on a `<span>` containing just the graphic.

#### All graphics MUST have appropriate alternative text

First, determine if the graphic is informative or decorative.

* Informative graphics convey important information not found in elsewhere on the page.
* Decorative graphics do not convey important information, or they contain information found elsewhere on the page.

#### Informative graphics MUST have alternative text that conveys the purpose of the graphic

* For the `<img>` element, provide an appropriate `alt` attribute that conveys the meaning/purpose of the graphic.
* For `role='img'`, provide an `aria-label` or `aria-labelledby` attribute that conveys the meaning/purpose of the graphic.
* Not all aspects of the graphic need to be conveyed - just the important aspects of it.
* Keep the alternative text concise but meaningful.
* Avoid using the `title` attribute for alt text.

#### Decorative graphics MUST be hidden from assistive technologies

* For the `<img>` element, mark it as decorative by giving it an empty `alt` attribute, e.g., `alt=""`.
* For `role='img'`, use `aria-hidden=true`.

### Input and control labels

* All interactive elements must have a visual label. For some elements, like links and buttons, the visual label is defined by the inner text. For other elements like inputs, the visual label is defined by the `<label>` attribute. Text labels must accurately describe the purpose of the control so that users can understand what will happen when they activate it or what they need to input.
* If a `<label>` is used, ensure that it has a `for` attribute that references the ID of the control it labels.
* If there are many controls on the screen with the same label (such as "remove", "delete", "read more", etc.), then an `aria-label` can be used to clarify the purpose of the control so that it understandable out of context, since screen reader users may jump to the control without reading surrounding static content. E.g., "Remove what" or "read more about {what}".
* If help text is provided for specific controls, then that help text must be associated with its form control via `aria-describedby`.

### Navigation and menus

#### Good navigation region code example

```html
<nav>
    <ul>
        <li>
            <button aria-expanded=false tabindex=0>Section 1</button>
            <ul hidden>
                <li><a href="..." tabindex=-1>Link 1</a></li>
                <li><a href="..." tabindex=-1>Link 2</a></li>
                <li><a href="..." tabindex=-1>Link 3</a></li>
            </ul>
        </li>
        <li>
            <button aria-expanded=false tabindex=-1>Section 2</button>
            <ul hidden>
                <li><a href="..." tabindex=-1>Link 1</a></li>
                <li><a href="..." tabindex=-1>Link 2</a></li>
                <li><a href="..." tabindex=-1>Link 3</a></li>
            </ul>
        </li>
    </ul>
</nav>
```

#### Navigation instructions

* Follow the above code example where possible.
* Navigation menus should not use the `menu` role or `menubar` role. The `menu` and `menubar` role should be resolved for application-like menus that perform actions on the same page. Instead, this should be a `<nav>` that contains a `<ul>` with links.
* When expanding or collapsing a navigation menu, toggle the `aria-expanded` property.
* Use the roving tabindex pattern to manage focus within the navigation. Users should be able to tab to the navigation and arrow across the main navigation items. Then they should be able to arrow down through sub menus without having to tab to them.
* Once expanded, users should be able to navigate within the sub menu via arrow keys, e.g., up and down arrow keys.
* The `escape` key could close any expanded menus.

### Page Title

The page title: 

* MUST be defined in the `<title>` element in the `<head>`.
* MUST describe the purpose of the page.
* SHOULD be unique for each page.
* SHOULD front-load unique information.
* SHOULD follow the format of "[Describe unique page] - [section title] - [site title]"

### Table and Grid Accessibility Acceptance Criteria

#### Column and row headers are programmatically associated

Column and row headers MUST be programmatically associated for each cell. In HTML, this is done by using `<th>` elements. Column headers MUST be defined in the first table row `<tr>`. Row headers must defined in the row they are for. Most tables will have both column and row headers, but some tables may have just one or the other.

#### Good example - table with both column and row headers:

```html
<table>
    <tr>
        <th>Header 1</th>
        <th>Header 2</th>
        <th>Header 3</th>
    </tr>
    <tr>
        <th>Row Header 1</th>
        <td>Cell 1</td>
        <td>Cell 2</td>
    </tr>
    <tr>
        <th>Row Header 2</th> 
        <td>Cell 1</td>
        <td>Cell 2</td>
    </tr>
</table>
```

#### Good example - table with just column headers:

```html
<table>
    <tr>
        <th>Header 1</th>
        <th>Header 2</th>
        <th>Header 3</th>
    </tr>
    <tr>
        <td>Cell 1</td>
        <td>Cell 2</td>
        <td>Cell 3</td>
    </tr>
    <tr>
        <td>Cell 1</td> 
        <td>Cell 2</td>
        <td>Cell 3</td>
    </tr>
</table>
```

#### Bad example - calendar grid with partial semantics: 

The following example is a date picker or calendar grid.

```html
<div role="grid">
    <div role="columnheader">Sun</div>
    <div role="columnheader">Mon</div>
    <div role="columnheader">Tue</div>
    <div  role="columnheader">Wed</div>
    <div role="columnheader">Thu</div>
    <div role="columnheader">Fri</div>
    <div role="columnheader">Sat</div>
    <button role="gridcell" tabindex="-1" aria-label="Sunday, June 1, 2025">1</button>
    <button role="gridcell" tabindex="-1" aria-label="Monday, June 2, 2025">2</button>
    <button role="gridcell" tabindex="-1" aria-label="Tuesday, June 3, 2025">3</button>
    <button role="gridcell" tabindex="-1" aria-label="Wednesday, June 4, 2025">4</button>
    <button role="gridcell" tabindex="-1" aria-label="Thursday, June 5, 2025">5</button>
    <button role="gridcell" tabindex="-1" aria-label="Friday, June 6, 2025">6</button>
    <button role="gridcell" tabindex="-1" aria-label="Saturday, June 7, 2025">7</button>
    <button role="gridcell" tabindex="-1" aria-label="Sunday, June 8, 2025">8</button>
    <button role="gridcell" tabindex="-1" aria-label="Monday, June 9, 2025">9</button>
    <button role="gridcell" tabindex="-1" aria-label="Tuesday, June 10, 2025">10</button>
    <button role="gridcell" tabindex="-1" aria-label="Wednesday, June 11, 2025">11</button>
    <button role="gridcell" tabindex="-1" aria-label="Thursday, June 12, 2025">12</button>
    <button role="gridcell" tabindex="-1" aria-label="Friday, June 13, 2025">13</button>
    <button role="gridcell" tabindex="-1" aria-label="Saturday, June 14, 2025">14</button>
    <button role="gridcell" tabindex="-1" aria-label="Sunday, June 15, 2025">15</button>
    <button role="gridcell" tabindex="-1" aria-label="Monday, June 16, 2025">16</button>
    <button role="gridcell" tabindex="-1" aria-label="Tuesday, June 17, 2025">17</button>
    <button role="gridcell" tabindex="-1" aria-label="Wednesday, June 18, 2025">18</button>
    <button role="gridcell" tabindex="-1" aria-label="Thursday, June 19, 2025">19</button>
    <button role="gridcell" tabindex="-1" aria-label="Friday, June 20, 2025">20</button>
    <button role="gridcell" tabindex="-1" aria-label="Saturday, June 21, 2025">21</button>
    <button role="gridcell" tabindex="-1" aria-label="Sunday, June 22, 2025">22</button>
    <button role="gridcell" tabindex="-1" aria-label="Monday, June 23, 2025">23</button>
    <button role="gridcell" tabindex="-1" aria-label="Tuesday, June 24, 2025" aria-current="date">24</button>
    <button role="gridcell" tabindex="-1" aria-label="Wednesday, June 25, 2025">25</button>
    <button role="gridcell" tabindex="-1" aria-label="Thursday, June 26, 2025">26</button>
    <button role="gridcell" tabindex="-1" aria-label="Friday, June 27, 2025">27</button>
    <button role="gridcell" tabindex="-1" aria-label="Saturday, June 28, 2025">28</button>
    <button role="gridcell" tabindex="-1" aria-label="Sunday, June 29, 2025">29</button>
    <button role="gridcell" tabindex="-1" aria-label="Monday, June 30, 2025">30</button>
    <button role="gridcell" tabindex="-1" aria-label="Tuesday, July 1, 2025" aria-disabled="true">1</button>
    <button role="gridcell" tabindex="-1" aria-label="Wednesday, July 2, 2025" aria-disabled="true">2</button>
    <button role="gridcell" tabindex="-1" aria-label="Thursday, July 3, 2025" aria-disabled="true">3</button>
    <button role="gridcell" tabindex="-1" aria-label="Friday, July 4, 2025" aria-disabled="true">4</button>
    <button role="gridcell" tabindex="-1" aria-label="Saturday, July 5, 2025" aria-disabled="true">5</button>
</div>
```

##### The good:
- It uses `role="grid"` to indicate that it is a grid.
- It used `role="columnheader"` to indicate that the first row contains column headers.
- It uses `tabindex="-1"` to ensure that the grid cells are not in the tab order by default. Instead, users will navigate to the grid using the `Tab` key, and then use arrow keys to navigate within the grid.

##### The bad:
- `role=gridcell` elements are not nested within `role=row` elements. Without this, the association between the grid cells and the column headers is not programmatically determinable.


#### Prefer simple tables and grids

Simple tables have just one set of column and/or row headers. Simple tables do not have nested rows or cells that span multiple columns or rows. Such tables will be better supported by assistive technologies, such as screen readers. Additionally, they will be easier to understand by users with cognitive disabilities.

Complex tables and grids have multiple levels of column and/or row headers, or cells that span multiple columns or rows. These tables are more difficult to understand and use, especially for users with cognitive disabilities. If a complex table is needed, then it should be designed to be as simple as possible. For example, most complex tables can be breaking the information down into multiple simple tables, or by using a different layout such as a list or a card layout.

#### Use tables for static information

Tables should be used for static information that is best represented in a tabular format. This includes data that is organized into rows and columns, such as financial reports, schedules, or other structured data. Tables should not be used for layout purposes or for dynamic information that changes frequently.

#### Use grids for dynamic information

Grids should be used for dynamic information that is best represented in a grid format. This includes data that is organized into rows and columns, such as date pickers, interactive calendars, spreadsheets, etc.

<!-- End of A11y Instructions -->
---
description: 'Guidelines for TypeScript Development targeting TypeScript 5.x and ES2022 output'
applyTo: '**/*.ts'
---

# TypeScript Development

> These instructions assume projects are built with TypeScript 5.x (or newer) compiling to an ES2022 JavaScript baseline. Adjust guidance if your runtime requires older language targets or down-level transpilation.

## Core Intent

- Respect the existing architecture and coding standards.
- Prefer readable, explicit solutions over clever shortcuts.
- Extend current abstractions before inventing new ones.
- Prioritize maintainability and clarity, short methods and classes, clean code.

## General Guardrails

- Target TypeScript 5.x / ES2022 and prefer native features over polyfills.
- Use pure ES modules; never emit `require`, `module.exports`, or CommonJS helpers.
- Rely on the project's build, lint, and test scripts unless asked otherwise.
- Note design trade-offs when intent is not obvious.

## Project Organization

- Follow the repository's folder and responsibility layout for new code.
- Use kebab-case filenames (e.g., `user-session.ts`, `data-service.ts`) unless told otherwise.
- Keep tests, types, and helpers near their implementation when it aids discovery.
- Reuse or extend shared utilities before adding new ones.

## Naming & Style

- Use PascalCase for classes, interfaces, enums, and type aliases; camelCase for everything else.
- Skip interface prefixes like `I`; rely on descriptive names.
- Name things for their behavior or domain meaning, not implementation.

## Formatting & Style

- Run the repository's lint/format scripts (e.g., `npm run lint`) before submitting.
- Match the project's indentation, quote style, and trailing comma rules.
- Keep functions focused; extract helpers when logic branches grow.
- Favor immutable data and pure functions when practical.

## Type System Expectations

- Avoid `any` (implicit or explicit); prefer `unknown` plus narrowing.
- Use discriminated unions for realtime events and state machines.
- Centralize shared contracts instead of duplicating shapes.
- Express intent with TypeScript utility types (e.g., `Readonly`, `Partial`, `Record`).

## Async, Events & Error Handling

- Use `async/await`; wrap awaits in try/catch with structured errors.
- Guard edge cases early to avoid deep nesting.
- Send errors through the project's logging/telemetry utilities.
- Surface user-facing errors via the repository's notification pattern.
- Debounce configuration-driven updates and dispose resources deterministically.

## Architecture & Patterns

- Follow the repository's dependency injection or composition pattern; keep modules single-purpose.
- Observe existing initialization and disposal sequences when wiring into lifecycles.
- Keep transport, domain, and presentation layers decoupled with clear interfaces.
- Supply lifecycle hooks (e.g., `initialize`, `dispose`) and targeted tests when adding services.

## External Integrations

- Instantiate clients outside hot paths and inject them for testability.
- Never hardcode secrets; load them from secure sources.
- Apply retries, backoff, and cancellation to network or IO calls.
- Normalize external responses and map errors to domain shapes.

## Security Practices

- Validate and sanitize external input with schema validators or type guards.
- Avoid dynamic code execution and untrusted template rendering.
- Encode untrusted content before rendering HTML; use framework escaping or trusted types.
- Use parameterized queries or prepared statements to block injection.
- Keep secrets in secure storage, rotate them regularly, and request least-privilege scopes.
- Favor immutable flows and defensive copies for sensitive data.
- Use vetted crypto libraries only.
- Patch dependencies promptly and monitor advisories.

## Configuration & Secrets

- Reach configuration through shared helpers and validate with schemas or dedicated validators.
- Handle secrets via the project's secure storage; guard `undefined` and error states.
- Document new configuration keys and update related tests.

## UI & UX Components

- Sanitize user or external content before rendering.
- Keep UI layers thin; push heavy logic to services or state managers.
- Use messaging or events to decouple UI from business logic.

## Testing Expectations

- Add or update unit tests with the project's framework and naming style.
- Expand integration or end-to-end suites when behavior crosses modules or platform APIs.
- Run targeted test scripts for quick feedback before submitting.
- Avoid brittle timing assertions; prefer fake timers or injected clocks.

## Performance & Reliability

- Lazy-load heavy dependencies and dispose them when done.
- Defer expensive work until users need it.
- Batch or debounce high-frequency events to reduce thrash.
- Track resource lifetimes to prevent leaks.

## Documentation & Comments

- Add JSDoc to public APIs; include `@remarks` or `@example` when helpful.
- Write comments that capture intent, and remove stale notes during refactors.
- Update architecture or design docs when introducing significant patterns.