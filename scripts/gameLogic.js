//
//For the scoring system, tracking visited pages, and
//creating custom functionality on a per-page basis.
//

'use strict'
let visited = new Array();
function visit(current) {
    if (visited.includes(current.title) === false) {
        visited.push(current.title);
    };
};

let gameStats = {
    apathy: 0,
    cowardice: 0,
    doubt: 0,
    inventorySeen: false, //inventory
    obeliskExamined: false,//obelisk
    anteAnchored: false,//CandleAnte
    wallAnchored: false,//
    darkAnchored: false,
    ritualRunes: false,
    ritualLines: false,
    ritualWands: false,
    ritualLights: false,
    ritualBladesSuccess: false,
    ritualBladesDrowned: false,
    lostShadow: false,
    injuredHand: false,
    scornedLight: false,
    contaminatedHand: false,
    candlesUsed: 0,
}

function setGameStats() {
    //this needs to run just after the current page has been added to the visited array
    for (let i=0; i<PageInstances.length; i++) {
        for (let j=0; j<visited.length; j++) {
            if (PageInstances[i].title === visited[j]) {
                switch (PageInstances[i].title) {
                    case "" || "" || "": 
                    break;
                    case "": 
                    break;
                    case "": 
                    break;
                    case "": 
                    break;
                    case "": 
                    break;
                    case "": 
                    break;
                    case "": 
                    break;
                }
            }
        }
    }
}

function manageMusic(current) {
    switch (current.title) {
        case 'intro' && page === 0: 
            mainMusic.start('ingress',false,0);
            break;
    }
}
function printStoryImages(pageObject) {
    switch (pageObject) {
        case intro:
            if (page >= 2) {
                manageImage('print','./assets/artwork/labyrinth_gate.png','positive')
                manageImage('print','./assets/artwork/labyrinth_gate_shadow.png','negative')
            } else {
                manageImage('clear','','');
            }
            break;
        case obelisk: 
            manageImage('print','./assets/artwork/obelisk.png','positive')
            manageImage('print','./assets/artwork/obelisk_shadow.png','negative')
            break;
        case castRunes: case readRunes:
            manageImage('print','./assets/artwork/runes.png','positive')
            manageImage('print','./assets/artwork/runes_shadow.png','negative')
            break;
        case CandleAnte: case finishCandleAnte: case candleDark: case windowPlaceCandle: case darkAnotherCandle:
            manageImage('print','./assets/artwork/anchor.png','positive')
            manageImage('print','./assets/artwork/anchor_shadow.png','negative')
            break;
        case Lines:
            manageImage('print','./assets/artwork/lines.png','positive')
            manageImage('print','./assets/artwork/lines_shadow.png','negative')
            break;
        case Approach: case Rowan: case letRest:
            manageImage('print','./assets/artwork/rowan.png','positive')
            manageImage('print','./assets/artwork/rowan_shadow.png','negative')
            break;
        case Wands:
            manageImage('print','./assets/artwork/wands.png','positive')
            manageImage('print','./assets/artwork/wands_shadow.png','negative')
            break;
        case corpseContemplation:
            manageImage('print','./assets/artwork/corpses.png','positive')
            manageImage('print','./assets/artwork/corpses_shadow.png','negative')
            break;
        case darkWindow: case windowHandNode: case windowHandRight: case windowRightNode: case windowRightPush: case windowHandLeft: case windowLeftNode: case windowLeftPush: case windowWithdrawl:
            //manageImage('print','./assets/artwork/window.png','positive')
            //manageImage('print','./assets/artwork/window_shadow.png','negative')
            break;
        case mothNode: case mothLands: case mothBurns:
            manageImage('print','./assets/artwork/moth.png','positive')
            manageImage('print','./assets/artwork/moth_shadow.png','negative')
            break;
        case darkNoisesFountain:
            //manageImage('print','./assets/artwork/fountain.png','positive')
            //manageImage('print','./assets/artwork/fountain_shadow.png','negative')
            break;
        case Falling:
            manageImage('print','./assets/artwork/falling.png','positive')
            manageImage('print','./assets/artwork/falling_shadow.png','negative')
            break;
        case FallToPit: case pit: case beatRises: case scorn: case enterScorn:
            manageImage('print','./assets/artwork/pit.png','positive')
            manageImage('print','./assets/artwork/pit_shadow.png','negative')
            break;
        case Lights:
            manageImage('print','./assets/artwork/lights.png','positive')
            manageImage('print','./assets/artwork/lights_shadow.png','negative')
            break;
        case fungusCistern: case enterCistern: case echoesCistern: case Blades: case freeCistern: case tools:
            if (pageObject === fungusCistern || pageObject === enterCistern) {
                 if (page >= 1) {
                    manageImage('print','./assets/artwork/cistern.png','positive')
                    manageImage('print','./assets/artwork/cistern_shadow.png','negative')
                    }
                } else {
                    manageImage('print','./assets/artwork/cistern.png','positive')
                    manageImage('print','./assets/artwork/cistern_shadow.png','negative')
                }
            break;
        case Cut: case Apathy: case Cowardice: case Doubt:
            manageImage('print','./assets/artwork/blades.png','positive')
            manageImage('print','./assets/artwork/blades_shadow.png','negative')
            break;
        case failApathy: case failCowardice: case failDoubt: case drowningCistern: 
            if (pageObject === drowningCistern) {
                if (page <= 1){
                    manageImage('print','./assets/artwork/drowning.png','positive')
                    manageImage('print','./assets/artwork/drowning_shadow.png','negative')
                }
            } else {
                manageImage('print','./assets/artwork/drowning.png','positive')
                manageImage('print','./assets/artwork/drowning_shadow.png','negative')
            }
            break;
        case Waiting: 
            if (page >= 1) {
                manageImage('print','./assets/artwork/watching_mask.png','positive')
                manageImage('print','./assets/artwork/watching_mask_shadow.png','negative')
            }
            break;
        case Altar:
            //manageImage('print','./assets/artwork/altar.png','positive')
            //manageImage('print','./assets/artwork/altar_shadow.png','negative')
            break;
        default: manageImage('clear','','');
            break;
    }
    if (pageObject.title.slice(0,4) === 'crow') {
        manageImage('print','./assets/artwork/crow.png','positive')
        manageImage('print','./assets/artwork/crow_shadow.png','negative')
    }
}
let specialPages = [
    {
        pageObject: intro, 
        action: function() {
            if (page === 0) {
                mainMusic.start('ingress',false,0);
            }
        }
    },
    {
        pageObject: enter, 
        action: function() {
            mainMusic.fadeOut(0.5);
            setTimeout(()=>{mainMusic.start('exploration',false,0)},600)
        }
    },
    {
        pageObject: inventory, 
        action: function() {
            obelisk.removeOption('Assay your tools',inventory);
            obelisk.addOption('Toss the runes',castRunes);
            finishCandleAnte.addOption('Toss the runes',castRunes);
            if (visited.includes('obelisk') === true) {
                inventory.addOption('Light a candle',CandleAnte);
                readRunes.addOption('Light a candle',CandleAnte);
            }
            if (visited.includes('obelisk') === true && visited.includes('inventory') === true && visited.includes('finishCandleAnte') === true && visited.includes('readRunes') === true) {
                actionFinishedAnte();
            }
        }
    },
    {
        pageObject: obelisk, 
        action: function() {
            inventory.removeOption('Examine the obelisk',obelisk);
            if (visited.includes('inventory') === true) {
                obelisk.addOption('Light a candle',CandleAnte);
                readRunes.addOption('Light a candle',CandleAnte);
            }
            if (visited.includes('obelisk') === true && visited.includes('inventory') === true && visited.includes('finishCandleAnte') === true && visited.includes('readRunes') === true) {
                actionFinishedAnte();
            }
        }
    },
    {
        pageObject: readRunes, 
        action: function() {
            if (visited.includes('obelisk') === true && visited.includes('inventory') === true && visited.includes('finishCandleAnte') === true && visited.includes('readRunes') === true) {
                actionFinishedAnte();
            }
        }
    },
    {
        pageObject: CandleAnte, 
        action: function() {
            if (visited.includes('obelisk') === true && visited.includes('inventory') === true && visited.includes('finishCandleAnte') === true && visited.includes('readRunes') === true) {
                actionFinishedAnte();
            }
        }
    },
    {
        pageObject: runFleeing, 
        action: function() {
            if (visited.includes('turnFleeing')) {
                runFleeing.addOption('Check again',checkFleeing);
            } else {
                runFleeing.addOption('Turn',turnFleeing);
            };
        }
    },
    {
        pageObject: turnFleeing, 
        action: function() {
            if (visited.includes('runFleeing')) {
                turnFleeing.addOption('Continue',chamberFleeing);
            } else {
                turnFleeing.addOption('Run',runFleeing);
            }
        }
    },
    {
        pageObject: chamberFleeing, 
        action: function() {
            let lostShadow = true;
            //change outcome in ignoring and dark
        }
    },
    {
        pageObject: WatchingBlink, 
        action: function(current) {
            redirect(2000,current)
            redirect(2500,current)
        }
    },
    {
        pageObject: Cut, 
        action: function() {
            let failures = checkFailures(generateScores()).failures;
            if (failures.includes('apathyScore')) {
                Cut.removeOption('Apathy')
                Cut.removeOption('Cowardice')
                Cut.removeOption('Doubt')
                Cut.addOption('Apathy',failApathy);
                Cut.addOption('Cowardice',Cowardice);
                Cut.addOption('Doubt',Doubt);

                Cowardice.removeOption('Doubt');
                Cowardice.removeOption('Apathy');
                Doubt.removeOption('Cowardice');
                Doubt.removeOption('Apathy');
                Cowardice.addOption('Apathy',failApathy);
                Cowardice.addOption('Doubt',Doubt);
                Doubt.addOption('Apathy',failApathy);
                Doubt.addOption('Cowardice',Cowardice);
            } 
            if (failures.includes('cowardiceScore')) {
                Cut.removeOption('Cowardice');
                Cut.removeOption('Doubt');
                Cut.addOption('Cowardice',failCowardice);
                Cut.addOption('Doubt',Doubt);

                Apathy.removeOption('Doubt');
                Apathy.removeOption('Cowardice');
                Doubt.removeOption('Cowardice');
                Apathy.addOption('Cowardice',failCowardice);
                Apathy.addOption('Doubt',Doubt);
                Doubt.addOption('Cowardice',failCowardice);
            } 
            if (failures.includes('doubtScore')) {
                Cut.removeOption('Doubt');
                Cut.addOption('Doubt',failDoubt);

                Apathy.removeOption('Doubt');
                Cowardice.removeOption('Doubt');
                Apathy.addOption('Doubt',failDoubt);
                Cowardice.addOption('Doubt',failDoubt);
            };
        }
    },
    {
        pageObject: Apathy, 
        action: function() {
            if (visited.includes('Cowardice') && visited.includes('Doubt')) {
                Apathy.clearOptions();
                Apathy.addOption('Rise for air',freeCistern)
            }
            Cut.removeOption('Apathy',Apathy);
            Cowardice.removeOption('Apathy',Apathy);
            Doubt.removeOption('Apathy',Apathy);
        }
    },
    {
        pageObject: Cowardice, 
        action: function() {
            if (visited.includes('Apathy') && visited.includes('Doubt')) {
                Cowardice.clearOptions();
                Cowardice.addOption('Rise for air',freeCistern)
            }
            Cut.removeOption('Cowardice',Cowardice);
            Apathy.removeOption('Cowardice',Cowardice);
            Doubt.removeOption('Cowardice',Cowardice);
        }
    },
    {
        pageObject: Doubt, 
        action: function() {
            if (visited.includes('Cowardice') && visited.includes('Apathy')) {
                Doubt.clearOptions();
                Doubt.addOption('Rise for air',freeCistern)
            }
            Cut.removeOption('Doubt',Doubt);
            Cowardice.removeOption('Doubt',Doubt);
            Apathy.removeOption('Doubt',Doubt);
        }
    },
    {
        pageObject: failApathy, 
        action: function() {
            let failApathyVariableText = ''
            if (visited.includes('MoveOnAnte')) {
                failApathyVariableText + 'my foolish rush through the antechamber—that unreasoned lack of preparations, '
            }
            if ((visited.includes('Fleeing') === true) && (visited.includes('investigateFleeing') === false)) {
                failApathyVariableText + 'my lazy disinterest in investigating the hole of shadow, '
            }
            if (visited.includes('LeaveWall')) {
                failApathyVariableText + 'my ignorance of fixing the gap in the wall, '
            }
            if (visited.includes('MoveOnGarden')) {
                failApathyVariableText + 'my lack of care for the rowan, '
            }
            failApathy.addPage(`I've already given into her. Since the start, since ${failApathyVariableText}my apathy has dulled my senses. How could I fight her now, when she's already won?`,'give up');
        }
    },
    {
        pageObject: failCowardice, 
        action: function() {
            let failCowardiceVariableText = ''
            if ((visited.includes('Fleeing') === true) && (visited.includes(turnFleeing) === false)) {
                failCowardiceVariableText + 'my lack of ability to even <em>look</em> at whatever had been chasing me, '
            }
            if (visited.includes('Pressing')) {
                failCowardiceVariableText + 'my foolish attempt to escape my duties by pressing through the gap in the wall, '
            }
            if (visited.includes('Falling')) {
                failCowardiceVariableText + 'my fear of facing what I might see in the darkness, '
            }
            if (visited.includes('scorn')) {
                failCowardiceVariableText + 'my unwillingness to let myself dance freely and joyously to the music in the pit, '
            }
            failCowardice.addPage(`It's futile to fight her now; I know her too well. Since ${failCowardiceVariableText}I've given in to cowardice before and I'm sure I will again.`,'give up');
        }
    },
    {
        pageObject: failDoubt, 
        action: function() {
            let failDoubtVariableText = ''
            if (visited.includes('LeaveWall')) {
                failDoubtVariableText + 'not when I doubted whether it was right to fix the gap in the wall, '
            }
            if (visited.includes('')) {
                failDoubtVariableText + ', '
            }
            if (visited.includes('')) {
                failDoubtVariableText + ', '
            }
            failDoubt.addPage(`I try to scream: "Shut up! You're wrong!" But the water drowns my cries and all that escapes is empty bubbles. She's too strong. I've never been able to fight her before, ${failDoubtVariableText}so how could I defeat her now?`,'give up');
        }
    },
    {
        pageObject: Waiting, 
        action: function() {
            Cave.removeOption('Follow the dirge',Waiting);
        }
    },
    {
        pageObject: drowningCistern, 
        action: function(current) {
            if (page === 2) {
                redirect(2000,current)
            }
        }
    },
    {
        pageObject: straightDark1, 
        action: function() {
            mainMusic.start('horror',true,5);
        }
    },
    {
        pageObject: Falling, 
        action: function(current) {
            let content = ['Accidental injury','Suicidal ideation']
            sendPopup('warning',content,current,true);
            mainMusic.start('falling',true,5);
        }
    },

]
/* special page general format follows:
[
    {
        pageObject: pointer,
        action: function() {}
    },
    {page2}
]
*/
function actionFinishedAnte() {
    let anteNodes = [inventory,obelisk,finishCandleAnte,readRunes]
    for (let i = 0; i<anteNodes.length; i++) {
        anteNodes[i].clearOptions();
        anteNodes[i].addOption('Leave',LeaveAnte);
    }
}
function checkSpecialActions(current) {
    for (let i = 0; i < specialPages.length; i++) {
        //if (visited.includes(specialPages[i].pageObject.title)) {
        if (current === specialPages[i].pageObject) {
        //this doesn't work for running necessary actions from visited pages on a reload. needs to operate based on visited instead of current.
            specialPages[i].action(current);
            return true
        }
    }
}

let scoredPages = [
    {
        type: 'apathy',
        pages: [
            {
                pageObject: MoveOnAnte,
                change: [2,'+'],
            },
            {
                pageObject: LeaveAnte,
                change: [1,'-']
            },
            {
                pageObject: Fleeing,
                change: [1,'+']
            },
            {
                pageObject: investigateFleeing,
                change: [1,'-']
            },
            {
                pageObject: LeaveWall,
                change: [1,'+']
            },
            {
                pageObject: MoveOnGarden,
                change: [3,'+']
            },
        ]
    },
    {
        type: 'cowardice',
        pages: [
            {
                pageObject: Fleeing,
                change: [1,'+']
            },
            {
                pageObject: turnFleeing,
                change: [1,'-']
            },
            {
                pageObject: Pressing,
                change: [3,'+']
            },
            {
                pageObject: Falling,
                change: [1,'+']
            },
            {
                pageObject: scorn,
                change: [2,'+']
            }
        ]
    },
    {
        type: 'doubt',
        pages: [
            {
                pageObject: LeaveWall,
                change: [1,'+']
            },
        ]
    }
]
/*scored pages general format follows: 
[
    {
        type: score1,
        pages:[
            {
                pageObject: pointer, 
                change: [number,'operator']
            },
            {page2}
        ]
    },
    {score2}
]
*/
function generateScores() {
    let apathyScore = 0;
    let cowardiceScore = 0;
    let doubtScore = 0;
    for (let i=0; i<scoredPages.length; i++) {
        let pagesArray = scoredPages[i].pages;
        for (let j=0; j<pagesArray.length; j++) {
            if (visited.includes(pagesArray[j].pageObject.title)) {
                if (pagesArray[j].change[1] === '+') {
                    if (scoredPages[i].type === 'apathy') {
                        apathyScore += pagesArray[j].change[0];
                    } else if (scoredPages[i].type === 'cowardice') {
                        cowardiceScore += pagesArray[j].change[0];
                    } else if (scoredPages[i].type === 'doubt') {
                        doubtScore += pagesArray[j].change[0];
                    }
                } else if (pagesArray[j].change[1] === '-') {
                    if (scoredPages[i].type === 'apathy') {
                        apathyScore -= pagesArray[j].change[0];
                    } else if (scoredPages[i].type === 'cowardice') {
                        cowardiceScore -= pagesArray[j].change[0];
                    } else if (scoredPages[i].type === 'doubt') {
                        doubtScore -= pagesArray[j].change[0];
                    }
                }
            }
        }
    }
    return [apathyScore,cowardiceScore,doubtScore]
}
function checkFailures(scoreArray) {
    let apathyScore = scoreArray[0];
    let cowardiceScore = scoreArray[1];
    let doubtScore = scoreArray[2];
    let maximumApathy = 0;
    let maximumCowardice = 0;
    let maximumDoubt = 0;
    for (let i=0; i<scoredPages.length; i++) {
        //for every page that affects a score positively in the scoredPages array, add its value to the possible maximum used to generate the FailureThreshold value for failure.
        let pagesArray = scoredPages[i].pages;
        for (let j=0; j<pagesArray.length; j++) {
            if (pagesArray[j].change[1] === '+') {
                if (scoredPages[i].type === 'apathy') {
                    maximumApathy += pagesArray[j].change[0];
                } else if (scoredPages[i].type === 'cowardice') {
                    maximumCowardice += pagesArray[j].change[0];
                } else if (scoredPages[i].type === 'doubt') {
                    maximumDoubt += pagesArray[j].change[0];
                }
            }
        }
    }
    let generateFailureThreshold = (number) => Math.ceil(2.5*(number/5));
    let apathyFailureThreshold = generateFailureThreshold(maximumApathy);
    let cowardiceFailureThreshold = generateFailureThreshold(maximumCowardice);
    let doubtFailureThreshold = generateFailureThreshold(maximumDoubt);
    let failures = [];
    if (apathyScore >= apathyFailureThreshold) {
        failures.push('apathyScore');
    }
    if (cowardiceScore >= cowardiceFailureThreshold) {
        failures.push('cowardiceScore');
    }
    if (doubtScore >= doubtFailureThreshold) {
        failures.push('doubtScore')
    }
    return {"failures": failures,"apathy current,maximum,FailureThreshold": [apathyScore,maximumApathy,apathyFailureThreshold],"cowardice current,maximum,FailureThreshold": [cowardiceScore,maximumCowardice,cowardiceFailureThreshold],"doubt current,maximum,FailureThreshold": [doubtScore,maximumDoubt,doubtFailureThreshold]};
}