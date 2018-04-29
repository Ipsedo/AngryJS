# AngryJS

BERRIEN Samuel
PENUCHOT Jules

## Présentation générale du projet

Le projet est une réplique du jeu Angry Birds en JavaScript, destiné à être utilisé dans un navigateur internet.

Voici le détail de la structure du jeu :

```
controls.js     - Gestion des contrôles
entity.js       - Définition des entités
explosion.js    - Gestion des explosions
game.js         - Mécaniques du jeu (gameplay)
level_loader.js - Chargement des niveaux
physics.js      - Moteur physique
sprite.js       - Gestion de l'affichage
vector.js       - Algèbre vectorielle
```

Le fonctionnement du jeu est simple : des ennemis sont présents sur la map, le joueur peut leur infliger des dommages proportionnels à la force des collisions infligées pour les faire exploser à l'aide d'oiseaux en guise de projectiles et il remporte la partie dès qu'il n'y a plus d'ennemis sur la map.

## Interface

![](res/screenshot.png)

Les boutons Play/Pause et Reset permettent respectivement de mettre le jeu en pause ou le relancer lorsque la fenêtre perd le focus et de remettre le niveau à zéro pour relancer la partie.

Le sélecteur Level permet de parcourir les niveaux stockés dans `res/levels`.

## Fonctionnalités

Le moteur du jeu permet de créer des niveaux totalement sur mesure et d'ajuster énormément de paramètres pour chaque objet tels que :

- Ses attributs relatifs au jeu (ennemi ou non, son nom, sa vie de départ...)
- Son sprite (le cas échéant sa couleur)
- Ses attributs physiques (masse, taille de la hitbox, vitesse de départ,  etc.)

Ce choix permet d'avoir un moteur de jeu dont le code sera très peu amené à changer et dont les niveaux peuvent être très variables pour proposer une large variété de gameplays différents.

En plus des entités (corps, ennemis etc.), les fichiers de niveau stockent également les munitions mises à disposition du joueur pour remporter la partie.
