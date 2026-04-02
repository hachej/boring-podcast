# Une librairie LLM attaquée vole tous les credentials? - Show Notes

# Une librairie LLM attaquée vole tous les credentials?

## Episode Summary

Dans cet épisode, l'équipe discute des dernières actualités de l'écosystème AI avec Alexis, notamment la récente attaque par chaîne d'approvisionnement sur LightLLM qui a exfiltré les clés API des utilisateurs. Ils explorent également l'évolution rapide des fonctionnalités d'Anthropic Claude, les limites actuelles des agents IA en production, et débattent de l'avenir de l'orchestration autonome des agents. Une conversation franche sur les défis réels de mise en production des systèmes IA et les risques de sécurité émergents.

## Key Topics Discussed

- **Attaque de sécurité sur LightLLM** - Compromission du mainteneur et injection de code malveillant exfiltrant les variables d'environnement et clés API
- **Nouvelles fonctionnalités Anthropic Claude** - Scheduler pour Claude Code, automatisation de tâches récurrentes, remplacement d'infrastructures Airflow
- **Défis de production des agents IA** - Les 5-10% de cas limites difficiles à gérer, problèmes de debugging, edge cases complexes
- **ArcAGI 3 benchmark** - Nouvelle version de puzzles où les modèles IA obtiennent 0% vs 99% pour les humains, démontrant les limites du raisonnement
- **Orchestration et refresh rate des agents** - Questions autour de la fréquence d'exécution optimale des agents autonomes
- **Stratégie OpenAI vs Anthropic** - Analyse critique des multiples initiatives d'OpenAI et focus produit d'Anthropic
- **Fine-tuning et spécialisation** - Tendance des entreprises à créer des modèles spécialisés pour leurs cas d'usage (call centers, etc.)
- **Stack Overflow pour agents IA** - Proposition de protocole Mozilla pour partager les solutions entre agents
- **Risques de skill poisoning** - Dangers potentiels de partage de compétences malveillantes entre agents

## Notable Quotes

> "Opérationnellement, je pense qu'il n'y a pas un jour où il n'y a pas quelqu'un qui annonce quelque chose. Aujourd'hui, j'essaie de regarder moins ce qui se passe ailleurs et je reste principalement sur la roadmap d'Anthropic."

> "C'est l'impression que j'ai, que tout ce qui est hard-codé, ça a de moins en moins de sens... C'est un peu le N8N de 2026."

> "Je pense que c'est ce qui nous reste, ces 5-10%. C'est comprendre les choses. Il leur manque le bon sens. C'est tellement cool de voir ça."

> "Peut-être que l'hallucination, c'est pas une feature qu'on sous-estime? On essaie tellement de les concentrer, de les bloquer dans nos canvas de workflow..."

## Resources/Links Mentioned

- **Claude Code** - Scheduler et nouvelles fonctionnalités d'automatisation
- **LightLLM** - Wrapper Python pour providers LLM (victime d'attaque de sécurité)
- **ArcAGI 3** - Nouveau benchmark de raisonnement par François Chollet
- **Mistral VoxTail** - Modèle Text-to-Speech OpenWeight (4 milliards de paramètres)
- **Stack Overflow for AI Coding Agents** - Protocole proposé par Mozilla
- **DSPY** - Framework utilisant LightLLM
- **Artifactory** - Solution de gestion de dépendances pour entreprises

## Guest Bio

**Alexis** - Praticien de l'IA engineering qui a participé à plusieurs épisodes du podcast. Il travaille sur l'intégration de solutions IA en entreprise, notamment avec Claude Code, et a une expérience significative dans l'automatisation de workflows et la gestion d'agents en production. Il partage régulièrement ses retours d'expérience sur les défis pratiques de mise en production de systèmes IA.

---

*Note: Cet épisode contient des informations critiques sur la sécurité des dépendances IA - essentiel pour tout développeur utilisant des librairies comme LightLLM.*