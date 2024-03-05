export default class SimpleTokens {
  static getSelected() {
    return canvas.tokens.controlled
  }

  static getTargets() {
    return Array.from(game.user.targets)
  }

  static getTokens() {
    return canvas.scene.data.tokens
  }

  static getTokensByName(name) {
    return Simple._getTokens().filter(token => token.name == name)
  }

  static getTokensById(id) {
   return Simple._getTokens().filter(token => token.id == id)
  }

  static getTokensByTag(tag) {
    // TODO: validate that only tokens are returned
   return Tagger.getByTag(tag);
  }

  static getFilteredTokens(name="", id="", tag="") {
    let tokens = undefined
    if (name) {
      tokens = Simple._getTokensByName(name)
    } else if (id) {
      tokens = Simple._getTokensById(id)
    } else if (tag) {
      tokens = Simple._getTokensByTag(tag)
    } else {
      throw "No parameter provided to getTokens" 
    }
    return tokens
  }
}