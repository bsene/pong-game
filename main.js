const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.style.border = "3px solid black";
canvas.width = 500;
canvas.height = 500;

class ArreterLeJeuEvenement extends Event {

  id;
  constructor() {
    super("arreterLeJeu");
  }

  action() {
    clearInterval(this.id)
  }
}

const arreterLeJeu = new ArreterLeJeuEvenement();

document.addEventListener("arreterLeJeu", (e) => e.action())
document.addEventListener("keydown", (e) => {
  const { key } = e;

  switch (key) {
    case "ArrowDown":
      raquetteGauche.moveDown(10)
      break;
    case "ArrowUp":
      raquetteGauche.moveUp(10)
      break;
  }
});

class Raquette {
  constructor({ x, y, largeur = 10, hauteur = 100, couleur }) {
    this.x = x;
    this.y = y;
    this.largeur = largeur;
    this.hauteur = hauteur;
    this.couleur = couleur;
  }
  rendu(contexte) {
    contexte.beginPath();
    contexte.fillStyle = this.couleur;
    contexte.rect(this.x, this.y, this.largeur, this.hauteur);
    contexte.fill();
  }

  moveDown(y) {
    this.y += y
  }

  moveUp(y) {
    this.y -= y

  }
}

class RaquetteGauche extends Raquette {
  toucheLeBord() {
    return balle.x < this.x + this.largeur + balle.rayon;
  }
}

class RaquetteDroite extends Raquette {
  toucheLeBord() {
    return balle.x > this.x - balle.rayon;
  }
}

const balle = {
  x: 250, y: 250, rayon: 20, couleur: "gold",
  toucheLeMur(zone) {
    return this.x > zone.width - this.rayon || this.x < this.rayon;
  },
  rendu(contexte) {
    contexte.beginPath();
    contexte.fillStyle = this.couleur;
    contexte.ellipse(this.x, this.y, this.rayon, this.rayon, 0, 0, Math.PI * 2);
    contexte.fill();
  },
  collision(raquette) {
    const laBalleEstAuNiveauDeLaRaquette = (raquette) =>
      this.y > raquette.y && this.y < raquette.y + raquette.hauteur;
    return laBalleEstAuNiveauDeLaRaquette(raquette) && raquette.toucheLeBord();

  },
  move(direction) {
    this.x += direction.x;
    this.y += direction.y;
  }
};
const direction = {
  x: Math.random() > 0.5 ? 5 : -5, y: 0, reverseHorizontally() {
    this.x = -this.x;
  }
};

const raquetteGauche = new RaquetteGauche({
  x: 25,
  y: 200,
  couleur: "red",
});

const raquetteDroite = new RaquetteDroite({
  x: 465,
  y: 200,
  couleur: "royalblue",
});

const renduJeu = ({ balle, contexte, raquettes, zone }) => {
  const [raquetteGauche, raquetteDroite] = raquettes;
  contexte.reset();
  balle.rendu(contexte);
  raquetteDroite.rendu(contexte);
  raquetteGauche.rendu(contexte);

}



const animation = setInterval(() => {
  if (balle.toucheLeMur(canvas)) {
    arreterLeJeu.id = animation;
    document.dispatchEvent(arreterLeJeu);
  }

  if (balle.collision(raquetteGauche) || balle.collision(raquetteDroite)) {
    direction.reverseHorizontally()
  }
  renduJeu({ raquettes: [raquetteGauche, raquetteDroite], contexte: ctx, zone: canvas, balle })

  balle.move(direction)
}, 10)
