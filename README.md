## Exercice 1
    Premier essai avec Kourou sur windows
        - Kourou n'a pas l'air de fonctionner en natif sur windows.
    
    Second essai sur wsl2 (Ubuntu)
        - Installation réussi sur wsl2, après installation des packages via `npm run docker:npm:install`.
    
    L'installation suivant la doc n'est pas forcément aisée.
    En revanche dans le README.md (découvert plus tard évidement) tout y est.

## Exercice 2
    La création d'applications simples se fait facilement.
    La documentation détaille pas à pas.

    Pour utiliser le client
        Après un build lancer la commande `node ./dist/app_client.js` 
        Saisir un auteur et un message
        Retour avec le nom de l'auteur et l'ID du message
    
    Le retour de l'évènement création est le document elasticsearch créé.

## Exercice 3
    Réalisé en html 
        Fichier html html/client.html
        La code js est a l'intérieur a cause de problème cross origin
        L'auteur ne peut être vide
        Le message ne peut être vide et faire plus de 255 caractères

    Réalisé en vuejs
        Sources dans le répertoire vue
        L'auteur ne peut être vide
        Le message ne peut être vide et faire plus de 255 caractères

## Bonus
    Le mot impoli est zut
    Recherche du mot dans le message par regex
