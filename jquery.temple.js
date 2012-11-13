(function() {

//exit where there is no $ (jQuery or Zepto)
if (typeof $ === 'undefined') {
	return;
}

//used for actual templating when the node is a leaf node
$.fn.templeLeaf = function(propValue, propName, currentStash) {

    var typeOfPropValue = typeof propValue;

    switch(typeOfPropValue) {

		//when value is a primitive (string and number are assumed to be easily
		//convertible to text) just put the value in the node with the default
		//way (depending on the node type)
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
			//if we need to use HTML
            if (htmlContainer.length) {
				htmlContainer.empty().html( propValue );
				//newly created stash might complain data-templ
				//attribs, then they might want to attempt
				//to be templated
				currentStash && htmlContainer.children().temple(currentStash);

                //short circuit to avoid doing both html and text
                return;
            }

			//defaults to text
			//uses value for input types
            if (propName) {
                textContainer = textContainer.filter('[data-templ~="'+propName+'"]');
            }
            textContainer.each(function(i, node) {
            	switch ( node.nodeName ) {

					case 'INPUT':
					case 'TEXTAREA':
						$(node).val( propValue );
					break;

					default:
						$(node).text( propValue )
					break;
            	}
            });

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

};

//used on a root node, traverses the tree looking for nodes to template
$.fn.temple = function(stash, stencil) {
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
            	if (typeof stencil === 'undefined' || !stencil.length) {
                	stencil = $node.children().eq(0);
                }
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

};

//very simple comparator used by compareArrays
function compareSimple(a, b) {
    return a==b;
}

//compareArrays will return an object with optimal, necessary transformations
//to make array1 like array2
function compareArrays(current, changed) {

    'use strict';

    var ret = {
        deleted: [],
        moved: [],
        added: []
    }

    //copy
    current = current.slice();
    changed = changed.slice();

    //find missing
    var i=0, l=current.length, j=0, k=changed.length,
        missing = [], used = new Array(k), foundInChanged;
    for (;i<l;i++) {
        if ( current[i]!=null && changed[i]!=null && compareSimple(current[i], changed[i]) ) {
            used[i] = true;
            continue;
        }
        else {
            missing.push(i);
        }
    }

    //find which missing are definitely not moved and emit delete
    i=0;l=missing.length;
    for (;i<l;i++) {
        foundInChanged = false;
        for (j=0;j<k;j++) {
            //if this element can be found in changed, but the index is different
            //treat is as moved and mark the slot as used
            if ( current[missing[i]]!=null && changed[j]!=null && compareSimple(current[missing[i]], changed[j]) && !used[j]) {
                used[j] = true;
                foundInChanged = true;
                break;
            }
        }
        if ( !foundInChanged ) {
            ret.deleted.push( missing[i] );
        }
    }

    //delete
    i=0;l=ret.deleted.length;
    for (;i<l;i++) {
        current.splice(ret.deleted[i], 1);
    }

    //things may look like they were moved because new things were inserted
    //calculate the insertions first, maybe it will not looked moved anymore

    //on the other hand it's hard to calculate insertion points when changed is still
    //not aligned with current, because things were not moved yet
    i=0;l=used.length;
    for (;i<l;i++) {
        if ( !used[i] ) {
            ret.added.push(i);
        }
    }

    //add
    i=0;l=ret.added.length;
    for (;i<l;i++) {
        current.splice(ret.added[i], 0, changed[ret.added[i]]);
    }

    //loop over changed and find things not aligned with current
    i=0;l=changed.length;
    for (;i<l;i++) {
        if (changed[i]!=null && current[i]!=null && !compareSimple(current[i], changed[i]) ) {
        current.splice(i, 0, changed[i]);
        ret.moved.push(i);
        }
    }


    return ret;

};
})();
