/**
 * Runs callback on each member of given class.
 * Callback recieves (element, index, targetClass)
*/
export function forEachInClass(targetClass, callback) {
    let elementCollection = document.getElementsByClassName(targetClass);
    let elements = Array.from(elementCollection);
    for (let i = 0; i < elements.length; i++) {
        callback(elements[i], i, targetClass);
    }
}
export function removeClassFromAllMembers(targetClass, className) {
    forEachInClass(targetClass, (elem) => {
        elem.classList.remove(className);
    });
}
export function addClassToAllMembers(targetClass, className) {
    forEachInClass(targetClass, (elem) => {
        elem.classList.add(className);
    });
}
/**
 * Provides compressed syntax for document.getElementById("elementID").addEventListener(event, action).
*/
export function listen(elementID, event, action) {
    document.getElementById(elementID).addEventListener(event, action);
}
