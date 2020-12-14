import { find } from 'lodash';

export default {

    getAssetUrl(assetName: string) {
        //TODO: Fix this with something like this.panel.type
       var baseUrl = 'public/plugins/' + 'novatec-sdg-panel';
       return baseUrl + '/assets/' + assetName;
   },
   
    getTypeSymbol(type: any, resolveName = true) {
       if (!type) {
           return this.getAssetUrl('default.png');
       }
   
       if (!resolveName) {
           return this.getAssetUrl(type);
       }
   
       const { externalIcons } = this.getSettings();
   
       const icon = find(externalIcons, icon => icon.name.toLowerCase() === type.toLowerCase());
   
       if (icon !== undefined) {
           return this.getAssetUrl(icon.filename + '.png');
       } else {
           return this.getAssetUrl('default.png');
       }
   }
}