/**
 * patch nodes
 *  
 * @param  {VNode}  newNode  
 * @param  {VNode}  oldNode  
 * @return {number} number
 */
function patch (newNode, oldNode) {
	var newNodeType = newNode.nodeType;
	var oldNodeType = oldNode.nodeType;

	// remove operation
	if (newNodeType === 0) { 
		return 1; 
	}
	// add operation
	else if (oldNodeType === 0) { 
		return 2;
	}
	// text operation
	else if (newNodeType === 3 && oldNodeType === 3) { 
		if (newNode.children !== oldNode.children) {
			return 3; 
		} 
	}
	// key operation
	else if (newNode.props.key !== oldNode.props.key) {
		return 5; 
	}
	// replace operation
	else if (newNode.type !== oldNode.type) {
		return 4;
	}
	// recursive
	else {
		// if _newNode and oldNode are the identical, exit early
		if (newNode !== oldNode) {		
			// extract node from possible component node
			var _newNode = newNodeType === 2 ? extractComponent(newNode) : newNode;

			// a component
			if (oldNodeType === 2) {
				var oldComponent = oldNode._owner;
				var newComponent = newNode._owner;

				// a component with shouldComponentUpdate method
				if (
					oldComponent.shouldComponentUpdate && 
					oldComponent.shouldComponentUpdate(newNode.props, newComponent.state) === false
				) {
					// exit early
					return 0;
				}

				// a component with a componentWillUpdate method
				if (oldComponent.componentWillUpdate) {
					oldComponent.componentWillUpdate(newNode.props, newComponent.state);
				}
			}

			// patch props only if oldNode is not a textNode 
			// and the props objects of the two noeds are not equal
			if (_newNode.props !== oldNode.props) {
				patchProps(_newNode, oldNode); 
			}

			// references, children & children length
			var newChildren = _newNode.children;
			var oldChildren = oldNode.children;
			var newLength   = newChildren.length;
			var oldLength   = oldChildren.length;

			// new children length is 0 clear/remove all children
			if (newLength === 0) {
				// but only if old children is not already cleared
				if (oldLength !== 0) {
					oldNode._node.textContent = '';
					oldNode.children = newChildren;
				}	
			}
			// newNode has children
			else {
				var parentNode = oldNode._node;
				var isKeyed    = false;
				var oldKeys    = null;
				var newKeys    = null;

				// for loop, the end point being which ever is the 
				// greater value between newLength and oldLength
				for (var i = 0; i < newLength || i < oldLength; i++) {
					var newChild = newChildren[i] || nodeEmpty;
					var oldChild = oldChildren[i] || nodeEmpty;
					var action   = patch(newChild, oldChild);

					// if action dispatched, 
					// 1 - remove, 2 - add, 3 - text update, 4 - replace, 5 - key
					if (action !== 0) {
						switch (action) {
							// remove operation
							case 1: {
								// remove dom node, remove old child
								removeNode(oldChildren.pop(), parentNode);

								break;
							}
							// add operation
							case 2: {
								// append dom node, push new child
								appendNode(
									oldChildren[oldChildren.length] = newChild, 
									parentNode, 
									createNode(newChild, null, null)
								);

								break;
							}
							// text operation
							case 3: {
								// replace dom node text, replace old child text
								oldChild._node.nodeValue = oldChild.children = newChild.children;

								break;
							}
							// replace operation
							case 4: {
								// replace dom node, replace old child
								replaceNode(
									oldChildren[i] = newChild, 
									oldChild, 
									parentNode, 
									createNode(newChild, null, null)
								);

								break;
							}
							// keyed operation
							case 5: {
								// register keyed children
								if (isKeyed === false) {
									isKeyed = true;
									oldKeys = {};
									newKeys = {};
								}

								var newKey = newChild.props.key;
								var oldKey = oldChild.props.key;

								// register key
								newKeys[newKey] = (newChild._index = i, newChild);
								oldKeys[oldKey] = (oldChild._index = i, oldChild);

								// padding
								if (newLength > oldLength) {
									oldChildren.splice(i, 0, nodeEmpty);
								} else if (oldLength > newLength) {
									newChildren.splice(i, 0, nodeEmpty);
								}
							}
						}
					}
				}
			}

			// reconcile keyed children
			if (isKeyed === true) {
				keyed(
					newKeys, 
					oldKeys, 
					parentNode, 
					oldNode, 
					newChildren, 
					oldChildren, 
					newLength, 
					oldLength
				);
			}

			// a component with a componentDidUpdate method
			if (oldNodeType === 2 && oldComponent.componentDidUpdate) {
				oldComponent.componentDidUpdate(newNode.props, newComponent.state);
			}
		}
	}

	return 0;
}

