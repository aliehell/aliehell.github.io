function loadMD(mk_file, parent_id)
{
    var converter = new showdown.Converter({
            noHeaderId:true,
            tables:true, 
            tasklists:true
        });

    // Declare extension
    var customClassExt = {
        type: 'output',
        filter: function (text) {
            return text
                // Add class for list (ol, ul)
                .replace(/<p>\[\.([a-z0-9A-Z\s\-]+)\]<\/p>[\n]?<(.+)>/g, `<$2 class="$1">`)

                // Add class for other blocks
                .replace(/<(.+)>\[\.([a-z0-9A-Z\s\-]+)\]/g, `<$1 class="$2">`)
                
                // Prevent class name with 2 dashs being replace by `<em>` tag
                .replace(/class="(.+)"/g, function (str) {
                    if (str.indexOf("<em>") !== -1) {
                        return str.replace(/<[/]?em>/g, '_');
                    }
                    return str;
                });
        }
    };
    // Add extension to converter
    converter.addExtension(customClassExt);

    fetch(mk_file)
        .then((res) => res.text())
        .then((text) => {
            var html = converter.makeHtml(text);
        
            var node = document.getElementById(parent_id);
            node.innerHTML = html;
        }).catch((e) => console.error(e));
}