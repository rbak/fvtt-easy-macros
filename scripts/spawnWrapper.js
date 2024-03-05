export default class SimpleSpawner {
  static spawnActorOnPosition(actorName, x, y) {
    let token = game.actors.getName(actorName).data.token;
    token.x = x;
    token.y = y;
    Token.create(token);
  }

  static spawnActorOnObject(actorName, object) {
    return Simple.spawnActorOnPosition(actorName, object.x, object.y)
  }

  static async _spawnTokenAtLocation(protoToken, spawnPoint) {
    // Increase this offset for larger summons
    const gridSize = canvas.scene.grid.size;
    let loc = {
      x: spawnPoint.x - gridSize * (protoToken.width / 2),
      y: spawnPoint.y - gridSize * (protoToken.height / 2),
    };
    protoToken.updateSource(loc);
    return canvas.scene.createEmbeddedDocuments("Token", [protoToken]);
  }
}