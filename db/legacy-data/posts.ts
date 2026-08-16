import { Post } from "../../lib/types";

// Placeholder content — same role as the other files in db/legacy-data/:
// stand-in data until the Supabase/Drizzle `posts` table is wired up and
// seeded (see db/seed.ts). Structure mirrors the `posts` schema exactly.
export const posts: Post[] = [
  {
    id: "clox-bytecode-vm",
    type: "learning-log",
    slug: "building-clox-bytecode-vm",
    title: "Building clox: a bytecode VM in C",
    excerpt:
      "Working through Crafting Interpreters' second half — a stack-based bytecode VM in C, after finishing the tree-walking jlox interpreter.",
    contentMarkdown: `Picked up **Crafting Interpreters** again, now working through *clox* — the bytecode virtual machine in C.

After jlox (the tree-walking interpreter in Java), this is a different kind of hard: manual memory management, a hand-rolled stack, and a single-pass compiler emitting bytecode directly instead of building an AST first.

## What's working so far
- Chunk/OpCode disassembler for debugging bytecode output
- A stack-based VM loop for arithmetic expressions
- Pratt parsing for expression precedence

## Next up
- Global variables and the hash table implementation
- Closures and upvalues — the part everyone says is the hardest

Mostly documenting this as I go so future-me (or anyone else working through the book) has something to compare notes against.`,
    tags: ["C", "Interpreters", "Crafting Interpreters", "VMs"],
    publishedAt: "2026-07-20",
  },
  {
    id: "jlox-tree-walker",
    type: "learning-log",
    slug: "jlox-tree-walking-interpreter",
    title: "jlox: a tree-walking interpreter in Java",
    excerpt:
      "Notes from building the first half of Crafting Interpreters — a full tree-walking interpreter for the Lox language in Java.",
    contentMarkdown: `First pass through **Crafting Interpreters**: jlox, a tree-walking interpreter for the Lox language, written in Java.

Covered scanning, recursive-descent parsing, an AST, and a tree-walking evaluator with proper lexical scoping, closures, and classes with inheritance.

The part that clicked the most was implementing closures via environment chains — seeing *why* a closure needs to capture its defining environment rather than just its variables, by working through cases where it breaks otherwise.

Now moving on to clox, the bytecode VM version of the same language, in C.`,
    tags: ["Java", "Interpreters", "Crafting Interpreters"],
    publishedAt: "2026-06-02",
  },
  {
    id: "stm32-bare-metal-blinky",
    type: "learning-log",
    slug: "stm32-bare-metal-first-steps",
    title: "STM32: bare-metal first steps, no HAL",
    excerpt:
      "Skipping the STM32 HAL to learn the registers directly — clocks, GPIO, and a blinking LED with no abstraction layer.",
    contentMarkdown: `Started learning STM32 bare-metal — deliberately skipping ST's HAL library at first to actually understand what's happening at the register level.

Got a blinking LED going by directly manipulating RCC (clock enable), GPIO mode registers, and ODR — no abstraction, just the reference manual and a linker script.

Next: SysTick for timing, then UART for a serial console so I'm not just guessing at what the chip is doing.`,
    tags: ["STM32", "Embedded", "Bare Metal", "ARM"],
    publishedAt: "2026-08-10",
  },
  {
    id: "why-carbon-design-portfolio",
    type: "blog",
    slug: "rebuilding-my-portfolio-on-carbon-design",
    title: "Rebuilding my portfolio: Next.js, Supabase, and Carbon Design",
    excerpt:
      "Notes on migrating this site from a static Create React App to a full Next.js + Supabase application themed on IBM's Carbon Design System.",
    contentMarkdown: `Migrated this site from a static Create React App build to a full Next.js application backed by Supabase — partly to make it actually maintainable (blog posts and experience entries editable from an admin panel instead of hand-edited data files), and partly as an excuse to apply Carbon Design System tokens properly.

## Stack
- Next.js 15 (App Router), Drizzle ORM, Supabase Postgres/Auth/Storage
- Server Actions instead of tRPC — single consumer, didn't need the extra layer
- Carbon's actual color/spacing/type tokens, wired as theme-aware CSS variables for light and dark mode

More write-ups on the specific pieces (the admin panel, the theming system) coming as they're built.`,
    tags: ["Next.js", "Carbon Design", "Supabase", "Meta"],
    publishedAt: "2026-08-16",
  },
];

export const getPostsByType = (type: Post["type"]): Post[] =>
  posts
    .filter((p) => p.type === type)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

export const getPostBySlug = (slug: string): Post | undefined =>
  posts.find((p) => p.slug === slug);
