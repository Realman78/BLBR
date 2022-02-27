const toggleAuto = document.getElementById('toggleAuto')
const textAreaEditor =  document.getElementById('textAreaEditor')
const preview = document.querySelector('.previewWrapper')
const convertButton = document.querySelector('.convertButton')
const tutorialButton = document.getElementById('tutorialButton')
const downloadButton = document.querySelector('.downloadButton')

toggleAuto.checked = true
toggleAuto.addEventListener('change',e=>{
    if (toggleAuto.checked) convert(editor.getValue())
})
convertButton.addEventListener('click', e=>{
    if (toggleAuto.checked) return;
    convert(editor.getValue())
})
tutorialButton.addEventListener('click', e=>{
    let str = `BACK=#cff8ff
![pos=center]Tutorial
This is a quick tutorial on how to use BLBR to create a simple site.
The left section is where you write the markup.
The right section is where you will find the preview of the html page you are creating. You can switch automatic conversion on and off.
If it's off, you convert by pressing the convert button.
For now, you can create:
Background for the whole page can be added, if declared: MUST be declared in the first row like this: BACK=COLOR
!Title -> !TEXT
Image is created with *LINK
*[w=50%]https://upload.wikimedia.org/wikipedia/commons/a/a1/Mallard2.jpg
Video is created with ?LINK
?[w=50%]https://www.youtube.com/watch?v=mSdGrwVdWNo
If you need a break line just type BREAK
BREAK
If you don't put any prefix, a simple paragraph will be created, such as this one.
If you need some of the reserved characters (?,!, *) as the first character in your line, just add a \\
You might have noticed that in image and video i put [w=50%]. That is styling.
![pos=center;color=white;background=cyan]Styling
After prefix, or if you dont have one then on the first place, you add [] and all your styling goes in there.
Multiple stylings are separated with ;
[pos=center]1. positioning: [pos=center/right/left]
[ml=15%]2. margin: [mr/ml/mt/mb=VALUE]
[font-s=24px]3. font size: [font-s=VALUE]
[font-w=900]4. font-weight: [font-w=VALUE]
[color=red]5. text color: [color=VALUE]
[background=cyan]6. background color: [background=VALUE]
7. width and height: [w/h=VALUE]
And that's it, for now.
[pos=right;font-w=700;font-s=20px;mr=15px]Marin Dedic`
    
    editor.setValue(str)
})
let timeout;
let oldValue = "!Title";
convert(oldValue)
editor.on("change", (cm, event)=> {
    if (!toggleAuto.checked) return;
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(()=>{
        convert(editor.getValue())
    }, 500)
});

function convert(content){
    const lines = content.split('\n')
    let html = '', Dstyle = '', Cstyle = ''
    let hasStyle = false
    let elContent = ''
    let tmpLine = ''
    for (const line of lines){
        try{
            if(lines[0] === line){
                if (line.trim().substr(0,4) === "BACK"){
                    preview.style.background = line.slice(5)
                    continue;
                }
            }
            
            if (line[1] === '[' && line.includes(']')){
                hasStyle = true;
                [Cstyle, Dstyle] = processStyling(line.substring(2, line.indexOf(']')));
            }
            switch(line[0]){
                case '!':
                    elContent = hasStyle ? line.slice(line.indexOf(']')+1) : line.slice(1)
                    html += `<div class="divPlaceholder" style="${Dstyle}">
                    <h1 style="${Cstyle}">${elContent}</h1>
                    </div>`
                    break;
                case '*':
                    tmpLine = hasStyle ? line.slice(line.indexOf(']')+1) : line.slice(1)
                    html += `<div class="divPlaceholder" style="${Dstyle}">
                    <img style="${Cstyle}" src="${tmpLine}" alt="Media not found">
                    </div>`
                    break;
                case '?':
                    tmpLine = hasStyle ? line.slice(line.indexOf(']')+1) : line
                    let source = handleVideo(tmpLine)
                    html += `<div class="divPlaceholder" style="${Dstyle}">
                    <iframe width="420" height="300"
                    src="${source}" style="${Cstyle}">
                    </iframe>
                    </div>`
                    break;
                case '\\':
                    tmpLine = hasStyle ? line.slice(line.indexOf(']')+1) : line.slice(1)
                    html += `<div class="divPlaceholder" style="${Dstyle}">
                    <p>${tmpLine}</p>
                    </div>`
                    break;
                default:
                    if (line.trim() === "BREAK"){
                        html += "</br>"
                        break;
                    }
                    if (line[0] === '[' && line.includes(']')){
                        hasStyle = true;
                        [Cstyle, Dstyle] = processStyling(line.substring(1, line.indexOf(']')));
                    }
                    tmpLine = hasStyle ? line.slice(line.indexOf(']')+1) : line
                    html += `<div class="divPlaceholder" style="${Dstyle}">
                    <p style="${Cstyle}">${tmpLine}</p>
                    </div>`
                    break;
            }
        }catch(e){
            console.log(e)
        }
        hasStyle = false
        Cstyle = Dstyle = ''
    }

    oldValue = content
    preview.innerHTML = html
}

function handleVideo(line){
    let source;
    if (line.includes('www.youtube.com')){
        source = getEmbeddedUrl(line.slice(1))
    }else{
        source = line.slice(1)
    }
    return source;
}
function processStyling(styleString){
    let Cstyle = '', Dstyle = ''
    let commands = styleString.split(';')
    for (let command of commands){
        try{
            command = command.trim()
            let eqIndex = command.indexOf('=')
            let type = command.substr(0, eqIndex)
            let val = command.slice(eqIndex+1)
            switch(type){
                case "pos":
                    Dstyle += pairs[val]
                    break;
                case "mr":
                    Cstyle += `margin-right: ${val};`
                    break;
                case "ml":
                    Cstyle += `margin-left: ${val};`
                    break;
                case "mt":
                    Dstyle += `margin-top: ${val};`
                    break;
                case "mb":
                    Dstyle += `margin-bottom: ${val};`
                    break;
                case "font-s":
                    Cstyle += `font-size: ${val};`
                    break;
                case "font-w":
                    Cstyle += `font-weight: ${val};`
                    break;
                case "color":
                    Dstyle += `color: ${val};`
                    break;
                case "background":
                    Dstyle += `background: ${val};`
                    break;
                case "w":
                    Cstyle += `width: ${val};`
                    break;
                case "h":
                    Cstyle += `height: ${val};`
                    break;
            }
        }catch(e){
            console.log(e)
        }
       
    }
    return [Cstyle, Dstyle]
}

function getEmbeddedUrl(str) {
    var res = str.split("=");
    return "https://www.youtube.com/embed/"+res[1];
}

const pairs = {
    "center": "justify-content: center;",
    "left": "justify-content: flex-start;",
    "right": "justify-content: flex-end;",
}

// window.onbeforeunload = function (e) {
//     var e = e || window.event;
//     var msg = 'Are you sure you want to leave?';

//     if (e) e.returnValue = msg;
//     return msg;
// }
downloadButton.addEventListener('click', e=>{
    let content = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        ${preview.outerHTML}
    </body>
    </html>`
    download('generated.html', content)
})

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }