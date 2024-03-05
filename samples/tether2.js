circle = 2 * Math.PI
toDegrees = 360 / circle

function getTemplateData() {
  templateData = {
    t: "ray",
    user: game.user._id,
    width: 1,
    hidden: true,
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
  }
  return templateData
}

pstParams =
{
    name: "Wild Magic",
    library: "tmfx-template"
};

function direction(source, target) {
  let direction = Math.atan2(target.y - source.center.y, target.x - source.center.x)
  return (direction * toDegrees)
}

async function spawnRay(source, target) {
  try {
    let templateData = getTemplateData()
    templateData.distance = canvas.grid.measureDistance(source, target)
    templateData.direction = direction(source, target)
    templateData.x = source.center.x
    templateData.y = source.center.y
    let template = await MeasuredTemplateDocument.create(templateData, {parent: canvas.scene});
    TokenMagic.addFilters(canvas.templates.placeables.find((n) => n.id === template.id), TokenMagic.getPreset(pstParams))
    Tagger.addTags(template, ["source:" + source.id, "tether"])
    Tagger.addTags(source, ["tether:" + template.id])
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

function updateRay(source, template) {
  let target = Tagger.getByTag("staff")[0]
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
    let templates = Tagger.getByTag("source:" + tok.id)
    if (!(templates && (updateData.x || updateData.y)
    )) return
    updateRay(tok, templates[0])
  })
}

function displayTethers(){
  let tethers = Tagger.getByTag("tether")
  for (let tether of tethers) {
    let templateUpdate = {
      _id: template.id,
      hidden: false
    }
    canvas.scene.updateEmbeddedDocuments("MeasuredTemplate",[templateUpdate])
  }
}

function hideTether(){
  let token = Simple.getSelected()
  let tags = Tagger.getTags(token)
  for (let tag of tags) {
    if (tag.includes("tether:")) {
      const tagArray = tag.split(":");
      let templateUpdate = {
        _id: tagArray[1],
        hidden: true
      }
      canvas.scene.updateEmbeddedDocuments("MeasuredTemplate",[templateUpdate])
    }
  }
}

function deleteAllTethers(){
  let tethers = Tagger.getByTag("tether")
  for (let tether of tethers) {
    let tags = Tagger.getTags(tether)
    for (let tag of tags) {
      if (tag.includes("source:")) {
        const tagArray = tag.split(":");
        let source = canvas.scene.data.tokens.filter(token => token.id == tagArray[1])
        Tagger.removeTags(source, ["tether:" + tether.id])
        canvas.scene.updateEmbeddedDocuments("MeasuredTemplate",[templateUpdate])
      }
    }
    tether.delete()
  }
}

function main() {
    spawn()
}

try {
    main()
} catch (e) {
    ui.notifications.error(e);
}