(function($) {

$.fn.templeLeaf = function(propName, propValue) {
        
    if ( (typeof propValue).match(/string|number/) ) {
        this
            .filter('[data-templ="'+propName+'"]')
            .text(propValue);
        this
            .filter('[data-templ-html="'+propName+'"]')
            .html(propValue);
    }
    else {
        if ('attr' in propValue) {
            this
                .filter('[data-templ="'+propName+'"]')
                .attr(propValue.attr, propValue.value)
        }
    }
    
    return this;

}

$.fn.temple = function(stash) {
    var rootNode = this,
        dataSelector = '[data-templ], [data-templ-html]',
        dataNodes = rootNode
            .filter(dataSelector)
            .add( rootNode.find(dataSelector) ),
        stencil;
            
    for (var propName in stash) {
    
        var stashProp = stash[propName];
        
        if ( $.isArray(stashProp) ) {
        
            var $node = dataNodes.filter([
                    '[data-templ="'+propName+'"]',
                    '[data-templ-html="'+propName+'"]'
                    ].join(','));
                    
            if ($node.length) {
                stencil = $node.children().eq(0);
                if (stencil.length) {
                    stencil = stencil.clone();
                    $node.empty();
                    $.each(stashProp, function(index, stashArrayElem) {
                        var $subNode = stencil.clone();
                        $subNode.temple(stashArrayElem)
                        $node.append($subNode);
                    });
                }
            }   
        }
        
        else {
            
            dataNodes.templeLeaf(propName, stashProp);
            
        }
    }
    
    return rootNode;

}
})($);