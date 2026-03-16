const Vibrant = require('node-vibrant');

Vibrant.from('c:/React/react nov/project1/src/K-Beauty/assets/Mainlogo.png')
    .getPalette()
    .then(palette => {
        console.log('Vibrant:', palette.Vibrant ? palette.Vibrant.hex : null);
        console.log('DarkVibrant:', palette.DarkVibrant ? palette.DarkVibrant.hex : null);
        console.log('LightVibrant:', palette.LightVibrant ? palette.LightVibrant.hex : null);
        console.log('Muted:', palette.Muted ? palette.Muted.hex : null);
    })
    .catch(console.error);
