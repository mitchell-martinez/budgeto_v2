Do not use Tailwind CSS in this repository
Use React Router v7 in this repository
Use TypeScript in this repository
Use SCSS modules in this repository
All code should adhere to React and TypeScript 2025 best practices
All code should adhere to SCSS best practices
All code should adhere to React Router v7 best practices
Think deeply about the problem before answering
Always ask clarifying questions before answering
Always explain your reasoning
Always provide examples
Anticipate future changes in requirements and follow best practices to make the code easily maintainable and extensible
The app should be highly performance optimised, all pages should fully load in less than 1 second on a 3G connection
The app should be fully accessible and follow WCAG 2.1 AA standards, ideally AAA standards wherever possible
Follow responsive design best practices, optimising for the visible viewport on mobile devices first
Always specify individual imports, do not import everything from a library
Always use functional components and React hooks, never class components
Prioritise using React's state management system
If you need to do complicated state management between completely different components or routes, use Redux
Always use React's built-in context API for managing global state
Always use React's built-in lazy loading and Suspense for code splitting and lazy loading components
Lazy load wherever possible to enhance performance
Use shadow loading to improve perceived performance by loading things at a minimum height and having spinners for any content that is not yet loaded
Use memoization techniques like React.memo, useMemo, and useCallback to prevent unnecessary re-renders and optimize performance
Use intersection observers to lazy load images and other content as it comes into view
Use SVGs for icons and simple graphics to ensure scalability and performance
Use web workers for any heavy computations to keep the main thread responsive
Use service workers to enable offline capabilities and improve load times for repeat visitors
Use a CDN to serve static assets for improved load times
Use caching wherever possible so the user can get a fast experience
Use caching to allow the page to work offline as much as possible, and indicate to the user when they are offline
Use semantic HTML5 elements to ensure the app is accessible and SEO-friendly
Use ARIA roles and attributes to enhance accessibility where necessary
Use focus management techniques to ensure keyboard users can navigate the app effectively
Use color contrast ratios that meet WCAG 2.1 AA standards, ideally AAA standards wherever possible
Use responsive typography techniques to ensure text is legible on all devices
Use fluid layouts that adapt to different screen sizes and orientations
Use media queries to apply different styles based on the device's characteristics
Use a mobile-first approach to design and development, ensuring the app is optimised for mobile devices
Write comprehensive unit tests using Vitest and React Testing Library to ensure code quality and prevent regressions
Use Playwright for end-to-end testing to ensure the app works as expected from the user's perspective
Aim for at least 90% code coverage with unit tests
Write integration tests to ensure different parts of the app work together as expected
Write end-to-end tests to simulate real user scenarios and ensure the app works as expected
Use mocking and stubbing to isolate components and test them in isolation
Use continuous integration (CI) to automatically run tests on every commit and pull request
Use continuous deployment (CD) to automatically deploy the app to a staging environment for testing
Use linting tools like ESLint and Prettier to enforce code style and catch potential issues
Use TypeScript's strict mode to catch potential issues and ensure type safety
Use Storybook to document components and their usage
Do not import _ from React, import specific hooks like useState, useEffect, and useRef as named imports
Do not import _ from RadixThemes, import specific components like Button, Heading, Text, and TextField as named imports
In fact, do not ever import \*, always do named imports instead
Use arrow functions for defining React components, e.g. const MyComponent = () => { ... }, instead of function declarations or function expressions. There is no need to define the type as React.FC, as TypeScript can infer the types automatically. Do, however, create a type for the component props and use that to type the props parameter in the function when there are more than 2 props.
