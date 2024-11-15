const si = require('systeminformation');

si.cpu()
    .then(data => {
        console.log('CPU Information:');
        console.log('- brand: ' + data.brand);
        console.log('- cores: ' + data.cores);
        console.log('- physical cores: ' + data.physicalCores);
        console.log('...');
    })
    .catch(error => console.error(error));

si.system()
    .then(data =>{
        console.log('System Information:');
        console.log('- manufacturer: ' + data.manufacturer);
        console.log('- model: ' + data.model);
        console.log('...');
    })