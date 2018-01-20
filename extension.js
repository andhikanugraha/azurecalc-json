var SERVICES_KEY = 'azure_calculator_modules_v3';
var CURRENCY_KEY = 'acomuser.currency';

function createButtonElement(label, onclick) {
    var button = document.createElement('button');
    button.className = 'calculator-button';
    button.innerText = label;
    button.addEventListener('click', function(e) {
        e.preventDefault();
        onclick(e);
    });

    return button;
}

function createDivElement(headerText, descriptionText) {
    var div = document.createElement('div');
    div.className = 'row column estimate-holder';
    var header = document.createElement('h3');
    header.className = 'text-heading4';
    header.innerText = headerText;
    var p = document.createElement('p');
    p.innerText = descriptionText;

    div.appendChild(header);
    div.appendChild(p);

    return div;
}

function createDivElementForDivide() {
    var div = document.createElement('div');
    div.style = 'width: 10px; height:auto; display:inline-block;'

    return div;
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

function init (evt) {
    var DomSelector = '#azure-calculator';
    var divImportExport = createDivElement('Import/Export estimate to JSON', 'The web\
        extension for importing and exporting estimates from Azure Pricing Calculator is enabled, this box is not part \
        of the official Microsoft Pricing Calculator tool. "Import JSON" will allow you to load previously exported \
        data into the tool, discarding the existing one. If you want to export your current estimate, use the \
        "Export JSON" button and select download location.');
    var buttonImport = createButtonElement('Import JSON', triggerImportJSON);
    var buttonExport = createButtonElement('Export JSON', triggerExportJSON);
    var dividerSpace = createDivElementForDivide();
    var targetSection = document.querySelector(DomSelector);          
    divImportExport.appendChild(buttonImport);
    divImportExport.appendChild(dividerSpace);
    divImportExport.appendChild(buttonExport);
    targetSection.insertBefore(divImportExport, section.childNodes[0]);
}

init();