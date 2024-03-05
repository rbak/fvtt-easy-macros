static circle = 2 * Math.PI
static halfCircle = Math.PI
static toDegrees = 360 / circle

export default class SimpleTemplates {
  static spawnTemplateFrom(source, templateData) {
    templateData.direction = (token.icon.rotation + (circle/4)) * toDegrees
    templateData.x = source.center.x
    templateData.y = source.center.y
    return await MeasuredTemplateDocument.create(templateData, {parent: canvas.scene});
  }

  static spawnRay(source, distance, width=5, color="", colorName="", texture="") {
    if (colorName) {
      color = getSimpleColor(colorName) 
    }
    try {
      let templateData = {
        t: "ray",
        user: game.user._id,
        distance: distance,
        width: width,
        borderColor: color,
        fillColor: color,
        texture: texture,
        // texture: "modules/tokenmagic/fx/assets/templates/black-tone-vstrong-opacity.png",
      };
      return spawnTemplateFrom(source, templateData)
    }
    catch(err){
      ui.notifications.error(err);
    }
  }

  static getSimpleColor(colorName) {
    switch(colorName) {
      case "red":
        return "#990000"
      case "green":
        return "#009900"
      case "blue":
        return "#000099"
      default:
        return "#666666"
    } 
  }
}