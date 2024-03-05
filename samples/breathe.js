const circle = 2 * Math.PI
const halfCircle = Math.PI
const toDegrees = 360 / circle

function parseLabel(token) {
  let color = ""
  let tags = Tagger.getTags(token);
  for (let tag of tags ) {
    if (tag.includes("color")) {
      color = tag.split(":")[1]
    }
  }
  return color
}

async function spawnTemplate(token, color) {
  let direction = (token.object.icon.rotation + (circle/4)) * toDegrees
  let templateData = {
    t: "ray",
    user: game.user._id,
    x: token.center.x,
    y: token.center.y,
    direction: direction,
    distance: 100,
    width: 5,
    borderColor: "#000000",
    fillColor: color,
    tags: ["test"]
  };
  let theTemplate= await MeasuredTemplateDocument.create(templateData, {parent: canvas.scene});
  Tagger.addTags(theTemplate, "breath");
}

try{
  const trencadis = Tagger.getByTag("trencadis");
  for (let token of trencadis ) {
    color = parseLabel(token)
    spawnTemplate(token, color)
  }
}
catch(err){
  ui.notifications.error(err);
}