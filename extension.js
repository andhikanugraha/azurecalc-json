var SERVICES_KEY = 'calculator.servicesv3';
var CURRENCY_KEY = 'acomuser.currency';

function createLinkElement(label, onclick) {
    var a = document.createElement('a');
    a.className = 'button toggle-service-picker';
    a.style.marginLeft = '30px';
    a.innerText = label;
    a.href = '#';
    a.addEventListener('click', function(e) {
        e.preventDefault();
        onclick(e);
    });

    return a;
}

function triggerExportJSON() {
    try {
        var servicesJson = window.localStorage.getItem(SERVICES_KEY);
        var servicesObj = JSON.parse(servicesJson);
        var currencyStr = window.localStorage.getItem(CURRENCY_KEY);
        var now = new Date();
        var exportedObj = {
            version: '0.1',
            createdAt: now.toISOString(),
            data: [
                {
                    key: SERVICES_KEY,
                    transform: 'JSON.stringify',
                    value: servicesObj
                },
                {
                    key: CURRENCY_KEY,
                    value: currencyStr
                }
            ]
        };
        var exportedJson = JSON.stringify(exportedObj, null, 2);
        var exportedBlob = new Blob([exportedJson]);
        var exportedBlobUrl = URL.createObjectURL(exportedBlob, {type:'application/json'});
        var fauxLink = document.createElement('a');
        fauxLink.href = exportedBlobUrl;
        fauxLink.setAttribute('download', 'export.json');
        document.body.appendChild(fauxLink);
        alert("Exporting estimate as JSON. Due to a bug, if you're using Edge, make sure to rename the file as *.json.");
        fauxLink.click();
    }
    catch (e) {
        console.error(e);
    }
}

function triggerImportJSON() {
    var input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    input.addEventListener('change', handleFileUpload);
    document.body.appendChild(input);
    input.click();
}

function handleFileUpload(e) {
    try {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            var importedJson = e.target.result;
            var importedObj = JSON.parse(importedJson);
            importedObj.data.forEach(function(entry) {
                var value = entry.value;
                if (entry.transform === 'JSON.stringify') {
                    value = JSON.stringify(value);
                }
                localStorage.setItem(entry.key, value);
            });
            alert('Import successful. Reloading the page...');
            window.location.reload();
        }
        reader.readAsText(file);
    }
    catch (e) {
        alert('Importing failed: ' + e.toString());
    }
}

function init() {
    var a1 = createLinkElement('Export JSON', triggerExportJSON);
    var a2 = createLinkElement('Import JSON', triggerImportJSON);
    var div = document.querySelector('div.service-picker .banner-content');
    div.appendChild(a1);
    div.appendChild(a2);
}

init();