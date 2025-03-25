# SPAWF boilerplate with Webpack 5

## Installation
```
npm install
```

# Developement environment
```
npm run dev
```

# Production environment
```
npm run build
```


Données:

Utilisateurs.
-- Plusieurs tâche d'annotation (différentes règles).
-- -- Chaque tâche contient plusieurs cartes à annoter.

En fonction de la tâche, l'interface est différente. Une carte, une annotation et une explication.
Chronométré.

TASK:
[
    {
        rule: 'lorem ipsum',
        items: [
            {
                card: 'images/...'
            },
            {
                card: 'images/...'
            }
        ]
    },
    {
        rule: 'lorem ipsum',
        items: [
            {
                card: 'images/...'
            },
            {
                card: 'images/...'
            }
        ]
    }
]

Avoir un state à propos du suivi des items au sein d'une tâche.
current_item

Peut être prévoir aussi un suivi sur les tâches.
current_task