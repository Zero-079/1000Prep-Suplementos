# Skill Registry

## Available Skills

### frontend-design
- **Name**: frontend-design
- **Description**: Create distinctive, production-grade frontend interfaces with high design quality
- **Trigger**: When building web components, pages, or any frontend UI that needs aesthetics
- **Path**: ~/.config/opencode/skills/frontend-design/SKILL.md

### git-pr-workflow
- **Name**: git-pr-workflow
- **Description**: Create commits and pull requests following a consistent workflow
- **Trigger**: When user asks to commit, create PR, or any git workflow involving branches and pull requests
- **Path**: ~/.config/opencode/skills/git-pr-workflow/SKILL.md

### go-testing
- **Name**: go-testing
- **Description**: Go testing patterns for Gentleman.Dots, including Bubbletea TUI testing
- **Trigger**: When writing Go tests, using teatest, or adding test coverage
- **Path**: ~/.config/opencode/skills/go-testing/SKILL.md

### sdd-apply
- **Name**: sdd-apply
- **Description**: Implement tasks from the change, writing actual code following the specs and design
- **Trigger**: When the orchestrator launches you to implement one or more tasks from a change
- **Path**: ~/.config/opencode/skills/sdd-apply/SKILL.md

### sdd-archive
- **Name**: sdd-archive
- **Description**: Sync delta specs to main specs and archive a completed change
- **Trigger**: When the orchestrator launches you to archive a change after implementation and verification
- **Path**: ~/.config/opencode/skills/sdd-archive/SKILL.md

### sdd-design
- **Name**: sdd-design
- **Description**: Create technical design document with architecture decisions and approach
- **Trigger**: When the orchestrator launches you to write or update the technical design for a change
- **Path**: ~/.config/opencode/skills/sdd-design/SKILL.md

### sdd-explore
- **Name**: sdd-explore
- **Description**: Explore and investigate ideas before committing to a change
- **Trigger**: When the orchestrator launches you to think through a feature, investigate the codebase, or clarify requirements
- **Path**: ~/.config/opencode/skills/sdd-explore/SKILL.md

### sdd-init
- **Name**: sdd-init
- **Description**: Initialize Spec-Driven Development context in any project
- **Trigger**: When user wants to initialize SDD in a project, or says "sdd init", "iniciar sdd", "openspec init"
- **Path**: ~/.config/opencode/skills/sdd-init/SKILL.md

### sdd-propose
- **Name**: sdd-propose
- **Description**: Create a change proposal with intent, scope, and approach
- **Trigger**: When the orchestrator launches you to create or update a proposal for a change
- **Path**: ~/.config/opencode/skills/sdd-propose/SKILL.md

### sdd-spec
- **Name**: sdd-spec
- **Description**: Write specifications with requirements and scenarios (delta specs for changes)
- **Trigger**: When the orchestrator launches you to write or update specs for a change
- **Path**: ~/.config/opencode/skills/sdd-spec/SKILL.md

### sdd-tasks
- **Name**: sdd-tasks
- **Description**: Break down a change into an implementation task checklist
- **Trigger**: When the orchestrator launches you to create or update the task breakdown for a change
- **Path**: ~/.config/opencode/skills/sdd-tasks/SKILL.md

### sdd-verify
- **Name**: sdd-verify
- **Description**: Validate that implementation matches specs, design, and tasks
- **Trigger**: When the orchestrator launches you to verify a completed (or partially completed) change
- **Path**: ~/.config/opencode/skills/sdd-verify/SKILL.md

### skill-creator
- **Name**: skill-creator
- **Description**: Creates new AI agent skills following the Agent Skills spec
- **Trigger**: When user asks to create a new skill, add agent instructions, or document patterns for AI
- **Path**: ~/.config/opencode/skills/skill-creator/SKILL.md

## Project Conventions

### Frontend (1000Prep-Suplementos)
- **Tech Stack**: Next.js 16.1.7 with React 19.2.0, TypeScript 5.x
- **Architecture**: Feature-based architecture with App Router
- **UI Library**: Radix UI components with Tailwind CSS 4.1.9
- **Form Handling**: react-hook-form 7.72.0 with zod 3.25.76 validation
- **Package Manager**: npm (package-lock.json present)
- **Path Aliases**: @/* → ./src/* (configured in tsconfig.json)

### Backend (back_100preps/1000preps)
- **Tech Stack**: NestJS 11.x with TypeScript 5.7.x
- **ORM**: Prisma 6.19.2 with PostgreSQL 16
- **Auth**: Passport.js + JWT
- **Testing**: Jest 30 + supertest
- **Package Manager**: pnpm

## Agent Configuration Files

No agent configuration files found (AGENTS.md, CLAUDE.md, .cursorrules, GEMINI.md, copilot-instructions.md).

## SDD Status

- **Mode**: engram
- **Persistence**: Engram (persistent memory across sessions)
- **Openspec**: Not created (engram mode)
