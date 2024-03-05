const starNames = [
  "Red Star",
  "Green Star",
  "Orange Star",
  "Blue Star",
  "Yellow Star",
  "Purple Star",
]

const heros = Tagger.getByTag("Hero");
const stars = Tagger.getByTag("star");

function shuffle(xs) {
  return xs.slice(0).sort(function() {
    return .5 - Math.random();
  });
}

function zip(xs1, xs2) {
  let xs = [xs1, xs2]
  return xs[0].map(function(_,i) {
    return xs.map(function(x) {
      return x[i];
    });
  });
}

let pairs = zip(shuffle(heros), shuffle(stars))

//let dragon = Simple.getToken(name="Shattered Glass Dragon")
pairs.forEach(pair => {
  let hero = pair[0]
  let star = pair[1]
  //let starName = pair[1]
  //let star = Simple.spawnActor(starName, target=dragon)
  star.update({x:hero.x, y:hero.y})
})