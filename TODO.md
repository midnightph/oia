# TODO List for To-Do App Implementation

- [x] Update app/accountManagement/signup.tsx to add 'role' field to users collection (default 'employee')
- [x] Update app/(tabs)/home.tsx to implement to-do app functionality:
  - [x] Import necessary Firebase and React Native components
  - [x] Add state for current user, tasks, employees, modals
  - [x] Fetch current user and determine role (owner if first user or manually set)
  - [x] Fetch tasks from Firestore with real-time listener
  - [x] Fetch employees from Firestore with real-time listener
  - [x] Display task list (all for owner, assigned for employees)
  - [x] Add modal for creating new tasks (name, responsible, time, requirements)
  - [x] Add modal for adding employees (for owner only)
  - [x] Implement task creation and employee addition logic
- [ ] Test the implementation: login, task creation, employee addition, task assignment
