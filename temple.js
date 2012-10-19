(function($) {

$.fn.templeLeaf = function(propValue, propName, currentStash) {

    var typeOfPropValue = typeof propValue;

    switch(typeOfPropValue) {

        case 'string':
        case 'number':
            var htmlContainer = this,
                textContainer = this;
            //because of simple templating sometimes we want to find a node
            //that doesn't have the attribute data-templ, but in that case
            //it should only be used by text templating
            //example: $(node).templeLeaf('some text')
            //html templating must always require data-templ-html on the node
            if (propName) {
                htmlContainer = htmlContainer.filter('[data-templ-html~="'+propName+'"]');
            }
            else {
                htmlContainer = htmlContainer.filter('[data-templ-html]');
            }

            if (htmlContainer.length) {
                var newNodes = $(propValue);
                if (newNodes.length) {
                    htmlContainer.empty().append(newNodes);
                    //newly created stash might complain data-templ
                    //attribs, then they might want to attempt
                    //to be templated
                    currentStash && newNodes.temple(currentStash);
                }
                //short circuit to avoid doing both html and text
                return;
            }

            if (propName) {
                textContainer = textContainer.filter('[data-templ~="'+propName+'"]');
            }
            textContainer.text(propValue);

        break;

        case 'object':
        case 'function':
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
                    $node.append(stencil.hide());
                    $.each(stashProp, function(index, stashArrayElem) {
                        var $subNode = stencil.clone().show();
                        if (typeof stashArrayElem === 'string') {
                            //we will ignore the key here and just template it
                            //problem is it will not template the node without
                            //the key
                            $subNode.templeLeaf(stashArrayElem)
                        }

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
                .templeLeaf(stashProp, propName, stashCopy);
        }

    }

    return rootNode;

}
})($);