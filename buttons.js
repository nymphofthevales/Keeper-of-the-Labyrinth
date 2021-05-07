"use strict"

let buttons = {}

for (let i=0; i<document.querySelectorAll('.button-housing').length; i++) {
    buttons[`button_${i+1}`] = document.getElementById(`button-housing-${i+1}`);
    buttons[`button_${i+1}`].addEventListener('mouseover',()=>{
        hoverOver("hover",i+1);
    });
    buttons[`button_${i+1}`].addEventListener('mouseout',()=>{
        hoverOver("clear",i+1);
    })
    buttons[`button_${i+1}`].addEventListener('mousedown',()=>{
        clickButton(i+1)
    })
    buttons[`button_${i+1}`].addEventListener('mouseup',()=>{
        hoverOver("hover",i+1)
    })
}

function hoverOver(action,number) {
    if (action === 'clear') {
        let left = document.querySelectorAll('.left-button-frame');
        let right = document.querySelectorAll('.right-button-frame');
        let middle = document.querySelectorAll('.middle-button-frame')
        for (let i = 0; i < left.length; i++) {
            left[i].style.backgroundImage = "url(\"./assets/ui/button_left_small.png\")"
            right[i].style.backgroundImage = "url(\"./assets/ui/button_right_small.png\")"
            middle[i].style.backgroundImage = "url(\"./assets/ui/button_middle_frame.png\")"
        }
    } else if (action === 'hover') {
        let middle = document.getElementById(`button-${number}-middle`);
        let right = document.getElementById(`button-${number}-right`);
        let left = document.getElementById(`button-${number}-left`);
        middle.style.backgroundImage = "url(\"./assets/ui/button_middle_hover.png\")"
        right.style.backgroundImage = 'url("./assets/ui/button_right_small_hover.png")';
        left.style.backgroundImage = 'url("./assets/ui/button_left_small_hover.png")';
    }
}

function clickButton(number) {
    let middle = document.getElementById(`button-${number}-middle`);
    let left = document.getElementById(`button-${number}-left`);
    let right = document.getElementById(`button-${number}-right`);
    middle.style.backgroundImage = "url(\"./assets/ui/button_middle_active.png\")"
    right.style.backgroundImage = 'url("./assets/ui/button_right_small_active.png")';
    left.style.backgroundImage = 'url("./assets/ui/button_left_small_active.png")';
}