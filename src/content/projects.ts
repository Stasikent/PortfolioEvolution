interface MediaDescription {
  src: string;
  alt: string;
  caption?: string;
}
export type ProjectMedia = MediaDescription & (
  | { type: "image"; width?: number; height?: number }
  | { type: "animation"; poster: string; width?: number; height?: number }
  | { type: "video"; poster: string; transcript: string; captions?: { src: string; language: string; label: string } }
  | { type: "external" }
);

export interface ProjectOverview {
  purpose: string;
  approach: string;
  evidence: string;
  ownership?: string;
  status?: string;
}

export interface ProjectCaseStudy {
  challenge: string;
  ownership: string;
  aiContribution: string;
  delivery: string;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  headline: string;
  description: string;
  technologies: readonly string[];
  features: readonly string[];
  links: readonly { label: string; url: string }[];
  journey?: readonly string[];
  caseStudy?: ProjectCaseStudy;
  overview?: ProjectOverview;
  // Optional, verified media only. Existing demo destinations remain links.
  media?: readonly ProjectMedia[];
}
export const projects: readonly Project[] = [
  {
    id: "mis-bot",
    name: "MIS-Bot",
    category: "Workflow automation",
    headline: "Born from a real problem.",
    description:
      "Originating in my work as a radiologist, MIS-Bot automates repetitive operations in a medical information system.",
    technologies: [
      "Python",
      "OCR",
      "UI automation / RPA",
      "Workflow automation",
    ],
    features: [],
    journey: [
      "Real workflow problem",
      "Analysis",
      "Prototype",
      "Iteration",
      "Working tool used in real work",
    ],
    caseStudy: {
      challenge: "Reduce repetitive operations in the medical information system used in my own radiology workflow.",
      ownership: "I defined the problem, mapped the workflow and exceptions, decomposed the work, reviewed the code and tested each iteration in the real system.",
      aiContribution: "ChatGPT and Codex supported implementation, code analysis, refactoring and debugging; product decisions and validation remained with me.",
      delivery: "The first useful MVP was working in about three days, then expanded with OCR, multiple scenarios and handling for non-standard states.",
    },
    links: [
      { label: "Source code", url: "https://github.com/Stasikent/MIS-Bot" },
      {
        label: "Watch demo",
        url: "https://drive.google.com/file/d/1b-rrZaVQs2wUicVmJwgoYiexpLCmwJP4/view?usp=sharing",
      },
      {
        label: "Second demo",
        url: "https://drive.google.com/file/d/1lCWejh6X-Bhm6uimAP4MFn_w3iFkJm1t/view?usp=sharing",
      },
    ],
  },
  {
    id: "release-guardian",
    name: "AI Release Guardian",
    category: "Quality assurance",
    headline: "A closer look at release risk.",
    description:
      "An AI-assisted QA and release-risk analysis project using LLMs, retrieval and DOM analysis.",
    technologies: [
      "LLM",
      "RAG",
      "QA",
      "DOM analysis",
      "Selenium",
      "BeautifulSoup",
    ],
    features: [],
    overview: {
      purpose: "Help a QA engineer identify what needs testing when a web interface changes.",
      approach: "Selenium and BeautifulSoup extract interface facts. RAG and LLM analysis use the structured data to prepare test scenarios and assess changes between runs.",
      evidence: "The source repository, examples and Colab notebook document the prototype and its outputs.",
      ownership: "I handled the work outside code writing: defining the product, directing its development and checking the result. I did not write the code myself.",
      status: "Working prototype; currently being turned into a structured application.",
    },
    links: [
      {
        label: "Source code",
        url: "https://github.com/Stasikent/AI-Release-Guardian---",
      },
      {
        label: "Examples & results",
        url: "https://docs.google.com/document/d/1LpZcU_-lF2Cw5WRE9hBeM5YDN_18o9zK/edit?usp=sharing&ouid=101305330852096046157&rtpof=true&sd=true",
      },
      {
        label: "Open Colab",
        url: "https://colab.research.google.com/drive/1P5gLikBtKWTbxulQD5IFdQbkfn8E4XCe#scrollTo=7dd9NrOCSAGG",
      },
    ],
  },
  {
    id: "aichatflutter",
    name: "AIChatFlutter",
    category: "Multi-model application",
    headline: "Multiple models. One application.",
    description:
      "An application for interacting with multiple LLMs through APIs.",
    technologies: ["Flutter", "Dart", "REST API", "SQLite", "LLM APIs"],
    features: [
      "Multiple chats",
      "History",
      "PIN authentication",
      "Analytics",
      "Multiple AI models",
      "Desktop and Android versions",
      "Balance notifications through a Telegram bot",
    ],
    overview: {
      purpose: "Bring conversations with multiple AI models into one application, with chat history and PIN authentication.",
      approach: "A Flutter/Dart application using LLM APIs, REST API and SQLite. Available as a desktop application and an Android app.",
      evidence: "API requests have been tested successfully. Balance feedback is sent through a Telegram bot; the linked mobile demo shows the application.",
      ownership: "I handled the work outside code writing: defining the product, directing its development and checking the result. I did not write the code myself.",
      status: "Completed desktop and Android applications.",
    },
    links: [
      {
        label: "Mobile demo",
        url: "https://drive.google.com/file/d/1MNpNjAvyFXeJn8eqdRDOee-PxkvXshhD/view?usp=sharing",
      },
    ],
  },
];
