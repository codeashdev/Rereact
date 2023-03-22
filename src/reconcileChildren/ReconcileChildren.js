import { deletions } from "../renderingVariables/Vars"

//reconcile the old fibers with the new elements
export const reconcileChildren = (wipFiber, elements) => {
    let index = 0
    let oldFiber =
      wipFiber.alternate && wipFiber.alternate.child
    let prevSibling = null
  
    while (
      index < elements.length ||
      oldFiber != null
    ) {
      const element = elements[index]
      let newFiber = null
  
      const sameType =
        oldFiber &&
        element &&
        element.type == oldFiber.type
  //if the old fiber and the new element have the same type,
  //keep the DOM node and just update it with the new props
      if (sameType) {
        newFiber = {
          type: oldFiber.type,
          props: element.props,
          dom: oldFiber.dom,
          parent: wipFiber,
          alternate: oldFiber,
          effectTag: "UPDATE",
        }
      }
  // if the type is different and there is a new element,
  // create a new DOM node    
      if (element && !sameType) {
        newFiber = {
          type: element.type,
          props: element.props,
          dom: null,
          parent: wipFiber,
          alternate: null,
          effectTag: "PLACEMENT",
        }
      }
  // if the types are different and there is an old fiber, remove the old node   
      if (oldFiber && !sameType) {
        oldFiber.effectTag = "DELETION"
        deletions.push(oldFiber)
      }
  
      if (oldFiber) {
        oldFiber = oldFiber.sibling
      }
  //Add to the fiber tree setting it either as a child or as a sibling, 
  //  depending on whether it’s the first child or not.
      if (index === 0) {
        wipFiber.child = newFiber
      } else if (element) {
        prevSibling.sibling = newFiber
      }
  
      prevSibling = newFiber
      index++
    }
  }
  export default reconcileChildren;