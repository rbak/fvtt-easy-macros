async function spawnTemplate(token) {
  ui.notifications.notify(token.center.x);
  let templateData = {
    t: "circle",
    user: game.user._id,
    x: token.center.x,
    y: token.center.y,
    distance: 5,
    borderColor: "#000000",
    fillColor: "#ac27cd",
  };
  let theTemplate= await MeasuredTemplateDocument.create(templateData, {parent: canvas.scene});
}

try{
  const stars = Tagger.getByTag("star");
  for (let star of stars ) {
    spawnTemplate(star)
    star.delete()
  }
}
catch(err){
  ui.notifications.error(err);
}