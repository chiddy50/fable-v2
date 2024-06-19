export const creativeWritingOptions = [
    // {
    //     title: "Story Crafting",
    //     description: "Build your own adventure, just like with LEGO blocks! Mix and match characters, settings, and exciting events to create your unique story"
    // },
    // {
    //     title: "Narrative Creation",
    //     description: "Be the director of your own bedtime story! Dream up characters, decide their fate, and bring the adventure to life with every word you write."
    // },
    {
        title: "Fiction Writing",
        description: "Dive into your very own adventure playground! Dream up characters, places, and thrilling escapades to create your own magical world."
    },
    // {
    //     title: "Storytelling Art",
    //     description: "Paint vivid pictures with words! Use your imagination to craft stories that evoke emotions and transport readers to fantastical realms."
    // },
    {
        title: "Creative Storytelling",
        description: "Set sail on an imaginative journey! Become the captain of your story ship, exploring enchanted lands and meeting quirky characters along the way."
    }
]

export const businessStorytellingOptions = [
    {
      title: 'Brand Narratives',
      description: 'Brand narratives are stories that convey the essence, values, and personality of a brand. They help build emotional connections with customers and differentiate the brand in the market.'
    },
    {
      title: 'Corporate Storytelling',
      description: "Corporate storytelling involves using narratives to communicate the history, culture, and vision of a company. It helps employees understand the company's mission and values and fosters a sense of belonging."
    },
    {
      title: 'Brand Storytelling',
      description: 'Brand storytelling focuses on sharing stories that resonate with the target audience and reinforce the brand message. It aims to engage customers on an emotional level and build brand loyalty.'
    },
    {
      title: 'Business Narratives',
      description: 'Business narratives encompass stories that illustrate the challenges, successes, and lessons learned in the business world. They provide insights into industry trends, leadership strategies, and organizational culture.'
    },
    {
      title: 'Company Tales',
      description: 'Company tales are stories that highlight memorable events, milestones, and experiences within an organization. They celebrate achievements, inspire employees, and strengthen the company culture.'
    }
  ];
  

export const showTransferLoader = () => {
    let fullPageLoader = document.getElementById("full-page-loader") as HTMLElement
    if (fullPageLoader) {            
        fullPageLoader.style.display = "block";    
    }
}

export const hideTransferLoader = () => {
    let fullPageLoader = document.getElementById("full-page-loader") as HTMLElement
    if (fullPageLoader) {            
        fullPageLoader.style.display = "none";    
    }
}