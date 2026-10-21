export interface PythonForgeActivity {
  id: string;
  title: string;
  sourceUrl: string;
  starterCode: string;
  expectedOutput?: string;
  hints: string[];
  activity: {
    title: string;
    brief: string;
    steps: string[];
    successCriteria: string[];
  };
  reflectionPrompt?: string;
  quiz?: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  };
}

export const PYTHON_FORGE_COURSE_SLUG = "python-forge-learn-by-building";

export const pythonForgeActivities: PythonForgeActivity[] = [
  {
    id: "m01-l01",
    title: "From a Plan to Python Expressions",
    sourceUrl: "https://pyforgecourse.org/lesson/m01-l01",
    starterCode:
      '# Model a small launch decision.\nproject_name = "Comet"\nopen_tasks = 1\nreview_slots = 4\n\n# TODO: calculate how many review slots remain.\nremaining_slots = 0\n\n# TODO: replace False with a comparison that is True only when no tasks are open.\nis_ready = False\n\nprint("Project:", project_name)\nprint("Remaining review slots:", remaining_slots)\nprint("Ready to launch?", is_ready)',
    expectedOutput:
      "Project: Aurora\nRemaining review slots: 1\nReady to launch? False",
    hints: [
      "The subtraction expression should use review_slots and open_tasks.",
      "Use == when you want to ask whether open_tasks has a particular value.",
      "Run after each small edit and compare the displayed values with your paper trace.",
    ],
    activity: {
      title: "Map a pre-launch decision",
      brief:
        "Translate a familiar readiness check into data, operations, and output before completing the starter program.",
      steps: [
        "Write three inputs for a fictional product launch, including at least one number.",
        "Write one calculation and one yes-or-no question the program should answer.",
        "Replace both TODO values in the starter code with expressions using its variables.",
        "Change open_tasks twice and observe how each output line changes.",
      ],
      successCriteria: [
        "The program runs without errors.",
        "remaining_slots is calculated rather than typed as a fixed answer.",
        "is_ready becomes True only when open_tasks is 0.",
      ],
    },
    reflectionPrompt:
      "Which part of your plan was an input, which part was an operation, and which variable name made the program easiest to understand?",
    quiz: {
      question:
        "After this code runs, what is the value of ready?\n\nopen_tasks = 0\nready = open_tasks == 0",
      options: ["0", "True", "False", 'The text "0"'],
      answer: 1,
      explanation:
        "The comparison asks whether the integer stored in open_tasks equals the integer 0. That statement is true, so ready refers to the boolean value True.",
    },
  },
  {
    id: "m01-l02",
    title: "Ask for Input, Shape Useful Output",
    sourceUrl: "https://pyforgecourse.org/lesson/m01-l02",
    starterCode:
      'project_name = input("Project name: ")\nopen_tasks_text = input("Open tasks: ")\n\n# TODO: convert open_tasks_text to an integer named open_tasks.\nopen_tasks = 0\n\n# TODO: make this reflect whether the task count is zero.\nready = False\n\n# TODO: replace this line with an f-string summary using project_name, open_tasks, and ready.\nprint("Launch summary goes here")',
    expectedOutput:
      "Project name: Aurora\nOpen tasks: 0\nChecklist owner: Mina\n\nLaunch snapshot for Aurora\nOwner: Mina\nOpen tasks: 0\nReady to launch: True",
    hints: [
      "int(open_tasks_text) produces a whole number you can compare with 0.",
      "An f-string begins with f before the opening quote and uses braces around variable names.",
      "The example output shows one possible run; your typed responses determine your own output.",
    ],
    activity: {
      title: "Create a launch snapshot",
      brief:
        "Complete a compact interactive report that turns a person's responses into a clear readiness statement.",
      steps: [
        "Run the starter code once and notice that every input response begins as text.",
        "Convert the open task response before comparing it with zero.",
        "Write one f-string that includes the project name, numeric task count, and readiness result.",
        "Test once with 0 tasks and once with a positive task count.",
      ],
      successCriteria: [
        "A whole-number response can be used in a comparison.",
        "The summary includes values supplied or calculated by the program.",
        "The readiness value changes between the two tests.",
      ],
    },
    reflectionPrompt:
      "Why is it useful that input() always returns text, and where in a program should you decide to convert that text?",
    quiz: {
      question:
        "What should replace TODO if tasks_text came from input() and you need to calculate tasks + 1?",
      options: [
        "tasks = str(tasks_text)",
        "tasks = bool(tasks_text)",
        "tasks = int(tasks_text)",
        "tasks = print(tasks_text)",
      ],
      answer: 2,
      explanation:
        "input() returns a string. int(tasks_text) converts text representing a whole number into an integer, which can participate in arithmetic such as tasks + 1.",
    },
  },
  {
    id: "m01-l03",
    title: "Read Tracebacks and Repair the Checklist",
    sourceUrl: "https://pyforgecourse.org/lesson/m01-l03",
    starterCode:
      'project_name = input("Project name: ")\nopen_tasks = int(input("Open tasks: ") )\n\n# TODO: Use an if/else statement to set status.\n# It should be "READY FOR REVIEW" when open_tasks is 0.\n# Otherwise it should be "ACTION NEEDED".\nstatus = "TODO"\n\n# TODO: This line has a variable-name bug. Repair it after reading the error.\nprint(f"{project_name}: {open_task} open task(s) | {status}")',
    expectedOutput:
      "Project name: Aurora\nOpen tasks: 2\n\nAurora: 2 open task(s) | ACTION NEEDED",
    hints: [
      "The final traceback line tells you the error category; the line above it identifies the failing code.",
      "The variable created near the top is named open_tasks, with an s.",
      "An if condition can directly compare open_tasks == 0.",
    ],
    activity: {
      title: "Debug by reading evidence",
      brief:
        "Use the intentional bug in the starter code to practice a disciplined traceback-to-test repair cycle.",
      steps: [
        "Run the starter code with any project name and a whole-number task count.",
        "Read the last traceback line, then locate the variable name on the reported line.",
        "Fix only that name and implement the TODO status decision.",
        "Rerun with 0 and then 2 open tasks, checking the two statuses.",
      ],
      successCriteria: [
        "You can name the error category produced by the original code.",
        "The repaired program runs for whole-number task counts.",
        "It reports READY FOR REVIEW for 0 and ACTION NEEDED for a positive count.",
      ],
    },
    reflectionPrompt:
      "When you saw the traceback, what evidence identified the smallest possible fix, and how did your second test confirm it?",
    quiz: {
      question:
        "A program ends with NameError: name 'owner' is not defined. What is the best first action?",
      options: [
        "Restart Python until the message disappears.",
        "Find the reported line and check whether owner was spelled and assigned before use.",
        "Convert owner with int().",
        "Delete every print statement.",
      ],
      answer: 1,
      explanation:
        "A NameError says Python cannot find that name. The focused first check is the reported line plus the spelling and earlier assignment of owner.",
    },
  },
  {
    id: "m02-l01",
    title: "Make Decisions with Conditions and Truthiness",
    sourceUrl: "https://pyforgecourse.org/lesson/m02-l01",
    starterCode:
      'score = 76\nsubmitted = True\n\n# TODO: Set result to "pass" only when score is at least 70\n# and submitted is True. Otherwise set it to "try again".\nresult = ""\n\n# TODO: Print a helpful message when result is "pass".\n# Otherwise print a different helpful message.\n\nprint(result)\n',
    expectedOutput: "Access: allowed\nYour cart is empty.\n",
    hints: [
      "An elif condition is considered only if every earlier condition was false.",
      "Use == to ask whether result has a particular string value.",
      "For an empty-list check, write if cart: when you only care whether it contains items.",
    ],
    activity: {
      title: "Subscription status checker",
      brief:
        "Write a small classifier for a streaming account using the variables plan, days_overdue, and trial_active.",
      steps: [
        'Start with plan = "basic", days_overdue = 0, and trial_active = False.',
        'Print "payment needed" when days_overdue is greater than 0.',
        'Otherwise print "trial access" for an active trial and a plan-specific message for basic or premium.',
        "Change each input at least once and confirm that only one status message prints per run.",
      ],
      successCriteria: [
        "The program has an if/elif/else chain with a deliberate branch order.",
        "At least one condition combines two facts with and or or.",
        "The output changes correctly for an overdue account, a trial account, and a paid account.",
      ],
    },
    reflectionPrompt:
      "Where in your status checker could a falsy value be mistaken for missing data, and how would an explicit comparison make that rule safer?",
    quiz: {
      question:
        'What does Python print when this code runs?\n\nitems = []\nif items:\n    print("packed")\nelse:\n    print("empty")',
      options: [
        "packed",
        "empty",
        "True",
        "It raises an error because a list is not Boolean.",
      ],
      answer: 1,
      explanation:
        "An empty list is falsy, so the if block is skipped and the else block prints empty.",
    },
  },
  {
    id: "m02-l02",
    title: "Repeat Work with Purposeful Loops",
    sourceUrl: "https://pyforgecourse.org/lesson/m02-l02",
    starterCode:
      "temperatures = [18, 21, 16, 24, 19]\n\n# TODO: Create a variable named warm_days starting at 0.\n# TODO: Loop through temperatures. Add 1 for every temperature\n# that is 20 or higher.\n# TODO: Print the final number of warm days.\n\n",
    expectedOutput:
      "Expense 1: $12.50\nExpense 2: $8.00\nExpense 3: $19.75\nCountdown: 3\nCountdown: 2\nCountdown: 1\nTotal: $40.25\n",
    hints: [
      "Initialize a total or counter before, not inside, the loop.",
      "enumerate(values, start=1) gives a human-friendly position alongside each value.",
      "Every while loop should visibly update the state used in its condition.",
    ],
    activity: {
      title: "Reading tracker summary",
      brief:
        "Use a loop to summarize pages read across five study sessions and identify the first session that meets a goal.",
      steps: [
        "Create pages_read with five integer values and set total_pages to 0.",
        "Use enumerate with start=1 to print every session and add its pages to the total.",
        "Inside the loop, print a milestone message when a session has 30 or more pages.",
        "After the loop, print the total and a message based on whether the total reaches 100 pages.",
      ],
      successCriteria: [
        "Each session is printed with a one-based session number.",
        "The final total equals the sum of every value in pages_read.",
        "A conditional inside or after the loop produces a meaningful goal message.",
      ],
    },
    reflectionPrompt:
      "Which part of your tracker belongs inside the loop, and which part belongs after it? Explain what would go wrong if the final summary printed during every pass.",
    quiz: {
      question:
        'Which loop is the clearest choice for printing every color in colors = ["red", "blue", "green"]?',
      options: [
        "for color in colors:",
        "while colors:",
        "if color in colors:",
        "for color in range(colors):",
      ],
      answer: 0,
      explanation:
        "A for loop directly iterates through the values in an existing list. The other choices either change the task or are invalid for this purpose.",
    },
  },
  {
    id: "m02-l03",
    title: "Choose and Traverse Collections",
    sourceUrl: "https://pyforgecourse.org/lesson/m02-l03",
    starterCode:
      'words = ["Map", "map", "compass", "map", "trail"]\ncounts = {}\n\n# TODO: Loop through words. Convert each word to lowercase.\n# TODO: Update counts so each lowercase word maps to its frequency.\n# TODO: Loop through sorted(counts.items()) and print word and count.\n\n',
    expectedOutput:
      "Lunch total: $23.75\nCategories: ['Bus', 'Lunch']\nforge: 2\npython: 1\n",
    hints: [
      "Use a tuple when a small group of values should stay together, such as (category, amount).",
      "counts.get(key, 0) supplies zero when a word has not appeared yet.",
      "sorted(a_set) creates a predictable list for display without changing the set itself.",
    ],
    activity: {
      title: "Unique attendee report",
      brief:
        "Turn a sign-in list with duplicate names into a short report that shows each person’s number of visits.",
      steps: [
        "Create a list with at least eight names, including duplicates and mixed capitalization.",
        "Use a set to collect normalized unique names.",
        "Use a dictionary and get to count each normalized name.",
        "Print the number of unique attendees, then print each name and visit count in alphabetical order.",
      ],
      successCriteria: [
        "Duplicate names do not inflate the unique attendee total.",
        "Mixed capitalization is counted as the same attendee after normalization.",
        "The report traverses dictionary key-value pairs and displays deterministic alphabetical results.",
      ],
    },
    reflectionPrompt:
      "Why is a dictionary a better fit than a list for a word-frequency report, and when would a set be enough instead?",
    quiz: {
      question:
        "Which expression safely increases the count for item in a frequency dictionary, starting at 0 when the key is new?",
      options: [
        "counts[item] = counts[item] + 1",
        "counts.add(item)",
        "counts[item] = counts.get(item, 0) + 1",
        "counts.append(item, 1)",
      ],
      answer: 2,
      explanation:
        "get(item, 0) returns the existing count when present and 0 when the key is absent, so the assignment works for both first and later occurrences.",
    },
  },
  {
    id: "m03-l01",
    title: "Design Functions That Return Useful Results",
    sourceUrl: "https://pyforgecourse.org/lesson/m03-l01",
    starterCode:
      'def emphasize(word, mark="*"):\n    """Return word wrapped once on each side by mark."""\n    # TODO: return a new string such as **forge**.\n    pass\n\n\nprint(emphasize("forge", mark="**"))',
    expectedOutput:
      "Build useful tools, one function at a time.\nBuild useful tools, one...\n\nAfter completing the starter: **forge**",
    hints: [
      "`return` sends a value to the caller; it does not display the value by itself.",
      'An f-string such as `f"{mark}{word}{mark}"` can assemble the result clearly.',
      "Try the starter with both the default mark and a custom mark before moving on.",
    ],
    activity: {
      title: "Add a reusable label maker",
      brief:
        'Complete `emphasize`, then write a second function named `make_label(text, prefix="Note")` that returns a label and cleaned text without printing inside the function.',
      steps: [
        "Replace `pass` in `emphasize` with a returned string and run the supplied print call.",
        "Write `make_label` with a one-line docstring and use `normalize_spaces` from the example if you want to clean the text.",
        'Call `make_label` once with its default prefix and once with `prefix="Idea"`.',
        "Change only the call-site arguments, not the function body, to prove the default is working.",
      ],
      successCriteria: [
        '`emphasize("forge", mark="**")` returns `**forge**`.',
        "`make_label` has a default parameter and returns rather than prints its result.",
        "Both sample calls display distinct labels with no doubled whitespace.",
      ],
    },
    reflectionPrompt:
      "Which part of a function's agreement would be most confusing to a future caller if it were missing: its name, parameters, return value, or docstring? Explain using one function you wrote.",
    quiz: {
      question:
        "Why is `return cleaned_text` usually more reusable than `print(cleaned_text)` inside a text utility?",
      options: [
        "The returned value can be stored, tested, combined, or printed later by the caller.",
        "`return` automatically writes the value to a file.",
        "`print` changes all spaces into single spaces.",
        "A function with `print` cannot accept parameters.",
      ],
      answer: 0,
      explanation:
        "A returned value remains available to the calling code. Printing is useful for a demonstration, but it primarily displays text and does not provide a value for later computation.",
    },
  },
  {
    id: "m03-l02",
    title: "Keep Scope Clear and Test Assumptions",
    sourceUrl: "https://pyforgecourse.org/lesson/m03-l02",
    starterCode:
      'DEFAULT_SUFFIX = "!"\n\n\ndef add_suffix(text, suffix=DEFAULT_SUFFIX):\n    """Return text followed by suffix, without changing the global default."""\n    # TODO: return a value. Do not assign a new value to DEFAULT_SUFFIX here.\n    pass\n\n\nassert add_suffix("Ready") == "Ready!"\nassert add_suffix("Ready", "?") == "Ready?"\nprint(add_suffix("Build"))',
    expectedOutput:
      "True\nFalse\n\nAfter completing the starter, its assertions pass and it prints: Build!",
    hints: [
      "Names made inside `add_suffix` are local unless you deliberately use a global declaration.",
      "Use a direct expression with `text + suffix` or an f-string; neither mutates the original string.",
      "If an assertion fails, read its expected value first, then call the function with that exact input.",
    ],
    activity: {
      title: "Write a tiny self-test suite",
      brief:
        "Complete `add_suffix` and add a function named `is_short(text, limit=12)` that returns whether cleaned text fits within the limit. Test the rule with assertions.",
      steps: [
        "Finish `add_suffix` without changing `DEFAULT_SUFFIX` and run the two existing assertions.",
        'Implement `is_short` using `" ".join(text.split())` to create a local cleaned value.',
        "Add one assertion for text that fits, one for text that is too long, and one for whitespace-only text.",
        "Temporarily make one expected value wrong, observe the `AssertionError`, then correct it.",
      ],
      successCriteria: [
        "The global `DEFAULT_SUFFIX` still equals `!` after every call.",
        "All three `is_short` assertions pass when the intended rule is implemented.",
        "The empty or whitespace-only case has an explicit, tested result.",
      ],
    },
    reflectionPrompt:
      "Describe one decision in your text rules that could have been ambiguous. How did an assertion make that decision visible to someone reading the code?",
    quiz: {
      question:
        "What happens to `words` after `word_count` returns in the example?",
      options: [
        "It is a local name and is not available outside that function call.",
        "It becomes a global variable automatically.",
        "It is appended to `DEFAULT_MIN_WORDS`.",
        "It is converted into a docstring.",
      ],
      answer: 0,
      explanation:
        "`words` is assigned inside `word_count`, so it is local to that call. The function returns only the integer length, not the local variable itself.",
    },
  },
  {
    id: "m03-l03",
    title: "Debug Methodically and Pair Program Responsibly",
    sourceUrl: "https://pyforgecourse.org/lesson/m03-l03",
    starterCode:
      'def average_word_length(text):\n    """Return the average length of whitespace-separated words."""\n    words = text.split()\n    total = sum(len(word) for word in words)\n    # TODO: What should happen when words is empty?\n    # TODO: Return a rounded number after choosing that rule.\n    return total / len(words)\n\n\nprint(average_word_length("hi all"))\n# After your fix, also test: print(average_word_length(""))',
    expectedOutput:
      "tokens=['Hi,', 'all!']\nlengths=[2, 3]\n2.5\n\nAfter completing the starter, `average_word_length(\"\")` should return 0.0 rather than raising ZeroDivisionError.",
    hints: [
      'Run the starter with `""` to reproduce the boundary-case failure before changing it.',
      "Check `if not words:` before dividing; an empty list is falsy in Python.",
      "For an AI review, share only the tiny function and a fabricated sample, then ask which assertions would verify the fix.",
    ],
    activity: {
      title: "Repair a boundary case with evidence",
      brief:
        "Use the starter to reproduce an empty-text bug, make the smallest correction, and record a safe AI-review request you could use after writing your own fix.",
      steps: [
        "Run the supplied non-empty example, then call the function with an empty string and read the exception message.",
        "Add a guard that returns your documented empty-text result before the division.",
        'Add assertions for `""`, `"hi all"`, and a punctuation case you define clearly.',
        "Write a two-sentence AI prompt that includes a minimal fabricated example, expected result, and asks for test gaps rather than a complete replacement.",
      ],
      successCriteria: [
        "Empty text no longer produces a division-by-zero error.",
        "The chosen behavior is protected by at least three assertions.",
        "The AI-review prompt contains no personal, secret, or confidential information and requests an explanation or test review.",
      ],
    },
    reflectionPrompt:
      "When a tool suggests a fix that passes one example, what evidence would you collect before trusting it in your Text Toolkit?",
    quiz: {
      question:
        "Which AI pair-programming request is the most responsible next step after you have reproduced a bug with fabricated text?",
      options: [
        "Paste private user messages and ask the AI to rewrite the entire project without tests.",
        "Ask for a brief explanation of the empty-input failure and two edge-case assertions to review after you implement a fix.",
        "Accept the first code block the AI produces because it sounds confident.",
        "Ask the AI to hide the traceback so the program appears to work.",
      ],
      answer: 1,
      explanation:
        "A bounded request using safe sample data keeps you in control. It invites explanation and test ideas, while you still implement, run, and evaluate the final change.",
    },
  },
  {
    id: "m04-l01",
    title: "Classes, Objects, and Useful Methods",
    sourceUrl: "https://pyforgecourse.org/lesson/m04-l01",
    starterCode:
      'class Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\n        self.available = True\n\n    def label(self):\n        # TODO: return a label containing title, author, and availability\n        pass\n\n    def checkout(self):\n        # TODO: change available to False only when this book is available\n        # Return True when the checkout succeeds; otherwise return False.\n        pass\n\nbook = Book("Sky Machines", "Ada Park")\nprint(book.label())\nprint("First checkout:", book.checkout())\nprint("Second checkout:", book.checkout())',
    expectedOutput:
      "The Atlas by Mina Cole (available)\nCheckout atlas: True\nThe Atlas by Mina Cole (on loan)\nRiver Maps by Omar Lee (available)",
    hints: [
      "Use an f-string in label so the object controls its own display text.",
      "The expression self.available reads state from the current Book object.",
      "Return immediately when a book is already unavailable so its state is not changed again.",
    ],
    activity: {
      title: "Create a shelf card",
      brief:
        "Extend a Book class so each object can describe itself and receive a simple subject label.",
      steps: [
        "Create a Book class with title, author, and subject attributes.",
        "Create a shelf_card method that returns all three details in one string.",
        "Create two books with different titles and subjects.",
        "Print both shelf cards and verify that changing one title does not change the other book.",
      ],
      successCriteria: [
        "The class has an __init__ method that stores three instance attributes.",
        "shelf_card uses self and returns rather than prints its result.",
        "Two separate objects produce different, accurate shelf-card text.",
      ],
    },
    reflectionPrompt:
      "Which pieces of information belong on every Book object, and which information would be better managed by a separate library object? Explain your boundary.",
    quiz: {
      question:
        'After first = Book("A", "B") and second = Book("C", "D"), what does self refer to inside first.label()?',
      options: [
        "The Book class itself",
        "The first Book object",
        "Every Book object at once",
        "The label function outside the class",
      ],
      answer: 1,
      explanation:
        "When first.label() is called, Python passes the first object as self. Its method therefore reads and changes first's attributes, not second's.",
    },
  },
  {
    id: "m04-l02",
    title: "Protecting State with Encapsulation",
    sourceUrl: "https://pyforgecourse.org/lesson/m04-l02",
    starterCode:
      'class Book:\n    def __init__(self, title):\n        self.title = title\n        self._borrower_id = None\n\n    def checkout(self, member_id):\n        # TODO: reject a checkout if _borrower_id is already set.\n        # Otherwise save member_id and return a useful message.\n        pass\n\n    def checkin(self):\n        # TODO: set _borrower_id back to None and report the action.\n        pass\n\nclass Library:\n    def __init__(self):\n        self.books = {}\n\n    def add_book(self, book):\n        self.books[book.title] = book\n\n    def loan_title(self, title, member_id):\n        # TODO: delegate the checkout to the matching Book object.\n        pass\n\nlibrary = Library()\nlibrary.add_book(Book("Paper Lanterns"))\nprint(library.loan_title("Paper Lanterns", "M03"))',
    expectedOutput:
      "Loaned The Long Index to member M17\nCannot loan The Long Index: already borrowed\nReturned The Long Index",
    hints: [
      "A leading underscore signals internal state by convention; callers should use the object's methods instead of changing it directly.",
      "Compare self._borrower_id with None to determine whether the book is available.",
      "Library.loan_title should call checkout on an existing Book rather than duplicate the availability rule.",
    ],
    activity: {
      title: "Add a lending guardrail",
      brief:
        "Build a Member object and use composition to stop members from borrowing more books than their limit.",
      steps: [
        "Create a Member class with member_id, name, loan_limit, and loans_count attributes.",
        "Write can_borrow to return whether loans_count is below loan_limit.",
        "Write record_loan to increase loans_count only when can_borrow is true.",
        "Create a member with a limit of two and attempt three loans.",
        "Print the result of each attempt and the final loan count.",
      ],
      successCriteria: [
        "The third attempted loan is refused without increasing the count.",
        "The borrowing rule is inside Member rather than repeated in top-level code.",
        "The final count is never greater than the stated limit.",
      ],
    },
    reflectionPrompt:
      "Name one invalid state a lending system should prevent. Which object should own the rule, and why is that object the best location?",
    quiz: {
      question:
        "Which design best represents the relationship between a Library and its Book objects?",
      options: [
        "Inheritance, because a Library is a specialized Book",
        "Composition, because a Library has and manages books",
        "A global variable, because all books must be shared",
        "No relationship, because each Book is independent",
      ],
      answer: 1,
      explanation:
        "A library is not a type of book. It owns or manages a collection of Book objects, which is a has-a relationship and a natural use of composition.",
    },
  },
  {
    id: "m04-l03",
    title: "Dataclasses and Purposeful Reuse",
    sourceUrl: "https://pyforgecourse.org/lesson/m04-l03",
    starterCode:
      'from dataclasses import dataclass\n\n@dataclass\nclass Loan:\n    book_title: str\n    member_id: str\n    due_day: int\n\n    def summary(self):\n        # TODO: return a readable loan summary.\n        pass\n\nclass Book:\n    def __init__(self, title):\n        self.title = title\n\n    def checkout(self, member_id):\n        return True\n\nclass ReferenceBook(Book):\n    def checkout(self, member_id):\n        # TODO: reference books stay in the library.\n        pass\n\nloan = Loan("Cloud Catalog", "M08", 14)\nprint(loan.summary())\nprint(ReferenceBook("Archive Atlas").checkout("M08"))',
    expectedOutput:
      "Due on day 14: Cloud Catalog\nThis title cannot be loaned\nLoan(book_title='Cloud Catalog', member_id='M08', due_day=14)",
    hints: [
      "Fields in a dataclass need type annotations, such as member_id: str.",
      "A subclass may replace a parent method when the specialized object follows a different rule.",
      "Use a regular Book for the first loan and a ReferenceBook for the refusal path.",
    ],
    activity: {
      title: "Record due dates",
      brief:
        "Add a dataclass-based Loan record to a small lending workflow and distinguish a reference-only item.",
      steps: [
        "Define a Loan dataclass with title, member_id, and due_day fields.",
        "Add a summary method that returns a complete sentence about the due date.",
        "Create Book and ReferenceBook classes where ReferenceBook refuses checkout.",
        "Create one successful Loan and one refused reference-book attempt.",
        "Print the loan summary and the refusal result.",
      ],
      successCriteria: [
        "The Loan class uses @dataclass from the standard library.",
        "A normal Book can produce a loan record.",
        "A ReferenceBook is handled by its specialized rule and does not produce a loan record.",
      ],
    },
    reflectionPrompt:
      "For each of Book, Member, Loan, and Library, write one sentence describing its responsibility. Where would you use a dataclass, and where would you not?",
    quiz: {
      question: "When is inheritance the strongest choice?",
      options: [
        "Whenever two classes both contain a title field",
        "When a class needs access to a list owned by another class",
        "When the child is genuinely a specialized form of the parent and follows its core contract",
        "Whenever a method contains more than three lines",
      ],
      answer: 2,
      explanation:
        "Inheritance communicates an is-a relationship and shared contract. Shared data alone is not enough; composition or a separate helper may better represent other relationships.",
    },
  },
  {
    id: "m05-l01",
    title: "Transform Data with Comprehensions and Iterators",
    sourceUrl: "https://pyforgecourse.org/lesson/m05-l01",
    starterCode:
      'raw_scores = [" 8 ", "bad", "15", "", "8"]\n\n# TODO: Replace this empty list with a list comprehension.\n# It should strip each text value, keep digit-only values, and convert them to int.\nclean_scores = []\n\n# TODO: Build a dictionary comprehension mapping each clean score to score * 10.\nscaled_by_score = {}\n\nprint(clean_scores)\nprint(scaled_by_score)\n',
    expectedOutput:
      "[12, 7, 19, 7]\n[49, 144, 361]\n{1: 12, 2: 7, 3: 19, 4: 7}\nTrue\n12\n[7, 19, 7]",
    hints: [
      "Put the conversion expression before the for clause in a list comprehension.",
      "Call strip() in the condition so whitespace-only strings are rejected.",
      "Use enumerate(clean_scores) if you need a position as well as a score.",
    ],
    activity: {
      title: "Clean a compact score feed",
      brief:
        "Turn a messy sequence of score text into useful in-memory collections, then compare a list with a one-pass iterator.",
      steps: [
        "Complete the two comprehensions in the starter code and run it.",
        "Add a set comprehension that reports the distinct clean scores.",
        "Create an iterator with iter(clean_scores), call next() once, then print the remaining values as a list.",
        "Add one sentence in a comment explaining why the second print has fewer values.",
      ],
      successCriteria: [
        "Only numeric, nonblank score text is converted to integers.",
        "The dictionary maps every distinct score to ten times that score.",
        "The code demonstrates that an iterator advances after next() is called.",
      ],
    },
    reflectionPrompt:
      "Where in a program you have written would a comprehension make the intent clearer, and where would a regular loop remain easier to understand?",
    quiz: {
      question:
        "What happens after list(my_generator) is used to inspect a generator?",
      options: [
        "The generator has been consumed and normally has no items left.",
        "The generator is converted into a reusable list automatically.",
        "The generator restarts from its first yield.",
        "Python copies the generator without running it.",
      ],
      answer: 0,
      explanation:
        "A generator yields values on demand and keeps its position. Converting it to a list requests values until it is exhausted, so later iteration normally produces nothing.",
    },
  },
  {
    id: "m05-l02",
    title: "Build Lazy Pipelines with Generators",
    sourceUrl: "https://pyforgecourse.org/lesson/m05-l02",
    starterCode:
      'def parse_readings(lines):\n    for line in lines:\n        # TODO: Split each line into sensor and value.\n        # TODO: Yield a dictionary with sensor as text and value as int.\n        pass\n\n\ndef keep_high(readings, minimum):\n    # TODO: Loop over readings and yield only readings at or above minimum.\n    return iter(())\n\n\nraw_lines = ["north,12", "south,4", "north,19"]\npipeline = keep_high(parse_readings(raw_lines), minimum=10)\nprint(list(pipeline))\n',
    expectedOutput:
      "generator\n{'stamp': '09:01', 'kind': 'checkout', 'milliseconds': 240}\n[{'stamp': '09:02', 'kind': 'search', 'milliseconds': 310}]",
    hints: [
      "Use yield inside both stages so they produce values lazily.",
      "A generator stage should loop over its input iterable instead of indexing it.",
      "Call list(pipeline) only at the end when you want to display every remaining result.",
    ],
    activity: {
      title: "Trace a slow-event stream",
      brief:
        "Implement two generator stages that parse sensor readings and retain only readings that need attention.",
      steps: [
        "Replace pass in parse_readings with a split and a yielded dictionary.",
        "Implement keep_high using a for loop and yield under an if condition.",
        "Run the pipeline with a minimum of 10 and verify the two north readings appear.",
        "Change the minimum to 18 and use next() to retrieve only the first qualifying reading.",
      ],
      successCriteria: [
        "Both functions return generator-based results rather than completed lists.",
        "Values are converted to integers before the threshold comparison.",
        "Changing the threshold changes which readings are consumed without changing parsing code.",
      ],
    },
    reflectionPrompt:
      "Imagine a log containing millions of records. Which stage of a lazy pipeline would you test first, and what would you consume to prove it works without loading the whole log?",
    quiz: {
      question:
        "Which operation actually causes a generator pipeline to process its available items?",
      options: [
        "Passing the pipeline to list().",
        "Assigning the pipeline to a variable.",
        "Defining the generator function.",
        "Importing the itertools module.",
      ],
      answer: 0,
      explanation:
        "Generator stages are evaluated when a consumer requests items. list() repeatedly requests values until the pipeline is exhausted.",
    },
  },
  {
    id: "m05-l03",
    title: "Compose Behavior and Time the Work",
    sourceUrl: "https://pyforgecourse.org/lesson/m05-l03",
    starterCode:
      'from functools import wraps\nfrom time import perf_counter\n\n\ndef timed(function):\n    @wraps(function)\n    def wrapper(*args, **kwargs):\n        # TODO: Capture a start time with perf_counter().\n        # TODO: Call function, print its elapsed time, and return its result.\n        return function(*args, **kwargs)\n    return wrapper\n\n\n@timed\ndef count_matches(words, predicate):\n    return sum(1 for word in words if predicate(word))\n\n\nwords = ["forge", "anvil", "python", "ore"]\nlong_word = lambda word: len(word) >= 5\nprint(count_matches(words, long_word))\n',
    expectedOutput:
      "Python Forge\n{'name': 'checkout', 'milliseconds': 240}\ntotal_even_squares took <a small non-negative number> seconds\n120\n\nThe exact number on the timing line varies by computer and run.",
    hints: [
      "The wrapper must return the saved result after it prints timing information.",
      "Use *args and **kwargs so the decorator can wrap functions with different parameters.",
      "Use a lambda for a one-expression key or predicate; name longer logic with def.",
    ],
    activity: {
      title: "Add a transparent timer",
      brief:
        "Finish a timing decorator and use a lambda predicate to count selected words without changing the function's result.",
      steps: [
        "Save start = perf_counter() before calling the wrapped function.",
        "Store the wrapped result, calculate perf_counter() - start, and print a formatted message.",
        "Run count_matches with the supplied long_word lambda and verify the printed count remains correct.",
        "Call the same function with a lambda that selects words containing the letter o and compare the two counts.",
      ],
      successCriteria: [
        "The decorator prints the wrapped function's name and a non-negative elapsed time.",
        "count_matches still returns an integer after decoration.",
        "The lambda changes selection behavior without modifying count_matches.",
      ],
    },
    reflectionPrompt:
      "What would you measure before replacing a clear loop with a more compact or more complex approach, and why must a lazy result be consumed during that measurement?",
    quiz: {
      question:
        "Why should a timing decorator return the wrapped function's result?",
      options: [
        "So existing callers keep receiving the value they expect.",
        "So perf_counter can reset automatically.",
        "So the decorator becomes a generator.",
        "So lambdas can contain multiple statements.",
      ],
      answer: 0,
      explanation:
        "A decorator should add timing behavior without breaking the normal contract of the function it wraps. Returning the saved result preserves that contract.",
    },
  },
  {
    id: "m06-l01",
    title: "Fail Clearly with Exceptions",
    sourceUrl: "https://pyforgecourse.org/lesson/m06-l01",
    starterCode:
      'class OrderValidationError(ValueError):\n    pass\n\n\ndef line_total(unit_price, quantity):\n    # TODO: reject a negative price with OrderValidationError\n    # TODO: reject a quantity of zero or less with OrderValidationError\n    return unit_price * quantity\n\n\ntry:\n    print(line_total(9.99, 2))\n    print(line_total(9.99, 0))\nexcept OrderValidationError as error:\n    print(f"order rejected: {error}")\n',
    expectedOutput:
      "total: 37.50\norder rejected: quantity must be greater than zero",
    hints: [
      "Subclass ValueError so the error communicates invalid input and remains familiar to Python users.",
      "Validate before multiplying; the first failing rule should raise immediately.",
      "Use one try/except around the call site, not inside line_total, so the function keeps one job.",
    ],
    activity: {
      title: "Add input guardrails to a line calculator",
      brief:
        "Complete the starter so it prices valid lines and rejects a negative price or a non-positive quantity with an OrderValidationError.",
      steps: [
        "Add an if statement for a negative unit_price and raise OrderValidationError with a specific message.",
        "Add a second if statement for quantity less than or equal to zero.",
        "Run the valid call and then the invalid call in the starter.",
        "Change the invalid value once more and confirm the message still identifies the broken rule.",
      ],
      successCriteria: [
        "A price of 9.99 and quantity of 2 produces 19.98.",
        "A quantity of zero raises OrderValidationError rather than returning zero.",
        "The caller catches only OrderValidationError and prints a helpful message.",
      ],
    },
    reflectionPrompt:
      "Where should an Order Calculator validate a rule: at every arithmetic operation, at its public function boundary, or both? Explain the trade-off in two or three sentences.",
    quiz: {
      question:
        "Why is a custom OrderValidationError useful in an order calculator?",
      options: [
        "It makes multiplication faster.",
        "It lets callers handle invalid order data separately from unrelated errors.",
        "It prevents every possible Python exception.",
        "It automatically fixes invalid quantities.",
      ],
      answer: 1,
      explanation:
        "A domain-specific exception tells the caller that a known order rule failed, so it can offer an appropriate correction without masking unrelated bugs.",
    },
  },
  {
    id: "m06-l02",
    title: "Prove Behavior with Unit Tests",
    sourceUrl: "https://pyforgecourse.org/lesson/m06-l02",
    starterCode:
      'import unittest\n\n\nclass OrderValidationError(ValueError):\n    pass\n\n\ndef discounted_total(price, quantity, discount_rate=0):\n    if price < 0 or quantity <= 0:\n        raise OrderValidationError("invalid price or quantity")\n    return round(price * quantity * (1 - discount_rate), 2)\n\n\nclass DiscountedTotalTests(unittest.TestCase):\n    def test_applies_discount(self):\n        # TODO: assert that 20 x 3 with 25% off is 45.0\n        pass\n\n    def test_rejects_zero_quantity(self):\n        # TODO: use assertRaises(OrderValidationError)\n        pass\n\n\nresult = unittest.TextTestRunner(verbosity=1).run(\n    unittest.defaultTestLoader.loadTestsFromTestCase(DiscountedTotalTests)\n)\nprint(f"tests successful: {result.wasSuccessful()}")\n',
    expectedOutput:
      "...\n----------------------------------------------------------------------\nRan 3 tests in 0.000s\n\nOK\ntests successful: True",
    hints: [
      "Use self.assertEqual(actual, expected) for a known total; put the function call first for readable failure messages.",
      "Place the invalid call inside 'with self.assertRaises(OrderValidationError):'.",
      "Pick a boundary deliberately: zero discount is valid, while zero quantity is not.",
    ],
    activity: {
      title: "Build a small behavior matrix",
      brief:
        "Finish the starter tests, then add one boundary test for a zero discount and one invalid test for a discount rate outside the allowed range after you add that validation.",
      steps: [
        "Complete the passing discount assertion in the starter.",
        "Complete the zero-quantity exception assertion.",
        "Add discount_rate validation to the function for values below zero or above one.",
        "Add a test for zero discount and a test for a rate above one.",
        "Run the suite and read any failure before changing code.",
      ],
      successCriteria: [
        "The suite includes a normal total, a valid boundary, and invalid inputs.",
        "The zero-quantity test expects OrderValidationError specifically.",
        "All tests pass after the discount-rate rule is implemented.",
      ],
    },
    reflectionPrompt:
      "Which test would catch a mistake that applies tax before a discount instead of after it? State the input and expected result you would choose.",
    quiz: {
      question:
        "What is the strongest reason to use assertRaises(OrderValidationError) instead of assertRaises(Exception)?",
      options: [
        "It uses less memory.",
        "It verifies the intended validation contract rather than allowing any unrelated error to pass the test.",
        "It causes unittest to skip the function call.",
        "It converts the error into a return value.",
      ],
      answer: 1,
      explanation:
        "A narrow assertion proves the rule raised the expected domain error. A broad Exception assertion can hide a typo, TypeError, or another unintended defect.",
    },
  },
  {
    id: "m06-l03",
    title: "Refactor for Change",
    sourceUrl: "https://pyforgecourse.org/lesson/m06-l03",
    starterCode:
      'from decimal import Decimal, ROUND_HALF_UP\n\n\ndef apply_discount(subtotal, rate):\n    # TODO: return subtotal after subtracting the percentage rate\n    return subtotal\n\n\ndef add_tax(amount, rate):\n    # TODO: return amount after adding the percentage rate\n    return amount\n\n\ndef money(amount):\n    return amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)\n\n\ndef order_total(unit_price, quantity, discount_rate, tax_rate):\n    # TODO: compose the small functions instead of placing all arithmetic here\n    return money(unit_price * quantity)\n\n\nprint(order_total(Decimal("19.99"), 3, Decimal("0.10"), Decimal("0.08")))\n',
    expectedOutput: "order total: $58.29",
    hints: [
      'Use Decimal("1") rather than a float when working with Decimal rates.',
      "Have order_total call apply_discount and add_tax in the business-rule order, then call money once at the end.",
      "A later local package can move each pure helper into a module without changing its tests.",
    ],
    activity: {
      title: "Turn one formula into a pipeline",
      brief:
        "Complete the refactor so the public order_total function composes discount, tax, and money helpers while preserving the shown total.",
      steps: [
        "Implement apply_discount using the subtotal and a Decimal rate.",
        "Implement add_tax using the amount after discount.",
        "Update order_total to name subtotal and discounted intermediate values.",
        "Run the example and verify the final total is 58.29.",
        "Write down which helper you would place in pricing.py in a local package.",
      ],
      successCriteria: [
        "order_total delegates discount and tax work instead of duplicating their formulas.",
        "The calculation produces Decimal('58.29') for the provided values.",
        "Each helper has one clear responsibility and performs no printing.",
      ],
    },
    reflectionPrompt:
      "If a new regional tax rule is added next month, which function or module should change, and which existing tests would you run first? Explain why.",
    quiz: {
      question: "Which change is a refactor rather than a behavior change?",
      options: [
        "Changing a 10% discount rule to 15%.",
        "Replacing a repeated tax formula with a named add_tax function while all tests keep the same expected totals.",
        "Accepting negative quantities that were previously rejected.",
        "Adding a new shipping fee to every order.",
      ],
      answer: 1,
      explanation:
        "Extracting a named helper improves structure while intentionally preserving the existing calculation contract. The other choices change what users receive.",
    },
  },
  {
    id: "m07-l01",
    title: "Paths, Text, and Context Managers",
    sourceUrl: "https://pyforgecourse.org/lesson/m07-l01",
    starterCode:
      'from io import StringIO\nfrom pathlib import PurePath\n\nfolder = PurePath("incoming")\nfilenames = ["notes.txt", "  todo.txt  ", ".draft"]\n\nfor filename in filenames:\n    clean_name = filename.strip()\n    # TODO: skip names that begin with a dot.\n    candidate = folder / clean_name\n    print(candidate)\n\nwith StringIO("alpha\\n\\n beta \\n") as source:\n    # TODO: build a list of cleaned, nonempty lines.\n    pass\n',
    expectedOutput:
      "incoming/field_notes/daily.txt\n2 nonempty lines\n- collect samples\n- record temperatures",
    hints: [
      "Use PurePath for path exercises that should not touch the browser filesystem.",
      "A list comprehension can both strip each line and filter out blank results.",
      "Keep file-like work inside the with block; return or store plain data afterward.",
    ],
    activity: {
      title: "Prepare a virtual notes folder",
      brief:
        "Practice separating path logic from text cleaning by preparing two imaginary note files in memory.",
      steps: [
        "Create a PurePath named archive/observations.",
        "Make a list containing two filenames and one hidden filename that starts with a dot.",
        "Print only the two visible full paths.",
        "Use StringIO with a three-line sample that includes one blank line, then print the cleaned lines.",
      ],
      successCriteria: [
        "The joined paths display archive/observations before each visible filename.",
        "The hidden filename is not printed.",
        "The final line list contains no empty strings or surrounding spaces.",
      ],
    },
    reflectionPrompt:
      "Where would separating path construction from file reading make a future program easier to test or debug?",
    quiz: {
      question:
        "Why is a with block a good default when reading a local text file?",
      options: [
        "It guarantees that every line is valid CSV.",
        "It automatically sorts the file contents.",
        "It scopes the resource and arranges cleanup when the block ends.",
        "It converts the filename into an absolute path.",
      ],
      answer: 2,
      explanation:
        "A context manager defines acquisition and cleanup around the block. It does not validate, sort, or change the path by itself.",
    },
  },
  {
    id: "m07-l02",
    title: "CSV, JSON, and Validation",
    sourceUrl: "https://pyforgecourse.org/lesson/m07-l02",
    starterCode:
      'import csv\nfrom io import StringIO\n\ncsv_text = "item,quantity\\nnotebook,3\\npencil,many\\n"\naccepted = []\nrejected = []\n\nfor row_number, row in enumerate(csv.DictReader(StringIO(csv_text)), start=2):\n    # TODO: convert quantity to int.\n    # TODO: append a cleaned record to accepted or a useful issue to rejected.\n    print(row_number, row)\n\nprint("Accepted:", accepted)\nprint("Rejected:", rejected)\n',
    expectedOutput:
      '{\n  "issues": [\n    {\n      "reason": "invalid literal for int() with base 10: \'not-a-number\'",\n      "row": 3\n    },\n    {\n      "reason": "missing submitted date",\n      "row": 4\n    }\n  ],\n  "valid_records": [\n    {\n      "name": "Ana",\n      "score": 91\n    }\n  ]\n}',
    hints: [
      "DictReader uses the first CSV row as keys, so choose clear header names.",
      "Put only the conversion and rule checks inside try; keep the success path in else.",
      "Include the source row number in every issue so a person can locate it again.",
    ],
    activity: {
      title: "Validate a tiny inventory import",
      brief:
        "Turn a three-row CSV string into accepted inventory records and a separate list of rejected rows.",
      steps: [
        "Create CSV text with item and quantity headers, including one nonnumeric quantity.",
        "Read it with csv.DictReader and count data rows starting at line 2.",
        "Accept only integer quantities from 0 through 50.",
        "Create a JSON string containing accepted records and issues, then print it with indentation.",
      ],
      successCriteria: [
        "Accepted quantities are stored as integers rather than strings.",
        "The invalid row appears in issues with its line number and reason.",
        "The printed report is valid, indented JSON.",
      ],
    },
    reflectionPrompt:
      "Which validation rule in a real dataset would be most valuable to explain to a teammate, and why?",
    quiz: {
      question:
        "What is the most accurate distinction between parsing and validation?",
      options: [
        "Parsing checks file permissions; validation encrypts a report.",
        "Parsing reads a format into values; validation checks whether those values meet your rules.",
        "Parsing only applies to JSON; validation only applies to CSV.",
        "They are two names for automatically correcting bad data.",
      ],
      answer: 1,
      explanation:
        "A syntactically readable field can still violate a business or project rule. Validation makes that second decision explicit.",
    },
  },
  {
    id: "m07-l03",
    title: "Batch File Intelligence",
    sourceUrl: "https://pyforgecourse.org/lesson/m07-l03",
    starterCode:
      'from pathlib import PurePath\n\nfiles = [\n    {"name": "guide.pdf", "content": b"%PDF-2.0\\nexample"},\n    {"name": "portrait.png", "content": b"not really a PNG"},\n    {"name": "readme.txt", "content": b"hello"},\n]\n\ndef inspect(record):\n    path = PurePath(record["name"])\n    # TODO: detect PDF and PNG signatures from record["content"].\n    # TODO: return a dictionary with name, suffix, kind, and a warning when suffix and signature conflict.\n    return {"name": path.name, "suffix": path.suffix, "kind": "TODO"}\n\nfor record in files:\n    print(inspect(record))\n',
    expectedOutput:
      "overview.pdf: PDF document; 17 bytes; 65d6530c\nphoto.png: PNG image; 14 bytes; 46248366\nnotes.txt: text file; 10 bytes; c9ecf5e5",
    hints: [
      "Use bytes.startswith(...) to compare a short signature without decoding the entire content.",
      "Normalize suffixes with lower() before comparing them.",
      "A warning is better than a crash when the name and the content evidence disagree.",
    ],
    activity: {
      title: "Flag a mislabeled media file",
      brief:
        "Extend an in-memory inspector so it notices when a name implies an image but the leading bytes do not support that claim.",
      steps: [
        "Create three simulated records: one PDF, one valid PNG signature, and one .png file with text bytes.",
        "Write a classify function that checks signatures before using a suffix fallback.",
        "For each result, store name, kind, byte_count, and warnings in a dictionary.",
        "Print a final count of each detected kind and the names of warned files.",
      ],
      successCriteria: [
        "The valid PDF and PNG are classified from their signatures.",
        "The mislabeled .png record has at least one warning instead of being silently accepted.",
        "The summary is computed from stored results rather than hand-written counts.",
      ],
    },
    reflectionPrompt:
      "What decision would you postpone for human review when a file extension and its first bytes disagree?",
    quiz: {
      question:
        "What can a leading-byte signature check establish most responsibly?",
      options: [
        "That the file is completely safe and free of corruption.",
        "That the bytes are consistent with a limited file-format expectation.",
        "That every page of a PDF has been read successfully.",
        "That an image has a particular width and height.",
      ],
      answer: 1,
      explanation:
        "A signature is useful evidence for classification, but it cannot prove safety, completeness, or rich content details.",
    },
  },
  {
    id: "m08-l01",
    title: "Read API Responses Like a Developer",
    sourceUrl: "https://pyforgecourse.org/lesson/m08-l01",
    starterCode:
      'import json\n\nraw_response = \'\'\'\n{\n  "status": 200,\n  "items": [\n    {"title": "Small Tools", "minutes": 18},\n    {"title": "Debugging Stories"}\n  ]\n}\n\'\'\'\n\npayload = json.loads(raw_response)\n\n# TODO: Check that the simulated status is 200.\n# TODO: Print each title and its minutes, using 0 when minutes is absent.\n# TODO: Print the total reading time.\n',
    expectedOutput:
      "Designing Data Pipelines -> python, data\nQuiet Systems -> untagged\nMore pages: False",
    hints: [
      "json.loads converts a JSON string into ordinary Python values.",
      "Use payload.get('items', []) so an absent list becomes an empty list.",
      "A missing optional number can use item.get('minutes', 0).",
    ],
    activity: {
      title: "Normalize a tiny reading payload",
      brief:
        "Complete the starter so it accepts the supplied JSON, prints each reading item, and reports a total without assuming every item has a minutes field.",
      steps: [
        "Parse raw_response once and store the resulting payload.",
        "Branch on the status value before processing items.",
        "Loop over the item list and print a readable line for each title.",
        "Accumulate minutes with a default of zero, then print the total.",
      ],
      successCriteria: [
        "The program runs without an IndexError or KeyError.",
        "Small Tools is counted as 18 minutes and Debugging Stories as 0 minutes.",
        "A non-200 status would not be treated as a successful payload.",
      ],
    },
    reflectionPrompt:
      "Which assumptions about a payload felt tempting to make, and how did your code make those assumptions visible or safer?",
    quiz: {
      question:
        "A simulated API response has status 429. What is the most responsible next behavior?",
      options: [
        "Immediately send the same request in a tight loop.",
        "Treat the response as successful because JSON was returned.",
        "Pause according to documented guidance, then retry carefully if appropriate.",
        "Embed a different secret in the request and try again.",
      ],
      answer: 2,
      explanation:
        "Status 429 means too many requests. A well-behaved client slows down, follows any server guidance, and avoids retry storms.",
    },
  },
  {
    id: "m08-l02",
    title: "Extract News Without Crossing Lines",
    sourceUrl: "https://pyforgecourse.org/lesson/m08-l02",
    starterCode:
      'from html.parser import HTMLParser\n\nHTML = \'\'\'\n<article data-rank="1"><h2>River Maps</h2><span class="score">28</span></article>\n<article data-rank="2"><h2>Tool Libraries</h2><span class="score">31</span></article>\n\'\'\'\n\nclass HeadlineParser(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.headlines = []\n        self.inside_heading = False\n\n    def handle_starttag(self, tag, attrs):\n        # TODO: Set inside_heading to True when an h2 begins.\n        pass\n\n    def handle_data(self, data):\n        # TODO: Append stripped heading text only while inside_heading is True.\n        pass\n\n    def handle_endtag(self, tag):\n        # TODO: Set inside_heading to False when an h2 ends.\n        pass\n\nparser = HeadlineParser()\nparser.feed(HTML)\nprint(parser.headlines)\n',
    expectedOutput: "#1 Reliable Robots (42)\n#2 Garden Sensors (35)",
    hints: [
      "HTMLParser calls handle_starttag, handle_data, and handle_endtag as it reads markup.",
      "Convert attrs to dict(attrs) when you need to inspect a named attribute.",
      "Use data.strip() so indentation and line breaks do not become headlines.",
    ],
    activity: {
      title: "Build a headline-only parser",
      brief:
        "Finish the supplied parser so it extracts the two h2 headlines from local sample HTML and ignores rank and score text.",
      steps: [
        "Use the start-tag callback to enter heading mode for h2.",
        "In the data callback, append only non-empty text while heading mode is active.",
        "Use the end-tag callback to leave heading mode.",
        "Run the parser and compare the list with the two expected headlines.",
      ],
      successCriteria: [
        "The result is ['River Maps', 'Tool Libraries'].",
        "The numbers 28 and 31 are not included.",
        "Your state resets after each closing h2 tag.",
      ],
    },
    reflectionPrompt:
      "What would you check before changing this offline parser into a request to a real publisher's site, and why?",
    quiz: {
      question: "Which plan best reflects ethical scraping practice?",
      options: [
        "Bypass a login because the page renders in a browser.",
        "Collect every page rapidly before the layout changes.",
        "Prefer an authorized feed or API, collect narrowly, pace requests, and retain source context.",
        "Assume robots guidance replaces terms, privacy, and legal review.",
      ],
      answer: 2,
      explanation:
        "Responsible collection begins with the appropriate access method and limits collection, request rate, and reuse to the stated purpose.",
    },
  },
  {
    id: "m08-l03",
    title: "Design Automation That Can Wait",
    sourceUrl: "https://pyforgecourse.org/lesson/m08-l03",
    starterCode:
      'articles = [\n    {"id": "n-201", "title": "City Beehives", "score": 33},\n    {"id": "n-202", "title": "Tiny Libraries", "score": 12}\n]\n\nsent_ids = set()\nthreshold = 25\n\n# TODO: Write a function that returns a readable notification preview.\n# TODO: Print a preview only for articles at or above threshold.\n# TODO: Add the article id to sent_ids after previewing to model idempotency.\n# Do not send email or SMS from this practice program.\n',
    expectedOutput:
      "TO: reader@example.invalid\nSUBJECT: Reading pick: Open Data Garden\nBODY: Ranked score 47. Review before sending.\nSTATUS: preview only; no message sent",
    hints: [
      "Keep the decision condition separate from the text-formatting function.",
      "A set is useful for fast membership checks such as article['id'] in sent_ids.",
      "A preview is a safe test double for a provider call.",
    ],
    activity: {
      title: "Create a review-first notifier",
      brief:
        "Complete the starter to print a notification preview for qualifying articles and remember the IDs it has previewed, while making no real network or messaging call.",
      steps: [
        "Choose the fields that belong in a concise subject and body.",
        "Loop through the supplied article records and compare score with threshold.",
        "Skip an item if its ID is already in sent_ids.",
        "Print a preview and then add the qualifying ID to the set.",
      ],
      successCriteria: [
        "City Beehives receives one preview and Tiny Libraries does not.",
        "Running the selection logic again with the same set does not preview City Beehives twice.",
        "The program contains no credential, email, SMS, or browser call.",
      ],
    },
    reflectionPrompt:
      "Where would you place a human review gate in a real reading-alert workflow, and what failure would that gate prevent?",
    quiz: {
      question: "Why keep a stable notification ID in a sent_ids set?",
      options: [
        "To make a message body longer.",
        "To prevent an uncertain retry from creating duplicate notifications.",
        "To bypass an email provider's authentication rules.",
        "To replace all rate-limit handling.",
      ],
      answer: 1,
      explanation:
        "A stable identifier supports idempotency: after an item is recorded as completed, later runs can avoid sending the same alert again.",
    },
  },
  {
    id: "m09-l01",
    title: "Routes and the Request-Response Cycle",
    sourceUrl: "https://pyforgecourse.org/lesson/m09-l01",
    starterCode:
      'from dataclasses import dataclass\n\n@dataclass\nclass Response:\n    status: int\n    body: str\n\ndef projects():\n    return Response(200, "Projects page")\n\nROUTES = {\n    # TODO: Add a GET route for /projects using the projects function.\n}\n\ndef dispatch(method, path):\n    # TODO: Look up (method, path) and return either its response or a 404 Response.\n    return Response(404, "TODO: route not found")\n\nprint(dispatch("GET", "/projects"))\n',
    expectedOutput:
      "('GET', '/') -> 200 <h1>Avery Chen | Developer</h1>\n('POST', '/contact') -> 405 Method not allowed\n('GET', '/missing') -> 404 Page not found",
    hints: [
      'Use a tuple such as ("GET", "/projects") as the dictionary key.',
      "Call the handler only after checking that the lookup returned a function.",
      "A missing path and a wrong method can be treated differently when you are ready.",
    ],
    activity: {
      title: "Map portfolio routes",
      brief:
        "Extend the router so a visitor can request a project list and an about page.",
      steps: [
        "Write an about function and a projects function that each return a 200 Response.",
        "Add GET entries for /about and /projects to ROUTES.",
        "Update dispatch so a missing route returns a 404 Response with a helpful body.",
        "Print results for /about, /projects, and /not-here.",
      ],
      successCriteria: [
        "Both known paths return status 200.",
        "The unknown path returns status 404 instead of raising an exception.",
        "Each route body identifies the page it represents.",
      ],
    },
    reflectionPrompt:
      "Which detail should a route inspect first in your contact app: path, method, or form data? Explain the order you would use and why.",
    quiz: {
      question:
        "Why should GET /contact and POST /contact normally be separate route cases?",
      options: [
        "They have different jobs: showing the form versus processing submitted data.",
        "POST requests cannot contain text.",
        "GET routes always require a password.",
        "A path can only be used once in an app.",
      ],
      answer: 0,
      explanation:
        "The path identifies the resource, while the method expresses the requested action. Showing a form and processing it are distinct actions.",
    },
  },
  {
    id: "m09-l02",
    title: "Templates, Forms, Validation, and Sessions",
    sourceUrl: "https://pyforgecourse.org/lesson/m09-l02",
    starterCode:
      'from html import escape\n\ndef validate_contact(form):\n    name = form.get("name", "").strip()\n    message = form.get("message", "").strip()\n    errors = {}\n    # TODO: Add an error if name is blank.\n    # TODO: Add an error if message has fewer than 10 characters.\n    return errors, {"name": name, "message": message}\n\ndef render_preview(values):\n    # TODO: Escape the name and message before formatting them into HTML.\n    return "<p>Preview pending</p>"\n\nerrors, values = validate_contact({"name": "Sam", "message": "Hello there!"})\nprint(errors)\nprint(render_preview(values))\n',
    expectedOutput:
      "{}\n<h1>Contact &lt;Mina&gt;</h1><p>I liked your data project.</p>",
    hints: [
      "Use form.get with an empty-string default so a missing field does not crash the function.",
      'Store errors under field names, such as errors["message"].',
      "Call html.escape on user-provided text immediately before adding it to HTML.",
    ],
    activity: {
      title: "Create a safe contact preview",
      brief:
        "Finish the validator and show either field errors or an escaped preview for a contact inquiry.",
      steps: [
        "Add required-name and minimum-message checks to validate_contact.",
        "Test one form with an empty name and another valid form containing angle brackets.",
        "Use escape in render_preview for every value coming from the form.",
        "Print the errors and preview for both tests.",
      ],
      successCriteria: [
        "Invalid data produces named errors without an exception.",
        "A valid form produces no errors.",
        "Angle brackets in the preview appear as escaped text.",
      ],
    },
    reflectionPrompt:
      "Why are validation and output escaping separate protections? Give one example of a value that needs both.",
    quiz: {
      question:
        "What is the best reason to validate contact data on the server even when the browser checks it?",
      options: [
        "Client-side checks can be bypassed or changed by a visitor.",
        "Server validation makes HTML unnecessary.",
        "Browsers cannot display error messages.",
        "Validation automatically encrypts a password.",
      ],
      answer: 0,
      explanation:
        "Client-side validation is helpful feedback, not a trust boundary. The server must decide whether submitted data is acceptable.",
    },
  },
  {
    id: "m09-l03",
    title: "Authentication, Persistence, Deployment, and Security",
    sourceUrl: "https://pyforgecourse.org/lesson/m09-l03",
    starterCode:
      'from hashlib import pbkdf2_hmac\nfrom hmac import compare_digest\n\nSALT = b"learning-only-salt"\n\ndef password_digest(password):\n    # TODO: Return a hexadecimal pbkdf2_hmac sha256 digest.\n    return "TODO"\n\ndef can_view_inbox(password, stored_digest):\n    # TODO: Compare digests with compare_digest, not ==.\n    return False\n\nstored_digest = password_digest("forge-demo")\nprint(can_view_inbox("wrong-password", stored_digest))\n',
    expectedOutput:
      "True\n[]\n[{'name': 'Mina', 'message': 'Can we discuss a project?'}]",
    hints: [
      "pbkdf2_hmac takes the algorithm name, encoded password, salt, and iteration count.",
      "A protected inbox should return no records unless authentication succeeds.",
      "An in-memory list is a test double, not durable storage after a restart.",
    ],
    activity: {
      title: "Protect the inquiry inbox",
      brief:
        "Complete a password-check simulation and use its Boolean result to control access to sample inquiries.",
      steps: [
        "Implement password_digest with pbkdf2_hmac and a sensible demonstration iteration count.",
        "Implement can_view_inbox with compare_digest.",
        "Create a short list of inquiry dictionaries in memory.",
        "Print the list only when can_view_inbox returns True for the test password.",
      ],
      successCriteria: [
        "The correct password succeeds and a wrong password fails.",
        "No plaintext password is stored in a variable named as a database record.",
        "The inbox is not printed for an unsuccessful check.",
      ],
    },
    reflectionPrompt:
      "List one control for authentication, one for authorization, and one for deployment. How would each reduce a different risk?",
    quiz: {
      question:
        "Which practice is appropriate before deploying a Flask contact app?",
      options: [
        "Leave debug mode enabled so visitors can report stack traces.",
        "Commit the secret key beside the route code for convenience.",
        "Use HTTPS, disable debug mode, and keep secrets in deployment configuration.",
        "Trust the browser to prevent cross-site form submissions.",
      ],
      answer: 2,
      explanation:
        "Production deployment should avoid debug detail exposure, protect secrets, and encrypt traffic. CSRF defenses must also be enforced by the app.",
    },
  },
  {
    id: "m10-l1",
    title: "Notebook Thinking: From Questions to Tables",
    sourceUrl: "https://pyforgecourse.org/lesson/m10-l1",
    starterCode:
      '# Question: Which channel has the highest average wait time?\n# Complete the loop without changing the raw rows.\nwaits = [\n    {"channel": "email", "minutes": 14},\n    {"channel": "chat", "minutes": 6},\n    {"channel": "email", "minutes": 22},\n    {"channel": "phone", "minutes": 11},\n]\n\nminutes_by_channel = {}\nfor row in waits:\n    # TODO: create a list for a new channel and append row["minutes"].\n    pass\n\n# TODO: compute and print one average per channel, formatted to one decimal place.\nprint("Replace the TODO sections, then rerun all cells from the top.")',
    expectedOutput:
      "After completing the TODOs, the program prints a labeled average for chat, email, and phone. Email should be the highest at 18.0 minutes.",
    hints: [
      "dict.setdefault(key, []) returns the existing list or stores and returns a new one.",
      "An average is sum(values) / len(values), so calculate it after all rows have been collected.",
      "Keep the final print after your loop; its current message is only a reminder while the code is incomplete.",
    ],
    activity: {
      title: "Build a mini notebook outline",
      brief:
        "Turn the wait-time question into a compact, repeatable analysis that a teammate could review.",
      steps: [
        "Write one decision question and name the intended audience in two sentences.",
        "Complete the starter code and run it from top to bottom twice.",
        "Add one row with a missing or unusual value on paper and state the cleaning rule you would use.",
        "Write one observation from the output and one cautious action a manager could test.",
      ],
      successCriteria: [
        "The question identifies both a decision and an audience.",
        "The calculation uses all valid rows and labels each group clearly.",
        "The conclusion distinguishes what the numbers show from what should be tested next.",
      ],
    },
    reflectionPrompt:
      "Where could hidden notebook state or an undocumented cleaning choice change the story you tell from these rows?",
    quiz: {
      question:
        "Why should a notebook record its handling of missing durations before reporting an average?",
      options: [
        "It makes the average calculation run faster.",
        "It shows how the result may have been affected and lets another person reproduce it.",
        "It guarantees that every missing value should become zero.",
        "It removes the need to inspect raw rows.",
      ],
      answer: 1,
      explanation:
        "Missing-data treatment can change a summary. Recording the rule makes the analysis reviewable and prevents an unsupported appearance of precision.",
    },
  },
  {
    id: "m10-l2",
    title: "Test a Classifier Before You Trust It",
    sourceUrl: "https://pyforgecourse.org/lesson/m10-l2",
    starterCode:
      '# Do not change test while experimenting with the rule.\ntest = [(15, 0), (42, 0), (58, 1), (91, 1), (49, 1)]\nthreshold = 50\n\ndef predict(score):\n    # TODO: return 1 for a predicted positive and 0 otherwise.\n    pass\n\ntp = fp = tn = fn = 0\nfor score, actual in test:\n    predicted = predict(score)\n    # TODO: update exactly one of tp, fp, tn, fn for this pair.\n    pass\n\n# TODO: guard against zero denominators, then print precision and recall.\nprint("Metrics will appear after the TODOs are complete.")',
    expectedOutput:
      "With the suggested threshold rule, the completed code reports TP=2, FP=0, TN=2, FN=1, precision=1.00, and recall=0.67.",
    hints: [
      "A positive prediction can be written as int(score >= threshold).",
      "Compare predicted and actual together; there are four possible pairs: 1/1, 1/0, 0/0, and 0/1.",
      "Precision is tp / (tp + fp); recall is tp / (tp + fn). Use an if check before dividing.",
    ],
    activity: {
      title: "Write a threshold decision memo",
      brief:
        "Evaluate the rule, then decide whether its errors fit a proposed image-screening workflow.",
      steps: [
        "Complete the starter code and verify each confusion-matrix count by hand.",
        "Change the threshold to 45 and 60 without changing the test examples.",
        "Record precision, recall, and the false-positive and false-negative counts for each threshold.",
        "Choose one threshold for a human-reviewed recycling sorter and justify it in three sentences.",
      ],
      successCriteria: [
        "The test set remains fixed while thresholds change.",
        "The memo names the metric trade-off rather than claiming one score is simply best.",
        "The proposed workflow includes a human response to uncertain or disputed cases.",
      ],
    },
    reflectionPrompt:
      "For an image system that routes items for human review, which error would you rather reduce first, and who should help make that choice?",
    quiz: {
      question:
        "A classifier predicts 12 positives, 9 of which are truly positive. Which metric is 9/12?",
      options: ["Precision", "Recall", "Accuracy", "Specificity"],
      answer: 0,
      explanation:
        "Precision is the share of predicted positives that are correct: true positives divided by all predicted positives. Recall instead divides by all actual positives.",
    },
  },
  {
    id: "m10-l3",
    title: "Tell the Story, Set the Guardrails, Present the Work",
    sourceUrl: "https://pyforgecourse.org/lesson/m10-l3",
    starterCode:
      '# Create a text chart for a data-story draft.\nvisits = {"Library": 18, "Park": 11, "Transit": 7}\n\nprint("Reported observations by location")\nfor location, count in visits.items():\n    # TODO: choose a scale and create a bar string made of \'#\'.\n    bar = ""\n    # TODO: print a consistently aligned labeled row with the count.\n    pass\n\n# TODO: print one limitation that a reader should know before acting on the chart.\nprint("Add your limitation after completing the chart.")',
    expectedOutput:
      "A completed solution prints three labeled text bars. Library has the longest bar, and the output ends with a concrete limitation such as the unknown observation period or reporting coverage.",
    hints: [
      "String multiplication turns '#' * count into a simple bar; choose a smaller scale if the bars are too wide.",
      "Use an f-string such as f'{location:<8} | {bar} {count}' for aligned labels.",
      "A limitation describes what the data cannot establish, not an excuse to omit the source or time window.",
    ],
    activity: {
      title: "Draft your portfolio evidence panel",
      brief:
        "Prepare the core evidence and guardrails you will carry into the capstone project.",
      steps: [
        "Complete the starter chart and give it a title that names the measure and audience.",
        "Write a two-sentence insight: one observation and one proportionate proposed action.",
        "List one image-recognition use that is allowed, one that is prohibited, and one human fallback.",
        "Practice a 60-second explanation using problem, evidence, decision, limitation, and next step.",
      ],
      successCriteria: [
        "The chart labels the comparison and does not imply causation it cannot show.",
        "The proposal names a concrete privacy, consent, or error-handling safeguard.",
        "The spoken outline includes a limitation and avoids claiming a planned model has been deployed.",
      ],
    },
    reflectionPrompt:
      "What is the most important limitation you would disclose to a hiring manager, and how does disclosing it make your recommendation stronger?",
    quiz: {
      question:
        "Which addition most directly makes an image-recognition proposal safer when confidence is low?",
      options: [
        "Automatically make a stronger prediction.",
        "Hide uncertain cases from the evaluation report.",
        "Route the case to a trained human or request a new image.",
        "Remove the data-retention policy to simplify the project.",
      ],
      answer: 2,
      explanation:
        "A defined human fallback prevents uncertain automated outputs from becoming unreviewed decisions and gives the system a safer operating boundary.",
    },
  },
  {
    id: "project-01",
    title: "Portfolio Project 01 · Launch Checklist Generator",
    sourceUrl: "https://pyforgecourse.org/projects/1",
    starterCode:
      '# Launch Checklist Generator\nrelease_name = input("Release name: ")\nowner = input("Checklist owner: ")\nopen_tasks_text = input("Open tasks: ")\ncompleted_checks_text = input("Completed checks: ")\n\n# TODO: Convert both text responses to integers.\nopen_tasks = 0\ncompleted_checks = 0\n\n# TODO: Calculate the total number of tracked items.\ntotal_items = 0\n\n# TODO: Set status with if/else.\nstatus = "TODO"\n\n# TODO: Print a clear multi-line checklist summary.\nprint("Checklist summary goes here")',
    expectedOutput:
      "Use the requirements and definition of done to test each part of your project. Save the resulting Python file to your portfolio.",
    hints: [
      "Add a third status, HOLD, when open tasks are greater than 5, and explain the rule in the output.",
      "Ask for an estimated minutes-per-open-task value and calculate a remaining-work estimate using float().",
      "Use a simple loop with try/except ValueError to keep asking until a whole-number count is entered.",
    ],
    activity: {
      title: "Portfolio build brief",
      brief:
        "Build a command-line tool that gathers launch details, reports the state of a small release, and gives a clear next-step status.",
      steps: [
        "Ask for a release or project name and a checklist owner using input().",
        "Ask for whole-number counts of open tasks and completed checks, then convert both responses with int().",
        "Calculate a total tracked-item count from the two numeric values.",
        "Use an if/else decision to set a status of READY FOR REVIEW only when open tasks equals zero; otherwise use ACTION NEEDED.",
        "Print a labeled, multi-line summary using at least two f-strings, including the name, owner, both counts, total, and status.",
      ],
      successCriteria: [
        "The program accepts a name, owner, and two whole-number responses without crashing.",
        "The displayed total equals open tasks plus completed checks for multiple test cases.",
        "The status is READY FOR REVIEW exactly when the open task count is 0.",
        "A teammate can understand the final output without seeing the source code.",
      ],
    },
    reflectionPrompt:
      "Which variables represent facts supplied by a person, and which represent values your program derived? What input pair did you use to test the READY FOR REVIEW branch, and what pair tested ACTION NEEDED? If another teammate used this tool tomorrow, what one output improvement would make it more useful?",
  },
  {
    id: "project-02",
    title: "Portfolio Project 02 · Expense Splitter & Word Frequency Analyzer",
    sourceUrl: "https://pyforgecourse.org/projects/2",
    starterCode:
      '# Python Forge Module 02 Portfolio Project\n\nexpenses = [\n    ("snacks", 18.50),\n    ("printing", 7.25),\n    ("transport", 12.00),\n    ("supplies", 9.75),\n]\nparticipants = ["Ari", "Bo", "Chen"]\nbudget = 45.00\n\n# TODO: Use a for loop to calculate total_expenses.\n# TODO: Calculate share_per_person from total_expenses and participants.\n# TODO: Print a labeled expense report and a budget status using if/else.\n\nmeeting_notes = "Plan, build, plan! Test the build and plan."\n\n# TODO: Lowercase the notes and remove . , ! ? using a loop or chained replace calls.\n# TODO: Split the cleaned notes into words.\n# TODO: Build word_counts with counts.get(word, 0) + 1.\n# TODO: Print an alphabetical Word Frequency Report and its unique-word total.\n',
    expectedOutput:
      "Use the requirements and definition of done to test each part of your project. Save the resulting Python file to your portfolio.",
    hints: [
      "Add a dictionary of individual contributions and print whether each participant owes money or should be reimbursed.",
      "Print the most frequent word or words by finding the largest count without importing a package.",
      "Skip a small set of common words such as and, the, and to before generating the frequency report.",
    ],
    activity: {
      title: "Portfolio build brief",
      brief:
        "Build two compact data tools: one divides a shared bill fairly, and the other transforms a sentence into a normalized frequency report.",
      steps: [
        "Store at least four expense records as tuples containing a category string and a positive numeric amount, then use a loop to calculate the total.",
        "Use a participants list with at least three names and calculate an equal per-person share rounded only for display.",
        "Use a conditional to print a budget warning when the total exceeds a named budget, otherwise print a within-budget message.",
        "Normalize an included meeting_notes string to lowercase and remove at least the punctuation characters . , ! ? before splitting it into words.",
        "Build a word-frequency dictionary with get, then display every word and count in alphabetical order along with a count of unique words.",
      ],
      successCriteria: [
        "The expense section correctly totals the supplied amounts, computes an equal share, and labels money with two decimal places.",
        "Changing the participants list or an expense amount automatically changes the calculations without edits to the loop logic.",
        "The frequency section treats Plan and plan as the same word and does not retain the listed punctuation in keys.",
        "The final output has clear headings and an alphabetically ordered frequency report that another learner can inspect.",
      ],
    },
    reflectionPrompt:
      "Which data structure did each half of the project rely on most, and why was it a good fit? What happens to your results when you add a new participant, a duplicate word, or a punctuation mark? Which part of the program would you turn into a function next, and what inputs and return value would it have?",
  },
  {
    id: "project-03",
    title: "Portfolio Project 03 · Build a Reusable Text Toolkit",
    sourceUrl: "https://pyforgecourse.org/projects/3",
    starterCode:
      'PUNCTUATION = ".,!?;:"\n\n\ndef clean_text(text):\n    """Return text with repeated whitespace collapsed."""\n    # TODO: validate the type if you choose to support only strings.\n    pass\n\n\ndef word_count(text):\n    """Return the number of words after cleaning text."""\n    # TODO: build this from clean_text.\n    pass\n\n\ndef unique_words(text):\n    """Return sorted, lowercase unique words using the toolkit punctuation rule."""\n    # TODO: strip PUNCTUATION from each candidate and ignore empty candidates.\n    pass\n\n\ndef make_preview(text, limit=40):\n    """Return cleaned text, shortened with an ellipsis when necessary."""\n    # TODO: use clean_text and respect the default limit.\n    pass\n\n\ndef analyze_text(text):\n    """Return the toolkit\'s measurements in one dictionary."""\n    # TODO: combine your smaller functions; guard the empty-text average.\n    pass\n\n\ndef run_demo():\n    sample = "  Forge   small tools. Forge them carefully!  "\n    print(analyze_text(sample))\n\n\nif __name__ == "__main__":\n    run_demo()',
    expectedOutput:
      "Use the requirements and definition of done to test each part of your project. Save the resulting Python file to your portfolio.",
    hints: [
      "Add `top_words(text, count=3)` that returns the most frequent cleaned words, breaking ties alphabetically with only the standard library.",
      "Add an optional `keep_case=False` parameter to `unique_words` and document exactly how it changes the result.",
      "Create a `run_self_checks()` function that groups your assertions and prints one short success message only after all checks pass.",
    ],
    activity: {
      title: "Portfolio build brief",
      brief:
        "Create a small, import-friendly collection of text functions that cleans a note, measures it, extracts useful vocabulary, and creates a compact preview.",
      steps: [
        "Implement `clean_text(text)` to strip leading and trailing whitespace and collapse internal whitespace to single spaces; include a docstring and return a new string.",
        "Implement `word_count(text)` and `unique_words(text)` so they work predictably with empty text. Define a simple punctuation rule in a comment or docstring, and return a sorted list from `unique_words` for stable results.",
        "Implement `make_preview(text, limit=40)` using a default limit. It must clean the input first, return the whole cleaned text when it fits, and avoid a trailing space before an added ellipsis when it does not fit.",
        "Implement `analyze_text(text)` to return a dictionary containing `character_count`, `word_count`, `unique_word_count`, and `average_word_length`; the average must be `0.0` when there are no words.",
        "Add at least six `assert` self-checks spanning normal text, repeated whitespace, empty text, punctuation, and a shortened preview. Finish with a readable demo that calls `analyze_text` and does not write files or make network requests.",
      ],
      successCriteria: [
        "Each public function has a purposeful name, concise docstring, clear parameters, and a return value that another program can reuse.",
        'For `"  Red   blue red!  ", the cleaned text is `Red blue red!`, the word count is 3, and the unique-word result follows the documented lowercase punctuation rule.',
        '`analyze_text("")` returns a complete dictionary with zero counts and an average word length of `0.0`, without an exception.',
        "All six or more assertions pass, and the final demo prints a readable analysis without mutating global configuration, writing files, or using a network call.",
      ],
    },
    reflectionPrompt:
      "Which function would be easiest for another program to reuse, and what detail in its contract makes it clear? What edge case changed your implementation most, and which assertion now protects that decision? If you consulted an AI tool, what did you verify yourself before keeping or rejecting its suggestion?",
  },
  {
    id: "project-04",
    title: "Portfolio Project 04 · Build a Library Lending System",
    sourceUrl: "https://pyforgecourse.org/projects/4",
    starterCode:
      'from dataclasses import dataclass\n\n@dataclass\nclass Loan:\n    book_id: str\n    member_id: str\n    due_day: int\n\nclass Book:\n    def __init__(self, book_id, title, author):\n        self.book_id = book_id\n        self.title = title\n        self.author = author\n        self.borrower_id = None\n\n    def checkout(self, member_id):\n        # TODO: refuse an already-loaned book; otherwise save the borrower.\n        pass\n\n    def checkin(self):\n        # TODO: refuse or report an unnecessary return; otherwise clear borrower_id.\n        pass\n\nclass ReferenceBook(Book):\n    def checkout(self, member_id):\n        # TODO: return a clear refusal message for reference-only material.\n        pass\n\nclass Member:\n    def __init__(self, member_id, name, loan_limit=2):\n        self.member_id = member_id\n        self.name = name\n        self.loan_limit = loan_limit\n        self.loan_count = 0\n\n    def can_borrow(self):\n        # TODO: return True only below the member\'s loan limit.\n        pass\n\nclass Library:\n    def __init__(self):\n        self.books = {}\n        self.members = {}\n        self.loans = []\n\n    def add_book(self, book):\n        self.books[book.book_id] = book\n\n    def add_member(self, member):\n        self.members[member.member_id] = member\n\n    def lend_book(self, book_id, member_id, due_day):\n        # TODO: validate IDs, ask Member and Book to approve the loan,\n        # update the member, append a Loan, and return a useful message.\n        pass\n\n    def return_book(self, book_id):\n        # TODO: check the book in, reduce the matching member\'s count,\n        # remove its active Loan record, and return a useful message.\n        pass\n\n    def report(self):\n        # TODO: return a multi-line active-loan report.\n        pass\n\nlibrary = Library()\nlibrary.add_book(Book("B1", "Tide Tables", "Nia Reed"))\nlibrary.add_book(ReferenceBook("R1", "Local Archive", "J. Stone"))\nlibrary.add_member(Member("M1", "Kai", loan_limit=1))\n\n# TODO: Demonstrate one successful loan, one refusal, one return, and report output.\n',
    expectedOutput:
      "Use the requirements and definition of done to test each part of your project. Save the resulting Python file to your portfolio.",
    hints: [
      "Add a waitlist list to Book and a request_hold method that prevents duplicate member requests.",
      "Use datetime.date from the standard library to calculate due dates and label overdue loans relative to a supplied current date.",
      "Add a DigitalBook subclass with a separate copy limit, then explain in comments why inheritance fits it or refactor to a lending-policy composition if it does not.",
    ],
    activity: {
      title: "Portfolio build brief",
      brief:
        "Create an in-memory lending system that lets a librarian register books and members, lend available books, return them, and inspect active loans. Your design should make invalid actions difficult by putting rules inside the objects that own them.",
      steps: [
        "Implement Book with an identifier, title, author, availability state, and methods that safely check out and check in the book.",
        "Implement Member with an identifier, name, loan limit, and methods that enforce the limit without allowing its count to exceed the limit.",
        "Use a @dataclass Loan record to capture a successful loan's book identifier, member identifier, and due day.",
        "Implement Library using composition: it manages collections of Book and Member objects and coordinates lend_book and return_book operations.",
        "Include a ReferenceBook subclass or another clearly justified design that prevents reference-only books from being loaned, then demonstrate normal, refused, and return paths.",
      ],
      successCriteria: [
        "A successful checkout creates exactly one Loan, marks the book loaned, and increases the matching member's count.",
        "The program refuses duplicate checkouts, unknown identifiers, over-limit members, and reference-only loans with understandable messages.",
        "Returning a loaned book restores availability, reduces the correct member's count, and removes the matching active Loan.",
        "The demonstration prints a readable report and includes at least one successful and two different refused actions.",
      ],
    },
    reflectionPrompt:
      "Which rule was hardest to keep consistent across objects, and how did your method boundaries help? Identify one place where composition made your design easier to extend than inheritance would have. If this prototype later used a database, which class responsibilities would remain the same and which new boundary would you introduce?",
  },
  {
    id: "project-05",
    title: "Portfolio Project 05 · Lazy Data Pipeline and Execution Timer",
    sourceUrl: "https://pyforgecourse.org/projects/5",
    starterCode:
      'from functools import wraps\nfrom time import perf_counter\n\nSAMPLE_ROWS = [\n    "09:00|search|85",\n    "09:01|checkout|240",\n    "09:02|search|310",\n    "09:03|profile|125",\n]\n\n\ndef parse_events(rows):\n    # TODO: Yield one dictionary per row with time, name, and integer milliseconds.\n    return iter(())\n\n\ndef keep_at_least(events, minimum):\n    # TODO: Yield only events whose milliseconds meet the minimum.\n    return iter(())\n\n\ndef enrich_events(events):\n    # TODO: Yield new dictionaries with a label such as "SLOW" or "VERY SLOW".\n    return iter(())\n\n\ndef timed(function):\n    @wraps(function)\n    def wrapper(*args, **kwargs):\n        # TODO: Measure function execution with perf_counter and print its name and elapsed time.\n        return function(*args, **kwargs)\n    return wrapper\n\n\ndef choose(events, predicate):\n    # TODO: Yield events selected by the supplied predicate function.\n    return iter(())\n\n\n@timed\ndef build_report(rows, minimum):\n    pipeline = enrich_events(keep_at_least(parse_events(rows), minimum))\n    selected = list(choose(pipeline, lambda event: event["name"] != "profile"))\n    # TODO: Use a comprehension or generator expression to build a useful summary.\n    return selected\n\n\nreport = build_report(SAMPLE_ROWS, minimum=200)\nprint(report)\n',
    expectedOutput:
      "Use the requirements and definition of done to test each part of your project. Save the resulting Python file to your portfolio.",
    hints: [
      "Add a batching generator that yields fixed-size lists using itertools.islice, then report one batch at a time.",
      "Add validation that skips malformed sample rows and counts rejected rows without stopping the pipeline.",
      "Run build_report at several thresholds, record the fully consumed elapsed times, and explain whether the differences are meaningful.",
    ],
    activity: {
      title: "Portfolio build brief",
      brief:
        "Build a standard-library Python program that turns raw event rows into a lazily processed report and times the report execution.",
      steps: [
        "Create a generator function that parses rows in the form time|name|milliseconds into dictionaries with milliseconds stored as int.",
        "Create at least two additional lazy stages: one that filters events by a duration threshold and one that yields a normalized or enriched event.",
        "Use a comprehension or generator expression to calculate a summary such as the count, total duration, or distinct event names from consumed results.",
        "Implement a timed decorator using time.perf_counter and functools.wraps; it must print an elapsed-time message and return the wrapped function's result.",
        "Demonstrate one focused higher-order function use, such as passing a predicate or a key function, and print a readable final report.",
      ],
      successCriteria: [
        "The parser, filter, enrichment stage, and higher-order selection stage are all lazy and can be connected in a pipeline.",
        "The report correctly includes checkout and search for the provided sample at a 200-millisecond threshold, with integer durations and enrichment labels.",
        "The timing decorator reports an elapsed duration while build_report continues to return the complete report data.",
        "The final output includes a human-readable summary derived with a comprehension or generator expression.",
      ],
    },
    reflectionPrompt:
      "Which stage in your pipeline produces values, which stages transform them, and which line finally consumes them? How did the timing decorator preserve the original behavior of build_report while adding information? If the row source became very large, which intermediate lists did your design avoid, and where did you intentionally materialize results?",
  },
  {
    id: "project-06",
    title: "Portfolio Project 06 · Resilient Order Calculator",
    sourceUrl: "https://pyforgecourse.org/projects/6",
    starterCode:
      'from decimal import Decimal, ROUND_HALF_UP\n\n\nclass OrderValidationError(ValueError):\n    pass\n\n\ndef validate_rate(rate, label):\n    # TODO: raise OrderValidationError unless 0 <= rate <= 1\n    pass\n\n\ndef line_subtotal(line):\n    # TODO: validate name, unit_price, and quantity\n    # TODO: return Decimal unit_price multiplied by quantity\n    pass\n\n\ndef money(amount):\n    return amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)\n\n\ndef calculate_order(lines, discount_rate=Decimal("0"), tax_rate=Decimal("0")):\n    # TODO: reject an empty order\n    # TODO: validate rates, total lines, discount, then tax\n    # TODO: return a rounded Decimal; do not print here\n    pass\n\n\nexample_lines = [\n    {"name": "Mug", "unit_price": Decimal("12.50"), "quantity": 2},\n    {"name": "Sticker", "unit_price": Decimal("1.25"), "quantity": 4},\n]\n# After implementation, this should evaluate to Decimal(\'29.16\') with 10% discount and 8% tax.\nexpected = Decimal("29.16")\n',
    expectedOutput:
      "Use the requirements and definition of done to test each part of your project. Save the resulting Python file to your portfolio.",
    hints: [
      "Add an optional shipping charge that is validated and included before tax, then add tests that state the chosen rule.",
      "Return a receipt dictionary with subtotal, discount amount, tax amount, and total while keeping calculate_order as the single pricing entry point.",
      "On your computer, place validation and pricing helpers in separate modules inside an order_calculator package, create a .venv, and run the same unittest suite from the command line.",
    ],
    activity: {
      title: "Portfolio build brief",
      brief:
        "Build a tested order-pricing component that totals multiple order lines, supports a percentage discount and tax, rounds money predictably, and reports invalid data through a domain-specific exception.",
      steps: [
        "Define OrderValidationError and reject an empty order, a non-positive quantity, a negative unit price, and discount or tax rates outside 0 through 1.",
        "Accept order lines as dictionaries with name, unit_price, and quantity keys; compute the subtotal from all valid lines.",
        "Apply the order-wide discount before tax and return a Decimal total rounded to two places using ROUND_HALF_UP.",
        "Keep validation, pricing helpers, and the public calculate_order function separate and avoid printing from those core functions.",
        "Write unittest tests for a multi-line happy path, an empty order, a bad line value, a discount/tax boundary, and the discount-before-tax rule.",
      ],
      successCriteria: [
        "The supplied two-line order produces Decimal('29.16') when calculated with a 10% discount followed by 8% tax.",
        "Invalid orders raise OrderValidationError with a message that identifies the failing rule or field.",
        "A unittest suite contains at least five focused tests and passes without third-party packages.",
        "Core calculation functions return values, use Decimal for money, and are organized so a future package can separate validation and pricing modules.",
      ],
    },
    reflectionPrompt:
      "Which invalid input was most valuable to test, and what incorrect behavior would have escaped without that test? How did separating validation from pricing change the readability of calculate_order? If the shop adds a loyalty discount, which existing test cases protect you while you extend the rules?",
  },
  {
    id: "project-07",
    title: "Portfolio Project 07 · Build a File Intelligence Report",
    sourceUrl: "https://pyforgecourse.org/projects/7",
    starterCode:
      'from collections import Counter\nfrom hashlib import sha256\nfrom pathlib import PurePath\n\nSAMPLE_FILES = [\n    {"path": "drop/agenda.pdf", "content": b"%PDF-1.7\\nagenda"},\n    {"path": "drop/banner.png", "content": b"\\x89PNG\\r\\n\\x1a\\npixels"},\n    {"path": "drop/mystery.png", "content": b"meeting notes"},\n    {"path": "drop/readme.txt", "content": b"start here"},\n]\n\ndef classify(content, suffix):\n    # TODO: return "PDF document", "PNG image", "text file", or "unknown".\n    return "unknown"\n\ndef inspect(record):\n    path = PurePath(record["path"])\n    content = record["content"]\n    suffix = path.suffix.lower()\n    # TODO: call classify and add a warning for an image/PDF suffix that disagrees with signature evidence.\n    return {\n        "name": path.name,\n        "suffix": suffix,\n        "byte_count": len(content),\n        "kind": "unknown",\n        "digest": sha256(content).hexdigest()[:12],\n        "warnings": [],\n    }\n\ndef build_report(files):\n    results = [inspect(record) for record in files]\n    # TODO: count kinds, collect warned names, and return the complete report.\n    return {"results": results, "counts": Counter(), "warned_files": []}\n\nreport = build_report(SAMPLE_FILES)\nprint(report)\n',
    expectedOutput:
      "Use the requirements and definition of done to test each part of your project. Save the resulting Python file to your portfolio.",
    hints: [
      "Add a max-bytes validation rule and warn when a simulated file exceeds it.",
      "Serialize the completed report with json.dumps(indent=2, sort_keys=True) and explain why bytes must not be placed directly in JSON.",
      "Locally, replace the advanced-inspection placeholder with a virtual-environment-based adapter for pypdf/PyMuPDF or Pillow while preserving the same report schema.",
    ],
    activity: {
      title: "Portfolio build brief",
      brief:
        "Create a browser-safe prototype that inspects a batch of simulated files, validates basic evidence, and returns a structured report that someone else could later serialize as JSON.",
      steps: [
        "Accept a list of dictionaries containing a path string and a bytes content value; do not read from disk in the browser version.",
        "Use pathlib.PurePath to derive each filename and normalized suffix.",
        "Classify PDF and PNG records from their leading-byte signatures, then use a text-file suffix fallback for .txt files.",
        "Create a result for every input with name, suffix, byte_count, kind, short SHA-256 digest, and a warnings list.",
        "Return a report containing all results, counts by kind, and a list of warned filenames; explain unavailable rich PDF or image metadata in a status field.",
      ],
      successCriteria: [
        "All four simulated inputs appear in the report, including the mislabeled image candidate.",
        "The report correctly distinguishes signature-based PDF and PNG detections from a .txt suffix fallback.",
        "The mismatched mystery.png record contains a specific warning and is listed among warned files.",
        "The final report includes consistent byte counts, 12-character SHA-256 prefixes, kind counts, and a clear advanced-inspection status.",
      ],
    },
    reflectionPrompt:
      "Which report field would be most useful to a teammate triaging a large folder, and why? What evidence is strong enough to automate a classification, and what evidence still deserves a warning or review? How would keeping the same report schema help when moving from browser simulations to local PDF or image libraries?",
  },
  {
    id: "project-08",
    title: "Portfolio Project 08 · Reading Dashboard and News Ranking Scraper",
    sourceUrl: "https://pyforgecourse.org/projects/8",
    starterCode:
      'import json\nfrom html.parser import HTMLParser\n\nREADING_JSON = \'\'\'\n{\n  "items": [\n    {"id": "r1", "title": "Practical Maps", "minutes": 20, "tags": ["data", "civic"]},\n    {"id": "r2", "title": "Slow Interfaces", "tags": ["design"]}\n  ]\n}\n\'\'\'\n\nRANKING_HTML = \'\'\'\n<article data-rank="1"><h2>Community Sensors</h2><span class="score">44</span></article>\n<article data-rank="2"><h2>Local Archives</h2><span class="score">27</span></article>\n\'\'\'\n\nclass NewsParser(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.items = []\n        # TODO: Add state needed to collect one article\'s rank, headline, and score.\n\n    # TODO: Implement handle_starttag, handle_data, and handle_endtag.\n\ndef normalize_reading_items(raw_json):\n    payload = json.loads(raw_json)\n    # TODO: Return normalized reading dictionaries with safe defaults.\n    return []\n\ndef dashboard(reading_items, news_items):\n    # TODO: Return or print item count, total minutes, tag frequencies, and top headline.\n    pass\n\ndef preview_alerts(news_items, threshold, sent_ids):\n    # TODO: Print preview-only alerts and update sent_ids without sending anything.\n    pass\n\nreading_items = normalize_reading_items(READING_JSON)\nparser = NewsParser()\nparser.feed(RANKING_HTML)\nsent_ids = set()\ndashboard(reading_items, parser.items)\npreview_alerts(parser.items, threshold=30, sent_ids=sent_ids)\n\n# Ethics note: TODO: state the approved source, pacing/caching plan, secret policy, and review gate.\n',
    expectedOutput:
      "Use the requirements and definition of done to test each part of your project. Save the resulting Python file to your portfolio.",
    hints: [
      "Add a deterministic tie-break rule that sorts equal scores alphabetically by headline.",
      "Add an input-validation report that lists malformed sample records instead of silently accepting them.",
      "Design, in comments only, a future adapter interface for an authorized API client with environment-variable secrets, cache duration, 429 backoff, and a human approval step.",
    ],
    activity: {
      title: "Portfolio build brief",
      brief:
        "Build an offline prototype that normalizes an API-style reading list, extracts ranked headlines from supplied HTML, and prepares reviewable reading alerts.",
      steps: [
        "Parse the provided API-style JSON with json.loads and normalize each reading item to title, minutes, and tags using clear defaults.",
        "Use a standard-library HTMLParser subclass to extract rank, headline, and score from the supplied local HTML; do not make web requests.",
        "Create a dashboard summary containing item count, total estimated minutes, a tag frequency summary, and the top-ranked extracted headline.",
        "Implement a score threshold and a sent_ids set so qualifying alerts are previewed once and never actually sent.",
        "Include a short ethics-and-operations note in a printed string or code comment covering approved access, secret handling, caching or pacing, and human review.",
      ],
      successCriteria: [
        "The completed prototype runs in browser Python 3.12 using only the standard library and makes no network, credential, or filesystem call.",
        "Its dashboard correctly totals 20 reading minutes, reports two reading items, and identifies Community Sensors as the highest-ranked local news item.",
        "It extracts both sample news records with usable numeric rank and score values.",
        "It prints one preview-only alert for Community Sensors at a threshold of 30 and prevents a duplicate when called again with the same sent_ids set.",
      ],
    },
    reflectionPrompt:
      "Which parts of your program would change when replacing sample data with an authorized live API, and which parts should remain unchanged? How did your parser make assumptions about page structure, and how would you detect a layout change safely? What information would you log to diagnose a failed automation without storing secrets or unnecessarily exposing reader data?",
  },
  {
    id: "project-09",
    title: "Portfolio Project 09 · Professional Portfolio Contact App",
    sourceUrl: "https://pyforgecourse.org/projects/9",
    starterCode:
      'from dataclasses import dataclass\nfrom html import escape\n\n@dataclass\nclass Response:\n    status: int\n    body: str\n\nclass InquiryStore:\n    def __init__(self):\n        self.items = []\n\n    def save(self, inquiry):\n        # TODO: Store a copy of a validated inquiry in memory.\n        pass\n\nstore = InquiryStore()\n\ndef validate(form):\n    # TODO: Return (errors, cleaned_values) for name, email, subject, and message.\n    return {"form": "TODO"}, {}\n\ndef render_contact(values, errors):\n    # TODO: Escape display values and render a friendly contact page.\n    return "<h1>Contact</h1>"\n\ndef dispatch(method, path, form=None, session=None):\n    form = form or {}\n    session = session or {}\n    # TODO: Implement the four required route behaviors.\n    return Response(404, "Page not found")\n\nprint(dispatch("GET", "/contact"))\n',
    expectedOutput:
      "Use the requirements and definition of done to test each part of your project. Save the resulting Python file to your portfolio.",
    hints: [
      "Add a one-time session-style confirmation message that is shown after a successful submission and then cleared.",
      "Add a simple inquiry status field such as new or replied, and restrict status changes to an authenticated admin route.",
      "Draft a local Flask migration plan using Jinja templates, a parameterized database layer or ORM, CSRF protection, and a production host configuration.",
    ],
    activity: {
      title: "Portfolio build brief",
      brief:
        "Design a compact Flask-style portfolio contact experience that welcomes visitors, validates inquiries, displays a safe confirmation, and protects an admin inquiry view.",
      steps: [
        "Provide route behavior for GET /, GET /contact, POST /contact, and GET /admin/inquiries.",
        "Validate name, email, subject, and message server-side, returning field-specific errors for invalid submissions.",
        "Escape visitor-supplied values before rendering a confirmation or error page.",
        "Use a session-like authenticated flag to protect the admin inquiry view and explain that real authorization must be checked on every protected request.",
        "Save valid inquiries through an in-memory store interface and document the local Flask next steps for a database, CSRF protection, HTTPS, environment-managed secrets, and debug disabled.",
      ],
      successCriteria: [
        "A visitor can view the contact form, submit valid data, and receive a 200 or 201 confirmation response without raw HTML injection.",
        "Invalid submissions preserve safe display values and identify every relevant field error without saving an inquiry.",
        "The admin view returns 401 or 403 when the session is not authenticated and returns saved inquiries only for an authenticated session.",
        "A short deployment checklist names database parameterization or ORM use, CSRF protection, HTTPS, environment-managed secrets, and disabled debug mode.",
      ],
    },
    reflectionPrompt:
      "Which rule in your validator most improves the quality of inquiries, and what legitimate message might it accidentally reject? Where does your application cross a trust boundary, and what data must be escaped, validated, or authorized there? What would you replace first when moving from the in-memory simulation to a deployed Flask app, and why?",
  },
  {
    id: "project-10",
    title:
      "Portfolio Project 10 · Capstone: The Community Access Data Story and Image Recognition Plan",
    sourceUrl: "https://pyforgecourse.org/projects/10",
    starterCode:
      '# Capstone data: records are deliberately small and synthetic.\nreports = [\n    {"location": "Library", "barrier": "curb", "resolved": True},\n    {"location": "Library", "barrier": "door", "resolved": False},\n    {"location": "Park", "barrier": "curb", "resolved": False},\n    {"location": "Transit", "barrier": "signage", "resolved": False},\n    {"location": "Park", "barrier": "lighting", "resolved": True},\n]\n\n# TODO: group report counts by location without modifying reports.\ncounts = {}\nfor report in reports:\n    pass\n\n# TODO: print a text chart and calculate one resolution-rate summary.\n# TODO: write your Data Story outside this code: audience, question, observation,\n# limitation, recommendation, and source/time-window note.\n\nimage_plan = {\n    "allowed_purpose": "suggest a barrier category for staff review",\n    "prohibited_use": "TODO: name a decision the tool must not make",\n    "human_fallback": "TODO: describe how uncertain results are handled",\n    "data_boundary": "TODO: state consent, minimization, and retention rules",\n    "evaluation": "TODO: state split, metrics, and representation checks"\n}\nprint("Finish the summaries and replace every TODO in image_plan.")',
    expectedOutput:
      "Use the requirements and definition of done to test each part of your project. Save the resulting Python file to your portfolio.",
    hints: [
      "Add a second text chart that compares resolved and unresolved reports by barrier type, then explain why counts alone may be insufficient.",
      "Create a small, synthetic held-out score dataset and compare two classification thresholds using precision, recall, and confusion-matrix counts.",
      "On a local machine, recreate the analysis with pandas and a labeled matplotlib chart, including source, date range, and accessibility-friendly labels.",
    ],
    activity: {
      title: "Portfolio build brief",
      brief:
        "Create a portfolio-ready case study with two connected deliverables: an evidence-based Data Story about access observations and a responsible plan for a future image-recognition assistant that helps categorize, never decides about, reported access barriers.",
      steps: [
        "Produce a Data Story for a named audience with a question, a clearly labeled comparison, one calculated summary, one limitation, and a testable recommendation.",
        "Use the supplied in-memory records or a similarly small synthetic dataset; inspect categories and state a rule for missing or ambiguous reports.",
        "Include a browser-safe text chart or table plus a short narrative that separates observed facts from interpretation.",
        "Write an image-recognition planning brief covering purpose, non-goals, labels, data consent and minimization, representative evaluation, train/test separation, metrics, and a human fallback.",
        "Package the work as a portfolio case study with a 60-second interview script that explains your decision, evidence, limitation, and next experiment.",
      ],
      successCriteria: [
        "The Data Story makes one accurate, reproducible comparison and transparently discloses a limitation of the synthetic sample.",
        "The recommendation is testable and does not claim that the observations establish causation or represent every community member.",
        "The image-recognition brief sets enforceable boundaries, including consent-aware data handling, held-out evaluation, error review, and human fallback.",
        "The portfolio narrative and interview script accurately distinguish implemented analysis from future model planning.",
      ],
    },
    reflectionPrompt:
      "Which assumption in your Data Story most affects the recommended action, and how would you test that assumption? Whose experience might be missing from the planned image data, and how would that absence change your evaluation and launch decision? If an interviewer challenged your strongest claim, what evidence would you show and what uncertainty would you acknowledge?",
  },
  {
    id: "project-11",
    title: "Portfolio Project 11 · Secure Password Exposure Checker",
    sourceUrl: "https://pyforgecourse.org/projects/11",
    starterCode:
      'import hashlib\n\ndef hash_password(password):\n    # TODO: return an uppercase SHA-1 hex digest\n    pass\n\ndef check_exposure(password, known_suffixes):\n    # TODO: compare only the hash suffix\n    pass\n\nsample_suffixes = {"DUMMY": 2}\nprint(check_exposure("practice-only", sample_suffixes))',
    expectedOutput:
      "Use the requirements and definition of done to test each part of your project. Save the resulting Python file to your portfolio.",
    hints: [
      "Add getpass for hidden local input",
      "Write three unit tests",
      "Document how a real range API would be called outside the browser",
    ],
    activity: {
      title: "Portfolio build brief",
      brief:
        "Design a privacy-preserving checker that explains how range queries and hashing can test whether a password appears in a breach corpus without sending the password itself.",
      steps: [
        "Hash the sample password locally with SHA-1 using the standard library.",
        "Split the hash into a five-character prefix and a suffix.",
        "Simulate a range-query response with an in-memory set rather than a network call.",
        "Never print, store, or transmit the original password.",
        "Return a clear risk message and recommended next action.",
      ],
      successCriteria: [
        "Uses hashlib correctly",
        "Separates prefix and suffix",
        "Does not expose the plaintext password",
        "Produces an actionable message",
      ],
    },
    reflectionPrompt:
      "Which data must never leave the user’s device? How would you test a negative match? What would you log in production—and what would you refuse to log?",
  },
  {
    id: "project-12",
    title: "Portfolio Project 12 · Portfolio-Ready Python Product",
    sourceUrl: "https://pyforgecourse.org/projects/12",
    starterCode:
      'PROJECT_BRIEF = {\n    "user": "",\n    "problem": "",\n    "success_metric": "",\n    "course_concepts": [],\n    "risks": [],\n}\n\ndef readiness_score(brief):\n    completed = sum(bool(value) for value in brief.values())\n    return round(completed / len(brief) * 100)\n\nprint(f"Brief readiness: {readiness_score(PROJECT_BRIEF)}%")',
    expectedOutput:
      "Use the requirements and definition of done to test each part of your project. Save the resulting Python file to your portfolio.",
    hints: [
      "Record a two-minute demo",
      "Ask a peer to test without guidance",
      "Create a one-page case study with before-and-after evidence",
    ],
    activity: {
      title: "Portfolio build brief",
      brief:
        "Choose a problem you understand, scope a credible MVP, and ship a polished Python product story with tests, documentation, and an interview-ready walkthrough.",
      steps: [
        "Define one user, one painful problem, and one measurable success condition.",
        "Use at least three course concepts from different modules.",
        "Include a test strategy with happy, edge, and failure paths.",
        "Write setup instructions and a concise architecture explanation.",
        "Prepare a two-minute demo narrative covering tradeoffs and next steps.",
      ],
      successCriteria: [
        "Solves a clearly defined problem",
        "Demonstrates depth rather than feature count",
        "Includes credible testing and documentation",
        "Can be explained clearly without reading code",
      ],
    },
    reflectionPrompt:
      "What did you intentionally leave out? Where did you make a tradeoff? What question do you hope an interviewer asks?",
  },
];

const activitiesByTitle = new Map(
  pythonForgeActivities.map(activity => [activity.title, activity])
);

export function getPythonForgeActivityForModule(
  courseSlug?: string | null,
  moduleTitle?: string | null
): PythonForgeActivity | null {
  if (courseSlug !== PYTHON_FORGE_COURSE_SLUG || !moduleTitle) return null;
  return activitiesByTitle.get(moduleTitle) ?? null;
}
