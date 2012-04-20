(function($) {

$.fn.templeLeaf = function(propName, propValue, currentStash) {
    
    var typeOfPropValue = typeof propValue;
    
    switch(typeOfPropValue) {
    
        case 'string':
        case 'number':
            var htmlContainer = this.filter('[data-templ-html~="'+propName+'"]');
            
            if (htmlContainer.length) {
                var newNodes = $(propValue);
                if (newNodes.length) {
                    htmlContainer.empty().append(newNodes);
                    //newly created stash might complain data-templ
                    //attribs, then they might want to attempt
                    //to be templated
                    currentStash && newNodes.temple(currentStash);
                }
            }
            
            this
                .filter('[data-templ~="'+propName+'"]')
                .text(propValue);
        break;
        
        case 'object':
            if (propValue===null) {
                this.filter('[data-templ~="'+propName+'"]').remove();
            }
            else {
                this
                .filter('[data-templ~="'+propName+'"]')
                .attr(propValue.attr, propValue.value);
            }
        break;
        
    }
    
    return this;

}

$.fn.temple = function(stash) {
    var rootNode = this,
        dataSelector = '[data-templ], [data-templ-html]',
        stencil,
        dataNodes = rootNode
            .filter(dataSelector)
            .add( rootNode.find(dataSelector) );
        
    for (var propName in stash) {
        
        var stashProp = stash[propName];
        
        if ( $.isArray(stashProp) ) {
        
            var $node = dataNodes
                    .filter([
                    '[data-templ~="'+propName+'"]',
                    '[data-templ-html~="'+propName+'"]'
                    ].join(','));
                    
            if ($node.length) {
                stencil = $node.children().eq(0);
                if (stencil.length) {
                    stencil = stencil.clone();
                    $node.empty();
                    $node.append(stencil.hide())
                    $.each(stashProp, function(index, stashArrayElem) {
                        var $subNode = stencil.clone().show();
                        $subNode.temple(stashArrayElem)
                        $node.append($subNode);
                    });
                }
            }   
        }
        
        else {
            
            var stashCopy = $.extend({}, stash);
            
            delete stashCopy[propName];
            
            dataNodes
                .templeLeaf(propName, stashProp, stashCopy);
        }
        
    }
    
    return rootNode;

}
})($);