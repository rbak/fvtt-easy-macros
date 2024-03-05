circle = 2 * Math.PI
toDegrees = 360 / circle

templateData = {
  t: "ray",
  user: game.user._id,
  width: 1,
  texture: "modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png",
  flags: {
    tokenmagic: {
      templateData:{
        opacity:0.8,
        preset:"Wild Magic",
        tint:null
      }
    }
  }
};

pstParams =
{
    name: "Wild Magic",
    library: "tmfx-template"
};

function direction(source, target) {
  let direction = Math.atan2(target.center.y - source.center.y, target.center.x - source.center.x)
  return (direction * toDegrees)
}

async function spawnRay(source, target) {
  try {
    templateData.distance = canvas.grid.measureDistance(source, target)
    templateData.direction = direction(source, target)
    templateData.x = source.center.x
    templateData.y = source.center.y
    let template = await MeasuredTemplateDocument.create(templateData, {parent: canvas.scene});
    TokenMagic.addFilters(canvas.templates.placeables.find((n) => n.id === template.id), TokenMagic.getPreset(pstParams))
    Tagger.addTags(template, ["source:" + source.id, "target:" + target.id, "test"])
    hookRay(template)
  }
  catch(err){
    ui.notifications.error(err);
  }
}

function spawn() {
  var sources = Tagger.getByTag("PC")
  var target = Tagger.getByTag("staff")[0];
  for (let source of sources) {
    spawnRay(source, target)
  }
}

function updateRay() {
  let template = Tagger.getByTag("test")[0]
  let source = Tagger.getByTag("PC")[0]
  let target = Tagger.getByTag("BBEG")[0]
  let templateUpdate = {
    _id: template.id,
    x: source.center.x,
    y: source.center.y,
    distance: canvas.grid.measureDistance(source, target),
    direction: direction(source, target)
  }
  canvas.scene.updateEmbeddedDocuments("MeasuredTemplate",[templateUpdate])
}

function hookRay(template) {
  template["hook"] = Hooks.on('updateToken', async (tok, updateData) => {
    let sources = Tagger.getByTag("source:" + tok.id)
    let targets = Tagger.getByTag("target:" + tok.id)
    let templates = sources.concat(targets)
    
    // hook should call turn() when the target or the turner move (change their X or Y)
    if (!(templates && (updateData.x || updateData.y)
    )) return
    
    // ui.notifications.error(`TODO - shem, you should probably update this code to use animate rather than animateMovement!`)
    // const duration = CanvasAnimation.animations[`Token.${tok.id}.animateMovement`]?.duration ?? 300
    // turn(turner, target, duration)
    updateRay(tok)
  })
}

function main() {
    spawn()
}

try {
    main()
} catch (e) {
    ui.notifications.error(e);
}