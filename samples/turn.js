const circle = 2 * Math.PI
const halfCircle = Math.PI
const toDegrees = 360 / circle

const stone = Tagger.getByTag("stone");
for (let token of stone) {
  target = closest(token.object)
  turn(token.object, target)
}

function closest(turner) {
  const tokens = Tagger.getByTag("PC");
  let closestTarget = null
  let closestDistance = -1
  for (let token of tokens) {
    let dist = canvas.grid.measureDistance(turner, token);
    if (closestDistance < 0 || dist < closestDistance) {
      closestTarget = token
      closestDistance = dist
    }
  }
  return closestTarget
}


function turn(turner, target) {
  // angle is calculated between centers of tokens, using math
  let rotationTowards = Math.atan2(target.center.y - turner.center.y, target.center.x - turner.center.x)
  // adding 90° because JS and Foundry use different axes
  rotationTowards += circle / 4
  // adding 180° to make turner look towards the target instead of away
  rotationTowards += halfCircle
  // increasing/decreasing by 360° to make sure it's the closest rotation to the current one
  const currentRotation = turner.icon.rotation
  while (rotationTowards > currentRotation + halfCircle) rotationTowards -= circle
  while (rotationTowards < currentRotation - halfCircle) rotationTowards += circle
  // animation!
  const maxDuration = 500
  const duration = maxDuration * Math.abs(rotationTowards - currentRotation) / circle
  // (locking to prevent refresh on hover)
  turner.data.locked = true
  CanvasAnimation.animateLinear(
    [{parent: turner.icon, attribute: 'rotation', to: rotationTowards},],
    {name: `Token.${turner.id}.turnToFace`, context: turner, duration: duration})
    .then(() => {
      // when animation is done we'll update the data
      return turner.update({'rotation': rotationTowards * toDegrees})
    })
    .then(() => {
      // (unlocking))
      turner.data.locked = false
    })
}