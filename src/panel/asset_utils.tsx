import { find } from 'lodash';

export default {

    getAssetUrl(assetName: string) {
        //TODO: Fix this with something like this.panel.type
       var baseUrl = 'public/plugins/novatec-sdg-panel';
       console.log(baseUrl + '/assets/' + assetName)
       return baseUrl + '/assets/' + assetName;
   },
   
    getTypeSymbol(type: any, externalIcons: any, resolveName = true) {
        console.log("type")
        console.log(type)
        console.log("externalIcons")
        console.log(externalIcons)
       if (!type) {
           return this.getAssetUrl('default.png');
       }
   
       if (!resolveName) {
           return this.getAssetUrl(type);
       }
       
       const icon = find(externalIcons, icon => icon.pattern.toLowerCase() === type.toLowerCase());
       
       console.log(icon);
       if (icon !== undefined) {
           return this.getAssetUrl(icon.filename + '.png');
       } else {
           return this.getAssetUrl('default.png');
       }
   }
}