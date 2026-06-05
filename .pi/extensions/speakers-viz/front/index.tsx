import React from "react"
import {
  definePlugin,
  type PaneProps,
  WORKSPACE_OPEN_PATH_SURFACE_KIND,
} from "@hachej/boring-workspace/plugin"

const MAIN_PANEL_ID = "speakers-viz.panel"
const LEFT_PANEL_ID = "speakers-viz.left"
const DEFAULT_CSV_PATH = "potential_speakers.csv"

type SpeakerRow = Record<string, string>

const EMBEDDED_ROWS: SpeakerRow[] = [
  {
    "rank": "1",
    "ligue": "Ligue 3",
    "name": "Arthur Mensch",
    "primary_org": "Mistral AI",
    "category": "frontier AI lab",
    "relevance_score": "10",
    "episode_angle": "Building a European frontier AI lab, open-weight strategy, sovereignty",
    "linkedin_url": "https://fr.linkedin.com/in/arthur-mensch/fr",
    "linkedin_followers": "208000",
    "linkedin_confidence": "medium",
    "linkedin_note": "Found LinkedIn personal profile on LinkedIn (French localized domain). Preferred linkedin.com/in format may also work (localized URL used as evidence).",
    "linkedin_evidence_url": "https://fr.linkedin.com/in/arthur-mensch/fr",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "2",
    "ligue": "Ligue 2",
    "name": "Guillaume Lample",
    "primary_org": "Mistral AI",
    "category": "LLM research",
    "relevance_score": "10",
    "episode_angle": "LLM architecture, training, reasoning, multilingual models",
    "linkedin_url": "https://fr.linkedin.com/in/guillaume-lample-7821095b",
    "linkedin_followers": "10000",
    "linkedin_confidence": "medium",
    "linkedin_note": "Found LinkedIn personal profile on LinkedIn (French localized domain).",
    "linkedin_evidence_url": "https://fr.linkedin.com/in/guillaume-lample-7821095b",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "3",
    "ligue": "Ligue 2",
    "name": "Timothée Lacroix",
    "primary_org": "Mistral AI",
    "category": "LLM infrastructure",
    "relevance_score": "10",
    "episode_angle": "LLM infra, serving, scaling, production engineering",
    "linkedin_url": "https://www.linkedin.com/in/timothee-lacroix-59517977",
    "linkedin_followers": "6000",
    "linkedin_confidence": "medium",
    "linkedin_note": "Personal LinkedIn profile found; name contains accented character in original but profile uses ascii handle.",
    "linkedin_evidence_url": "https://www.linkedin.com/in/timothee-lacroix-59517977",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "4",
    "ligue": "Ligue 3",
    "name": "Clément Delangue",
    "primary_org": "Hugging Face",
    "category": "open-source AI",
    "relevance_score": "10",
    "episode_angle": "Open-source AI ecosystem, model hubs, community, regulation",
    "linkedin_url": "https://www.linkedin.com/in/clementdelangue",
    "linkedin_followers": "307000",
    "linkedin_confidence": "high",
    "linkedin_note": "Clear personal LinkedIn profile (preferred linkedin.com/in handle).",
    "linkedin_evidence_url": "https://www.linkedin.com/in/clementdelangue",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "5",
    "ligue": "Ligue 2",
    "name": "Thomas Wolf",
    "primary_org": "Hugging Face",
    "category": "open-source AI research",
    "relevance_score": "10",
    "episode_angle": "Transformers, open science, agents, LeRobot/smolagents",
    "linkedin_url": "https://www.linkedin.com/in/thom-wolf",
    "linkedin_followers": "184000",
    "linkedin_confidence": "medium",
    "linkedin_note": "LinkedIn personal profile 'thom-wolf' matches public references to Hugging Face cofounder Thom/Thomas Wolf; some name ambiguity exists so confidence is medium.",
    "linkedin_evidence_url": "https://www.linkedin.com/in/thom-wolf",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "6",
    "ligue": "Ligue 3",
    "name": "Julien Chaumond",
    "primary_org": "Hugging Face",
    "category": "AI developer tools",
    "relevance_score": "9",
    "episode_angle": "Developer tools, model hosting, AI product infrastructure",
    "linkedin_url": "https://www.linkedin.com/in/julienchaumond",
    "linkedin_followers": "251000",
    "linkedin_confidence": "high",
    "linkedin_note": "Clear personal LinkedIn profile (preferred linkedin.com/in handle).",
    "linkedin_evidence_url": "https://www.linkedin.com/in/julienchaumond",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "7",
    "ligue": "Ligue 3",
    "name": "Yann LeCun",
    "primary_org": "Meta / NYU",
    "category": "AI research",
    "relevance_score": "10",
    "episode_angle": "World models, open research, alternatives to autoregressive LLMs",
    "linkedin_url": "https://www.linkedin.com/in/yann-lecun",
    "linkedin_followers": "1000000",
    "linkedin_confidence": "high",
    "linkedin_note": "Well-known public LinkedIn profile (preferred linkedin.com/in handle).",
    "linkedin_evidence_url": "https://www.linkedin.com/in/yann-lecun",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "8",
    "ligue": "Ligue 3",
    "name": "François Chollet",
    "primary_org": "Keras / ARC-AGI",
    "category": "AI evaluation",
    "relevance_score": "9",
    "episode_angle": "AI evaluation, abstraction, developer ergonomics",
    "linkedin_url": "https://www.linkedin.com/in/fchollet",
    "linkedin_followers": "2000",
    "linkedin_confidence": "high",
    "linkedin_note": "Clear personal LinkedIn profile (preferred linkedin.com/in handle).",
    "linkedin_evidence_url": "https://www.linkedin.com/in/fchollet",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "9",
    "ligue": "Ligue 3",
    "name": "Yoshua Bengio",
    "primary_org": "Mila",
    "category": "AI safety / research",
    "relevance_score": "9",
    "episode_angle": "AI safety, frontier models, Canadian/French-speaking AI ecosystem",
    "linkedin_url": "https://ca.linkedin.com/in/yoshuabengio",
    "linkedin_followers": "83000",
    "linkedin_confidence": "high",
    "linkedin_note": "Found LinkedIn personal profile (Canada localized domain).",
    "linkedin_evidence_url": "https://ca.linkedin.com/in/yoshuabengio",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "10",
    "ligue": "Ligue 3",
    "name": "Joëlle Pineau",
    "primary_org": "Meta / McGill",
    "category": "RL / research leadership",
    "relevance_score": "9",
    "episode_angle": "RL, reproducibility, applied research leadership",
    "linkedin_url": "https://ca.linkedin.com/in/joelle-pineau-371574141",
    "linkedin_followers": "31000",
    "linkedin_confidence": "high",
    "linkedin_note": "Found LinkedIn personal profile (Canada localized domain). Profile handle includes numeric suffix as in evidence.",
    "linkedin_evidence_url": "https://ca.linkedin.com/in/joelle-pineau-371574141",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "11",
    "ligue": "Ligue 3",
    "name": "Sébastien Bubeck",
    "primary_org": "OpenAI / ex-Microsoft",
    "category": "LLM reasoning",
    "relevance_score": "9",
    "episode_angle": "LLM reasoning, theory, frontier model behavior",
    "linkedin_url": "https://linkedin.com/in/sebastien-bubeck-6b558a1a5",
    "linkedin_followers": "27000",
    "linkedin_confidence": "high",
    "linkedin_note": "Personal LinkedIn profile found in entity dataset.",
    "linkedin_evidence_url": "https://linkedin.com/in/sebastien-bubeck-6b558a1a5",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "12",
    "ligue": "Ligue 2",
    "name": "Antoine Bordes",
    "primary_org": "Helsing / ex-Meta AI",
    "category": "RAG / defense AI",
    "relevance_score": "8",
    "episode_angle": "RAG, agents, defense AI, research-to-product",
    "linkedin_url": "https://fr.linkedin.com/in/antoinebordes",
    "linkedin_followers": "13000",
    "linkedin_confidence": "medium",
    "linkedin_note": "Profile found via search snippet; multiple similar names exist so confidence is medium.",
    "linkedin_evidence_url": "https://fr.linkedin.com/in/antoinebordes",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "13",
    "ligue": "Ligue 2",
    "name": "Laurent Sifre",
    "primary_org": "H Company / ex-DeepMind",
    "category": "AI agents",
    "relevance_score": "9",
    "episode_angle": "Agents, AlphaGo lineage, model-based AI systems",
    "linkedin_url": "https://linkedin.com/in/sifre",
    "linkedin_followers": "12000",
    "linkedin_confidence": "high",
    "linkedin_note": "Personal LinkedIn profile found in entity dataset (lists H Company, DeepMind).",
    "linkedin_evidence_url": "https://linkedin.com/in/sifre",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "14",
    "ligue": "Ligue 1",
    "name": "Julien Perolat",
    "primary_org": "H Company / ex-DeepMind",
    "category": "multi-agent RL",
    "relevance_score": "8",
    "episode_angle": "Multi-agent RL, agentic systems",
    "linkedin_url": "https://linkedin.com/in/julien-perolat-757076a1",
    "linkedin_followers": "1000",
    "linkedin_confidence": "high",
    "linkedin_note": "Personal LinkedIn profile found in entity dataset (H Company, ex-DeepMind).",
    "linkedin_evidence_url": "https://linkedin.com/in/julien-perolat-757076a1",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "15",
    "ligue": "Ligue 1",
    "name": "Gabriel Hubert",
    "primary_org": "Dust",
    "category": "enterprise AI agents",
    "relevance_score": "9",
    "episode_angle": "Enterprise AI agents, internal knowledge, product workflows",
    "linkedin_url": "https://linkedin.com/in/gabhubert",
    "linkedin_followers": "8000",
    "linkedin_confidence": "high",
    "linkedin_note": "Personal LinkedIn profile found in entity dataset (Co-founder & CEO, Dust).",
    "linkedin_evidence_url": "https://linkedin.com/in/gabhubert",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "16",
    "ligue": "Ligue 1",
    "name": "Stanislas Polu",
    "primary_org": "Dust / ex-OpenAI",
    "category": "agents / reasoning",
    "relevance_score": "9",
    "episode_angle": "AI agents, theorem proving, coding/reasoning systems",
    "linkedin_url": "https://www.linkedin.com/in/spolu",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Personal LinkedIn profile found in entity dataset (Dust co-founder).",
    "linkedin_evidence_url": "https://www.linkedin.com/in/spolu",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "17",
    "ligue": "Ligue 2",
    "name": "Patrick Pérez",
    "primary_org": "Kyutai",
    "category": "voice / open AI lab",
    "relevance_score": "8",
    "episode_angle": "Open-science AI lab, real-time voice AI, Moshi",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_found",
    "linkedin_note": "No unambiguous personal LinkedIn profile located in the datasets/searches; name variants (accent) may affect results.",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "18",
    "ligue": "Ligue 2",
    "name": "Neil Zeghidour",
    "primary_org": "Kyutai / Gradium",
    "category": "voice AI",
    "relevance_score": "8",
    "episode_angle": "Voice models, audio LLMs, real-time interaction",
    "linkedin_url": "https://linkedin.com/in/neil-zeghidour-a838aaa7",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Personal LinkedIn profile found (CEO of Gradium, prior Kyutai/Google roles).",
    "linkedin_evidence_url": "https://linkedin.com/in/neil-zeghidour-a838aaa7",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "19",
    "ligue": "Ligue 2",
    "name": "Alexandre Défossez",
    "primary_org": "Kyutai / ex-Meta",
    "category": "audio generation",
    "relevance_score": "8",
    "episode_angle": "Audio generation, MusicGen-style systems, multimodal AI",
    "linkedin_url": "https://linkedin.com/in/alexandre-d%C3%A9fossez-b099ba7b",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Personal LinkedIn profile supplied in prior verified context (Kyutai founding research team).",
    "linkedin_evidence_url": "https://linkedin.com/in/alexandre-d%C3%A9fossez-b099ba7b",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "20",
    "ligue": "Ligue 2",
    "name": "Maxime Beauchemin",
    "primary_org": "Preset / Airflow / Superset",
    "category": "data engineering",
    "relevance_score": "10",
    "episode_angle": "Data engineering, orchestration, analytics infra",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "low",
    "linkedin_note": "Could not locate a single unambiguous personal profile in the datasets/search results; multiple people with similar names exist (Preset/Airflow/Superset affiliation not confirmed via dataset).",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "21",
    "ligue": "Ligue 2",
    "name": "Florian Douetteau",
    "primary_org": "Dataiku",
    "category": "enterprise AI platform",
    "relevance_score": "8",
    "episode_angle": "Enterprise AI platforms, governance, production ML",
    "linkedin_url": "https://linkedin.com/in/fdouetteau",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Profile matches Dataiku Co-founder and CEO (clear personal linkedin.com/in profile).",
    "linkedin_evidence_url": "https://linkedin.com/in/fdouetteau",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "22",
    "ligue": "Ligue 1",
    "name": "Clément Stenac",
    "primary_org": "Dataiku",
    "category": "data / ML platform",
    "relevance_score": "8",
    "episode_angle": "Data/ML platform engineering at scale",
    "linkedin_url": "https://linkedin.com/in/clementstenac",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Personal linkedin.com/in profile associated with Dataiku (CTO/co-founder).",
    "linkedin_evidence_url": "https://linkedin.com/in/clementstenac",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "23",
    "ligue": "Ligue 1",
    "name": "Gaël Varoquaux",
    "primary_org": "Inria / Probabl / scikit-learn",
    "category": "scientific ML",
    "relevance_score": "9",
    "episode_angle": "Scientific Python, reliable ML, open-source governance",
    "linkedin_url": "https://linkedin.com/in/gael-varoquaux-a8391411",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Personal linkedin.com/in profile listing Inria and scikit-learn affiliations.",
    "linkedin_evidence_url": "https://linkedin.com/in/gael-varoquaux-a8391411",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "24",
    "ligue": "Ligue 1",
    "name": "Olivier Grisel",
    "primary_org": "Probabl / scikit-learn",
    "category": "ML infra",
    "relevance_score": "8",
    "episode_angle": "ML performance, Python infra, practical model deployment",
    "linkedin_url": "https://www.linkedin.com/in/olivier-grisel-9131873",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Personal linkedin.com/in profile (Probabl / scikit-learn contributor). Multiple variants exist; this URL matches the known profile.",
    "linkedin_evidence_url": "https://www.linkedin.com/in/olivier-grisel-9131873",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "25",
    "ligue": "Ligue 1",
    "name": "Guillaume Lemaitre",
    "primary_org": "Probabl / scikit-learn",
    "category": "open-source ML",
    "relevance_score": "8",
    "episode_angle": "Open-source ML maintenance, library engineering",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "low",
    "linkedin_note": "Multiple LinkedIn profiles for people named Guillaume Lemaitre were found; none could be unambiguously confirmed as the Probabl / scikit-learn researcher. Returned evidence_url shows one candidate but confidence is LOW and linkedin_url set to null.",
    "linkedin_evidence_url": "https://linkedin.com/in/guillaume-lemaitre-45362a112",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "26",
    "ligue": "Ligue 1",
    "name": "Sylvain Gugger",
    "primary_org": "Hugging Face / fast.ai",
    "category": "training tools",
    "relevance_score": "8",
    "episode_angle": "Training libraries, education, practical DL tooling",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_found",
    "linkedin_note": "No clear personal linkedin.com/in profile found in queried datasets for the Hugging Face / fast.ai author.",
    "linkedin_evidence_url": "",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "27",
    "ligue": "Ligue 1",
    "name": "Lysandre Debut",
    "primary_org": "Hugging Face",
    "category": "ML tooling",
    "relevance_score": "8",
    "episode_angle": "Transformers, safetensors, open-source ML operations",
    "linkedin_url": "https://linkedin.com/in/lysandredebut",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Personal linkedin.com/in profile listing Hugging Face affiliation.",
    "linkedin_evidence_url": "https://linkedin.com/in/lysandredebut",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "28",
    "ligue": "Ligue 1",
    "name": "Victor Sanh",
    "primary_org": "Hugging Face",
    "category": "efficient NLP",
    "relevance_score": "8",
    "episode_angle": "DistilBERT, efficient NLP, community research",
    "linkedin_url": "https://linkedin.com/in/victor-sanh",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Personal linkedin.com/in profile associated with Hugging Face. (Alternate variant with suffix exists; chosen canonical variant.)",
    "linkedin_evidence_url": "https://linkedin.com/in/victor-sanh",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "29",
    "ligue": "Ligue 2",
    "name": "Ronan Collobert",
    "primary_org": "Meta / Torch",
    "category": "ML systems",
    "relevance_score": "8",
    "episode_angle": "Deep learning frameworks, Torch history, ML systems",
    "linkedin_url": "https://linkedin.com/in/ronan-collobert",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Personal linkedin.com/in profile found (researcher with Torch / Meta background).",
    "linkedin_evidence_url": "https://linkedin.com/in/ronan-collobert",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "30",
    "ligue": "Ligue 2",
    "name": "Edouard Grave",
    "primary_org": "Meta AI",
    "category": "efficient NLP",
    "relevance_score": "7",
    "episode_angle": "Efficient NLP, embeddings, large-scale model training",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_found",
    "linkedin_note": "No clear personal linkedin.com/in profile found in queried datasets for Edouard Grave (Meta AI).",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "31",
    "ligue": "Ligue 2",
    "name": "Armand Joulin",
    "primary_org": "Meta AI / Google DeepMind",
    "category": "retrieval / NLP",
    "relevance_score": "7",
    "episode_angle": "Retrieval, efficient models, NLP systems",
    "linkedin_url": "https://fr.linkedin.com/in/armand-joulin-0274254",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Public LinkedIn profile found (French LinkedIn URL) showing roles at Google DeepMind and prior Meta AI positions.",
    "linkedin_evidence_url": "https://fr.linkedin.com/in/armand-joulin-0274254",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "32",
    "ligue": "Ligue 2",
    "name": "Maxime Oquab",
    "primary_org": "Meta AI",
    "category": "computer vision",
    "relevance_score": "7",
    "episode_angle": "Computer vision, self-supervised learning, multimodal models",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_found",
    "linkedin_note": "No linkedin.com/in personal profile located in searches; OpenReview and publication records show Meta affiliation.",
    "linkedin_evidence_url": "https://openreview.net/profile?id=~Maxime_Oquab1",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "33",
    "ligue": "Ligue 2",
    "name": "Alexis Conneau",
    "primary_org": "ex-OpenAI / WaveForms",
    "category": "audio / multilingual AI",
    "relevance_score": "8",
    "episode_angle": "Multilingual/audio models, voice AI",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_found",
    "linkedin_note": "No linkedin.com/in personal profile located in searches; Crunchbase and social posts identify Alexis Conneau as co-founder/CEO of WaveForms and ex-OpenAI.",
    "linkedin_evidence_url": "https://www.crunchbase.com/person/alexis-conneau-e86c",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "34",
    "ligue": "Ligue 2",
    "name": "Hugo Larochelle",
    "primary_org": "Mila / Google",
    "category": "ML education",
    "relevance_score": "8",
    "episode_angle": "ML education, research leadership, deep learning fundamentals",
    "linkedin_url": "https://ca.linkedin.com/in/hugolarochelle",
    "linkedin_followers": "9000",
    "linkedin_confidence": "high",
    "linkedin_note": "Public LinkedIn profile found showing Hugo Larochelle as Scientific Director at Mila (and Google affiliations).",
    "linkedin_evidence_url": "https://ca.linkedin.com/in/hugolarochelle/en",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "35",
    "ligue": "Ligue 1",
    "name": "Aurélien Géron",
    "primary_org": "ML author / engineer",
    "category": "ML education",
    "relevance_score": "7",
    "episode_angle": "Practical ML education, deployment patterns",
    "linkedin_url": "https://nz.linkedin.com/in/aurelien-geron",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Public LinkedIn profile found for Aurélien Géron (author of 'Hands-On Machine Learning' and ML engineer).",
    "linkedin_evidence_url": "https://nz.linkedin.com/in/aurelien-geron",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "36",
    "ligue": "Ligue 2",
    "name": "Rand Hindi",
    "primary_org": "Zama / ex-Snips",
    "category": "privacy AI",
    "relevance_score": "8",
    "episode_angle": "Privacy-preserving ML, FHE, on-device assistants",
    "linkedin_url": "https://www.linkedin.com/in/randhindi",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Public LinkedIn profile found showing Rand Hindi as CEO at Zama and investor roles.",
    "linkedin_evidence_url": "https://www.linkedin.com/in/randhindi",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "37",
    "ligue": "Ligue 2",
    "name": "Pascal Paillier",
    "primary_org": "Zama",
    "category": "cryptography",
    "relevance_score": "8",
    "episode_angle": "Homomorphic encryption, secure AI computation",
    "linkedin_url": "https://fr.linkedin.com/in/ppaillier",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Public LinkedIn profile found for Pascal Paillier (cryptographer, Zama CTO).",
    "linkedin_evidence_url": "https://fr.linkedin.com/in/ppaillier",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "38",
    "ligue": "Ligue 1",
    "name": "Alexandre Lebrun",
    "primary_org": "Nabla",
    "category": "health AI agents",
    "relevance_score": "8",
    "episode_angle": "Healthcare AI agents, clinical assistants, productization",
    "linkedin_url": "https://fr.linkedin.com/in/alexandrelebrun",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Public LinkedIn profile found for Alexandre LeBrun (co-founder of Nabla).",
    "linkedin_evidence_url": "https://fr.linkedin.com/in/alexandrelebrun",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "39",
    "ligue": "Ligue 1",
    "name": "Martin Raison",
    "primary_org": "Nabla",
    "category": "health AI engineering",
    "relevance_score": "7",
    "episode_angle": "Medical AI engineering, secure clinical workflows",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_found",
    "linkedin_note": "No linkedin.com/in personal profile located in searches; company pages list him as co-founder of Nabla.",
    "linkedin_evidence_url": "http://welcometothejungle.com/en/companies/nabla/tech-1",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "40",
    "ligue": "Ligue 2",
    "name": "Thomas Clozel",
    "primary_org": "Owkin",
    "category": "biomedical AI",
    "relevance_score": "8",
    "episode_angle": "Biomedical AI, federated learning, foundation models for health",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_found",
    "linkedin_note": "No linkedin.com/in personal profile located in searches; could not locate an authoritative public LinkedIn profile during research.",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "41",
    "ligue": "Ligue 1",
    "name": "Gilles Wainrib",
    "primary_org": "Owkin",
    "category": "scientific ML",
    "relevance_score": "7",
    "episode_angle": "Scientific ML for biomedicine",
    "linkedin_url": "https://fr.linkedin.com/in/gilles-wainrib-028a622",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Co-founder and CSO at Owkin.",
    "linkedin_evidence_url": "https://fr.linkedin.com/in/gilles-wainrib-028a622",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "42",
    "ligue": "Ligue 1",
    "name": "Igor Carron",
    "primary_org": "LightOn",
    "category": "enterprise LLMs",
    "relevance_score": "7",
    "episode_angle": "Enterprise LLMs, search/retrieval, AI infrastructure",
    "linkedin_url": "https://fr.linkedin.com/in/igorcarron",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "CEO and co-founder of LightOn.",
    "linkedin_evidence_url": "https://fr.linkedin.com/in/igorcarron",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "43",
    "ligue": "Ligue 2",
    "name": "Laurent Daudet",
    "primary_org": "LightOn",
    "category": "AI hardware / compute",
    "relevance_score": "7",
    "episode_angle": "Optical computing, AI acceleration, sovereign infra",
    "linkedin_url": "https://fr.linkedin.com/in/laurent-daudet-a845b02",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Co-founder and former co-CEO of LightOn.",
    "linkedin_evidence_url": "https://fr.linkedin.com/in/laurent-daudet-a845b02",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "44",
    "ligue": "Ligue 2",
    "name": "Florent Krzakala",
    "primary_org": "LightOn / EPFL",
    "category": "ML theory",
    "relevance_score": "7",
    "episode_angle": "Statistical physics, ML theory, model behavior",
    "linkedin_url": "https://www.linkedin.com/in/florentkrzakala",
    "linkedin_followers": "",
    "linkedin_confidence": "medium",
    "linkedin_note": "Professor at EPFL; known co-founder of LightOn although snippet focuses on academic role.",
    "linkedin_evidence_url": "https://www.linkedin.com/in/florentkrzakala",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "45",
    "ligue": "Ligue 1",
    "name": "Matthieu Rouif",
    "primary_org": "Photoroom",
    "category": "generative image AI",
    "relevance_score": "8",
    "episode_angle": "Generative image products, mobile AI, product-led AI",
    "linkedin_url": "https://fr.linkedin.com/in/matthieurouif",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Co-founder & CEO of Photoroom.",
    "linkedin_evidence_url": "https://fr.linkedin.com/in/matthieurouif",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "46",
    "ligue": "Ligue 1",
    "name": "Eliot Andres",
    "primary_org": "Photoroom",
    "category": "computer vision product",
    "relevance_score": "8",
    "episode_angle": "Applied computer vision, image generation infra",
    "linkedin_url": "https://fr.linkedin.com/in/eliotandres",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Co-founder and CTO at Photoroom.",
    "linkedin_evidence_url": "https://fr.linkedin.com/in/eliotandres",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "47",
    "ligue": "Ligue 1",
    "name": "Julien Launay",
    "primary_org": "Adaptive ML",
    "category": "RLOps / evals",
    "relevance_score": "8",
    "episode_angle": "RLOps, custom enterprise models, evals/judges",
    "linkedin_url": "https://www.linkedin.com/in/julienlaunay",
    "linkedin_followers": "5000",
    "linkedin_confidence": "high",
    "linkedin_note": "Cofounder & CEO at Adaptive ML.",
    "linkedin_evidence_url": "https://www.linkedin.com/in/julienlaunay",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "48",
    "ligue": "Ligue 1",
    "name": "Baptiste Pannier",
    "primary_org": "Adaptive ML",
    "category": "RLOps engineering",
    "relevance_score": "8",
    "episode_angle": "Technical side of RL fine-tuning and specialized LLMs",
    "linkedin_url": "https://fr.linkedin.com/in/baptiste-pannier-b30758154",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Cofounder & CTO at Adaptive ML.",
    "linkedin_evidence_url": "https://fr.linkedin.com/in/baptiste-pannier-b30758154",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "49",
    "ligue": "Ligue 1",
    "name": "Jean-Philippe Aumasson",
    "primary_org": "cryptography/security",
    "category": "AI security",
    "relevance_score": "8",
    "episode_angle": "AI security, model-weight protection, cryptographic infra",
    "linkedin_url": "https://ch.linkedin.com/in/aumasson",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Cryptography expert and CSO.",
    "linkedin_evidence_url": "https://ch.linkedin.com/in/aumasson",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "50",
    "ligue": "Ligue 1",
    "name": "Baptiste Robert",
    "primary_org": "Predicta Lab / fs0c131y",
    "category": "cybersecurity",
    "relevance_score": "8",
    "episode_angle": "Offensive security, supply chain, prompt-injection/security angle",
    "linkedin_url": "https://fr.linkedin.com/in/baptisterobert",
    "linkedin_followers": "",
    "linkedin_confidence": "high",
    "linkedin_note": "Security researcher known as fs0c131y and CEO of Predicta Lab.",
    "linkedin_evidence_url": "https://fr.linkedin.com/in/baptisterobert",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "51",
    "ligue": "Ligue 3",
    "name": "Xavier Niel",
    "primary_org": "Iliad / Station F / Kyutai",
    "category": "AI ecosystem / compute",
    "relevance_score": "7",
    "episode_angle": "Funding French AI labs, compute access, Station F ecosystem, Kyutai",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "52",
    "ligue": "Ligue 3",
    "name": "Octave Klaba",
    "primary_org": "OVHcloud",
    "category": "cloud / sovereignty",
    "relevance_score": "8",
    "episode_angle": "European cloud, sovereign AI infrastructure, datacenters",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "53",
    "ligue": "Ligue 3",
    "name": "Cédric O",
    "primary_org": "Mistral AI adviser / ex-government",
    "category": "AI policy / ecosystem",
    "relevance_score": "7",
    "episode_angle": "French AI policy, financing, sovereignty and startup scaling",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "54",
    "ligue": "Ligue 3",
    "name": "Cédric Villani",
    "primary_org": "Mathematician / ex-MP",
    "category": "AI policy / research",
    "relevance_score": "7",
    "episode_angle": "AI strategy for France, math culture, public research",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "55",
    "ligue": "Ligue 3",
    "name": "Luc Julia",
    "primary_org": "Renault / ex-Siri",
    "category": "AI product",
    "relevance_score": "7",
    "episode_angle": "Voice assistants, realistic AI product constraints, edge AI",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "56",
    "ligue": "Ligue 2",
    "name": "Roxanne Varza",
    "primary_org": "Station F",
    "category": "startup ecosystem",
    "relevance_score": "7",
    "episode_angle": "AI startup ecosystem, founder sourcing and scaling in France",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "57",
    "ligue": "Ligue 3",
    "name": "Fleur Pellerin",
    "primary_org": "Korelya Capital",
    "category": "VC / policy",
    "relevance_score": "6",
    "episode_angle": "Capital, industrial strategy, Korean/French tech bridges",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "58",
    "ligue": "Ligue 2",
    "name": "Jean-Gabriel Ganascia",
    "primary_org": "Sorbonne University",
    "category": "AI ethics",
    "relevance_score": "6",
    "episode_angle": "AI ethics, risk framing, regulation and society",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "59",
    "ligue": "Ligue 2",
    "name": "Gilles Babinet",
    "primary_org": "Digital champion / entrepreneur",
    "category": "digital policy",
    "relevance_score": "6",
    "episode_angle": "European digital sovereignty and public-sector transformation",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "60",
    "ligue": "Ligue 3",
    "name": "Marie-Laure Denis",
    "primary_org": "CNIL",
    "category": "privacy / regulation",
    "relevance_score": "7",
    "episode_angle": "AI Act, privacy engineering, data governance",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "61",
    "ligue": "Ligue 2",
    "name": "Rémi Stefanini",
    "primary_org": "CNIL",
    "category": "technical privacy / AI governance",
    "relevance_score": "8",
    "episode_angle": "Technical regulation, audits, privacy-preserving AI systems",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "62",
    "ligue": "Ligue 2",
    "name": "Samih Souissi",
    "primary_org": "ANSSI",
    "category": "cybersecurity",
    "relevance_score": "8",
    "episode_angle": "Security of AI systems, prompt injection and supply-chain risk",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "63",
    "ligue": "Ligue 2",
    "name": "Nicolas Miailhe",
    "primary_org": "The Future Society",
    "category": "AI governance",
    "relevance_score": "6",
    "episode_angle": "AI governance, standards, EU AI Act implementation",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "64",
    "ligue": "Ligue 3",
    "name": "Antoine Petit",
    "primary_org": "CNRS",
    "category": "public research",
    "relevance_score": "6",
    "episode_angle": "French public AI research, talent and industry transfer",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "65",
    "ligue": "Ligue 3",
    "name": "Jérôme Pesenti",
    "primary_org": "ex-Meta AI / Sizzle / Campus",
    "category": "AI leadership",
    "relevance_score": "7",
    "episode_angle": "Leading AI teams, productization, AI education",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "66",
    "ligue": "Ligue 3",
    "name": "Stanislas Dehaene",
    "primary_org": "Collège de France",
    "category": "cognitive science",
    "relevance_score": "6",
    "episode_angle": "Human learning, cognition and what AI can learn from neuroscience",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "67",
    "ligue": "Ligue 2",
    "name": "Pierre-Yves Oudeyer",
    "primary_org": "Inria",
    "category": "developmental robotics",
    "relevance_score": "7",
    "episode_angle": "Embodied agents, curiosity-driven learning, robotics",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "68",
    "ligue": "Ligue 2",
    "name": "Jean-Paul Laumond",
    "primary_org": "CNRS / robotics",
    "category": "robotics",
    "relevance_score": "6",
    "episode_angle": "Motion planning, robot safety and verification",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "69",
    "ligue": "Ligue 1",
    "name": "Adrien Gaidon",
    "primary_org": "Toyota Research Institute",
    "category": "computer vision / robotics",
    "relevance_score": "7",
    "episode_angle": "Autonomous systems, realistic evals, perception data",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "70",
    "ligue": "Ligue 1",
    "name": "Pierre Stock",
    "primary_org": "Google DeepMind",
    "category": "ML robustness",
    "relevance_score": "7",
    "episode_angle": "Robustness, reproducibility, model behavior",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "71",
    "ligue": "Ligue 1",
    "name": "Alexandre Sablayrolles",
    "primary_org": "Meta AI / ML research",
    "category": "ML robustness",
    "relevance_score": "7",
    "episode_angle": "Model failure modes, privacy/security and ML evaluation",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "72",
    "ligue": "Ligue 1",
    "name": "Hugo Thimonier",
    "primary_org": "Mistral AI",
    "category": "multimodal LLMs",
    "relevance_score": "7",
    "episode_angle": "Applied multimodal LLMs and tabular/anomaly ML",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "73",
    "ligue": "Ligue 1",
    "name": "Maël Nison",
    "primary_org": "Mistral AI / Yarn",
    "category": "platform engineering",
    "relevance_score": "7",
    "episode_angle": "Package managers, infra, CI/CD and AI engineering workflows",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "74",
    "ligue": "Ligue 1",
    "name": "Théophile Gervet",
    "primary_org": "Mistral AI",
    "category": "LLM research",
    "relevance_score": "7",
    "episode_angle": "LLM agents, research engineering and evaluation",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "75",
    "ligue": "Ligue 1",
    "name": "Alexandre Gramfort",
    "primary_org": "Inria / scikit-learn",
    "category": "scientific Python",
    "relevance_score": "7",
    "episode_angle": "Scientific ML, signal processing, open-source maintenance",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "76",
    "ligue": "Ligue 1",
    "name": "Bertrand Thirion",
    "primary_org": "Inria",
    "category": "ML for science",
    "relevance_score": "6",
    "episode_angle": "Neuroimaging, scientific ML, reproducibility",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "77",
    "ligue": "Ligue 2",
    "name": "Julien Mairal",
    "primary_org": "Inria",
    "category": "ML theory / optimization",
    "relevance_score": "7",
    "episode_angle": "Optimization, representation learning, robust ML",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "78",
    "ligue": "Ligue 2",
    "name": "Francis Bach",
    "primary_org": "Inria / ENS",
    "category": "ML theory",
    "relevance_score": "7",
    "episode_angle": "Optimization, kernels, statistical learning for modern AI",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "79",
    "ligue": "Ligue 3",
    "name": "Rémi Munos",
    "primary_org": "Google DeepMind",
    "category": "reinforcement learning",
    "relevance_score": "8",
    "episode_angle": "RL, planning, AlphaZero-style systems, agents",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "80",
    "ligue": "Ligue 3",
    "name": "Stéphane Mallat",
    "primary_org": "Collège de France",
    "category": "deep learning theory",
    "relevance_score": "7",
    "episode_angle": "Wavelets, scattering networks, theory of deep learning",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "81",
    "ligue": "Ligue 2",
    "name": "Gabriel Peyré",
    "primary_org": "CNRS / ENS",
    "category": "optimal transport / generative AI",
    "relevance_score": "7",
    "episode_angle": "Optimal transport, diffusion/generative models, geometry",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "82",
    "ligue": "Ligue 2",
    "name": "Isabelle Guyon",
    "primary_org": "AutoML / ChaLearn",
    "category": "AutoML / benchmarks",
    "relevance_score": "7",
    "episode_angle": "AutoML, benchmark design, reproducibility",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "83",
    "ligue": "Ligue 2",
    "name": "Cordelia Schmid",
    "primary_org": "Inria / Google Research",
    "category": "computer vision",
    "relevance_score": "7",
    "episode_angle": "Vision foundation models and research transfer",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "84",
    "ligue": "Ligue 1",
    "name": "Jean Ponce",
    "primary_org": "Inria / ENS",
    "category": "computer vision",
    "relevance_score": "6",
    "episode_angle": "Computer vision foundations and 3D understanding",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "85",
    "ligue": "Ligue 2",
    "name": "Jean-Philippe Vert",
    "primary_org": "Owkin / Google",
    "category": "bio ML",
    "relevance_score": "7",
    "episode_angle": "ML for biology, healthcare foundation models",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "86",
    "ligue": "Ligue 2",
    "name": "Karim Beguir",
    "primary_org": "InstaDeep / BioNTech",
    "category": "applied AI / RL",
    "relevance_score": "8",
    "episode_angle": "Enterprise RL, AI for biology, scaling from Africa/Europe",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "87",
    "ligue": "Ligue 1",
    "name": "Zohra Slim",
    "primary_org": "InstaDeep",
    "category": "AI startup operations",
    "relevance_score": "7",
    "episode_angle": "Scaling applied AI companies and diverse AI ecosystems",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "88",
    "ligue": "Ligue 1",
    "name": "Etienne Bernard",
    "primary_org": "NuMind",
    "category": "NLP tooling",
    "relevance_score": "7",
    "episode_angle": "Human-in-the-loop NLP, LLM-assisted data labeling",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "89",
    "ligue": "Ligue 1",
    "name": "Thomas Solignac",
    "primary_org": "Golem.ai",
    "category": "enterprise NLP",
    "relevance_score": "6",
    "episode_angle": "Symbolic/hybrid NLP for enterprise automation",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "90",
    "ligue": "Ligue 1",
    "name": "Boris Dayma",
    "primary_org": "Craiyon",
    "category": "generative image AI",
    "relevance_score": "6",
    "episode_angle": "Open generative image models and consumer AI virality",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "91",
    "ligue": "Ligue 2",
    "name": "Romain Huet",
    "primary_org": "OpenAI / ex-Stripe",
    "category": "developer relations",
    "relevance_score": "7",
    "episode_angle": "Developer platforms, APIs, OpenAI ecosystem from a French operator",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "92",
    "ligue": "Ligue 3",
    "name": "Benoît Dageville",
    "primary_org": "Snowflake",
    "category": "data cloud",
    "relevance_score": "7",
    "episode_angle": "Data cloud architecture, scaling databases for AI workloads",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "93",
    "ligue": "Ligue 3",
    "name": "Thierry Cruanes",
    "primary_org": "Snowflake",
    "category": "database systems",
    "relevance_score": "7",
    "episode_angle": "Cloud data warehouse internals and AI data infrastructure",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Moonshot: very high-profile, institutional, or likely hard to book"
  },
  {
    "rank": "94",
    "ligue": "Ligue 2",
    "name": "Nicolas Dessaigne",
    "primary_org": "Algolia",
    "category": "search / developer tools",
    "relevance_score": "7",
    "episode_angle": "Search infrastructure, developer-first SaaS, retrieval for AI",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "95",
    "ligue": "Ligue 2",
    "name": "Julien Lemoine",
    "primary_org": "Algolia",
    "category": "search engineering",
    "relevance_score": "7",
    "episode_angle": "Search systems, latency, retrieval and product engineering",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Reachable with warm intro or timely angle; senior/busy profile"
  },
  {
    "rank": "96",
    "ligue": "Ligue 1",
    "name": "Tristan Nitot",
    "primary_org": "Mozilla / Cozy Cloud",
    "category": "open web / privacy",
    "relevance_score": "6",
    "episode_angle": "Open source, privacy, web platform and AI-era user agency",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "97",
    "ligue": "Ligue 1",
    "name": "Jean-Baptiste Kempf",
    "primary_org": "VideoLAN",
    "category": "open source / media",
    "relevance_score": "6",
    "episode_angle": "Open-source governance, multimedia, codecs and AI media workflows",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "98",
    "ligue": "Ligue 1",
    "name": "Fabien Potencier",
    "primary_org": "Symfony / Blackfire",
    "category": "developer tools",
    "relevance_score": "6",
    "episode_angle": "Developer platforms, PHP ecosystem, performance and observability",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "99",
    "ligue": "Ligue 1",
    "name": "Kévin Dunglas",
    "primary_org": "API Platform / Mercure",
    "category": "developer tools",
    "relevance_score": "6",
    "episode_angle": "API design, real-time systems, web dev infrastructure",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  },
  {
    "rank": "100",
    "ligue": "Ligue 1",
    "name": "David Bessis",
    "primary_org": "Tinyclues / author",
    "category": "AI / mathematics",
    "relevance_score": "6",
    "episode_angle": "Mathematics, AI product history, thinking tools and creativity",
    "linkedin_url": "",
    "linkedin_followers": "",
    "linkedin_confidence": "not_enriched",
    "linkedin_note": "",
    "linkedin_evidence_url": "",
    "accessibility_note": "Realistic outreach target: technical/niche/operator profile likely more accessible"
  }
]

type SpeakersPaneParams = { path?: string; source?: string }

type MainState = {
  rows: SpeakerRow[]
  loading: boolean
  error: string | null
  query: string
  league: string
  category: string
  linkedin: string
  minScore: string
}

function parseCsv(text: string): SpeakerRow[] {
  const records: string[][] = []
  let row: string[] = []
  let cell = ""
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const next = text[i + 1]
    if (ch === '"') {
      if (quoted && next === '"') {
        cell += '"'
        i++
      } else quoted = !quoted
    } else if (ch === "," && !quoted) {
      row.push(cell)
      cell = ""
    } else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && next === "\n") i++
      row.push(cell)
      if (row.some((v) => v.trim())) records.push(row)
      row = []
      cell = ""
    } else cell += ch
  }
  if (cell || row.length) {
    row.push(cell)
    if (row.some((v) => v.trim())) records.push(row)
  }
  const [headers, ...data] = records
  if (!headers) return []
  return data.map((values) => {
    const item: SpeakerRow = {}
    headers.forEach((header, i) => (item[header] = values[i] ?? ""))
    return item
  })
}

function norm(value?: string) {
  return (value ?? "").toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function unique(rows: SpeakerRow[], key: string) {
  return Array.from(new Set(rows.map((r) => r[key]).filter(Boolean))).sort((a, b) => a.localeCompare(b))
}

function leagueClass(league: string) {
  if (league === "Ligue 1") return "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
  if (league === "Ligue 2") return "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300"
  return "border-zinc-500/40 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300"
}


function tierLabel(league: string) {
  if (league === "Ligue 1") return "L1 easy"
  if (league === "Ligue 2") return "L2 warm"
  if (league === "Ligue 3") return "L3 moonshot"
  return league
}

function pill(text: string, extra = "") {
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${extra}`}>{text}</span>
}

function formatFollowers(value?: string) {
  const n = Number((value ?? "").replace(/[^0-9]/g, ""))
  if (!n) return "—"
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 100) / 10}k`
  return String(n)
}

class MainPane extends React.Component<PaneProps<SpeakersPaneParams>, MainState> {
  state: MainState = {
    rows: [],
    loading: true,
    error: null,
    query: "",
    league: "all",
    category: "all",
    linkedin: "all",
    minScore: "0",
  }

  componentDidMount() { void this.load() }

  componentDidUpdate(prev: PaneProps<SpeakersPaneParams>) {
    if ((prev.params?.path || DEFAULT_CSV_PATH) !== this.path()) void this.load()
  }

  path() { return this.props.params?.path || DEFAULT_CSV_PATH }

  async load() {
    // Runtime plugin file API workspace ids vary by host. Keep the board
    // reliable by embedding the current CSV snapshot generated from
    // potential_speakers.csv. Re-run the CSV generation/update this plugin
    // when the speaker data changes.
    this.setState({ rows: EMBEDDED_ROWS, loading: false, error: null })
  }

  filteredRows() {
    const { rows, query, league, category, linkedin, minScore } = this.state
    const q = norm(query)
    const min = Number(minScore || 0)
    return rows.filter((row) => {
      const hasLinkedin = Boolean(row.linkedin_url)
      const haystack = norm([row.rank, row.ligue, row.name, row.primary_org, row.category, row.episode_angle, row.linkedin_confidence].join(" "))
      return (!q || haystack.includes(q)) &&
        (league === "all" || row.ligue === league) &&
        (category === "all" || row.category === category) &&
        (linkedin === "all" || (linkedin === "with" ? hasLinkedin : !hasLinkedin)) &&
        Number(row.relevance_score || 0) >= min
    })
  }

  render() {
    const { rows, loading, error, query, league, category, linkedin, minScore } = this.state
    const leagues = unique(rows, "ligue")
    const categories = unique(rows, "category")
    const filtered = this.filteredRows()
    const linkedinCount = rows.filter((r) => r.linkedin_url).length
    const leagueCounts = new Map<string, number>()
    rows.forEach((r) => leagueCounts.set(r.ligue, (leagueCounts.get(r.ligue) ?? 0) + 1))

    return <div className="flex h-full min-h-0 min-w-0 flex-col bg-background text-foreground">
      <div className="flex h-8 items-center gap-1 border-b border-border px-2 text-xs">
        <span className="font-medium">Speakers</span>
        <span className="max-w-[220px] truncate text-muted-foreground">{this.path()}</span>
        <div className="ml-2 flex items-center gap-1">{leagues.map((l) => <span key={l}>{pill(`${tierLabel(l)}:${leagueCounts.get(l) ?? 0}`, leagueClass(l))}</span>)}</div>
        <button className="ml-auto h-6 rounded border border-border bg-secondary px-2 text-xs" onClick={() => void this.load()} disabled={loading}>{loading ? "…" : "↻"}</button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-2">
        <div className="sticky top-0 z-20 mb-2 flex flex-wrap items-center gap-1 rounded-md border border-border bg-card/95 px-1.5 py-1 backdrop-blur">
          <input className="h-7 min-w-[180px] flex-1 rounded border border-input bg-background px-2 text-xs" placeholder="Search…" value={query} onChange={(e) => this.setState({ query: e.currentTarget.value })}/>
          <select title="Accessibility" className="h-7 w-[116px] rounded border border-input bg-background px-1 text-xs" value={league} onChange={(e) => this.setState({ league: e.currentTarget.value })}><option value="all">Access</option>{leagues.map((l) => <option key={l} value={l}>{tierLabel(l)}</option>)}</select>
          <select title="Category" className="h-7 w-[150px] rounded border border-input bg-background px-1 text-xs" value={category} onChange={(e) => this.setState({ category: e.currentTarget.value })}><option value="all">Categories</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select>
          <select title="LinkedIn status" className="h-7 w-[108px] rounded border border-input bg-background px-1 text-xs" value={linkedin} onChange={(e) => this.setState({ linkedin: e.currentTarget.value })}><option value="all">LinkedIn</option><option value="with">Has LI</option><option value="without">No LI</option></select>
          <label className="flex h-7 items-center gap-1 rounded border border-input bg-background px-1.5 text-xs text-muted-foreground">≥{minScore}<input className="w-16" type="range" min="0" max="10" step="1" value={minScore} onChange={(e) => this.setState({ minScore: e.currentTarget.value })}/></label>
          <span className="ml-auto text-xs text-muted-foreground">{filtered.length}/{rows.length}</span>
          <span className="text-xs text-muted-foreground">LI {linkedinCount}</span>
          {error && <span className="text-xs text-destructive">CSV error: {error}</span>}
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card"><div className="overflow-auto"><table className="w-full min-w-[1100px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-muted/95"><tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground"><th className="px-3 py-2">#</th><th className="px-3 py-2">Access</th><th className="px-3 py-2">Person</th><th className="px-3 py-2">Org</th><th className="px-3 py-2">Category</th><th className="px-3 py-2">Score</th><th className="px-3 py-2">Episode angle</th><th className="px-3 py-2">Followers</th><th className="px-3 py-2">LinkedIn</th></tr></thead>
          <tbody>{filtered.map((row) => <tr key={`${row.rank}-${row.name}`} className="border-b border-border/70 hover:bg-muted/50"><td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-muted-foreground">{row.rank}</td><td className="whitespace-nowrap px-3 py-2">{pill(tierLabel(row.ligue), leagueClass(row.ligue))}</td><td className="px-3 py-2 font-medium" title={row.accessibility_note}>{row.name}</td><td className="px-3 py-2 text-muted-foreground">{row.primary_org}</td><td className="px-3 py-2">{pill(row.category, "border-border")}</td><td className="px-3 py-2 font-mono">{row.relevance_score}</td><td className="max-w-[520px] px-3 py-2 text-muted-foreground">{row.episode_angle}</td><td className="whitespace-nowrap px-3 py-2 font-mono" title={row.linkedin_followers ? "LinkedIn followers" : "Follower count not enriched yet"}>{formatFollowers(row.linkedin_followers)}</td><td className="whitespace-nowrap px-3 py-2">{row.linkedin_url ? <a className="text-primary underline underline-offset-2" title={row.linkedin_note || `Match confidence: ${row.linkedin_confidence || "unknown"}`} href={row.linkedin_url} target="_blank" rel="noreferrer">Open</a> : <span className="text-muted-foreground" title={row.linkedin_note || "No LinkedIn profile enriched"}>—</span>}</td></tr>)}</tbody>
        </table>{!loading && filtered.length === 0 && <div className="p-8 text-center text-muted-foreground">No speakers match the filters.</div>}</div></div>
      </div>
    </div>
  }
}

class LeftPane extends React.Component<PaneProps> {
  open = () => this.props.containerApi.addPanel({
    id: `speakers-viz:${DEFAULT_CSV_PATH}`,
    component: MAIN_PANEL_ID,
    title: "Speaker board",
    params: { path: DEFAULT_CSV_PATH, source: "left-tab" },
  })
  render() {
    return <div className="flex h-full min-h-0 min-w-0 flex-col bg-background text-foreground"><div className="border-b border-border/60 px-3 py-2"><div className="text-sm font-medium">Speaker board</div><div className="text-xs text-muted-foreground">100 podcast guests</div></div><div className="p-3"><button className="w-full rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground" onClick={this.open}>Open board</button></div></div>
  }
}

export default definePlugin({
  id: "speakers-viz",
  label: "Speakers Viz",
  panels: [
    { id: MAIN_PANEL_ID, label: "Speaker board", component: MainPane },
    { id: LEFT_PANEL_ID, label: "Speakers", component: LeftPane },
  ],
  commands: [{ id: "speakers-viz.open", title: "Open Speaker Board", panelId: MAIN_PANEL_ID }],
  leftTabs: [{ id: "speakers-viz.tab", title: "Speakers", panelId: LEFT_PANEL_ID }],
  surfaceResolvers: [{
    id: "speakers-viz.csv-surface",
    kind: WORKSPACE_OPEN_PATH_SURFACE_KIND,
    source: "app",
    resolve(request) {
      const path = request.target
      if (typeof path !== "string") return null
      if (!path.endsWith("potential_speakers.csv")) return null
      return {
        component: MAIN_PANEL_ID,
        id: `speakers-viz:${path}`,
        title: "Speaker board",
        params: { path },
        score: 1000,
      }
    },
  }],
})
