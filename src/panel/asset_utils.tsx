import { find } from 'lodash';
import { IconResource } from 'types';

export default {
  getAssetUrl(assetName: string) {
    var baseUrl = 'public/plugins/novatec-sdg-panel';
    return baseUrl + '/assets/icons/' + assetName;
  },

  getTypeSymbol(type: string, externalIcons: IconResource[], resolveName = true) {
    if (!type) {
      return this.getAssetUrl('default.png');
    }

    if (!resolveName) {
      return this.getAssetUrl(type);
    }

    const icon = find(externalIcons, (icon) => icon.pattern.toLowerCase() === type.toLowerCase());

    if (icon !== undefined) {
      return this.getAssetUrl(icon.filename + '.png');
    } else {
      return this.getAssetUrl('default.png');
    }
  },
};
