function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

async function strike(light) {
  let lightId = light.data._id
  await flicker(lightId, Math.floor(Math.random() * 2))
  await flash(lightId, getRandomArbitrary(0.1, 0.3), 20)
  await flicker(lightId, Math.floor(Math.random() * 5))
}

async function flicker(lightId, n) {
  for (let i = 0; i < n; i++) {
    await flash(lightId, getRandomArbitrary(0, 0.1), getRandomArbitrary(10,100))
  } 
}

async function flash(lightId, alpha, duration) {
  await updateLight(lightId, alpha)
  await new Promise(resolve => setTimeout(resolve,duration));
  await updateLight(lightId, 0)
  await new Promise(resolve => setTimeout(resolve,getRandomArbitrary(50,500)));
}

async function setupLight() {
  let lightData = {"x": 1,"y": 1, "rotation": 0, "walls": false, "vision": false, "config": {"dim": 0,"bright": 0,"angle": 0,"alpha": 0.5,"darkness": {"min": 0,"max": 1},"coloration": 1,"gradual": false,"luminosity": 0.3,"saturation": 0,"contrast": 0,"shadows": 0,"color": "#ffffff"},"hidden": false,"flags": {}}
  let luz = await canvas.scene.createEmbeddedDocuments('AmbientLight',[lightData]);
  return luz[0]
}

async function updateLight(id, alpha) {
  if (alpha) {
    await canvas.scene.updateEmbeddedDocuments("AmbientLight", [{_id:id, "config.alpha":alpha}]);
    await canvas.scene.updateEmbeddedDocuments("AmbientLight", [{_id:id, "config.bright": 1000}]);
  }
  else {
    await canvas.scene.updateEmbeddedDocuments("AmbientLight", [{_id:id, "config.bright": 0}]);
  }

}

function deleteLight(id) {
  canvas.scene.deleteEmbeddedDocuments('AmbientLight',[id])
}

async function setupSingleton(setupFunction, singletonID) {
  const tag = "singleton:" + singletonID
  let resources = Tagger.getByTag(tag);
  if (resources.length) {
    return resources[0]
  }
  let singleton = await setupFunction()
  await Tagger.addTags(singleton, tag)
  return singleton
}

async function getSingleton(singletonID) {
  const tag = "singleton:" + singletonID
  let resources = Tagger.getByTag(tag);
  if (resources.length) {
    return resources[0]
  }
  return
}

async function run(){
  await setupSingleton(setupLight, "lightning")
  var refreshId = setInterval(
      async function(){
          let light = await getSingleton("lightning")
          if (!light) {
            clearInterval(refreshId)
          }
          strike(light); 
      }, 
      10000
  );
}

try{
  run()
}
catch(err){
  ui.notifications.error(err);
}