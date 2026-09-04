/* 180 interview questions - a short spoken answer plus one small example for each. */
const HANDBOOK = [];
const add = (category, entries) => entries.forEach(([question, say, example]) =>
  HANDBOOK.push({ id: HANDBOOK.length + 1, category, question, say, example: example.trim() }));

add('JavaScript', [
[
  'What is the difference between var, let, and const?',
  '`var` is function scoped. `let` and `const` are block scoped. With `var` I can redeclare the same variable and reassign it. With `let` I can reassign but not redeclare. With `const` I can do neither, but I can still change what is inside an object or array, because only the binding is fixed, not the value. Also `var` is hoisted as `undefined`, so reading it early gives `undefined`, while `let` and `const` throw an error if I use them before the declaration. I use `const` by default, `let` when I need to reassign, and I never use `var`.',
  `// scope
if (true) { var a = 1; let b = 2; }
a;   // 1  - var leaked out
b;   // ReferenceError

// redeclare
var n = 1; var n = 2;    // fine
let m = 1; let m = 2;    // SyntaxError

// reassign
let x = 1; x = 2;        // fine
const c = 1; c = 2;      // TypeError
const o = { n: 0 }; o.n = 5;   // fine - contents are mutable

// hoisting
console.log(p);  // undefined
console.log(q);  // ReferenceError
var p = 1; let q = 2;`
],
[
  'Explain hoisting.',
  'Hoisting means declarations are known before the code runs. Function declarations are fully hoisted, so I can call them before they are written. `var` is hoisted and set to `undefined`, so reading it early gives `undefined` instead of an error. `let` and `const` are hoisted too, but they are not initialised, so using them before the declaration throws. That gap is called the temporal dead zone. One thing people get wrong is saying `let` is not hoisted. It is hoisted, it is just not usable yet.',
  `greet();          // works - function declaration
console.log(a);   // undefined - var
console.log(b);   // ReferenceError - let, temporal dead zone
notYet();         // TypeError: not a function

function greet() { console.log('hi'); }
var a = 1;
let b = 2;
var notYet = () => {};`
],
[
  'What is a closure?',
  'A closure is a function that remembers the variables around it, even after the outer function has finished. I use it when I want private state without a class, like a counter or a cache. Every time the outer function runs, it creates a fresh set of variables, so two counters do not share anything. One thing to mention is that it captures the variable, not a copy of the value, so if the value changes later, the closure sees the new one. That is where stale closure bugs in React come from.',
  `function makeCounter() {
  let count = 0;              // private
  return () => ++count;
}

const a = makeCounter();
const b = makeCounter();
a(); a();   // 2
b();        // 1  - separate scope

// it captures the variable, not the value
let msg = 'first';
const log = () => console.log(msg);
msg = 'second';
log();      // 'second'`
],
[
  'How does the event loop work?',
  'JavaScript runs on one thread, so it does one thing at a time. Normal code runs first. Anything async is handed off, and when it finishes its callback goes into a queue. Once the stack is empty, the event loop runs all the microtasks, which are promise callbacks, and then takes one macrotask, like a timer or an event. Then it repeats. So `setTimeout` with zero does not run immediately, it runs after the current code and all pending promises. And if I block with a long loop, nothing else can run, including the UI.',
  `console.log('1');
setTimeout(() => console.log('4'), 0);      // macrotask
Promise.resolve().then(() => console.log('3'));  // microtask
console.log('2');

// 1, 2, 3, 4`
],
[
  'Microtasks vs macrotasks?',
  'Microtasks are promise callbacks, `await` continuations, and `queueMicrotask`. Macrotasks are timers, events, and I/O callbacks. The rule is simple: after each macrotask the engine runs every microtask before doing anything else, including before painting. So a promise always runs before a zero millisecond timer. The practical side is that if microtasks keep adding more microtasks, the queue never empties and the UI freezes. A timer does not have that problem, because the browser gets a turn in between.',
  `setTimeout(() => console.log('macro'), 0);
queueMicrotask(() => console.log('micro'));
// micro first, always

function starve() { queueMicrotask(starve); }   // freezes the UI
function fine()   { setTimeout(fine, 0); }      // UI still responsive`
],
[
  'Why were arrow functions introduced?',
  'Mainly for shorter syntax and for `this`. An arrow does not have its own `this`, it takes it from where it was written, so I no longer need `const self = this` or `.bind(this)` inside callbacks. It also has no `arguments`, no `prototype`, and I cannot call it with `new`. So I still use a normal function when I need `this` to be the object calling it, like an object method, or when I need a constructor. In React I mostly use arrows, but I keep in mind that an inline arrow is a new function on every render, which breaks `React.memo`.',
  `class Timer {
  count = 0;
  start() {
    setInterval(() => this.count++, 1000);           // 'this' is the Timer
    setInterval(function () { this.count++ }, 1000); // 'this' is wrong
  }
}

const obj = {
  name: 'Ada',
  bad:  () => this.name,      // undefined - not the object
  good() { return this.name },
};`
],
[
  'What is the difference between == and ===?',
  '`===` checks type and value, no conversion. `==` converts the types first, and the rules are easy to get wrong, so I always use `===`. For example `\'1\' == 1` is true, and `[] == false` is also true. The one exception I allow is `x == null`, because that checks for `null` and `undefined` together and it is quite readable. One more thing worth saying is that `NaN` is not equal to itself with either operator, so I use `Number.isNaN` for that.',
  `'1' == 1            // true  - converted
'1' === 1           // false
[] == false         // true
null == undefined   // true
null === undefined  // false
NaN === NaN         // false  -> Number.isNaN(x)

if (value == null) { /* null or undefined */ }`
],
[
  'Explain this in JavaScript.',
  'For a normal function, `this` depends on how the function is called, not where it is written. If I call it as `obj.method()`, `this` is `obj`. If I use `call`, `apply` or `bind`, it is what I pass. With `new`, it is the new object. And if I just call it on its own, it is `undefined` in strict mode. The common bug is losing the object: if I pass a method as a callback, the object in front of the dot is gone and `this` breaks. Arrow functions do not have their own `this`, they take it from the surrounding code, which is why they work well as callbacks.',
  `const user = { name: 'Ada', hello() { return this.name } };

user.hello();          // 'Ada'
const fn = user.hello;
fn();                  // undefined - lost the object
fn.call(user);         // 'Ada'

setTimeout(user.hello, 0);         // undefined
setTimeout(() => user.hello(), 0); // 'Ada'`
],
[
  'What are call, apply, and bind?',
  'All three let me set `this` myself. `call` runs the function straight away with the arguments listed one by one. `apply` is the same but takes the arguments as an array. `bind` does not run it, it returns a new function that is locked to that `this`, and I can also preset some arguments. I remember it as call comma, apply array, bind later. A detail worth adding is that once a function is bound, you cannot rebind it.',
  `function intro(greeting) { return greeting + ', ' + this.name; }
const user = { name: 'Ada' };

intro.call(user, 'Hi');        // 'Hi, Ada'
intro.apply(user, ['Hello']);  // 'Hello, Ada'

const hey = intro.bind(user, 'Hey');
hey();                         // 'Hey, Ada'`
],
[
  'What is prototypal inheritance?',
  'Every object has a link to another object called its prototype. When I read a property that is not on the object, JavaScript looks up that chain until it finds it or reaches null. Classes are just nicer syntax for the same thing. Methods live on the prototype, so all instances share one copy instead of each having its own. A useful detail is that writing a property never goes up the chain, it creates it on the object itself and hides the one above.',
  `class Animal { speak() { return 'sound' } }
class Dog extends Animal { speak() { return 'woof' } }

const d = new Dog();
d.speak();                                   // 'woof'
Object.getPrototypeOf(d) === Dog.prototype;  // true
d instanceof Animal;                         // true - found up the chain
Object.hasOwn(d, 'speak');                   // false - it is on the prototype`
],
[
  'What is the difference between shallow and deep copy?',
  'A shallow copy only copies the top level. Anything nested is still the same object, so changing it changes both copies. A deep copy copies everything, so they are fully independent. Spread and `Object.assign` are shallow. For a deep copy I use `structuredClone`, which handles dates, maps and even circular references. The old `JSON.parse(JSON.stringify())` trick works but it loses dates, `undefined` and functions. This matters a lot in React, because if I spread the top level and then change something nested, I am also changing the old state.',
  `const original = { id: 1, user: { name: 'Ada' } };

const shallow = { ...original };
shallow.user.name = 'Bob';
original.user.name;   // 'Bob'  - shared

const deep = structuredClone(original);
deep.user.name = 'Eve';
original.user.name;   // 'Bob'  - independent

// correct nested update in React
setState(prev => ({ ...prev, user: { ...prev.user, name: 'Ada' } }));`
],
[
  'Explain debounce and throttle.',
  'Both limit how often a function runs. Debounce waits until the calls stop, then runs once. That is what I use for search input, so I only call the API when the user stops typing. Throttle runs at most once in a given interval, no matter how many calls come in, so it is better for scroll or resize where I want regular updates. In React the thing to watch is that the debounced function has to be created once, usually in a `useMemo`, otherwise it is recreated on every render and never actually debounces.',
  `const debounce = (fn, ms) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
};

const throttle = (fn, ms) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn(...args); }
  };
};

// React - create it once
const search = useMemo(() => debounce(runSearch, 300), []);`
],
[
  'What are Promises?',
  'A Promise represents a value that will arrive later. It is either pending, fulfilled or rejected, and once it settles it never changes. I handle it with `then`, `catch` and `finally`, and each of those returns a new promise so I can chain them. The main rule is to always return or await a promise, otherwise errors get swallowed. For running things together I use `Promise.all`, which fails as soon as one fails, or `allSettled` when I want every result even if some fail.',
  `const [user, posts] = await Promise.all([fetchUser(id), fetchPosts(id)]);

const results = await Promise.allSettled([a(), b()]);
// [{ status: 'fulfilled', value }, { status: 'rejected', reason }]

await Promise.race([fetchData(), timeoutAfter(5000)]);`
],
[
  'async/await vs Promises?',
  'They are the same thing underneath. `async/await` is just nicer syntax. An async function always returns a promise, and `await` pauses that function until the promise settles. I prefer it because the code reads top to bottom and I can use normal `try/catch`. The mistake to avoid is awaiting inside a loop when the calls do not depend on each other, because that makes them run one after another instead of together. In that case I use `Promise.all` with `map`.',
  `// slow - one after another
for (const id of ids) await fetchUser(id);

// fast - all at once
const users = await Promise.all(ids.map(fetchUser));

// forEach does not wait at all
ids.forEach(async id => { await fetchUser(id) });`
],
[
  'What is optional chaining and nullish coalescing?',
  'Optional chaining, `?.`, stops the expression and gives `undefined` instead of throwing when something in the middle is null or undefined. It also works for array access and for calling optional functions. Nullish coalescing, `??`, gives a fallback only when the value is null or undefined. That is different from `||`, which also replaces `0`, an empty string and `false`. So if zero is a valid value, `||` is a bug and `??` is correct. I use both a lot when reading API responses.',
  `const city = user?.address?.city ?? 'Unknown';
onChange?.(value);            // call only if it exists
const first = items?.[0];

const perPage = settings.perPage || 10;   // bug - 0 becomes 10
const perPage = settings.perPage ?? 10;   // 0 stays 0`
],
]);

add('TypeScript', [
[
  'any vs unknown vs never?',
  '`any` turns type checking off, so anything is allowed and errors show up at runtime. `unknown` also accepts any value, but I cannot use it until I check what it is, so it is the safe version and that is what I use for API responses. `never` means a value that cannot exist. A function that always throws returns `never`, and it is also what a union becomes once I have handled every case. I use that last part to get a compile error when someone adds a new case and forgets to handle it.',
  `let a: any = JSON.parse(s);
a.foo.bar;                 // compiles, crashes later

let u: unknown = JSON.parse(s);
u.foo;                     // error - must check first

function fail(msg: string): never { throw new Error(msg) }

// exhaustiveness check
switch (status) {
  case 'idle':    return 'Idle';
  case 'loading': return 'Loading';
  default:        return assertNever(status);  // error if a case is missing
}`
],
[
  'interface vs type?',
  'For object shapes they are almost the same. The differences are that an `interface` can be declared twice and the two merge, which is how you extend types from a library, and a `type` can do things an interface cannot, like unions, tuples and mapped types. Interfaces use `extends`, which gives clearer error messages. My rule is interface for object shapes like props and models, and type for unions and anything derived. The important part is being consistent in the codebase.',
  `interface User { id: string; name: string }
interface User { email: string }     // merges into one

type Status = 'idle' | 'loading';    // only 'type' can do this
type Point  = [number, number];

interface Admin extends User { role: 'admin' }`
],
[
  'What is type narrowing?',
  'Narrowing is when TypeScript figures out a more specific type from a check I wrote. A `typeof` check, an `instanceof`, an `in` check, a null check, or comparing against a literal all narrow the type inside that branch. The pattern I use most is a discriminated union, where every option has a `status` or `kind` field, because then one check narrows the whole object. One gotcha is that narrowing on an object property is lost after a function call, so I copy it into a local variable first.',
  `type Result =
  | { status: 'success'; data: string }
  | { status: 'error'; error: Error };

if (r.status === 'error') r.error.message;   // narrowed
else r.data;                                  // narrowed

// narrowing is lost after a call
if (obj.value) { doSomething(); obj.value.trim(); }  // error
const v = obj.value;
if (v) { doSomething(); v.trim(); }                  // fine`
],
[
  'What are generics?',
  'Generics let me write something once and use it with many types, without losing type information. Without them I would have to use `any` and give up safety. The type is usually inferred from the call, so the caller does not have to write it. I can add a constraint with `extends` when I need the type to have certain properties. My rule is that a generic should be used at least twice, in the arguments and the return, otherwise it is not doing anything.',
  `function first<T>(items: T[]): T | undefined { return items[0] }
first([1, 2, 3]);       // number | undefined

function byId<T extends { id: string }>(items: T[], id: string) {
  return items.find(i => i.id === id);
}

function get<T, K extends keyof T>(obj: T, key: K): T[K] { return obj[key] }
get({ name: 'Ada', age: 36 }, 'age');   // number`
],
[
  'What is a union type?',
  'A union means the value is one of several types, written with a pipe. Until I narrow it, I can only use what all the options have in common, which is what keeps it safe. I use string literal unions instead of plain `string` for things like a status or a button variant, because then I get autocomplete and a typo becomes a compile error. If the options are objects, I add a common field like `kind` so they can be told apart.',
  `type Variant = 'primary' | 'secondary' | 'ghost';
<Button variant="primry" />       // compile error

type Id = string | number;
if (typeof id === 'string') id.toUpperCase();

type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; width: number; height: number };`
],
[
  'What is an intersection type?',
  'An intersection with `&` means the value has to satisfy all the types at once. Union is or, intersection is and. I use it mostly to combine my own props with the props of the component I am wrapping, so I do not have to list every native prop again. One thing to know is that if the same key exists with two different types, that key becomes `never`, and the error shows up later where it is used rather than where it is defined.',
  `type Timestamps = { createdAt: string; updatedAt: string };
type User       = { id: string; name: string };
type StoredUser = User & Timestamps;      // all four fields

type Props = { label: string } & React.ComponentProps<typeof Pressable>;

type Bad = { id: string } & { id: number };   // id is never`
],
[
  'What does readonly do?',
  '`readonly` stops a property from being reassigned, and `readonly T[]` removes the methods that mutate the array, like push and sort. It is only a compile time check, nothing changes at runtime, so it is about intent rather than real protection. It is also shallow, so a readonly property holding an object can still have its contents changed. Where it really helps is function parameters, because it proves the function will not mutate what I passed in.',
  `interface Config { readonly apiUrl: string }
c.apiUrl = 'other';         // error

function total(nums: readonly number[]) {
  // nums.sort();           // error - would mutate the caller's array
  return [...nums].sort();
}

// shallow only
s.user = other;             // error
s.user.name = 'Bob';        // allowed`
],
[
  'What are utility types?',
  'They are built in types that build a new type from an existing one, so I do not write the same shape twice. The ones I use most are `Partial` for update payloads, `Pick` and `Omit` to take part of a model, `Required`, `Record` for a lookup object, and `ReturnType` to get the type a function returns. The point is to define the model once and derive everything else from it, so when a field changes nothing goes stale.',
  `interface User { id: string; name: string; email: string; passwordHash: string }

type PublicUser  = Omit<User, 'passwordHash'>;
type UserPreview = Pick<User, 'id' | 'name'>;
type UserPatch   = Partial<PublicUser>;
type UsersById   = Record<string, User>;
type ApiUser     = Awaited<ReturnType<typeof api.getUser>>;`
],
[
  'What is a mapped type?',
  'A mapped type builds a new type by going over the keys of another type and transforming each one. That is how `Partial` and `Readonly` are written internally. I can also add or remove modifiers, and rename keys. I use it when two types must always match, like a form and its error object, so I cannot add a field to one and forget the other.',
  `type Errors<T> = { [K in keyof T]?: string };

interface LoginForm { email: string; password: string }
type LoginErrors = Errors<LoginForm>;   // { email?: string; password?: string }

type Mutable<T>  = { -readonly [K in keyof T]: T[K] };
type Concrete<T> = { [K in keyof T]-?: T[K] };`
],
[
  'What is a conditional type?',
  'A conditional type picks one type or another based on a check, using `T extends U ? X : Y`, and `infer` lets me pull a type out of another one. That is how `ReturnType` and `Awaited` are built. It is powerful, but the error messages get hard to read, so in normal app code I prefer writing the type out explicitly and keep conditional types for shared utilities.',
  `type Unwrap<T> = T extends Promise<infer V> ? V : T;
type A = Unwrap<Promise<string>>;   // string
type B = Unwrap<number>;            // number

type MyReturn<F> = F extends (...args: any[]) => infer R ? R : never;`
],
[
  'What are type guards?',
  'A type guard is a check that tells TypeScript what a value is. There are built in ones like `typeof`, `instanceof` and `Array.isArray`, and I can write my own with a `value is Type` return. The catch is that TypeScript trusts my guard without verifying it, so a sloppy guard is as risky as a cast. That is why I usually generate the guard from a schema library like Zod. I put these at the boundary, so data from the network comes in as `unknown` and leaves the parsing layer as a proper type.',
  `function isUser(v: unknown): v is User {
  return typeof v === 'object' && v !== null && 'id' in v;
}

const data: unknown = await res.json();
if (isUser(data)) data.id;         // typed from here

// safer - schema does the checking and the typing
const parsed = UserSchema.safeParse(data);`
],
[
  'What is as const?',
  '`as const` tells TypeScript to keep the exact literal value instead of widening it, and it makes everything readonly. Without it, `{ mode: \'dark\' }` gives `mode` the type `string`. With it, the type is `\'dark\'`. I mainly use it to declare a list of values once and get the union type from it, so the runtime list and the type can never get out of sync. It is also what makes a hook return a proper tuple instead of an array of mixed types.',
  `const ROUTES = ['home', 'profile', 'settings'] as const;
type Route = typeof ROUTES[number];   // 'home' | 'profile' | 'settings'

const config = { mode: 'dark' } as const;
config.mode;      // 'dark', not string
config.mode = 'light';   // error - readonly

function useToggle() {
  const [on, setOn] = useState(false);
  return [on, setOn] as const;        // proper tuple
}`
],
[
  'What is the difference between enum and union literals?',
  'An enum generates real JavaScript, so it adds code to the bundle and exists at runtime. It is also nominal, meaning a plain string that looks the same is not assignable to it. A string literal union is erased at compile time, costs nothing, and gives me the same safety and autocomplete. So I default to a union. If I also need the values at runtime, I use an object with `as const` and derive the type from it. I avoid `const enum` in React Native because it does not work properly with Babel.',
  `enum Status { Idle = 'idle' }
const s: Status = 'idle';        // error - nominal

type Status2 = 'idle' | 'loading';   // erased, zero cost
const s2: Status2 = 'idle';          // fine

const STATUS = { idle: 'idle', loading: 'loading' } as const;
type Status3 = typeof STATUS[keyof typeof STATUS];
Object.values(STATUS);               // available at runtime`
],
[
  'Why avoid non-null assertions?',
  'The `!` tells the compiler a value is not null, but it does not check anything, so if I am wrong it crashes at runtime. It removes the warning without removing the risk. Usually the better fix is optional chaining with a default, an early guard that throws a clear error, or fixing the type, because very often a `!` means the type says optional when the value is actually always there. I only use it for something I can prove, like a ref after mount, and I leave a comment.',
  `const el = document.getElementById('root')!;   // silent risk

// better
const name = user?.profile?.name ?? 'Anonymous';

if (!user) throw new Error('user is required here');
user.profile;    // narrowed and it fails loudly if wrong`
],
[
  'What is strict mode in TypeScript?',
  '`strict: true` turns on a group of checks at once. The biggest is `strictNullChecks`, which stops null and undefined being assignable to everything, so I have to handle the empty case. It also includes `noImplicitAny`, so parameters cannot silently become `any`, and it types the catch variable as `unknown` instead of `any`. I always turn it on for new projects. For an old codebase I enable the flags one at a time so each step is a reviewable change instead of thousands of errors at once.',
  `{ "compilerOptions": { "strict": true, "noUncheckedIndexedAccess": true } }

function greet(name: string | null) {
  // return name.toUpperCase();      // error under strict
  return name?.toUpperCase() ?? 'there';
}

try { risky() } catch (e) {
  if (e instanceof Error) log(e.message);   // e is unknown, must check
}`
],
]);

add('React', [
[
  'What causes a React component to re-render?',
  'Three things. Its own state changed, its parent re-rendered, or a context it uses changed. The one people forget is the parent, because when a parent re-renders, the whole subtree re-renders by default even if the props are identical, unless the child is wrapped in `React.memo`. Also, state only counts as changed if the reference changed, so if I mutate an object and set it back, nothing happens.',
  `const [items, setItems] = useState([]);

items.push(newItem); setItems(items);      // no re-render - same reference
setItems(prev => [...prev, newItem]);      // re-renders`
],
[
  'Explain useState.',
  '`useState` gives a component a value and a setter, and calling the setter schedules a re-render. Updates are batched, so if the new value depends on the old one I use the function form, otherwise both updates use the same stale value. The initial value is only used on the first render, and if computing it is expensive I pass a function instead so it does not run every time.',
  `const [count, setCount] = useState(() => expensiveInit());   // runs once

setCount(count + 1);
setCount(count + 1);     // both read the same count -> +1

setCount(c => c + 1);
setCount(c => c + 1);    // -> +2`
],
[
  'Explain useEffect.',
  '`useEffect` runs side effects after the render, like subscriptions, timers, or anything outside React. The dependency array decides when it runs again, and the function I return is the cleanup, which runs before the next run and on unmount. The two mistakes I watch for are missing dependencies, which gives me stale values, and missing cleanup, which leaves listeners and timers running.',
  `useEffect(() => {
  const sub = AppState.addEventListener('change', onChange);
  return () => sub.remove();      // cleanup, always
}, [onChange]);`
],
[
  'useEffect vs useLayoutEffect?',
  '`useEffect` runs after the screen has painted, so it never blocks the UI, and that is my default. `useLayoutEffect` runs before the paint, so it is for measuring something and adjusting it before the user sees it, like positioning a tooltip. Because it blocks painting, I only use it when I actually see a flicker.',
  `useLayoutEffect(() => {
  const { height } = ref.current.getBoundingClientRect();
  setHeight(height);        // adjust before anything is shown
}, []);`
],
[
  'What is useRef for?',
  'Two things. One, getting a reference to a component so I can call methods on it, like scrolling a list or focusing an input. Two, storing a value that survives re-renders without causing one, like a timer id or the previous value. The key point is that changing `ref.current` does not re-render, so I never put something the UI displays in a ref.',
  `const listRef = useRef(null);
const timer = useRef(null);

listRef.current?.scrollToOffset({ offset: 0 });

timer.current = setTimeout(fn, 500);   // no re-render
useEffect(() => () => clearTimeout(timer.current), []);`
],
[
  'What is useMemo?',
  '`useMemo` caches the result of a calculation and only recalculates when the dependencies change. I use it for genuinely expensive work like filtering or sorting a big list, and to keep an object or array reference stable when it is passed to a memoised child or used as a dependency. It is not free, so I do not put it on everything.',
  `const visible = useMemo(
  () => items.filter(i => i.status === filter).sort(byDate),
  [items, filter],
);`
],
[
  'What is useCallback?',
  '`useCallback` is the same idea but for functions. It keeps the same function reference between renders until the dependencies change. On its own it does nothing for performance. It only matters when the function is passed to a memoised child or used as a dependency in an effect, because otherwise a new function every render cancels out the memo.',
  `const onSelect = useCallback(id => setSelected(id), []);

<Row onSelect={onSelect} />   // memo on Row now actually works`
],
[
  'What is React.memo?',
  '`React.memo` makes a component skip re-rendering when its props are the same, compared shallowly. It only works if the props are stable, so inline objects and arrow functions break it, because they are new every render. That is why it goes together with `useCallback` and `useMemo`. I use it for list rows and expensive subtrees, and I measure first, because on a cheap component the comparison can cost more than the render.',
  `const Row = React.memo(({ item, onPress }) => <ItemView item={item} onPress={onPress} />);

<Row item={item} style={{ margin: 8 }} />   // breaks memo - new object
<Row item={item} style={styles.row} />      // fine`
],
[
  'What is useReducer?',
  '`useReducer` puts all the state changes in one function, so instead of calling several setters I dispatch an action. I use it when the next state depends on the previous one or when several fields have to change together, because then the transitions are in one place and easy to test. The dispatch function also has a stable identity, so passing it down does not break memoisation.',
  `function reducer(state, action) {
  switch (action.type) {
    case 'submit':  return { ...state, loading: true, error: null };
    case 'success': return { loading: false, error: null, data: action.data };
    case 'failure': return { ...state, loading: false, error: action.error };
    default: return state;
  }
}
const [state, dispatch] = useReducer(reducer, { loading: false });`
],
[
  'What is Context and when should you use it?',
  'Context passes a value down the tree without passing props through every level. I use it for things that are global and do not change often, like theme, language, or the logged in user. I do not use it as a general state store, because every consumer re-renders when the value changes. For server data I use a query library, and for large client state a store with selectors. Also the value object needs to be memoised, otherwise it is new every render and everything re-renders anyway.',
  `const ThemeContext = createContext('light');

const value = useMemo(() => ({ theme, setTheme }), [theme]);
<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>`
],
[
  'What are controlled components?',
  'A controlled input keeps its value in React state and updates through `onChange`, so React is the source of truth. I use that when I need validation, formatting, or to react to typing. An uncontrolled input keeps its own value and I read it with a ref, which is lighter for big forms. The thing to avoid is switching between the two, which React warns about.',
  `const [email, setEmail] = useState('');

<TextInput value={email} onChangeText={setEmail} autoCapitalize="none" />`
],
[
  'Why are keys important in lists?',
  'Keys let React match items between renders, so it can move and reuse them instead of rebuilding them. If I use the array index as a key, it breaks as soon as the list is reordered or an item is inserted or removed, because the key no longer points to the same item. Then state ends up on the wrong row, like a checkbox staying ticked on the wrong item. So I always use a stable id from the data.',
  `items.map((item, i) => <Row key={i} item={item} />)      // breaks on reorder
items.map(item => <Row key={item.id} item={item} />)     // correct`
],
[
  'What are custom hooks?',
  'A custom hook is just a function starting with "use" that calls other hooks. It is how I share logic between components without wrappers. Each component that uses it gets its own separate state, so the logic is shared but the state is not. I pull one out as soon as I see the same state and effect pattern in a second place.',
  `function useDebounced(value, ms = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}`
],
[
  'What is error boundary?',
  'An error boundary catches errors thrown while rendering its children and shows a fallback instead of the whole app disappearing. It has to be a class component, using `getDerivedStateFromError` and `componentDidCatch`. It does not catch errors in event handlers, async code, or effects, so I still need try/catch there. In production I wrap each screen in one and report the error to Sentry from it.',
  `class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error, info) { Sentry.captureException(error, { extra: info }) }
  render() { return this.state.hasError ? <Fallback /> : this.props.children }
}`
],
[
  'What is reconciliation?',
  'Reconciliation is how React works out what changed between the old tree and the new one. It compares by element type and key. Same type means it keeps the component and just updates the props, so state is preserved. A different type means it throws the subtree away and builds it again, so state is lost. That explains two common bugs: state resetting because a component was declared inside another component, and state landing on the wrong row because of index keys.',
  `function Screen() {
  const Row = () => <Text>row</Text>;   // new type every render
  return <Row />;                       // remounted each time, state lost
}
// fix: declare Row outside the component`
],
]);

add('React Native Core', [
[
  'How is React Native different from React for web?',
  'The React part is the same, components, hooks and state all work identically. What changes is what it renders. Instead of HTML elements I use `View`, `Text` and `Image`, which become real native views. There is no CSS, styles are JavaScript objects and there is no cascade, so every component styles itself. Layout is flexbox but with different defaults. And I have mobile concerns like permissions, safe areas, and shipping through the app stores.',
  `// web
<div className="row" onClick={onPress}>Hello</div>

// react native
<View style={styles.row}>
  <Text onPress={onPress}>Hello</Text>
</View>
// text must always be inside <Text>`
],
[
  'Explain the React Native new architecture.',
  'The new architecture replaces the old bridge with JSI, which lets JavaScript talk to native code directly in C++ instead of sending JSON messages. On top of that there is Fabric for rendering and TurboModules for native modules, and Codegen generates the glue from a TypeScript spec. The benefits are lower latency, no serialisation cost, the ability to call native code synchronously, and support for concurrent React features.',
  `Old: JS -> JSON queue -> bridge -> native      (async, batched)
New: JS -> JSI (direct C++ references) -> native (sync, no serialisation)

newArchEnabled=true            # android/gradle.properties
RCT_NEW_ARCH_ENABLED=1 pod install`
],
[
  'What was the legacy bridge?',
  'The old bridge was an async message queue between JavaScript and native. Every call was turned into JSON, batched, and sent across. It worked, but nothing could be synchronous, big payloads were slow to serialise, and things like scroll driven animations would lag because messages piled up. That bottleneck is the reason the new architecture was built.',
  `onScroll -> JS handler -> JSON -> queue -> native
// every frame, so a busy JS thread meant dropped frames

<Animated.ScrollView useNativeDriver />   // the old workaround`
],
[
  'What is JSI?',
  'JSI is a small C++ layer that lets JavaScript hold direct references to native objects and call their methods, without JSON in between. It is also engine independent, which is what made it possible to swap JavaScriptCore for Hermes. It is the foundation for Fabric and TurboModules, and it is why libraries like Reanimated and MMKV can be so fast.',
  `const storage = global.__mmkv;      // a real native object
storage.setString('token', value);  // synchronous, no bridge hop`
],
[
  'What is Fabric?',
  'Fabric is the new rendering system. It keeps the view tree in C++ as an immutable structure, so layout can be done on a background thread and applied in one go. It also lets React interrupt or prioritise rendering, which is what makes concurrent features work properly. In practice it means fewer dropped frames on heavy screens, and I can measure and update synchronously when I need to.',
  `Render (JS) -> Commit (C++ tree, layout off the main thread) -> Mount (native views)

// your JSX does not change - the benefit is interruptible rendering`
],
[
  'What are TurboModules?',
  'TurboModules are the new way native modules work. Instead of loading every module at startup, they load lazily the first time JavaScript uses them, so startup is faster. Their interface is generated by Codegen from a TypeScript spec, so if the JavaScript and native signatures do not match, it is a build error instead of a crash on a user device. They can also be called synchronously.',
  `import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getDeviceName(): string;        // can be synchronous
}
export default TurboModuleRegistry.getEnforcing<Spec>('DeviceInfo');`
],
[
  'What is Hermes?',
  'Hermes is the JavaScript engine made for React Native. It compiles the code to bytecode at build time, so the device does not have to parse and compile it at startup, which is the main win. It also uses less memory and has a garbage collector tuned for mobile. It is the default now, and I profile with the Hermes tools rather than assuming JavaScriptCore behaviour.',
  `metro -> Hermes compiler -> bytecode bundle

// typical result: a few hundred ms off cold start on mid range Android`
],
[
  'What is Metro?',
  'Metro is the bundler for React Native. It builds the module graph, runs everything through Babel, and serves the bundle. In development it does that incrementally, which is what makes fast refresh work. I touch its config when I need extra file extensions, a monorepo watch folder, or custom resolution. And when I get "module not found" for a file that clearly exists, it is usually the cache.',
  `// metro.config.js
module.exports = {
  resolver: { sourceExts: ['ts', 'tsx', 'js', 'json'] },
  watchFolders: [path.resolve(__dirname, '../shared')],
};

npx react-native start --reset-cache`
],
[
  'How does React Native layout work?',
  'Layout is flexbox, calculated by Yoga in C++, so it behaves the same on both platforms. The defaults are different from the web though. `flexDirection` is column instead of row, `alignItems` is stretch, and position is relative. There is no cascade, so styles are not inherited except for some text styles. When something does not show up or does not size correctly, it is nearly always a missing `flex: 1` on a parent.',
  `const styles = StyleSheet.create({
  screen: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  spacer: { flex: 1 },      // pushes the next item to the right
});`
],
[
  'What is the difference between View, ScrollView, and FlatList?',
  '`View` is a plain container and does not scroll. `ScrollView` renders all of its children immediately, so it is fine for a settings screen but it will use a lot of memory on a long list. `FlatList` is virtualised, so it only renders what is near the screen and recycles rows as you scroll. So anything driven by data goes in a `FlatList`. And I never put a `FlatList` inside a `ScrollView` in the same direction.',
  `<FlatList
  data={items}
  keyExtractor={item => item.id}
  renderItem={({ item }) => <Row item={item} />}
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
/>`
],
[
  'How do you manage platform-specific code?',
  'For small differences I use `Platform.OS` or `Platform.select` inline. When it is more than a few lines, I split the file with `.ios.tsx` and `.android.tsx` extensions and let Metro pick the right one, so the import stays the same everywhere. I keep the same interface on both sides, so the difference never leaks into the feature code.',
  `paddingTop: Platform.select({ ios: 44, android: 24 }),
...Platform.select({ ios: { shadowOpacity: 0.1 }, android: { elevation: 4 } })

// or Haptics.ios.ts / Haptics.android.ts, imported as './Haptics'`
],
[
  'What is SafeAreaView?',
  'It keeps content out of the notch, status bar and home indicator. The built in `SafeAreaView` is iOS only and pads the whole container, so in real projects I use react-native-safe-area-context, which gives the actual inset values on both platforms. That way I can apply the top inset to the header and the bottom inset to a sticky button, while the list still scrolls edge to edge.',
  `const insets = useSafeAreaInsets();

<View style={{ paddingTop: insets.top }}><Header /></View>
<FlatList contentContainerStyle={{ paddingBottom: insets.bottom + 16 }} />`
],
[
  'How do deep links work?',
  'A deep link is a URL that opens a specific screen. There are custom schemes, which are easy but any app can claim them, and universal links on iOS or app links on Android, which are verified against a file on my domain, so those are what I use in production. React Navigation maps the URL to a route with a linking config. The parts people forget are the cold start case, where the app was not running, and validating the parameters before trusting them.',
  `const linking = {
  prefixes: ['myapp://', 'https://app.example.com'],
  config: { screens: { Product: 'product/:id' } },
};

// cold start: Linking.getInitialURL()
// already running: Linking.addEventListener('url', handler)`
],
[
  'How do push notifications work?',
  'The app asks for permission and registers with APNs or FCM, which gives back a device token. I send that token to my backend and store it against the user. The backend then pushes to that token through the provider, and my handler decides whether to show it while the app is open and where to navigate when it is tapped. The practical parts are when I ask for permission, refreshing the token, and removing dead tokens.',
  `const token = await messaging().getToken();
await api.registerDevice({ token, platform: Platform.OS });

messaging().onTokenRefresh(t => api.registerDevice({ token: t }));
messaging().onNotificationOpenedApp(msg => navigate(msg.data.screen));`
],
[
  'What are native modules?',
  'A native module exposes platform code, Swift or Kotlin, to JavaScript, for anything React Native does not already cover, like a payment SDK or a hardware feature. With the new architecture I write a TypeScript spec, Codegen creates the interface, and I implement it on both platforms. I only write one myself if there is no maintained library, because it means maintaining native code on two platforms forever.',
  `// JS
const { Biometrics } = NativeModules;
const ok = await Biometrics.authenticate('Confirm payment');

// Kotlin
@ReactMethod
fun authenticate(reason: String, promise: Promise) { /* ... */ }`
],
]);

add('React Native Advanced', [
[
  'What threads are involved in React Native?',
  'There are three that matter. The JS thread runs my React code and business logic. The native or UI thread does the actual drawing and handles touches. And there are background threads, including the one where Yoga calculates layout. The reason it matters is that if the JS thread is busy, scrolling and gestures can still work, because they are on the UI thread. That is exactly why native driven animations stay smooth while JavaScript is busy.',
  `// blocks the JS thread - state updates stall
const result = heavyParse(bigPayload);

// let the interaction finish first
InteractionManager.runAfterInteractions(() => heavyParse(bigPayload));`
],
[
  'How does Reanimated improve animations?',
  'Reanimated runs the animation code on the UI thread as worklets, so it never depends on the JS thread. That means the animation keeps running at sixty frames a second even while JavaScript is busy. It also gives me shared values and gesture integration, so a drag can drive the animation directly. The older Animated API with `useNativeDriver` is fine for opacity and transform, but it cannot animate layout properties.',
  `const offset = useSharedValue(0);
const style = useAnimatedStyle(() => ({
  transform: [{ translateX: offset.value }],   // runs on the UI thread
}));

offset.value = withSpring(120);`
],
[
  'When would you use Skia?',
  'When I need custom drawing that normal components cannot do, like charts, gradients, blurs, image filters, or a signature pad. React Native Skia gives me a proper 2D drawing engine on the GPU, and it works together with Reanimated for animated drawing. It is a heavy dependency though, so I only add it when the design really needs custom rendering.',
  `<Canvas style={{ flex: 1 }}>
  <Path path={linePath} color="#5b4bdb" style="stroke" strokeWidth={2} />
  <Circle cx={cx} cy={cy} r={6} color="#10a37f" />
</Canvas>`
],
[
  'What is code generation in React Native?',
  'Codegen reads the TypeScript specs for my native modules and components and generates the C++, Objective-C and Java glue code at build time. That means the JavaScript side and the native side cannot drift apart, because a mismatch becomes a build error instead of a crash on a device. It also removes a lot of boilerplate I used to write by hand.',
  `// NativeAnalytics.ts is the single source of truth
export interface Spec extends TurboModule {
  track(event: string, props: Object): void;
}
// codegen emits NativeAnalyticsSpec.h and NativeAnalyticsSpec.java`
],
[
  'How do you handle app lifecycle?',
  'I listen to `AppState` for foreground and background changes. On background I pause timers and video, flush analytics, and start the lock timer for biometrics. On foreground I refresh data if it is stale. On Android I also have to remember the process can be killed at any time, so anything I need has to be saved, not just kept in memory.',
  `useEffect(() => {
  const sub = AppState.addEventListener('change', next => {
    if (next === 'active') refetchIfStale();
    if (next === 'background') { analytics.flush(); pausePlayback(); }
  });
  return () => sub.remove();
}, []);`
],
[
  'How do you implement offline-first?',
  'I treat the local database as the source of truth for the UI and use the network to sync. Reads come from local storage, so the app opens instantly with no spinner. Writes are applied locally straight away and added to a queue, which is flushed when the connection comes back. Then I need conflict resolution, usually last write wins using server timestamps, and the UI has to show what is still pending or failed.',
  `await db.notes.upsert(draft);       // local first, UI updates now
await outbox.enqueue({ type: 'note.save', payload: draft });

NetInfo.addEventListener(s => { if (s.isConnected) outbox.flush() });`
],
[
  'MMKV vs AsyncStorage vs SQLite?',
  'AsyncStorage is a simple async key value store, fine for small flags but slow for anything bigger. MMKV is a memory mapped key value store built on JSI, so it is synchronous, much faster, and supports encryption, and that is my default for tokens and settings. SQLite is what I use once I need queries, relationships, or thousands of rows.',
  `const storage = new MMKV({ id: 'user', encryptionKey: key });
storage.set('theme', 'dark');
const theme = storage.getString('theme');   // synchronous, no await

// SQLite when you need WHERE, JOIN, ORDER BY, pagination`
],
[
  'When use WatermelonDB?',
  'When I have a lot of related data that has to work offline and stay reactive, like thousands of records across several tables with a UI that should update automatically. It is built on SQLite with lazy loading and observable queries, and it has a sync protocol. For a small cache it is overkill, because you also take on a schema and migrations.',
  `const messages = database.get('messages')
  .query(Q.where('chat_id', chatId), Q.sortBy('created_at', Q.desc));

// components update automatically when the rows change`
],
[
  'How do you manage images?',
  'I serve images already resized from the backend or a CDN instead of downscaling huge originals on the device, use WebP where I can, and always set explicit width and height so the layout does not jump. For lists I use a caching library like FastImage or Expo Image with a placeholder, and I prefetch the next page. Oversized images are the most common memory problem I see in React Native apps.',
  `<Image
  source={{ uri: cdn(item.image, { w: 320, format: 'webp' }) }}
  style={{ width: 160, height: 160 }}    // fixed size, no layout shift
  placeholder={item.blurhash}
  contentFit="cover"
/>`
],
[
  'How do you handle permissions?',
  'I ask for a permission at the moment the user tries to use the feature, not at launch, and I explain why first, which improves the acceptance rate a lot. I always handle three outcomes: granted, denied, and blocked, where the only way forward is opening system settings. And the feature has to still work in some reduced way if the answer is no.',
  `const status = await request(PERMISSIONS.IOS.CAMERA);

if (status === RESULTS.GRANTED) openCamera();
else if (status === RESULTS.BLOCKED) Linking.openSettings();
else showManualUploadFallback();`
],
[
  'How do you support accessibility?',
  'I give every interactive element a label and a role, keep touch targets at least forty four points, and group related text so a screen reader reads one sentence instead of several fragments. I never use colour alone to show meaning, I check contrast, and I let text scale with the system font size instead of hardcoding it. Then I actually test the screen with VoiceOver and TalkBack, because that is where the real problems show up.',
  `<Pressable
  accessible
  accessibilityRole="button"
  accessibilityLabel="Add to cart"
  accessibilityState={{ disabled: isSoldOut }}
  hitSlop={8}
/>`
],
[
  'How do you reduce app startup time?',
  'First I measure time to interactive, not just when the first pixel appears. Then the usual things: Hermes so the code is already compiled, lazy loading screens and heavy native modules so they are not touched at launch, delaying analytics and other SDK setup until after the first interaction, shrinking the bundle, and showing cached data immediately instead of waiting for the network.',
  `InteractionManager.runAfterInteractions(() => {
  analytics.init();
  crashReporter.enableExtras();
});

const Settings = React.lazy(() => import('./screens/Settings'));`
],
[
  'How do you update an app over the air?',
  'OTA updates let me ship JavaScript and asset changes without going through app review, using CodePush or Expo Updates, so a hotfix can reach users in minutes. The limit is that anything touching native code still needs a store release, so updates have to be pinned to the native version. I roll out in stages, watch the crash free rate, and keep a rollback ready. And I stay within the store rules, which say you cannot change what the app fundamentally does.',
  `runtimeVersion: { policy: 'nativeVersion' }   // pin to the native build

// 10% -> check crash free sessions -> 50% -> 100%, rollback if it regresses`
],
[
  'How do you handle crashes?',
  'I use a crash reporter like Sentry or Crashlytics, with source maps and symbols uploaded so the stack traces are readable. I wrap screens in error boundaries so a render error shows a fallback instead of a white screen. I attach breadcrumbs and the user id, never personal data, and I track crash free sessions as a release gate. Then I triage by how many users are affected, not by the raw count.',
  `Sentry.init({
  dsn: DSN,
  tracesSampleRate: 0.2,
  beforeSend: event => scrub(event),   // remove personal data first
});
Sentry.setUser({ id: user.id });        // id only`
],
[
  'What makes a good native integration?',
  'A small, well typed interface that hides the platform details, the same behaviour and the same error shapes on both platforms, and no native types leaking into the feature code. It should also have a fallback or a clear error when the capability is missing, and it should be testable, which means I mock my own wrapper rather than the third party SDK. And it needs documentation, because the next person will not have the native context.',
  `// app code never imports the SDK directly
export const biometrics = {
  isAvailable(): Promise<boolean>,
  authenticate(reason: string): Promise<'success' | 'cancelled' | 'unavailable'>,
};
// one wrapper - one place to mock, one place to swap the vendor`
],
]);

add('State Management', [
[
  'When should state be local?',
  'My default is local. If only one component and maybe its child needs the value, `useState` is the right answer, because it is the easiest to read, test and delete. I lift it up only when a sibling needs it, and I move it to a global store only when it is genuinely shared across the app, like the session. Most over engineered apps I have seen got that way by putting form state in Redux.',
  `// local - modal open, input text, accordion state
const [isOpen, setOpen] = useState(false);

// global - session, feature flags, theme
const user = useAuthStore(s => s.user);`
],
[
  'What state belongs on the server?',
  'Anything the server owns, like lists and records that other users can change. I do not copy that into client state. I cache it with a query library that handles fetching, deduping, background refresh and invalidation. Then client state is only UI concerns, which makes the store much smaller and removes a whole class of stale data bugs.',
  `const { data, isLoading, refetch } = useQuery({
  queryKey: ['orders', userId],
  queryFn: () => api.getOrders(userId),
  staleTime: 60_000,
});
// no useEffect + useState + manual loading flags`
],
[
  'Redux vs Context?',
  'They solve different problems. Context just passes a value down the tree, and every consumer re-renders when it changes. Redux is a real state container with selectors, middleware and devtools, and a component only re-renders when the part it selected changes. So I use Context for stable things like theme, and a store when the state is large, changes often, or I need to debug how it changes.',
  `// Context - any change re-renders every consumer
<UserContext.Provider value={{ user, setUser }} />

// Store - subscribes to one slice
const name = useStore(s => s.user.name);`
],
[
  'What is Redux middleware?',
  'Middleware sits between dispatching an action and the reducer receiving it, so it can log, delay, transform, or dispatch other actions. That is where side effects live, like thunks for simple async work or sagas for more complex flows, which keeps reducers pure and easy to test. I also use it for cross cutting things like analytics and crash breadcrumbs.',
  `const analytics = store => next => action => {
  if (action.meta?.track) track(action.type, action.payload);
  return next(action);
};

configureStore({ reducer, middleware: g => g().concat(analytics) });`
],
[
  'What is an immutable update?',
  'It means creating a new object instead of changing the existing one, so the reference changes and React can see that something is different. If I mutate in place, the reference is the same and the component will not re-render. I use spreads for shallow updates, and Immer, which comes with Redux Toolkit, when the nesting gets deep enough that spreads become unreadable.',
  `state.user.name = 'Ada';                                   // wrong - same reference
return { ...state, user: { ...state.user, name: 'Ada' } };  // right

produce(state, draft => { draft.user.name = 'Ada' });       // Immer`
],
[
  'What is normalized state?',
  'It means storing records in a flat object keyed by id, and lists holding only ids, instead of nesting copies of the same record everywhere. Then an update happens in one place and every screen sees it, which fixes the classic bug where the list and the detail page disagree. The cost is joining the data back in selectors, so I only normalise records that appear in more than one place.',
  `// duplicated - will go out of sync
{ posts: [{ id: 'p1', author: { id: 'u1', name: 'Ada' } }] }

// normalised
{
  users: { u1: { id: 'u1', name: 'Ada' } },
  posts: { p1: { id: 'p1', authorId: 'u1' } },
  feed: ['p1'],
}`
],
[
  'What are selectors?',
  'Selectors are small functions that read a piece of the store, so components do not depend on how the state is structured. If I restructure the state, I only change the selectors. Memoised selectors like `createSelector` also stop derived data being recalculated, and stop a new array being returned every render, which would re-render everything subscribed to it.',
  `const selectVisible = createSelector(
  [s => s.todos, s => s.filter],
  (todos, filter) => todos.filter(t => t.status === filter),
);
// only recomputes when todos or filter change`
],
[
  'What is optimistic UI?',
  'It means showing the expected result immediately, before the server confirms it, so the app feels instant. Things like liking a post, deleting, or reordering. To do it safely I need three things: a way to roll back if the request fails, a visible retry, and idempotent requests so a retry does not apply twice. I use it for low risk actions, never for payments.',
  `onMutate: async liked => {
  const previous = queryClient.getQueryData(['post', id]);
  queryClient.setQueryData(['post', id], p => ({ ...p, liked }));
  return { previous };                       // snapshot for rollback
},
onError: (_e, _v, ctx) => queryClient.setQueryData(['post', id], ctx.previous),`
],
[
  'How do you avoid prop drilling?',
  'First I check whether the state is even in the right place, because often it should just live closer to where it is used. Then composition, passing children through instead of passing props down each level. After that, Context for stable shared values, or a store with selectors for anything bigger. I would not add a global store just to avoid passing a prop two levels down.',
  `// instead of threading 'user' through Layout -> Sidebar -> Profile
<Layout sidebar={<Profile user={user} />} />
// Layout just renders {sidebar}`
],
[
  'What is a state machine?',
  'It is an explicit list of the states something can be in and the transitions between them. It replaces a set of separate booleans like `isLoading`, `isError` and `isSuccess`, which can combine into impossible states like loading and error at the same time. For flows like checkout or onboarding I define the states first, and then the code and the test cases follow from that.',
  `type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Order }
  | { status: 'error'; message: string };
// loading and error can no longer both be true`
],
[
  'How do you persist client state?',
  'I persist only what I choose, not the whole store. Tokens go in secure storage, and preferences and a small cache go in MMKV. I never persist derived or temporary state. I version the persisted shape and write a migration, and if the saved data is corrupt or from an old version, it falls back to defaults instead of crashing on launch. Persisting an entire Redux store is how you ship a bug that only appears after an upgrade.',
  `persist(store, {
  name: 'app-v3',
  version: 3,
  migrate: (state, from) => (from < 3 ? migrateToV3(state) : state),
  partialize: s => ({ theme: s.theme, onboarded: s.onboarded }),   // allowlist
});`
],
[
  'What causes stale closures in state code?',
  'A callback remembers the variables from the render where it was created. If that callback is stored somewhere long lived, like an interval, a subscription, or an effect with an empty dependency array, it keeps reading those old values forever. The fixes are the function form of the setter, correct dependencies, or a ref holding the latest value when I need a stable function.',
  `useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000);  // always 0 + 1
  return () => clearInterval(id);
}, []);

// fix
setCount(c => c + 1);`
],
[
  'How should forms be modeled?',
  'Locally, with a library like React Hook Form that does not re-render the whole screen on every keystroke. I keep one schema, usually Zod, as the source of truth for both validation and the types. I validate on blur and on submit rather than on every character, and I map server errors into the same error shape so the UI only has one way to show them.',
  `const schema = z.object({ email: z.string().email(), age: z.number().min(18) });
type Values = z.infer<typeof schema>;

const { control, handleSubmit, formState: { errors } } =
  useForm<Values>({ resolver: zodResolver(schema), mode: 'onBlur' });`
],
[
  'How do you handle cache invalidation?',
  'I pick a strategy per type of data instead of one rule for everything. Time based staleness for data that can be slightly old, explicit invalidation after a mutation for anything the user just changed, and refetch on focus for screens people come back to. I structure the keys so I can invalidate a whole group at once, and I prefer showing stale data while refreshing in the background over showing a spinner.',
  `await api.updateOrder(order);
queryClient.invalidateQueries({ queryKey: ['orders'] });   // list and details

// key structure allows scoped invalidation
['orders'], ['orders', userId], ['orders', userId, orderId]`
],
[
  'What is single source of truth?',
  'Every piece of data lives in exactly one place, and everything else is derived from it. As soon as the same fact is stored twice, the two copies drift, and you get bugs like the badge count not matching the list. So if a value can be calculated from existing state, I calculate it during render instead of storing it.',
  `// two sources - they will drift
const [items, setItems] = useState([]);
const [count, setCount] = useState(0);

// one source
const [items, setItems] = useState([]);
const count = items.length;`
],
]);

add('Architecture & Design', [
[
  'What is Clean Architecture?',
  'It is layering the code so the dependencies all point inward. The domain sits in the middle and knows nothing about frameworks, then use cases, then adapters, and the UI and the network are on the outside. The benefit is that business rules can be tested without a device or a network, and swapping REST for GraphQL only touches one layer. In a mobile app I apply it in a light way, because full ceremony on a small screen is just overhead.',
  `domain/     Order, pricing rules       (pure, no framework imports)
usecases/   placeOrder(order, deps)
data/       OrderRepository (REST / SQLite)
ui/         OrderScreen, hooks

// dependencies only point inward`
],
[
  'What is MVVM?',
  'Model, View, ViewModel. The view only renders, the view model holds the presentation state and the actions, and the model is the data and business rules. In React the view model is usually a custom hook, which makes it feel natural. The screen becomes simple markup, and all the logic is in a hook I can test without rendering anything.',
  `function useOrderScreen(orderId) {              // view model
  const { data, isLoading } = useOrder(orderId);
  return { title: data?.title ?? '', isLoading, canCancel: data?.status === 'open' };
}

function OrderScreen({ orderId }) {             // view
  const vm = useOrderScreen(orderId);
  return <Header title={vm.title} />;
}`
],
[
  'What is dependency injection?',
  'It means giving a module its dependencies from outside instead of letting it create them itself. That is what makes code testable, because I can pass in a fake API client or a fixed clock without patching modules. In React the container is usually just props, a factory function, or a provider, so I rarely need a DI framework, but the principle still applies.',
  `// hard to test
function placeOrder(o) { return fetch('/orders', ...) }

// injected
function makePlaceOrder({ http, clock }) {
  return o => http.post('/orders', { ...o, at: clock.now() });
}
const placeOrder = makePlaceOrder({ http: fakeHttp, clock: fixedClock });`
],
[
  'What is repository pattern?',
  'A repository is the one place that knows how to fetch and store a type of data. It exposes methods in domain terms and hides whether the data came from the network, the database, or a cache. The feature code just asks for an order and does not care. That is what makes offline first manageable, because the caching and sync rules live in one file instead of being spread across screens.',
  `export const orderRepository = {
  async getById(id) {
    const local = await db.orders.find(id);
    if (local && !isStale(local)) return local;    // cache policy lives here
    const remote = await api.getOrder(id);
    await db.orders.upsert(remote);
    return remote;
  },
};`
],
[
  'How do you design an API client?',
  'One layer that owns the base URL, auth headers, timeouts, retries, refreshing on a 401, error normalisation and cancellation. Everything above it just calls typed functions and gets one consistent error shape, so no screen ever writes a raw fetch. That means adding tracing headers or changing the transport is a one file change.',
  `async function request(path, init) {
  const res = await fetchWithTimeout(path, withAuth(init), 15_000);
  if (res.status === 401) return retryAfterRefresh(path, init);
  if (!res.ok) throw new ApiError(res.status, await safeJson(res));
  return res.json();
}
export const api = { getOrder: id => request('/orders/' + id) };`
],
[
  'How do you design a scalable feature folder?',
  'I organise by feature rather than by file type, so everything for checkout lives in one folder, including its screens, hooks, API calls and tests. Code moves into a shared folder only once a second feature actually needs it. Cross feature imports go through an index file, so refactoring inside a feature does not break anyone else.',
  `src/
  features/
    checkout/  { screens/ hooks/ api/ components/ index.ts }
    orders/
  shared/      { ui/ lib/ types/ }

// import from a feature's index.ts, never from deep inside it`
],
[
  'What are SOLID principles?',
  'Single responsibility, one reason to change. Open closed, extend without editing. Liskov, a subtype must work wherever the parent works. Interface segregation, small focused interfaces. Dependency inversion, depend on abstractions not concrete implementations. In React they mostly turn into small components, composition instead of huge prop lists, and injecting dependencies instead of importing them directly.',
  `// doing three jobs
function UserCard({ id }) { /* fetch + format + render */ }

// split
const user  = useUser(id);        // fetching
const label = formatUser(user);   // formatting
return <Card title={label} />;    // rendering`
],
[
  'What is separation of concerns?',
  'It means keeping different responsibilities in different places, so data fetching, business rules, and presentation are not tangled in one component. The test I use is whether I can change the design without touching business logic, and change a rule without touching JSX. When both are true, the code is easy to test and easy to hand over.',
  `// tangled
<Text>{price * 1.2 > 100 ? 'Free shipping' : 'Adds ' + fee}</Text>

// separated
const shipping = calculateShipping(price);   // pure, unit tested
<Text>{shipping.label}</Text>`
],
[
  'How do you choose an abstraction?',
  'I usually wait for the third time. Two similar pieces of code are often a coincidence, but the third tells me the pattern is real. An early abstraction guesses wrong, and then everyone bends their case to fit it, which is worse than duplication. I also prefer an abstraction I can delete easily, so shallow and local beats deep and clever.',
  `// after the third copy the shape is clear
useListScreen({ queryKey, fetcher, renderItem, emptyState })

// before that, duplication is cheaper than the wrong interface`
],
[
  'What is a BFF?',
  'A backend for frontend is a thin service owned by the client team that combines and reshapes data from other services for one client. For mobile it is very useful, because it turns several round trips into one, keeps the payload small, and moves logic off the device where I can change it without a store release.',
  `// without a BFF: three requests, then join on the device
GET /user  +  GET /orders  +  GET /promotions

// with a BFF: one request, exactly what the screen needs
GET /mobile/home -> { name, orderCount, banner }`
],
[
  'How do you handle versioned APIs?',
  'Mobile apps stay on user devices for years, so old versions do not disappear and the server has to stay backward compatible. I prefer adding optional fields over changing existing ones, and version in the path or a header only when a break is unavoidable. I send the app version and platform with every request, so the backend can adapt and I can see how many users are still on old builds before deprecating anything.',
  `headers: { 'X-App-Version': '4.12.0', 'X-Platform': Platform.OS }

// the client must ignore unknown fields
// and never require a field an older server might not send`
],
[
  'What is idempotency?',
  'It means doing the same request twice has the same effect as doing it once. It matters on mobile because networks drop and clients retry, and without it a retried payment charges twice. The usual approach is a key generated by the client that the server remembers, so a duplicate returns the original result instead of doing the work again.',
  `await api.post('/payments', body, {
  headers: { 'Idempotency-Key': paymentAttemptId },   // same across retries
});

// GET, PUT and DELETE are naturally idempotent, POST is not`
],
[
  'What is eventual consistency?',
  'It means different parts of the system can disagree for a short time and then catch up. It is unavoidable in an offline capable app, because my device has changes the server has not seen yet. So I design the UI around it: show pending states honestly, do not pretend the write is final, and have a clear rule for conflicts, usually last write wins per field using server timestamps.',
  `// after an optimistic post
{ id: 'tmp-1', status: 'pending', body: '...' }   // shown greyed out
// after sync
{ id: 'srv-88', status: 'synced', body: '...' }`
],
[
  'How do you design an offline sync system?',
  'The local database is the source of truth for reads. Writes go into a durable queue with an id, a timestamp and a retry count. A sync engine flushes that queue when the connection returns, using backoff and idempotency keys, then pulls changes since the last cursor. Conflicts are resolved by a documented rule, and anything that cannot be resolved is shown to the user instead of silently dropped.',
  `outbox: [{ id, op: 'note.update', payload, attempts, createdAt }]

push: flush the outbox (idempotent, with backoff)
pull: GET /changes?since=cursor -> merge -> save the new cursor
conflict: server timestamp wins per field; otherwise ask the user`
],
[
  'How do you evaluate an architectural decision?',
  'I write down the problem, two or three real options, and the trade offs against the constraints we actually have, like team size, deadline and existing skills. If being wrong would be expensive, I pick the option that is easiest to reverse. Then I record the decision and the reasoning in a short document, so six months later people know why. What I avoid is choosing something because it is new, or designing for a scale we are nowhere near.',
  `ADR-014: client cache library
Context:  offline reads, 3 engineers, ship in 6 weeks
Options:  hand rolled | React Query | WatermelonDB
Decision: React Query + MMKV
Why:      covers 90% of cases now, easy to reverse
Revisit:  if offline write volume grows`
],
]);

add('Performance', [
[
  'How do you measure React Native performance?',
  'I measure before changing anything. The React profiler shows which components re-render and why, Flipper or the Hermes profiler shows where JavaScript time goes, and the native profilers show UI thread and memory. In production I track cold start, time to interactive, dropped frames and crash free sessions. And I always test on a low end Android device, because a flagship hides most problems.',
  `<Profiler id="Feed" onRender={(id, phase, actual) => log(id, phase, actual)}>

// dev only - find out why something re-rendered
useWhyDidYouUpdate('Row', props);`
],
[
  'How do you optimize FlatList?',
  'A stable `keyExtractor`, a memoised row component, and no inline objects or arrow functions in the props, because those break the memo. If the rows are a fixed height I add `getItemLayout`, which removes the measuring work. Then I tune `initialNumToRender` and `windowSize`, keep the row component shallow, and use `removeClippedSubviews` on Android. For very heavy lists I switch to FlashList.',
  `<FlatList
  data={items}
  keyExtractor={i => i.id}
  renderItem={renderRow}                  // defined outside or useCallback
  getItemLayout={(_, i) => ({ length: 72, offset: 72 * i, index: i })}
  initialNumToRender={8}
  windowSize={5}
  removeClippedSubviews
/>`
],
[
  'Why avoid inline object and function props sometimes?',
  'Because they create a new reference on every render, so `React.memo` sees different props and re-renders anyway. On a single component it does not matter, but in a list of hundreds of rows it is the difference between smooth and janky scrolling. So I move styles into `StyleSheet.create` and wrap callbacks in `useCallback` where memoisation actually matters.',
  `// new object and new function every render - memo is useless
<Row style={{ padding: 8 }} onPress={() => select(item.id)} />

// stable
<Row style={styles.row} onPress={onSelect} item={item} />`
],
[
  'How do you prevent unnecessary renders?',
  'I find out the cause with the profiler first, then pick the right fix. Move state down so fewer components depend on it, split contexts so one change does not wake the whole tree, memoise the component and the props it receives, and use selectors so a store update only touches what changed. Memoising everything without measuring usually makes it slower and harder to read.',
  `// move state down - only Search re-renders while typing
function Screen() { return <><Header /><Search /><Feed /></> }

// select narrowly
const unread = useStore(s => s.notifications.unreadCount);`
],
[
  'What is bundle size optimization?',
  'Smaller bundles parse and start faster. I check with a bundle visualiser, replace heavy dependencies, import specific modules instead of a whole package, enable Hermes, lazy load screens that are rarely used, and make sure assets are optimised. On the Android side I also enable Proguard and ship an app bundle instead of a universal APK.',
  `import debounce from 'lodash/debounce';    // not the whole lodash

const Settings = React.lazy(() => import('./screens/Settings'));

npx react-native-bundle-visualizer`
],
[
  'How do you optimize network requests?',
  'Ask for less and ask less often. Request only the fields the screen needs, combine calls through a BFF, paginate, cache with sensible staleness and show stale data while refreshing, and dedupe identical requests. On mobile I also cancel requests when a screen unmounts and use exponential backoff, so a flaky network does not turn into a retry storm.',
  `const { data } = useQuery({
  queryKey: ['feed', page],
  queryFn: ({ signal }) => api.getFeed(page, { signal }),   // cancellable
  staleTime: 30_000,
  placeholderData: keepPreviousData,     // no spinner between pages
});`
],
[
  'What is memory leak in React Native?',
  'It is memory that is kept after it is no longer needed, usually a subscription, timer or listener that was never cleaned up, a closure holding onto something large, or too many images cached without a limit. The symptom is memory climbing as you navigate around, and eventually the app being killed on low end Android. The fix is cleaning up in effects and putting a bound on caches.',
  `useEffect(() => {
  const sub = subscribe(onData);
  const id = setInterval(tick, 1000);
  return () => { sub.remove(); clearInterval(id) };   // both
}, []);`
],
[
  'How do you make animations smooth?',
  'Keep them off the JS thread, using Reanimated or `useNativeDriver`, so the animation keeps running even while JavaScript is busy. I animate transform and opacity rather than width, height or layout, because those cause a full layout pass every frame. I also avoid triggering React re-renders per frame, and I check it on a low end device rather than the simulator.',
  `// good - transform, on the UI thread
const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

// bad - animating layout
Animated.timing(width, { toValue: 300, useNativeDriver: false });`
],
[
  'What is time to interactive?',
  'It is the point where the user can actually do something, not when the first pixel appears. A splash screen with a spinner is not interactive. So I measure from launch until the first screen is rendered with real data and responding to touch, because that is what users experience as speed. Improving it usually means showing cached data first and delaying everything that is not critical.',
  `// show cached data immediately, refresh in the background
const { data } = useQuery({ queryKey, queryFn, initialData: cache.get(queryKey) });

performance.mark('tti');`
],
[
  'How do you optimize image loading?',
  'Right sized images from a CDN instead of full resolution originals, modern formats like WebP, explicit dimensions so nothing jumps, a placeholder while loading, disk caching, and prefetching the next screen. I also limit how many large images are held in memory, because on Android that is the quickest way to get the app killed.',
  `<Image
  source={{ uri: cdn(url, { w: Math.round(width * scale), format: 'webp' }) }}
  style={{ width, height }}
  placeholder={blurhash}
  cachePolicy="memory-disk"
/>`
],
[
  'Why use pagination?',
  'Because loading everything is slow, expensive, and eventually impossible. Pagination limits the payload, the memory and the render cost, and the first page appears quickly. For feeds I prefer cursor based pagination over offsets, because with offsets you skip or repeat items when the list changes between requests.',
  `useInfiniteQuery({
  queryKey: ['feed'],
  queryFn: ({ pageParam }) => api.getFeed({ cursor: pageParam, limit: 20 }),
  getNextPageParam: last => last.nextCursor,     // cursor, not offset
});`
],
[
  'What is virtualization?',
  'It means only rendering the items that are near the screen and reusing the views as you scroll, instead of mounting the whole list. That keeps memory and render time roughly constant no matter how long the list is. `FlatList` and `SectionList` do it automatically, `ScrollView` does not, which is why a long `ScrollView` is one of the most common performance mistakes.',
  `<FlatList data={tenThousandItems} renderItem={renderRow} />
// about 15 rows mounted at a time

// the same data in a ScrollView mounts all 10,000`
],
[
  'How do you debug a slow screen?',
  'I reproduce it on a low end device with a release build, then measure instead of guessing. The React profiler first, to see if the time is in rendering. Then the JS profiler for hotspots, and the native tools for frame drops. The usual causes are unnecessary re-renders, a list that is not virtualised, heavy synchronous work, oversized images, or requests running one after another. I fix one thing at a time and measure again.',
  `1. reproduce on a low end Android release build
2. React profiler   - render count and duration
3. Hermes profiler  - JS hotspots
4. Systrace         - UI thread and frame drops
5. fix one thing, measure again`
],
[
  'What performance budgets would you set?',
  'Concrete numbers the team agrees on, like cold start under two seconds on a named mid range device, screen transitions under three hundred milliseconds, less than one percent dropped frames while scrolling, a bundle size ceiling, and crash free sessions above ninety nine and a half percent. Then I enforce them in CI, so a regression fails the build instead of being found by users.',
  `cold start p90:       < 2000ms  (Pixel 4a, release build)
js bundle:            < 3.0 MB
dropped frames:       < 1% while scrolling
crash free sessions:  > 99.5%`
],
[
  'When is memoization harmful?',
  'When the comparison costs more than the render it saves. Wrapping a cheap component in `React.memo` with a big props object is a net loss. It also uses memory, hides the real problem, and makes the code harder to read, and a wrong dependency array turns it into a stale value bug. So I memoise where I have measured a benefit, not by default.',
  `// pointless - rendering a Text is cheaper than comparing props
const Label = React.memo(({ text }) => <Text>{text}</Text>);

// worth it - a row with an image and several formatted fields, in a long list`
],
]);

add('Security', [
[
  'Where should access tokens be stored?',
  'In the platform secure storage, so Keychain on iOS and Keystore or EncryptedSharedPreferences on Android. Never in AsyncStorage, never in a persisted Redux store, and never hardcoded in the bundle. I keep the access token short lived and in memory, and the refresh token in secure storage. I clear both on logout, and I make sure they never end up in logs or crash reports.',
  `await Keychain.setGenericPassword('auth', refreshToken, {
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
});
// access token: short lived, memory only`
],
[
  'Why is HTTPS not enough?',
  'HTTPS protects data while it is travelling, but it does not help if someone installs a custom root certificate on the device and proxies the traffic, or if the device is rooted, or if I stored the token somewhere insecure, or if I put an API key in the binary where anyone can extract it. And it certainly does not fix a missing permission check on the server. It is the baseline, not the whole answer.',
  `// what HTTPS does not stop
- a proxy with a trusted custom CA on a test device
- a token read out of insecure local storage
- an API key extracted from the APK
- a permission check that only exists on the client`
],
[
  'What is certificate pinning?',
  'Pinning means the app only trusts specific certificates or public keys for my domain, instead of any certificate authority the device trusts. That stops someone intercepting traffic with an installed root certificate. The risk is bricking the app when the certificate rotates, so I pin the public key rather than the certificate, always ship a backup pin, and keep a way to turn it off remotely.',
  `pins: [
  'sha256/PRIMARY_KEY_HASH=',
  'sha256/BACKUP_KEY_HASH=',      // always ship a backup
]
// rotate the backup in before the primary expires`
],
[
  'How do you protect secrets in a mobile app?',
  'The honest answer is that anything shipped in the app can be extracted, so the real protection is not shipping secrets at all. Private keys and third party secrets belong on the server, behind an endpoint the app calls with the user token. If something must exist on the device, it should be short lived, limited in scope, and revocable. And nothing sensitive goes in the repo or a JavaScript config file.',
  `// wrong - extractable from the APK in minutes
const STRIPE_SECRET = 'sk_live_...';

// right - the server holds the secret and returns a short lived token
const { clientSecret } = await api.createPaymentIntent(orderId);`
],
[
  'What is OAuth PKCE?',
  'PKCE is the OAuth flow for apps that cannot keep a client secret, which includes every mobile app. The app creates a random verifier, sends a hash of it with the login request, and then sends the original verifier when exchanging the code for tokens. So even if someone intercepts the code, they cannot use it. I also open the login in the system browser rather than an embedded webview.',
  `verifier  = randomString(64)
challenge = base64url(sha256(verifier))

GET  /authorize?code_challenge=CHALLENGE&code_challenge_method=S256
POST /token { code, code_verifier: verifier }   // proves it is the same client`
],
[
  'How do you secure deep links?',
  'I treat every incoming link as untrusted input. I prefer universal links and app links, because they are verified against my domain, whereas any app can register a custom scheme. Then I whitelist which screens can be opened, validate the parameters, require the user to be logged in before showing anything protected, and never accept a token or credential through a link.',
  `function handleDeepLink(url) {
  const { screen, id } = parse(url);
  if (!ALLOWED_SCREENS.has(screen)) return;       // whitelist
  if (!/^[a-z0-9-]{1,36}$/.test(id)) return;      // validate
  if (!isAuthenticated()) return goToLogin({ next: { screen, id } });
  navigate(screen, { id });
}`
],
[
  'What should not be logged?',
  'Passwords, tokens, card numbers, personal data, precise location, and full request or response bodies from authenticated endpoints. Logs end up in crash reports and third party dashboards, so I strip that at the source rather than relying on a filter later. I log event names and ids, which is enough to debug, and nothing that would be a problem if it leaked.',
  `// bad
console.log('login response', response);

// good
log.info('login.success', { userId: user.id, method: 'password' });

Sentry.init({ beforeSend: e => redact(e, ['authorization', 'password', 'token']) });`
],
[
  'How do you handle biometric authentication?',
  'Biometrics do not authenticate against the server, they unlock a secret that is already on the device. So I store the refresh token in the Keychain or Keystore with biometric access control, and a successful scan releases it, and the server still validates that token. I always keep a passcode fallback, and I make sure the stored credential is invalidated if the enrolled fingerprints or face change.',
  `await Keychain.setGenericPassword('auth', refreshToken, {
  accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,  // invalidated on re-enrol
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
});`
],
[
  'What is root/jailbreak detection?',
  'It is checking whether the device has been rooted or jailbroken, which means the sandbox guarantees no longer hold and local storage can be read. It is a risk signal, not real protection, because a determined attacker can bypass it. For a banking or payments app I use it to add friction or block high risk actions, but I never rely on it instead of server side checks.',
  `const compromised = await JailMonkey.isJailBroken();
if (compromised) {
  disableFeature('offline_pin_login');   // reduce risk rather than just block
  telemetry.warn('device.compromised');
}`
],
[
  'How do you validate input?',
  'On the server always, because the client can be bypassed. Client side validation is for user experience, not security. On the device I validate with a schema at the boundary, so untrusted JSON becomes a typed object in one place, and I reject bad data instead of trying to fix it. I apply the same suspicion to deep links, push payloads and QR codes.',
  `const Order = z.object({ id: z.string().uuid(), total: z.number().nonnegative() });

const parsed = Order.safeParse(await res.json());
if (!parsed.success) throw new ApiError('bad payload');
// the server checks the same rules again`
],
[
  'What is least privilege?',
  'Everything gets the minimum access it needs, for the shortest time. In an app that means only asking for the permissions a feature actually uses and only when it is used, scoping tokens to specific operations with a short lifetime, and keeping admin capabilities out of the client entirely. It limits the damage when something is compromised.',
  `scope: 'orders:read'      // this screen only reads orders
expires_in: 900           // 15 minutes
// no admin scope ever reaches the mobile client`
],
[
  'How do you handle dependency security?',
  'Automated scanning in CI with `npm audit` or Snyk, Dependabot for updates, a committed lockfile, and a quick review before adding anything new: is it maintained, how many extra packages does it pull in, does it need native code. I pin versions, upgrade in small regular batches instead of one big jump, and treat a critical advisory as something that blocks the release.',
  `npm audit --audit-level=high
npx license-checker --failOn 'GPL-3.0'

# before adding a dep: maintained? size? transitive count? native code?`
],
[
  'What is threat modeling?',
  'It is sitting down before building and asking what we are protecting, who would want it, how they would get it, and what we will do about it. I sketch the data flows, mark the trust boundaries, walk through the categories like spoofing and tampering, then rank by likelihood and impact and fix the top ones. Doing it early is much cheaper than finding the gap in a penetration test.',
  `Asset:    stored payment token
Threat:   extracted from a lost or rooted device
Impact:   high      Likelihood: medium
Control:  Keystore + biometric gate + short TTL + server side revocation`
],
[
  'How do you secure offline data?',
  'I start by storing less, because if it does not need to be on the device it should not be there. What is left goes in encrypted storage, so MMKV with a key held in the Keychain, or SQLCipher for a database. I scope the data per user, wipe it on logout and when a token is revoked, and never write personal data to plain files or logs.',
  `const key = await Keychain.getGenericPassword('db-key');
const storage = new MMKV({ id: 'user-' + userId, encryptionKey: key.password });

async function logout() { storage.clearAll(); await db.destroy() }`
],
[
  'How do you respond to a security incident?',
  'Contain first, so revoke tokens, turn the feature off with a flag, rotate credentials. Then work out the scope, which data, how many users, over what period. Then tell the people who need to know, including legal, because disclosure deadlines are real. Fix and verify, and afterwards run a blameless post mortem and turn the findings into controls and tests so the same kind of issue is caught next time.',
  `1. contain    - revoke sessions, kill switch the endpoint
2. assess     - what data, whose, how long
3. notify     - security, legal, leadership, users if required
4. remediate  - fix, force upgrade or OTA if needed
5. learn      - post mortem, add detection and a regression test`
],
]);

add('Testing & Quality', [
[
  'What is the testing pyramid?',
  'It is the shape of a good test suite. A wide base of fast unit tests, fewer integration tests in the middle, and a small number of end to end tests on top. The reason is cost and speed. Unit tests run in seconds and tell me exactly what broke, end to end tests take minutes and only tell me something is wrong. The upside down version, where most testing is manual or end to end, is what makes releases slow and stressful.',
  `unit        (~70%)  pure functions, reducers, hooks  - milliseconds
integration (~20%)  a screen with the network mocked - seconds
e2e         (~10%)  login, checkout on a device      - minutes`
],
[
  'What should unit tests test?',
  'The behaviour of one piece of code in isolation, so given this input I expect this output. Good candidates are pure functions, reducers, selectors, validators and custom hooks. I test the public behaviour, not internal details, because otherwise every refactor breaks the tests even though nothing is actually wrong. And I make sure to cover the edges, like empty, null, zero and the error case, because that is where bugs actually are.',
  `describe('calculateShipping', () => {
  it('is free above the threshold', () => expect(calculateShipping(120)).toBe(0));
  it('charges the fee below it',     () => expect(calculateShipping(99)).toBe(5));
  it('handles zero',                 () => expect(calculateShipping(0)).toBe(5));
  it('rejects negatives',            () => expect(() => calculateShipping(-1)).toThrow());
});`
],
[
  'What are integration tests?',
  'They test several pieces working together, like a component with its hooks, store and navigation, with only the network mocked. For me they give the most value in a React app, because most real bugs are in the wiring rather than inside one function, like a prop not passed or a loading state that never clears. I write them from the user point of view, so they survive refactors.',
  `render(<OrdersScreen />, { wrapper: AppProviders });

fireEvent.press(screen.getByLabelText('Refresh'));
expect(await screen.findByText('Order #1024')).toBeTruthy();
// hook + store + component + navigation, network mocked`
],
[
  'What are end-to-end tests?',
  'They drive the real app on a device or simulator, tapping through actual screens with nothing mocked inside the app. They are the only tests that prove the whole thing works, including native modules, permissions and navigation. But they are slow, expensive to maintain and the most likely to be flaky, so I keep the set small and only for the journeys that must never break, like login and checkout.',
  `it('completes checkout', async () => {
  await element(by.id('login-email')).typeText('test@example.com');
  await element(by.id('login-submit')).tap();
  await element(by.id('buy-now')).tap();
  await expect(element(by.text('Order confirmed'))).toBeVisible();
});`
],
[
  'How does Detox work?',
  'Detox runs end to end tests on the device and hooks into the app internals, so it knows when the app is idle, meaning animations have finished and network requests have settled. It only sends the next action then, which removes the arbitrary sleeps that make mobile tests flaky. I add `testID` props rather than matching on text, because text changes with copy and translations, and I run it on a fixed simulator image in CI so results are consistent.',
  `<Pressable testID="buy-now" onPress={buy} />

await element(by.id('buy-now')).tap();
await waitFor(element(by.id('confirmation'))).toBeVisible().withTimeout(5000);`
],
[
  'How do you test React components?',
  'With React Native Testing Library, querying the way a user would see it, so by text, label or role, and only falling back to `testID` when there is nothing user visible. I assert on what is rendered and what happens, never on internal state, so changing `useState` to `useReducer` does not break a single test. I cover the states that actually ship, which are loading, empty, error and success. A nice side effect is that querying by label means the tests fail if I break accessibility.',
  `render(<SearchScreen />);

fireEvent.changeText(screen.getByLabelText('Search'), 'shoes');
expect(await screen.findByText('3 results')).toBeTruthy();`
],
[
  'What makes a test flaky?',
  'Anything that is not deterministic. Real timers and sleeps, unmocked network calls, depending on the current date or timezone, shared state leaking between tests, assuming test order, and race conditions where the assertion runs before the update. My fixes are fake timers, a fixed clock, mocking the network, resetting state in `beforeEach`, and using `findBy` and `waitFor` instead of sleeping. A flaky test is worse than no test, because people start ignoring red builds.',
  `jest.useFakeTimers();
jest.setSystemTime(new Date('2026-01-01'));

beforeEach(() => { queryClient.clear(); jest.clearAllMocks() });

await waitFor(() => expect(screen.getByText('Saved')).toBeTruthy());   // never sleep`
],
[
  'How do you mock network calls?',
  'At the network boundary rather than mocking my own modules, so the real API client and error handling still run. I use MSW, which intercepts the request and returns a fixture, and the same handlers work in tests and in local development. That lets me test the states that are hard to produce for real, like a 500, a timeout, or an empty list. If I mocked my own api module instead, those code paths would never execute.',
  `const server = setupServer(
  http.get('/orders', () => HttpResponse.json([{ id: '1' }])),
);

server.use(http.get('/orders', () => new HttpResponse(null, { status: 500 })));
expect(await screen.findByText('Something went wrong')).toBeTruthy();`
],
[
  'What is snapshot testing good for?',
  'Catching accidental changes in output that is stable and does not change often, like a design system component or a serialiser. The problem is big snapshots of whole screens, because nobody reviews them properly and people just press update until the snapshot means nothing. So I keep them small and focused, review them as part of the diff, and use real assertions for behaviour, because a snapshot never tells me the button actually works.',
  `// useful - small and reviewable
expect(render(<Badge status="error" />).toJSON()).toMatchSnapshot();

// useless - nobody reviews 800 lines
expect(render(<CheckoutScreen />).toJSON()).toMatchSnapshot();`
],
[
  'What is code coverage?',
  'It is the percentage of code that the tests actually run. It is a useful signal but a bad target, because a hundred percent coverage with weak assertions proves nothing, and chasing the number leads to tests written for the metric. I use it to find untested areas, I look at branch coverage rather than lines, and I set a real threshold on critical modules like payments rather than one number for the whole repo.',
  `coverageThreshold: {
  global:                     { branches: 60, lines: 70 },
  './src/features/payments/': { branches: 90, lines: 95 },
}`
],
[
  'How do you test accessibility?',
  'Partly automated and partly manual, because tools only catch some of it. In tests I query by label and role, so a missing label fails naturally. I lint for missing labels and check contrast and touch target sizes. But the real check is manual, navigating with VoiceOver and TalkBack and running at the largest font size, because that is where you find things like a reading order that makes no sense.',
  `fireEvent.press(screen.getByRole('button', { name: 'Add to cart' }));

// manual checklist per screen
VoiceOver / TalkBack · font scale 200% · contrast >= 4.5:1 · targets >= 44pt`
],
[
  'How do you test offline behavior?',
  'I make the connectivity state injectable, so tests can simulate offline, slow, and flapping networks. Then I test the whole path: reads coming from the cache, writes going into the queue, the queue flushing on reconnect, retries not applying twice, and conflict resolution. On a device I check with airplane mode, including killing the app while writes are still pending, which is the case people usually forget.',
  `it('queues a write offline and flushes on reconnect', async () => {
  net.setState({ isConnected: false });
  await saveNote(draft);
  expect(await outbox.size()).toBe(1);

  net.setState({ isConnected: true });
  await waitFor(async () => expect(await outbox.size()).toBe(0));
});`
],
[
  'What is contract testing?',
  'It checks that the client and the server agree on the shape of the API, without running both together. The client declares what it sends and expects, that contract is published, and the server runs it against its own build, so a breaking change is caught in the backend pipeline instead of in production. It matters more for mobile than for web, because old app versions stay on devices for years and cannot be redeployed.',
  `// consumer expectation
{ method: 'GET', path: '/orders/1',
  willRespondWith: { status: 200, body: { id: like('1'), total: like(9.99) } } }

// the provider replays every consumer contract in CI, including old app versions`
],
[
  'How do you approach a production bug?',
  'First I check the impact and contain it, so how many users, which versions, and is there a flag I can turn off while I investigate. Then I reproduce it, ideally as a failing test rather than by clicking around, because that test proves the fix and stops it coming back. Then I find the actual cause instead of patching the symptom, ship the smallest safe fix, and confirm with real data that it worked. After that a blameless post mortem about why it reached production.',
  `1. impact    - Sentry: 4% of sessions on 4.11.0, Android only
2. contain   - turn the flag off
3. reproduce as a failing test
4. fix and verify: crash free rate back above 99.5%
5. post mortem -> add the regression test and an alert`
],
[
  'What is a quality gate?',
  'An automated check a change has to pass before it moves forward. Types and lint clean, tests green, coverage not dropping, no high severity advisories, bundle size within budget, and for a release, crash free sessions above the threshold during the staged rollout. The point is that quality is enforced by the pipeline instead of depending on who is reviewing. I keep the gates fast and reliable, because a slow or flaky gate gets bypassed.',
  `# pull request gate
tsc --noEmit && eslint . && jest --coverage --changedSince=origin/main
npm audit --audit-level=high

# release gate: crash free > 99.5% at 10% rollout before going wider`
],
]);

add('CI/CD & Release', [
[
  'What is CI?',
  'Continuous integration means every push is automatically built and tested against the main branch. The point is the feedback loop, because integrating small changes often means problems are found while they are small and while the author still remembers the context. For a mobile project a good run installs dependencies from cache, type checks, lints, runs the tests and builds both platforms. It has to be fast and reliable, because a pipeline that takes forty minutes or fails randomly gets ignored.',
  `on: [pull_request]
steps:
  - uses: actions/cache@v4          # node_modules, Gradle, Pods
  - run: yarn install --frozen-lockfile
  - run: yarn tsc --noEmit && yarn lint && yarn test --ci
  - run: yarn build:android:debug`
],
[
  'What is CD?',
  'Continuous delivery means every build that passes the pipeline is automatically packaged, signed and sent to a distribution channel like TestFlight or Play internal testing, so releasing is routine instead of an event. Continuous deployment goes further and pushes straight to users, which works for a backend but only partly for mobile because of store review. So for apps I automate everything up to the submission and keep a human decision on the rollout.',
  `merge to main -> build and sign -> upload to TestFlight / Play internal
              -> smoke tests on the artifact
              -> manual approval -> staged rollout 10% -> 50% -> 100%`
],
[
  'What stages belong in a mobile pipeline?',
  'Install with a warm cache, then static checks like types and lint, then unit and integration tests, then the native builds for both platforms, signing, and uploading the artifacts tagged with the version and commit. After that end to end tests against the real artifact, security and licence scanning, uploading source maps and symbols so crash reports are readable, and distributing to testers. I order it cheapest first, so a lint error fails in thirty seconds instead of after a twenty minute build.',
  `install (cached)
  -> typecheck + lint        (fails fast)
  -> unit + integration tests
  -> build android + ios     (in parallel)
  -> sign + upload artifacts
  -> detox smoke tests
  -> upload sourcemaps + dSYMs
  -> distribute to testers`
],
[
  'How do you manage signing certificates?',
  'Never on a developer laptop and never in the repository. They live in an encrypted store, like Fastlane Match backed by a private repo or the CI secret store, with access limited to the release pipeline and a couple of owners. The CI job imports them into a temporary keychain at build time and cleans up after. I also track the expiry dates with a reminder, because an expired certificate always seems to be discovered on the day of an urgent release.',
  `match(type: 'appstore', readonly: is_ci)      # certs from the encrypted repo
# android: keystore and passwords injected as CI secrets, never committed

# reminder 60 days before expiry`
],
[
  'What is semantic versioning?',
  'Major dot minor dot patch. Major means a breaking change, minor means new functionality that is still backward compatible, and patch means a bug fix. It tells consumers what to expect, which matters most for shared libraries and for the API contract with the backend. For the app itself the stores also need a build number that always increases, which I generate in CI rather than by hand.',
  `4.7.2
| | +- patch: bug fix
| +--- minor: new feature, backward compatible
+----- major: breaking change

versionName "4.7.2"     # what users see
versionCode  1042       # CI counter, must always increase`
],
[
  'What are feature flags?',
  'They are switches that let me deploy code without releasing the feature. For mobile they are especially important, because I cannot take back a binary that is already installed, so a flag is my only instant kill switch. I use them to merge unfinished work safely, run percentage rollouts, and turn off something broken remotely. The discipline is treating every flag as temporary, with an owner and a removal date, otherwise the code fills up with dead conditionals.',
  `if (flags.newCheckout) return <CheckoutV2 />;
return <CheckoutV1 />;

// each flag: owner, created date, remove-by date
// always default to the safe path if the config fetch fails`
],
[
  'What is a staged rollout?',
  'Releasing to a small percentage of users first and increasing gradually while watching the health metrics. Both stores support it. It limits the damage from a bad build, so a crash that would have hit everyone hits one percent instead. I decide the promotion criteria in advance, like crash free sessions above the threshold and no drop in the main funnel, and I hold each stage long enough to get real data.',
  `day 1: 1%    -> watch crash free sessions, ANRs, conversion
day 2: 10%
day 4: 50%
day 6: 100%
// any gate breached -> halt, fix or turn the flag off`
],
[
  'How do you handle app-store release risk?',
  'By assuming review is slow and the binary cannot be taken back. So I submit with buffer before any deadline, keep the app easy to review with demo credentials and clear permission descriptions, and put anything risky behind a server controlled flag so I can disable it without resubmitting. I keep an OTA channel for JavaScript only hotfixes, use phased release so I can halt, and keep the previous build ready.',
  `- risky feature behind a remote flag (kill switch, no resubmission)
- JS only hotfix path via OTA, pinned to the native version
- phased release on, halt available
- expedited review kept for real emergencies`
],
[
  'What is build reproducibility?',
  'It means the same commit always produces the same build, on any machine. It matters because otherwise you cannot recreate a build to debug it, and "works on my machine" becomes a real blocker. I get there with a committed lockfile, pinned native dependency versions, and pinned tool versions for Node, Ruby, Gradle and Xcode, plus release builds only ever coming from CI. Then a crash from a release build can always be traced back to an exact commit.',
  `.nvmrc / .ruby-version / gradle-wrapper.properties   # pinned toolchain
yarn.lock and Podfile.lock committed
pod 'SomeSDK', '3.2.1'        # exact, not '~> 3.2'

# release builds only from CI, tagged with the commit`
],
[
  'How do you manage environment configuration?',
  'Separate build variants for development, staging and production, each with its own bundle id so they can be installed side by side, its own API URL, icon and name. The values come from environment files and CI secrets and are never committed, and the environment is chosen at build time, not by a toggle inside a production build. Real secrets do not go on the device at all, only public identifiers and endpoints.',
  `# .env.staging (not committed)
API_URL=https://staging-api.example.com

// android flavors / ios schemes -> different applicationId and display name
com.example.app.staging   "App (Staging)"`
],
[
  'What is an artifact repository?',
  'It is a versioned store for build outputs, so the APKs, IPAs, source maps and symbol files, keyed by version and commit with a retention policy. The value is traceability. When a crash comes in from version 4.7.2 build 1042, I can fetch exactly that build and its source maps and get a readable stack trace months later. It also means the artifact that was tested is the one that ships, instead of rebuilding at each stage.',
  `artifacts/4.7.2+1042/
  app-release.aab
  app-release.ipa
  sourcemaps/
  symbols/
  build-metadata.json   { commit, branch, toolchain, timestamp }`
],
[
  'How do you roll back a mobile release?',
  'You cannot remove a binary from someone device, so a mobile rollback is really four options in order of speed. Turn the feature flag off, which is instant. Push a JavaScript only fix over the air if the bug is in JS. Halt the staged rollout so no more users get it. Or ship a fixed build as a new version, because the stores do not let you bring back an older one. That is exactly why flags and staged rollouts are the rollback plan.',
  `1. flag off               - seconds, all users
2. OTA JS update          - minutes, same native version
3. halt staged rollout    - stops new installs
4. new build via review   - hours to days`
],
[
  'What metrics do you monitor after release?',
  'Stability first, so crash free sessions and users, the ANR rate on Android, and any new issues by version. Then performance, like cold start and screen load times. Then adoption of the new version and the conversion of the main journeys, plus API error rates. And finally store ratings and support tickets. I compare against the previous version rather than an absolute number, and I alert on the change so a regression pages someone instead of being noticed a week later.',
  `stability:   crash free sessions > 99.5%, ANR < 0.47%
performance: cold start p90, time to interactive
adoption:    % of users on the new version
business:    checkout conversion, API 5xx rate
alerting:    on the change vs the previous version`
],
[
  'What is trunk-based development?',
  'Everyone works off one main branch with short lived branches that last hours or a day or two, instead of long feature branches that drift for weeks. Unfinished work is hidden behind feature flags rather than behind a branch. The benefit is that merge conflicts stay small and CI is always testing something close to what ships. It does need good automated tests and flags, otherwise it just means shipping broken code faster.',
  `main --o--o--o--o--o--   (always releasable)
       \\  /  \\  /
        oo    oo          (branches measured in hours, merged behind flags)`
],
[
  'How do you improve a slow CI pipeline?',
  'Measure where the time goes first, then fix the biggest block. The usual wins are caching node modules, Gradle and Pods, running the two platform builds in parallel, putting the cheap checks first so failures come back in seconds, running only the affected tests on pull requests with the full suite nightly, and using bigger runners, because engineer time costs more than compute. I also fix flaky tests instead of retrying them, since retries just hide the cost.',
  `before: 38 min      after: 11 min

- cache node_modules / Gradle / Pods       -6 min
- android and ios builds in parallel       -9 min
- lint and typecheck as a fast first job   fails in 40s
- jest --changedSince on PRs               -5 min`
],
]);

add('Leadership & System Design', [
[
  'How do you lead a technical project?',
  'I make sure the problem and what success looks like are agreed before any design work, because most failed projects were solving a fuzzy problem. Then a short design document with the options and trade offs, reviewed by the people who will maintain it. I break the work into slices that each deliver something visible, so we can change course instead of finding out at the end. During delivery my job is unblocking people, keeping the scope honest, and flagging risks early. And I make sure ownership is spread across the team, not concentrated in me.',
  `1. problem and success metric agreed and written down
2. design doc: options, trade offs, decision, risks
3. slice into demonstrable increments behind flags
4. weekly: progress, risks, decisions needed
5. launch checklist: rollout, monitoring, rollback, owner`
],
[
  'How do you handle disagreement?',
  'I separate the technical question from the personal one. First I make sure I actually understand their position, and I repeat it back, which usually shows we are optimising for different things. Then I move it to evidence, so what does the data say, or can we prototype both for a day. If the decision is easy to reverse, I would rather just try it than argue. If we still disagree, the person who owns the outcome decides, and I disagree and commit properly, and we write down what would make us revisit it.',
  `- restate their position until they agree it is fair
- name what each side is optimising for
- decide with evidence: a spike, a benchmark, or data
- reversible? just try it
- still stuck? the owner decides, everyone commits`
],
[
  'How do you mentor engineers?',
  'I start from where they are and what they want, not from what I find interesting. Mostly it is giving work that stretches them a bit with enough support that it is safe to fail, and pairing on the hard parts. I try to ask questions instead of giving answers, because the goal is that they can solve the next one without me. Code review is my main teaching tool, so I explain the reasoning rather than just the change. And I give feedback quickly and privately, and credit publicly.',
  `- a stretch task with a clear safety net
- pair on the hard 20%, let them own the rest
- review comments explain the why
- feedback: specific, timely, private. praise: public
- success = decisions they now make without me`
],
[
  'What makes a good design document?',
  'It starts with the problem and why it matters now, and the constraints like deadline, team size and existing systems, because those decide what a good answer even looks like. Then the options that were actually considered with honest trade offs, the decision and the reasoning, and what is out of scope. I add the risks, the rollout plan, and how we will know it worked. It should be short enough that people actually read it, and its real purpose is to surface disagreement early while changing direction is still cheap.',
  `1. problem and why now
2. constraints and non goals
3. options considered, with trade offs
4. decision and reasoning
5. risks and mitigations
6. rollout, monitoring, rollback
7. how we measure success`
],
[
  'How do you estimate work?',
  'I break the work down until the pieces are small enough to reason about, because anything I estimate as two weeks really means I do not know yet. I give a range rather than a single number, and I say what the estimate assumes and what would blow it up. If something is genuinely unknown, I timebox a spike first and estimate after. I include review, testing and release, not just the coding. And I re-estimate as we learn, and raise slippage as soon as I see it rather than at the deadline.',
  `Feature X: 6-9 days
  assumes:  API contract fixed, designs final, no native module
  risk:     payments SDK integration - spike first, 1 day
  includes: review, tests, QA fixes, staged rollout`
],
[
  'How do you manage technical debt?',
  'I make it visible and measurable instead of just complaining about it, so which parts of the codebase are slowing us down and by how much. I separate debt we took on deliberately to hit a date, which should have a payback plan, from debt that came from learning something later. I fix things while I am already in that file, and for bigger items I make the case in business terms, like this refactor removes the bugs causing our support load. And I avoid big rewrites, because doing it incrementally with tests around it almost always works better.',
  `debt register: area | cost per month | effort | risk if ignored

- fix in place while you are already there
- 15-20% of each cycle, agreed with the product owner
- big items: make the case in delivery speed or incident terms
- prefer incremental migration over a rewrite`
],
[
  'How do you prioritize?',
  'By impact against effort, with the constraints stated openly. I ask what happens if we do not do it and who is affected, so anything actively costing users or money, like a crash or a broken funnel, goes first. Then I look at whether it is reversible, because cheap reversible things can just be tried, while one way doors deserve more thought. I keep the list short and honestly ordered instead of pretending everything is a priority, and I say no clearly with a reason, because an unspoken no damages trust much more.',
  `ask: what breaks if we do not do it? who is affected? is it reversible?

now    - user facing bugs, security, blocked teammates
next   - best impact per effort, with a stated goal
later  - explicitly deferred, reason recorded
never  - said out loud, not left silently in the backlog`
],
[
  'How do you design for scale?',
  'I design for about ten times the current load, not a thousand, because designing for imaginary scale costs real time now. First I get the actual numbers, users, requests per second, payload size and growth. Then I find the bottleneck, which is usually the database or one synchronous path. The standard moves are caching at the right layer, pagination, moving work into a queue if it does not need to be immediate, and keeping services stateless so they scale out. On the client, scale means pagination, local caching and small payloads.',
  `numbers first: 500k daily users, 40 rps peak, 12 KB payload, +15% a quarter

then: cache -> paginate -> queue the async work -> shard only if needed
client: cursor pagination, local cache, small payloads, retry with backoff`
],
[
  'How do you design a notification system?',
  'I start from the requirements, so which events, which channels, what latency is acceptable, and how users control it. The architecture is an event producer, a notification service that applies user preferences and removes duplicates, a template layer, and adapters for APNs and FCM, all behind a queue so a provider outage does not lose events. Device tokens are stored per user and cleaned up when the provider says they are dead. Then the details that decide whether people keep the app: rate limiting, quiet hours and timezones, granular opt outs, deep links that land on the right screen, and delivery metrics.',
  `event -> queue -> notification service (preferences, dedupe, rate limit)
      -> template -> channel adapter (APNs / FCM / email)
      -> delivery log and metrics

device_tokens(user_id, token, platform, last_seen)
prefs(user_id, category, channel, quiet_hours, timezone)`
],
[
  'How do you design an upload flow?',
  'For mobile I assume the network will fail halfway, so it has to be resumable. The client asks my API for a pre-signed URL and uploads directly to object storage, which keeps big payloads off my servers. Large files go in chunks so they can resume, and the upload runs in a background task so leaving the app does not kill it. I resize and compress on the device first, show real progress with cancel and retry, validate type and size on both sides, and let the server confirm and process asynchronously.',
  `1. POST /uploads -> { uploadId, presignedUrl, partSize }
2. PUT the parts directly to storage (resumable, background task)
3. POST /uploads/:id/complete
4. server verifies and processes async
5. client is told via push or polling`
],
[
  'How do you design authentication for a mobile app?',
  'OAuth with PKCE through the system browser, not an embedded webview, so the app never handles the password. The server returns a short lived access token, kept in memory, and a longer lived refresh token stored in the Keychain or Keystore, optionally behind biometrics. The API client refreshes on a 401 with a single in flight refresh so concurrent requests do not all trigger one. Refresh tokens rotate and can be revoked server side, so logout really ends the session. Then the real world parts: multiple devices, forced logout, and step up auth for sensitive actions.',
  `login -> PKCE in the system browser -> code -> tokens
access token  (15 min, memory only)
refresh token (30 days, Keychain, rotating)

401 -> single refresh -> retry the original request
logout -> revoke on the server + wipe secure storage`
],
[
  'How do you handle an incident as a leader?',
  'My first job is to reduce the chaos, so name an incident commander, which might not be me, put someone on communications, and let the responders work without answering status pings. Mitigate before diagnosing, because a rollback or a flag flip now beats a perfect root cause in an hour. I keep a timeline as we go, since nobody remembers it accurately afterwards. I update stakeholders on a steady rhythm with what we know and what we are doing. And afterwards a blameless post mortem, with the actions actually scheduled rather than just written down.',
  `roles: commander | responders | comms   (never one person doing all three)
order: mitigate -> diagnose -> fix -> verify
comms: every 30 minutes, even with nothing new
after: blameless post mortem, action items with owners and dates`
],
[
  'What is a good code review?',
  'Timely, because a review sitting for two days blocks someone. Focused on what matters, so correctness, edge cases, security and readability, and whether the approach fits the system, not style, which the linter should own. I say clearly what is blocking and what is just a suggestion, ask questions instead of giving verdicts when I am not sure, and explain the reasoning so it teaches something. I approve when it is better than what is there, not when it is perfect. And as an author I keep pull requests small, because a four hundred line diff gets a rubber stamp while a forty line one gets a real review.',
  `blocking:   "this crashes when items is empty"
suggestion: "nit: could be a selector, not blocking"
question:   "what happens if the refresh fails here?"

// automate style, review substance, keep PRs small`
],
[
  'How do you communicate with nontechnical stakeholders?',
  'I lead with the outcome and the impact rather than the implementation, so what it means for users, the timeline or the cost. I use their vocabulary and drop the jargon. For trade offs I give options with consequences instead of technical detail, like we can ship on this date without that feature, or two weeks later with it. Bad news goes early and with a plan attached. And I am honest about confidence, because once people learn my estimates are reliable, they give me a lot more room.',
  `instead of: "we need to refactor the persistence layer"
say:        "this is why saving is slow and why the same bugs keep coming back.
             Two weeks now removes them, or we keep paying about a day a week."

always: outcome first, options with consequences, bad news early`
],
[
  'How do you know a team is healthy?',
  'Mostly signs of safety and flow. People disagree openly in reviews and admit mistakes without hedging. Work moves predictably, with short lived branches, small pull requests and regular releases, instead of heroic pushes at the end of a quarter. Knowledge is shared, so one person can take a holiday without the team stopping. Incidents lead to learning rather than blame, and on call is not exhausting. New joiners ship something real in their first couple of weeks, which tells me both the onboarding and the codebase are in decent shape. And people ask for help early instead of getting stuck quietly.',
  `healthy:   open disagreement · small frequent PRs · more than one person
           knows each area · blameless post mortems · fast onboarding
unhealthy: silent reviews · heroics · one person owns everything
           · repeated incidents with no follow through`
],
]);

add('Introduction', [
[
  'Tell me about yourself',
  `Hi, I am Aprajati, a Senior React Native developer with over five years of experience building scalable mobile applications for both iOS and Android. I have worked across the full development cycle, and I have also gone deep into the native side, building native widgets and watch apps for both platforms, so whatever a mobile application needs, I have worked hands on with it. My journey started with WordPress and web development, then moved into React, and then into React Native, which is where I focus most now. I have worked across several domains: enterprise apps like DAMAC Living and DAMAC Central, health apps like MediWatcher and PeriodSakhi, baby tracking apps like The ParentZ, ride sharing apps like ServiceTrack, e commerce platforms, and auditing applications. Beyond the coding, I have worked directly with clients, closely with the CEO, coordinated with backend and QA teams, and led a small team of developers. I believe a good software developer should be able to handle whatever a project needs, whether that is the client, the leadership, or the team. So overall, I have handled whatever it takes to build a good product.`,
  `Aprajati - Senior React Native Developer - 5+ years - iOS & Android

path        WordPress / web  ->  React  ->  React Native (main focus)

native      native widgets + watch apps, both iOS and Android
            full cycle: build -> release -> maintain

domains     enterprise    DAMAC Living, DAMAC Central
            health        MediWatcher, PeriodSakhi
            baby tracking The ParentZ
            ride sharing  ServiceTrack
            also          e-commerce, auditing apps

beyond code direct with clients · worked closely with the CEO
            coordinated backend + QA · led a small dev team`
],
]);

add('Design Principles & Patterns', [
[
  'Explain the Single Responsibility Principle with a React Native example.',
  'A module should have one reason to change. The way I check it in a React Native codebase is to ask how many different people could ask me to edit this file. If a designer, a backend engineer and a product manager could all send me to the same component, it is doing three jobs. The usual offender is a screen that fetches, transforms, holds form state and renders. I split it into a hook that owns the data, a pure function that owns the rule, and a component that only renders. The rule becomes testable without a renderer, and a design change stops touching business logic.',
  `// before - one file, three reasons to change
function CheckoutScreen() {
  const [cart, setCart] = useState([]);
  useEffect(() => { fetch(url).then(r => r.json()).then(setCart); }, []);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0) * 1.2;
  return <View>...</View>;
}

// after - one reason each
useCart()            // data + caching        (backend changes)
calcTotal(cart)      // pure pricing rule     (product changes)
<CheckoutScreen />   // markup only           (design changes)`
],
[
  'Explain the Open/Closed Principle with a React Native example.',
  'Open for extension, closed for modification. In practice it means adding a new case should not mean editing a switch statement that everyone else depends on. The smell is a component that grows another if branch every sprint. I fix it either with composition, so the caller passes what is different, or with a registry, so a new type registers itself instead of the core file knowing about it. The payoff is that adding a payment method or a new card type touches one new file and nothing existing, so the regression risk stays flat instead of growing.',
  `// closed for extension - every new type edits this file
function Row({ item }) {
  if (item.type === 'text')  return <Text />;
  if (item.type === 'image') return <Image />;
  if (item.type === 'video') return <Video />;   // and again next sprint
}

// open - the map is the extension point
const RENDERERS = { text: TextRow, image: ImageRow, video: VideoRow };
const Row = ({ item }) => {
  const C = RENDERERS[item.type] ?? UnknownRow;
  return <C item={item} />;
};
// new type = new file + one registry line, core untouched`
],
[
  'Explain the Liskov Substitution Principle with a React Native example.',
  'Anything that claims to be a type must work everywhere that type is expected, without the caller checking which one it got. In React the equivalent is a component contract. If I write a custom Button that ignores the disabled prop, or a wrapper around FlatList that silently drops onEndReached, I have broken substitution, and every caller now needs to know which one they have. My rule is that a replacement may add behaviour but must not remove or contradict what the original promised. The same applies to storage adapters, an in memory fake must behave like the real one, or my tests are lying.',
  `// violates - caller cannot swap safely
const FancyButton = ({ onPress, disabled }) =>
  <Pressable onPress={onPress} />;      // disabled ignored

// honours the contract
const FancyButton = ({ onPress, disabled, ...rest }) =>
  <Pressable onPress={onPress} disabled={disabled}
    style={disabled && styles.dim} {...rest} />;

// same idea for adapters
interface Storage { get(k): Promise<string|null>; set(k, v): Promise<void> }
MMKVStorage · AsyncStorageAdapter · InMemoryStorage   // all interchangeable`
],
[
  'Explain the Interface Segregation Principle with a React Native example.',
  'No consumer should be forced to depend on things it does not use. In React the interface is usually the prop list, so a component asking for a whole user object when it only needs the name is a violation, because now it cannot be reused or tested without building a full user. I keep props narrow and specific, and I do the same with service interfaces, so a component that only reads a flag depends on a read method rather than the entire config client. Narrow interfaces mean smaller mocks in tests and far fewer accidental re-renders.',
  `// fat - needs a whole user, re-renders on any field change
<Avatar user={user} />

// segregated - depends only on what it uses
<Avatar name={user.name} uri={user.photoUrl} />

// services too
type Analytics = { track(e, p?): void }        // what the screen needs
type AnalyticsAdmin = Analytics & { flush(): Promise<void>; reset(): void }
// screens take Analytics, only bootstrap takes AnalyticsAdmin`
],
[
  'Explain the Dependency Inversion Principle with a React Native example.',
  'High level code should depend on an abstraction, not on a concrete library. The practical version is that my feature code never imports AsyncStorage, axios or a notification SDK directly. It depends on a small interface, and the wiring at the app root decides the real implementation. That is what makes tests fast, because I pass a fake, and it is what made swapping AsyncStorage for MMKV a one file change for us. It also keeps vendor lock in contained, since the SDK only appears in the adapter layer.',
  `// depends on a detail
import AsyncStorage from '@react-native-async-storage/async-storage';
export const saveToken = t => AsyncStorage.setItem('token', t);

// depends on an abstraction
export type KV = { get(k: string): Promise<string|null>; set(k: string, v: string): Promise<void> };
export const makeAuthRepo = (kv: KV) => ({ saveToken: t => kv.set('token', t) });

// composition root picks the detail
const repo = makeAuthRepo(mmkvAdapter);      // app
const repo = makeAuthRepo(inMemoryKV());     // tests, no native module`
],
[
  'What are DRY, KISS and YAGNI, and when do they conflict?',
  'DRY says one piece of knowledge lives in one place. KISS says prefer the boring solution. YAGNI says do not build for a requirement nobody has asked for. They conflict often, and the honest answer is that DRY is the one people over apply. Two blocks that look the same but change for different reasons are not duplication, and merging them creates a shared component full of boolean flags. So I de-duplicate knowledge, like a pricing rule or a validation regex, and I tolerate duplicated markup. When in doubt I keep the simple copy, because deleting duplication later is easy and untangling a wrong abstraction is not.',
  `DRY   one source of truth for a RULE
        VAT rate, token refresh, date format   -> share these

not DRY  two screens that happen to look alike
        onboarding card vs promo card          -> let them diverge

KISS  useState before Redux · fetch before a client library
YAGNI no multi-tenant theming until tenant #2 is signed

bad DRY smell:  <Card variant="a" isPromo hideIcon compact showBadge />`
],
[
  'Why composition over inheritance?',
  'Inheritance ties the child to the parent forever, and any change to the base ripples into every subclass, which is exactly the coupling I am trying to avoid. Composition lets me assemble behaviour from small pieces and change one without touching the others. React is built around this, so the answer in an interview is easy: children, render props, and custom hooks instead of a BaseScreen class that everything extends. I have seen the inheritance version, a BaseScreen with fifteen protected methods, and nobody could change it safely because it had thirty subclasses.',
  `// inheritance - one base, thirty subclasses, nobody dares edit it
class BaseScreen extends React.Component { /* auth, analytics, loading, retry */ }
class ProfileScreen extends BaseScreen {}

// composition - opt into exactly what you need
const ProfileScreen = () => (
  <Screen>
    <RequireAuth>
      <Track name="profile">
        <ProfileBody />
      </Track>
    </RequireAuth>
  </Screen>
);
// behaviour as hooks too: useAuthGuard(), useScreenView('profile')`
],
[
  'Explain coupling and cohesion.',
  'Cohesion is how related the things inside one module are, and coupling is how much modules depend on each other. I want high cohesion and low coupling. In a React Native repo that means feature folders where everything for checkout lives together, and features talk through a small public index file rather than reaching into each other. My practical test is whether deleting a feature is a clean delete. If removing one screen breaks four unrelated ones, coupling is too high. The usual causes are a shared utils dump and a global store that every screen writes into.',
  `high coupling            low coupling
features/cart imports    features/cart imports
  ../orders/hooks/...      @/shared/api
  ../profile/utils/...     and its own folder

test: can I delete features/promo/ and only its route breaks?

smells: utils/index.ts with 40 unrelated helpers
        one global store slice written to by 12 screens`
],
[
  'What is the Law of Demeter and why does it matter in React?',
  'Talk to your immediate friends, not to strangers. The smell is a long chain like user.profile.settings.notifications.email, because now the caller knows the entire shape of somebody else data, and any backend rename breaks it in twenty files. In React it also causes needless re-renders, since a component depends on a whole object graph to read one leaf. I fix it by passing the leaf, or by exposing a selector or a small method that hides the shape. It is the same reasoning as interface segregation, just at the call site.',
  `// reaching through strangers
if (order.customer.address.country.code === 'AE') { ... }

// ask, do not reach
if (isDomestic(order)) { ... }          // rule lives with the domain
const isDomestic = o => o.customer?.address?.country?.code === 'AE';

// same in components
<Row user={user} />                     // knows everything
<Row name={user.name} tier={user.tier} />   // knows two things`
],
[
  'When is the Singleton pattern right, and when is it a trap?',
  'A singleton is one shared instance for the whole process. It is right for things that genuinely are one, like the API client, the analytics queue, the socket connection or the storage wrapper, because creating two would be a bug. It becomes a trap when it turns into hidden global state that modules mutate, since then tests leak into each other and nothing can be reset. My rule is that a singleton may hold a connection or a config, but not user state, and it must expose a way to reset it for tests. In React Native it is also worth remembering that a module singleton lives across screens but dies with the process, so it is not persistence.',
  `// fine - one connection, created lazily, resettable
let client: ApiClient | null = null;
export const getClient = () => (client ??= createClient(config));
export const __resetClient = () => { client = null; };   // tests

// trap - global mutable app state
export const session = { user: null };   // who wrote to it? when?
// -> put it in a store/context with clear owners instead`
],
[
  'Explain the Factory pattern with a mobile example.',
  'A factory is a function whose job is to decide which concrete thing to build and to hide that decision from callers. I use it whenever construction depends on the platform, the environment or a flag, so the rest of the app just asks for the thing. Typical cases in React Native are a storage adapter chosen per platform, an analytics client that is a no op in development, or a payment provider chosen by region. The benefit is that the conditional exists once, at the edge, instead of being repeated at every call site.',
  `export function createTracker(env: Env): Analytics {
  if (env.e2e)   return noopTracker();
  if (__DEV__)   return consoleTracker();
  return segmentTracker(env.writeKey);
}

// callers never branch
const tracker = createTracker(env);
tracker.track('checkout_started');

// same for payments
const gateway = createGateway(user.region);   // stripe | tap | paypal`
],
[
  'Explain the Observer or pub/sub pattern in a React Native app.',
  'One thing publishes an event and many things react, without the publisher knowing who is listening. React Native already uses it everywhere: AppState, NetInfo, Dimensions, keyboard events and the native event emitter are all observers. I add my own when something happens outside the React tree and several unrelated features care, like a session expiring or a push arriving while the app is open. The rules I follow are that every subscribe must return an unsubscribe used in a cleanup, and the payload must be small and typed. What I avoid is using an event bus as the main state mechanism, because then data flow becomes impossible to trace.',
  `type Events = { 'session:expired': void; 'cart:updated': { count: number } };

const bus = mitt<Events>();
bus.emit('session:expired');

useEffect(() => {
  const off = () => bus.off('session:expired', logout);
  bus.on('session:expired', logout);
  return off;                     // always unsubscribe
}, [logout]);

built in observers: AppState · NetInfo · Keyboard · Linking · DeviceEventEmitter`
],
[
  'Explain the Strategy pattern with a React Native example.',
  'Strategy means putting each variation of an algorithm behind the same interface and choosing one at runtime. It is the practical way to satisfy open closed. In mobile work I use it for sorting and filtering rules, for validation per country, for image compression quality per network type, and for auth flows that differ by tenant. In JavaScript a strategy is usually just a function or a plain object of functions, no classes needed. The value is that a new variant is a new entry, and the calling code never grows another branch.',
  `const sorters = {
  newest:   (a, b) => b.createdAt - a.createdAt,
  priceLow: (a, b) => a.price - b.price,
  rating:   (a, b) => b.rating - a.rating,
};
const list = [...items].sort(sorters[sortKey]);

// per-network upload strategy
const quality = { wifi: 0.9, cellular: 0.6, unknown: 0.7 }[netType];`
],
[
  'Explain the Adapter and Facade patterns, and where you use them.',
  'An adapter makes something with the wrong shape fit an interface I already use, and a facade puts one simple door in front of a messy subsystem. In a React Native app they usually show up together in the integrations layer. The push SDK, the maps SDK and the storage library all have their own APIs, so I wrap each one in an adapter that matches my own small interface, and the feature code sees one facade like notifications.requestPermission. When we migrated push providers, only the adapter changed and no screen was touched, which is the whole argument for the pattern.',
  `// adapter - foreign shape -> my interface
const firebaseAdapter: Push = {
  requestPermission: () => messaging().requestPermission().then(s => s >= 1),
  onMessage: cb => messaging().onMessage(m => cb(normalise(m))),
};

// facade - one door over permissions + token + navigation
export const notifications = {
  init, requestPermission, onOpened,      // 3 methods the app knows
};
// swapping Firebase -> OneSignal = new adapter, zero screen changes`
],
[
  'How do you model a screen as a state machine?',
  'Instead of several independent booleans, I model the screen as one state field with a small set of allowed values and allowed transitions. The reason is that booleans let impossible states exist, like loading and error true at the same time, and most of the weird UI bugs I have debugged were exactly that. With a single status the render is a straight switch and the QA cases are finite. I use a plain discriminated union with a reducer for simple screens, and something like XState only when the flow is genuinely complex, such as onboarding with KYC steps and retries.',
  `// impossible states allowed
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);      // 8 combinations, 4 are nonsense

// one status, 4 legal states
type S = { t: 'idle' } | { t: 'loading' }
       | { t: 'ready'; data: Order[] } | { t: 'error'; msg: string };

idle -> loading -> ready
                -> error -> loading (retry)`
],
[
  'What is the Command pattern, and how does it help offline apps?',
  'A command turns an action into data: a plain object that says what should happen, with everything needed to perform it. That is exactly what an offline queue needs, because I cannot run the network call now, so I store the intent instead. Each command has an id, a type, a payload, a retry count and an idempotency key. A single executor knows how to perform each type, so retries, ordering and backoff live in one place rather than being reinvented per screen. It also gives me undo for free in some cases, since the inverse command is just another entry.',
  `type Command =
  | { id: string; type: 'ADD_TO_CART'; payload: { sku: string; qty: number } }
  | { id: string; type: 'DELETE_NOTE'; payload: { noteId: string } };

queue.push(cmd)            // optimistic UI updates immediately
onReconnect -> drain():
  for (const c of queue) {
    await handlers[c.type](c, { idempotencyKey: c.id });
    queue.remove(c.id);    // only after a confirmed 2xx
  }`
],
[
  'Why do immutability and pure functions matter in React Native?',
  'A pure function returns the same output for the same input and touches nothing outside itself, so I can test it without a device, a network or a renderer. Immutability means I create new objects instead of editing old ones, which is what React relies on to know something changed. If I mutate state in place, the reference is identical and the component does not re-render, and memo and useMemo silently stop working. So I keep business rules as pure functions in their own files, and I use spreads or a library like Immer for updates. It also makes reasoning about concurrency and time travel debugging possible.',
  `// mutation - React sees the same reference, no re-render
items.push(newItem); setItems(items);        // bug

// immutable
setItems(prev => [...prev, newItem]);
setUser(prev => ({ ...prev, name }));

// pure rule, testable with no renderer
export const total = (cart: Line[]) =>
  cart.reduce((s, l) => s + l.price * l.qty, 0);
expect(total([{ price: 10, qty: 2 }])).toBe(20);`
],
[
  'What design anti-patterns do you look for in a React Native codebase?',
  'The ones I see most are the god component, a screen of several hundred lines doing fetching, mapping, form state and layout, and prop drilling five levels deep instead of using context or moving state down. Then a shared utils file that is really a dumping ground, useEffect used as a general purpose event handler which causes double fetches and race conditions, business rules written inline in JSX so they cannot be tested, and premature abstraction where a component has eight boolean props. I do not rewrite everything at once. I fix them opportunistically while working in that file, and only make a project out of it when a file keeps appearing in bug reports.',
  `god component     500 lines, fetch + form + layout    -> hook + pure fn + view
prop drilling     <A u={u}/> -> <B u={u}/> -> <C u={u}/> -> context or move state
utils dump        utils/index.ts, 40 helpers          -> per-domain modules
effect abuse      useEffect(fetch, []) everywhere     -> query lib / event handler
logic in JSX      {user.age > 18 && user.kyc === 'ok' && ...} -> canCheckout(user)
boolean soup      <Card isPromo compact hideIcon .../> -> separate components`
],
]);

add('Mobile System Design', [
[
  'How do you approach a mobile system design question?',
  'I spend the first few minutes on requirements instead of drawing boxes, because most bad answers solve the wrong problem. I ask what the app must do, the scale, whether it must work offline, the latency people expect, and which platforms. Then I state the non functional constraints out loud: battery, data usage, cold start, and app size. After that I draw the client architecture in layers, data, domain and UI, and only then the pieces that touch the server. I finish with the things interviewers actually listen for on mobile: caching and offline, error and retry, security of tokens, telemetry, and how it ships and rolls back.',
  `1 requirements   who, what, must it work offline, how many items, how fresh
2 constraints    battery · data · cold start · app size · OS versions
3 API contract   endpoints, payload shape, pagination, error shape
4 client layers  storage -> repository -> domain -> state -> UI
5 hard parts     sync + conflicts · retries · auth · permissions
6 cross cutting  telemetry, feature flags, rollout, kill switch
7 trade offs     say what you chose NOT to build and why`
],
[
  'Design a WhatsApp style chat feature in React Native.',
  'The local database is the source of truth, so the UI reads from it and never waits on the network. Sending writes a message locally with a client generated id and a pending status, pushes it onto an outbox, and the UI shows it immediately. A WebSocket carries live messages, with reconnect and exponential backoff, and on reconnect I pull everything since the last cursor rather than trusting that the socket missed nothing. Push notifications cover the case where the app is killed. The list is an inverted FlatList with paging upward. The parts I make sure to mention are ordering with server timestamps, deduplication by client id, read receipts batched rather than one call per message, and media uploaded separately from the message record.',
  `send    write local (status=pending, clientId=uuid)
        -> outbox -> socket/HTTP -> server ack -> status=sent
        -> delivery + read receipts update the same row

receive socket event  -> upsert by clientId (dedupe)
        app killed    -> push notification -> open -> sync since cursor

sync    GET /messages?chatId&since=cursor   on every reconnect
store   SQLite/WatermelonDB: messages(chatId, ts, clientId UNIQUE, status)
list    inverted FlatList + onEndReached = load older`
],
[
  'Design an offline first notes app.',
  'Every read comes from the local database and every write goes to the local database first, so the app is fully usable in flight mode. Each note carries an id created on the device, an updatedAt and a version. A sync engine pushes local changes from a queue with idempotency keys and pulls changes since a server cursor. For conflicts I would rather not do last write wins on the whole note, because it silently loses text, so I merge per field where I can and keep both versions when two edits truly overlap, showing the user a conflict copy. I also mention the boring but important parts: sync on reconnect and on app foreground, a background task with a limit, and clear pending and failed indicators.',
  `write   local DB (source of truth) -> outbox row -> UI updates instantly
push    POST /notes  Idempotency-Key: <clientId>   with backoff
pull    GET /notes?since=<cursor>  ->  upsert, keep max(updatedAt)

conflict  same note edited on 2 devices
          -> merge per field if disjoint
          -> else keep server copy + "Conflicted copy" note, tell the user

triggers  reconnect · app foreground · manual pull-to-refresh
states    synced ✓ · pending ⏳ · failed ⚠ (with retry)`
],
[
  'Design an Instagram style feed.',
  'Cursor based pagination, not offset, because the feed shifts while people scroll and offsets duplicate or skip items. The list is a FlatList with stable keys, memoised rows, fixed height where possible, and windowing tuned to the device. Images are the real cost, so I request the size I will display, use a caching image component, and prefetch the next page slightly before the user reaches it. I cache the first page on disk so a cold start shows content immediately, then revalidate in the background. Likes are optimistic with rollback. Video autoplays only for the item that is mostly visible, using viewability config, and pauses on blur. I also mention pull to refresh inserting at the top without jumping the scroll position.',
  `GET /feed?cursor=abc&limit=20   ->  { items, nextCursor }

cache   first page persisted -> instant cold start -> revalidate
list    FlatList keyExtractor=id, React.memo rows,
        removeClippedSubviews, initialNumToRender ~6, windowSize ~7
images  ask for the rendered size, CDN transform, disk cache, prefetch page n+1
video   viewabilityConfig itemVisiblePercentThreshold: 80 -> play one
likes   optimistic ++ -> POST -> on error revert + toast`
],
[
  'Design live location tracking for a ride hailing app.',
  'On the driver side the tricky part is battery, so I do not stream at a fixed high rate. I use distance and time filters, drop the rate when the vehicle is stationary, and run a foreground service on Android with a proper background mode on iOS, with clear permission priming before the system dialog. Points are batched and sent over a socket, with a local buffer so a tunnel does not lose the trail. On the rider side I receive positions every few seconds and interpolate the marker between them so the car glides instead of jumping, and I snap to roads server side. I also mention what happens when permission is denied or downgraded to while in use, since that is a real product decision, not just a technical one.',
  `driver  watchPosition(distanceFilter: 25m, interval 5s moving / 30s idle)
        buffer points -> batch every 5s over WebSocket
        Android foreground service · iOS background location + priming screen

rider   subscribe(tripId) -> position every ~4s
        interpolate marker between updates (animate over the gap)
        ETA from server, not from the device

edge    permission denied · battery saver · tunnel (buffer + replay)
        trip ends -> stop tracking, remove notification`
],
[
  'Design a design system or shared component library for several apps.',
  'It starts with tokens rather than components: colour, spacing, typography, radius and motion, defined once and consumed everywhere, because that is what makes theming and dark mode possible later. Components sit on top and are dumb, so they take props and emit events and never fetch. I version it as a package in a monorepo, ship a Storybook or an example app, and treat the public API as a contract with a deprecation path rather than breaking changes. Accessibility is built into the primitives, so labels, hit slop and dynamic type are handled once. The hard part is governance, so I would define who can add a component and require a real second use case before something is promoted from an app into the library.',
  `tokens/     colors, space(4,8,12,16), radii, type scale, durations
primitives/ Box, Text, Pressable, Icon        (a11y baked in)
components/ Button, Input, Sheet, Toast, EmptyState
themes/     light, dark, per-tenant overrides

rules  no data fetching, no navigation, no app imports
       promote from app -> library only at the 2nd real use case
       semver + codemod or deprecation warning for breaking props`
],
[
  'Design a feature flag and remote config system for a mobile app.',
  'Mobile needs flags more than the web does, because a bad release sits on devices until people update. Config is fetched at launch with a short timeout and cached, and there are always defaults compiled into the binary so the app works on first run and offline. Evaluation happens on the device against a payload that includes rules and rollout percentages, using a stable hash of the user id so a user does not flip between buckets on every launch. I make sure flags are typed and centralised rather than string literals scattered around, that changes apply without a restart where possible, and that every experiment sends its assignment to analytics. Most importantly, every risky feature gets a kill switch, and I have a plan for removing stale flags.',
  `boot   read cached config -> render          (never block the splash)
       fetch /config?appVersion&platform (2s timeout) -> cache + emit

eval   bucket = hash(userId + flagKey) % 100 < rollout   // stable
       defaults compiled in -> works offline / first launch

usage  const on = useFlag('checkout.v2');       // typed keys, one module
       track('exposure', { flag, variant })     // for the experiment

ops    kill switch per risky feature · flag TTL, delete after rollout`
],
[
  'Design an analytics SDK for a React Native app.',
  'The rule is that analytics must never slow down or crash the app, so calls are fire and forget into an in memory buffer, flushed in batches on a timer, on reaching a size, and on backgrounding. Events persist to disk so a crash or a kill does not lose them, with a cap and a drop policy so the queue cannot grow forever. Each event carries a common context, so app version, platform, session id and anonymous id, and I use a typed event catalogue instead of free text names, because otherwise the data is unusable within a quarter. Retries use backoff with a dedupe id. I also mention consent, since events must be held or dropped until the user has accepted, and personal data must never be a property.',
  `track(name, props)  -> buffer (memory) -> persist (disk, cap 1000)

flush when  25 events · every 30s · AppState -> background · on foreground

payload  { events: [...], context: { appVersion, os, device, sessionId, anonId } }
retry    backoff 1s,2s,4s… keep dedupe id, drop after N attempts

safety   typed catalogue: type Event = { 'checkout_started': { cartValue: number } }
         no PII in props · respect consent · sampling for high-volume events
         never throw into the caller: try/catch around the whole path`
],
[
  'Design deep linking and universal links for a large app.',
  'I keep one route table that maps URL patterns to screens, and both the custom scheme and the universal or app links resolve through it, so there is a single place to reason about. The hard parts are not the configuration files, they are the states: cold start where the link arrives before navigation is ready, warm start, and a link that needs authentication or a permission the user has not granted. So I park the pending link, wait until the navigator and the session are ready, then either navigate or send the user to login and replay the link afterwards. I always validate parameters and never trust the URL, and I make sure an unknown or old link lands somewhere sensible rather than a blank screen.',
  `routes  /product/:id      -> Product
        /order/:id/track  -> OrderTracking (auth required)

cold    getInitialURL() -> store pending -> onReady -> resolve
warm    Linking.addEventListener('url', ...)
auth    pending link -> Login -> on success replay pending link

validate params (id must be uuid) · unknown path -> Home + log
verify  apple-app-site-association + assetlinks.json served over HTTPS
test    xcrun simctl openurl / adb shell am start -W -a VIEW -d "..."`
],
[
  'Design a caching layer for a mobile app.',
  'I think in three tiers: memory for the current session, disk for cold start, and the server as the source of truth. Each cached entry has a key, a timestamp and a policy, and I choose per resource rather than globally. Reference data like categories can be cached for hours, a feed for a minute with stale while revalidate so the user sees something instantly, and anything about money or availability is not cached at all. I use ETags or Last-Modified so revalidation is cheap. The parts people forget are invalidation on mutation, a size cap with eviction, and clearing everything user specific on logout, which is both a correctness and a privacy issue.',
  `memory (Map/query cache)  ->  disk (MMKV/SQLite)  ->  network

policy per resource
  categories   TTL 24h        cache-first
  feed         TTL 60s        stale-while-revalidate
  cart/price   no cache       network-only

revalidate  If-None-Match: <etag>  -> 304 = free refresh
invalidate  after a mutation, drop the touched keys
limits      LRU eviction, size cap; clear ALL user keys on logout`
],
[
  'Design an image loading pipeline for a media heavy app.',
  'Most performance complaints in media apps are really image complaints, so I start at the source and ask the CDN for the size the device will actually render, at the device pixel ratio, in a modern format. Then a caching image component with a memory and disk cache, a placeholder or blurhash to avoid layout jumps, and prefetching for the next screen or page. Uploads go the other way, resized and compressed on the device before leaving. I cap the cache, evict least recently used, and make sure lists reuse cached decodes rather than decoding the same image repeatedly, because decode cost and memory are what actually cause crashes on low end Android.',
  `request  cdn/img/123?w=320&dpr=2&format=webp     // never the 4000px original
render   <Image source={{uri}} placeholder={blurhash} recyclingKey={id} />
cache    memory (decoded) + disk (bytes), LRU, cap ~200MB
prefetch next page + next screen hero image
upload   resize to max 1600px + quality 0.7 before upload

low-end Android: fixed dimensions, avoid full-bleed originals in lists,
watch decoded bitmap memory, not just file size`
],
[
  'Design search with autocomplete in a mobile app.',
  'The input stays instant, so I never block typing on the network. I debounce around three hundred milliseconds, cancel the previous request with an abort signal, and ignore out of order responses by checking the query that came back. Recent searches and a small local index give immediate results while the network call is in flight, which makes it feel fast even on a slow connection. I cache results per query string for a short time so backspacing is free. On the server side I would mention prefix matching, typo tolerance and popularity ranking, but I keep the focus on the client contract: minimum characters, empty and error states, and analytics on queries with no results, because that list is the most useful product feedback there is.',
  `onChange -> debounce 300ms -> abort previous -> GET /suggest?q=

race guard   if (res.q !== latestQuery) return;   // drop stale
instant      recent searches + local index render with zero delay
cache        Map<query, results> TTL 60s -> backspace is free
min chars    2  ·  empty state  ·  error state with retry
telemetry    zero-result queries -> product backlog`
],
[
  'How do you design pagination for a very large list?',
  'Cursor based pagination, because offset breaks whenever items are inserted or deleted while the user scrolls, which gives duplicates and gaps. The server returns items plus a next cursor, and null means the end. On the client I keep a single source of truth for the pages, dedupe by id when merging, and trigger the next fetch slightly before the bottom using onEndReachedThreshold. I guard against the classic bugs, which are firing multiple requests for the same page, and calling load more when the list is empty. For very long lists I also cap what is retained in memory or use a windowed list, and I keep a footer that clearly shows loading, end of list, or a retry on failure.',
  `GET /items?cursor=eyJ0IjoxNzA...&limit=20  -> { items, nextCursor|null }

client
  onEndReachedThreshold 0.5
  if (loading || !nextCursor) return;      // guards
  merge by id (dedupe) · keep order stable
  footer: spinner | "No more results" | "Retry"

pull-to-refresh -> reset to page 1 + clear cursor
very long lists -> FlashList / windowing, cap retained pages`
],
[
  'Design the retry, timeout and rate limiting behaviour of a mobile API client.',
  'All of it lives in one client so no screen invents its own rules. Timeouts are per request and shorter for interactive calls than for uploads. I retry only what is safe, so network errors, timeouts and 5xx, with exponential backoff and jitter, and never retry a 4xx because it will fail again. Non idempotent requests only retry when they carry an idempotency key. I respect Retry-After on a 429 rather than hammering. A 401 triggers a single shared refresh, with other requests queued behind it, otherwise ten parallel calls trigger ten refreshes. On top of that, requests are cancelled when a screen unmounts, and there is a circuit breaker so a dead backend does not drain the battery.',
  `timeout   10s interactive · 60s upload
retry     network | timeout | 5xx  ->  backoff 1s,2s,4s + jitter, max 3
never     4xx (except 429) · non-idempotent POST without a key
429       honour Retry-After header
401       single in-flight refresh; queue the rest, replay after
cancel    AbortController tied to screen unmount / new query
breaker   5 failures in 30s -> fail fast for 60s, show offline UI`
],
[
  'Design crash and error reporting for a production app.',
  'Three layers. Native crashes and JavaScript fatals go to a crash reporter with source maps or dSYMs uploaded on every build, otherwise the stack traces are useless. Handled errors go through one reporting function so I control what is sent, with breadcrumbs like the last screens, network calls and user actions, and with personal data scrubbed. Then error boundaries around each screen so one broken component shows a retry instead of a white screen, plus a global handler for unhandled promise rejections. What I watch is crash free sessions per release, and I gate rollout on it, because the point of all this is to catch a bad release at one percent instead of a hundred.',
  `native + JS fatal  -> Crashlytics/Sentry  (upload source maps in CI)
handled            -> reportError(e, { screen, feature })  one funnel
context            breadcrumbs: last 20 events, no PII, user id hashed

<ErrorBoundary fallback={<Retry />}>  per screen, not just at root
global             ErrorUtils.setGlobalHandler + unhandledrejection

gate    staged rollout 1% -> 10% -> 100%, halt if crash-free < 99.5%
        kill switch flag for the new feature`
],
[
  'Design the release and over the air update strategy for a React Native app.',
  'JavaScript only changes ship over the air, and anything touching native code has to go through the stores, so the first rule is a strict binary compatibility check, since an OTA bundle pushed to an older binary that lacks a native module is an instant crash loop. Updates are downloaded in the background and applied on the next launch, never mid session, and every rollout is staged with an automatic rollback if the crash free rate drops. Store releases go out as a phased rollout too. I keep a mandatory update mechanism for the case where an old version must stop talking to the API, and I make sure the server stays backward compatible for older builds, because people do not update.',
  `JS-only change   -> OTA bundle, targeted at binary version range
native change    -> store release, new binary, bump the range

OTA   download in background -> apply on next launch (never mid-session)
      staged 5% -> 25% -> 100%, auto-rollback on crash-free drop
      respect store policy: no behaviour changes users did not agree to

store phased rollout + force-update check: GET /min-version
API   stay backward compatible; clients send app version + platform`
],
[
  'Design a white label app that ships for many brands.',
  'One codebase, one set of features, and everything brand specific expressed as configuration rather than code branches. That means tokens for colours, typography and logos, a config file per tenant for feature toggles, API base URL and store identifiers, and assets swapped at build time. Build variants or schemes produce each app, and the CI pipeline is a matrix over the tenant list, so adding a brand is a config file and a pipeline entry, not a fork. The thing I would flag is the anti pattern of if tenant equals X checks spreading through the code, because that is how these projects become unmaintainable. If a brand needs genuinely different behaviour, it goes behind a capability flag, not a brand name.',
  `tenants/acme/{config.ts, theme.ts, assets/, google-services.json}

build   TENANT=acme fastlane build   -> bundleId, name, icons, splash swapped
CI      matrix: [acme, globex, initech]

code    if (theme.colors.primary)         ✓ config-driven
        if (tenant === 'acme') …          ✗ never
        if (features.loyaltyProgram) …    ✓ capability flag

shared  100% of screens; brands differ in theme + flags + copy only`
],
[
  'How would you structure a monorepo for several React Native apps?',
  'Workspaces with a clear split between apps and packages. Each app is thin, mostly navigation and wiring, and the real code lives in packages: a design system, an API client, domain logic, and shared utilities. Dependency direction is enforced, so packages never import from apps and features never import each other deeply. Tooling matters more than structure here, so a task runner with caching, otherwise CI time explodes, and change detection so only affected apps rebuild. The trade offs I would name are that Metro and native builds in monorepos need care with hoisting and symlinks, and that shared packages need versioning discipline, because a careless change now breaks three apps instead of one.',
  `apps/       consumer/  driver/  admin/          (thin: routes + wiring)
packages/   ui/  api/  domain/  config/  utils/

rules   packages never import from apps
        apps import packages via workspace alias
        cross-feature imports go through the feature index

tooling pnpm/yarn workspaces + turbo/nx cache
        CI: build only affected apps
        Metro: watchFolders + resolver config for symlinks`
],
[
  'Design a checkout and payment flow for a mobile app.',
  'The client never handles raw card details, so I use the provider SDK or a hosted sheet and only ever see a token, which keeps the app out of PCI scope. The order is created on the server, the amount is calculated and confirmed server side, and the client only sends intent, because anything the client can compute the client can also tamper with. Every payment request carries an idempotency key, so a retry after a dropped connection cannot double charge. The state machine has to cover the awkward middle, which is where the app was killed after paying but before confirmation, so on relaunch I reconcile by asking the server for order status. Confirmation comes from a webhook to the backend, not from the device.',
  `client  collect via SDK/native sheet (Apple Pay, Google Pay) -> token only
server  POST /orders -> amount computed server-side -> paymentIntent
client  confirm(intent, token)   Idempotency-Key: orderId
server  provider webhook -> order = PAID    (source of truth)

states  cart -> creating -> awaiting_payment -> paid | failed | expired
relaunch after kill -> GET /orders/:id/status -> reconcile UI
never   card numbers in JS · price sent from the client · retry without a key`
],
[
  'Design background sync for a health or fitness app.',
  'The core constraint is that mobile operating systems do not let me run whenever I want, so the design has to assume the app is asleep. I collect from the health store or the wearable when the app is in the foreground, and register a background task that the system schedules on its own terms, plus a silent push as a nudge when the server has something. Everything is queued locally and uploaded in batches with a cursor, so a missed window just means more data next time rather than lost data. On iOS background time is short and not guaranteed, on Android I would use WorkManager with constraints for network and battery. I would also mention permissions and the privacy story, because health data needs explicit consent, encryption at rest and a clear deletion path.',
  `foreground   read HealthKit / Health Connect since lastCursor -> queue
background   iOS BGProcessingTask (system decides when, be quick)
             Android WorkManager: requiresNetwork, batteryNotLow, ~15min min
nudge        silent push -> wake -> short sync

upload   batches of N samples, resumable by cursor, idempotent
budget   never assume you get time; design so a skipped window is harmless
privacy  explicit consent screen · encrypt at rest · export + delete my data`
],
[
  'How do you talk about scale and numbers in a mobile system design answer?',
  'I turn the vague scale question into device level budgets, because that is what a mobile engineer controls. So if the feed has two million daily users each opening five sessions, the interesting numbers to me are the payload per screen, how many requests a cold start makes, how much storage the cache is allowed to take, and how much battery a background feature costs per hour. I estimate them out loud, for example twenty feed items at two kilobytes of JSON is small but twenty images at two hundred kilobytes is not, which immediately tells us where to optimise. Then I set targets like cold start under two seconds and a sixty frames per second scroll, and say how I would measure them in production rather than only on my own device.',
  `traffic   2M DAU × 5 sessions × 3 feed pages ≈ 30M page requests/day ≈ 350 rps avg, ~1k peak

per screen budget
  JSON     20 items × 2KB      = 40KB      fine
  images   20 × 200KB          = 4MB       <- the real cost, fix this first
  requests cold start ≤ 3 calls, ≤ 500KB
  storage  cache cap 200MB, LRU

targets   cold start < 2s · TTI < 1s warm · 60fps scroll · crash-free > 99.5%
measure   real-user metrics per release, p95 not average`
],
]);
