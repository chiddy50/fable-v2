// PLOT
const plotElements = {
    conflict: [
      {
        title: "Man vs. Nature",
        description: "The protagonist struggles against natural elements such as storms, wild animals, or harsh environments."
      },
      {
        title: "Man vs. Society",
        description: "The protagonist faces challenges from societal norms, institutions, or cultural expectations."
      },
      {
        title: "Man vs. Self",
        description: "The protagonist battles internal struggles such as fear, doubt, or inner demons."
      },
      {
        title: "Man vs. Technology",
        description: "The protagonist confronts challenges posed by advancements in technology or artificial intelligence."
      },
      {
        title: "Man vs. Supernatural",
        description: "The protagonist encounters supernatural entities, forces, or phenomena."
      },
      {
        title: "Man vs. Fate",
        description: "The protagonist grapples with a predetermined destiny or unforeseen events beyond their control."
      },
      {
        title: "Man vs. Time",
        description: "The protagonist must overcome obstacles related to time travel, aging, or temporal paradoxes."
      },
      {
        title: "Man vs. Alien",
        description: "The protagonist faces extraterrestrial threats or conflicts with beings from other worlds."
      },
      {
        title: "Man vs. Animal",
        description: "The protagonist contends with dangerous or intelligent animals in their environment."
      },
      {
        title: "Man vs. Government",
        description: "The protagonist challenges oppressive regimes, corrupt authorities, or unjust laws."
      },
      {
        title: "Man vs. Economy",
        description: "The protagonist struggles against economic hardships, poverty, or financial crises."
      },
      {
        title: "Man vs. Fate",
        description: "The protagonist battles against predetermined destiny or supernatural forces guiding their path."
      },
      {
        title: "Man vs. Morality",
        description: "The protagonist grapples with ethical dilemmas, moral ambiguity, or conflicting values."
      },
      {
        title: "Man vs. Power",
        description: "The protagonist confronts abuses of power, tyranny, or struggles for control and dominance."
      },
      {
        title: "Man vs. Unknown",
        description: "The protagonist faces mysteries, enigmas, or existential threats beyond comprehension."
      }
    ],
    resolution: [
      {
        "title": "Happy Ending",
        "description": "The conflict is resolved positively, and the protagonist achieves their goals or finds happiness."
      },
      {
        "title": "Tragic Ending",
        "description": "The conflict results in loss, failure, or the downfall of the protagonist."
      },
      {
        "title": "Open-ended",
        "description": "The resolution leaves room for interpretation, ambiguity, or the possibility of future developments."
      },
      {
        "title": "Bittersweet Ending",
        "description": "The resolution combines elements of happiness and sadness, offering a nuanced conclusion."
      },
      {
        "title": "Ambiguous Ending",
        "description": "The resolution leaves key questions unanswered or presents multiple possible interpretations."
      },
      {
        "title": "Redemption",
        "description": "The protagonist finds redemption or achieves personal growth through overcoming the conflict."
      },
      {
        "title": "Sacrifice",
        "description": "The conflict is resolved through the protagonist making a significant sacrifice for the greater good."
      },
      {
        "title": "Moral Victory",
        "description": "The conflict is resolved in alignment with the protagonist's moral values or principles."
      },
      {
        "title": "Unresolved",
        "description": "The conflict remains unresolved, leaving the story's outcome uncertain or incomplete."
      },
      {
        "title": "Twist Ending",
        "description": "The resolution contains a surprising plot twist or revelation that changes the audience's perception of the story."
      }
    ],
    twists: [true, false],
    challenges: {
      physical: [
        "Combat or battle against adversaries",
        "Survival in harsh environments (e.g., wilderness, extreme weather)",
        "Endurance tests (e.g., marathons, obstacle courses)",
        "Physical disabilities or injuries",
        "Escape from captivity or confinement",
        "Journey through dangerous territories (e.g., war zones, post-apocalyptic landscapes)",
        "Physical illness or ailments",
        "Confrontation with wild animals or monsters",
        "Climbing mountains or traversing treacherous terrain",
        "Chasing or being chased"
      ],
      mental: [
        "Solving complex puzzles or riddles",
        "Outsmarting adversaries or villains",
        "Overcoming intellectual obstacles or barriers",
        "Memory loss or amnesia",
        "Dealing with moral dilemmas or ethical conflicts",
        "Facing psychological trauma or mental disorders",
        "Investigating mysteries or uncovering secrets",
        "Developing new skills or knowledge",
        "Struggling with decision-making or indecision",
        "Battling inner demons or personal doubts"
      ],
      emotional: [
        "Coping with loss or grief",
        "Dealing with rejection or betrayal",
        "Overcoming fears or phobias",
        "Managing stress or anxiety",
        "Navigating complex relationships (e.g., family dynamics, romantic entanglements)",
        "Confronting past traumas or emotional scars",
        "Finding inner peace or happiness",
        "Forgiving oneself or others",
        "Building self-confidence or self-esteem",
        "Resisting temptations or overcoming vices"
      ],
    },
    quests: [
      "Retrieve the lost artifact",
      "Rescue the captured princess",
      "Defeat the ancient evil",
      "Find the legendary treasure",
      "Unlock the hidden secrets",
      "Unravel the mystery of the cursed land",
      "Complete the sacred ritual",
      "Explore the forbidden ruins",
      "Solve the riddles of the wise sage",
      "Survive the perilous journey"
    ],
    missions: [
      "Infiltrate the enemy stronghold",
      "Gather intelligence behind enemy lines",
      "Sabotage the enemy's war machines",
      "Escort the VIP to safety",
      "Neutralize the terrorist threat",
      "Rescue hostages from the enemy's clutches",
      "Intercept the enemy's communication network",
      "Secure the perimeter of the base",
      "Eliminate the high-value target",
      "Defend the homeland from invasion"
    ],
    journeys: [
      "Embark on a pilgrimage to the sacred temple",
      "Cross the treacherous desert",
      "Navigate through the enchanted forest",
      "Sail across the vast ocean",
      "Ascend the towering mountains",
      "Venture into the heart of the volcano",
      "Traverse the icy tundra",
      "Follow the ancient trail of the ancestors",
      "Cross the boundaries of time and space",
      "Explore the realms of dreams and nightmares"
    ]
}
