import defaultExport from "tokenWrapper.js";
import defaultExport from "templateWrapper.js";
import defaultExport from "spawnWrapper.js";

static failWhenMultipleSelected = true;

static circle = 2 * Math.PI
static halfCircle = Math.PI
static toDegrees = 360 / circle

class Simple {
  /*
   * Get Objects
   */
  static getSelected() {
    return Simple._validateSingle(SimpleTokens.getSelected())
  }

  static getAllSelected() {
    return Simple._validateMultiple(SimpleTokens.getSelected())
  }

  static getTarget() {
    return Simple._validateSingle(SimpleTokens.getTargets())
  }

  static getAllTargets() {
    return Simple._validateMultiple(SimpleTokens.getTargets())
  }

  static getToken(name="", id="", tag="") {
    return Simple._validateSingle(SimpleTokens.getFilteredTokens(name=name, id=id, tag=tag))
  }

  static getTokens(name="", id="", tag="") {
    return Simple._validateMultiple(SimpleTokens.getFilteredTokens(name=name, id=id, tag=tag))
  }

  static getAllTokens() {
    Simple._validateMultiple(SimpleTokens.getTokens())
  }

  /*
   * Filter Objects
   */
  static filterRandom(objects) {
    let r = Math.floor(Math.random()*objects.length);
    return objects[r]
  }

  static filterPCs(objects) {
    return objects.filter(t => t.actor.isPC)
  }

  static filterNotPCs(objects) {
    return objects.filter(t => !t.actor.isPC)
  }

  /*
   * Select Tokens
   */
  static selectAllTokens() {
    let tokens = canvas.tokens.placeables;
    canvas.tokens.selectObjects(tokens) 
  }

  static selectToken(name) {
    let token = canvas.tokens.placeables.find(t => t.name == name);
    token.control();
  }

  static selectAdditionalToken(name) {
    let token = canvas.tokens.placeables.find(t => t.name == name);
    token.control({ releaseOthers: false });
  }

  /*
   * Update Tokens
   */
  static toggleHide(token) {
    token.update({hidden: !token.data.hidden})
  }

  static unhideAll() {
    let updates = canvas.tokens.placeables.map(token => {
      return {
        _id: token.id,
        hidden: false  
      }
    });
    canvas.tokens.updateMany(updates);
  }

  /*
   * Positioning
   */
  static pixelsToGrid(x) {
    return x / canvas.grid.size
  }

  static gridToPixels(x) {
    return x * canvas.grid.size
  } 

  static gridPosition(object) {
      return [pixelsToGrid(object.x), pixelsToGrid(object.y)]
  }

  static measureDistance(object1, object2) {
    return canvas.grid.measureDistance(object1, object2);
  }

  static closest(object, targets) {
    let closestTarget = null
    let closestDistance = -1
    for (let target of targets) {
      let dist = Simple.measureDistance(object, target)
      if (closestDistance < 0 || dist < closestDistance) {
        closestTarget = token
        closestDistance = dist
      }
    }
    return closestTarget
  }

  /*
   * Move Tokens
   */
  static moveOnGrid(token, deltaX, deltaY) {
    token.update({x: token.x + gridToPixels(deltaX),y: token.y + gridToPixels(deltaY)})
  }

  static moveToObject(mover, target) {
    mover.update({x: target.x, y: target.y})
  }

  static turnTowards(turner, target) {
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

  /*
   * Spawn Tokens
   */
  static spawnActor(actorName, target="", position=[]) {
    // TODO: add ability to set tags
    if (target) {
      return SimpleSpawner.spawnActorOnObject(actorName, target)
    } else if (position.length == 2) {
      return SimpleSpawner.spawnActorOnPosition(actorName, position[0], position[1])
    } {
      throw "No parameters passed to spawnActor"
    }
  }

  /*
   * Spawn Templates
   */

  static spawnRayTemplateFrom(source, color, distance) {
    SimpleTemplates.spawnRay(source=source, colorName=color, distance=distance)
  }

  /*
   * Chat Messages
   */
  static whisperToSelf(message) {
    ChatMessage.create({content: message, whisper: [game.user._id]})
  }

  // static whisperToSelected(message) {
  //   ChatMessage.create({content: message, whisper: [game.user._id]})
  // }
  
  static announce(message) {
    ChatMessage.create({content: message})
  }

  /*
   * Utility (Not specific to foundry)
   */
  // Randomizes an array
  static shuffle = function(xs) {
    return xs.slice(0).sort(function() {
      return .5 - Math.random();
    });
  };

  // Takes two arrays and returns one array with pairs of elements
  static zip = function(xs1, xs2) {
    let xs = [xs1, xs2]
    return xs[0].map(function(_,i) {
      return xs.map(function(x) {
        return x[i];
      });
    });
  }
  
  /*
   * Private methods
   */
  static _validateSingle(data) {
    if (controlled.length < 1) {
      throw "No objects are selected";
    }
    if (controlled.length > 1) {
      if (failWhenMultipleSelected) {
        throw "Multiple objects are selected";
      } else {
        ui.notifications.warn('Multiple objects are selected. Only one object will be used');
      }
    }
    return data[0]
  }

  static _validateMultiple(data) {
    if (controlled.length < 1) {
      ui.notifications.warn('No objects are selected');
    }
    return data
  }
} 
