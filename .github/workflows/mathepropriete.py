def afficher_propriete(numero):
    cas = {
        "1": "Si un point appartient à un segment et est à égale distance de ses extrémités alors ce point est le milieu du segment.",
        "2": "Si un quadrilatère est un parallélogramme alors ses diagonales se coupent en leur milieu.",
        "3": "Si A et B sont symétriques par rapport à un point O alors O est le milieu du segment [AB].",
        "4": "Si une droite est la médiatrice d'un segment alors elle coupe ce segment en son milieu.",
        "5": "Si un triangle est rectangle alors son cercle circonscrit a pour centre le milieu de son hypoténuse.",
        "6": "Si, dans un triangle, une droite passe par le milieu d'un côté et est parallèle à un deuxième côté alors elle passe par le milieu du troisième côté.",
        "7": "Si deux droites sont parallèles à une même troisième droite alors elles sont parallèles entre elles.",
        "8": "Si deux droites sont perpendiculaires à une même troisième droite alors elles sont parallèles entre elles.",
        "9": "Si un quadrilatère est un parallélogramme alors ses côtés opposés sont parallèles.",
        "10": "Si deux droites coupées par une sécante forment des angles alternes-internes de même mesure alors ces droites sont parallèles.",
        "11": "Si deux droites coupées par une sécante forment des angles correspondants de même mesure alors ces droites sont parallèles.",
        "12": "Si, dans un triangle, une droite passe par les milieux de deux côtés alors elle est parallèle au troisième côté.",
        "13": "Si deux droites sont symétriques par rapport à un point alors elles sont parallèles.",
        "14": "Réciproque du théorème de Thalès : Soient (d) et (d') deux droites sécantes en A. B et M sont deux points de (d) distincts de A. C et N sont deux points de (d') distincts de A. Si les points A, B, M d'une part et les points A, C, N d'autre part sont alignés dans le même ordre et si AM/AB = AN/AC, alors les droites (BC) et (MN) sont parallèles.",
        "15": "Si deux droites sont parallèles et si une troisième droite est perpendiculaire à l'une alors elle est perpendiculaire à l'autre.",
        "16": "Si un quadrilatère est un losange alors ses diagonales sont perpendiculaires.",
        "17": "Si un quadrilatère est un rectangle alors ses côtés consécutifs sont perpendiculaires."
    }

    return cas.get(numero, "Numéro de cas invalide. Veuillez entrer un numéro entre 1 et 17.")

if __name__ == "__main__":
    while True:
        numero = input("Entrez un numéro de cas (ou 'q' pour quitter) : ")
        if numero.lower() == 'q':
            break
        print(afficher_propriete(numero))
