import type { PythonForgeActivity } from "@/lib/pythonForgeActivities";

export const PY30_COURSE_SLUG = "30-days-to-learn-python";

export const py30Activities: PythonForgeActivity[] = [
  {
    "id": "py30-d01",
    "title": "Day 01 · First Words",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/1",
    "starterCode": "# Change these three lines, then press Run.\nname = \"Alice\"\nage = 18\ncity = \"Lisbon\"\n\nprint(\"Name:\", name)\nprint(\"Age:\", age, \"->\", type(age))\nprint(\"City:\", city)\n",
    "hints": [
      "Try changing age to a text value like \"18\" and run again. What does type() say now?"
    ],
    "activity": {
      "title": "Daily exercise: First Words",
      "brief": "Print your name, your age and your city — each stored in a variable first — then print the type of each value.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Print your name, your age and your city — each stored in a variable first — then print the type of each value.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Which of the four types do you expect to use most in your own work — and what would you want to store with it?",
    "quiz": {
      "question": "What does this line print?\n\nprint(\"a\", \"b\", sep=\"-\")",
      "options": [
        "a b",
        "a-b",
        "ab",
        "a, b"
      ],
      "answer": 1,
      "explanation": "sep is the separator placed between values, so the two letters are joined with a dash."
    }
  },
  {
    "id": "py30-d02",
    "title": "Day 02 · Numbers & Text",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/2",
    "starterCode": "# A tiny receipt. Change the values, then press Run.\nitem = \"  green tea  \"\nprice = 3.5\nqty = 4\nclean = item.strip().title()\ntotal = price * qty\nprint(\"ITEM:\", clean)\nprint(f\"Price: {price:.2f}\")\nprint(f\"{qty} x {clean} = {total:.2f}\")\n# Try qty = 0, or a name with no extra spaces.",
    "hints": [
      "strip() removes the spaces and title() fixes the capitals; you can chain both in one line."
    ],
    "activity": {
      "title": "Daily exercise: Numbers & Text",
      "brief": "Build a receipt: store a price and a quantity, print a total with two decimals in an f-string, and clean a messy product name into title case.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Build a receipt: store a price and a quantity, print a total with two decimals in an f-string, and clean a messy product name into title case.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Which part of the receipt took longer to get right, the arithmetic or the formatting, and what did you change to fix it?",
    "quiz": {
      "question": "What does this line print?\n\nprint(7 // 2, 7 % 2)",
      "options": [
        "3 1",
        "3.5 1",
        "3 0",
        "4 1"
      ],
      "answer": 0,
      "explanation": "// gives the whole number of times 2 fits into 7, and % gives what is left over."
    }
  },
  {
    "id": "py30-d03",
    "title": "Day 03 · Asking & Deciding",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/3",
    "starterCode": "# A two-question quiz. Change the answers, then press Run.\nname = input(\"Your name: \")\nscore = 0\nanswer = input(\"2 + 2 = \")\nif answer == \"4\":\n    score += 1\nanswer = input(\"Capital of France? \")\nif answer.lower() == \"paris\":\n    score += 1\nprint(name, \"scored\", score, \"of 2\")\nif score == 2:\n    print(\"Perfect!\")\nelse:\n    print(\"Try again.\")",
    "hints": [
      "input() gives text, so compare it with \"4\" in quotes, or wrap it in int() and compare with 4."
    ],
    "activity": {
      "title": "Daily exercise: Asking & Deciding",
      "brief": "Write a three-question quiz with input() that greets the player by name at the end and prints a different message for each score band.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Write a three-question quiz with input() that greets the player by name at the end and prints a different message for each score band.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Think of one decision you made today. How would you write it as an if / elif / else chain, and what is the first test?",
    "quiz": {
      "question": "What does this print?\n\nx = \"10\"\nprint(x == 10)",
      "options": [
        "True",
        "False",
        "10",
        "TypeError"
      ],
      "answer": 1,
      "explanation": "The text \"10\" is not the same value as the number 10, so the comparison is False."
    }
  },
  {
    "id": "py30-d04",
    "title": "Day 04 · Loops That Count",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/4",
    "starterCode": "# The 5-times table. Change table to practise another one.\ntable = 5\nfor n in range(1, 6):\n    print(table, \"x\", n, \"=\", table * n)\n# A countdown that stops on its own.\nstart = 10\nwhile start > 0:\n    print(\"T-minus\", start)\n    start -= 1\nprint(\"Lift off\")",
    "hints": [
      "range(1, 6) stops before 6, and the while loop ends the moment start is no longer above zero."
    ],
    "activity": {
      "title": "Daily exercise: Loops That Count",
      "brief": "Print the 5-times table with a for loop, then count down from 10 with a while loop — and skip the number 7 in both.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Print the 5-times table with a for loop, then count down from 10 with a while loop — and skip the number 7 in both.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Which job in your week repeats a known number of times, and which one is really a while loop waiting for something to change?",
    "quiz": {
      "question": "What is printed?\n\ntotal = 0\nfor n in range(1, 4):\n    total += n\nprint(total)",
      "options": [
        "3",
        "6",
        "10",
        "123"
      ],
      "answer": 1,
      "explanation": "range(1, 4) gives 1, 2 and 3, so total becomes 1 + 2 + 3 = 6."
    }
  },
  {
    "id": "py30-d05",
    "title": "Day 05 · Loop Control",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/5",
    "starterCode": "# A grade calculator. Change score, then press Run.\nscore = 87\n\nif score < 0 or score > 100:\n    print(\"Not a real score\")\nelse:\n    match score // 10:\n        case 10 | 9:\n            print(\"A\")\n        case 8:\n            print(\"B\")\n        case 7:\n            print(\"C\")\n        case _:\n            print(\"Keep practising\")",
    "hints": [
      "score // 10 turns 87 into 8, so the case 8 branch is the one that runs."
    ],
    "activity": {
      "title": "Daily exercise: Loop Control",
      "brief": "Sum 1–100 with an accumulator, find the biggest value in [4, 9, 2, 7], then rewrite a grade calculator with match-case.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Sum 1–100 with an accumulator, find the biggest value in [4, 9, 2, 7], then rewrite a grade calculator with match-case.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Where could a break save your program from doing work it does not need to do?",
    "quiz": {
      "question": "What is printed?\n\nfor n in range(1, 6):\n    if n == 3:\n        break\n    print(n)",
      "options": [
        "1 and 2",
        "1, 2 and 3",
        "1, 2, 4 and 5",
        "nothing"
      ],
      "answer": 0,
      "explanation": "break stops the loop as soon as n reaches 3, so 3, 4 and 5 are never printed."
    }
  },
  {
    "id": "py30-d06",
    "title": "Day 06 · Review 1: Guess the Number",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/6",
    "starterCode": "# Week 1 review - the number-guessing game.\n# The frame is here. Fill in every TODO and it plays.\nsecret = 7                    # the number to find, 1-10\ntries = 0                     # how many guesses so far\nguess = 0                     # the player's latest guess\n\nprint(\"I am thinking of a number from 1 to 10.\")\n\nwhile guess != secret:\n    text = input(\"Your guess: \")\n\n    # TODO 1: if text is not made of digits, print a warning\n    #         and use continue so a bad guess is not counted.\n    guess = int(text)\n\n    # TODO 2: add one to tries.\n\n    # TODO 3: print \"Higher\" when guess is below secret\n    #         and \"Lower\" when guess is above it.\n    if guess < secret:\n        pass\n    elif guess > secret:\n        pass\n\n# TODO 4: print a closing line that includes tries.\nprint(\"Game over.\")",
    "hints": [
      "Work through the requirements one at a time and test after each change."
    ],
    "activity": {
      "title": "Weekly build: Review 1: Guess the Number",
      "brief": "Week 1 gave you print, variables, types, input, conditions and loops. This review asks you to combine all of them into one small program a stranger could actually play. Get the loop and the counter right and everything else is detail.",
      "steps": [
        "Read the weekly build brief and requirements.",
        "Store the secret number in a variable called secret before the loop starts, and keep it between 1 and 10.",
        "Ask for a guess with input() inside a loop that keeps running until the guess matches secret.",
        "Count every valid guess in a variable called tries, adding one per attempt.",
        "Print \"Higher\" when the guess is below secret and \"Lower\" when it is above, and print neither on the winning guess.",
        "Reject input that is not a whole number with a short message, then continue without crashing and without counting a try.",
        "After the loop, print a closing message that includes the number of tries, for example \"You got it in 3 tries.\"",
        "Run the starter repeatedly, test invalid input, and polish the final output."
      ],
      "successCriteria": [
        "The build meets every listed requirement.",
        "The program handles the required edge case without crashing.",
        "You can explain what you would improve in the stretch goals."
      ]
    },
    "reflectionPrompt": "Which part of the game did you rewrite most often - the loop, the counting, or the input check - and what made it finally work?",
    "quiz": null
  },
  {
    "id": "py30-d07",
    "title": "Day 07 · Building Lists",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/7",
    "starterCode": "# Day 7 lab: five fruits, three slices, one new item.\nfruits = [\"apple\", \"banana\", \"cherry\", \"date\", \"elderberry\"]\n\nprint(\"All:\", fruits)\nprint(\"First:\", fruits[0])\nprint(\"Last:\", fruits[0])        # TODO 1: use a negative index\n\n# TODO 2: print the middle three items with one slice.\nprint(\"Middle:\", fruits[1:2])\n\n# TODO 3: append \"fig\", then make this count say 6.\nprint(\"Count:\", len(fruits))",
    "hints": [
      "A slice is start:stop and the stop is excluded, so the middle three of a five-item list are fruits[1:4]."
    ],
    "activity": {
      "title": "Daily exercise: Building Lists",
      "brief": "Make a list of five fruits. Print the first, the last, and the middle three — then append a sixth and print the length.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Make a list of five fruits. Print the first, the last, and the middle three — then append a sixth and print the length.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Think of a collection you handle every day - songs, receipts, chores. Which list operations would you reach for first, and why?",
    "quiz": {
      "question": "What does this print?\n\nnums = [10, 20, 30]\nprint(nums[-1], nums[1])",
      "options": [
        "30 20",
        "20 30",
        "10 20",
        "30 10"
      ],
      "answer": 0,
      "explanation": "Negative indexes count from the end, so nums[-1] is 30, while nums[1] is the second item, 20."
    }
  },
  {
    "id": "py30-d08",
    "title": "Day 08 · Working with Lists",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/8",
    "starterCode": "# Day 8 lab: build a shopping list, tidy it, number it.\nitems = []\nwhile True:\n    item = input(\"Item (or 'done'): \")\n    if item == \"done\":\n        break\n    items.append(item)\n\n# TODO 1: remove \"milk\" from the list.\n# TODO 2: sort the list alphabetically.\n# TODO 3: print each item as \"1. apples\" with enumerate().\nprint(items)",
    "hints": [
      "enumerate(items, start=1) gives you a number and an item each round, so the print inside the loop can be f\"{number}. {item}\"."
    ],
    "activity": {
      "title": "Daily exercise: Working with Lists",
      "brief": "Build a shopping list with input() — type 'done' to stop — then remove one item, sort the rest, and print it numbered from 1.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Build a shopping list with input() — type 'done' to stop — then remove one item, sort the rest, and print it numbered from 1.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "When you tidy a real list - a playlist, a reading list, a shopping cart - do you search it, sort it, or number it first? What does that order tell you?",
    "quiz": {
      "question": "What does this print?\n\nvalues = [5, 2, 9]\nvalues.sort()\nprint(values[0], values[-1])",
      "options": [
        "5 9",
        "2 9",
        "9 2",
        "2 5"
      ],
      "answer": 1,
      "explanation": "sort() orders the list ascending in place, so the first item becomes the smallest and the last the largest."
    }
  },
  {
    "id": "py30-d09",
    "title": "Day 09 · Copies, Tuples & One-Liners",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/9",
    "starterCode": "# Day 9 lab: one comprehension, one copy, one proof.\nnumbers = [1, 2, 3, 4, 5, 6]\n\n# TODO 1: replace [] with a comprehension that doubles the even numbers.\ndoubled_evens = []\nprint(\"Even doubles:\", doubled_evens)\n\noriginal = [1, 2, 3]\ncopy = original.copy()\noriginal.append(99)\n\n# TODO 2: print both lists. Which one gained 99?\nprint(\"original:\", original)\nprint(\"copy:\", copy)",
    "hints": [
      "In a comprehension the expression comes first, then the loop, then the filter - and .copy() is what makes TODO 2 print two different lists."
    ],
    "activity": {
      "title": "Daily exercise: Copies, Tuples & One-Liners",
      "brief": "Turn [1, 2, 3, 4, 5, 6] into only the even numbers doubled in one line, then prove that a copy is not the same list.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Turn [1, 2, 3, 4, 5, 6] into only the even numbers doubled in one line, then prove that a copy is not the same list.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Where in your own work would a fixed tuple be safer than a list - and what would you gain by making that data impossible to change?",
    "quiz": {
      "question": "What does this print?\n\nnums = [1, 2, 3, 4]\nprint([n * n for n in nums if n % 2 == 0])",
      "options": [
        "[1, 4, 9, 16]",
        "[4, 16]",
        "[2, 4]",
        "[16, 4]"
      ],
      "answer": 1,
      "explanation": "The if keeps only 2 and 4, then the expression squares each one, giving [4, 16]."
    }
  },
  {
    "id": "py30-d10",
    "title": "Day 10 · Sets & Dictionaries",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/10",
    "starterCode": "# Day 10 lab: clean a list, then grow a dictionary.\nnumbers = [3, 1, 3, 2, 1]\nunique = set(numbers)\nprint(\"unique:\", sorted(unique))\n\nperson = {\"name\": \"Alice\", \"age\": 30}\nprint(\"start:\", person)\n\n# TODO 1: add an \"email\" key with a made-up address.\n# TODO 2: change \"age\" to 31.\n# TODO 3: print the dictionary and its number of keys.\n\nprint(\"now:\", person)\nprint(\"keys:\", len(person))\n",
    "hints": [
      "A new key is just an assignment - person['email'] = 'a@b.com' - with no method needed."
    ],
    "activity": {
      "title": "Daily exercise: Sets & Dictionaries",
      "brief": "Remove the duplicates from [3, 1, 3, 2, 1] with a set and sort the result, then build a person dictionary and add their email.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Remove the duplicates from [3, 1, 3, 2, 1] with a set and sort the result, then build a person dictionary and add their email.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Where in your own notes or files do you keep a list that is really a set of unique names, and what would a dictionary add to it?",
    "quiz": {
      "question": "What does this print?\n\nnums = [1, 1, 2, 3, 3]\nprint(sorted(set(nums)))",
      "options": [
        "[1, 1, 2, 3, 3]",
        "[1, 2, 3]",
        "{1, 2, 3}",
        "[1, 2, 3, 3]"
      ],
      "answer": 1,
      "explanation": "set() keeps one copy of each value and sorted() returns them as a list in ascending order."
    }
  },
  {
    "id": "py30-d11",
    "title": "Day 11 · Dictionaries in Depth",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/11",
    "starterCode": "# Day 11 lab: a tiny address book as nested data.\nfriends = [\n    {\"name\": \"Ann\", \"city\": \"Oslo\"},\n    {\"name\": \"Bob\", \"city\": \"Lima\"},\n]\n\n# TODO 1: add a third friend dictionary.\n# TODO 2: loop over friends and print \"name - city\" for each one.\nfor friend in friends:\n    print(friend[\"name\"])\n\n# TODO 3: print the number of friends stored.\nprint(\"friends:\", len(friends))\n",
    "hints": [
      "Inside the loop, friend[\"city\"] reaches the city of the record you are on."
    ],
    "activity": {
      "title": "Daily exercise: Dictionaries in Depth",
      "brief": "Store three friends as a list of dictionaries and print 'Name — City' for each one.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Store three friends as a list of dictionaries and print 'Name — City' for each one.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Which record from your own life - a book, a recipe, a friend - would you model as a dictionary, and which keys would it need?",
    "quiz": {
      "question": "What does this print?\n\nd = {\"a\": 1, \"b\": 2}\nprint(list(d.items())[0])",
      "options": [
        "a",
        "1",
        "('a', 1)",
        "['a', 1]"
      ],
      "answer": 2,
      "explanation": "items() yields (key, value) tuples in insertion order, so the first one is the tuple ('a', 1)."
    }
  },
  {
    "id": "py30-d12",
    "title": "Day 12 · Review 2: Contact Book",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/12",
    "starterCode": "# Contact Book v1: lists, dictionaries and loops. No functions, no files.\n# Each contact is a small dictionary stored under its name.\n\ncontacts = {}\n\n# --- 1. Add contacts -------------------------------------------------\n# TODO: add three contacts. Each value is a dict with phone and city.\n# contacts[\"Ann\"] = {\"phone\": \"555-0101\", \"city\": \"Oslo\"}\n\n# --- 2. List every contact -------------------------------------------\nprint(\"ALL CONTACTS\")\nfor name, info in contacts.items():\n    print(name, info[\"phone\"], info[\"city\"])\n\n# --- 3. Search by part of a name -------------------------------------\nterm = input(\"Search name: \").strip().lower()\nfor name, info in contacts.items():\n    # TODO: print this contact only when term appears in name.lower()\n    pass\n\n# --- 4. Delete by exact name -----------------------------------------\ntarget = \"Bob\"\n# TODO: if target is in contacts, del contacts[target] and confirm.\n# TODO: otherwise print a friendly not-found message.\n\nprint(\"TOTAL\", len(contacts))\n",
    "hints": [
      "Work through the requirements one at a time and test after each change."
    ],
    "activity": {
      "title": "Weekly build: Review 2: Contact Book",
      "brief": "Week 2 gave you lists, tuples, sets and dictionaries. This build puts them together into one small program: a contact book that stores records, lists them, searches them by part of a name, and deletes one without ever crashing on a missing name. No functions and no files yet - just containers, loops and a dictionary at the centre.",
      "steps": [
        "Read the weekly build brief and requirements.",
        "Keep one dictionary called contacts, keyed by each contact's name, where every value is a dict holding at least phone and city.",
        "Add a contact by assigning a new key, and say so instead of silently overwriting a name that already exists.",
        "List every contact with a loop over contacts.items(), printing name, phone and city on one line each.",
        "Search by part of a name, ignoring capital letters, and print every contact whose name contains the search text.",
        "Delete a contact by exact name and print a confirmation that includes the name you removed.",
        "Handle a name that is not in the book without crashing: print a short message instead of letting KeyError stop the program.",
        "Run the starter repeatedly, test invalid input, and polish the final output."
      ],
      "successCriteria": [
        "The build meets every listed requirement.",
        "The program handles the required edge case without crashing.",
        "You can explain what you would improve in the stretch goals."
      ]
    },
    "reflectionPrompt": "Which part of the build taught you the most - keeping every record in one dictionary, or making search and delete behave when the name is missing?",
    "quiz": null
  },
  {
    "id": "py30-d13",
    "title": "Day 13 · Your Own Functions",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/13",
    "starterCode": "# Day 13 lab: one function, three rectangles.\ndef area(width, height):\n    # TODO 1: replace this print with return width * height.\n    print(\"area:\", width * height)\n\narea(3, 4)\narea(5, 2)\n\n# TODO 2: call area(10, 10) here, then call it once with keywords.\narea(width=7, height=2)\n\n# TODO 3: after TODO 1 works, print area(2, 3) + area(4, 5).\nprint(\"done\")\n",
    "hints": [
      "A function that prints has no value to give back; return is what lets the caller store or add the result."
    ],
    "activity": {
      "title": "Daily exercise: Your Own Functions",
      "brief": "Write area(width, height) and use it for three rectangles — then call it once with a keyword argument.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Write area(width, height) and use it for three rectangles — then call it once with a keyword argument.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Which repeated block of code in your own work would you turn into a function first, and what would you name it?",
    "quiz": {
      "question": "What does this print?\n\ndef f(a, b=2):\n    return a * b\n\nprint(f(3), f(3, 3))",
      "options": [
        "6 6",
        "6 9",
        "9 6",
        "TypeError"
      ],
      "answer": 1,
      "explanation": "The first call uses the default b=2 and returns 6, while the second passes b=3 and returns 9."
    }
  },
  {
    "id": "py30-d14",
    "title": "Day 14 · Flexible Functions",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/14",
    "starterCode": "# 1. Call greet both ways.\ndef greet(name, greeting=\"Hello\"):\n    print(greeting + \",\", name)\n\ngreet(\"Ada\")\ngreet(\"Bo\", greeting=\"Hi\")\n\n# 2. total() accepts any number of prices.\ndef total(*prices):\n    return sum(prices)\n\nprint(total(3, 4, 5))\n\n# 3. Your turn: write describe(**info) and print each pair.",
    "hints": [
      "Write describe(**info) that loops over info.items() and prints each key and value, then call it with two keywords."
    ],
    "activity": {
      "title": "Daily exercise: Flexible Functions",
      "brief": "Write greet(name, greeting='Hello') and call it both ways, then total(*prices) and describe(**info).",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Write greet(name, greeting='Hello') and call it both ways, then total(*prices) and describe(**info).",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Which of your own programs would get simpler if one function could accept any number of values instead of a fixed list of parameters?",
    "quiz": {
      "question": "What does this print?\n\ndef add(*nums):\n    return sum(nums)\nprint(add(1, 2, 3))",
      "options": [
        "3",
        "6",
        "[1, 2, 3]",
        "TypeError"
      ],
      "answer": 1,
      "explanation": "The star packs the three values into a tuple, and sum() adds them up to 6."
    }
  },
  {
    "id": "py30-d15",
    "title": "Day 15 · Functions That Think",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/15",
    "starterCode": "# 1. Sort by length, shortest first.\nwords = [\"python\", \"go\", \"rust\", \"c\"]\nprint(sorted(words, key=len))\n\n# 2. Count down, then say liftoff.\ndef countdown(n):\n    if n == 0:\n        print(\"liftoff\")\n        return\n    print(n)\n    countdown(n - 1)\n\ncountdown(3)\n\n# 3. Your turn: split a sentence and join it with dashes.",
    "hints": [
      "Replace the last comment with real code: split a sentence, then join the words with a dash."
    ],
    "activity": {
      "title": "Daily exercise: Functions That Think",
      "brief": "Sort a list of words by length with sorted(key=len), write factorial(n) recursively, then split a sentence into words and join it back with dashes.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Sort a list of words by length with sorted(key=len), write factorial(n) recursively, then split a sentence into words and join it back with dashes.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Think of a task you repeat in smaller and smaller pieces - where would a base case be, and what would one recursive step look like?",
    "quiz": {
      "question": "What does this print?\n\ndef f(n):\n    if n == 0:\n        return 1\n    return n * f(n - 1)\nprint(f(4))",
      "options": [
        "4",
        "10",
        "24",
        "120"
      ],
      "answer": 2,
      "explanation": "It multiplies 4 * 3 * 2 * 1, and the base case at n == 0 stops the chain."
    }
  },
  {
    "id": "py30-d16",
    "title": "Day 16 · Text Surgery",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/16",
    "starterCode": "# 1. Find and replace inside a sentence.\nline = \"the quick brown fox jumps\"\nprint(line.find(\"brown\"), line.replace(\"quick\", \"slow\"))\n\n# 2. Clean up messy input.\nmessy = \"   Grace Hopper   \"\nprint(messy.strip().upper())\n\n# 3. Read a file line by line.\nwith open(\"notes.txt\", \"w\") as f:\n    f.write(\"one\\ntwo\\nthree\\n\")\n\nwith open(\"notes.txt\") as f:\n    for row in f:\n        print(row.strip())",
    "hints": [
      "Change the three lines written to notes.txt to your own text, then print them with their line number in front."
    ],
    "activity": {
      "title": "Daily exercise: Text Surgery",
      "brief": "Count the words in a sentence and print each one reversed, then read a short text file and print its longest line.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Count the words in a sentence and print each one reversed, then read a short text file and print its longest line.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Which text in your own work is always messy - a pasted address, a copied list, a chat message - and which three string tools would clean it up?",
    "quiz": {
      "question": "What does this print?\n\nprint(\"banana\".count(\"a\"))",
      "options": [
        "1",
        "2",
        "3",
        "-1"
      ],
      "answer": 2,
      "explanation": "count() returns how many times the letter appears, and banana has three a characters."
    }
  },
  {
    "id": "py30-d17",
    "title": "Day 17 · Files That Persist",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/17",
    "starterCode": "# 1. Save a list to a file, one item per line.\nshopping = [\"milk\", \"eggs\", \"bread\"]\nwith open(\"shopping.txt\", \"w\") as f:\n    for item in shopping:\n        f.write(item + \"\\n\")\n\n# 2. Read it back and number the lines.\nwith open(\"shopping.txt\") as f:\n    for number, item in enumerate(f, start=1):\n        print(number, item.strip())\n\n# 3. Your turn: add a fourth item and run again.",
    "hints": [
      "Add a fourth item to the list, run the program twice, and notice that the file always matches the list exactly."
    ],
    "activity": {
      "title": "Daily exercise: Files That Persist",
      "brief": "Save your shopping list to a file, read it back and print it numbered, then save the same data as JSON and load it again.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Save your shopping list to a file, read it back and print it numbered, then save the same data as JSON and load it again.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "What would you keep in a file if your program had to survive being closed - and would a CSV or a JSON file suit it better?",
    "quiz": {
      "question": "What does this print?\n\nwith open(\"a.txt\", \"w\") as f:\n    f.write(\"hi\")\nwith open(\"a.txt\") as f:\n    print(len(f.read()))",
      "options": [
        "0",
        "1",
        "2",
        "an error"
      ],
      "answer": 2,
      "explanation": "The file holds the two characters hi, so read() returns a string of length 2."
    }
  },
  {
    "id": "py30-d18",
    "title": "Day 18 · Review 3: File-Backed Contact Book",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/18",
    "starterCode": "import json\nfrom pathlib import Path\nDATA = Path(\"contacts.json\")\n\ndef load_contacts():\n    return {}  # TODO: load the dict from DATA, or {} if there is no file\n\ndef save_contacts(contacts):\n    pass  # TODO: write contacts to DATA as JSON\n\ndef add_contact(contacts):\n    print(\"add - TODO\")  # ask name, phone, email; store; save\n\ndef list_contacts(contacts):\n    print(\"list - TODO\")  # print \"name: phone\" for every contact\n\ndef search_contacts(contacts):\n    print(\"search - TODO\")  # ask a name; print the match or \"not found\"\n\ndef delete_contact(contacts):\n    print(\"delete - TODO\")  # pop the name; save\n\ncontacts = load_contacts()\nwhile True:\n    choice = input(\"1 add  2 list  3 search  4 delete  5 quit > \")\n    if choice == \"5\":\n        save_contacts(contacts)\n        print(\"Bye.\")\n        break\n    # TODO: route 1-4, save after each change, handle bad input\n",
    "hints": [
      "Work through the requirements one at a time and test after each change."
    ],
    "activity": {
      "title": "Weekly build: Review 3: File-Backed Contact Book",
      "brief": "In week 2 you built a contact book from lists, dictionaries and loops, and everything vanished when the program stopped. This week added functions, serious string work and files, so now you rebuild it as a real program: one function per action, a menu that keeps running, and a JSON file that remembers every contact after you quit. This is the last build before classes, so make it something you would actually use.",
      "steps": [
        "Read the weekly build brief and requirements.",
        "Store every contact in one dict keyed by name, with phone and email inside: contacts = {\"Ada\": {\"phone\": \"555-0100\", \"email\": \"ada@example.com\"}}.",
        "Write one function per action — add_contact, list_contacts, search_contacts and delete_contact — and pass the contacts dict into each one.",
        "Load contacts.json at startup when the file exists, and start from an empty dict when it does not.",
        "Save the dict to contacts.json after every add and every delete, with indent=2 so the file stays readable.",
        "Keep everything inside a while loop that prints the menu, runs one action, and exits cleanly when the user chooses 5.",
        "Handle bad menu input: anything outside 1-5 prints a short message and shows the menu again instead of crashing.",
        "Run the starter repeatedly, test invalid input, and polish the final output."
      ],
      "successCriteria": [
        "The build meets every listed requirement.",
        "The program handles the required edge case without crashing.",
        "You can explain what you would improve in the stretch goals."
      ]
    },
    "reflectionPrompt": "Which part of this build gave you the most trouble — the functions, the file, or the menu loop — and what would you do differently next time?",
    "quiz": null
  },
  {
    "id": "py30-d19",
    "title": "Day 19 · Reading the Red Text",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/19",
    "starterCode": "# This program asks for a price and a quantity.\n# Run it once with a word instead of a number, read the error, then fix it.\nprice_text = input(\"Price: \")\nquantity_text = input(\"Quantity: \")\n\nprice = float(price_text)\nquantity = int(quantity_text)\n\ntotal = price * quantity\nprint(\"Total:\", round(total, 2))\n",
    "hints": [
      "Run it again typing twelve as the price, read the last line of the traceback, then wrap the two conversions in try / except ValueError."
    ],
    "activity": {
      "title": "Daily exercise: Reading the Red Text",
      "brief": "Trigger NameError, TypeError, IndexError and KeyError on purpose — then fix each one and explain the message in a comment.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Trigger NameError, TypeError, IndexError and KeyError on purpose — then fix each one and explain the message in a comment.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Which traceback message have you seen most in your own code so far, and what was it actually telling you?",
    "quiz": {
      "question": "What does this program print?\n\ntry:\n    print(int(\"3.5\"))\nexcept ValueError:\n    print(\"bad\")",
      "options": [
        "3",
        "3.5",
        "bad",
        "ValueError: invalid literal for int() with base 10: '3.5'"
      ],
      "answer": 2,
      "explanation": "int() refuses a decimal string, so ValueError is raised and the handler prints bad."
    }
  },
  {
    "id": "py30-d20",
    "title": "Day 20 · Handling Failure",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/20",
    "starterCode": "# Keep asking until the user types a whole number.\nwhile True:\n    text = input(\"Number: \")\n    try:\n        number = int(text)\n    except ValueError:\n        print(\"Not a number, try again.\")\n    else:\n        print(\"You picked\", number)\n        break\n",
    "hints": [
      "Trace the two passes: the first goes through except, the second through else, and only the second reaches break."
    ],
    "activity": {
      "title": "Daily exercise: Handling Failure",
      "brief": "Ask for a number and keep asking until the user types a valid one — no crash allowed — then use else and finally to report the outcome.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Ask for a number and keep asking until the user types a valid one — no crash allowed — then use else and finally to report the outcome.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "When is letting a program crash with a clear error better than catching it and carrying on?",
    "quiz": {
      "question": "Which lines does this program print?\n\ntry:\n    value = int(\"7\")\nexcept ValueError:\n    print(\"bad\")\nelse:\n    print(\"ok\", value)\nfinally:\n    print(\"end\")",
      "options": [
        "bad then end",
        "ok 7 then end",
        "ok 7",
        "end"
      ],
      "answer": 1,
      "explanation": "No error occurs, so else runs and prints ok 7, and finally always runs last."
    }
  },
  {
    "id": "py30-d21",
    "title": "Day 21 · Your First Classes",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/21",
    "starterCode": "# A class is a blueprint. Finish the TODOs, then create your own book.\nclass Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\n        # TODO: add self.pages = 0\n\nfirst = Book(\"Dune\", \"Frank Herbert\")\nsecond = Book(\"Emma\", \"Jane Austen\")\nprint(first.title, \"by\", first.author)\nprint(second.title, \"by\", second.author)\n# TODO: print the page count of each book\n",
    "hints": [
      "Each Book object keeps its own title and author, so add a third attribute in __init__ and print it for both books."
    ],
    "activity": {
      "title": "Daily exercise: Your First Classes",
      "brief": "Write a Book class with title and author; create two books and print both objects.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Write a Book class with title and author; create two books and print both objects.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Which object from your own life would you model first, and which three attributes would it need?",
    "quiz": {
      "question": "What does this program print?\n\nclass Cat:\n    def __init__(self, name):\n        self.name = name\n\nc = Cat(\"Milo\")\nprint(c.name, type(c).__name__)",
      "options": [
        "Milo",
        "Milo Cat",
        "Cat Milo",
        "NameError"
      ],
      "answer": 1,
      "explanation": "c.name is Milo and type(c).__name__ is the class name, Cat."
    }
  },
  {
    "id": "py30-d22",
    "title": "Day 22 · Objects That Behave",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/22",
    "starterCode": "# Finish EBook: give it its own describe() that mentions the file size.\nclass Book:\n    def __init__(self, title, pages):\n        self.title = title\n        self.pages = pages\n    def describe(self):\n        return self.title + \" (\" + str(self.pages) + \" pages)\"\nclass EBook(Book):\n    def __init__(self, title, pages, size):\n        self.title = title\n        self.pages = pages\n        self.size = size\n    # TODO: describe() should also show self.size, like \" - 2.5 MB\"\nprint(Book(\"Dune\", 412).describe())\nprint(EBook(\"Dune\", 412, 2.5).describe())",
    "hints": [
      "EBook already inherits describe(), so start your override with the same text and then add the size on the end."
    ],
    "activity": {
      "title": "Daily exercise: Objects That Behave",
      "brief": "Add describe() to Book, then make EBook(Book) with a file_size and override describe().",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Add describe() to Book, then make EBook(Book) with a file_size and override describe().",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Which object from your own work or hobbies would you model first, and what is the one method it must have?",
    "quiz": {
      "question": "What does this print?\n\nclass Counter:\n    def __init__(self, n):\n        self.n = n\n    def bump(self):\n        self.n += 1\n        return self.n\nc = Counter(5)\nprint(c.bump(), c.bump())",
      "options": [
        "5 5",
        "6 6",
        "6 7",
        "7 6"
      ],
      "answer": 2,
      "explanation": "Each call changes the same object, so the first bump stores 6 and the second one returns 7."
    }
  },
  {
    "id": "py30-d23",
    "title": "Day 23 · Polished Objects",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/23",
    "starterCode": "# Make price safe: keep the value in _price and expose a property.\nfrom dataclasses import dataclass\n@dataclass\nclass Book:\n    title: str\n    _price: float = 10.0\n    # TODO: add a @property named price that returns self._price\n    # TODO: add a price.setter that raises ValueError when value < 0\nbook = Book(\"Dune\", 9.99)\nprint(book.title)\n# TODO: print the price, then try book.price = -5",
    "hints": [
      "The setter runs on every assignment, so book.price = -5 is the line that should raise ValueError."
    ],
    "activity": {
      "title": "Daily exercise: Polished Objects",
      "brief": "Turn Book into a dataclass, add __eq__ and __len__, and protect price behind a property that rejects negative values.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Turn Book into a dataclass, add __eq__ and __len__, and protect price behind a property that rejects negative values.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Where would a read-only property save you from a bad value in something you have already built?",
    "quiz": {
      "question": "What does this print?\n\nclass A:\n    def hi(self):\n        return \"A\"\nclass B(A):\n    def hi(self):\n        return super().hi() + \"B\"\nprint(B().hi())",
      "options": [
        "AB",
        "BA",
        "B",
        "A"
      ],
      "answer": 0,
      "explanation": "super().hi() runs the parent method first, and the subclass appends its own letter to that result."
    }
  },
  {
    "id": "py30-d24",
    "title": "Day 24 · Review 4: Expense Tracker",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/24",
    "starterCode": "import csv\n\nclass Expense:\n    def __init__(self, amount, category, note):\n        self.amount = amount\n        self.category = category\n        self.note = note\n    # TODO: __str__ -> \"12.50 food - lunch\"\n\nexpenses = []\n\ndef add_expense():\n    # TODO: ask for amount, category, note; float() in try / except ValueError\n    pass\n\ndef show_totals():\n    # TODO: total per category, then the grand total\n    pass\n\ndef save():\n    # TODO: header row, then one row per expense, into expenses.csv\n    pass\n\ndef load():\n    # TODO: if expenses.csv exists, skip the header and rebuild Expense objects\n    pass\n\nload()\nprint(\"Expense Tracker\")\n# TODO: menu loop - 1 add, 2 list, 3 totals, 4 save, 5 quit",
    "hints": [
      "Work through the requirements one at a time and test after each change."
    ],
    "activity": {
      "title": "Weekly build: Review 4: Expense Tracker",
      "brief": "Today you build the project this week has been pointing at: a tracker that records what you spend, groups it by category, and keeps every expense in expenses.csv. You already own the pieces — a class for the data, try / except for bad input, and the csv module for the file. Your job is to connect them into one program that loads, saves and never crashes.",
      "steps": [
        "Read the weekly build brief and requirements.",
        "An Expense class stores amount as a float, plus category and note as text, and its __str__ returns one readable line such as '12.50 food - lunch'.",
        "Choosing Add asks for the three values, converts the amount with float() inside try / except ValueError, and asks again instead of crashing when the text is not a number.",
        "Choosing List prints every expense, numbered from 1, using str(expense).",
        "Choosing Totals prints one line per category with that category's sum, then a grand total with two decimals.",
        "Choosing Save writes expenses.csv with a header row and one row per expense.",
        "The program loads expenses.csv when it starts, and starts with an empty list when the file does not exist yet.",
        "Run the starter repeatedly, test invalid input, and polish the final output."
      ],
      "successCriteria": [
        "The build meets every listed requirement.",
        "The program handles the required edge case without crashing.",
        "You can explain what you would improve in the stretch goals."
      ]
    },
    "reflectionPrompt": "Which part of the tracker made you think hardest — designing the Expense class, guarding the input, or keeping the CSV in sync — and what would you change next time?",
    "quiz": null
  },
  {
    "id": "py30-d25",
    "title": "Day 25 · The Toolbox Opens",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/25",
    "starterCode": "# Ask how many rolls, then report the average total of two dice.\nimport random\ncount = int(input(\"How many rolls? \"))\nrandom.seed(1)\ntotals = []\nfor _ in range(count):\n    totals.append(random.randint(1, 6) + random.randint(1, 6))\nprint(\"First rolls:\", totals[:5])\n# TODO: print the number of rolls\n# TODO: print the average with round(sum(totals) / len(totals), 2)\n# TODO: print the highest total",
    "hints": [
      "Keep the totals in a list, then sum(totals) / len(totals) gives the average and max(totals) the best roll."
    ],
    "activity": {
      "title": "Daily exercise: The Toolbox Opens",
      "brief": "Simulate 1,000 dice rolls with random, report the average with math, then move the dice logic into your own dice.py module.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Simulate 1,000 dice rolls with random, report the average with math, then move the dice logic into your own dice.py module.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Which standard-library module do you want to explore next, and what would you build with it?",
    "quiz": {
      "question": "What does this print?\n\nimport math\nprint(math.floor(2.7), math.ceil(2.1))",
      "options": [
        "2 3",
        "3 2",
        "2.0 3.0",
        "3 3"
      ],
      "answer": 0,
      "explanation": "floor rounds down to 2 and ceil rounds up to 3, and both return whole numbers here."
    }
  },
  {
    "id": "py30-d26",
    "title": "Day 26 · Time & Structure",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/26",
    "starterCode": "# Day 26 lab: how many days until the big date?\nfrom datetime import date\nfrom collections import Counter\n\ntoday = date(2026, 11, 23)\nevent = date(2026, 12, 25)\nprint(\"Days left:\", (event - today).days)\nprint(\"Full weeks:\", (event - today).days // 7)\n\nline = \"python is fun and python is fast\"\ntally = Counter(line.split())\nprint(\"Top word:\", tally.most_common(1)[0])\n",
    "hints": [
      "Change event to your own birthday and run again - the arithmetic never changes."
    ],
    "activity": {
      "title": "Daily exercise: Time & Structure",
      "brief": "Print today's date three ways, time a loop with perf_counter(), and count the words in a paragraph with collections.Counter.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Print today's date three ways, time a loop with perf_counter(), and count the words in a paragraph with collections.Counter.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Which of these three tools - dates, timers or counters - would change the most in a program you already use, and what exactly would it fix?",
    "quiz": {
      "question": "What does this print?\n\nfrom datetime import datetime, timedelta\nprint(datetime(2026, 1, 31) + timedelta(days=1))",
      "options": [
        "2026-01-32 00:00:00",
        "2026-02-01 00:00:00",
        "2026-01-31 00:00:01",
        "ValueError"
      ],
      "answer": 1,
      "explanation": "timedelta does real calendar math, so the day after 31 January rolls over into February."
    }
  },
  {
    "id": "py30-d27",
    "title": "Day 27 · Programs That Run",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/27",
    "starterCode": "# Day 27 lab: a menu loop that survives bad input.\ntasks = []\nwhile True:\n    print(\"1 add  2 list  3 quit\")\n    choice = input(\"Choice: \").strip()\n\n    if choice == \"1\":\n        tasks.append(input(\"Task: \"))\n    elif choice == \"2\":\n        print(len(tasks), \"task(s):\", tasks)\n    elif choice == \"3\":\n        print(\"Bye -\", len(tasks), \"saved\")\n        break\n    else:\n        print(\"Type 1, 2 or 3\")\n",
    "hints": [
      "Run it once with 9 as your first choice and watch the else branch save you from a crash."
    ],
    "activity": {
      "title": "Daily exercise: Programs That Run",
      "brief": "Build a four-option menu loop that survives bad input, then split it into main.py and menu.py with an if __name__ == '__main__' guard.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Build a four-option menu loop that survives bad input, then split it into main.py and menu.py with an if __name__ == '__main__' guard.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Look at the last script you wrote: which lines belong in main(), and which ones deserve to be a function of their own?",
    "quiz": {
      "question": "What does this print?\n\nfrom itertools import cycle, islice\nprint(list(islice(cycle(\"ab\"), 4)))",
      "options": [
        "['a', 'b']",
        "['a', 'b', 'a', 'b']",
        "['a', 'a', 'b', 'b']",
        "['ab', 'ab']"
      ],
      "answer": 1,
      "explanation": "cycle repeats the two letters forever, and islice keeps the first four items."
    }
  },
  {
    "id": "py30-d28",
    "title": "Day 28 · Real Data",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/28",
    "starterCode": "# Day 28 lab: a saved API response, parsed without any network.\nimport json\nimport re\n\nraw = '[{\"name\": \"Ana\", \"email\": \"ana@mail.com\"}, {\"name\": \"Ben\", \"email\": \"ben@site.org\"}]'\npeople = json.loads(raw)\n\nfor person in people:\n    print(person[\"name\"], \"->\", person[\"email\"])\n\nprint(\"Emails:\", re.findall(r\"[\\w.]+@[\\w.]+\", raw))\n",
    "hints": [
      "Add a third person to the JSON string, then run again and check that both the loop and the regex pick them up."
    ],
    "activity": {
      "title": "Daily exercise: Real Data",
      "brief": "Parse a sample JSON response, extract every email with re.findall(), then write a generator that yields one record at a time.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Parse a sample JSON response, extract every email with re.findall(), then write a generator that yields one record at a time.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Where in your own work could a generator save you from loading a huge file or response into memory all at once?",
    "quiz": {
      "question": "What does this print?\n\nimport re\nprint(re.findall(r\"\\d+\", \"a1 b22 c333\"))",
      "options": [
        "['1', '2', '3']",
        "['1', '22', '333']",
        "['a1', 'b22', 'c333']",
        "['12333']"
      ],
      "answer": 1,
      "explanation": "The pattern matches one or more digits in a row, so each whole number comes back as a string."
    }
  },
  {
    "id": "py30-d29",
    "title": "Day 29 · Sharp Tools",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/29",
    "starterCode": "# Lab: fill in the TODO, then run.\ndef double_result(func):\n    def wrapper(*args):\n        # TODO: call func(*args) and double what it returns\n        pass\n    return wrapper\n\n\n@double_result\ndef add(a, b):\n    return a + b\n\n\nprint(add(2, 3))\n",
    "hints": [
      "Replace pass with a return that calls func(*args) and multiplies the result by 2, so add(2, 3) prints 10."
    ],
    "activity": {
      "title": "Daily exercise: Sharp Tools",
      "brief": "Add a @timer decorator, run a PEP 8 pass on your capstone file, and generate the first five Fibonacci numbers with a generator.",
      "steps": [
        "Read and type the 4 concept examples for this day.",
        "Run the examples and change at least one value or line to observe what changes.",
        "Add a @timer decorator, run a PEP 8 pass on your capstone file, and generate the first five Fibonacci numbers with a generator.",
        "Run the starter code, fix or replace each TODO, and save your working version."
      ],
      "successCriteria": [
        "The starter program runs successfully.",
        "You can explain one change you made and its output.",
        "The daily task is complete and tested with a second input or variation."
      ]
    },
    "reflectionPrompt": "Which of today's four ideas - decorators, PEP 8, the CLI blueprint, the roadmap - will change how you write code tomorrow, and why that one?",
    "quiz": {
      "question": "What does this program print?\n\ndef loud(func):\n    def wrapper():\n        return func().upper()\n    return wrapper\n\n@loud\ndef greet():\n    return \"hello\"\n\nprint(greet())",
      "options": [
        "hello",
        "HELLO",
        "None",
        "wrapper"
      ],
      "answer": 1,
      "explanation": "@loud rebinds greet to wrapper, so greet() calls the original function and uppercases the text it returns."
    }
  },
  {
    "id": "py30-d30",
    "title": "Day 30 · Capstone: Ship the To-Do CLI",
    "sourceUrl": "https://py30-nete5pnd.manus.space/day/30",
    "starterCode": "import json\n\ndef load_tasks():\n    # TODO: return json.load(open(\"tasks.json\")), or [] if missing\n    return []\n\n\ndef save_tasks(tasks):\n    # TODO: json.dump(tasks, open(\"tasks.json\", \"w\"), indent=2)\n    pass\n\n\ndef add_task(tasks, title):\n    # TODO: tasks.append({\"title\": title, \"done\": False})\n    pass\n\n\ndef list_tasks(tasks):\n    # TODO: print \"1. [ ] title\", with x when done\n    pass\n\n\ndef remove_task(tasks, index):\n    # TODO: tasks.pop(index - 1)\n    pass\n\n\ndef main():\n    tasks = load_tasks()\n    # TODO: while loop: print the menu, input() a choice, dispatch\n    print(\"1 add  2 list  3 done  4 remove  5 quit\")\n\n\nif __name__ == \"__main__\":\n    main()\n",
    "hints": [
      "Work through the requirements one at a time and test after each change."
    ],
    "activity": {
      "title": "Weekly build: Capstone: Ship the To-Do CLI",
      "brief": "Thirty days ago you printed one line of text; today you ship a program. The To-Do CLI is small enough to finish in one sitting and real enough to keep on your own machine: it stores your tasks, remembers them between runs, and refuses to crash when you type nonsense. Every part of the course meets here - lists and dictionaries, functions, files and JSON, try/except, a menu loop, classes if you want them, and PEP 8 - which is exactly what makes it a fair final exam. Build it, run it, break it, then fix it.",
      "steps": [
        "Read the weekly build brief and requirements.",
        "Add a task: menu choice 1 asks for a title and appends a dict with that title and done set to False.",
        "List tasks: menu choice 2 prints every task as 1. [ ] title, shows an x inside the brackets when done is True, and prints a friendly line when there is nothing to show.",
        "Mark done: menu choice 3 asks for the number printed by list and sets that task's done to True, then saves.",
        "Remove a task: menu choice 4 asks for a number and deletes that task from the list, then saves.",
        "Persist: write the list to tasks.json with json.dump(..., indent=2) after every change, and load it again on start, beginning from an empty list when the file does not exist yet.",
        "Menu loop: keep showing the menu and asking for a choice until the user picks 5, then save once more and exit cleanly.",
        "Bad input never crashes: a non-number, an out-of-range index or an unknown menu choice prints one short message and returns to the menu instead of raising an exception.",
        "Structure: one function per command, all called from main(), which sits under if __name__ == \"__main__\":, with no work happening at import time.",
        "Run the starter repeatedly, test invalid input, and polish the final output."
      ],
      "successCriteria": [
        "The build meets every listed requirement.",
        "The program handles the required edge case without crashing.",
        "You can explain what you would improve in the stretch goals."
      ]
    },
    "reflectionPrompt": "Now that the course is over: what will you build next with Python, and why that one rather than the twenty other ideas you could pick?",
    "quiz": null
  }
] as PythonForgeActivity[];

const byTitle = new Map(py30Activities.map(activity => [activity.title, activity]));

export function getPy30ActivityForModule(courseSlug?: string | null, moduleTitle?: string | null) {
  if (courseSlug !== PY30_COURSE_SLUG || !moduleTitle) return null;
  return byTitle.get(moduleTitle) ?? null;
}
