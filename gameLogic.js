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

let specialPages = [
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
            manageImage('print','top','./assets/obelisk.png');
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
        pageObject: castRunes, 
        action: function() {
            manageImage('print','top','./assets/runes.png')
        }
    },
    {
        pageObject: readRunes, 
        action: function() {
            manageImage('print','top','./assets/runes.png')
            if (visited.includes('obelisk') === true && visited.includes('inventory') === true && visited.includes('finishCandleAnte') === true && visited.includes('readRunes') === true) {
                actionFinishedAnte();
            }
        }
    },
    {
        pageObject: CandleAnte, 
        action: function() {
            manageImage('print','top','./assets/candles.png')
            if (visited.includes('obelisk') === true && visited.includes('inventory') === true && visited.includes('finishCandleAnte') === true && visited.includes('readRunes') === true) {
                actionFinishedAnte();
            }
        }
    },
    {
        pageObject: finishCandleAnte, 
        action: function() {
            manageImage('print','top','./assets/candles.png')
        }
    },
    {
        pageObject: Lines, 
        action: function() {
            manageImage('print','top','./assets/chalk.png');
        }
    },
    {
        pageObject: Wands, 
        action: function() {
            manageImage('print','top','./assets/wand.png');
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
            if (visited.includes('lost')) {
                failDoubtVariableText + 'not when I lost myself in the darkness, '
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
        pageObject: 'object', 
        action: function() {

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
        if (current === specialPages[i].pageObject) {
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
            {
                pageObject: lost,
                change: [3,'+']
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