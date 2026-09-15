# Project Workflow

## Guiding Principles

1.  **The Plan is the Source of Truth:** All work must be tracked in `plan.md`
2.  **The Tech Stack is Deliberate:** Changes to the tech stack must be
    documented in `tech-stack.md` *before* implementation
3.  **Test-Driven Development:** Write unit tests before implementing
    functionality
4.  **High Code Coverage:** Aim for >80% code coverage for all modules
5.  **User Experience First:** Every decision should prioritize user experience
6.  **Non-Interactive & CI-Aware:** Prefer non-interactive commands. Use
    `CI=true` for watch-mode tools (tests, linters) to ensure single execution.

## Task Workflow

All tasks follow a strict lifecycle:

### Standard Task Workflow

1.  **Select Task:** Choose the next available task from `plan.md` in sequential
    order

2.  **Mark In Progress:** Before beginning work, edit `plan.md` and change the
    task from `[ ]` to `[~]`

3.  **Write Failing Tests (Red Phase):**

    -   Create a new test file for the feature or bug fix.
    -   Write one or more unit tests that clearly define the expected behavior
        and acceptance criteria for the task.
    -   **CRITICAL:** Run the tests and confirm that they fail as expected. This
        is the "Red" phase of TDD. Do not proceed until you have failing tests.

4.  **Implement to Pass Tests (Green Phase):**

    -   Write the minimum amount of application code necessary to make the
        failing tests pass.
    -   Run the test suite again and confirm that all tests now pass. This is
        the "Green" phase.

5.  **Refactor (Optional but Recommended):**

    -   With the safety of passing tests, refactor the implementation code and
        the test code to improve clarity, remove duplication, and enhance
        performance without changing the external behavior.
    -   Rerun tests to ensure they still pass after refactoring.

6.  **Verify Coverage:** Run coverage reports using the project's chosen tools.
    Target: >80% coverage for new code. The specific tools and commands will vary
    by language and framework.

7.  **Document Deviations:** If implementation differs from tech stack:

    -   **STOP** implementation
    -   Update `tech-stack.md` with new design
    -   Add dated note explaining the change
    -   Resume implementation

8.  **Commit Code Changes:**

    -   Stage all code changes related to the task.
    -   Propose a clear, concise commit message e.g, `feat(ui): Create basic
        HTML structure for calculator`.
    -   Perform the commit.

9.  **Attach Task Summary with Git Notes:**

    -   **Step 9.1: Get Commit Hash:** Obtain the hash of the *just-completed
        commit* (`git log -1 --format="%H"`).
    -   **Step 9.2: Draft Note Content:** Create a detailed summary for the
        completed task. This should include the task name, a summary of changes,
        a list of all created/modified files, and the core "why" for the change.
    -   **Step 9.3: Attach Note:** Use the `git notes` command to attach the
        summary to the commit: `git notes add -m "<note content>" <commit_hash>`

10. **Get and Record Task Commit SHA:**

    -   **Step 10.1: Update Plan:** Read `plan.md`, find the line for the
        completed task, update its status from `[~]` to `[x]`, and append the
        first 7 characters of the *just-completed commit's* commit hash.
    -   **Step 10.2: Write Plan:** Write the updated content back to `plan.md`.

11. **Commit Plan Update:**

    -   **Action:** Stage the modified `plan.md` file.
    -   **Action:** Commit this change with a descriptive message (e.g.,
        `conductor(plan): Mark task 'Create user model' as complete`).

### Task Correction & Plan Amendment Workflows

When an implemented task or phase requires corrections, amendments, or additions, follow these standard workflows to maintain plan integrity and avoid untracked code drift:

1.  **In-Flight Refinements:** If minor gaps are found while a task is actively
    in-progress (`[~]`), make the adjustments directly in the active
    implementation stream and ensure passing tests before committing.
2.  **Code Review Corrections (`conductor-review`):** If issues are identified
    during or after a code review, instruct the agent to review your changes
    (e.g., *"run a review"* or triggering the action manually in compatible
    clients). The review agent will automatically append a `Review Fixes` phase
    to `plan.md` so that correction tasks are formally tracked and
    checkpointed.
3.  **Logical State Reversions (`conductor-revert`):** If a task implementation
    is fundamentally flawed or needs to be redone, instruct the agent to revert
    the changes (e.g., *"revert the last task"* or triggering the action
    manually in compatible clients). This safely rolls back associated git
    commits and resets the task state in `plan.md` back to pending `[ ]` to
    allow a clean restart.

### Phase Completion Verification and Checkpointing Protocol

**Trigger:** This protocol is executed immediately after a task is completed
that also concludes a phase in `plan.md`.

1.  **Announce Protocol Start:** Inform the user that the phase is complete and
    the verification and checkpointing protocol has begun.

2.  **Ensure Test Coverage for Phase Changes:**

    -   **Step 2.1: Determine Phase Scope:** List all changes since the previous checkpoint.
    -   **Step 2.2: List Changed Files:** `git diff --name-only <previous_checkpoint_sha> HEAD`
    -   **Step 2.3: Verify and Create Tests:** For each code file, verify a corresponding test file exists.

3.  **Execute Automated Tests with Proactive Debugging:**
    -   Announce and execute the test command.

4.  **Propose a Detailed, Actionable Manual Verification Plan:**
    -   Generate step-by-step verification instructions.

5.  **Await Explicit User Feedback:**
    -   Wait for explicit confirmation before proceeding.

6.  **Identify Target Commit for Report:**
    -   Identify hash of the last functional commit.

7.  **Attach Auditable Verification Report using Git Notes:**
    -   Use `git notes` to record the verification report.

8.  **Record Phase Checkpoint SHA:**
    -   Update `plan.md` with `[checkpoint: <sha>]`.

9.  **Commit Plan Update:**
    -   Commit plan update.

10. **Announce Completion.**
