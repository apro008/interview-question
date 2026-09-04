/* 180 concise interview summaries */
const HANDBOOK = [];
const add = (category, entries) => entries.forEach(([question, summary]) => HANDBOOK.push({ id: HANDBOOK.length + 1, category, question, summary }));

add('JavaScript', [
['What is the difference between var, let, and const?', '`var` is function-scoped and hoisted with `undefined`; `let` and `const` are block-scoped and live in the temporal dead zone. Use `const` by default, `let` for reassignment, and avoid `var`.'],
['Explain hoisting.', 'Declarations are processed before execution. Function declarations are fully available; `var` is initialized as `undefined`; `let` and `const` exist but cannot be used before their declaration.'],
['What is a closure?', 'A closure is a function plus access to its lexical environment after the outer function returns. It enables private state, factories, memoization, and callbacks.'],
['How does the event loop work?', 'JavaScript runs synchronous work on the call stack, drains all microtasks such as Promise callbacks when the stack clears, then takes a macrotask such as a timer or event before repeating.'],
['Microtasks vs macrotasks?', 'Microtasks (`Promise.then`, `queueMicrotask`) run to completion before rendering and the next task; macrotasks include timers, I/O, and events. Too many microtasks can starve rendering.'],
['Why were arrow functions introduced?', 'They provide concise syntax and lexical `this`. They do not have their own `this`, `arguments`, or constructor behavior, so use normal functions when dynamic `this` or `new` is required.'],
['What is the difference between == and ===?', '`===` compares type and value without coercion and should be the default. `==` coerces values using rules that are easy to misread.'],
['Explain this in JavaScript.', '`this` is decided by the call site for normal functions: method receiver, explicit `call/apply/bind`, constructor, or global/undefined. Arrow functions capture surrounding `this`.'],
['What are call, apply, and bind?', '`call` invokes with a chosen `this` and arguments; `apply` takes an argument array; `bind` returns a new permanently bound function.'],
['What is prototypal inheritance?', 'Objects delegate property lookup through their prototype chain. Classes are syntax over prototypes; shared methods usually live on the prototype rather than each instance.'],
['What is the difference between shallow and deep copy?', 'A shallow copy duplicates only the outer container and retains nested references. A deep copy duplicates nested data; use `structuredClone` when its supported types fit your data.'],
['Explain debounce and throttle.', 'Debounce waits until calls stop, useful for search input. Throttle permits at most one call per interval, useful for scroll or resize events.'],
['What are Promises?', 'A Promise represents one eventual result: pending, fulfilled, or rejected. Chain with `then/catch/finally`, and always return or await it so errors flow predictably.'],
['async/await vs Promises?', '`async/await` is syntax over Promises that makes sequential asynchronous code readable. Use `Promise.all` for independent work; handle failures deliberately with `try/catch` or `allSettled`.'],
['What is optional chaining and nullish coalescing?', '`?.` stops safely only for `null` or `undefined`; `??` supplies a fallback only for those values, preserving meaningful falsy values like `0` and `false`.']
]);
add('TypeScript', [
['any vs unknown vs never?', '`any` disables checking; `unknown` requires narrowing before use; `never` represents an impossible value or a function that never returns. Prefer `unknown` at untrusted boundaries.'],
['interface vs type?', 'Both describe shapes. Interfaces are extendable and declaration-mergeable; type aliases also express unions, intersections, tuples, and mapped types. Choose the clearest fit and stay consistent.'],
['What is type narrowing?', 'TypeScript refines a broad type using runtime checks such as `typeof`, `in`, equality, discriminant tags, or custom type guards before allowing specialized operations.'],
['What are generics?', 'Generics parameterize types so a function or component preserves relationships between inputs and outputs without losing safety, for example `function first<T>(items:T[]):T|undefined`.'],
['What is a union type?', 'A union means a value may be one of several types. Narrow it before using type-specific properties; discriminated unions make this safe and exhaustive.'],
['What is an intersection type?', 'An intersection combines required members of multiple types. It is useful for composing object capabilities, but incompatible overlapping fields can become `never`.'],
['What does readonly do?', '`readonly` prevents assignment through that TypeScript reference; it is compile-time only and is shallow unless applied recursively.'],
['What are utility types?', 'Built-ins such as `Partial`, `Pick`, `Omit`, `Record`, `Required`, and `ReturnType` derive related types and reduce duplicated model definitions.'],
['What is a mapped type?', 'A mapped type transforms each key in another type, such as making every property optional or readonly. It is a type-level loop over keys.'],
['What is a conditional type?', 'A conditional type chooses a type based on assignability, written `T extends U ? X : Y`. It powers utilities such as `Exclude` and `Extract`.'],
['What are type guards?', 'A type guard is runtime evidence used by TypeScript to narrow a value. A reusable guard returns `value is SomeType` and should validate the properties it claims.'],
['What is as const?', '`as const` preserves literal values and marks object/array members readonly, making it useful for action constants, configuration, and discriminated unions.'],
['What is the difference between enum and union literals?', 'String literal unions are lightweight, tree-shakable, and work naturally with JSON. Enums emit runtime code unless `const enum`; use unions unless enum semantics add real value.'],
['Why avoid non-null assertions?', '`value!` suppresses a potentially useful safety check and can create runtime failures. Narrow explicitly or model the state so absence is handled.'],
['What is strict mode in TypeScript?', '`strict` enables a family of checks, especially strict null checking, that catch real defects early. New code should enable it and migrations should steadily move toward it.']
]);
add('React', [
['What causes a React component to re-render?', 'A component re-renders when its state changes, its parent renders, its consumed context changes, or an external store signals an update. React may skip work when values are unchanged.'],
['Explain useState.', '`useState` stores local state across renders. Setters schedule an update; use functional updates when the next value depends on the previous value.'],
['Explain useEffect.', '`useEffect` synchronizes React with external systems after paint: subscriptions, timers, network work, or DOM APIs. Return cleanup and declare every reactive dependency.'],
['useEffect vs useLayoutEffect?', '`useEffect` runs after paint and is preferred. `useLayoutEffect` runs before paint for measuring or synchronously adjusting layout, and can block visual updates.'],
['What is useRef for?', '`useRef` holds a stable mutable container or imperative node reference without triggering a render. It is not a replacement for UI state.'],
['What is useMemo?', '`useMemo` caches a calculated value between renders when dependencies are unchanged. Use it after profiling for expensive work or referential stability, not as a default.'],
['What is useCallback?', '`useCallback` caches a function identity. It helps only when identity matters, such as a memoized child or hook dependency; it does not avoid executing the function.'],
['What is React.memo?', '`React.memo` skips a function component render when its props are shallowly equal. It helps for expensive, frequently rendered children with stable props.'],
['What is useReducer?', '`useReducer` centralizes state transitions in a pure reducer. It is useful for related state, explicit actions, and testable transition logic.'],
['What is Context and when should you use it?', 'Context distributes stable, broadly needed values such as theme, locale, or authenticated user. Frequently changing context can re-render many consumers, so split contexts or use a store.'],
['What are controlled components?', 'A controlled input receives its displayed value from React state and notifies changes through handlers. This gives validation and a single source of truth.'],
['Why are keys important in lists?', 'Keys give React stable identity for reconciliation. Use durable item IDs, not array indices for changing lists, or state can move to the wrong item.'],
['What are custom hooks?', 'Custom hooks package reusable stateful behavior by composing hooks. They share logic, not state: each calling component receives its own hook instance.'],
['What is error boundary?', 'An error boundary catches rendering errors below it and shows fallback UI. It does not catch event-handler, async, server-render, or its own errors without additional handling.'],
['What is reconciliation?', 'Reconciliation compares the previous and next element trees to decide what to update. Type changes remount subtrees; stable keys preserve identity among siblings.']
]);
add('React Native Core', [
['How is React Native different from React for web?', 'React Native uses React for declarative state but renders native platform views rather than HTML/CSS. Layout uses Yoga/Flexbox and native integrations require platform-aware design.'],
['Explain the React Native new architecture.', 'The new architecture uses JSI-based direct native interop, Fabric for rendering, and TurboModules for lazy typed modules, reducing serialization and enabling more concurrent capabilities.'],
['What was the legacy bridge?', 'The legacy bridge serialized asynchronous JSON messages between JS and native threads. It added overhead and made synchronous, high-frequency interop difficult.'],
['What is JSI?', 'JavaScript Interface is a C++ API that lets JavaScript runtimes expose native objects and functions directly, avoiding the old serialized bridge for supported integrations.'],
['What is Fabric?', 'Fabric is React Native’s newer rendering system. It improves coordination between React and native UI, supports modern React features, and uses a more efficient rendering pipeline.'],
['What are TurboModules?', 'TurboModules are lazily loaded native modules accessed through modern interop. They reduce startup cost and can use typed code generation.'],
['What is Hermes?', 'Hermes is a JavaScript engine optimized for React Native, generally improving startup, memory use, and bundle handling. Validate performance on the target devices.'],
['What is Metro?', 'Metro is the React Native bundler. It resolves modules, transforms JavaScript/TypeScript, serves development bundles, and produces production bundles.'],
['How does React Native layout work?', 'Yoga calculates Flexbox-style layout cross-platform. Dimensions are density-independent pixels; test real devices because text, insets, and platform widgets vary.'],
['What is the difference between View, ScrollView, and FlatList?', '`View` is a basic container. `ScrollView` renders all children and suits small content. `FlatList` virtualizes large lists and should be the default for long datasets.'],
['How do you manage platform-specific code?', 'Use platform APIs such as `Platform.select`, platform file extensions, or small native abstractions. Keep shared behavior together and isolate necessary differences.'],
['What is SafeAreaView?', 'Safe-area handling keeps content clear of notches, status bars, and home indicators. Use a maintained safe-area provider where nested and dynamic insets matter.'],
['How do deep links work?', 'Associate URL schemes or universal/app links with the app, parse the incoming URL, and map it to navigation state. Support both cold starts and links received while running.'],
['How do push notifications work?', 'A provider sends through APNs/FCM; the app registers for permission and a device token, then handles foreground, background, and tapped-notification navigation separately.'],
['What are native modules?', 'Native modules expose platform capabilities not covered by JavaScript APIs. Prefer maintained libraries, define a narrow contract, and handle platform permissions and lifecycle carefully.']
]);
add('React Native Advanced', [
['What threads are involved in React Native?', 'JS runs application logic; the UI/main thread handles native drawing and input; native background threads handle platform work. Avoid blocking JS or UI with expensive work.'],
['How does Reanimated improve animations?', 'Reanimated can run animation work on the UI thread via worklets, keeping gestures and transitions smooth even when the JS thread is busy.'],
['When would you use Skia?', 'Use Skia for custom, graphics-heavy drawing such as charts, effects, games, or image processing where ordinary native views are too limiting.'],
['What is code generation in React Native?', 'Codegen generates typed bindings from a module or component spec for the new architecture, reducing manual glue and contract mismatches.'],
['How do you handle app lifecycle?', 'Listen for AppState changes to pause work, refresh safely on foreground, protect sensitive screens on background, and avoid treating lifecycle as a reliable persistence trigger alone.'],
['How do you implement offline-first?', 'Read from local storage first, queue mutations, sync with idempotent server APIs, resolve conflicts explicitly, and clearly show stale, syncing, and failed states.'],
['MMKV vs AsyncStorage vs SQLite?', 'MMKV is fast key-value storage for small values; AsyncStorage is simple asynchronous key-value storage; SQLite suits relational, queryable, transactional data. Choose by access pattern.'],
['When use WatermelonDB?', 'WatermelonDB is suited to large offline datasets requiring lazy loading and synchronization. Its added model and sync complexity is not justified for small preference data.'],
['How do you manage images?', 'Serve correctly sized, cached images; reserve layout space; use thumbnails for lists; avoid decoding giant originals; and inspect memory on low-end devices.'],
['How do you handle permissions?', 'Request only at the moment of user benefit, explain why first, handle denial and “never ask again,” and provide a route to system settings.'],
['How do you support accessibility?', 'Set meaningful labels, roles, hints, focus order, touch targets, dynamic text support, contrast, and test VoiceOver/TalkBack on real devices.'],
['How do you reduce app startup time?', 'Profile first, defer noncritical initialization, lazy-load screens/modules, minimize synchronous JS and native initialization, shrink assets, and use Hermes where appropriate.'],
['How do you update an app over the air?', 'OTA updates can deliver compatible JavaScript and assets quickly, but never bypass native review for native changes. Use rollouts, version compatibility checks, and rollback capability.'],
['How do you handle crashes?', 'Capture symbolicated native and JavaScript errors with context, protect privacy, alert on regressions, and prioritize crashes by affected users and severity.'],
['What makes a good native integration?', 'A good integration has a small stable JS API, typed contracts, lifecycle-safe resource handling, clear threading, platform parity where sensible, and automated tests.']
]);
add('State Management', [
['When should state be local?', 'Keep state as close as possible to where it is used. Local state reduces coupling and avoids global updates for transient UI details such as an open sheet or input text.'],
['What state belongs on the server?', 'Remote data is a cache of server state, not ordinary client state. Use a query/cache layer for fetching, invalidation, retries, pagination, and optimistic updates.'],
['Redux vs Context?', 'Context is a dependency-distribution mechanism and fits stable global values. Redux-style stores provide structured updates, tooling, selectors, and predictable behavior for complex shared client state.'],
['What is Redux middleware?', 'Middleware intercepts dispatch to add cross-cutting behavior such as async work, logging, analytics, or error reporting while reducers remain pure.'],
['What is an immutable update?', 'An immutable update creates new references for changed paths instead of mutating existing state. This makes changes predictable and allows shallow equality optimizations.'],
['What is normalized state?', 'Normalized state stores entities once by ID and references them elsewhere. It prevents duplicated data, makes updates simpler, and works well for relational API responses.'],
['What are selectors?', 'Selectors derive the exact data a consumer needs from state. Memoized selectors avoid recalculating expensive derived data and reduce unnecessary subscriptions.'],
['What is optimistic UI?', 'Optimistic UI updates locally before a server confirmation to feel fast. It needs a rollback strategy, idempotent mutations, and clear handling for conflict or failure.'],
['How do you avoid prop drilling?', 'First colocate state. For genuinely shared dependencies use composition, Context, or a focused store; avoid making everything global merely to shorten props.'],
['What is a state machine?', 'A state machine defines valid states, events, and transitions explicitly. It prevents impossible combinations and is valuable for flows like login, checkout, or uploads.'],
['How do you persist client state?', 'Persist only durable, non-sensitive data with versioned migrations. Rehydrate predictably, tolerate missing/old data, and never rely on persistence as authorization.'],
['What causes stale closures in state code?', 'A callback captures values from the render in which it was created. Use correct dependencies, functional updates, refs for imperative latest values, or a store API when appropriate.'],
['How should forms be modeled?', 'Track field values, touched state, validation, submission status, and server errors separately. Validate at helpful moments and keep expensive validation out of every keystroke.'],
['How do you handle cache invalidation?', 'Invalidate or update the smallest relevant query after a mutation, use stable query keys, and decide freshness rules per data type. Avoid broad refetches that cause flicker.'],
['What is single source of truth?', 'Each fact should have one authoritative owner. Derived values should be computed from it rather than stored separately, preventing drift and synchronization bugs.']
]);
add('Architecture & Design', [
['What is Clean Architecture?', 'Clean Architecture separates business rules from frameworks, UI, and data sources. Dependencies point inward so core use cases are testable and infrastructure can be replaced.'],
['What is MVVM?', 'Model-View-ViewModel keeps the view focused on rendering, while a ViewModel exposes presentation state and actions. In React, hooks or view-model layers can play this role.'],
['What is dependency injection?', 'Dependency injection supplies dependencies from outside rather than constructing them internally. It improves testability and makes environment-specific implementations explicit.'],
['What is repository pattern?', 'A repository exposes domain-friendly data operations while hiding whether data comes from HTTP, cache, database, or a combination. Do not add it if it only forwards calls.'],
['How do you design an API client?', 'Centralize base configuration, auth, timeouts, parsing, typed errors, retry policy, observability, and cancellation. Keep endpoint-specific mapping near its feature.'],
['How do you design a scalable feature folder?', 'Group code by feature with its UI, state, tests, and API mapping together; put genuinely shared primitives in common layers. Avoid one giant global components folder.'],
['What are SOLID principles?', 'SOLID encourages focused responsibilities, extension without unsafe modification, substitutable abstractions, small interfaces, and depending on abstractions rather than concrete details.'],
['What is separation of concerns?', 'Separate responsibilities that change for different reasons, such as rendering, business rules, data access, and navigation. It improves reasoning, testing, and safe change.'],
['How do you choose an abstraction?', 'Create an abstraction when there are multiple real use cases with stable common behavior. Premature abstractions hide differences and make future changes harder.'],
['What is a BFF?', 'A backend-for-frontend is a backend layer tailored to a client’s needs. It can aggregate data and simplify clients, but adds ownership and operational cost.'],
['How do you handle versioned APIs?', 'Make contracts backward compatible when possible, version deliberately, measure consumer adoption, deprecate with a timeline, and use tolerant parsing during transitions.'],
['What is idempotency?', 'An idempotent operation can be repeated with the same intended result. Use idempotency keys for retryable writes such as payments or queued offline mutations.'],
['What is eventual consistency?', 'Replicas or asynchronous processes may temporarily disagree. Design user experience for pending states, reconciliation, and clear freshness expectations rather than assuming instant consistency.'],
['How do you design an offline sync system?', 'Track local mutations with IDs and order, make server writes idempotent, pull changes by cursor, define conflict rules, retry with backoff, and surface unresolved failures.'],
['How do you evaluate an architectural decision?', 'State the context and constraints, compare alternatives with consequences, record the decision, and revisit it as scale, team needs, or evidence changes.']
]);
add('Performance', [
['How do you measure React Native performance?', 'Profile on representative physical devices: startup, JS/UI frame rate, renders, memory, network, and native traces. Optimize measured bottlenecks rather than guessing.'],
['How do you optimize FlatList?', 'Provide stable keys, memoize rows where useful, avoid inline churn, tune windowing, use `getItemLayout` for fixed heights, paginate, and keep row rendering cheap.'],
['Why avoid inline object and function props sometimes?', 'They create new references each render, defeating shallow memoization. This matters only at a proven hot boundary; readability wins elsewhere.'],
['How do you prevent unnecessary renders?', 'Colocate state, split contexts, subscribe to narrow slices, use stable props where valuable, memoize measured expensive children, and inspect with profiling tools.'],
['What is bundle size optimization?', 'Remove unused dependencies, tree-shake where supported, lazy-load noncritical code, avoid duplicated libraries, minimize large assets, and measure the release bundle.'],
['How do you optimize network requests?', 'Batch or parallelize independent requests, cache with sensible stale rules, paginate, cancel obsolete work, compress payloads, and avoid refetching on every screen focus.'],
['What is memory leak in React Native?', 'A leak retains objects no longer needed, often through timers, listeners, subscriptions, large image references, or native resources. Clean up effects and profile heap growth.'],
['How do you make animations smooth?', 'Animate transform and opacity when possible, move gesture/animation work off JS with appropriate tooling, avoid layout thrash, and test under JS load.'],
['What is time to interactive?', 'It is the time until a user can reliably interact with the app. Improve it by prioritizing the first useful screen and deferring work that is not needed for that interaction.'],
['How do you optimize image loading?', 'Request appropriate dimensions, cache, resize before display, use placeholders, prefetch likely next images, and release or virtualize images that leave the viewport.'],
['Why use pagination?', 'Pagination limits payload, memory, rendering, and perceived wait time. Use cursor pagination for data that changes frequently so inserts do not shift pages.'],
['What is virtualization?', 'Virtualization renders only visible list items plus a buffer. It is essential for large lists because creating every row consumes JS time, native views, and memory.'],
['How do you debug a slow screen?', 'Reproduce with production-like data, instrument timings, profile render and native work, isolate the biggest contributor, fix it, and remeasure against a budget.'],
['What performance budgets would you set?', 'Define measurable budgets for cold start, screen transition, scroll frame time, memory, bundle size, API latency, and crash-free users; enforce them in release checks.'],
['When is memoization harmful?', 'It adds complexity, memory, comparisons, and dependency-bug risk. Memoize only when profiling shows repeated expensive work or a meaningful identity-sensitive boundary.']
]);
add('Security', [
['Where should access tokens be stored?', 'Use platform secure storage such as Keychain/Keystore for sensitive tokens, minimize lifetime, protect refresh flows, and never assume local storage is a trust boundary.'],
['Why is HTTPS not enough?', 'TLS protects transport, but apps still need authentication, authorization, input validation, secure storage, logging hygiene, backend controls, and safe update practices.'],
['What is certificate pinning?', 'Pinning verifies a known certificate/public-key relationship to reduce some MITM risk. It requires a rotation strategy or it can cause outages; assess operational tradeoffs.'],
['How do you protect secrets in a mobile app?', 'Do not embed secrets that grant durable privileged access; attackers can inspect shipped binaries. Keep real secrets server-side and use short-lived, scoped credentials.'],
['What is OAuth PKCE?', 'PKCE binds an authorization request to the client using a generated verifier and challenge, protecting public clients such as mobile apps from intercepted authorization codes.'],
['How do you secure deep links?', 'Validate host, path, parameters, and authentication state; never perform privileged actions solely from a link; use universal/app links where possible over easily claimed custom schemes.'],
['What should not be logged?', 'Never log passwords, tokens, full PII, payment data, private health data, or raw sensitive API payloads. Redact centrally and control access and retention.'],
['How do you handle biometric authentication?', 'Use biometrics as a local user-presence gate, not as server identity. Handle fallback, enrollment changes, lockout, and secure-key policies through the platform APIs.'],
['What is root/jailbreak detection?', 'It can raise the cost of tampering but is bypassable and should be one defense among many. Avoid locking out legitimate users without a risk-based reason.'],
['How do you validate input?', 'Validate shape, range, format, and authorization on the server; client validation improves UX but is never sufficient for security. Use allowlists for structured values.'],
['What is least privilege?', 'Grant only the minimum permissions, scopes, data access, and service capabilities required for a task, then expire and review them.'],
['How do you handle dependency security?', 'Pin and update dependencies, review advisories, remove unused packages, scan builds, verify provenance, and test upgrades rather than blindly auto-merging all updates.'],
['What is threat modeling?', 'Threat modeling identifies assets, trust boundaries, attackers, abuse cases, and mitigations before release. It turns vague security concern into prioritized engineering work.'],
['How do you secure offline data?', 'Classify data, encrypt sensitive records with platform-protected keys, minimize what is stored, lock or redact sensitive UI on background, and define deletion/expiry policies.'],
['How do you respond to a security incident?', 'Contain exposure, preserve evidence, rotate/revoke credentials, assess affected users and data, communicate through the response process, remediate root cause, and learn without blame.']
]);
add('Testing & Quality', [
['What is the testing pyramid?', 'Have many fast unit tests, fewer integration tests, and a small number of end-to-end tests. The goal is high confidence with fast, stable feedback—not arbitrary test counts.'],
['What should unit tests test?', 'Unit tests should test observable behavior of isolated logic: reducers, formatters, validation, and domain rules. Avoid asserting implementation details that make refactoring painful.'],
['What are integration tests?', 'Integration tests verify collaborating units such as a screen, store, and mocked network. They catch wiring issues while remaining faster and less flaky than end-to-end tests.'],
['What are end-to-end tests?', 'E2E tests drive the real app through critical user journeys on a device or emulator. They provide strong confidence but are slower and require disciplined test data and synchronization.'],
['How does Detox work?', 'Detox is a gray-box E2E framework for React Native that synchronizes with app idleness. Use stable accessibility IDs and test essential flows rather than every edge case.'],
['How do you test React components?', 'Render behaviorally, interact as a user would, assert visible outcomes and accessibility, mock only external boundaries, and wait for async UI rather than internal state.'],
['What makes a test flaky?', 'Flakiness comes from timing, shared state, network dependence, animations, race conditions, or environment drift. Fix the cause; retries hide signal and increase distrust.'],
['How do you mock network calls?', 'Use realistic request handlers at the network boundary so the app exercises loading, success, empty, and error states without coupling tests to client internals.'],
['What is snapshot testing good for?', 'Snapshots can catch unintended output changes in stable presentational components, but broad snapshots are noisy. Prefer focused assertions for behavior and accessibility.'],
['What is code coverage?', 'Coverage shows executed lines/branches, not correctness. Use it to find untested risk areas, but judge tests by the failures they can meaningfully catch.'],
['How do you test accessibility?', 'Assert roles, labels, states, and focus behavior; run automated checks where available; then test key flows with VoiceOver/TalkBack and large text settings.'],
['How do you test offline behavior?', 'Simulate loss and restoration of connectivity, queued writes, restart during sync, stale cache, conflicts, and error recovery on actual devices where possible.'],
['What is contract testing?', 'Contract tests verify that client and server expectations about requests and responses remain compatible. They reduce integration surprises when teams deploy independently.'],
['How do you approach a production bug?', 'Triage impact, reproduce safely, inspect telemetry, isolate the smallest cause, add a regression test when practical, release a focused fix, and verify the outcome.'],
['What is a quality gate?', 'A quality gate is a required automated check before promotion, such as tests, linting, type checks, security scans, performance budgets, or review approval.']
]);
add('CI/CD & Release', [
['What is CI?', 'Continuous integration automatically builds and validates every change so integration problems surface early. A useful CI pipeline is fast, reliable, and representative of release conditions.'],
['What is CD?', 'Continuous delivery keeps software releasable through automated deployment steps and approvals; continuous deployment automatically releases qualified changes. Choose based on risk and controls.'],
['What stages belong in a mobile pipeline?', 'Typical stages are install dependencies, lint/type-check, unit/integration tests, build signed artifacts, E2E/smoke tests, security scanning, publish, and monitor rollout.'],
['How do you manage signing certificates?', 'Store signing material in restricted secret management, rotate and audit access, separate environments, automate retrieval in CI, and never commit credentials to the repository.'],
['What is semantic versioning?', 'Semantic versioning communicates API change: major for breaking changes, minor for backward-compatible features, patch for backward-compatible fixes. Mobile build numbers are separate platform requirements.'],
['What are feature flags?', 'Feature flags decouple deployment from release, enabling gradual exposure and rollback. Keep ownership, expiry dates, and tests, or flags become permanent complexity.'],
['What is a staged rollout?', 'A staged rollout releases to a small cohort first, watches health metrics, then expands. It limits blast radius and needs clear stop/rollback thresholds.'],
['How do you handle app-store release risk?', 'Use internal testing, beta cohorts, release notes, phased rollout, crash/performance monitoring, and a server-side kill switch for risky remote behavior.'],
['What is build reproducibility?', 'A reproducible build produces the same artifact from the same source and inputs. Lock tool versions, dependencies, environment configuration, and build scripts.'],
['How do you manage environment configuration?', 'Keep non-secret configuration versioned by environment, inject secrets at build/runtime from secure systems, validate config at startup, and never ship production credentials in source.'],
['What is an artifact repository?', 'It stores immutable build outputs and metadata so a tested artifact—not a rebuilt approximation—is promoted across environments and can be audited or rolled back.'],
['How do you roll back a mobile release?', 'For store binaries, halt rollout and ship a hotfix; for compatible remote config or OTA code, disable or revert quickly. Plan rollback before release.'],
['What metrics do you monitor after release?', 'Monitor crash-free users, ANRs, startup time, API errors, key funnel completion, performance, battery/network regressions, support reports, and cohort-specific anomalies.'],
['What is trunk-based development?', 'Trunk-based development integrates small changes frequently into a shared main branch, relying on CI and flags to keep main releasable and reduce long-lived merge pain.'],
['How do you improve a slow CI pipeline?', 'Measure queue and step duration, parallelize independent jobs, cache safely, run cheap checks first, remove redundant work, and keep a trusted full suite for protected branches.']
]);
add('Leadership & System Design', [
['How do you lead a technical project?', 'Clarify the user outcome and constraints, align owners and milestones, make risks visible, create a decision cadence, unblock teams, and measure delivery and quality.'],
['How do you handle disagreement?', 'Seek shared facts and goals, let each option state tradeoffs, make the decision at the right ownership level, document it, and commit once decided unless new evidence appears.'],
['How do you mentor engineers?', 'Set a growth goal, give context and progressively harder ownership, review reasoning rather than only code, provide specific feedback, and create opportunities to demonstrate growth.'],
['What makes a good design document?', 'It states context, goals/non-goals, constraints, proposed design, alternatives, risks, rollout, observability, and open questions so reviewers can make an informed decision.'],
['How do you estimate work?', 'Break scope into outcomes and unknowns, use comparable work and assumptions, give ranges with confidence, identify dependencies, and revise as evidence changes.'],
['How do you manage technical debt?', 'Make debt visible, describe its cost and risk, prioritize it alongside features, pay down high-leverage items incrementally, and prevent recurrence with standards or automation.'],
['How do you prioritize?', 'Prioritize by user impact, business value, risk reduction, urgency, effort, and strategic fit. Make tradeoffs explicit rather than treating every request as equally urgent.'],
['How do you design for scale?', 'Identify the expected load and bottleneck first, then use caching, pagination, asynchronous processing, partitioning, quotas, backpressure, and observability where they solve that bottleneck.'],
['How do you design a notification system?', 'Model preferences and consent, deduplicate, schedule, choose channels, make sends idempotent, handle provider failures, measure delivery/open outcomes, and respect quiet hours.'],
['How do you design an upload flow?', 'Use resumable uploads when needed, validate size/type, upload directly to object storage with scoped URLs, show progress, make retries idempotent, scan content, and process asynchronously.'],
['How do you design authentication for a mobile app?', 'Use standards-based authorization with PKCE, short-lived access tokens and refresh rotation, secure token storage, revocation/logout, device/session management, and server-side authorization checks.'],
['How do you handle an incident as a leader?', 'Establish an incident commander and clear channels, prioritize user mitigation, communicate cadence and facts, avoid blame, document decisions, and run a follow-up with owned actions.'],
['What is a good code review?', 'Review for correctness, security, maintainability, tests, and user impact; be timely and respectful; explain the why; distinguish blockers from suggestions; and avoid rewriting personal style.'],
['How do you communicate with nontechnical stakeholders?', 'Start with the outcome, user impact, risk, options, and decision needed. Use plain language, quantify uncertainty, and avoid implementation detail unless it affects the choice.'],
['How do you know a team is healthy?', 'A healthy team has clear goals, psychological safety, sustainable delivery, quality ownership, manageable on-call load, learning culture, low surprise, and improving customer outcomes.']
]);

// Every card includes a compact example. Keyword cases keep common interview
// questions concrete; the category examples provide a practical application for
// the wider design and process questions.
const categoryExamples = {
  'JavaScript': 'const user = await fetchUser();\nqueueMicrotask(() => console.log(user.id));',
  'TypeScript': 'function first<T>(items: T[]): T | undefined { return items[0]; }',
  'React': 'function Counter(){ const [count,setCount]=useState(0); return <Button title={`${count}`} onPress={()=>setCount(c=>c+1)} />; }',
  'React Native Core': '<FlatList data={users} keyExtractor={u=>u.id} renderItem={({item})=><UserRow user={item}/>} />',
  'React Native Advanced': 'AppState.addEventListener("change", state => { if (state === "active") syncPendingChanges(); });',
  'State Management': 'dispatch({ type: "cart/itemAdded", payload: product });',
  'Architecture & Design': 'const profile = await profileRepository.getById(userId); // UI does not know whether this came from cache or HTTP',
  'Performance': '<FlatList data={items} renderItem={renderRow} keyExtractor={item=>item.id} initialNumToRender={12} />',
  'Security': 'await Keychain.setGenericPassword("token", accessToken); // do not place tokens in logs or source code',
  'Testing & Quality': 'render(<LoginScreen />); await user.type(screen.getByLabelText("Email"), "a@b.com"); expect(screen.getByText("Continue")).toBeEnabled();',
  'CI/CD & Release': 'on: [pull_request]\njobs: { verify: { steps: ["typecheck", "test", "build"] } }',
  'Leadership & System Design': 'Decision: use cursor pagination. Why: new records cannot shift an already viewed page. Owner: Mobile + API. Rollout: 10% cohort.'
};
function exampleFor(item) {
  const q = item.question.toLowerCase();
  if (q.includes('closure')) return 'function makeCounter(){ let n=0; return () => ++n; }\nconst next = makeCounter(); next(); // 1, while n stays private';
  if (q.includes('event loop')) return 'console.log("A");\nsetTimeout(()=>console.log("timer"),0);\nPromise.resolve().then(()=>console.log("promise"));\n// A, promise, timer';
  if (q.includes('debounce')) return 'const debouncedSearch = debounce(query => api.search(query), 300);\n// Call it on each keystroke; only the final query runs.';
  if (q.includes('throttle')) return 'const onScroll = throttle(event => analytics.track("scroll"), 200);\n// At most one event is sent per 200 ms.';
  if (q.includes('promise')) return 'const [profile, feed] = await Promise.all([getProfile(), getFeed()]);\n// Independent requests run together.';
  if (q.includes('unknown')) return 'function parse(value: unknown) {\n  if (typeof value === "string") return value.toUpperCase();\n  return "";\n}';
  if (q.includes('discriminated union') || q.includes('union type')) return 'type Result = {kind:"ok"; data:string} | {kind:"error"; message:string};\nif (result.kind === "ok") console.log(result.data);';
  if (q.includes('useeffect')) return 'useEffect(() => {\n  const sub = socket.subscribe(onMessage);\n  return () => sub.unsubscribe();\n}, [socket]);';
  if (q.includes('useref')) return 'const inputRef = useRef<TextInput>(null);\ninputRef.current?.focus(); // no render is triggered';
  if (q.includes('usememo')) return 'const visible = useMemo(() => users.filter(matchesQuery), [users, matchesQuery]);';
  if (q.includes('usecallback')) return 'const onSave = useCallback(() => save(id), [id]);\nreturn <MemoizedRow onSave={onSave} />;';
  if (q.includes('keys')) return 'items.map(item => <Row key={item.id} item={item} />)\n// `item.id` remains stable when the list is reordered.';
  if (q.includes('context')) return 'const ThemeContext = createContext("light");\n<ThemeContext.Provider value="dark"><App /></ThemeContext.Provider>';
  if (q.includes('flatlist')) return '<FlatList data={posts} keyExtractor={p=>p.id} renderItem={renderPost} windowSize={7} />';
  if (q.includes('deep link')) return 'myapp://orders/42 → parse path → navigation.navigate("Order", { id: "42" })';
  if (q.includes('push notification')) return 'onNotificationOpenedApp(message => navigation.navigate("Order", {id: message.data.orderId}));';
  if (q.includes('offline')) return 'await db.orders.put(localOrder);\nawait mutationQueue.enqueue({type:"CREATE_ORDER", id: localOrder.id});\n// Sync retries later.';
  if (q.includes('optimistic')) return 'cache.setQueryData(["todos"], old => [...old, optimisticTodo]);\ntry { await createTodo(); } catch { rollback(); }';
  if (q.includes('error boundary')) return '<ErrorBoundary fallback={<RetryView />}><CheckoutScreen /></ErrorBoundary>';
  if (q.includes('secure') || q.includes('token')) return 'const token = await Keychain.getGenericPassword();\napi.defaults.headers.Authorization = `Bearer ${token.password}`;';
  if (q.includes('feature flag')) return 'if (flags.newCheckout) return <NewCheckout />;\nreturn <ExistingCheckout />;';
  if (q.includes('staged rollout')) return 'Release to 5% → watch crashes and conversion for 2 hours → expand to 25%, then 100%.';
  if (q.includes('incident')) return '1. Mitigate impact. 2. Assign incident lead. 3. Update stakeholders every 30 min. 4. Record follow-up actions.';
  return categoryExamples[item.category];
}
const interviewContext = {
  'JavaScript': 'In an interview, define the runtime rule first, then contrast it with the common alternative and give one consequence for asynchronous or UI code.',
  'TypeScript': 'Mention both the compile-time safety benefit and the runtime boundary: TypeScript types disappear at runtime, so external data still needs validation.',
  'React': 'Frame the answer around predictable rendering: what triggers it, how React preserves identity, and when an optimization is justified by measurement.',
  'React Native Core': 'Connect the concept to its user impact on a real device—smooth UI, correct platform behavior, startup time, or maintainable native integration.',
  'React Native Advanced': 'Explain the thread or lifecycle boundary involved, then describe the failure mode that appears on lower-end devices or with poor connectivity.',
  'State Management': 'State where the source of truth lives, how updates are made predictable, and how the design avoids duplicated or stale data.',
  'Architecture & Design': 'Start with the constraint this design addresses, name the trade-off, and explain how the boundary makes the code easier to test or change.',
  'Performance': 'State what you would measure before changing code, identify the likely bottleneck, and describe the optimization together with its trade-off.',
  'Security': 'Treat the client as an untrusted environment. Explain the defense in depth and what the server must still enforce.',
  'Testing & Quality': 'Describe the user-visible behavior being protected, the most suitable test layer, and how you would keep that test deterministic.',
  'CI/CD & Release': 'Tie the practice to safe repeatable delivery: automated checks, a controlled rollout, observable health metrics, and a clear rollback path.',
  'Leadership & System Design': 'Give a structured answer: clarify the goal and constraints, explain the decision and trade-offs, then state ownership, rollout, and success signals.'
};
const detailedAnswers = {
  'What is the difference between var, let, and const?': '`var` is function-scoped, can be redeclared, and is hoisted with the value `undefined`. `let` and `const` are block-scoped and cannot be accessed before their declaration because of the temporal dead zone. Use `const` by default; use `let` only when reassignment is required; avoid `var` in modern code.',
  'Explain hoisting.': 'Hoisting is JavaScript’s behavior of registering declarations before execution begins. Function declarations are available with their full function body, `var` declarations are initialized to `undefined`, and `let` and `const` declarations exist but cannot be accessed until execution reaches their declaration—the temporal dead zone. Hoisting does not mean code is physically moved.',
  'What is a closure?': 'A closure is created when an inner function keeps access to variables from its outer lexical scope even after the outer function has returned. It is commonly used for private state, factory functions, memoization, and callbacks. For example, a counter function can keep its count private without exposing it globally.',
  'How does the event loop work?': 'JavaScript executes synchronous code on the call stack. Asynchronous operations are handled by the browser or Node APIs; when they finish, their callbacks are queued. When the call stack is empty, the event loop runs all pending microtasks, such as Promise callbacks, before running the next macrotask, such as a timer or DOM event.',
  'Microtasks vs macrotasks?': 'Microtasks include `Promise.then`, `catch`, `finally`, and `queueMicrotask`; macrotasks include `setTimeout`, `setInterval`, I/O, and UI events. After synchronous code completes, JavaScript drains the entire microtask queue before taking one macrotask. That is why a resolved Promise runs before `setTimeout(..., 0)`.',
  'Why were arrow functions introduced?': 'Arrow functions provide shorter syntax and lexical `this`. Unlike normal functions, they do not create their own `this`, `arguments`, `super`, or `new.target`; they inherit `this` from the surrounding scope. They are ideal for callbacks and array methods, but normal functions are better for constructors and object methods that need dynamic `this`.',
  'What is the difference between == and ===?': '`===` compares values without type coercion, so it should be the default. `==` converts operands before comparing them, which can produce surprising results such as `0 == false`. Use `==` only when you deliberately want its coercion rules, which is rare.',
  'Explain this in JavaScript.': 'For a normal function, `this` is determined by how the function is called: as a method it is usually the receiver, with `call`, `apply`, or `bind` it is explicitly chosen, and with `new` it is the created instance. Arrow functions do not have their own `this`; they capture it from the surrounding scope.',
  'What are call, apply, and bind?': '`call` invokes a function immediately with a chosen `this` and individual arguments. `apply` does the same but receives arguments as an array. `bind` returns a new function whose `this` is permanently fixed, and it can also prefill arguments.',
  'What is prototypal inheritance?': 'JavaScript objects inherit by delegating property lookup through a prototype chain. If a property is not found on an object, JavaScript looks on its prototype and then upward. `class` syntax is a cleaner way to create this prototype-based behavior; methods are usually shared through the prototype rather than recreated on every instance.',
  'What is the difference between shallow and deep copy?': 'A shallow copy duplicates only the outer object or array, so nested objects remain shared references. A deep copy duplicates nested data as well. For plain supported values, `structuredClone` is safer than JSON serialization because JSON loses types such as `Date`, `Map`, and `undefined`.',
  'Explain debounce and throttle.': 'Debouncing delays a function until calls stop for a period, so it is useful for a search input where only the final keystroke should trigger a request. Throttling limits a function to once per interval, so it is useful for frequent events such as scrolling or resizing.',
  'What are Promises?': 'A Promise represents the eventual result of an asynchronous operation. It is pending until it becomes fulfilled with a value or rejected with an error. Use `then`, `catch`, and `finally`, or `await` it inside an async function, and make sure errors are handled at an intentional boundary.',
  'async/await vs Promises?': '`async` and `await` are syntax built on Promises. They make sequential asynchronous code read like synchronous code and allow normal `try/catch` error handling. For independent requests, start them together and await `Promise.all` rather than awaiting one after another.',
  'What is optional chaining and nullish coalescing?': 'Optional chaining, `?.`, safely stops property access or calls when the value is `null` or `undefined`. Nullish coalescing, `??`, supplies a fallback only for `null` or `undefined`, unlike `||`, which also replaces valid falsy values such as `0`, `false`, and an empty string.'
};
function interviewAnswerFor(item) {
  return detailedAnswers[item.question] || item.summary;
}
HANDBOOK.forEach(item => {
  item.example = exampleFor(item);
  item.interviewAnswer = interviewAnswerFor(item);
});
