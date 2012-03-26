$.fn.templ = function(stash) {
    var rootNode = this,
        childNodes = rootNode.find('[data-templ]'),
        stencil;

    for (var propName in stash) {
    
        if ( $.isArray(stash[propName]) ) {
            var stashArray = stash[propName];
            var $node = childNodes.filter('[data-templ="'+propName+'"]'),
                isCollectionNode = $node.is('ol, ul, dl, table');
            if ($node.length && isCollectionNode) {
                stencil = $node.children().eq(0);
                if (stencil.length) {
                    stencil = stencil.clone();
                    $node.empty();
                }
                stashArray.forEach(function(stashArrayElem) {
                    var $subNode = stencil.clone();
                    $subNode.templ(stashArrayElem)
                    $node.append($subNode);
                })
            }
        }
        
        else {
            childNodes
                .filter('[data-templ="'+propName+'"]')
                .text(stash[propName])
        }
        
    }
    
    return rootNode;
    
};