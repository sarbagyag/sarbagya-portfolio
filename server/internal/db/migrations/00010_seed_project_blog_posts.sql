-- Turns the 9 projects seeded in 00009 into blog posts as well, so each one
-- also shows up on /blog and not only on /projects. These are written fresh
-- as first person narrative posts rather than reusing the project card
-- copy verbatim. id is left out so Postgres assigns it via the table's
-- gen_random_uuid() default; ON CONFLICT targets the slug's unique
-- constraint instead, so this stays safe to leave in place if these posts
-- get edited later via /admin.
--
-- Three posts (esp32-gesture-robot-car, async-job-board,
-- einding-productivity-pwa) are marked below as sourced from informal
-- working notes rather than the resume, matching the same confidence flag
-- used in 00009 for the underlying project. published_at dates for those
-- three are best guesses and should be corrected via /admin once the real
-- dates are confirmed.
--
-- +goose Up
INSERT INTO public.posts (type, slug, title, excerpt, content_markdown, cover_image_url, tags, status, published_at, created_at, updated_at) VALUES
('blog', 'narration-ai-nepali-tts', 'Teaching a Computer to Read the News in Nepali', 'How my final year team built a Nepali text to speech system that reads web news aloud, and what nineteen listeners told us about how natural it actually sounded.', 'For my final year project at IOE Pulchowk Campus, my teammates Mausam Kumar Sah, Rohit Joshi, Yugal Pariyar and I decided to tackle a problem that felt almost embarrassingly overlooked. Nepali is spoken by tens of millions of people, and yet there was almost no natural sounding speech synthesis built for it. Under the supervision of Dr. Arun Kumar Timalsina, and in collaboration with Prixa Technologies, we set out to change that.

## Where We Started

The idea itself was simple to explain: a browser extension that scrapes Nepali text from a news website and reads it aloud as you browse. What sat behind that simple idea was a full speech pipeline. We trained a Tacotron2 model to turn text into a spectrogram, then paired it with a DeepGAN vocoder to turn that spectrogram into sound a person could actually listen to.

## Building a Voice From Almost Nothing

Data turned out to be the hardest part of the whole project. Good Nepali speech datasets are rare, so we combined the OpenSLR Nepali dataset with our own recordings, close to two thousand sentences that we read aloud and captured ourselves. We pretrained the model on that combined set and then fine tuned it toward a single target voice, hoping the final result would sound like a person rather than a machine reading off a script.

## Did It Actually Work

We ran a blind listening test with nineteen volunteers who had no idea how the audio was generated. They rated its naturalness at 3.91 out of 5, which is a genuinely encouraging number for a language with this little existing speech data to build on. It is not going to fool anyone into thinking a human is speaking, but it gets close enough to be genuinely useful, and closing that gap was the whole point.', NULL, '{"AI","Text to Speech","Nepali","Major Project"}', 'published', '2025-04-18 10:00:00+05:45', now(), now())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.posts (type, slug, title, excerpt, content_markdown, cover_image_url, tags, status, published_at, created_at, updated_at) VALUES
('blog', 'zorbaos-kernel', 'Building zorbaOS, a 32 Bit Operating System Kernel From Scratch', 'Writing a bootloader, a memory manager and a file system by hand, because the only way to really understand an operating system is to build one.', 'zorbaOS started from a simple question that would not leave me alone: what actually happens between pressing the power button and seeing a command prompt appear. Every layer of an operating system usually sits hidden underneath something else you already trust, so I decided the only honest way to understand it was to write every one of those layers myself.

## Getting Into Protected Mode

The first real milestone was writing a custom bootloader in assembly. It has to handle real mode initialization and then carry out the transition into 32 bit Protected Mode, which means building the Global Descriptor Table and Interrupt Descriptor Table by hand rather than relying on anything the processor gives you for free.

## Memory, Files and Multitasking

Once the kernel had a foothold in Protected Mode, I built page based virtual memory on top of it, along with a custom heap allocator so processes could be isolated from one another properly. On top of that sits a virtual file system loosely inspired by Linux, backed by a FAT16 driver, plus a scheduler that can preempt running tasks and an ELF loader capable of running user space programs across Ring 0 and Ring 3.

## Making It Feel Real

None of this matters much if it stays purely theoretical, so I wired up keyboard and PIC interrupt drivers and built an interactive command line shell on top of everything else. Typing a command and watching the kernel actually respond to it, after months of work that mostly lived in a debugger, is still the most satisfying moment this project has given me so far. There is still plenty left to build, but zorbaOS already feels like a real, if small, operating system rather than an exercise.', NULL, '{"Operating Systems","x86","C","Systems Programming"}', 'published', '2026-08-15 10:00:00+05:45', now(), now())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.posts (type, slug, title, excerpt, content_markdown, cover_image_url, tags, status, published_at, created_at, updated_at) VALUES
('blog', 'gholang-bytecode-vm', 'Building ghoLang, My Own Bytecode Virtual Machine', 'Writing a parser, a compiler and a garbage collector in C, and coming away with a much deeper respect for the languages we normally take for granted.', 'ghoLang began as an attempt to stop treating programming languages as black boxes. I wanted to understand, in detail, what actually happens between typing a line of code and watching it run, so I built the entire runtime in C from the ground up.

## From Text to Bytecode

Source code first passes through a hand written parser that I built using Pratt parsing, a single pass approach that handles operator precedence without needing any external parser generator. That parser compiles source directly into dense bytecode chunks, which then run on a stack based virtual machine complete with its own call frames and a constant pool for literals.

## Making It Fast and Making It Remember

Two details ended up mattering more than I expected. The first is string handling: every string gets interned and compared using bitwise hashing, which turns what would normally be a slow operation into something close to constant time. The second is memory. I wrote a tri color mark and sweep garbage collector with a heap that grows on its own as the program needs more room, so ghoLang programs do not have to think about memory management at all.

## Closures, Classes and What Came After

The language supports first class closures in the style of Lua, where functions can capture and carry variables from the scope they were defined in, along with a class system that supports single inheritance and dispatches methods in constant time. Since reaching that point, I have kept expanding the runtime with string interpolation, iterable hash maps and proper module resolution. ghoLang is still very much a work in progress, and that is exactly why I keep coming back to it.', NULL, '{"Programming Languages","Virtual Machines","C","Compilers"}', 'published', '2026-08-20 10:00:00+05:45', now(), now())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.posts (type, slug, title, excerpt, content_markdown, cover_image_url, tags, status, published_at, created_at, updated_at) VALUES
('blog', 'stm32-self-balancing-robot', 'Building a Self Balancing Robot With an STM32', 'Fusing sensor data with a complementary filter and slowly working toward a proper PID loop that can keep a small robot standing upright on its own.', 'This project marked my first serious attempt at embedded firmware, and I chose something with an immediate, physical payoff: a robot that has to balance on two wheels using nothing but its own sensors and a microcontroller.

## Talking Directly to the Hardware

I wrote everything in bare metal C for an STM32 microcontroller built around an ARM Cortex M core, using both the HAL and Low Layer drivers depending on how much direct control I needed over a given peripheral. That level of access matters here, because balancing a robot is fundamentally a timing problem, and timing problems do not forgive sloppy code.

## Learning to Trust Noisy Sensors

An MPU6050 sensor gives raw accelerometer and gyroscope readings over I2C, but neither signal is trustworthy on its own. The accelerometer is noisy in the short term, while the gyroscope drifts over time. I implemented a real time complementary filter that blends the two together, leaning on the gyroscope for fast changes and the accelerometer to correct long term drift, which produces a single stable estimate of the robot''s tilt angle.

## Closing the Loop

Motor control runs through hardware PWM timers, with UART over USB CDC streaming live telemetry back to my laptop so I can actually see what the robot thinks its own angle is while it moves. Right now I am in the middle of the final piece: wiring in an L298N motor driver and tuning a discrete PID controller so the robot can hold itself upright without me catching it every few seconds. It is not fully balancing on its own yet, but it is close, and that gap between almost and actually working has taught me more about control systems than any textbook did.', NULL, '{"Embedded Systems","STM32","Robotics","Firmware"}', 'published', '2026-09-10 10:00:00+05:45', now(), now())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.posts (type, slug, title, excerpt, content_markdown, cover_image_url, tags, status, published_at, created_at, updated_at) VALUES
('blog', 'zorlang-interpreter', 'Writing zorLang, a Tree Walk Interpreter in Java', 'Working through recursive descent parsing, lexical scoping and the visitor pattern to build a small language that runs entirely inside Java.', 'Before I tried building a virtual machine in C, I wanted to understand interpreters in their simplest form, so I built zorLang as a tree walk interpreter in Java. The goal was never speed. The goal was clarity, and Java''s structure made that easier to reason about while I was still learning how all the pieces fit together.

## Parsing Into a Tree

I wrote a recursive descent parser by hand that scans and tokenizes source code before building it into a strongly typed abstract syntax tree. From there, the interpreter walks that tree using the visitor pattern, where each node type routes to its own evaluation method. Keeping tree traversal separate from the logic that actually evaluates each node made the whole system far easier to extend later without breaking anything that already worked.

## Scope, Blocks and Objects

Variables live inside a hierarchical environment structure, so nested blocks, dynamic typing and closures all fall out of the same underlying scoping model rather than needing separate special cases. Control flow constructs like if, else, while and for all plug into this same structure. On top of that sits a proper object oriented runtime, complete with constructors, instance properties and dynamic method binding, backed by error reporting detailed enough that I could actually debug my own test programs.

## What It Taught Me

zorLang will probably never be fast, and that was never the point. What it gave me instead was an intuition for how languages actually work underneath their syntax, an intuition that made every later project, from ghoLang onward, feel far less mysterious than it would have otherwise.', NULL, '{"Programming Languages","Java","Interpreters","Compilers"}', 'published', '2026-07-15 10:00:00+05:45', now(), now())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.posts (type, slug, title, excerpt, content_markdown, cover_image_url, tags, status, published_at, created_at, updated_at) VALUES
('blog', 'tda2030-active-amplifier', 'Designing a 2.1 Channel Amplifier With the TDA2030', 'Taking an amplifier from schematic to a finished, hand soldered board, and learning analog filter theory along the way because the circuit demanded it.', 'I built this amplifier mainly as an excuse to learn two things properly: printed circuit board design and analog filter theory. Reading about both in isolation only gets you so far, so I decided to design, build and solder an actual working amplifier rather than leave the knowledge purely theoretical.

## Three Amplifiers and a Crossover

The design uses three TDA2030 power amplifier stages, split by a second order Sallen Key Butterworth active crossover set at 120 hertz that sends the right frequencies to the satellite speakers and the rest down to the subwoofer. Getting that crossover point right meant actually working through the filter math rather than copying values from a reference design and hoping for the best.

## Power, Heat and a Few Small Improvements

Power comes from a full wave split supply built around a center tapped transformer, with local decoupling and a shared heatsink to keep everything at a reasonable temperature under load. I did the schematic capture and board layout myself in KiCad, then added volume and bass trim potentiometers as a practical improvement over the base reference design, since being able to adjust the sound after the fact felt worth the extra components.

## Where the Filter Math Goes Next

One detail I am particularly glad I took the time to work through is using the crossover''s transfer functions and bilinear transforms to model the equivalent digital IIR biquad filters. That gives me a clear bridge toward eventually porting the same crossover logic onto a microcontroller, so the next version of this project could replace analog filtering with digital signal processing entirely.', NULL, '{"Electronics","PCB Design","Analog Filters","Hardware"}', 'published', '2026-09-20 10:00:00+05:45', now(), now())
ON CONFLICT (slug) DO NOTHING;

-- confidence: medium, sourced from informal working notes rather than the resume; verify the published date once the real timeline is confirmed
INSERT INTO public.posts (type, slug, title, excerpt, content_markdown, cover_image_url, tags, status, published_at, created_at, updated_at) VALUES
('blog', 'esp32-gesture-robot-car', 'Building a Gesture Controlled Robot Car With the ESP32', 'Pairing a handheld gyroscope remote with a small four wheel car over a wireless link, so tilting your wrist is enough to drive it.', 'This one started as a fun weekend project and ended up teaching me more about wireless communication than I expected going in. The idea was straightforward: build a handheld remote that reads how you tilt your wrist and use that to drive a small robot car without a single wire connecting the two.

## The Remote and the Car

Both the remote and the car itself run on ESP32 boards. The remote reads tilt data from an MPU6050 gyroscope and streams it over ESP NOW, a lightweight wireless protocol that avoids the overhead of setting up a full network connection just to send a handful of numbers many times a second. On the receiving end, the car unit translates that tilt data directly into motor commands.

## Four Wheels and a Battery

The car itself is a simple four wheel build, with four TT gear motors wired in left and right pairs on a plywood chassis, powered by two 18650 lithium ion cells with onboard USB charging and a slide switch so I do not have to unplug a battery every time I want to turn it off.

## Why ESP IDF Instead of Arduino

I chose to build this on ESP IDF and FreeRTOS rather than the more familiar Arduino framework, mainly because I wanted gesture sensing and the wireless link to run as genuinely separate tasks rather than fighting each other inside a single loop. It made the whole project slightly harder to set up, but the car responds noticeably faster to a flick of the wrist, and that responsiveness was really the entire point of building it this way.', NULL, '{"ESP32","Robotics","Embedded Systems","Wireless"}', 'published', '2026-02-10 10:00:00+05:45', now(), now())
ON CONFLICT (slug) DO NOTHING;

-- confidence: medium, sourced from informal working notes rather than the resume; framed as an ongoing learning exercise, verify the published date and current status once confirmed
INSERT INTO public.posts (type, slug, title, excerpt, content_markdown, cover_image_url, tags, status, published_at, created_at, updated_at) VALUES
('blog', 'async-job-board', 'Building an Async Job Board From Scratch', 'Writing a Go backend and a plain TypeScript frontend by hand, with no frameworks, purely to get better at both languages.', 'I built this job board mostly as a deliberate exercise rather than as a product I needed. I wanted to get properly comfortable with Go and TypeScript, and the fastest way I know to learn a language is to write real, working software in it without leaning on a framework to hide the parts I actually needed to understand.

## A Backend Built Around a Worker Pool

The backend is written in Go and centers on a worker pool that handles background jobs, the kind of task that would otherwise block a request while it runs. It talks to PostgreSQL directly through pgx rather than going through an ORM, which meant writing my own queries by hand, but also meant I always knew exactly what was happening at the database level.

## A Frontend With No Framework

The frontend is where I pushed myself the hardest. Instead of reaching for React or any similar library, I structured everything in TypeScript around plain object oriented classes: an ApiClient that handles network calls, a JobStore that holds application state, a JobPoller that keeps data fresh in real time, and a set of abstract View classes that handle rendering. Every line of it was typed out by hand in Neovim, with no scaffolding tool doing any of the thinking for me.

## What I Took Away From It

There is still work left before I would call this finished, but it has already done what I built it for. Writing the state management and rendering logic myself, instead of letting a framework handle it, gave me a much clearer picture of what frameworks are actually doing under the surface, and made me appreciate the problems they solve rather than just assuming they were necessary.', NULL, '{"Go","TypeScript","Backend","Learning Project"}', 'published', '2026-05-01 10:00:00+05:45', now(), now())
ON CONFLICT (slug) DO NOTHING;

-- confidence: medium, sourced from a brief working note mention only; verify scope, status and the published date once confirmed
INSERT INTO public.posts (type, slug, title, excerpt, content_markdown, cover_image_url, tags, status, published_at, created_at, updated_at) VALUES
('blog', 'einding-productivity-pwa', 'Building Einding, a Productivity Progressive Web App', 'Pairing a React and Vite frontend with a Go backend, then hosting the whole thing myself on a personal VPS instead of handing it off to someone else''s platform.', 'Einding grew out of wanting a productivity tool that worked exactly the way I think, rather than adapting my habits to fit whatever an existing app assumed about how people organize their time. Building it myself also meant I could own every part of the stack, from the interface down to the server it runs on.

## Frontend and Backend

The frontend is built with React and Vite, which keeps the development loop fast enough that small changes do not feel like a chore to test. Behind it sits a backend written in Go, handling the actual logic and data that the interface depends on.

## Making It Feel Like a Real App

Because it is built as a progressive web app, Einding can be installed directly onto a phone or laptop and used offline, without needing an app store or a constant connection to function. That was a deliberate choice. A productivity tool that stops working the moment your connection drops is not much of a productivity tool at all.

## Hosting It Myself

Rather than deploying it onto someone else''s managed platform, I run Einding on my own VPS. It is more work upfront, and I am the one who gets paged if something goes wrong at three in the morning, but it also means I understand the entire path a request takes, from the browser all the way down to the server handling it, and that kind of end to end ownership is exactly what I wanted out of this project.', NULL, '{"React","Go","PWA","Web Development"}', 'published', '2026-01-20 10:00:00+05:45', now(), now())
ON CONFLICT (slug) DO NOTHING;

-- +goose Down
DELETE FROM public.posts WHERE slug IN (
  'narration-ai-nepali-tts',
  'zorbaos-kernel',
  'gholang-bytecode-vm',
  'stm32-self-balancing-robot',
  'zorlang-interpreter',
  'tda2030-active-amplifier',
  'esp32-gesture-robot-car',
  'async-job-board',
  'einding-productivity-pwa'
);
