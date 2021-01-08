import { find } from 'lodash';

export default {
  getAssetUrl(assetName: string) {
    var baseUrl = 'public/plugins/novatec-sdg-panel';
    return baseUrl + '/assets/' + assetName;
  },

  getTypeSymbol(type: any, externalIcons: any, resolveName = true) {
    if (!type) {
      return this.getAssetUrl('default.png');
    }

    if (!resolveName) {
      return this.getAssetUrl(type);
    }

    const icon = find(externalIcons, icon => icon.pattern.toLowerCase() === type.toLowerCase());

    if (icon !== undefined) {
      return this.getAssetUrl(icon.filename + '.png');
    } else {
      return this.getAssetUrl('default.png');
    }
  },
};
